import type { TiptapLocale } from './types'

export const zhTW: TiptapLocale = {
  toolbar: {
    // 文本格式
    bold: '粗體',
    italic: '斜體',
    underline: '底線',
    strikethrough: '刪除線',
    code: '程式碼',
    subscript: '下標',
    superscript: '上標',

    // 清除格式
    clear: '清除',
    clearFormat: '清除格式',
    formatPainter: '格式刷',

    // 標題
    heading: '標題',
    heading1: '標題 1',
    heading2: '標題 2',
    heading3: '標題 3',
    heading4: '標題 4',
    heading5: '標題 5',
    heading6: '標題 6',
    paragraph: '正文',

    // 字體
    fontFamily: '字體',
    fontSize: '字號',
    lineHeight: '行距',

    // 顏色
    textColor: '文字顏色',
    backgroundColor: '背景顏色',
    highlightColor: '高亮顏色',

    // 列表
    bulletList: '項目符號清單',
    orderedList: '編號清單',
    taskList: '工作清單',
    indent: '增加縮排',
    outdent: '減少縮排',

    // 對齊
    alignLeft: '靠左對齊',
    alignCenter: '置中對齊',
    alignRight: '靠右對齊',
    alignJustify: '左右對齊',

    // 插入
    insertLink: '插入連結',
    insertImage: '插入圖片',
    insertTable: '插入表格',
    insertCodeBlock: '插入程式碼區塊',
    insertHorizontalRule: '插入分隔線',

    // 連結
    link: '連結',
    linkUrl: '連結位址',
    linkText: '連結文字',
    openLink: '開啟連結',
    editLink: '編輯連結',
    removeLink: '移除連結',

    // 撤銷重做
    undo: '復原',
    redo: '重做',
    undoDisabledInCollab: '協作模式下不可用',
    redoDisabledInCollab: '協作模式下不可用',

    // 更多
    more: '更多',
  },

  table: {
    insertTable: '插入表格',
    deleteTable: '刪除表格',
    addColumnBefore: '在左側插入欄',
    addColumnAfter: '在右側插入欄',
    deleteColumn: '刪除欄',
    addRowBefore: '在上方插入列',
    addRowAfter: '在下方插入列',
    deleteRow: '刪除列',
    mergeCells: '合併儲存格',
    splitCell: '分割儲存格',
    toggleHeaderCell: '切換標題儲存格',
    toggleHeaderColumn: '切換標題欄',
    toggleHeaderRow: '切換標題列',
    setCellAttribute: '設定儲存格屬性',
    fixTables: '修復表格',
  },

  bubbleMenu: {
    turnInto: '轉換為',
    textStyle: '文字樣式',
    color: '顏色',
  },

  dragMenu: {
    delete: '刪除',
    duplicate: '複製',
    copy: '拷貝',
    cut: '剪下',
    moveUp: '上移',
    moveDown: '下移',
  },

  codeBlock: {
    language: '語言',
    selectLanguage: '選擇語言',
  },

  stats: {
    characters: '字元',
    words: '詞',
    pages: '頁',
    zoom: '縮放',
    reset: '重置',
    total: '共',
  },

  placeholder: {
    default: '請輸入內容...',
    heading: '標題',
    paragraph: '正文',
  },

  messages: {
    imageUploadFailed: '圖片上傳失敗',
    imageUploadSuccess: '圖片上傳成功',
    invalidImageFormat: '不支援的圖片格式',
    imageTooLarge: '圖片大小超過限制',
    networkError: '網路錯誤，請稍後重試',
    pasteCleanedUp: '已清理貼上內容的格式',
    linkRequired: '請輸入連結位址',
    linkInvalid: '連結位址無效',
    // AI 功能錯誤訊息
    translationFailed: '翻譯失敗',
    polishFailed: '潤色失敗',
    summarizeFailed: '總結失敗',
    continueWritingFailed: '續寫失敗',
    customAiFailed: '自定義 AI 失敗',
  },

  editor: {
    // 標題快捷方式
    h1: '標題 1',
    h2: '標題 2',
    h3: '標題 3',
    h4: '標題 4',
    h5: '標題 5',
    h6: '標題 6',
    paragraph: '正文',
    heading: '標題',
    heading1: '標題 1',
    heading2: '標題 2',
    heading3: '標題 3',
    heading4: '標題 4',
    heading5: '標題 5',
    heading6: '標題 6',

    // 文本格式
    bold: '粗體',
    italic: '斜體',
    underline: '底線',
    strike: '刪除線',
    inlineCode: '程式碼',
    superscript: '上標',
    subscript: '下標',

    // 列表
    bulletList: '項目符號清單',
    orderedList: '編號清單',
    taskList: '工作清單',

    // 對齊
    align: '對齊',
    alignLeft: '靠左對齊',
    alignCenter: '置中對齊',
    alignRight: '靠右對齊',
    alignJustify: '左右對齊',

    // 縮排
    indent: '增加縮排',
    outdent: '減少縮排',
    indentAndAlign: '縮排和對齊',

    // 顏色
    colors: '顏色',
    text: '文字',
    highlight: '高亮',
    textColor: '文字顏色',
    backgroundColor: '背景顏色',
    defaultColors: '預設顏色',
    standardColors: '標準色',
    showAdvanced: '高級選擇器',
    hideAdvanced: '收起',
    clearColor: '清空顏色',

    // 操作
    actions: '操作',
    cut: '剪下',
    copy: '拷貝',
    delete: '刪除',

    // 基礎操作
    undo: '復原',
    redo: '重做',
    undoDisabledInCollab: '協作模式下不可用',
    redoDisabledInCollab: '協作模式下不可用',
    clearFormat: '清除格式',
    formatPainter: '格式刷',

    // 字體
    font: '字體',
    fontSize: '字號',
    lineHeight: '行距',

    // 插入
    insertLink: '插入連結',
    insertImage: '插入圖片',
    insertTable: '插入表格',
    image: '圖片',
    link: '連結',
    editLink: '編輯連結',
    openLink: '開啟連結',
    removeLink: '移除連結',
    linkPlaceholder: '請輸入連結位址',
    imagePlaceholder: '請輸入圖片位址',

    // 表格
    deleteTable: '刪除表格',
    includeHeader: '包含標題',

    // 上傳
    localUpload: '本地上傳',
    localUploadImage: '本地上傳圖片',
    webUpload: '網路上傳',
    clickOrDragUpload: '點擊或拖拽檔案到此區域上傳',
    onlySupportImage: '僅支援圖片格式',
    video: '視頻',
    localUploadVideo: '本地上傳視頻',
    uploadVideo: '上傳視頻',
    onlySupportVideo: '僅支援視頻格式',
    supportImageAndVideo: '支援圖片和視頻格式',

    // Word 匯入/匯出
    word: 'Word',
    importWord: '匯入 Word',
    exportWord: '匯出 Word',
    clickOrDragUploadWord: '點擊或拖拽 Word 檔案到此區域',
    onlySupportDocx: '僅支援 .docx 格式',
    importing: '正在匯入...',
    exporting: '正在匯出...',
    exportFilenamePlaceholder: '請輸入檔案名稱',
    importSuccess: 'Word 檔案匯入成功',
    exportSuccess: 'Word 檔案匯出成功',
    importFailed: 'Word 檔案匯入失敗',
    exportFailed: 'Word 檔案匯出失敗',

    // 更多
    more: '更多',
    aiTool: 'AI 工具',
    ai: 'AI',

    // 格式刷相關
    pleaseSelectTextToSample: '請先選擇要採樣的文字',
    pleaseSelectTextToSampleShort: '請先選擇文字',
    pleaseSelectTextToSampleDouble: '請先雙擊選擇要採樣的文字',
    sampleSuccessSingle: '格式採樣成功，點擊目標文字套用格式',
    sampleSuccessContinuous: '格式採樣成功，可連續點擊多個目標文字套用格式',
    formatPainterExited: '已退出格式刷模式',
    collaborationNoFormatPainter: '協作模式下不支援格式刷功能',

    // 連結相關
    enterValidLink: '請輸入有效的連結位址',

    // 數學公式
    math: '數學公式',
    mathInline: '行內公式',
    mathBlock: '塊級公式',
    mathPlaceholder: '輸入 LaTeX 公式...',
    mathEmpty: '點擊編輯公式',

    // 模板插入
    insertTemplate: '插入模板',
    templateMeetingMinutes: '會議紀要',
    templateMeetingMinutesDesc: '包含議題、決議、待辦事項的會議記錄模板',
    templateWeeklyReport: '週報',
    templateWeeklyReportDesc: '本週完成、進行中、下週計劃的週報模板',
    templateDailyReport: '日報',
    templateDailyReportDesc: '今日完成與明日計劃的日報模板',
    templateProjectPlan: '專案方案',
    templateProjectPlanDesc: '專案概述、實施方案、風險評估的專案文件模板',
    templateProductRequirement: '需求文件',
    templateProductRequirementDesc: '產品需求文件 (PRD) 模板',

    // 圖庫
    imageGallery: '圖庫',
    galleryEmpty: '暫無圖片',
    galleryEmptyHint: '當前文件中還沒有插入過圖片',
    galleryCount: '共 {total} 張，已選 {selected} 張',
    galleryInsert: '插入選中圖片',

    // AI 相關
    continueWriting: '繼續寫作',
    polish: '潤色文字',
    summarize: '總結內容',
    translate: '翻譯',
    translateTo: '翻譯為 {lang}',
    customAi: '自定義 AI',
    selectLanguage: '選擇語言',

    // AI 建議相關
    aiSuggestion: 'AI 建議',
    aiContinueWriting: 'AI 續寫：',
    originalText: '原文：',
    suggestedText: '建議：',
    generatedContent: '生成內容：',
    generating: '正在生成...',
    selectedContent: '選中內容：',
    currentStatus: '當前狀態',
    noTextSelected: '未選中文本，AI 內容將插入到光標位置',
    // AI 功能提示訊息
    pleaseSelectText: '請先選中文字',
    continueWritingRequiresSelection: '續寫功能需要先選中要續寫的文字',
    polishRequiresSelection: '潤色功能需要先選中要潤色的文字',
    summarizeRequiresSelection: '總結功能需要先選中要總結的文字',
    translateRequiresSelection: '翻譯功能需要先選中要翻譯的文字',
    customAiRequiresSelection: '自定義AI功能需要先選中要處理的文字',
    aiPrompt: 'AI 指令',
    aiPromptPlaceholder: '請輸入 AI 指令，例如：優化這段文字、翻譯成英文...',
    customAiCommand: '自定義 AI 指令',
    customAiPromptPlaceholder: '請輸入你的 AI 指令，例如：請幫我優化這段文字、請翻譯成英文、請總結要點等',
    execute: '執行',
    cancel: '取消',
    reject: '拒絕',
    accept: '接受',

    // 語言代碼
    lang: {
      'zh-CN': '簡體中文',
      'zh-TW': '繁體中文',
      zh: '中文',
      en: '英語',
      ja: '日語',
      th: '泰語',
      fr: '法語',
      es: '西班牙語',
      pt: '葡萄牙語',
      ko: '韓語',
      vi: '越南語',
      ru: '俄語',
      de: '德語',
      hi: '印地語',
      id: '印尼語',
      ar: '阿拉伯語',
    },
  },

  versionHistory: {
    title: '版本歷史',
    saveVersion: '儲存版本',
    noVersions: '暫無歷史版本',
    autoSave: '自動儲存',
    words: '字',
    justNow: '剛剛',
    minutesAgo: '分鐘前',
    hoursAgo: '小時前',
    daysAgo: '天前',
    restore: '恢復此版本',
    compare: '對比',
    rename: '重新命名',
    delete: '刪除',
    comparing: '正在對比',
    clearCompare: '取消對比',
    versionName: '版本名稱',
    saved: '版本已儲存',
    restored: '版本已恢復',
    deleted: '版本已刪除',
    noDiff: '內容相同',
  },

  aiSettings: {
    title: 'AI 設定',
    provider: 'AI 提供商',
    apiKeyPlaceholder: '請輸入 API Key',
    apiKeyHint: 'API Key 僅保存在本地瀏覽器中，不會上傳到伺服器',
    endpoint: 'API 端點',
    model: '模型',
    enableAi: '啟用 AI 功能',
    testConnection: '測試連線',
    testing: '測試中...',
    testSuccess: '連線成功',
    testFailed: '連線失敗',
    viewDocs: '查看文檔',
    save: '儲存',
    cancel: '取消',
    clear: '清除設定',
  },
}

export default zhTW
