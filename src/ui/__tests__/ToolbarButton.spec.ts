import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import ToolbarButton from '../ToolbarButton.vue'

// Mock icon component
const MockIcon = defineComponent({
  render() {
    return h('span', { class: 'mock-icon' }, 'icon')
  }
})

describe('ToolbarButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(ToolbarButton, {
      props: {
        icon: MockIcon,
        title: 'Bold',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(ToolbarButton, {
      props: {
        icon: MockIcon,
        title: 'Bold',
      },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies active class when active prop is true', () => {
    const wrapper = mount(ToolbarButton, {
      props: {
        icon: MockIcon,
        title: 'Bold',
        active: true,
      },
    })

    // Check if active class is present on button element
    expect(wrapper.find('button').classes()).toContain('is-active')
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(ToolbarButton, {
      props: {
        icon: MockIcon,
        title: 'Bold',
        disabled: true,
      },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
