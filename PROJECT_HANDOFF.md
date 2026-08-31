# WINCOME Hair 项目交接

更新时间：2026-08-31（Asia/Shanghai）

## 当前身份映射

| 项目 | 已验证值 | 证据/状态 |
|---|---|---|
| Codex 项目 | `wincomehair` | 当前设备项目容器为 `E:\wincomehair`；路径只作本设备观察值 |
| 品牌/网站 | `WINCOME Hair Accessories` | 线上页面、Logo、邮箱、canonical、manifest 和 SEO 配置一致 |
| GitHub | `541418372wl-glitch/wincomehair` | remote 与 GitHub 实时仓库元数据一致 |
| 默认分支 | `main` | GitHub 实时元数据 |
| 最近核验的远程基线 | `22c0dc7b9af17e7641ba85afbc56e606d06932ca` | `Add project isolation governance (#17)`；每次任务仍须重查 |
| 开放 PR | 0（2026-08-31 维护任务开始时） | 每次任务重新确认，不把本行当作永久事实 |
| Vercel 团队 | `wincomeapparel` / `team_kQrTQCXhwXAb4nJXorQwjctr` | Vercel Dashboard 已直接核验 |
| Vercel 项目 | `wincomehair` / `prj_7GrXo3HliVz9GRGfzF3xJP1oyWzf` | Project Settings 已直接核验 |
| Production | `main` / `22c0dc7` 对应部署成功 | GitHub Deployment success；Vercel connector 权限不完整时不得猜测 runtime logs |
| 生产域名 | `https://wincomehair.com` | 正式站实时可用、canonical 一致 |
| 其他域名 | `www.wincomehair.com` → 308 主域；`wincomehair.vercel.app` | `www` 曾显示 DNS Change Recommended；未修改 |
| Cloudflare Zone | `wincomehair.com` | 权威 NS：`diana.ns.cloudflare.com`、`joel.ns.cloudflare.com` |
| Cloudflare Account/Zone ID | 未验证 | 任何 Cloudflare 操作前必须在正确账号中只读确认 |
| Supabase | `wincomehair` / `bwozmphfjsorupvnucvk` | 询盘与限流数据只允许在该项目中处理 |
| 公开资料目录 | `public/`、`src/data/`、`src/pages/`、`src/components/` | 公开 GitHub 仓库中的站点内容和资产 |
| 私有资料目录 | 当前 Codex 项目容器 `.private/` | Git 仓库外、本地专属；绝对路径每台设备重验 |
| 远程协同台账 | GitHub Issue #14 | 开工前读取正文和全部评论，结束后按规定写回 |

## 当前本地 Git 说明

- 项目容器 `E:\wincomehair` 本身不是 Git 仓库。
- 当前可用 Git 根是 `E:\wincomehair\.worktrees\project-isolation-governance`；设备变化时必须重新解析，不能把该路径作为跨设备身份。
- 2026-08-31 仓库维护从最新 `origin/main` 创建专属分支 `agent/repo-code-governance-maintenance-20260831`，不得直接在 `main` 开发。
- 旧副本或其他 worktree 不得用于补充本项目资料，也不得覆盖远程 main。

## 已完成的治理动作

- PR #17 已合并到 main：建立根级 `AGENTS.md`、本交接文件和 `.private/` 忽略规则。
- 固化唯一身份、跨站隔离、隐私、内容真实性、分支/PR、审批和 Issue #14 写回规则。
- 2026-08-31 仓库维护批次统一采用 npm 与 `package-lock.json`，移除旧 Accio 运行残留、旧设备直写 main 脚本及替代锁文件。
- `SETUP.md` 已改为当前项目的真实安装、环境变量、存储边界和发布流程。
- 新增 repository-governance 构建/测试门禁，防止旧工具链、危险脚本和错误环境变量说明回归。

## 当前数据与观察基线

- 2026-08-28 认证 GSC 窗口（Web，2026-08-02～08-25）：5 clicks、805 impressions、CTR 0.6%、平均排名 18.8；37 indexed / 28 not indexed。
- 2026-08-28 认证 GA4 窗口（All users，2026-07-31～08-27）：133 active、132 new、AI Assistant 23 new；reported lead 0。
- Supabase 精确统计为 10 条询盘，用户已确认 10/10 真实；不得再询问真实性或发送测试询盘。GA4 0 lead 与该业务结果之间仍有测量缺口。
- 下一次同口径数据节点为 2026-09-05，28 天决策节点为 2026-09-19；仓库治理工作不得被误当作 SEO 效果改动。

## 已知风险与处理边界

1. Vercel connector 曾返回不完整项目列表或 403/404；远程操作前必须用精确团队、项目 ID、GitHub Deployment 和正式域交叉核验。
2. `www.wincomehair.com` 曾显示 DNS Change Recommended；当前可正确 308 到主域。DNS 修改需单独诊断和明确授权。
3. Cloudflare Zone 名已由公共 DNS 验证，但账号与 Zone ID 未验证；不得执行 Cloudflare 写操作。
4. `src/pages/About.jsx` 存在 WINCOME Apparel“姊妹部门/共享基础设施”关系声明；当前单站证据未单独验证。不得扩写、复用到 Schema/外联或作为跨站复制依据。
5. `DESIGN.md` 含编码异常和旧设计/公司声明，只能作为历史设计草稿，不是事实来源。
6. Vercel Deploy Hook 是敏感部署触发信息；不得复制、记录、提交或触发。
7. Dependabot alerts 尚未启用，Code Scanning 尚无分析；Secret Scanning 最近核验开放告警为 0。零告警不能替代依赖/代码安全扫描。
8. Chrome DevTools MCP 尚不可用；真实移动端 Core Web Vitals 和浏览器级无障碍结果仍是未验证项。

## 明确禁止接触的其他站点

- Codex 项目 `wincomeapparel`（当前设备观察路径 `E:\Codex`）
- `541418372wl-glitch/wincome-apparel-site` / Vercel `wincome-apparel-site`
- `541418372wl-glitch/torqmont-site` / Vercel `torqmont-site`
- 任何未在 `AGENTS.md` 唯一身份映射中列出的站点、仓库、项目、域名、Zone 或数据库

## 后续审批

- 功能分支可以在用户授权范围内准备、测试、提交、推送和创建 PR；PR 必须以 `541418372wl-glitch/wincomehair` 的 `main` 为 base。
- 合并 main、Production、环境变量、数据库、域名/DNS、GSC/IndexNow、测试询盘和外联仍需逐项明确授权。
- 当前仓库维护 PR 只处理工具链、文档、忽略规则和治理门禁，不修改页面内容、SEO/GEO 文案、询盘数据库或生产配置。
- 任何设备继续工作前，先读取 Issue #14 的最新评论，不得仅依赖本文件中的时间点基线。
