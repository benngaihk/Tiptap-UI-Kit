# Gumroad 销售设置指南

## 🎯 为什么选择 Gumroad？

✅ **无需技术背景** - 点击几下就能开始销售
✅ **自动交付** - 购买后自动发送文件
✅ **全球支付** - 支持 PayPal、信用卡
✅ **0 启动成本** - 只收取交易手续费（8.5% + $0.30）
✅ **管理简单** - 客户、订单、分析一目了然

## 📝 步骤 1：注册 Gumroad

1. 访问 https://gumroad.com
2. 点击"Start Selling"
3. 使用邮箱注册（或 Google 账号）
4. 验证邮箱

## 💳 步骤 2：设置收款

1. 登录后，进入 Settings → Payments
2. 连接 PayPal 或 Stripe
3. 填写税务信息（如需要）

**推荐：** 使用 PayPal（最简单）

## 📦 步骤 3：创建产品

### 产品 1：Solo License

1. 点击"+ New Product"
2. 选择"Digital Product"
3. 填写信息：

**基本信息：**
```
Product Name: Tiptap UI Kit - Solo Developer License
Price: $99 (或早鸟价 $49)
Short URL: tiptap-ui-kit-solo (自定义)
```

**描述：**
```markdown
# Tiptap UI Kit - Solo Developer License 🎨

A beautiful, AI-powered rich text editor for Vue 3

## What's Included ✅

- ✨ Complete source code
- 📚 Full documentation
- 🔄 6 months of updates
- 💬 GitHub Issues support
- 🔑 License key for 1 developer

## Features

- 🎨 5 Premium themes (Word, Notion, GitHub, Typora)
- 🤖 AI-powered writing (continue, polish, translate, summarize)
- 🌓 Light/Dark mode
- 📝 Word document mode (A4 layout + pagination)
- 🤝 Real-time collaboration (Yjs)
- 🌍 i18n (Chinese, English)
- 🛠️ 50+ features (see demo)

## Live Demo

🌐 https://your-demo-link.vercel.app

## Requirements

- Vue 3.4+
- Node.js 18+

## License Terms

- ✅ Use in unlimited personal projects
- ✅ Use in client projects (as developer)
- ✅ Modify and extend the code
- ❌ Cannot redistribute or resell
- ❌ Cannot remove copyright notices

## Delivery

Instant download after purchase:
- Source code (.zip)
- License key
- Documentation

## Support

- Email support
- GitHub Issues
- Response within 48 hours

---

*30-day money-back guarantee*

*Questions? Contact: your-email@example.com*
```

**封面图片：**
- 上传项目截图（推荐尺寸：1600x900）
- 可以用演示界面截图

**文件：**
1. 先运行构建脚本：
   ```bash
   ./scripts/build-release.sh
   ```

2. 上传生成的 `.zip` 文件

或者：
- 勾选"I'll send the product to customers myself"
- 购买后手动发送（更灵活）

### 产品 2：Team License

重复上述步骤，修改：
```
Product Name: Tiptap UI Kit - Team License
Price: $499 (或早鸟价 $199)
```

描述中修改：
- 🔑 License key for up to 10 developers
- ✨ Remove attribution requirement
- 📨 Priority email support

## 🎨 步骤 4：优化产品页面

### 添加截图

1. 在产品页面点击"Add more images"
2. 上传 3-5 张高质量截图：
   - 主界面
   - 主题对比
   - AI 功能演示
   - 表格功能
   - Word 模式

### 添加演示视频（可选）

1. 上传到 YouTube（Unlisted）
2. 在 Gumroad 添加视频链接

### 设置早鸟优惠

1. 在产品设置中
2. 勾选"Offer a discount"
3. 设置：
   ```
   Discount: 50% off
   Code: EARLYBIRD (可选)
   Limit: 50 uses (前50名)
   ```

## 📧 步骤 5：设置自动化邮件

1. 进入产品设置 → Email
2. 编辑"Purchase confirmation email"：

```
Hi {buyer_name},

Thank you for purchasing Tiptap UI Kit Solo License! 🎉

Your license key: TIPTAP-{purchase_id}

📦 Download your package here:
{download_link}

📚 Documentation:
https://github.com/benngaihk/Tiptap-UI-Kit

💬 Support:
- GitHub Issues: https://github.com/benngaihk/Tiptap-UI-Kit/issues
- Email: your-email@example.com

🔄 Updates:
You'll receive all v1.x updates for free for 6 months.

Happy coding! 🚀

Ben
Tiptap UI Kit
```

## 🚀 步骤 6：发布产品

1. 检查所有信息
2. 点击"Publish"
3. 获得产品链接：`https://gumroad.com/l/tiptap-ui-kit-solo`

## 📣 步骤 7：开始推广

### 更新 README.md

```markdown
## 💰 Pricing

### Solo License - $49 (Early Bird)
Perfect for individual developers

[Purchase Now →](https://gumroad.com/l/tiptap-ui-kit-solo)

### Team License - $199 (Early Bird)
Up to 10 developers

[Purchase Now →](https://gumroad.com/l/tiptap-ui-kit-team)
```

### 分享链接

- Twitter/X
- Reddit
- Moltbook
- Dev.to
- 朋友圈

## 📊 跟踪销售

### 查看数据

登录 Gumroad Dashboard 可以看到：
- 💰 总收入
- 📈 销售图表
- 👥 客户列表
- 🔄 转化率

### 获取客户邮箱

1. Dashboard → Products → Your Product
2. 点击"Customers"
3. 可以导出 CSV 用于发送更新通知

## 🔄 处理更新

当你发布新版本时：

1. 构建新的发布包：
   ```bash
   # 更新版本号
   npm version patch  # 0.1.0 → 0.1.1

   # 构建
   ./scripts/build-release.sh
   ```

2. 在 Gumroad 替换文件：
   - 产品设置 → Content
   - 上传新的 .zip

3. 通知客户：
   - 使用 Gumroad 的"Email customers"功能
   - 或手动发送邮件

## 💡 优化技巧

### 提高转化率

1. **社会证明**
   - 在描述中添加客户评价
   - 展示下载/购买数量

2. **紧迫感**
   - "Limited Early Bird: Only 50 spots left!"
   - "Price increases to $99 in 7 days"

3. **风险逆转**
   - 强调 30 天退款保证
   - "不满意全额退款"

### A/B 测试

尝试不同的：
- 价格点（$49 vs $79）
- 标题
- 描述
- 截图顺序

## 🆘 常见问题

**Q: 如何处理退款？**
A: Gumroad → Sales → 找到订单 → Refund

**Q: 手续费是多少？**
A: 8.5% + $0.30 per transaction

**Q: 多久能收到钱？**
A:
- PayPal：每周五自动转账
- Stripe：每周五

**Q: 需要缴税吗？**
A: 根据你的国家/地区，可能需要。咨询会计师。

**Q: 如果有人盗版怎么办？**
A:
1. DMCA 投诉
2. 社区信任
3. 持续更新让盗版过时

## ✅ 检查清单

发布前确认：

- [ ] Gumroad 账号已创建
- [ ] 收款方式已设置
- [ ] 产品信息完整
- [ ] 截图已上传
- [ ] 价格已设置
- [ ] 发布包已准备
- [ ] 自动邮件已配置
- [ ] 测试购买流程
- [ ] README 已更新购买链接

## 🎯 下一步

1. 完成 Gumroad 设置（30 分钟）
2. 部署 Demo 到 Vercel
3. 创建截图和视频
4. 开始推广！

---

**准备好开始销售了吗？** 🚀

访问 https://gumroad.com 立即开始！
