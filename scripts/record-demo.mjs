import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from '@playwright/test'

const root = process.cwd()
const outputDir = resolve(process.env.FINMATE_DEMO_OUTPUT ?? 'artifacts/demo')
const rawDir = resolve(outputDir, 'raw')
const baseUrl = process.env.FINMATE_DEMO_URL ?? 'http://127.0.0.1:4176'
const outputPath = resolve(outputDir, 'finmate-final90.mp4')
const apiCommit = process.env.FINMATE_API_COMMIT ?? 'ae088f55cf564b3a76a627664c0e86783d2de9a2'

await mkdir(rawDir, { recursive: true })

function command(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], ...options })
    let stdout = ''
    let stderr = ''
    child.stdout?.on('data', (chunk) => { stdout += chunk })
    child.stderr?.on('data', (chunk) => { stderr += chunk })
    child.on('error', reject)
    child.on('exit', (code) => code === 0 ? resolvePromise(stdout.trim()) : reject(new Error(`${command} exited ${code}\n${stderr}`)))
  })
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // The Vite process is still starting.
    }
    await delay(250)
  }
  throw new Error(`Timed out waiting for ${url}`)
}

async function sha256(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex')
}

let server
if (!process.env.FINMATE_DEMO_URL) {
  server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4176'], {
    cwd: root,
    env: { ...process.env, VITE_USE_MOCKS: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  server.stderr.on('data', (chunk) => process.stderr.write(chunk))
}

let browser
try {
  await waitForServer(baseUrl)
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    recordVideo: { dir: rawDir, size: { width: 390, height: 844 } },
  })
  const page = await context.newPage()
  const video = page.video()
  const startedAt = Date.now()
  const holdUntil = async (seconds) => {
    const remaining = seconds * 1000 - (Date.now() - startedAt)
    if (remaining > 0) await delay(remaining)
  }
  const addPrototypeLabel = async () => {
    await page.evaluate(() => {
      if (document.querySelector('[data-demo-label]')) return
      const label = document.createElement('div')
      label.dataset.demoLabel = 'true'
      label.textContent = '합성데이터 기반 결정적 프로토타입'
      Object.assign(label.style, {
        position: 'fixed', left: '50%', bottom: '70px', transform: 'translateX(-50%)',
        zIndex: '9999', padding: '6px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
        background: 'rgba(9, 42, 50, 0.82)', color: '#fff', fontSize: '10px',
        fontFamily: 'system-ui, sans-serif', pointerEvents: 'none',
      })
      document.body.append(label)
    })
  }
  const goto = async (path) => {
    await page.goto(`${baseUrl}${path}`)
    await page.waitForLoadState('networkidle')
    await addPrototypeLabel()
  }

  await goto('/signup')
  await page.getByLabel('이름').fill('민지')
  await page.getByLabel('이메일').fill('final90@synthetic.finmate.local')
  await page.getByLabel('비밀번호').fill('finmate12345')
  await Promise.all([page.waitForURL('**/onboarding/1'), page.getByRole('button', { name: '시작하기' }).click()])
  await addPrototypeLabel()

  const onboarding = [
    ['정기 소득 · 자취 중이에요', '다음', 3],
    ['저축을 꾸준히 하고 싶어요', '다음', 5],
    ['안전성과 실행을 함께 봐요', '다음', 7],
    ['자취 · 사회초년생', '다음', 9],
    ['동의 범위를 확인하고 연결하기', '연결하고 기준선 보기', 12],
  ]
  for (const [choice, next, at] of onboarding) {
    await holdUntil(at - 1)
    await page.getByRole('button', { name: choice }).click()
    await page.getByRole('button', { name: next }).click()
    await holdUntil(at)
  }
  await page.waitForURL('**/onboarding/baseline')
  await holdUntil(13)

  await page.getByRole('link', { name: '목표 설정하기' }).click()
  await holdUntil(16)
  await page.getByRole('button', { name: '유럽 여행 자금 목표 만들기' }).click()
  await page.waitForURL('**/goal/success')
  await holdUntil(18)
  await page.getByRole('button', { name: '홈으로 가기' }).click()
  await page.waitForURL('**/home')
  await holdUntil(22)

  await page.getByRole('button', { name: '동물 리포트', exact: true }).click()
  await holdUntil(24)
  await page.getByRole('button', { name: '곰 · 소비 리포트' }).click()
  await holdUntil(26)
  await page.getByRole('button', { name: '토끼 · 투자 판단 리포트' }).click()
  await holdUntil(28)
  await page.getByRole('button', { name: '물개 · 저축 리포트' }).click()
  await holdUntil(29)

  await page.getByRole('link', { name: '퀘스트', exact: true }).click()
  await holdUntil(31)
  await page.getByRole('link', { name: /자동저축 입금 반영 확인하기/ }).click()
  await holdUntil(34)
  await page.getByRole('button', { name: '퀘스트 수락' }).click()
  await holdUntil(35.5)
  await page.getByRole('button', { name: '완료 확인' }).click()
  await holdUntil(37)

  await page.getByRole('link', { name: '메이트', exact: true }).click()
  await page.getByRole('link', { name: '친구', exact: true }).click()
  await holdUntil(41)
  await page.getByRole('link', { name: '메이트 찾기', exact: true }).click()
  await holdUntil(44)
  await page.getByRole('link', { name: '비교 탐색', exact: true }).click()
  await holdUntil(46)
  await page.getByRole('button', { name: '모험가 찾기' }).click()
  await holdUntil(48)
  await page.getByRole('link', { name: /남쪽의 모험가/ }).click()
  await holdUntil(50)
  await page.getByRole('link', { name: /나와 비교한 리포트 보기/ }).click()
  await holdUntil(53)

  await page.getByRole('link', { name: /이 루틴을 내 상황에 맞추기/ }).click()
  await holdUntil(55)
  await page.getByRole('button', { name: '내 기준으로 추천 받기' }).click()
  await holdUntil(57)
  await page.getByRole('button', { name: '표준 · 월급날 50만원 먼저 저축' }).click()
  await holdUntil(59)
  await page.getByRole('button', { name: '이 루틴으로 바꾸기' }).click()
  await page.getByRole('button', { name: '교체 확정' }).click()
  await holdUntil(64)

  await goto('/products/hana-saving-info-001')
  await holdUntil(71)
  await goto('/record')
  await holdUntil(74)
  await page.getByRole('button', { name: '2026-07-11 기록' }).click()
  await holdUntil(78)
  await page.getByRole('button', { name: '닫기' }).click()
  await holdUntil(80)
  await page.getByRole('button', { name: '시연 시간 진행' }).click()
  await holdUntil(82)
  await page.getByRole('button', { name: '목표 완료 보기' }).click()
  await page.waitForURL('**/goal/complete')
  await holdUntil(86)
  await page.getByRole('link', { name: '새 여정 시작하기' }).click()
  await holdUntil(90)

  await context.close()
  const rawPath = await video.path()
  await command('ffmpeg', [
    '-y',
    '-f', 'lavfi', '-i', 'color=c=#edf8f5:s=1920x1080:r=30:d=90',
    '-i', rawPath,
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-filter_complex', '[1:v]scale=-2:1000:force_original_aspect_ratio=decrease[phone];[0:v][phone]overlay=(W-w)/2:(H-h)/2:shortest=1[v]',
    '-map', '[v]', '-map', '2:a', '-t', '90', '-r', '30',
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '20',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', outputPath,
  ])

  const webCommit = await command('git', ['rev-parse', 'HEAD'], { cwd: root })
  const openApiPath = resolve(root, 'src/api/openapi.snapshot.yaml')
  const duration = await command('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', outputPath])
  const manifest = {
    generatedAt: new Date().toISOString(),
    webCommit,
    apiCommit,
    openApiSha256: await sha256(openApiPath),
    syntheticBundleCommit: '63ca3d046eba9ec510e377a28a0083233aefff61',
    syntheticL3Commit: '22243bce34131737fc762675f0817ead08bc165a',
    syntheticL3TreeSha256: 'dd30ae91f5e517f2a502ce46b2dfe3666107562e2dc52edb25fec48b893c3c33',
    fixture: 'final90-mock-v1',
    viewport: '390x844',
    output: basename(outputPath),
    durationSeconds: Number(duration),
    sha256: await sha256(outputPath),
    disclaimer: '합성데이터 기반 결정적 프로토타입',
  }
  await writeFile(resolve(outputDir, 'demo-record-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`)
} finally {
  await browser?.close().catch(() => undefined)
  if (server && server.exitCode === null) server.kill('SIGTERM')
}
