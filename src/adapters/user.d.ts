/**
 * User Adapter
 * Replaces @vben/stores useUserStore
 */
export interface UserInfo {
    userId: string | number;
    realName: string;
    userName: string;
    avatar?: string;
}
/**
 * Set user info (call this on app init)
 */
export declare function setUserInfo(info: UserInfo): void;
/**
 * Get user store (compatible with @vben/stores)
 */
export declare function useUserStore(): {
    userInfo: {
        readonly userId: string | number;
        readonly realName: string;
        readonly userName: string;
        readonly avatar?: string | undefined;
    } | null;
    setUserInfo: typeof setUserInfo;
    getUserInfo: () => {
        userId: string | number;
        realName: string;
        userName: string;
        avatar?: string | undefined;
    } | null;
};
//# sourceMappingURL=user.d.ts.map