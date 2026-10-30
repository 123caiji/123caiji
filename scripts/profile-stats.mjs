#!/usr/bin/env node
/**
 * 主页自动刷新：
 *   1) README 里 <!-- STATS:START -->…<!-- STATS:END --> 换成「最近在更新」表格；
 *   2) 生成三张自绘 SVG 数据卡片（metrics-overview / metrics-languages / metrics-activity），
 *      写进 <!-- CARDS:START -->…<!-- CARDS:END -->；
 *   3) 把数据和卡片提交回仓库（不依赖任何第三方图片服务，所以永远不会破图）。
 *
 * 用法：GH_TOKEN=... node scripts/profile-stats.mjs
 * 本地预览不提交：NO_COMMIT=1 node scripts/profile-stats.mjs
 * 灵感来自 lowlighter/metrics，但所有 SVG 都是本仓库现算现画的。
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { collectData } from './lib/collect.mjs'
import { renderCards } from './lib/cards.mjs'

const OWNER = process.env.SCAN_OWNER || '123caiji'
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || ''
const README = process.env.README_PATH || 'README.md'
const STATS = { start: '<!-- STATS:START -->', end: '<!-- STATS:END -->' }
const CARDS = { start: '<!-- CARDS:START -->', end: '<!-- CARDS:END -->' }
const FILES = {
  overview: 'metrics-overview.svg',
  languages: 'metrics-languages.svg',
  activity: 'metrics-activity.svg',
}

const day = 86400000
function ago (isoDate) {
  if (!isoDate) return '—'
  const d = Math.floor((Date.now() - Date.parse(isoDate)) / day)
  if (d <= 0) return '今天'
  if (d === 1) return '昨天'
  if (d < 30) return d + ' 天前'
  if (d < 365) return Math.floor(d / 30) + ' 个月前'
  return Math.floor(d / 365) + ' 年前'
}

function replaceBlock (text, start, end, block) {
  if (text.includes(start) && text.includes(end)) {
    return text.slice(0, text.indexOf(start)) + block + text.slice(text.indexOf(end) + end.length)
  }
  const idx = text.indexOf('\n## ')
  return idx === -1 ? text + '\n\n' + block + '\n' : text.slice(0, idx) + '\n\n' + block + text.slice(idx)
}

function statsBlock (data) {
  const lines = [STATS.start, '', `**最近在更新**（${new Date().toISOString().slice(0, 10)} 自动刷新）`, '', '| 仓库 | 说明 | 最后更新 |', '| --- | --- | --- |']
  for (const r of data.recent) {
    const desc = (r.desc || '—').replace(/\|/g, '\\|')
    lines.push(`| [${r.name}](https://github.com/${r.full}) | ${desc} | ${ago(r.pushedAt)} |`)
  }
  lines.push('')
  const nz = v => (v === null || v === undefined ? '—' : v)
  lines.push(`<sub>公开仓库 ${nz(data.repos)} 个 · star 合计 ${nz(data.stars)} · 关注者 ${nz(data.followers)} · 近 7 天提交 ${nz(data.commits7)} 次 · 近一年贡献 ${nz(data.totalContributions)} 次</sub>`)
  lines.push('', STATS.end)
  return lines.join('\n')
}

function cardsBlock () {
  const img = (f, alt) => `  <img src="./${f}" alt="${alt}" />`
  return [
    CARDS.start,
    '',
    '<p align="center">',
    img(FILES.overview, '账号总览'),
    '</p>',
    '',
    '<p align="center">',
    img(FILES.languages, '语言构成'),
    '</p>',
    '',
    '<p align="center">',
    img(FILES.activity, '贡献热力图'),
    '</p>',
    '',
    CARDS.end,
  ].join('\n')
}

async function main () {
  const data = await collectData({ owner: OWNER, token: TOKEN })
  // 账号显示名与登录名相同时，用个人主页上的中文名（可用 DISPLAY_NAME 覆盖）
  if (!data.name || data.name === data.login) data.name = process.env.DISPLAY_NAME || '龙天彪'
  console.log(`数据：仓库 ${data.repos} · star ${data.stars} · 关注者 ${data.followers} · 近一年贡献 ${data.totalContributions}`)

  mkdirSync('data', { recursive: true })
  writeFileSync('data/profile-data.json', JSON.stringify(data, null, 2))

  let avatar = ''
  try {
    const r = await fetch(data.avatar + (data.avatar.includes('?') ? '&' : '?') + 's=200')
    if (r.ok) avatar = Buffer.from(await r.arrayBuffer()).toString('base64')
  } catch (e) {
    console.log('warn: 头像取不到，卡片将不显示头像（' + e.message.slice(0, 80) + '）')
  }

  const svg = renderCards(data, avatar)
  writeFileSync(FILES.overview, svg.overview)
  writeFileSync(FILES.languages, svg.languages)
  writeFileSync(FILES.activity, svg.activity)
  console.log('卡片已生成：' + Object.values(FILES).join(' / '))

  const readme = readFileSync(README, 'utf8')
  let next = replaceBlock(readme, STATS.start, STATS.end, statsBlock(data))
  next = replaceBlock(next, CARDS.start, CARDS.end, cardsBlock())
  if (next === readme) {
    console.log('README 无变化')
  } else {
    writeFileSync(README, next, 'utf8')
    console.log('README 已更新')
  }

  if (process.env.NO_COMMIT === '1') {
    console.log('NO_COMMIT=1，跳过提交')
    return
  }
  const git = (...args) => execFileSync('git', args, { stdio: 'inherit' })
  try {
    git('add', README, 'data/profile-data.json', FILES.overview, FILES.languages, FILES.activity)
    git('-c', 'user.name=123caiji', '-c', 'user.email=166346449+123caiji@users.noreply.github.com', 'commit', '-m', 'chore(profile): 刷新主页数据与 SVG 卡片')
    git('push')
    console.log('已提交并推送')
  } catch (e) {
    console.log('git 步骤跳过（通常表示无变更）：' + String(e.message).split('\n')[0])
  }
}

main().catch(error => {
  console.error('profile-stats failed:', error)
  process.exit(1)
})