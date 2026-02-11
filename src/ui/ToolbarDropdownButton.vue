<template>
  <a-dropdown :placement="placement" :trigger="['click']" v-model:open="dropdownOpen">
    <a-tooltip :title="title" placement="top" :open="dropdownOpen ? false : undefined">
      <a-button type="text" :class="['tt-dropdown-btn', { 'is-active': active }]">
        <span class="tt-dropdown-btn__content">
          <component v-if="icon" :is="icon" class="tt-dropdown-btn__icon" />
          <span v-if="label" class="tt-dropdown-btn__label">{{ label }}</span>
          <DownOutlined class="tt-dropdown-btn__arrow" />
        </span>
      </a-button>
    </a-tooltip>

    <template #overlay>
      <a-menu @click="onMenuClick" style="max-height: 360px; overflow-y: auto;">
        <template v-for="item in items" :key="item.key">
          <a-sub-menu v-if="item.children && item.children.length && item.key !== 'translate'" :key="item.key + ':submenu'">
            <template #title>
              <span class="tt-dropdown-menu-item">
                <component v-if="item.icon" :is="item.icon" class="tt-dropdown-menu-item__icon" />
                <span class="tt-dropdown-menu-item__label">{{ item.label }}</span>
              </span>
            </template>
            <a-menu-item
              v-for="child in item.children"
              :key="child.key"
              :disabled="child.disabled"
              :danger="child.danger"
            >
              <span class="tt-dropdown-menu-item">
                <component v-if="child.icon" :is="child.icon" class="tt-dropdown-menu-item__icon" />
                <span class="tt-dropdown-menu-item__label">{{ child.label }}</span>
              </span>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item v-else-if="item.children && item.key === 'translate'" :key="item.key + ':translate'">
            <div class="tt-translate-split" @mouseenter="onRowEnter" @mouseleave="onRowLeave">
              <span class="tt-translate-split__main">
                <component v-if="item.icon" :is="item.icon" class="tt-dropdown-menu-item__icon" />
                <span class="tt-dropdown-menu-item__label" @click.stop="onTranslateDefault(item)">{{ hasSelectedLang ? (t('editor.translateTo') + currentTranslateLang) : t('editor.selectLanguage') }}</span>
              </span>
              <a-dropdown :trigger="hasSelectedLang ? ['hover'] : []" placement="rightTop" :open="overlayOpen" @openChange="onDropOpenChange">
                <span class="tt-translate-split__arrow" :title="t('editor.selectLanguage')"><RightOutlined /></span>
                <template #overlay>
                  <div class="tt-translate-overlay" @mouseenter="onOverlayEnter" @mouseleave="onOverlayLeave">
                    <a-menu @click="onTranslateLangClick" class="tt-dropdown-overlay" :selectedKeys="selectedLangKey ? [selectedLangKey] : []">
                      <a-menu-item
                        v-for="child in item.children"
                        :key="child.key"
                        :disabled="child.disabled"
                        :danger="child.danger"
                      >
                        <span class="tt-dropdown-menu-item">
                          <span class="tt-dropdown-menu-item__label">{{ child.label }}</span>
                        </span>
                      </a-menu-item>
                    </a-menu>
                  </div>
                </template>
              </a-dropdown>
            </div>
          </a-menu-item>

          <a-menu-item v-else :key="item.key" :disabled="item.disabled" :danger="item.danger" :class="{ 'ant-menu-item-selected': item.active }">
            <span class="tt-dropdown-menu-item">
              <component v-if="item.icon" :is="item.icon" class="tt-dropdown-menu-item__icon" />
              <span class="tt-dropdown-menu-item__label">{{ item.label }}</span>
            </span>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import { Tooltip as ATooltip } from 'ant-design-vue'
import { t } from '@/locales'
import { DownOutlined, RightOutlined } from '@ant-design/icons-vue'
import type { MenuItemConfig } from '@/configs/toolbar'
// import { currentTranslateLang, setTranslateLang } from '../stores/translate'
// 暂时注释掉，后续迁移
const currentTranslateLang = { value: '' }
const setTranslateLang = (_label: string) => {
  // TODO: 实现翻译语言设置功能
}

// 下拉菜单打开状态（用于控制 Tooltip 显示）
const dropdownOpen = ref(false)

interface Props {
  icon?: Component
  label?: string
  title?: string
  active?: boolean
  items: MenuItemConfig[]
  placement?: 'top' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  placement: 'bottom',
})

const emit = defineEmits<{ select: [key: string] }>()

const overlayOpen = ref(false)
const hasSelectedLang = computed(() => !!currentTranslateLang.value)
const selectedLangKey = computed(() => (currentTranslateLang.value ? `translate-${currentTranslateLang.value}` : ''))
let closeTimeout: number | null = null

function cancelClose() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

// Cleanup timeout on component unmount to prevent memory leaks
onBeforeUnmount(() => {
  cancelClose()
})

function scheduleClose() {
  cancelClose()
  closeTimeout = window.setTimeout(() => {
    overlayOpen.value = false
  }, 150)
}

function onRowEnter() {
  if (!hasSelectedLang.value) {
    cancelClose()
    overlayOpen.value = true
  }
}

function onRowLeave() {
  if (!hasSelectedLang.value) {
    scheduleClose()
  }
}

function onOverlayEnter() {
  cancelClose()
}

function onOverlayLeave() {
  scheduleClose()
}

function onDropOpenChange(nextOpen: boolean) {
  if (hasSelectedLang.value) {
    overlayOpen.value = nextOpen
  }
}

function findItemByKey(items: MenuItemConfig[], key: string): MenuItemConfig | undefined {
  for (const item of items) {
    if (item.key === key) return item
    if (item.children?.length) {
      const found = findItemByKey(item.children, key)
      if (found) return found
    }
  }
  return undefined
}

function onMenuClick(info: { key: string }) {
  const item = findItemByKey(props.items, info.key)
  if (!item) return
  dropdownOpen.value = false
  item.action?.()
  emit('select', info.key)
}

function onTranslateDefault(item: MenuItemConfig) {
  if (!hasSelectedLang.value) {
    overlayOpen.value = true
    return
  }
  item.action?.()
}

function onTranslateLangClick(info: { key: string }) {
  const child = findItemByKey(props.items, info.key)
  if (!child) return
  setTranslateLang(child.label)
  child.action?.()
  emit('select', info.key)
}
</script>

<style>
/* 使用全局样式以支持深色模式 */
@media (max-width: 768px) {
  .tt-dropdown-btn {
    height: 28px;
    padding: 0 6px;
  }
  .tt-dropdown-btn__icon {
    font-size: 14px;
  }
  .tt-dropdown-btn__label {
    font-size: 12px;
  }
}

.tt-dropdown-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  line-height: 1;
  color: var(--menu-btn-color, #262626);
  border-radius: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tt-dropdown-btn:hover {
  color: var(--menu-btn-color, #262626);
  background: var(--menu-btn-hover-bg, #f5f5f5);
}

.tt-dropdown-btn.is-active {
  color: var(--menu-primary, #1890ff);
  background: #e6f4ff;
}

[data-theme="dark"] .tt-dropdown-btn.is-active {
  color: #4fc3f7;
  background: #1a4d6e;
}

.tt-dropdown-btn .ant-btn-icon {
  display: none;
}

.tt-dropdown-btn__content {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  gap: 2px;
  align-items: center !important;
  justify-content: center;
  height: 100%;
  white-space: nowrap;
}

.tt-dropdown-btn__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  transition: color 0.2s;
}

.tt-dropdown-btn__icon .anticon {
  font-size: 18px;
}

.tt-dropdown-btn__label {
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}

.tt-dropdown-btn__arrow {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  margin-left: 0;
  font-size: 10px;
  line-height: 1;
  opacity: 0.65;
  transition: opacity 0.2s, transform 0.2s;
}

.tt-dropdown-btn:hover .tt-dropdown-btn__arrow {
  opacity: 1;
}

.tt-dropdown-overlay {
  max-height: 260px !important;
  overflow-y: auto !important;
}

@media (max-width: 768px) {
  .tt-dropdown-overlay {
    max-height: 150px !important;
  }
}

.tt-dropdown-menu-item {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  min-width: 120px;
  font-size: 14px;
}

.tt-dropdown-menu-item__icon {
  font-size: 16px;
  color: rgb(0 0 0 / 65%);
}

[data-theme="dark"] .tt-dropdown-menu-item__icon {
  color: rgb(255 255 255 / 65%);
}

.tt-dropdown-menu-item__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tt-dropdown-overlay .ant-dropdown-menu-item {
  padding: 8px 10px;
}

.tt-dropdown-overlay .ant-dropdown-menu-item-selected {
  background: #e6f4ff !important;
  color: #1677ff !important;
}

[data-theme="dark"] .tt-dropdown-overlay .ant-dropdown-menu-item-selected {
  background: #1a4d6e !important;
  color: #4fc3f7 !important;
}

.tt-translate-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 4px;
}

.tt-translate-split__main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.tt-translate-split__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 4px;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.tt-translate-split__arrow:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

[data-theme="dark"] .tt-translate-split__arrow:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .tt-translate-split {
    gap: 2px;
  }
  
  .tt-translate-split__main {
    gap: 6px;
  }
  
  .tt-translate-split__arrow {
    width: 20px;
    height: 20px;
    margin-left: 2px;
  }
}
</style>

