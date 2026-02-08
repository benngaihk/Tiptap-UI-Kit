/**
 * Icons Adapter
 * Allows users to provide their own icon components
 */
import type { Component } from 'vue';
export type IconName = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'heading1' | 'heading2' | 'heading3' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'listBullet' | 'listOrdered' | 'listCheck' | 'link' | 'image' | 'table' | 'code' | 'codeBlock' | 'undo' | 'redo' | 'formatClear' | 'formatPainter' | 'subscript' | 'superscript' | 'quote' | 'horizontalRule' | 'plus' | 'minus' | 'close' | 'check' | 'chevronDown' | 'chevronUp' | 'chevronLeft' | 'chevronRight' | 'drag' | 'copy' | 'cut' | 'delete' | 'duplicate' | 'ai' | 'sparkles' | 'wand' | 'sun' | 'moon';
export type IconAdapter = Partial<Record<IconName, Component | string>>;
/**
 * Default icons using Unicode/Emoji
 * Users can replace with Lucide, Ant Design Icons, etc.
 */
export declare const defaultIconAdapter: IconAdapter;
export declare function setIconAdapter(adapter: IconAdapter): void;
export declare function getIconAdapter(): IconAdapter;
export declare function getIcon(name: IconName): Component | string;
//# sourceMappingURL=icons.d.ts.map