# Contributing

Thank you for your interest in contributing!

## Before You Start

If you plan to make major changes (especially new features or design changes), please open an issue or discussion before starting work. This helps ensure your effort aligns with the project's direction.

## Submitting Code

Please keep each pull request focused on a single purpose. Avoid mixing unrelated changes in one PR, as this can make reviewing and merging code more difficult.

Please use the [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages whenever possible. This keeps our history clear and consistent.

Before submitting code, please run the appropriate commands to check for errors and format your code.

```bash
pnpm check
pnpm format
```

---

# 合作作者：在这个博客发文章

这一节是给 `darknight.website` 的协作者看的。**往 `main` 推送 = 直接上线**，没有中间审核环节，所以先看「红线」那一节。

## 环境

Node.js 22 + corepack（仓库用 `packageManager` 锁了 pnpm 9.14.4，本机不用单独装 pnpm）：

```bash
corepack enable
git clone https://github.com/0sleepingdragon0/darknightBlog.git
cd darknightBlog
corepack pnpm install
```

之后的所有命令都加 `corepack` 前缀，或先执行一次 `corepack enable` 让 `pnpm` 直接可用。

## 写一篇新文章

```bash
corepack pnpm new-post 我的文章.md      # 生成 src/content/posts/我的文章.md
corepack pnpm dev                       # 本地预览，http://localhost:4321
```

`new-post` 只填 8 个字段（title / published / description / image / tags / category / draft / lang）。**剩下这几个要自己补，不补会出问题**：

| 字段 | 不写会怎样 |
| --- | --- |
| `author` | 署名回落到站长的名字 `darknight`，别人以为是你替他写的 |
| `imageColor` | 文章卡片的封面取色丢失，卡片配色和其他文章不一致 |
| `licenseName` / `licenseUrl` | 文末授权声明为空（本站内容默认 `CC BY-NC-SA 4.0`） |
| `aiPolished` | 默认 `true`，即文章会被标记成「AI 润色过」；纯手写的请显式写 `false` |

字段全集在 `src/content.config.ts`，`published` 必须是 `YYYY-MM-DD`。

## 绝对不要用的命令

`corepack pnpm post-studio`（浏览器里的那个编辑器）。它会按一张写死的字段表重建 frontmatter，**静默丢掉 `imageColor`、`aiPolished`、`aiSummary`、`pinnedOrder` 四个字段**，界面上没有任何提示，只有 `git diff` 能看出来。改文章直接用编辑器改 `.md` 文件。

## 图片等静态文件

放到 `public/assets/images/...`。注意 **`public/` 不在 `.gitignore` 里**，一提交就进了公开仓库、全世界可读——私密密、截图里的账号信息、内网地址都别往这里丢。

## 红线

推上去就公开，且很难彻底删干净（搜索引擎、归档站、别人已经 fork）。所以：

1. **不写任何服务器地址、面板地址、SSH 用户名、密码、token**——包括私网 IP 和「某个端口上跑着什么」。本站历史上有过一次性暴露真实 IP + 面板入口的事故，清洗过一轮。
2. **文字必须是你自己写的**。不转载、不改写别人的博客；装饰性图片用可商用素材。
3. **音乐/字体等素材要有授权**（CC BY、公共领域、或你自己做的），并注明来源。未授权的翻录会被直接下架。
4. 改动 `src/config/` 下的站点级配置（域名、字体、背景、友链）之前先跟站长说一声。

## 上线、失败、回滚

推送 `main` 后 GitHub Actions 会跑 [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)：先 `pnpm check` + `pnpm type-check`（frontmatter 不合法在这里就会被挡下），再 `pnpm build`，最后用 wrangler 直传到 Cloudflare Pages。

- 检查或构建失败 → **不会上线**，线上还是上一版。看 Actions 日志改完再推。
- 成功 → 一般几十秒生效；偶尔自定义域名会有边缘缓存延迟几分钟，`https://darknight-alp.pages.dev` 先看那个地址能确认是不是真上去了。
- 写错了想撤回：`git revert <commit>` 再推送，Actions 会把上一版重新发一遍。**不要 `git push --force` 改写历史**。

第一次提交建议只写一小段草稿（`draft: true` 不会出现在线上），确认整条链路跑通再发正文。
