---
title: 怎么写文章并发布
published: 2026-11-01
description: 给自己用的操作手册——新增一篇文章、改配置、上线的完整步骤。
aiPolished: false
image: /assets/images/wallpaper/darknight-night-mobile.webp
imageColor: "#191f38"
tags: [随笔记录, 搭建]
category: 搭建
draft: false
lang: zh-CN
author: darknight
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
comment: false
---

以后忘了就查这篇。核心只有一句：**在本地改文件，然后 `npm run deploy:cf` 上线。**

域名走 Cloudflare Pages，服务器那份是 IP 直连的备用出口。平时只管 Cloudflare 这条，两边都要更新就再补一次 `git push`。

## 准备工作

博客源码在本地 `D:\服务器测试\blog`。远程仓库在服务器上：

```bash
cd /d/服务器测试/blog
git remote -v
# server  ssh://<user>@<server-ip>/srv/blog/git/blog.git (push)
```

如果显示的是这个，直接往下走。

## 写一篇新文章

```bash
cd /d/服务器测试/blog
corepack pnpm new-post my-first-note
```

会在 `src/content/posts/` 下生成一个带 frontmatter 模板的 `my-first-note.md`。文件名就是文章网址：`posts/my-first-note`。

> 用英文小写加连字符做文件名，别用中文和空格——URL 里中文会被转义成一长串 `%XX`，不好分享。

## frontmatter 怎么写

```yaml
---
title: 文章标题
published: 2026-11-02
description: 摘要，会出现在列表页和搜索结果的分享卡片里
aiPolished: false          # 不是 AI 润色过的就填 false，否则文章顶部会有提示
image: /assets/images/wallpaper/darknight-rain.webp   # 封面图，留空则不显示
tags: [机器学习]
category: 技术笔记
draft: false               # true = 只存在本地，不发布
pinned: false              # true = 首页置顶
lang: zh-CN
---
```

只有 `title` 和 `published` 必填，其它都有默认值。

写完正文提交，然后部署。

## 发布

```bash
cd /d/服务器测试/blog
git add src/content/posts/
git commit -m "posts: 新增《文章标题》"
npm run deploy:cf
```

最后这条会先把整条构建链跑一遍（图标 → LQIP → 友链底色 → astro build → 字体子集 → Pagefind），再把 `dist` 传给 Cloudflare。本地跑完整构建一分多钟，上传半分钟，比服务器快得多。看到

```text
✨ Deployment complete! Take a peek over at https://xxxxxxxx.darknight-alp.pages.dev
```

就算成功了。生产地址是 `https://darknight-alp.pages.dev`，前面那串哈希是这次部署的快照，用来验证改动不影响别人。

> 如果上传显示成功但站点打不开、返回 522，说明最后注册 deployment 的请求丢了。重跑一次 `npm run deploy:cf`，文件按哈希去重，秒完。

## 顺手更新服务器那份（可选）

想让 IP 直连那份也同步，再推一次：

```bash
git push server main
```

push 完输出里会出现 `remote:`，那就是部署日志在实时往外打。大概长这样：

```text
remote: [2026-11-01 12:34:56] ===== deploy 20261101-123456 start =====
remote: [2026-11-01 12:35:02] pnpm install
remote: [2026-11-01 12:36:40] pnpm build
remote: [2026-11-01 12:39:11] live -> /srv/blog/releases/20261101-123456
remote: [2026-11-01 12:39:12] nginx reloaded
remote: [2026-11-01 12:39:12] ===== deploy 20261101-123456 OK =====
```

**三四分钟是正常的**，服务器只有 1.7G 内存，构建慢。看到 `OK` 就行，刷新页面。

## 部署失败了怎么办

Cloudflare 这条如果失败，报错会直接打在终端里，构建阶段的错和上传阶段的错一眼能分开。构建没过就按报错改，改完重跑；上传阶段网络断了也直接重跑，`dist` 没变的话是秒传。

服务器那条先看 push 输出里有没有 `FAIL`。没看到的话上服务器查完整日志：

```bash
ssh <user>@<server-ip> 'tail -50 /srv/blog/deploy.log'
```

最常见的两种：

**构建报错，站点没更新。** 放心，这时线上还是上一个正常版本——软链接只在构建成功后才切换。按日志里的报错改 Markdown 或配置，重新 push。

**frontmatter 校验没过。** 一般是日期格式写错了（必须是 `YYYY-MM-DD`）或者 `tags` 没写成列表。

## 改配置

站点级的东西都在 `src/config/` 下，一个文件管一块：

| 文件 | 管什么 |
|:---|:---|
| `siteConfig.ts` | 站名、签名、URL、功能开关 |
| `profileConfig.ts` | 头像、昵称、简介、社交链接 |
| `backgroundWallpaper.ts` | 首页壁纸、标题文字、打字机 |
| `navBarConfig.ts` | 顶部菜单 |
| `sidebarConfig.ts` | 侧边栏小组件 |
| `themeColor.ts` | 主题色 |
| `licenseConfig.ts` | 文章版权声明 |

改完同样 `npm run deploy:cf` 上线。

`siteConfig.ts` 里的 `pages` 是功能开关，比如想开相册就把 `gallery` 改成 `true`：

```ts
pages: {
    friends: true,
    guestbook: true,
    gallery: false,
    bangumi: false,
}
```

## 换壁纸、加图片

放进 `public/assets/images/` 或者它的子目录，然后用绝对路径引用，比如 `/assets/images/wallpaper/xxx.webp`。

**用 webp，别用 png。** 同样的观感，体积能小一大半，首页加载全靠它。

转格式可以用 `sharp-cli`：

```bash
corepack pnpm dlx sharp-cli -i in.png -o out.webp -q 82
```

## 本地预览

改样式、看排版，起本地开发服务器最快：

```bash
cd /d/服务器测试/blog
corepack pnpm dev
```

`pnpm` 没单独装，用 `corepack` 前缀调，它会按 `package.json` 里的 `packageManager` 字段拉 9.14.4。

之前一直以为本地构建跑不起来——主题字体要在构建时从 jsdelivr 拉，怀疑笔记本连不上它，所以只在服务器上构建。实测是错的，本地 `astro build`、字体子集化、Pagefind 全都能一次过，所以现在的部署才改成本地构建再上传。

## 别做的事

不要直接在服务器上改文件。`/srv/blog/app` 是部署时 checkout 出来的，下次 push 会被 `checkout -f` 覆盖掉。要改就改本地、提交、推上去。
