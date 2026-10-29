#!/usr/bin/env node
/**
 * 主页动态渲染：把 123caiji/123caiji 的 README 里 <!-- STATS:START --> … <!-- STATS:END -->
 * 之间的内容换成最新数据，让个人主页每天都有真实变化。
 *
 * 用法：GH_TOKEN=... node scripts/profile-stats.mjs
 * 数据全部来自公开接口，Actions 里用内置 GITHUB_TOKEN 即可。
 */

import { readFileSync, writeFileSync } from 'node:fs'

const OWNER = process.env.SCAN_OWNER || '123caiji'
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || ''
const README = process.env.README_PATH || 'README.md'
const START = '<!-- STATS:START -->'
const END = '<!-- STATS:END -->'
const API = 'https://api.github.com'

const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': OWNER + '-profile-stats',
  ...(TOKEN ? { authorization: 'Bearer ' + TOKEN } : {}),
}

async function api(path) {
  const res = await fetch(API + path, { headers })
  const text = await res.text()
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${text.slice(0, 200)}`)
  return text ? JSON.parse(text) : null
}

const day = 86400000
const iso = ms => new Date(Date.now() - ms).toISOString()
const since7d = iso(7 * day)

function ago(isoDate) {
  if (!isoDate) return '—'
  const d = Math.floor((Date.now() - Date.parse(isoDate)) / day)
  if (d <= 0) return '今天'
  if (d === 1) return '昨天'
  if (d < 30) return d + ' 天前'
  if (d < 365) return Math.floor(d / 30) + ' 个月前'
  return Math.floor(d / 365) + ' 年前'
}

async function main() {
  const repos = await api(`/users/${OWNER}/repos?type=owner&sort=pushed&per_page=100`)
  const own = repos.filter(r => !r.fork && r.name !== OWNER)
  const stars = own.reduce((s, r) => s + r.stargazers_count, 0)

  // 近 7 天提交数（每个仓库一次请求，最多 12 个仓库，够用且不浪费配额）
  let commits7d = 0
  for (const r of own.slice(0, 12)) {
    try {
      const list = await api(`/repos/${r.full_name}/commits?since=${since7d}&per_page=100`)
      commits7d += list.length
    } catch {
      // 空仓库或权限问题，忽略
    }
  }

  const recent = own
    .slice()
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, 5)

  const lines = []
  lines.push(START)
  lines.push('')
  lines.push(`**最近在更新**（${new Date().toISOString().slice(0, 10)} 自动刷新）`)
  lines.push('')
  lines.push('| 仓库 | 说明 | 最后更新 |')
  lines.push('| --- | --- | --- |')
  for (const r of recent) {
    const desc = (r.description || '—').replace(/\|/g, '\\|')
    lines.push(`| [${r.name}](https://github.com/${r.full_name}) | ${desc} | ${ago(r.pushed_at)} |`)
  }
  lines.push('')
  lines.push(
    `<sub>公开仓库 ${repos.length} 个 · 自有项目 ${own.length} 个 · star 合计 ${stars} · 近 7 天提交 ${commits7d} 次</sub>`,
  )
  lines.push('')
  lines.push(END)

  const block = lines.join('\n')
  const readme = readFileSync(README, 'utf8')
  let next
  if (readme.includes(START) && readme.includes(END)) {
    const before = readme.slice(0, readme.indexOf(START))
    const after = readme.slice(readme.indexOf(END) + END.length)
    next = before + block + after
  } else {
    // 首次运行：插在第一个二级标题之前
    const idx = readme.indexOf('\n## ')
    next = idx === -1 ? readme + '\n\n' + block + '\n' : readme.slice(0, idx) + '\n\n' + block + readme.slice(idx)
  }

  if (next === readme) {
    console.log('README 无变化，跳过写入')
    return
  }
  writeFileSync(README, next, 'utf8')
  console.log(`README 已更新：${recent.length} 个最近仓库，近 7 天提交 ${commits7d}`)
}

main().catch(error => {
  console.error('profile-stats failed:', error)
  process.exit(1)
})
