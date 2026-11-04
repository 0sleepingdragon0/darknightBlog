import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 禁用音乐播放器方法：
	// 模板默认侧边栏和导航栏两个都显示
	// 1. 侧边栏：在sidebarConfig.ts侧边栏配置把音乐组件enable设为false禁用即可
	// 2. 导航栏：在本配置文件把showInNavbar设为false禁用即可

	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	mode: "local",

	// 默认音量 (0-1)
	volume: 0.7,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// 是否显启用歌词（三首曲目都没有 lrc，关掉以免歌词区一直空着）
	showLyrics: false,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	// 1. 支持传入歌词文件的路径，例如 lrc: "/assets/music/lrc/xxx.lrc"
	// 2. 或者直接填入歌词字符串内容，例如 lrc: "[00:00.00]歌词内容..."
	//
	// 下面三首来自 Incompetech（Kevin MacLeod），CC BY 4.0 授权。
	// 署名要求记在 public/assets/music/ATTRIBUTION.txt，同时显示在 /about/ 的「开源」页。
	// 文件名用 ASCII，因为 url() 只拼 BASE_URL、不做 URL 编码。
	local: {
		playlist: [
			{
				name: "Starry",
				artist: "Kevin MacLeod",
				url: "/assets/music/starry.mp3",
			},
			{
				name: "Evening Fall (Harp)",
				artist: "Kevin MacLeod",
				url: "/assets/music/evening-fall-harp.mp3",
			},
			{
				name: "Late Night Radio",
				artist: "Kevin MacLeod",
				url: "/assets/music/late-night-radio.mp3",
			},
		],
	},
};
