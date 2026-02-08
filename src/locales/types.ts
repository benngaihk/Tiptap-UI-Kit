/**
 * Tiptap 编辑器多语言类型定义
 */

export type LocaleCode = 'zh-CN' | 'zh-TW' | 'en-US'

export interface TiptapLocale {
  // 工具栏
  toolbar: {
    // 文本格式
    bold: string
    italic: string
    underline: string
    strikethrough: string
    code: string
    subscript: string
    superscript: string

    // 清除格式
    clear: string
    clearFormat: string
    formatPainter: string

    // 标题
    heading: string
    heading1: string
    heading2: string
    heading3: string
    heading4: string
    heading5: string
    heading6: string
    paragraph: string

    // 字体
    fontFamily: string
    fontSize: string
    lineHeight: string

    // 颜色
    textColor: string
    backgroundColor: string
    highlightColor: string

    // 列表
    bulletList: string
    orderedList: string
    taskList: string
    indent: string
    outdent: string

    // 对齐
    alignLeft: string
    alignCenter: string
    alignRight: string
    alignJustify: string

    // 插入
    insertLink: string
    insertImage: string
    insertTable: string
    insertCodeBlock: string
    insertHorizontalRule: string

    // 链接
    link: string
    linkUrl: string
    linkText: string
    openLink: string
    editLink: string
    removeLink: string

    // 撤销重做
    undo: string
    redo: string
    undoDisabledInCollab: string
    redoDisabledInCollab: string

    // 更多
    more: string
  }

  // 表格相关
  table: {
    insertTable: string
    deleteTable: string
    addColumnBefore: string
    addColumnAfter: string
    deleteColumn: string
    addRowBefore: string
    addRowAfter: string
    deleteRow: string
    mergeCells: string
    splitCell: string
    toggleHeaderCell: string
    toggleHeaderColumn: string
    toggleHeaderRow: string
    setCellAttribute: string
    fixTables: string
  }

  // 气泡菜单
  bubbleMenu: {
    turnInto: string
    textStyle: string
    color: string
  }

  // 拖拽菜单
  dragMenu: {
    delete: string
    duplicate: string
    copy: string
    cut: string
    moveUp: string
    moveDown: string
  }

  // 代码块
  codeBlock: {
    language: string
    selectLanguage: string
  }

  // 统计信息
  stats: {
    characters: string
    words: string
    pages: string
    zoom: string
    reset: string
    total: string
  }

  // 占位符
  placeholder: {
    default: string
    heading: string
    paragraph: string
  }

  // 错误和提示
  messages: {
    imageUploadFailed: string
    imageUploadSuccess: string
    invalidImageFormat: string
    imageTooLarge: string
    networkError: string
    pasteCleanedUp: string
    linkRequired: string
    linkInvalid: string
    // AI 功能错误消息
    translationFailed: string
    polishFailed: string
    summarizeFailed: string
    continueWritingFailed: string
    customAiFailed: string
  }

  // 编辑器功能相关（用于 features 组件）
  editor: {
    // 标题快捷方式
    h1: string
    h2: string
    h3: string
    h4: string
    h5: string
    h6: string
    paragraph: string
    heading: string
    heading1: string
    heading2: string
    heading3: string
    heading4: string
    heading5: string
    heading6: string

    // 文本格式
    bold: string
    italic: string
    underline: string
    strike: string
    inlineCode: string
    superscript: string
    subscript: string

    // 列表
    bulletList: string
    orderedList: string
    taskList: string

    // 对齐
    align: string
    alignLeft: string
    alignCenter: string
    alignRight: string
    alignJustify: string

    // 缩进
    indent: string
    outdent: string
    indentAndAlign: string

    // 颜色
    colors: string
    text: string
    highlight: string
    textColor: string
    backgroundColor: string
    defaultColors: string
    standardColors: string
    showAdvanced: string
    hideAdvanced: string
    clearColor: string

    // 操作
    actions: string
    cut: string
    copy: string
    delete: string

    // 基础操作
    undo: string
    redo: string
    undoDisabledInCollab: string
    redoDisabledInCollab: string
    clearFormat: string
    formatPainter: string

    // 字体
    font: string
    fontSize: string
    lineHeight: string

    // 插入
    insertLink: string
    insertImage: string
    insertTable: string
    image: string
    link: string
    editLink: string
    openLink: string
    removeLink: string
    linkPlaceholder: string
    imagePlaceholder: string

    // 表格
    deleteTable: string
    includeHeader: string

    // 上传
    localUpload: string
    localUploadImage: string
    webUpload: string
    clickOrDragUpload: string
    onlySupportImage: string

    // 更多
    more: string
    aiTool: string
    ai: string

    // 格式刷相关
    pleaseSelectTextToSample: string
    pleaseSelectTextToSampleShort: string
    pleaseSelectTextToSampleDouble: string
    sampleSuccessSingle: string
    sampleSuccessContinuous: string
    formatPainterExited: string
    collaborationNoFormatPainter: string

    // 链接相关
    enterValidLink: string

    // 数学公式
    math: string
    mathInline: string
    mathBlock: string
    mathPlaceholder: string
    mathEmpty: string

    // AI 相关
    continueWriting: string
    polish: string
    summarize: string
    translate: string
    translateTo: string
    customAi: string
    selectLanguage: string

    // AI 建议相关
    aiSuggestion: string
    aiContinueWriting: string
    originalText: string
    suggestedText: string
    generatedContent: string
    generating: string
    selectedContent: string
    currentStatus: string
    noTextSelected: string
    // AI 功能提示信息
    pleaseSelectText: string
    continueWritingRequiresSelection: string
    polishRequiresSelection: string
    summarizeRequiresSelection: string
    translateRequiresSelection: string
    customAiRequiresSelection: string
    aiPrompt: string
    aiPromptPlaceholder: string
    customAiCommand: string
    customAiPromptPlaceholder: string
    execute: string
    cancel: string
    reject: string
    accept: string

    // 语言代码
    lang: {
      'zh-CN': string
      'zh-TW': string
      zh: string
      en: string
      ja: string
      th: string
      fr: string
      es: string
      pt: string
      ko: string
      vi: string
      ru: string
      de: string
      hi: string
      id: string
      ar: string
    }
  }

  // 版本历史
  versionHistory: {
    title: string
    saveVersion: string
    noVersions: string
    autoSave: string
    words: string
    justNow: string
    minutesAgo: string
    hoursAgo: string
    daysAgo: string
    restore: string
    compare: string
    rename: string
    delete: string
    comparing: string
    clearCompare: string
    versionName: string
    saved: string
    restored: string
    deleted: string
    noDiff: string
  }

  // AI 设置
  aiSettings: {
    title: string
    provider: string
    apiKeyPlaceholder: string
    apiKeyHint: string
    endpoint: string
    model: string
    enableAi: string
    testConnection: string
    testing: string
    testSuccess: string
    testFailed: string
    viewDocs: string
    save: string
    cancel: string
    clear: string
  }
}

export type TranslationKey = string
export type TranslationFunction = (key: string, params?: Record<string, any>) => string
