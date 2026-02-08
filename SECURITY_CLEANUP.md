# 🚨 安全清理指南

## 立即行动（5 分钟内）

### 1. 撤销泄露的 API Key ⚡ 最紧急！

**Moltbook API Key 已泄露！**

立即前往 Moltbook 控制台：
1. 登录 https://www.moltbook.com
2. 找到 API Keys 页面
3. 撤销/删除这个 key：`moltbook_sk_mCIahWMqZbVoxlCtltanI9k1HZG3OX-t`
4. 生成新的 API key

---

## Git 历史清理方案

### 方案选择

#### 🔥 方案 A：完全重置（推荐 - 最简单）
**适用于：项目刚开源，还没有其他人 clone**

```bash
# 1. 备份当前代码
cd /Users/kamyuenngai/Desktop/Ben/Tiptap-UI-Kit
cp -r . ../Tiptap-UI-Kit-backup

# 2. 删除 git 历史，重新初始化
rm -rf .git
git init
git branch -M main

# 3. 清理敏感文件
rm -f .env
rm -f .claude/settings.local.json

# 4. 确保 .gitignore 正确
echo "" >> .gitignore
echo "# Local settings" >> .gitignore
echo ".claude/settings.local.json" >> .gitignore

# 5. 创建干净的初始提交
git add .
git commit -m "chore: initial open source release

- Complete rewrite of git history for security
- Remove all sensitive information
- Clean slate for open source community

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 6. 强制推送到 GitHub（会覆盖所有历史）
git remote add origin https://github.com/benngaihk/Tiptap-UI-Kit.git
git push -f origin main
```

**优点：**
- ✅ 最简单、最彻底
- ✅ 100% 确保没有敏感信息
- ✅ 不需要安装额外工具

**缺点：**
- ❌ 失去所有提交历史
- ❌ 其他人需要重新 clone

---

#### 🔧 方案 B：使用 BFG Repo-Cleaner（保留历史）
**适用于：想保留提交历史**

```bash
# 1. 安装 BFG（Mac）
brew install bfg

# 2. 创建要删除的文件列表
echo ".env" > files-to-delete.txt
echo ".claude/settings.local.json" >> files-to-delete.txt

# 3. Clone 一个镜像仓库
cd /Users/kamyuenngai/Desktop/Ben
git clone --mirror https://github.com/benngaihk/Tiptap-UI-Kit.git Tiptap-UI-Kit-mirror
cd Tiptap-UI-Kit-mirror

# 4. 使用 BFG 清理
bfg --delete-files .env
bfg --delete-files settings.local.json
bfg --replace-text ../replacements.txt  # 可选：替换文本

# 5. 清理和压缩
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 6. 强制推送
git push --force

# 7. 返回工作目录，重新 clone
cd /Users/kamyuenngai/Desktop/Ben/Tiptap-UI-Kit
git fetch origin
git reset --hard origin/main
```

**优点：**
- ✅ 保留提交历史
- ✅ 保留贡献者信息
- ✅ 快速高效

**缺点：**
- ❌ 需要安装工具
- ❌ 稍微复杂

---

#### 🛠️ 方案 C：使用 git-filter-repo（最专业）
**适用于：需要精细控制**

```bash
# 1. 安装 git-filter-repo
pip3 install git-filter-repo

# 2. 备份
cd /Users/kamyuenngai/Desktop/Ben
cp -r Tiptap-UI-Kit Tiptap-UI-Kit-backup

# 3. 删除敏感文件
cd Tiptap-UI-Kit
git filter-repo --invert-paths --path .env --path .claude/settings.local.json

# 4. 重新添加远程仓库
git remote add origin https://github.com/benngaihk/Tiptap-UI-Kit.git

# 5. 强制推送
git push -f origin main
```

---

## 推荐方案

### 🎯 我强烈推荐方案 A（完全重置）

**原因：**
1. 项目刚刚设为 public
2. 可能还没有其他开发者 clone
3. 最简单、最安全
4. 提交历史对开源项目价值不大
5. 可以创建一个干净的起点

---

## 执行后的验证

### 1. 本地验证
```bash
# 搜索敏感信息
git log --all --full-history -S "moltbook_sk" --source
git log --all --full-history -S "VITE_AI_API_KEY=" --source

# 应该没有任何结果
```

### 2. GitHub 验证
1. 前往 GitHub 仓库
2. 使用 GitHub 搜索功能搜索 `moltbook_sk`
3. 应该没有任何结果

### 3. 使用工具扫描
```bash
# 安装并运行 gitleaks（可选）
brew install gitleaks
gitleaks detect --source . --verbose
```

---

## 预防措施

### 1. 更新 .gitignore
```bash
cat >> .gitignore << 'EOF'

# ===== 安全 - 本地配置文件 =====
.env
.env.local
.env.*.local
.claude/settings.local.json
**/*secret*
**/*key*
**/*.pem
EOF
```

### 2. 设置 pre-commit hook
```bash
# 创建 .git/hooks/pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# 检查是否包含敏感信息

if git diff --cached | grep -i "api[_-]\?key\|secret\|password\|sk-\|_sk_"; then
    echo "❌ 错误：提交中包含疑似敏感信息！"
    echo "请检查并移除敏感信息后再提交。"
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

### 3. 使用环境变量
所有敏感信息都应该：
- 存储在 `.env.local`（不提交）
- 或使用 GitHub Secrets
- 或使用 Vercel 环境变量

---

## 需要清理的文件列表

根据扫描结果，以下文件需要注意：

### ⚠️ 必须清理
- `.claude/settings.local.json` - 包含 Moltbook API key

### ✅ 已正确配置
- `.env` - 已在 gitignore 中
- `.env.example` - 只是模板，安全

---

## FAQ

### Q: 如果有人已经 clone 了怎么办？
A:
1. 立即撤销 API key（已经泄露）
2. 在 README 中添加公告，告知历史已重写
3. 通知已知的 contributors 重新 clone

### Q: 会影响 GitHub Stars 吗？
A: 不会，Stars 和仓库绑定，不会因为历史重写而丢失。

### Q: 其他人的 fork 怎么办？
A: Fork 会保留旧历史，但无法控制。重点是撤销 API key。

---

## 执行清单

- [ ] 撤销 Moltbook API key
- [ ] 备份当前代码
- [ ] 选择清理方案（推荐方案 A）
- [ ] 执行清理
- [ ] 验证清理结果
- [ ] 更新 .gitignore
- [ ] 设置 pre-commit hook
- [ ] 在 README 添加说明（如果重写了历史）

---

## 需要帮助？

如果你需要帮助执行这些步骤，我可以：
1. 逐步指导你执行命令
2. 帮你验证清理结果
3. 生成公告文本（如果需要通知用户）
