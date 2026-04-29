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
const githubHeaders = {
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

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── fetch helpers ─────────────────────────────────────────
async function fetchGitHub(url) {
  const res = await fetch(url, { headers: githubHeaders })
  if (!res.ok) { console.warn(`  ⚠️  GitHub ${res.status} ${url}`); return [] }
  return res.json()
}

async function fetchPlain(url) {
  const res = await fetch(url)
  if (!res.ok) { console.warn(`  ⚠️  ${res.status} ${url}`); return null }
  return res.json()
}

async function getGithubReleases(repo) {
  return fetchGitHub(`https://api.github.com/repos/${repo}/releases?per_page=20`)
}

async function getGithubMilestones(repo) {
  return fetchGitHub(
    `https://api.github.com/repos/${repo}/milestones?state=open&sort=due_on&direction=asc&per_page=20`
  )
}

// ── 공통 GitHub Release 파서 ──────────────────────────────
/**
 * @param {string} repo          - "owner/repo"
 * @param {string} prefix        - slug/title 앞에 붙는 이름 (예: "spring-boot")
 * @param {string} displayName   - 사람이 읽는 이름 (예: "Spring Boot")
 * @param {string} category      - Backend | AI | Java | DevOps
 * @param {string} type          - release | ai-release | conference
 * @param {(tag:string)=>boolean} [filter] - 추가 필터 (기본: 모든 non-prerelease)
 */
async function fromGithubReleases(repo, prefix, displayName, category, type, filter) {
  const releases = await getGithubReleases(repo)
  const events = []
  for (const r of releases) {
    if (r.prerelease) continue
    if (filter && !filter(r.tag_name)) continue
    const date = toDateStr(r.published_at)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`${prefix}-${r.tag_name}-release`),
      title: `${displayName} ${r.tag_name} 릴리즈`,
      date,
      category,
      type,
      link: r.html_url,
      description: `${displayName} ${r.tag_name} 정식 출시.`,
    })
  }
  return events
}

// ── 개별 소스 함수들 ──────────────────────────────────────

async function fetchSpringBoot() {
  const events = await fromGithubReleases(
    'spring-projects/spring-boot', 'spring-boot', 'Spring Boot', 'Backend', 'release'
  )
  // 예정 milestone
  const milestones = await getGithubMilestones('spring-projects/spring-boot')
  for (const m of milestones) {
    if (!m.due_on) continue
    const date = toDateStr(m.due_on)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`spring-boot-${m.title}-milestone`),
      title: `Spring Boot ${m.title} 출시 예정`,
      date, category: 'Backend', type: 'release',
      link: m.html_url,
      description: `Spring Boot ${m.title} 릴리즈 예정일.`,
    })
  }
  return events
}

async function fetchSpringFramework() {
  const events = await fromGithubReleases(
    'spring-projects/spring-framework', 'spring-framework', 'Spring Framework', 'Backend', 'release'
  )
  const milestones = await getGithubMilestones('spring-projects/spring-framework')
  for (const m of milestones) {
    if (!m.due_on) continue
    const date = toDateStr(m.due_on)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`spring-framework-${m.title}-milestone`),
      title: `Spring Framework ${m.title} 출시 예정`,
      date, category: 'Backend', type: 'release',
      link: m.html_url,
      description: `Spring Framework ${m.title} 릴리즈 예정일.`,
    })
  }
  return events
}

async function fetchKotlin() {
  return fromGithubReleases(
    'JetBrains/kotlin', 'kotlin', 'Kotlin', 'Java', 'release'
  )
}

/** Hibernate ORM — x.y.0 또는 x.y.0.Final (마이너 이상만) */
async function fetchHibernate() {
  return fromGithubReleases(
    'hibernate/hibernate-orm', 'hibernate-orm', 'Hibernate ORM', 'Java', 'release',
    (tag) => /^\d+\.\d+\.0(\.Final)?$/.test(tag)
  )
}

/** Redis */
async function fetchRedis() {
  return fromGithubReleases(
    'redis/redis', 'redis', 'Redis', 'Backend', 'release',
    (tag) => /^\d+\.\d+\.\d+$/.test(tag) // v 없는 태그
  )
}

/** Apache Kafka — endoflife.date API */
async function fetchKafka() {
  const data = await fetchPlain('https://endoflife.date/api/apache-kafka.json')
  if (!Array.isArray(data)) return []

  const events = []
  for (const entry of data) {
    const date = entry.latestReleaseDate ?? entry.releaseDate
    if (!date || !inRange(date)) continue
    events.push({
      slug: slugify(`kafka-${entry.cycle}-${entry.latest}-release`),
      title: `Apache Kafka ${entry.latest} 릴리즈`,
      date,
      category: 'Backend',
      type: 'release',
      link: `https://kafka.apache.org/downloads`,
      description: `Apache Kafka ${entry.cycle} 계열 최신 릴리즈 (${entry.latest}).`,
    })
  }
  return events
}

/** Jakarta Persistence (JPA) */
async function fetchJakartaPersistence() {
  return fromGithubReleases(
    'jakartaee/persistence', 'jakarta-persistence', 'Jakarta Persistence', 'Java', 'release'
  )
}

/** OpenAI Codex CLI */
async function fetchCodex() {
  return fromGithubReleases(
    'openai/codex', 'openai-codex', 'OpenAI Codex', 'AI', 'ai-release'
  )
}

/** PostgreSQL — endoflife.date API */
async function fetchPostgreSQL() {
  const data = await fetchPlain('https://endoflife.date/api/postgresql.json')
  if (!Array.isArray(data)) return []

  const events = []
  for (const entry of data) {
    // latestReleaseDate: 해당 메이저 버전의 최신 패치 출시일
    const date = entry.latestReleaseDate ?? entry.releaseDate
    if (!date || !inRange(date)) continue
    events.push({
      slug: slugify(`postgresql-${entry.cycle}-${entry.latest}-release`),
      title: `PostgreSQL ${entry.latest} 릴리즈`,
      date,
      category: 'Backend',
      type: 'release',
      link: `https://www.postgresql.org/docs/${entry.cycle}/release-${entry.latest.replace(/\./g, '-')}.html`,
      description: `PostgreSQL ${entry.cycle} 계열 최신 릴리즈 (${entry.latest}).`,
    })
  }
  return events
}

/** Claude Code — npm 레지스트리 (마이너 버전만) */
async function fetchClaudeCode() {
  const data = await fetchPlain('https://registry.npmjs.org/@anthropic-ai/claude-code')
  if (!data?.time) return []

  const events = []
  for (const [version, dateStr] of Object.entries(data.time)) {
    if (version === 'created' || version === 'modified') continue
    // 마이너 버전만: x.y.0
    if (!/^\d+\.\d+\.0$/.test(version)) continue
    const date = toDateStr(dateStr)
    if (!inRange(date)) continue
    events.push({
      slug: slugify(`claude-code-${version}-release`),
      title: `Claude Code v${version} 릴리즈`,
      date,
      category: 'AI',
      type: 'ai-release',
      link: `https://www.npmjs.com/package/@anthropic-ai/claude-code/v/${version}`,
      description: `Claude Code CLI v${version} 출시.`,
    })
  }
  return events
}

/** Anthropic SDK */
async function fetchAnthropic() {
  return fromGithubReleases(
    'anthropics/anthropic-sdk-python', 'anthropic-sdk', 'Anthropic SDK', 'AI', 'ai-release',
    (tag) => /^v?\d+\.\d+\.0$/.test(tag)
  )
}

/** OpenAI SDK */
async function fetchOpenAI() {
  return fromGithubReleases(
    'openai/openai-python', 'openai-sdk', 'OpenAI SDK', 'AI', 'ai-release',
    (tag) => /^v?\d+\.\d+\.0$/.test(tag)
  )
}

/** Java GA 릴리즈 일정 (6개월 주기: 3월·9월 세 번째 화요일) */
function fetchJavaSchedule() {
  function thirdTuesday(year, month) {
    const d = new Date(year, month, 1)
    const day = d.getDay()
    const firstTue = day <= 2 ? 3 - day : 10 - day
    return new Date(year, month, firstTue + 14)
  }

  const events = []
  for (let y = now.getFullYear(); y <= now.getFullYear() + 2; y++) {
    for (const month of [2, 8]) {
      const d = thirdTuesday(y, month)
      const date = d.toISOString().slice(0, 10)
      if (!inRange(date)) continue
      const base = { year: 2023, month: 8, version: 21 }
      const monthsDiff = (y - base.year) * 12 + (month - base.month)
      const version = base.version + Math.round(monthsDiff / 6)
      const isLTS = version % 2 === 1
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

// ── 메인 ─────────────────────────────────────────────────
async function main() {
  console.log('📅 이벤트 fetch 시작...\n')

  const sources = [
    { label: 'Spring Boot',           fn: fetchSpringBoot },
    { label: 'Spring Framework',      fn: fetchSpringFramework },
    { label: 'Kotlin',                fn: fetchKotlin },
    { label: 'Hibernate ORM',         fn: fetchHibernate },
    { label: 'Redis',                 fn: fetchRedis },
    { label: 'Apache Kafka',          fn: fetchKafka },
    { label: 'Jakarta Persistence',   fn: fetchJakartaPersistence },
    { label: 'OpenAI Codex',          fn: fetchCodex },
    { label: 'PostgreSQL',            fn: fetchPostgreSQL },
    { label: 'Claude Code',           fn: fetchClaudeCode },
    { label: 'Anthropic SDK',         fn: fetchAnthropic },
    { label: 'OpenAI SDK',            fn: fetchOpenAI },
    { label: 'Java 스케줄',           fn: () => Promise.resolve(fetchJavaSchedule()) },
  ]

  const results = await Promise.allSettled(sources.map((s) => s.fn()))

  const allEvents = []
  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    if (r.status === 'fulfilled') {
      console.log(`  ✓ ${sources[i].label}: ${r.value.length}개`)
      allEvents.push(...r.value)
    } else {
      console.log(`  ✗ ${sources[i].label}: 실패 (${r.reason?.message ?? r.reason})`)
    }
  }

  // slug 중복 제거
  const seen = new Set()
  const deduped = allEvents.filter((e) => {
    if (seen.has(e.slug)) return false
    seen.add(e.slug)
    return true
  })

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
