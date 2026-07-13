import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { minify as terserMinify } from 'terser'

// Vite skips its built-in terser pass for lib builds with ES format
// (see vite:terser renderChunk), so we minify explicitly here.
// This plugin is the single source of truth for JS minification of the
// published bundle (including drop_console) — do not duplicate these
// options in build.minify/build.terserOptions.
function libTerser(): Plugin {
  return {
    name: 'lib-terser',
    apply: 'build',
    enforce: 'post',
    async renderChunk(code, _chunk, outputOptions) {
      if (outputOptions.format !== 'es') return null
      const result = await terserMinify(code, {
        module: true,
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      })
      return result.code ? { code: result.code, map: null } : null
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    libTerser(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      rollupTypes: true, // Bundle all .d.ts into one file
      logLevel: 'error', // Only show errors
      strictOutput: false, // Don't fail on declaration errors
      skipDiagnostics: true, // Skip type diagnostics to avoid vue-types issue
      // Exclude files that use ant-design-vue Popover (causes vue-types path issues)
      exclude: ['src/ai/shared/CustomAiPopover.vue', 'src/ai/shared/AiSuggestionPopover.vue'],
      beforeWriteFile: (filePath, content) => {
        // Filter out problematic type references
        return { filePath, content };
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: false,
  build: {
    // Modern browsers that support CSS nesting
    target: ['es2022', 'chrome105', 'safari16', 'firefox110', 'edge105'],
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TiptapUIKit',
      formats: ['es'],
      fileName: () => 'index.esm.js',
      cssFileName: 'style',
    },
    // Kept truthy so CSS gets minified (build.cssMinify defaults to it).
    // JS minification of the ES lib output is handled solely by the
    // libTerser plugin above — vite:terser skips lib+ES chunks.
    minify: 'esbuild',
    // Never inline assets (e.g. KaTeX fonts) as base64 into CSS/JS
    assetsInlineLimit: 0,
    rollupOptions: {
      external: [
        'vue',
        '@tiptap/vue-3',
        '@tiptap/core',
        '@tiptap/pm',
        '@tiptap/starter-kit',
        /^@tiptap\/.*/,
        'ant-design-vue',
        '@ant-design/icons-vue',
        /^#\/.*/, // Internal APIs (collaboration, etc.)
        'yjs',
        'y-prosemirror',
        'y-websocket',
        /^y-.*/,
        'lowlight',
        /^prosemirror-.*/,
        // Heavy optional features — dynamically imported, resolved from the
        // consumer's node_modules and code-split by their bundler
        'katex',
        /^katex\/.*/,
        'mammoth',
        'docx',
        'file-saver',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || 'asset'
        },
      },
    },
    cssCodeSplit: false,
  },
  // Define for license validation
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.1'),
  },
})
