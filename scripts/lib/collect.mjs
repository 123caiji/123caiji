/**
 * 采集主页数据（全部走公开 GitHub API，Actions 里用内置 GITHUB_TOKEN 即可）
 */
const API = 'https://api.github.com'

export async function collectData ({ owner, token }) {
  const H = { accept: 'application/vnd.github+json', 'user-agent': owner + '-profile-cards', ...(token ? { authorization: 'Bearer ' + token } : {}) }
  const api = async p => {
    const r = await fetch(API + p, { headers: H })
    const t = await r.text()
    if (!r.ok) throw new Error('GET ' + p + ' -> ' + r.status + ' ' + t.slice(0, 160))
    return t ? JSON.parse(t) : null
  }
  const gql = async (q, v) => {
    const r = await fetch(API + '/graphql', { method: 'POST', headers: { ...H, 'content-type': 'application/json' }, body: JSON.stringify({ query: q, variables: v }) })
    const j = await r.json()
    if (j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors).slice(0, 300))
    return j.data
  }

  const user = await api('/users/' + owner)
  const repos = await api('/users/' + owner + '/repos?type=owner&sort=pushed&per_page=100')
  const own = repos.filter(r => !r.fork)

  // 贡献日历 + 汇总（公开数据，无需用户授权）
  let u = null
  try {
    const g = await gql(`query($login:String!){ user(login:$login){ name followers{totalCount} following{totalCount} repositories(privacy:PUBLIC){totalCount} contributionsCollection{ totalCommitContributions totalPullRequestContributions totalIssueContributions contributionCalendar{ totalContributions colors weeks{ contributionDays{ date contributionCount } } } } } }`, { login: owner })
    u = g.user
  } catch (e) {
    console.log('warn: 贡献日历取不到（' + e.message.slice(0, 120) + '），将跳过热力图')
  }

  // 语言聚合（按仓库字节占比）
  const langs = {}
  for (const r of own.slice().sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 25)) {
    try {
      const l = await api('/repos/' + r.full_name + '/languages')
      const tot = Object.values(l).reduce((s, v) => s + v, 0) || 1
      for (const [k, v] of Object.entries(l)) langs[k] = (langs[k] || 0) + v / tot
    } catch {}
  }
  const langTotal = Object.values(langs).reduce((s, v) => s + v, 0) || 1
  const langList = Object.entries(langs).map(([name, v]) => ({ name, pct: (v / langTotal) * 100 })).sort((a, b) => b.pct - a.pct).slice(0, 8)

  // 近 7 / 30 天提交
  const since7 = new Date(Date.now() - 7 * 864e5).toISOString()
  const since30 = new Date(Date.now() - 30 * 864e5).toISOString()
  let c7 = 0; let c30 = 0
  for (const r of own.slice(0, 15)) {
    try {
      c7 += (await api('/repos/' + r.full_name + '/commits?since=' + since7 + '&per_page=100')).length
      c30 += (await api('/repos/' + r.full_name + '/commits?since=' + since30 + '&per_page=100')).length
    } catch {}
  }

  const cal = u && u.contributionsCollection.contributionCalendar
  return {
    generatedAt: new Date().toISOString(),
    login: owner,
    name: (u && u.name) || user.name || owner,
    avatar: user.avatar_url,
    followers: u ? u.followers.totalCount : user.followers,
    following: u ? u.following.totalCount : 0,
    repos: u ? u.repositories.totalCount : user.public_repos,
    stars: own.reduce((s, r) => s + r.stargazers_count, 0),
    forks: own.reduce((s, r) => s + r.forks_count, 0),
    commits7: c7,
    commits30: c30,
    totalContributions: cal ? cal.totalContributions : null,
    commitsYear: u ? u.contributionsCollection.totalCommitContributions : null,
    prsYear: u ? u.contributionsCollection.totalPullRequestContributions : null,
    issuesYear: u ? u.contributionsCollection.totalIssueContributions : null,
    calendar: cal ? { colors: cal.colors, weeks: cal.weeks.map(w => w.contributionDays.map(d => [d.date, d.contributionCount])) } : { colors: [], weeks: [] },
    languages: langList,
    recent: own.slice().sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at)).slice(0, 5).map(r => ({ name: r.name, full: r.full_name, desc: r.description || '', pushedAt: r.pushed_at, stars: r.stargazers_count, lang: r.language })),
  }
}
