/**
 * 首页开屏动画的访客偏好设置。
 *
 * 这些值只保存在访客自己的浏览器里，不会改变站点构建配置；这样每个人
 * 都可以选择是否播放开屏动画，以及自己喜欢的角色。
 *
 * 本站没有使用第三方角色立绘，characters / banners 留空即等于关闭开屏动画。
 * 想开启：把原创立绘放到 public/assets/images/home-intro/ 下，再往下面数组里填。
 */
export const homePortfolioIntroSettings = {
	enabledStorageKey: "darknight.home-portfolio-intro-enabled.v1",
	characterStorageKey: "darknight.home-portfolio-intro-character.v1",
	topBannerStorageKey: "darknight.home-portfolio-intro-top-banner.v1",
	bottomBannerStorageKey: "darknight.home-portfolio-intro-bottom-banner.v1",
	defaultEnabled: false,
	defaultCharacterId: "",
	defaultTopBannerId: "",
	defaultBottomBannerId: "",
	defaultMobileTopBannerId: "",
	defaultMobileBottomBannerId: "",
	banners: {
		desktop: {
			top: [] as { id: string; label: string; src: string }[],
			bottom: [] as { id: string; label: string; src: string }[],
		},
		mobile: {
			top: [] as { id: string; label: string; src: string }[],
			bottom: [] as { id: string; label: string; src: string }[],
		},
	},
	characters: [] as {
		id: string;
		label: string;
		src: string;
		thumbnail: string;
	}[],
};

export type HomePortfolioIntroCharacter =
	(typeof homePortfolioIntroSettings.characters)[number];

export const homePortfolioIntroCharacterIds: readonly string[] =
	homePortfolioIntroSettings.characters.map((character) => character.id);
