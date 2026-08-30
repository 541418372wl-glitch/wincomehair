# WINCOME Hair 项目交接

更新时间：2026-08-30（Asia/Shanghai）

## 当前身份映射

| 项目 | 已验证值 | 证据/状态 |
|---|---|---|
| Codex 项目 | `wincomehair` | Codex 项目列表；当前设备容器为 `E:\wincomehair`，仅作设备观察值 |
| 品牌/网站 | `WINCOME Hair Accessories` | 线上页面、`index.html`、manifest、SEO 配置一致 |
| GitHub | `541418372wl-glitch/wincomehair` | remote 与 GitHub 实时仓库元数据一致 |
| 默认分支 | `main` | GitHub 实时元数据 |
| 远程基线 | `bb148681440461971e8709d505926acaf344306f` | `Add flexible claw clip OEM guide` |
| 开放 PR | 0（核验时） | GitHub 只读查询；每次任务重新确认 |
| Vercel 团队 | `wincomeapparel` / `team_kQrTQCXhwXAb4nJXorQwjctr` | Vercel Dashboard 直接核验 |
| Vercel 项目 | `wincomehair` / `prj_7GrXo3HliVz9GRGfzF3xJP1oyWzf` | Project Settings 直接核验 |
| Production | `wincomehair-33zcbj4f5-wincomeapparel.vercel.app`，Ready，`main`，`bb14868` | Vercel Overview 直接核验 |
| 生产域名 | `wincomehair.com` | Vercel Valid Configuration / Production |
| 其他域名 | `www.wincomehair.com` → 308 `wincomehair.com`；`wincomehair.vercel.app` | Vercel Domains；`www` 显示 DNS Change Recommended，未修改 |
| Cloudflare Zone | `wincomehair.com` | 权威 NS：`diana.ns.cloudflare.com`、`joel.ns.cloudflare.com` |
| Cloudflare Account/Zone ID | 未验证 | 任何 Cloudflare 操作前必须在正确账号中只读确认 |
| 公开资料目录 | `public/`、`src/data/`、`src/pages/`、`src/components/` | 公开 GitHub 仓库中的站点内容和资产 |
| 私有资料目录 | 当前 Codex 项目容器 `.private/` | Git 仓库外、本地专属；绝对路径每台设备重验 |
| 远程协同台账 | GitHub Issue #14 | 开工前读取正文和全部评论，结束后按规定写回 |

## 当前本地 Git 状态

- 项目容器 `E:\wincomehair` 本身不是 Git 仓库。
- 旧副本 `.source-audit` 在 `main`，最终复核时相对 `origin/main` ahead 1、behind 34；不得在该 main 上继续开发或覆盖其本地提交。
- 本治理任务使用独立 worktree `.worktrees/project-isolation-governance`。
- 当前分支：`agent/project-isolation-governance`，基于 `origin/main` 的 `bb148681`。
- 本地路径仅为当前设备观察值，其他设备必须重新解析。

## 已完成的治理动作

- 建立根级 `AGENTS.md`，固化唯一身份、隔离、隐私、真实性、分支、审批和 Issue #14 记录规则。
- 建立本交接文件。
- 在 `.gitignore` 中忽略 `.private/`，防止私有资料误入公开仓库。
- 在 Codex 项目容器建立本地 `.private/` 使用说明；未存放客户、分析导出、证书或凭证。
- 未修改网站业务代码、内容、域名、DNS、环境变量、数据库或部署。

## 已发现风险与处理边界

1. Vercel 连接器曾只列出另一个项目，并对已知 Project ID 返回 404/403；Vercel Dashboard 直接核验确认 `wincomehair` 项目仍存在且身份一致。远程操作前不能只依赖不完整项目列表。
2. `www.wincomehair.com` 在 Vercel 显示 DNS Change Recommended；当前 308 指向主域名。本次不改 DNS，后续需单独诊断和明确授权。
3. Cloudflare Zone 名已由公共 DNS 验证，但账号与 Zone ID 未验证；不得执行 Cloudflare 写操作。
4. `src/pages/About.jsx` 存在 WINCOME Apparel“姊妹部门/共享基础设施”关系声明；本次未取得公司一手证据。不得把它作为新的资质、Schema、外联或跨站复制依据。
5. `DESIGN.md` 含编码异常和多项旧设计/公司声明，仅可作为历史设计草稿，不是事实来源。
6. Vercel Git 设置页面含 Deploy Hook；该 URL 具有触发部署能力，不得复制、记录或提交。用户截图只显示截断值，本治理文件未保存该值。

## 明确禁止接触的其他站点

- Codex 项目 `wincomeapparel`（当前设备观察路径 `E:\Codex`）
- `541418372wl-glitch/wincome-apparel-site` / Vercel `wincome-apparel-site`
- `541418372wl-glitch/torqmont-site` / Vercel `torqmont-site`
- 任何未在 `AGENTS.md` 唯一身份映射中列出的站点、仓库、项目、域名、Zone 或数据库

## 下一步与审批

- 本分支只包含治理文件；用户已于 2026-08-30 明确批准 commit、push 和创建草稿 PR，但未批准合并 `main` 或 Production 发布。
- 草稿 PR 建立后保持未合并；公司设备先读取 Issue #14 和该 PR，任何合并或正式发布仍需用户另行明确批准。
- Cloudflare账号/Zone ID和 `www` DNS建议应作为独立只读核验任务；任何修改需明确批准。
- 继续遵守 Issue #14 的 7/14/28 天 SEO/GEO 数据节奏，治理文件不会授权提前修改业务代码。
