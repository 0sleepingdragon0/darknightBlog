import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	title: "站点开张了",
	content:
		"刚把博客搭起来，先写了三篇：一篇开场，一篇讲这个站怎么跑的，一篇是发文的操作手册。评论和统计暂时还没接。",
	closable: true,
	links: [
		{
			enable: true,
			text: "读第一篇",
			url: "/posts/hello-world/",
			external: false,
		},
	],
};
