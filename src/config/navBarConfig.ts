import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: NavBarLink[] = [
		// 主页
		LinkPresets.Home,
	];

	// 文章及其子菜单
	links.push({
		name: "文章",
		url: "#",
		icon: "material-symbols:article",
		activePaths: ["/posts/"],
		children: [
			// 归档
			LinkPresets.Archive,

			// 分类
			LinkPresets.Categories,

			// 标签
			LinkPresets.Tags,
		],
	});

	// 友链
	links.push(LinkPresets.Friends);

	// 留言板
	links.push(LinkPresets.Guestbook);

	// 我的及其子菜单
	links.push({
		name: "我的",
		url: "#",
		icon: "material-symbols:person",
		children: [
			// 工具
			LinkPresets.Tools,
		],
	});

	// 关于
	links.push(LinkPresets.About);

	// 开往：独立博客友链接力
	links.push(LinkPresets.Travellings);

	// 想加更多入口，从这里取消注释即可（对应的 pages 开关要先打开、素材要先准备好）：
	// links.push(LinkPresets.Analytics);     // 站点统计，需要配置 analyticsConfig
	// links.push(LinkPresets.Moments);       // 朋友圈，需要兼容的后端服务
	// links.push(LinkPresets.Gallery);       // 相册，需要填 galleryConfig
	// links.push(LinkPresets.Bills);         // 账单，需要填 data/billsSummary.json
	// links.push(LinkPresets.Anime);         // 追番，需要 anime-list 数据
	// links.push(LinkPresets.Bangumi);       // 番组计划
	// links.push(LinkPresets.Sponsor);       // 打赏，需要配置 sponsorConfig
	// links.push(LinkPresets.Lottie);        // 动态表情，需要自备 lottie 素材
	// links.push(LinkPresets.Changelog);     // 主题更新日志
	// links.push(LinkPresets.BlogChangelog); // 博客更新日志

	// 文档链接
	// links.push({
	// 	name: "文档",
	// 	url: "https://example.com/docs",
	// 	external: true,
	// 	icon: "material-symbols:docs",
	// });

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设 - 可自由自定义导航栏链接的名称、图标和URL
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "主页",
		url: "/",
		icon: "material-symbols:home",
	},
	Travellings: {
		name: "开往",
		url: "https://www.travellings.cn/go.html",
		external: true,
		iconImage: "https://www.travellings.cn/assets/travelling.png",
	},
	Archive: {
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	Categories: {
		name: "分类",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "标签",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Tools: {
		name: "工具",
		url: "/tools/",
		icon: "material-symbols:construction-rounded",
	},
	Changelog: {
		name: "项目更新日志",
		url: "/changelog/",
		icon: "material-symbols:history-edu-rounded",
	},
	Friends: {
		name: "友链",
		url: "/friends/",
		icon: "material-symbols:group",
		pageKey: "friends",
	},
	Moments: {
		name: "朋友圈",
		url: "/moments/",
		icon: "material-symbols:rss-feed-rounded",
	},
	Sponsor: {
		name: "打赏",
		url: "/sponsor/",
		icon: "material-symbols:favorite",
		pageKey: "sponsor",
	},
	Guestbook: {
		name: "留言",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	About: {
		name: "关于我",
		url: "/about/",
		icon: "material-symbols:person",
	},
	Lottie: {
		name: "动态表情",
		url: "/lottie/",
		icon: "material-symbols:auto-awesome-rounded",
	},
	Analytics: {
		name: "站点统计",
		url: "/analytics/",
		icon: "material-symbols:monitoring-rounded",
	},
	BlogChangelog: {
		name: "博客日志",
		url: "/blog-changelog/",
		icon: "material-symbols:history-rounded",
	},
	Bangumi: {
		name: "番组计划",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	Gallery: {
		name: "相册",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Bills: {
		name: "账单",
		url: "/bills/",
		icon: "material-symbols:receipt-long-rounded",
	},
	Anime: {
		name: "追番",
		url: "/anime/",
		icon: "material-symbols:live-tv",
		pageKey: "anime",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
