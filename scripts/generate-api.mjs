import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import openapiTS from 'openapi-typescript'
import { parse, stringify } from 'yaml'

const apiRepositoryRoot = process.env.FINMATE_API_ROOT
  ? resolve(process.env.FINMATE_API_ROOT)
  : resolve(process.cwd(), '../finmate-api')
const apiRoot = resolve(apiRepositoryRoot, 'docs/vnext/06-api')
const source = resolve(apiRoot, 'openapi.yaml')
const snapshot = resolve(process.cwd(), 'src/api/openapi.snapshot.yaml')
const output = resolve(process.cwd(), 'src/api/generated.ts')

const removeNullValues = (value) => {
  if (Array.isArray(value)) return value.filter((item) => item !== null).map(removeNullValues)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== null).map(([key, item]) => [key, removeNullValues(item)]))
  }
  return value
}

await mkdir(dirname(snapshot), { recursive: true })
const sourceDocument = parse(await readFile(source, 'utf8'))
const normalizedDocument = removeNullValues(sourceDocument)
await writeFile(snapshot, stringify(normalizedDocument))
const generated = await openapiTS(normalizedDocument)
await writeFile(
  output,
  `// Generated from finmate-api/docs/vnext/06-api/openapi.yaml. Do not edit.\n${generated}`,
)
