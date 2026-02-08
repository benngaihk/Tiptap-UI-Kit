# 🚀 立即部署指南

## 方法 1：通过 Vercel 网站（最简单，推荐）⭐

### 步骤 1：推送代码到 GitHub

```bash
# 确保所有更改已提交
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### 步骤 2：部署到 Vercel

1. 访问 https://vercel.com
2. 点击"Sign Up"，用 GitHub 账号登录
3. 点击"Add New Project"
4. 选择你的仓库：`benngaihk/Tiptap-UI-Kit`
5. Vercel 会自动检测 Vite 配置
6. 点击"Deploy"

**完成！** 🎉

几分钟后，你会获得：
- 部署链接：`https://tiptap-ui-kit.vercel.app`
- 自动 HTTPS
- 全球 CDN
- 自动部署（每次 push 自动更新）

---

## 方法 2：通过命令行

```bash
# 登录 Vercel
vercel login

# 首次部署（会询问项目配置）
vercel

# 选择：
# ? Set up and deploy? Yes
# ? Which scope? Your account
# ? Link to existing project? No
# ? What's your project's name? tiptap-ui-kit
# ? In which directory is your code located? ./

# 部署到生产环境
vercel --prod
```

完成后会显示部署链接！

---

## 🎯 部署后要做的事

### 1. 更新 README

```markdown
## 🌐 Live Demo

查看在线演示：[https://your-demo-link.vercel.app](https://your-demo-link.vercel.app)
```

### 2. 自定义域名（可选）

在 Vercel 仪表板：
- Settings → Domains
- 添加你的域名（如果有的话）

### 3. 环境变量

如果需要 AI 功能：
- Settings → Environment Variables
- 添加 `VITE_AI_API_KEY` 等变量

---

## ⚠️ 重要提示

**如果仓库是私有的：**

Vercel 需要访问权限。两个选择：

### 选择 A：保持私有 + Vercel 访问
- Vercel 可以访问私有仓库
- 只有你和部署的站点可见

### 选择 B：创建公开 Demo 仓库（推荐）
- 创建新仓库：`Tiptap-UI-Kit-Demo`
- 只包含 demo 文件夹
- 不包含完整源码
- 公开展示

---

## 📊 监控部署

部署后，Vercel 提供：
- ✅ 部署状态
- 📈 访问分析
- 🐛 错误日志
- 🚀 性能指标

登录 https://vercel.com/dashboard 查看所有数据

---

## 🆘 遇到问题？

### 构建失败

检查构建日志，通常是：
- 依赖缺失：运行 `pnpm install`
- 类型错误：运行 `pnpm typecheck`
- 构建错误：运行 `pnpm build`

### 部署成功但页面空白

检查：
- 控制台是否有错误
- 路由配置是否正确

### 需要帮助

- Vercel 文档：https://vercel.com/docs
- 或在 GitHub 开 Issue

---

**准备好了吗？现在就部署吧！** 🚀
