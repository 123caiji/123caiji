/** 自绘 SVG 卡片（无第三方服务，纯字符串拼 SVG） */
const FONT = "'Segoe UI', 'PingFang SC', 'Microsoft YaHei', -apple-system, Helvetica, Arial, sans-serif"
const MONO = "'JetBrains Mono', 'Cascadia Code', Consolas, monospace"
const C = { bg1: '#0d1117', bg2: '#161b22', text: '#e6edf3', dim: '#8b949e', faint: '#6e7681', blue: '#58a6ff', green: '#3fb950', purple: '#bc8cff', amber: '#d29922', pink: '#f778ba' }
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const nz = v => (v === null || v === undefined ? '—' : v)

const wrap = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg1}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#58a6ff"/><stop offset="1" stop-color="#bc8cff"/></linearGradient>
    <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1f6feb" stop-opacity=".5"/><stop offset=".5" stop-color="#8957e5" stop-opacity=".4"/><stop offset="1" stop-color="#238636" stop-opacity=".5"/></linearGradient>
  </defs>
  <rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="14" fill="url(#bg)" stroke="url(#stroke)"/>
  ${body}
</svg>
`

function overview (D, avatar) {
  const W = 830; const H = 200
  const stats = [['仓库', nz(D.repos), C.blue], ['Star', nz(D.stars), C.amber], ['关注者', nz(D.followers), C.pink], ['近一年提交', nz(D.commitsYear), C.green], ['近一年贡献', nz(D.totalContributions), C.purple]]
  let b = ''
  if (avatar) {
    b += `<circle cx="76" cy="100" r="40" fill="#161b22" stroke="url(#accent)" stroke-width="2"/>`
    b += `<clipPath id="av"><circle cx="76" cy="100" r="36"/></clipPath><image x="40" y="64" width="72" height="72" clip-path="url(#av)" href="data:image/png;base64,${avatar}"/>`
  }
  b += `<text x="140" y="74" font-family="${FONT}" font-size="21" font-weight="700" fill="${C.text}">${esc(D.name)}</text>`
  b += `<text x="140" y="96" font-family="${FONT}" font-size="12.5" fill="${C.dim}">@${esc(D.login)} · AI Agent 工程 · 安全研究 · DSH 插件开发</text>`
  b += `<text x="140" y="116" font-family="${MONO}" font-size="11" fill="${C.faint}">${esc(String(D.generatedAt).slice(0, 10))} 自动刷新</text>`
  stats.forEach(([label, val, color], i) => {
    const x = 140 + i * 132
    b += `<text x="${x}" y="158" font-family="${FONT}" font-size="25" font-weight="700" fill="${color}">${esc(val)}</text>`
    b += `<text x="${x}" y="178" font-family="${FONT}" font-size="11" fill="${C.dim}">${label}</text>`
  })
  b += `<circle cx="${W - 40}" cy="40" r="70" fill="url(#accent)" opacity=".06"/>`
  return wrap(W, H, b)
}

const LANG_COLOR = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', CSS: '#563d7c', HTML: '#e34c26', Shell: '#89e051', Vue: '#41b883', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Go: '#00ADD8', Rust: '#dea584', Dockerfile: '#384d54', PowerShell: '#012456', Batchfile: '#C1F12E', Makefile: '#427819', Ruby: '#701516', PHP: '#4F5D95', 'Jupyter Notebook': '#DA5B0B' }

function languages (D) {
  const W = 830; const H = 200
  const x0 = 28; const barW = W - 56; const barY = 78; const barH = 16
  const langs = D.languages || []
  if (!langs.length) return wrap(W, H, `<text x="28" y="40" font-family="${FONT}" font-size="14" font-weight="700" fill="${C.text}">语言构成</text><text x="28" y="90" font-family="${FONT}" font-size="12" fill="${C.dim}">暂无数据</text>`)
  const sum = langs.reduce((s, l) => s + l.pct, 0) || 1
  let b = `<text x="${x0}" y="40" font-family="${FONT}" font-size="14" font-weight="700" fill="${C.text}">语言构成 · Top Languages</text>`
  b += `<text x="${W - 28}" y="40" text-anchor="end" font-family="${FONT}" font-size="11" fill="${C.faint}">按代码字节占比（近 25 个自有仓库）</text>`
  let cx = x0
  b += `<clipPath id="barclip"><rect x="${x0}" y="${barY}" width="${barW}" height="${barH}" rx="8"/></clipPath><g clip-path="url(#barclip)">`
  langs.forEach(l => {
    const w = (l.pct / sum) * barW
    b += `<rect x="${cx.toFixed(2)}" y="${barY}" width="${Math.max(w, 0.6).toFixed(2)}" height="${barH}" fill="${LANG_COLOR[l.name] || '#8b949e'}"/>`
    cx += w
  })
  b += '</g>'
  langs.forEach((l, i) => {
    const col = i % 4; const row = Math.floor(i / 4)
    const x = x0 + col * 200; const y = 132 + row * 28
    b += `<circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${LANG_COLOR[l.name] || '#8b949e'}"/>`
    b += `<text x="${x + 16}" y="${y}" font-family="${FONT}" font-size="12.5" fill="${C.text}">${esc(l.name)}</text>`
    b += `<text x="${x + 188}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11.5" fill="${C.dim}">${l.pct.toFixed(1)}%</text>`
  })
  return wrap(W, H, b)
}

function activity (D) {
  const W = 830; const H = 232
  const cell = 11; const gap = 3; const step = cell + gap
  const x0 = 66; const y0 = 74
  const weeks = (D.calendar && D.calendar.weeks) || []
  let b = `<text x="28" y="40" font-family="${FONT}" font-size="14" font-weight="700" fill="${C.text}">贡献热力图 · 近一年</text>`
  if (!weeks.length) {
    b += `<text x="28" y="90" font-family="${FONT}" font-size="12" fill="${C.dim}">贡献数据暂不可用（GraphQL 取不到时自动跳过，下次刷新会重试）</text>`
    return wrap(W, H, b)
  }
  const colors = D.calendar.colors && D.calendar.colors.length >= 5 ? D.calendar.colors : ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
  const level = n => n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4
  b += `<text x="${W - 28}" y="40" text-anchor="end" font-family="${FONT}" font-size="11" fill="${C.faint}">共 <tspan fill="${C.green}" font-weight="700">${nz(D.totalContributions)}</tspan> 次贡献 · ${nz(D.commitsYear)} 次提交 · ${nz(D.prsYear)} 个 PR</text>`
  let lastMonth = -1
  weeks.forEach((w, i) => {
    const first = w[0] ? new Date(w[0][0]) : null
    if (!first) return
    const m = first.getMonth()
    if (m !== lastMonth) {
      lastMonth = m
      if (i < weeks.length - 1) b += `<text x="${x0 + i * step}" y="${y0 - 8}" font-family="${FONT}" font-size="9.5" fill="${C.faint}">${['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'][m]}</text>`
    }
  })
  ;[[1, '一'], [3, '三'], [5, '五']].forEach(([d, t]) => {
    b += `<text x="${x0 - 8}" y="${y0 + d * step + cell - 2}" text-anchor="end" font-family="${FONT}" font-size="9.5" fill="${C.faint}">${t}</text>`
  })
  weeks.forEach((w, i) => {
    w.forEach(([date, n], j) => {
      b += `<rect x="${x0 + i * step}" y="${y0 + j * step}" width="${cell}" height="${cell}" rx="2.5" fill="${colors[level(n)]}"><title>${date} · ${n} 次</title></rect>`
    })
  })
  const ly = y0 + 7 * step + 18
  b += `<text x="28" y="${ly}" font-family="${FONT}" font-size="10.5" fill="${C.faint}">少</text>`
  for (let i = 0; i < 5; i++) b += `<rect x="${48 + i * (cell + 3)}" y="${ly - 9}" width="${cell}" height="${cell}" rx="2.5" fill="${colors[i]}"/>`
  b += `<text x="${48 + 5 * (cell + 3) + 4}" y="${ly}" font-family="${FONT}" font-size="10.5" fill="${C.faint}">多</text>`
  let cur = 0; let best = 0; let run = 0
  const days = weeks.flat()
  for (const [, n] of days) { if (n > 0) { run++; best = Math.max(best, run) } else run = 0 }
  for (let i = days.length - 1; i >= 0; i--) { if (days[i][1] > 0) cur++; else break }
  b += `<text x="${W - 28}" y="${ly}" text-anchor="end" font-family="${FONT}" font-size="10.5" fill="${C.dim}">当前连续 <tspan fill="${C.amber}" font-weight="700">${cur}</tspan> 天 · 最长连续 <tspan fill="${C.amber}" font-weight="700">${best}</tspan> 天 · 生成于 ${esc(String(D.generatedAt).slice(0, 10))}</text>`
  return wrap(W, H, b)
}

export function renderCards (D, avatarBase64) {
  return { overview: overview(D, avatarBase64), languages: languages(D), activity: activity(D) }
}
