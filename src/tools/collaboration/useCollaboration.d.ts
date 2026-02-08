/**
 * useCollaboration - 协作编辑状态管理 Composable
 * @description 提供协作编辑的完整状态管理
 */
import type { CollaboratorInfo, CollaborationInstance, CollaborationInitOptions, UserInfo } from './types';
/** Composable 配置 */
export interface UseCollaborationOptions {
    getUserInfo?: () => UserInfo;
    onCollaboratorsChange?: (count: number) => void;
    onCollaboratorsListChange?: (users: CollaboratorInfo[]) => void;
}
/** 初始化选项（不含回调） */
type InitOptions = Omit<CollaborationInitOptions, 'onCollaboratorsChange' | 'onCollaboratorsListChange'>;
/**
 * 协作编辑状态管理
 */
export declare function useCollaboration(options?: UseCollaborationOptions): {
    enabled: Readonly<import("vue").Ref<boolean, boolean>>;
    connected: import("vue").ComputedRef<boolean>;
    initializing: Readonly<import("vue").Ref<boolean, boolean>>;
    instance: Readonly<import("vue").Ref<{
        readonly doc: any;
        readonly provider: any;
        readonly setEditor?: ((editor: any) => void) | undefined;
        readonly destroy: () => void;
    } | null, {
        readonly doc: any;
        readonly provider: any;
        readonly setEditor?: ((editor: any) => void) | undefined;
        readonly destroy: () => void;
    } | null>>;
    collaboratorsCount: Readonly<import("vue").Ref<number, number>>;
    collaboratorsList: Readonly<import("vue").Ref<readonly {
        readonly id: string | number;
        readonly name: string;
        readonly color: string;
    }[], readonly {
        readonly id: string | number;
        readonly name: string;
        readonly color: string;
    }[]>>;
    enable: (initOptions: InitOptions) => Promise<CollaborationInstance | null>;
    disable: () => void;
    initWithExtensions: (initOptions: InitOptions) => Promise<any[]>;
    setEditor: (editor: any) => void;
    reset: () => void;
};
export type UseCollaborationReturn = ReturnType<typeof useCollaboration>;
export {};
//# sourceMappingURL=useCollaboration.d.ts.map