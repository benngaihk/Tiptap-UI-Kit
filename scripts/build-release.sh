#!/bin/bash
# 构建发布包脚本

set -e  # 遇到错误立即退出

echo "🚀 Building Tiptap UI Kit Release Package..."

# 获取版本号
VERSION=$(node -p "require('./package.json').version")
echo "📦 Version: $VERSION"

# 清理旧的构建
echo "🧹 Cleaning old builds..."
rm -rf dist/
rm -f tiptap-ui-kit-*.zip

# 构建项目
echo "🔨 Building project..."
pnpm build

# 创建发布目录
RELEASE_DIR="tiptap-ui-kit-v${VERSION}"
echo "📁 Creating release directory: $RELEASE_DIR"
mkdir -p $RELEASE_DIR

# 复制必要文件
echo "📋 Copying files..."
cp -r src/ $RELEASE_DIR/
cp -r dist/ $RELEASE_DIR/
cp package.json $RELEASE_DIR/
cp pnpm-lock.yaml $RELEASE_DIR/
cp README.md $RELEASE_DIR/
cp LICENSE $RELEASE_DIR/
cp CHANGELOG.md $RELEASE_DIR/
cp tsconfig.json $RELEASE_DIR/
cp vite.config.ts $RELEASE_DIR/
cp -r .github/ $RELEASE_DIR/

# 复制文档
mkdir -p $RELEASE_DIR/docs
cp CONTRIBUTING.md $RELEASE_DIR/docs/
cp TESTING.md $RELEASE_DIR/docs/
cp DEPLOYMENT.md $RELEASE_DIR/docs/
cp PRICING.md $RELEASE_DIR/docs/

# 创建安装说明
cat > $RELEASE_DIR/INSTALLATION.md << 'EOF'
# Tiptap UI Kit - Installation Guide

Thank you for purchasing Tiptap UI Kit!

## Quick Start

1. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Import in your project:
   \`\`\`typescript
   import { TiptapProEditor } from './src'
   import './dist/tiptap-ui-kit.css'
   \`\`\`

3. Or use the built version:
   \`\`\`typescript
   import { TiptapProEditor } from './dist'
   \`\`\`

## License

Your license key: [WILL BE PROVIDED]

For support: https://github.com/benngaihk/Tiptap-UI-Kit/issues

## Documentation

- README.md - Full documentation
- docs/TESTING.md - How to run tests
- docs/DEPLOYMENT.md - How to deploy
- CHANGELOG.md - Version history

Enjoy building! 🚀
EOF

# 打包
FILENAME="tiptap-ui-kit-v${VERSION}.zip"
echo "📦 Creating zip archive: $FILENAME"
zip -r $FILENAME $RELEASE_DIR/ \
  -x "*.git*" \
  -x "*node_modules/*" \
  -x "*.DS_Store"

# 清理临时目录
rm -rf $RELEASE_DIR/

# 显示结果
echo ""
echo "✅ Release package created successfully!"
echo ""
echo "📦 File: $FILENAME"
echo "📊 Size: $(du -h $FILENAME | cut -f1)"
echo ""
echo "📤 Upload this file to Gumroad or send to customers"
echo ""
