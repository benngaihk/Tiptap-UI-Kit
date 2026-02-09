import type { TiptapLocale } from './types'

export const enUS: TiptapLocale = {
  toolbar: {
    // Text format
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    code: 'Code',
    subscript: 'Subscript',
    superscript: 'Superscript',

    // Clear format
    clear: 'Clear',
    clearFormat: 'Clear Format',
    formatPainter: 'Format Painter',

    // Headings
    heading: 'Heading',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',
    paragraph: 'Paragraph',

    // Font
    fontFamily: 'Font',
    fontSize: 'Font Size',
    lineHeight: 'Line Height',

    // Colors
    textColor: 'Text Color',
    backgroundColor: 'Background Color',
    highlightColor: 'Highlight Color',

    // Lists
    bulletList: 'Bullet List',
    orderedList: 'Numbered List',
    taskList: 'Task List',
    indent: 'Indent',
    outdent: 'Outdent',

    // Alignment
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    alignJustify: 'Justify',

    // Insert
    insertLink: 'Insert Link',
    insertImage: 'Insert Image',
    insertTable: 'Insert Table',
    insertCodeBlock: 'Insert Code Block',
    insertHorizontalRule: 'Insert Horizontal Rule',

    // Link
    link: 'Link',
    linkUrl: 'Link URL',
    linkText: 'Link Text',
    openLink: 'Open Link',
    editLink: 'Edit Link',
    removeLink: 'Remove Link',

    // Undo/Redo
    undo: 'Undo',
    redo: 'Redo',
    undoDisabledInCollab: 'Disabled in collaboration mode',
    redoDisabledInCollab: 'Disabled in collaboration mode',

    // More
    more: 'More',
  },

  table: {
    insertTable: 'Insert Table',
    deleteTable: 'Delete Table',
    addColumnBefore: 'Add Column Before',
    addColumnAfter: 'Add Column After',
    deleteColumn: 'Delete Column',
    addRowBefore: 'Add Row Before',
    addRowAfter: 'Add Row After',
    deleteRow: 'Delete Row',
    mergeCells: 'Merge Cells',
    splitCell: 'Split Cell',
    toggleHeaderCell: 'Toggle Header Cell',
    toggleHeaderColumn: 'Toggle Header Column',
    toggleHeaderRow: 'Toggle Header Row',
    setCellAttribute: 'Set Cell Attribute',
    fixTables: 'Fix Tables',
  },

  bubbleMenu: {
    turnInto: 'Turn Into',
    textStyle: 'Text Style',
    color: 'Color',
  },

  dragMenu: {
    delete: 'Delete',
    duplicate: 'Duplicate',
    copy: 'Copy',
    cut: 'Cut',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
  },

  codeBlock: {
    language: 'Language',
    selectLanguage: 'Select Language',
  },

  stats: {
    characters: 'Characters',
    words: 'Words',
    pages: 'Pages',
    zoom: 'Zoom',
    reset: 'Reset',
    total: 'Total',
  },

  placeholder: {
    default: 'Type something...',
    heading: 'Heading',
    paragraph: 'Paragraph',
  },

  messages: {
    imageUploadFailed: 'Image upload failed',
    imageUploadSuccess: 'Image uploaded successfully',
    invalidImageFormat: 'Invalid image format',
    imageTooLarge: 'Image is too large',
    networkError: 'Network error, please try again',
    pasteCleanedUp: 'Pasted content has been cleaned up',
    linkRequired: 'Link URL is required',
    linkInvalid: 'Invalid link URL',
    // AI feature error messages
    translationFailed: 'Translation failed',
    polishFailed: 'Polish failed',
    summarizeFailed: 'Summarize failed',
    continueWritingFailed: 'Continue writing failed',
    customAiFailed: 'Custom AI failed',
  },

  editor: {
    // Heading shortcuts
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    paragraph: 'Paragraph',
    heading: 'Heading',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    heading4: 'Heading 4',
    heading5: 'Heading 5',
    heading6: 'Heading 6',

    // Text format
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strike: 'Strikethrough',
    inlineCode: 'Code',
    superscript: 'Superscript',
    subscript: 'Subscript',

    // Lists
    bulletList: 'Bullet List',
    orderedList: 'Numbered List',
    taskList: 'Task List',

    // Alignment
    align: 'Align',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    alignJustify: 'Justify',

    // Indent
    indent: 'Indent',
    outdent: 'Outdent',
    indentAndAlign: 'Indent and Align',

    // Colors
    colors: 'Colors',
    text: 'Text',
    highlight: 'Highlight',
    textColor: 'Text Color',
    backgroundColor: 'Background Color',
    defaultColors: 'Default Colors',
    standardColors: 'Standard Colors',
    showAdvanced: 'Advanced Picker',
    hideAdvanced: 'Hide',
    clearColor: 'Clear Color',

    // Actions
    actions: 'Actions',
    cut: 'Cut',
    copy: 'Copy',
    delete: 'Delete',

    // Basic operations
    undo: 'Undo',
    redo: 'Redo',
    undoDisabledInCollab: 'Disabled in collaboration mode',
    redoDisabledInCollab: 'Disabled in collaboration mode',
    clearFormat: 'Clear Format',
    formatPainter: 'Format Painter',

    // Font
    font: 'Font',
    fontSize: 'Font Size',
    lineHeight: 'Line Height',

    // Insert
    insertLink: 'Insert Link',
    insertImage: 'Insert Image',
    insertTable: 'Insert Table',
    image: 'Image',
    link: 'Link',
    editLink: 'Edit Link',
    openLink: 'Open Link',
    removeLink: 'Remove Link',
    linkPlaceholder: 'Enter link URL',
    imagePlaceholder: 'Enter image URL',

    // Table
    deleteTable: 'Delete Table',
    includeHeader: 'Include Header',

    // Upload
    localUpload: 'Local Upload',
    localUploadImage: 'Upload Image from Local',
    webUpload: 'Web Upload',
    clickOrDragUpload: 'Click or drag file to this area to upload',
    onlySupportImage: 'Only image formats are supported',

    // Word Import/Export
    word: 'Word',
    importWord: 'Import Word',
    exportWord: 'Export Word',
    clickOrDragUploadWord: 'Click or drag Word file to this area',
    onlySupportDocx: 'Only .docx format is supported',
    importing: 'Importing...',
    exporting: 'Exporting...',
    exportFilenamePlaceholder: 'Enter file name',
    importSuccess: 'Word file imported successfully',
    exportSuccess: 'Word file exported successfully',
    importFailed: 'Word file import failed',
    exportFailed: 'Word file export failed',

    // More
    more: 'More',
    aiTool: 'AI Tool',
    ai: 'AI',

    // Format painter related
    pleaseSelectTextToSample: 'Please select text to sample first',
    pleaseSelectTextToSampleShort: 'Please select text first',
    pleaseSelectTextToSampleDouble: 'Please double-click to select text to sample',
    sampleSuccessSingle: 'Format sampled successfully, click target text to apply format',
    sampleSuccessContinuous: 'Format sampled successfully, you can click multiple target texts to apply format',
    formatPainterExited: 'Format painter mode exited',
    collaborationNoFormatPainter: 'Format painter is not supported in collaboration mode',

    // Link related
    enterValidLink: 'Please enter a valid link URL',

    // Math
    math: 'Math Formula',
    mathInline: 'Inline Formula',
    mathBlock: 'Block Formula',
    mathPlaceholder: 'Enter LaTeX formula...',
    mathEmpty: 'Click to edit formula',

    // AI related
    continueWriting: 'Continue Writing',
    polish: 'Polish Text',
    summarize: 'Summarize Content',
    translate: 'Translate',
    translateTo: 'Translate to {lang}',
    customAi: 'Custom AI',
    selectLanguage: 'Select Language',

    // AI suggestion related
    aiSuggestion: 'AI Suggestion',
    aiContinueWriting: 'AI Continue Writing:',
    originalText: 'Original:',
    suggestedText: 'Suggestion:',
    generatedContent: 'Generated Content:',
    generating: 'Generating...',
    selectedContent: 'Selected Content:',
    currentStatus: 'Current Status',
    noTextSelected: 'No text selected, AI content will be inserted at cursor position',
    // AI feature prompt messages
    pleaseSelectText: 'Please select text first',
    continueWritingRequiresSelection: 'Continue writing requires selecting text to continue',
    polishRequiresSelection: 'Polish function requires selecting text to polish first',
    summarizeRequiresSelection: 'Summarize function requires selecting text to summarize first',
    translateRequiresSelection: 'Translation function requires selecting text to translate first',
    customAiRequiresSelection: 'Custom AI function requires selecting text to process first',
    aiPrompt: 'AI Prompt',
    aiPromptPlaceholder: 'Enter AI instruction, e.g.: Optimize this text, Translate to English...',
    customAiCommand: 'Custom AI Command',
    customAiPromptPlaceholder: 'Enter your AI instruction, e.g.: Please optimize this text, Please translate to English, Please summarize key points, etc.',
    execute: 'Execute',
    cancel: 'Cancel',
    reject: 'Reject',
    accept: 'Accept',

    // Language codes
    lang: {
      'zh-CN': 'Simplified Chinese',
      'zh-TW': 'Traditional Chinese',
      zh: 'Chinese',
      en: 'English',
      ja: 'Japanese',
      th: 'Thai',
      fr: 'French',
      es: 'Spanish',
      pt: 'Portuguese',
      ko: 'Korean',
      vi: 'Vietnamese',
      ru: 'Russian',
      de: 'German',
      hi: 'Hindi',
      id: 'Indonesian',
      ar: 'Arabic',
    },
  },

  versionHistory: {
    title: 'Version History',
    saveVersion: 'Save Version',
    noVersions: 'No versions yet',
    autoSave: 'Auto-saved',
    words: 'words',
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    restore: 'Restore',
    compare: 'Compare',
    rename: 'Rename',
    delete: 'Delete',
    comparing: 'Comparing',
    clearCompare: 'Clear',
    versionName: 'Version name',
    saved: 'Version saved',
    restored: 'Version restored',
    deleted: 'Version deleted',
    noDiff: 'No differences',
  },

  aiSettings: {
    title: 'AI Settings',
    provider: 'AI Provider',
    apiKeyPlaceholder: 'Enter API Key',
    apiKeyHint: 'API Key is stored locally in your browser and will not be uploaded to any server',
    endpoint: 'API Endpoint',
    model: 'Model',
    enableAi: 'Enable AI Features',
    testConnection: 'Test Connection',
    testing: 'Testing...',
    testSuccess: 'Connection Successful',
    testFailed: 'Connection Failed',
    viewDocs: 'View Docs',
    save: 'Save',
    cancel: 'Cancel',
    clear: 'Clear Config',
  },
}

export default enUS
