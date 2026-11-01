import type { FriendLink, FriendsPageConfig } from "../types/friendsConfig";

export const friendsPageConfig: FriendsPageConfig = {
	title: "友链",
	description: "路过的站点，和一些恰好互相认识的人。",
	showCustomContent: true,
	showComment: true,
	randomizeSort: false,
};

export const friendsProjects: FriendLink[] = [];
export const friendsConfig: FriendLink[] = [];

export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);
	return friendsPageConfig.randomizeSort
		? friends.sort(() => Math.random() - 0.5)
		: friends.sort((a, b) => b.weight - a.weight);
};
