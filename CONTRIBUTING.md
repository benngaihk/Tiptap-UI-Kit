# Contributing to Tiptap UI Kit

Thank you for your interest in contributing to Tiptap UI Kit! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

There are many ways to contribute to this project:

- 🐛 **Report bugs** - Found a bug? Let us know!
- 💡 **Suggest features** - Have an idea? We'd love to hear it!
- 📝 **Improve documentation** - Help make our docs better
- 🔀 **Submit pull requests** - Fix bugs or add features
- ⭐ **Star the project** - Show your support!
- 💬 **Help others** - Answer questions in issues

## 📋 Code of Conduct

This project follows a Code of Conduct. By participating, you are expected to uphold this code:

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Prioritize the community's best interests

## 🐛 Reporting Bugs

Before submitting a bug report:

1. **Check existing issues** - Your issue might already be reported
2. **Use the latest version** - Make sure you're using the current release
3. **Provide details** - Include steps to reproduce, expected vs actual behavior

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS 14.0]
 - Browser: [e.g. Chrome 120]
 - Version: [e.g. 0.1.0]

**Additional context**
Any other context about the problem.
```

## 💡 Suggesting Features

We love feature suggestions! Before submitting:

1. **Check existing suggestions** - Someone might have already suggested it
2. **Be specific** - Clearly describe the feature and its benefits
3. **Consider alternatives** - What other solutions have you considered?

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.
```

## 🔀 Pull Request Process

### Before You Start

1. **Open an issue first** - Discuss major changes before implementing
2. **Check for duplicates** - Make sure no one else is working on it
3. **Fork the repository** - Create your own fork to work on

### Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/Tiptap-UI-Kit.git
cd Tiptap-UI-Kit

# 2. Install dependencies
pnpm install

# 3. Create a new branch
git checkout -b feature/your-feature-name

# 4. Start development server
pnpm dev

# 5. Make your changes
# ...

# 6. Run type checking
pnpm typecheck

# 7. Build to verify
pnpm build
```

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(editor): add markdown export feature
fix(toolbar): resolve button alignment issue
docs(readme): update installation instructions
style(button): improve button hover state
refactor(ai): simplify AI provider setup
test(table): add table component tests
chore(deps): update dependencies
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pull Request Checklist

Before submitting your PR, make sure:

- [ ] Code follows the project's style guidelines
- [ ] You've run `pnpm typecheck` without errors
- [ ] You've run `pnpm build` successfully
- [ ] You've tested your changes thoroughly
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow the convention
- [ ] PR description clearly explains the changes

### Pull Request Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Related Issue
Fixes #(issue number)

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Screenshots (if applicable)
Add screenshots to demonstrate the changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
```

## 📁 Project Structure

Understanding the project structure helps you navigate:

```
src/
├── core/          # Core editor components
├── features/      # Feature modules (text format, headings, etc.)
├── ai/            # AI-related functionality
├── tools/         # Editor tools (toolbars, menus)
├── ui/            # Base UI components
├── extensions/    # Tiptap extensions
├── styles/        # CSS styles
├── themes/        # Theme system
├── locales/       # i18n translations
├── utils/         # Utility functions
└── index.ts       # Main entry point
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` type when possible
- Use interfaces for object types

### Vue Components

- Use Composition API (`<script setup>`)
- Keep components focused and small
- Use props with proper types
- Emit events with typed payloads

### CSS

- Use CSS variables for theming
- Follow BEM naming convention
- Prefix custom properties with `--tp-`
- Support both light and dark modes

### Code Style

- 2 spaces for indentation
- Single quotes for strings
- Semicolons at end of statements
- Trailing commas in objects/arrays

## 🧪 Testing

Currently, we're setting up our testing infrastructure. In the future:

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

When adding features, please include appropriate tests.

## 📝 Documentation

When contributing documentation:

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Update relevant README sections
- Check for typos and grammar

## 🔍 Review Process

After submitting a PR:

1. **Automated checks** run (type checking, build)
2. **Maintainer review** - We'll review your code
3. **Feedback** - We may request changes
4. **Approval** - Once approved, we'll merge
5. **Release** - Changes included in next release

## 📞 Getting Help

Need help? Here's how to reach us:

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and discussions
- **Documentation** - Check the README first

## 🎉 Recognition

Contributors will be:

- Listed in our README (coming soon)
- Mentioned in release notes
- Part of our growing community

## 📜 License

By contributing, you agree that your contributions will be licensed under the same [Commercial License](LICENSE) as the project.

---

Thank you for contributing to Tiptap UI Kit! 🙏
