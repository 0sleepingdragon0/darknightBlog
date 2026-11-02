import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	avatar: "/assets/avatar-darknight.webp",
	name: "darknight",
	bio: "你好，世界",
	// 社交链接：填了就会出现在个人资料卡和侧边栏里。
	// icon 用 Iconify 图标名，例如 "simple-icons:github"、"simple-icons:bilibili"。
	// 只有 astro-icon 能解析的集合可用；material-symbols 与 simple-icons 已在 .astro 中验证。
	links: [
		{
			name: "GitHub",
			url: "https://github.com/0sleepingdragon0",
			icon: "simple-icons:github",
		},
		{
			name: "邮箱",
			url: "mailto:darknightwhite@foxmail.com",
			icon: "material-symbols:alternate-email",
		},
	],
};
