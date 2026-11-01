---
title: 这个博客是怎么跑起来的
published: 2026-11-01
description: 记录站点的部署链路——一份构建产物同时喂给 Cloudflare Pages 和自建 nginx，以及两边各自的坑。
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

静态博客。用户访问的永远是构建产物（一堆 HTML / CSS / JS），不需要跑 Node 服务。

同一份内容推两个地方，各走各的链路：

```text
本地改内容
  ├─ npm run deploy:cf ──▶ 本地构建 dist ──▶ wrangler 上传 ──▶ Cloudflare Pages ──▶ darknight.website
  └─ git push server main ──▶ 服务器 post-receive 自己构建 ──▶ nginx ──▶ <server-ip>
```

为什么要两份：域名挂在内地服务器上备案走不通（那台 ECS 在朋友的账号里，个人账号之间没法授权备案服务码），而境外节点压根不产生备案义务。于是域名交给 Cloudflare，服务器留一个 IP 直连当备用出口，顺便练手 nginx。

下面先写 Cloudflare 这条，再写服务器那条。

## Cloudflare Pages 这条链路

`npm run deploy:cf` 一条命令做完所有事：生成图标和 LQIP、算友链头像底色、`astro build`、字体子集化、Pagefind 建索引，最后 `wrangler pages deploy dist`。

没有走「连 GitHub 自动构建」那条路，两个原因：这个仓库只有本地和服务器两个 remote，没往 GitHub 推；而且 Pages 的构建容器只有 4 GB 内存和 512 并发限制，不如在自己机器上构建快——笔记本跑完整构建一分多钟，上传 359 个文件半分钟。

第一次部署有个坑：wrangler 把文件全传完了（`Success! Uploaded 359 files`），最后注册 deployment 那一步网络抖了一下报 `fetch failed`。这时候项目是空的，访问返回 **522**，光看上传成功会误以为上线了。重跑一次即可，资产按哈希去重，秒传。

## 域名怎么接进来

顺序不能反：

1. Cloudflare 面板 **Add a site**，填 `darknight.website`，Free 计划，拿到两个 `*.ns.cloudflare.com`
2. Pages 项目 → **Custom domains** 里把域名关联上（CF 自动建记录、自动签证书）
3. 阿里云域名控制台 → **修改 DNS 服务器**，换成第 1 步那两个 NS

第 2 步必须在第 3 步前面。NS 一切到 Cloudflare，流量就进边缘了，这时 Pages 还没跟域名建立关联，回源找不到目标直接 522。

另外改 NS 要求域名实名认证已经通过，实名没过阿里云会拒绝修改。

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

Cloudflare 那边用 `public/_headers` 声明同样的规则，构建时会被拷进 `dist`。这里有个和 nginx 完全不同的行为：**所有匹配上的规则都会生效并且叠加，不是后面的覆盖前面的**。所以 `/*` 和 `/_astro/*` 同时写了 `Cache-Control` 的话，响应头里会出现两个值拼在一起：

```text
Cache-Control: public, max-age=31536000, immutable, public, max-age=0, must-revalidate
```

浏览器取哪一个就不好说了。正确做法是通配规则里只放安全头，`Cache-Control` 只在具体路径上写。HTML 不写也没关系，Pages 默认就给 `max-age=0, must-revalidate`。

## 全文搜索

用的 Pagefind。它扫构建好的 HTML 建静态索引，不需要后端、不需要 API key，查询全在浏览器里完成。代价是索引体积会随文章数增长，现在这个量级完全无所谓。

## 已知的坑

**备案这件事最后没走通。** 卡在第 5 步选云产品实例——那台 ECS 在朋友的阿里云账号里，而跨账号授权备案服务码要求**对方是企业实名认证**，个人账号只能给自己账号下的服务器生成。买付费服务码也不行，它必须绑定在同一个账号里符合条件的实例上。所以只剩两条路：在朋友账号里以我的身份提交（会永久占掉那个账号唯一的主体名额），或者自己买台便宜的内地机。目前选了第三条：域名不碰内地节点，直接挂 Cloudflare，境外节点不产生备案义务。

**Cockpit 占了 443。** 服务器的 Web 管理面板反代在 `https://<IP>/start`，博客不跟它抢，用 80。

**本地构建其实能跑。** 原先以为主题的字体在构建时要从 jsdelivr 拉、笔记本连不上，所以一直只在服务器上构建。实际试下来 `astro build` 在本地一次过，字体子集化和 Pagefind 也都正常，那条判断是错的。

## 还没做的

评论（Waline）和访问统计（Umami）都没上，先把纯静态链路跑通。HTTPS 在 Cloudflare 侧是自动签发的，不用管；内地那台如果以后要上证书再走 certbot。

国内访问速度目前没测。真觉得慢再考虑套一层 Cloudflare 优选 IP，或者上腾讯云 EdgeOne Pages 回源——但那是等有人抱怨慢以后再说的事。
