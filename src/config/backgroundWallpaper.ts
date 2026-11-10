import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

/**
 * 壁纸配置。
 *
 * 这里的图片全部是为本站生成的原创图，放在 public/assets/images/wallpaper/ 下。
 * 想换壁纸：把新图丢进那个目录，然后在下面数组里写上 "/assets/images/wallpaper/你的文件名.webp"。
 * 建议桌面端图片控制在 300KB 以内，移动端更小，否则首屏会变慢。
 */
const desktopWallpapers = [
	"/assets/images/wallpaper/darknight-night.webp",
	"/assets/images/wallpaper/darknight-rain.webp",
];

const mobileWallpapers = [
	"/assets/images/wallpaper/darknight-night-mobile.webp",
	"/assets/images/wallpaper/darknight-night.webp",
];

export const homepageWallpaper: string = desktopWallpapers[0];
export const alternateHomepageWallpaper: string = desktopWallpapers[1];
export const mobileHomepageWallpaper: string = mobileWallpapers[0];

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	// 壁纸模式："banner" 横幅壁纸，"fullscreen" 全屏壁纸，"overlay" 全屏透明，"none" 纯色背景
	mode: "fullscreen",
	// 是否允许访客在导航栏「外观设置」里自行切换壁纸模式
	switchable: true,
	// 背景视频（本站未使用视频素材，保持关闭）
	playerEnable: false,
	src: {
		desktop: desktopWallpapers,
		mobile: mobileWallpapers,
	},
	common: {
		// 壁纸遮罩暗度，越大越暗、文字越清楚
		dimOpacity: 0.25,
		homeText: {
			enable: true,
			switchable: true,
			title: "你好，世界",
			titleSize: "3.8rem",
			// 打字机模式下会依次循环这几句；改成你自己的话即可
			subtitle: [
				"把学到的东西写下来，才算真的学会。",
				"记录代码、数学，和一些没什么用但很想说的想法。",
				"慢慢来，比较快。",
			],
			subtitleSize: "1.5rem",
			typewriter: {
				enable: true,
				speed: 100,
				deleteSpeed: 50,
				pauseTime: 2000,
			},
		},
		navbar: {
			transparentMode: "semifull",
			enableBlur: true,
			blur: 5,
		},
		waves: {
			enable: { desktop: true, mobile: true },
			switchable: true,
		},
		gradient: {
			enable: { desktop: true, mobile: true },
			height: "10%",
			switchable: true,
		},
		carousel: {
			enable: true,
			interval: 8000,
			transitionEffect: "fade",
			switchable: true,
		},
	},
	banner: {
		position: "center",
	},
	overlay: {
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
		zIndex: -1,
		opacity: 0.8,
		blur: 10,
		cardOpacity: 0.5,
	},
	fullscreen: {
		position: "center",
	},
};
