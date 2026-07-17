import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { deflateSync } from 'node:zlib'
import { validateTurnAsset, verifyTurnAssetDirectory } from './turn-asset-contract.mjs'

// This file is run explicitly with node --test and intentionally stays outside Vitest's filename pattern.

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

function pngChunk(type, data) {
  const name = Buffer.from(type)
  const chunk = Buffer.alloc(data.length + 12)
  chunk.writeUInt32BE(data.length, 0)
  name.copy(chunk, 4)
  data.copy(chunk, 8)
  chunk.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8)
  return chunk
}

function makePng({
  width,
  height,
  colorType = 6,
  bounds,
}) {
  const channels = colorType === 6 ? 4 : colorType === 4 ? 2 : 3
  const raw = Buffer.alloc((width * channels + 1) * height)

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * channels + 1)
    for (let x = 0; x < width; x += 1) {
      const pixelStart = rowStart + 1 + x * channels
      raw[pixelStart] = 240
      if (colorType === 6) {
        raw[pixelStart + 1] = 180
        raw[pixelStart + 2] = 80
        raw[pixelStart + 3] = bounds
          && x >= bounds.left
          && x <= bounds.right
          && y >= bounds.top
          && y <= bounds.bottom
          ? 255
          : 0
      } else if (colorType === 4) {
        raw[pixelStart + 1] = bounds
          && x >= bounds.left
          && x <= bounds.right
          && y >= bounds.top
          && y <= bounds.bottom
          ? 255
          : 0
      } else {
        raw[pixelStart + 1] = 180
        raw[pixelStart + 2] = 80
      }
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = colorType

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

test('accepts a party sprite that matches the alpha and canvas contract', () => {
  const png = makePng({
    width: 512,
    height: 512,
    bounds: { left: 56, top: 51, right: 455, bottom: 460 },
  })

  assert.deepEqual(validateTurnAsset('invest-idle-right.png', png), [])
})

test('rejects a sprite with the wrong canvas size or no alpha channel', () => {
  const wrongSize = makePng({
    width: 256,
    height: 256,
    bounds: { left: 40, top: 40, right: 215, bottom: 215 },
  })
  const opaqueRgb = makePng({
    width: 512,
    height: 512,
    colorType: 2,
  })

  assert.match(validateTurnAsset('save-idle-right.png', wrongSize).join('\n'), /512×512/)
  assert.match(validateTurnAsset('save-idle-right.png', opaqueRgb).join('\n'), /RGBA/)
})

test('requires RGBA pixels and rejects corrupted PNG chunks', () => {
  const grayscaleAlpha = makePng({
    width: 512,
    height: 512,
    colorType: 4,
    bounds: { left: 56, top: 51, right: 455, bottom: 460 },
  })
  const corrupted = Buffer.from(makePng({
    width: 512,
    height: 512,
    bounds: { left: 56, top: 51, right: 455, bottom: 460 },
  }))
  corrupted[corrupted.length - 5] ^= 0xff

  assert.match(validateTurnAsset('save-idle-right.png', grayscaleAlpha).join('\n'), /RGBA/)
  assert.match(validateTurnAsset('save-idle-right.png', corrupted).join('\n'), /CRC/)
})

test('rejects unsafe padding, an incorrect baseline, and an out-of-range silhouette height', () => {
  const png = makePng({
    width: 512,
    height: 512,
    bounds: { left: 20, top: 80, right: 491, bottom: 470 },
  })
  const errors = validateTurnAsset('mission-attack-right.png', png).join('\n')

  assert.match(errors, /40px safe margin/)
  assert.match(errors, /baseline y=460/)
  assert.match(errors, /400–420px/)
})

test('applies the scaled contract to boss sprites', () => {
  const validBoss = makePng({
    width: 768,
    height: 768,
    bounds: { left: 80, top: 81, right: 687, bottom: 690 },
  })
  const shortBoss = makePng({
    width: 768,
    height: 768,
    bounds: { left: 120, top: 180, right: 647, bottom: 690 },
  })

  assert.deepEqual(validateTurnAsset('boss-idle-left.png', validBoss), [])
  assert.match(validateTurnAsset('boss-hit-left.png', shortBoss).join('\n'), /600–630px/)
})

test('reports every missing file in a turn asset directory', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'finmate-turn-assets-'))
  try {
    await writeFile(path.join(directory, 'invest-idle-right.png'), makePng({
      width: 512,
      height: 512,
      bounds: { left: 56, top: 51, right: 455, bottom: 460 },
    }))
    await writeFile(path.join(directory, 'stale-idle-right.png'), makePng({
      width: 512,
      height: 512,
      bounds: { left: 56, top: 51, right: 455, bottom: 460 },
    }))

    const errors = await verifyTurnAssetDirectory(directory)
    assert.equal(errors.filter((error) => error.includes('missing file')).length, 14)
    assert.ok(!errors.some((error) => error.startsWith('invest-idle-right.png:')))
    assert.ok(errors.includes('stale-idle-right.png: unexpected PNG file'))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
