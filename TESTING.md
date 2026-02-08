# Testing Guide

This document provides guidelines for testing Tiptap UI Kit.

## 🧪 Test Framework

We use [Vitest](https://vitest.dev/) as our testing framework along with:
- **@vue/test-utils** - Vue component testing utilities
- **happy-dom** - Fast DOM implementation for Node.js
- **@vitest/ui** - Beautiful UI for running tests

## 🚀 Running Tests

### Run All Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Run Specific Tests

```bash
# Run tests in a specific file
pnpm test src/ui/__tests__/ToolbarButton.spec.ts

# Run tests matching a pattern
pnpm test -- -t "ToolbarButton"

# Run tests in a directory
pnpm test src/ui
```

## 📁 Test Structure

```
src/
├── __tests__/              # General tests
│   └── example.spec.ts
├── ui/
│   ├── __tests__/          # UI component tests
│   │   └── ToolbarButton.spec.ts
│   └── ToolbarButton.vue
├── features/
│   └── text-format/
│       ├── __tests__/      # Feature-specific tests
│       └── TextFormat.vue
└── utils/
    ├── __tests__/          # Utility function tests
    └── editorCommands.ts
```

## ✍️ Writing Tests

### Component Tests

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Hello World',
      },
    })

    expect(wrapper.text()).toContain('Hello World')
  })

  it('emits events', async () => {
    const wrapper = mount(MyComponent)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Utility Function Tests

```typescript
import { describe, it, expect } from 'vitest'
import { myUtilFunction } from '../utils'

describe('myUtilFunction', () => {
  it('should return correct result', () => {
    const result = myUtilFunction('input')
    expect(result).toBe('expected output')
  })

  it('should handle edge cases', () => {
    expect(myUtilFunction('')).toBe('')
    expect(myUtilFunction(null)).toBe(null)
  })
})
```

### Testing Tiptap Editor

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Editor } from '@tiptap/core'
import TiptapProEditor from '../core/TiptapProEditor.vue'

describe('TiptapProEditor', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(TiptapProEditor, {
      props: {
        features: {
          heading: true,
          textFormat: true,
        },
      },
    })
  })

  it('initializes editor instance', () => {
    expect(wrapper.vm.editor).toBeInstanceOf(Editor)
  })

  it('applies bold formatting', async () => {
    const editor = wrapper.vm.editor

    editor.chain().focus().toggleBold().run()

    expect(editor.isActive('bold')).toBe(true)
  })
})
```

## 📊 Coverage

### View Coverage Report

After running `pnpm test:coverage`, open:
```
coverage/index.html
```

### Coverage Goals

- **Overall**: 80%+
- **Core Components**: 90%+
- **Utilities**: 95%+
- **UI Components**: 85%+

## 🎯 Testing Best Practices

### DO

✅ **Test user behavior, not implementation**
```typescript
// Good
expect(wrapper.text()).toContain('Hello')

// Bad
expect(wrapper.vm.internalState).toBe('something')
```

✅ **Test one thing at a time**
```typescript
it('renders title', () => {
  expect(wrapper.text()).toContain('Title')
})

it('emits click event', () => {
  // Separate test
})
```

✅ **Use descriptive test names**
```typescript
// Good
it('shows error message when input is empty')

// Bad
it('works')
```

✅ **Clean up after tests**
```typescript
afterEach(() => {
  wrapper.unmount()
})
```

### DON'T

❌ **Don't test third-party libraries**
```typescript
// Don't test Tiptap itself
it('Tiptap editor exists', () => {
  // This tests Tiptap, not your code
})
```

❌ **Don't test implementation details**
```typescript
// Bad - tests internal state
expect(wrapper.vm._internalCounter).toBe(1)

// Good - tests behavior
expect(wrapper.find('.counter').text()).toBe('1')
```

❌ **Don't write flaky tests**
```typescript
// Bad - depends on timing
setTimeout(() => {
  expect(wrapper.text()).toBe('Loaded')
}, 100)

// Good - use await
await wrapper.vm.$nextTick()
expect(wrapper.text()).toBe('Loaded')
```

## 🔍 Testing Checklist

When adding new features:

- [ ] Write unit tests for new components
- [ ] Write integration tests for component interactions
- [ ] Test edge cases and error states
- [ ] Test accessibility features
- [ ] Ensure all tests pass
- [ ] Maintain or improve coverage percentage

## 🐛 Debugging Tests

### Use `test.only`

Run only a specific test:
```typescript
it.only('this test will run', () => {
  // ...
})
```

### Use `test.skip`

Skip a failing test temporarily:
```typescript
it.skip('fix this later', () => {
  // ...
})
```

### Debug with Console

```typescript
it('debugs values', () => {
  const wrapper = mount(Component)
  console.log(wrapper.html())  // See HTML output
  console.log(wrapper.vm)      // See component instance
})
```

### Use Vitest UI

```bash
pnpm test:ui
```

Opens a browser UI where you can:
- See test results visually
- Debug failing tests
- Inspect component state

## 📚 Testing Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎯 Example Test Files

See these files for examples:
- `src/__tests__/example.spec.ts` - Basic test structure
- `src/ui/__tests__/ToolbarButton.spec.ts` - Component testing
- More examples coming soon!

## 🚧 Current Status

The test suite is under active development. Contributions welcome!

Priority testing areas:
1. ✅ Basic test infrastructure setup
2. ⏳ Core editor component tests
3. ⏳ UI component tests
4. ⏳ Feature module tests
5. ⏳ Utility function tests
6. ⏳ Integration tests
7. ⏳ E2E tests

---

**Need help writing tests?** [Open an issue](https://github.com/benngaihk/Tiptap-UI-Kit/issues)
