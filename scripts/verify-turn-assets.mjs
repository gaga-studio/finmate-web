import path from 'node:path'
import { verifyTurnAssetDirectory } from './turn-asset-contract.mjs'

const directory = path.resolve(process.argv[2] ?? 'public/assets/home/turn')
const errors = await verifyTurnAssetDirectory(directory)

if (errors.length > 0) {
  console.error(`Turn asset verification failed for ${directory}:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Turn asset verification passed: 15 files in ${directory}`)
}
