/**
 * Video Extension - 视频节点扩展
 * @description 支持在编辑器中插入和播放视频
 */

import { Node, mergeAttributes } from '@tiptap/core'

export interface VideoOptions {
  HTMLAttributes: Record<string, any>
  inline: boolean
  allowBase64: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      /**
       * 插入视频
       */
      setVideo: (options: { src: string; width?: number; height?: number }) => ReturnType
    }
  }
}

export const Video = Node.create<VideoOptions>({
  name: 'video',

  addOptions() {
    return {
      HTMLAttributes: {},
      inline: false,
      allowBase64: true,
    }
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  inline() {
    return this.options.inline
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute('width')
          return value ? parseInt(value, 10) : null
        },
        renderHTML: (attributes) => {
          return attributes.width ? { width: attributes.width } : {}
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute('height')
          return value ? parseInt(value, 10) : null
        },
        renderHTML: (attributes) => {
          return attributes.height ? { height: attributes.height } : {}
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        controls: 'true',
        style: 'max-width: 100%;',
      }),
    ]
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})
