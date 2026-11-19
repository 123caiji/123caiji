<h1 align="center">你好，我是 <a href="https://github.com/123caiji">123caiji</a></h1>
<p align="center">
  <em>AI Agent 工程 · 安全研究 · DeepSeek Harness 插件开发</em>
</p>

<p align="center">
  <a href="https://123caiji.github.io/"><img src="https://img.shields.io/badge/Blog-123caiji.github.io-2f81f7?style=flat-square&logo=jekyll&logoColor=white" alt="blog" /></a>
  <img src="https://img.shields.io/badge/Focus-AI%20Agent%20%26%20Security-3fb950?style=flat-square" alt="focus" />
  <a href="https://123caiji.github.io/ai-world/"><img src="https://img.shields.io/badge/AI%20%E5%A4%A7%E4%B8%96%E7%95%8C-%E5%AE%9E%E6%97%B6%E6%83%85%E6%8A%A5%E7%AB%99-8957e5?style=flat-square" alt="ai-world" /></a>
  <img src="https://komarev.com/ghpvc/?username=123caiji&style=flat-square&color=2f81f7" alt="profile views" />
</p>

<!-- STATS:START -->

**最近在更新**（2026-11-19 自动刷新）

| 仓库 | 说明 | 最后更新 |
| --- | --- | --- |
| [awesome-agent-security](https://github.com/123caiji/awesome-agent-security) | AI Agent security tooling + DeepSeek Harness plugin ecosystem, curated and auto-refreshed daily by GitHub Actions. | 今天 |
| [ai-world](https://github.com/123caiji/ai-world) | AI 大世界 · 实时 AI 情报站：新闻/论文/新模型/GitHub 涨星/DSH 插件，61 个数据源每 165 分钟自动扫描（自愈链，无需人管），每条都带可核验来源 | 今天 |
| [123caiji](https://github.com/123caiji/123caiji) | GitHub profile README with live stats and an auto-generated contribution snake. | 今天 |
| [rea](https://github.com/123caiji/rea) | Mirror of morluto/rea | 6 天前 |
| [kangyang-digital-twin](https://github.com/123caiji/kangyang-digital-twin) | kangyang-digital-twin graduation project | 6 天前 |

<sub>公开仓库 44 个 · star 合计 22 · 关注者 5 · 近 7 天提交 124 次 · 近一年贡献 698 次</sub>

<!-- STATS:END -->

## 数据

<!-- CARDS:START -->

<p align="center">
  <img src="./metrics-overview.svg" alt="账号总览" />
</p>

<p align="center">
  <img src="./metrics-languages.svg" alt="语言构成" />
</p>

<p align="center">
  <img src="./metrics-activity.svg" alt="贡献热力图" />
</p>

<!-- CARDS:END -->

<!-- 贪吃蛇：由 .github/workflows/snake.yml 每天生成，写到 output 分支 -->
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/123caiji/123caiji/output/github-contribution-grid-snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/123caiji/123caiji/output/github-contribution-grid-snake.svg" />
    <img alt="github contribution grid snake" src="https://raw.githubusercontent.com/123caiji/123caiji/output/github-contribution-grid-snake.svg" />
  </picture>
</p>

<sub>上面三张卡片由本仓库的 <a href="./scripts/profile-stats.mjs">scripts/profile-stats.mjs</a> 每天用 GitHub API 现算现画（自绘 SVG，存仓库里，不依赖任何第三方图片服务，所以不会破图）；贡献格贪吃蛇由 <a href="https://github.com/Platane/snk">Platane/snk</a> 每天生成。卡片灵感来自 <a href="https://github.com/lowlighter/metrics">lowlighter/metrics</a>。</sub>

## 四个方向

> 仓库按方向归口，找东西先看这里。不在四轴里的是临时参考，不定期清。

### 🎯 狩猎 · Bug Hunting / 红队

| 仓库 | 说明 |
| --- | --- |
| [security-research-toolkit](https://github.com/123caiji/security-research-toolkit) | **自建**：侦察 + SQLi / SSRF / XSS 验证取证 |
| [cve-poc](https://github.com/123caiji/cve-poc) | 精选 CVE PoC（48 条：Full 8 / Partial 28 / No target 9 / Pending 3），每条钉死上游 commit 并附证据日志 |
| [Claude-BugHunter](https://github.com/123caiji/Claude-BugHunter) | 82 skills / 15 slash commands / 681 条已披露报告模式，覆盖 24 类漏洞 |
| [sapper-v2](https://github.com/123caiji/sapper-v2) | 自主渗透军团：指挥 agent + worker 集群 + 事实-意图图 |
| [vero](https://github.com/123caiji/vero) | 证据驱动的自主红队 agent |
| [chronos](https://github.com/123caiji/chronos) | 纯 Go 极简 agentic offensive security：0 skill / 0 RAG / 0 MCP |
| [Bad-Guy](https://github.com/123caiji/Bad-Guy) | 结构化安全能力知识库 + Agent 可执行技能 |
| [Code-Audit](https://github.com/123caiji/Code-Audit) | Java / PHP 白盒审计 skills，EVID 证据合约 |
| [ARTEX-contrib](https://github.com/123caiji/ARTEX-contrib) | 多 agent 自主渗透，每条 finding 绑定资产与 HTTP 流量证据 |
| [term3-lab](https://github.com/123caiji/term3-lab) | Web 攻防课程靶场（Python + SQLite，免 Docker） |
| [CTF-MCP](https://github.com/123caiji/CTF-MCP) | 126 个 Web / Crypto / Pwn 工具的 MCP server |

### 🔍 搜索 · 情报搜集 / OSINT

| 仓库 | 说明 |
| --- | --- |
| [ai-world](https://github.com/123caiji/ai-world) | **自建**：61 个数据源 / 每 165 分钟一轮的自愈链情报站，每条带可核验来源 |
| [Github-API-scan](https://github.com/123caiji/Github-API-scan) | 扫 GitHub 与本地 git 里泄漏的 AI API key（50+ 平台），配对 relay 并验证还能不能用 |

> 这条轴最薄。下一步要补的是资产测绘 / 指纹识别 / 采集框架，不是再多几个扫描器。

### 📡 IoT

| 仓库 | 说明 |
| --- | --- |
| [stm32-iot-smart-home](https://github.com/123caiji/stm32-iot-smart-home) | **自建**：STM32F103 + LoRa + FreeRTOS，含电路图与 IoT 平台搭建笔记 |
| [kangyang-digital-twin](https://github.com/123caiji/kangyang-digital-twin) | **自建**：数字孪生毕设，Vue + MQTT |

> 缺口在固件与协议安全：固件解包、MQTT / CoAP 攻击面、设备影子越权。

### 🤖 Agent · Agent 安全 & DSH 插件

| 仓库 | 说明 |
| --- | --- |
| [dsh-live](https://github.com/123caiji/dsh-live) | **自建**：会话现场驾驶舱 |
| [dsh-memory-toolkit](https://github.com/123caiji/dsh-memory-toolkit) | **自建**：Agent 长期记忆，图记忆 + 向量检索 + token 优化 |
| [awesome-agent-security](https://github.com/123caiji/awesome-agent-security) | **自建**：Agent 安全 + DSH 生态精选，每日自动刷新 |
| [AI-LLM-Agent-Learning](https://github.com/123caiji/AI-LLM-Agent-Learning) | **自建**：RAG / MCP / LangGraph / 提示工程 |
| [AutoRedTeam-Orchestrator](https://github.com/123caiji/AutoRedTeam-Orchestrator) | 本地 MCP / AI 攻击面审计 + 证据门禁（★271） |
| [catchclaw](https://github.com/123caiji/catchclaw) | 9 个 AI Agent 平台的安全评估，78 条 DAG 攻击链 |
| [LLM-Security-Assessment-Framework](https://github.com/123caiji/LLM-Security-Assessment-Framework) | FORGEDAN：6 种攻击方法 / 18 个模型适配器 |
| [coffee-skill](https://github.com/123caiji/coffee-skill) | Codex / AgentSkills 可验证工作流包 |

## 参考（学习用，不常动）

`anatomy` · `craft-anything` · `kb-graph` · `DeepInfer` · `deepseek-harness` · `magpie` · `dsh-recommend` · `rea` · `toolkit` · `manuals` · `teorias-numeradas` · `agens-harness`
