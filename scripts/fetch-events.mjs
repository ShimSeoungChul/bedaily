/**
 * 기술 생태계 릴리즈/이벤트를 외부 API에서 가져와
 * data/events-auto.json 을 매주 전체 교체한다.
 *
 * 보관 범위: 과거 3개월 ~ 미래 12개월
 * 실행: node scripts/fetch-events.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUTPUT = path.join(ROOT, 'data', 'events-auto.json')

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ''
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
}

// ── 날짜 범위 ─────────────────────────────────────────────
const now = new Date()
const MIN_DATE = new Date(now)
MIN_DATE.setMonth(MIN_DATE.getMonth() - 3)   // 과거 3개월
const MAX_DATE = new Date(now)
MAX_DATE.setMonth(MAX_DATE.getMonth() + 12)  // 미래 12개월

function inRange(dateStr) {
  const d = new Date(dateStr)
  return d >= MIN_DATE && d <= MAX_DATE
}

function toDateStr(isoStr) {
  return isoStr.slice(0, 10)
}

// ── slug 생성 ─────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── GitHub API helpers ────────────────────────────────────
async function fetchJson(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) {
    console.warn(`  ⚠️  ${res.status} ${url}`)
    return []
  }
  return res.json()
}

async function getGithubReleases(repo) {
  return fetchJson(`https://api.github.com/repos/${repo}/releases?per_page=20`)
}

async function getGithubMilestones(repo) {
  return fetchJson(
    `https://api.github.com/repos/${repo}/milestones?state=open&sort=due_on&direction=asc&per_page=20`
  )
}

// ── 이벤트 수집 함수들 ────────────────────────────────────

/** Spring Boot 릴리즈 + 예정 milestone */
async function fetchSpringBoot() {
  const events = []

  // 최근 릴리즈
  const releases = await getGithubReleases('spring-projects/spring-boot')
  for (const r of releases) {
    if (r.prerelease) continue
    const date = toDateStr(r.published_at)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`spring-boot-${r.tag_name}-release`),
      title: `Spring Boot ${r.tag_name} 릴리즈`,
      date,
      category: 'Backend',
      type: 'release',
      link: r.html_url,
      description: `Spring Boot ${r.tag_name} 정식 출시.`,
    })
  }

  // 예정 milestone (due_on 있는 것만)
  const milestones = await getGithubMilestones('spring-projects/spring-boot')
  for (const m of milestones) {
    if (!m.due_on) continue
    const date = toDateStr(m.due_on)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`spring-boot-${m.title}-milestone`),
      title: `Spring Boot ${m.title} 출시 예정`,
      date,
      category: 'Backend',
      type: 'release',
      link: m.html_url,
      description: `Spring Boot ${m.title} 릴리즈 예정일.`,
    })
  }

  return events
}

/** Spring Framework 릴리즈 + 예정 milestone */
async function fetchSpringFramework() {
  const events = []

  const releases = await getGithubReleases('spring-projects/spring-framework')
  for (const r of releases) {
    if (r.prerelease) continue
    const date = toDateStr(r.published_at)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`spring-framework-${r.tag_name}-release`),
      title: `Spring Framework ${r.tag_name} 릴리즈`,
      date,
      category: 'Backend',
      type: 'release',
      link: r.html_url,
      description: `Spring Framework ${r.tag_name} 정식 출시.`,
    })
  }

  const milestones = await getGithubMilestones('spring-projects/spring-framework')
  for (const m of milestones) {
    if (!m.due_on) continue
    const date = toDateStr(m.due_on)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`spring-framework-${m.title}-milestone`),
      title: `Spring Framework ${m.title} 출시 예정`,
      date,
      category: 'Backend',
      type: 'release',
      link: m.html_url,
      description: `Spring Framework ${m.title} 릴리즈 예정일.`,
    })
  }

  return events
}

/** Kotlin 릴리즈 */
async function fetchKotlin() {
  const releases = await getGithubReleases('JetBrains/kotlin')
  const events = []
  for (const r of releases) {
    if (r.prerelease) continue
    const date = toDateStr(r.published_at)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`kotlin-${r.tag_name}-release`),
      title: `Kotlin ${r.tag_name} 릴리즈`,
      date,
      category: 'Java',
      type: 'release',
      link: r.html_url,
      description: `Kotlin ${r.tag_name} 정식 출시.`,
    })
  }
  return events
}

/** Java GA 릴리즈 일정 (6개월 주기: 3월·9월 세 번째 화요일) */
function fetchJavaSchedule() {
  function thirdTuesday(year, month) {
    // month: 0-indexed
    const d = new Date(year, month, 1)
    const day = d.getDay() // 0=Sun
    const firstTue = day <= 2 ? 3 - day : 10 - day
    return new Date(year, month, firstTue + 14) // +14 = 세 번째 화요일
  }

  const events = []
  // 현재 연도부터 2년치 생성
  for (let y = now.getFullYear(); y <= now.getFullYear() + 2; y++) {
    for (const month of [2, 8]) { // 3월=2, 9월=8
      const d = thirdTuesday(y, month)
      const date = d.toISOString().slice(0, 10)
      if (!inRange(date)) continue
      // Java 버전 계산: Java 21(2023-09) 기준으로 6개월마다 +1
      const base = { year: 2023, month: 8, version: 21 }
      const monthsDiff =
        (y - base.year) * 12 + (month - base.month)
      const version = base.version + Math.round(monthsDiff / 6)
      const isLTS = version % 2 === 1 // 홀수(21, 23, 25...)가 LTS
      events.push({
        slug: `java-${version}-ga-release`,
        title: `Java ${version} GA 릴리즈${isLTS ? ' (LTS)' : ''}`,
        date,
        category: 'Java',
        type: 'release',
        link: `https://openjdk.org/projects/jdk/${version}/`,
        description: `OpenJDK ${version} 정식 출시.${isLTS ? ' LTS 버전.' : ''}`,
      })
    }
  }
  return events
}

/** Anthropic SDK 릴리즈 (모델 출시 프록시) */
async function fetchAnthropic() {
  const releases = await getGithubReleases('anthropics/anthropic-sdk-python')
  const events = []
  for (const r of releases) {
    if (r.prerelease) continue
    const date = toDateStr(r.published_at)
    if (!inRange(date)) continue
    // 메이저/마이너만 (패치 제외)
    const match = r.tag_name.match(/^v?(\d+)\.(\d+)\.0$/)
    if (!match) continue
    events.push({
      slug: slugify(`anthropic-sdk-${r.tag_name}-release`),
      title: `Anthropic SDK ${r.tag_name} 릴리즈`,
      date,
      category: 'AI',
      type: 'ai-release',
      link: r.html_url,
      description: `Anthropic Python SDK ${r.tag_name} 출시.`,
    })
  }
  return events
}

/** OpenAI SDK 릴리즈 */
async function fetchOpenAI() {
  const releases = await getGithubReleases('openai/openai-python')
  const events = []
  for (const r of releases) {
    if (r.prerelease) continue
    const date = toDateStr(r.published_at)
    if (!inRange(date)) continue
    const match = r.tag_name.match(/^v?(\d+)\.(\d+)\.0$/)
    if (!match) continue
    events.push({
      slug: slugify(`openai-sdk-${r.tag_name}-release`),
      title: `OpenAI SDK ${r.tag_name} 릴리즈`,
      date,
      category: 'AI',
      type: 'ai-release',
      link: r.html_url,
      description: `OpenAI Python SDK ${r.tag_name} 출시.`,
    })
  }
  return events
}

// ── 메인 ─────────────────────────────────────────────────
async function main() {
  console.log('📅 이벤트 fetch 시작...\n')

  const results = await Promise.allSettled([
    fetchSpringBoot(),
    fetchSpringFramework(),
    fetchKotlin(),
    Promise.resolve(fetchJavaSchedule()),
    fetchAnthropic(),
    fetchOpenAI(),
  ])

  const labels = [
    'Spring Boot',
    'Spring Framework',
    'Kotlin',
    'Java 스케줄',
    'Anthropic SDK',
    'OpenAI SDK',
  ]

  const allEvents = []
  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    if (r.status === 'fulfilled') {
      console.log(`  ✓ ${labels[i]}: ${r.value.length}개`)
      allEvents.push(...r.value)
    } else {
      console.log(`  ✗ ${labels[i]}: 실패 (${r.reason?.message ?? r.reason})`)
    }
  }

  // slug 중복 제거 (먼저 온 것 우선)
  const seen = new Set()
  const deduped = allEvents.filter((e) => {
    if (seen.has(e.slug)) return false
    seen.add(e.slug)
    return true
  })

  // 날짜순 정렬
  deduped.sort((a, b) => a.date.localeCompare(b.date))

  fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true })
  fs.writeFileSync(OUTPUT, JSON.stringify(deduped, null, 2) + '\n', 'utf8')

  console.log(`\n✅ 완료: 총 ${deduped.length}개 이벤트 → data/events-auto.json`)
  console.log(`   범위: ${MIN_DATE.toISOString().slice(0, 10)} ~ ${MAX_DATE.toISOString().slice(0, 10)}`)
}

main().catch((e) => {
  console.error('❌ 오류:', e)
  process.exit(1)
})
