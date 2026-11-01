---
title: 这个博客是怎么跑起来的
published: 2026-11-01
description: 记录站点的部署链路——从本地 git push 到服务器构建、发布、nginx 提供静态文件的全过程。
aiPolished: false
image: /assets/images/wallpaper/darknight-night.webp
imageColor: "#151a30"
tags: [随笔记录, 搭建]
category: 搭建
draft: false
lang: zh-CN
author: darknight
licenseName: CC BY-NC-SA 4.0
licenseUrl: https://creativecommons.org/licenses/by-nc-sa/4.0/
comment: false
---

搭完顺手记一下链路。以后忘了可以自己回来看。

## 整体思路

静态博客。用户访问的永远是构建产物（一堆 HTML / CSS / JS），服务器上不需要跑 Node 服务。

写作在本地完成，`git push` 触发服务器构建发布：

```text
本地改内容 ──git push──▶ 服务器 bare 仓库
                              │
                        post-receive 钩子
                              │
              checkout ─▶ pnpm install ─▶ pnpm build
                              │
                    dist ─▶ releases/<时间戳> ─▶ current 软链
                              │
                        nginx reload
```

## 服务器上的目录

所有东西都在 `/srv/blog` 下面，职责分得很开：

```text
/srv/blog/
├── git/blog.git/       # bare 仓库，push 到这里
│   └── hooks/post-receive   # 部署脚本
├── app/                # 源码工作区（构建时占用）
│   └── node_modules/
├── releases/           # 每次构建的产物，按时间戳存
│   └── 20261101-121100/
├── current ─────▶ releases/20261101-121100
└── deploy.log          # 部署日志
```

`current` 是个软链接，nginx 只认它。切换版本就是把软链接指向新的 release，所以发布是瞬时的，不会出现「构建到一半用户看到半截页面」。

## 钩子做了什么

`post-receive` 里几个值得说的细节。

**只认 main 分支**，其它分支推上去不触发部署：

```bash
while read -r _old new ref; do
  [ "$ref" = "refs/heads/main" ] || continue
  # ...
done
```

**用 `nice -n 19` 跑构建**。这台机器内存只有 1.7 GB，Astro 构建会吃满 CPU。不加 nice 的话构建期间服务器基本没法用。同时给 Node 设了上限：

```bash
nice -n 19 env NODE_OPTIONS=--max-old-space-size=1200 pnpm build
```

**先检查再重载 nginx**。构建失败就退出，软链接不动，线上还是上一个好版本：

```bash
if sudo -n nginx -t >/dev/null 2>&1; then
  sudo -n systemctl reload nginx
else
  log "WARN nginx -t failed, NOT reloading"
fi
```

**只保留最近 3 个 release**，防止磁盘被历史版本塞满：

```bash
ls -1dt "$REL_ROOT"/*/ | tail -n +4 | xargs -r rm -rf
```

回滚就是从 `releases/` 里挑一个旧时间戳，把软链接重新指过去。

## 缓存策略

`/_astro/` 下的文件名带 content hash，内容变了名字就变，所以可以放心设很长的缓存：

```nginx
location /_astro/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

图片没 hash，设一周。`/pagefind/` 是全文搜索的索引，每次构建整体替换，设 300 秒——太长会导致刚发的文章搜不到。

## 全文搜索

用的 Pagefind。它扫构建好的 HTML 建静态索引，不需要后端、不需要 API key，查询全在浏览器里完成。代价是索引体积会随文章数增长，现在这个量级完全无所谓。

## 已知的坑

**国内服务器 80 端口需要备案。** 没域名的时候只能先用 IP 访问。

**Cockpit 占了 443。** 服务器的 Web 管理面板反代在 `https://<IP>/start`，博客不跟它抢，用 80。

**jsdelivr 本地连不上。** 主题的字体是构建时从 CDN 拉的，笔记本的网络环境会 RST 掉这个请求。所以在服务器上构建，不在本地——本地只负责写。

## 还没做的

评论（Waline）和访问统计（Umami）都没上，先把纯静态链路跑通。HTTPS 证书等域名备案下来再配。
