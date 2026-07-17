import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { inflateSync } from 'node:zlib'

export const TURN_ASSET_FILENAMES = [
  'invest-idle-right.png',
  'invest-attack-right.png',
  'invest-victory.png',
  'save-idle-right.png',
  'save-attack-right.png',
  'save-victory.png',
  'consume-idle-right.png',
  'consume-attack-right.png',
  'consume-victory.png',
  'mission-idle-right.png',
  'mission-attack-right.png',
  'mission-victory.png',
  'boss-idle-left.png',
  'boss-hit-left.png',
  'boss-defeated.png',
]

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const CHANNELS_BY_COLOR_TYPE = new Map([
  [0, 1],
  [2, 3],
  [3, 1],
  [4, 2],
  [6, 4],
])

function crc32(buffer) {
  let crc = 0xffffffff
  for (const value of buffer) {
    crc ^= value
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function paethPredictor(left, above, upperLeft) {
  const prediction = left + above - upperLeft
  const leftDistance = Math.abs(prediction - left)
  const aboveDistance = Math.abs(prediction - above)
  const upperLeftDistance = Math.abs(prediction - upperLeft)
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left
  return aboveDistance <= upperLeftDistance ? above : upperLeft
}

function readPng(buffer) {
  if (!buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error('not a PNG file')
  }

  let offset = PNG_SIGNATURE.length
  let header = null
  let transparency = null
  const compressedChunks = []

  while (offset + 12 <= buffer.length) {
    const chunkStart = offset
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    const dataStart = offset + 8
    const dataEnd = dataStart + length
    if (dataEnd + 4 > buffer.length) throw new Error(`truncated ${type} chunk`)
    const data = buffer.subarray(dataStart, dataEnd)
    const expectedCrc = buffer.readUInt32BE(dataEnd)
    const actualCrc = crc32(buffer.subarray(chunkStart + 4, dataEnd))
    if (actualCrc !== expectedCrc) throw new Error(`invalid CRC for ${type} chunk`)
    offset = dataEnd + 4

    if (type === 'IHDR') {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12],
      }
    } else if (type === 'tRNS') {
      transparency = data
    } else if (type === 'IDAT') {
      compressedChunks.push(data)
    } else if (type === 'IEND') {
      break
    }
  }

  if (!header) throw new Error('missing IHDR chunk')
  if (header.bitDepth !== 8) throw new Error(`unsupported bit depth ${header.bitDepth}`)
  if (header.compression !== 0 || header.filter !== 0 || header.interlace !== 0) {
    throw new Error('only non-interlaced standard PNG files are supported')
  }

  const channels = CHANNELS_BY_COLOR_TYPE.get(header.colorType)
  if (!channels) throw new Error(`unsupported color type ${header.colorType}`)

  const stride = header.width * channels
  const inflated = inflateSync(Buffer.concat(compressedChunks))
  const expectedLength = (stride + 1) * header.height
  if (inflated.length !== expectedLength) {
    throw new Error(`unexpected pixel data length ${inflated.length}; expected ${expectedLength}`)
  }

  const rows = []
  let inputOffset = 0
  let previousRow = Buffer.alloc(stride)

  for (let y = 0; y < header.height; y += 1) {
    const filterType = inflated[inputOffset]
    inputOffset += 1
    const row = Buffer.alloc(stride)

    for (let index = 0; index < stride; index += 1) {
      const raw = inflated[inputOffset]
      inputOffset += 1
      const left = index >= channels ? row[index - channels] : 0
      const above = previousRow[index]
      const upperLeft = index >= channels ? previousRow[index - channels] : 0

      if (filterType === 0) row[index] = raw
      else if (filterType === 1) row[index] = (raw + left) & 0xff
      else if (filterType === 2) row[index] = (raw + above) & 0xff
      else if (filterType === 3) row[index] = (raw + Math.floor((left + above) / 2)) & 0xff
      else if (filterType === 4) row[index] = (raw + paethPredictor(left, above, upperLeft)) & 0xff
      else throw new Error(`unsupported row filter ${filterType}`)
    }

    rows.push(row)
    previousRow = row
  }

  return { ...header, channels, rows, transparency }
}

function alphaForPixel(png, row, x) {
  if (png.colorType === 6) return row[x * png.channels + 3]
  if (png.colorType === 4) return row[x * png.channels + 1]
  if (png.colorType === 3) return png.transparency?.[row[x]] ?? 255
  return 255
}

function inspectAlphaBounds(png, threshold = 16) {
  let left = png.width
  let top = png.height
  let right = -1
  let bottom = -1

  for (let y = 0; y < png.height; y += 1) {
    const row = png.rows[y]
    for (let x = 0; x < png.width; x += 1) {
      if (alphaForPixel(png, row, x) < threshold) continue
      left = Math.min(left, x)
      top = Math.min(top, y)
      right = Math.max(right, x)
      bottom = Math.max(bottom, y)
    }
  }

  if (right < 0) return null
  return {
    left,
    top,
    right,
    bottom,
    width: right - left + 1,
    height: bottom - top + 1,
    centerX: (left + right) / 2,
  }
}

function contractFor(filename) {
  const isBoss = filename.startsWith('boss-')
  return isBoss
    ? { width: 768, height: 768, baseline: 690, margin: 60, minHeight: 600, maxHeight: 630, centerX: 384 }
    : { width: 512, height: 512, baseline: 460, margin: 40, minHeight: 400, maxHeight: 420, centerX: 256 }
}

export function validateTurnAsset(filename, buffer) {
  const errors = []
  let png

  try {
    png = readPng(buffer)
  } catch (error) {
    return [`${filename}: ${error instanceof Error ? error.message : String(error)}`]
  }

  const contract = contractFor(filename)
  if (png.width !== contract.width || png.height !== contract.height) {
    errors.push(`${filename}: canvas must be ${contract.width}×${contract.height}px; received ${png.width}×${png.height}px`)
  }

  if (png.colorType !== 6) {
    errors.push(`${filename}: PNG must use 8-bit RGBA pixels (color type 6); received color type ${png.colorType}`)
  }

  const bounds = inspectAlphaBounds(png)
  if (!bounds) {
    errors.push(`${filename}: alpha silhouette is empty`)
    return errors
  }

  const unsafe = bounds.left < contract.margin
    || bounds.top < contract.margin
    || bounds.right > png.width - 1 - contract.margin
    || bounds.bottom > png.height - 1 - contract.margin
  if (unsafe) {
    errors.push(`${filename}: silhouette must keep a ${contract.margin}px safe margin; bounds are ${bounds.left},${bounds.top}–${bounds.right},${bounds.bottom}`)
  }

  if (Math.abs(bounds.bottom - contract.baseline) > 1) {
    errors.push(`${filename}: feet must meet baseline y=${contract.baseline}; received y=${bounds.bottom}`)
  }
  if (bounds.height < contract.minHeight || bounds.height > contract.maxHeight) {
    errors.push(`${filename}: silhouette height must be ${contract.minHeight}–${contract.maxHeight}px; received ${bounds.height}px`)
  }
  if (Math.abs(bounds.centerX - contract.centerX) > 8) {
    errors.push(`${filename}: silhouette center must be x=${contract.centerX}±8px; received ${bounds.centerX}`)
  }

  return errors
}

export async function verifyTurnAssetDirectory(directory) {
  const errors = []
  const expectedFilenames = new Set(TURN_ASSET_FILENAMES)

  try {
    const entries = await readdir(directory, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.png') && !expectedFilenames.has(entry.name)) {
        errors.push(`${entry.name}: unexpected PNG file`)
      }
    }
  } catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) {
      errors.push(`${directory}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  for (const filename of TURN_ASSET_FILENAMES) {
    let buffer
    try {
      buffer = await readFile(path.join(directory, filename))
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        errors.push(`${filename}: missing file`)
        continue
      }
      errors.push(`${filename}: ${error instanceof Error ? error.message : String(error)}`)
      continue
    }
    errors.push(...validateTurnAsset(filename, buffer))
  }

  return errors
}
