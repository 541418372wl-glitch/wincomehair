# WINCOME Hair 项目隔离规则

本文件只适用于站点 `wincomehair`。任何任务开始前都必须先完成身份核验；无法唯一确认时立即停止，不得自行选择仓库、Vercel 项目、域名或账号。

## 唯一身份映射

- 站点唯一标识：`wincomehair`
- 网站/品牌：`WINCOME Hair Accessories`
- GitHub 仓库：`541418372wl-glitch/wincomehair`
- 默认分支：`main`
- Vercel 团队：`wincomeapparel`（Team ID `team_kQrTQCXhwXAb4nJXorQwjctr`）
- Vercel 项目：`wincomehair`（Project ID `prj_7GrXo3HliVz9GRGfzF3xJP1oyWzf`）
- 生产域名：`https://wincomehair.com`
- 规范主机名：`wincomehair.com`
- 辅助域名：`www.wincomehair.com`（重定向至主域名）、`wincomehair.vercel.app`
- Cloudflare Zone：`wincomehair.com`；Cloudflare Account/Zone ID 每次操作前仍须只读确认
- 公开网站资料：仓库内 `public/`、`src/data/`、`src/pages/`、`src/components/`
- 私有资料：当前 Codex 项目容器的 `.private/`，必须位于公开 Git 仓库之外；绝对路径每台设备重新确认
- 项目交接文件：仓库根目录 `PROJECT_HANDOFF.md`
- 跨设备唯一协同台账：`541418372wl-glitch/wincomehair` Issue #14

## 明确禁止的其他站点

不得读取、复制或修改下列其他项目的文件、仓库、Vercel 配置或资料：

- Codex 项目/本地目录：`wincomeapparel` / `E:\Codex`（该绝对路径仅为当前设备观察值）
- GitHub/Vercel 项目：`541418372wl-glitch/wincome-apparel-site` / `wincome-apparel-site`
- GitHub/Vercel 项目：`541418372wl-glitch/torqmont-site` / `torqmont-site`
- 任何不在上述唯一身份映射中的仓库、Vercel 项目、域名、Cloudflare Zone 或数据库

看到多个连接器目标时，只能使用本文件中完整列出的目标。禁止使用“这个仓库”“最新项目”“那个网站”等模糊目标。

## 每次任务开始前的只读检查

1. 确认 Codex 项目标签为 `wincomehair`，并记录当前项目容器路径。
2. 运行并记录当前目录、`git rev-parse --show-toplevel`、`git status --short --branch`、当前分支和 `git remote -v`。
3. 确认 remote 精确为 `https://github.com/541418372wl-glitch/wincomehair.git`。
4. 只读确认 GitHub 仓库、默认分支、远程 main SHA 和开放 PR。
5. 完整读取 Issue #14 正文及全部评论，先查重再工作。
6. 只读确认 Vercel 团队 `wincomeapparel`、项目 `wincomehair`、Project ID、Production 部署和绑定域名。
7. Cloudflare 相关任务必须确认 Zone 精确为 `wincomehair.com`，并确认当前账号/Zone ID；未验证不得操作。
8. 读取本文件和 `PROJECT_HANDOFF.md`，不得覆盖更严格的安全、隐私、内容真实性或发布规则。
9. 检查网站名称、Logo、邮箱、canonical、Organization Schema 和生产域名均属于 WINCOME Hair。
10. 任一身份不一致或不可验证时立即停止，标注“未验证”并向用户索取精确目标。

## 文件与资料隔离

- 只能读取或修改当前 `wincomehair` Git 根目录内的文件；本地私有资料只能使用当前 Codex 项目容器的 `.private/`。
- 不得读取其他 Codex 项目、本地目录或 worktree 的内容来补充本站资料。
- 不得复制其他网站的图片、Logo、文案、产品、证书、公司资料、客户资料、法律条款或 Schema。
- 不得共用或复制其他网站的 `.env`、环境变量、GA4/GTM/GSC 标识、广告像素、表单端点、收件邮箱、API 密钥、Token、Cookie、验证码、登录凭证、sitemap 或 canonical。
- 不得根据 WINCOME Apparel、TORQMONT 或其他公司/站点推断本站资质、工厂、认证、客户、市场范围或共享基础设施。
- 跨站比较默认只读；如多个站采用同一规范，必须分别建立任务、分支和 PR。

## 隐私与敏感数据

公开仓库禁止保存：

- 密码、Token、Cookie、验证码、Deploy Hook URL、数据库连接串或任何密钥
- 客户身份、询盘、订单、联系方式或消息正文
- 供应商身份、报价、成本、利润和商业条件
- 原始 GA4/GSC 导出、后台截图或未经批准的分析明细
- 私有证书原件、内部产品资料或未批准声明

`.env.example` 只能包含变量名和无敏感性的占位说明，不能包含真实值。临时数据使用 `.private/`，任务完成后删除不再需要的导出或截图；凭证不得保存到任何目录。

## 仓库与工具链治理

- npm 是唯一受支持的包管理器，`package-lock.json` 是唯一锁文件。未经单独批准的完整迁移，不得加入 Bun、pnpm 或 Yarn 锁文件/专属配置。
- `.accio/`、`.vercel/`、本地日志、PID、端口、旧设备绝对路径和其他运行时状态不得进入公开仓库。
- 禁止保留或新增绕过功能分支/PR、直接向 `main` 写 GitHub contents 或触发 Deploy Hook 的辅助脚本。
- `SETUP.md` 必须与当前 npm scripts、存储边界、环境变量名称和发布流程一致；不得引用不存在的脚本或旧平台发布流程。
- 仓库治理门禁 `scripts/check-repository-governance.mjs` 必须保留在 build/test 中；若要变更或移除，需在 PR 中说明替代保护措施。

## 内容真实性

- 只有用户确认或当前站点可验证的一手证据可以支持公司、工厂、资质、认证、客户、产能、年限和市场声明。
- `DESIGN.md`、旧文案、其他站点或模型生成内容不是公司事实来源。
- 当前源码存在 WINCOME Apparel“姊妹部门/共享基础设施”描述，本次治理核验未验证该关系；未经用户提供可核验证据，不得扩写、复用或用于 Schema/外联。
- 不得把占位图、AI 图或第三方图片描述为真实产品、工厂、证书或客户证据。
- 保留并执行现有内容信任、结构化数据、隐私和安全检查；不得为了 SEO/GEO/AI 推荐降低真实性标准。

## 修改、PR 与发布

1. 修改前再次确认当前目录、Git 根、remote、分支、Vercel 项目和生产域名。
2. 禁止直接修改 `main`；使用 `agent/<wincomehair-task>` 专属功能分支。
3. 不覆盖用户已有的未提交修改；发现脏工作树时先评估并隔离。
4. 提交前检查 `git diff --check`、`git diff --stat` 和完整 diff，确认所有文件都属于本站任务。
5. PR 必须使用完整仓库名 `541418372wl-glitch/wincomehair`，base 必须为 `main`。
6. 预览部署前检查品牌、Logo、邮箱、canonical、Schema 和域名；不得使用其他站点的预览作为本站证据。
7. 合并 main、Production 部署、域名/DNS、环境变量、数据库写入或迁移、删除操作、GSC 提交、测试询盘和任何外联都需要用户明确批准。
8. 未获发布授权时，只能保留本地分支、测试结果和草稿 PR；不得合并或正式部署。
9. 每次诊断或实际工作结束后，按既有格式写回 Issue #14，记录时间、设备/任务、线上基线、完成/未执行动作、PR/commit/deployment/GSC/GA4/Supabase 证据、防重复事项、下一步和审批状态。

## 本地路径规则

设备本地路径不是跨设备身份。每次运行都必须重新解析 Codex 项目容器和 Git 根；不得因为路径中出现 `wincomehair` 就跳过 GitHub、Vercel和域名核验。
