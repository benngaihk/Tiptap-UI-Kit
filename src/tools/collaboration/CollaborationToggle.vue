<template>
  <a-popover
    v-if="enabled && collaboratorsList.length > 0"
    placement="bottomRight"
    :overlay-style="{ maxWidth: '300px' }"
  >
    <template #content>
      <div class="all-collaborators-popover">
        <div class="popover-title">在线用户 ({{ collaboratorsList.length }})</div>
        <div class="popover-users">
          <div
            v-for="user in collaboratorsList"
            :key="user.id"
            class="popover-user-item"
          >
            <div
              class="popover-avatar"
              :style="{ backgroundColor: user.color }"
            >
              {{ getAvatarText(user.name) }}
            </div>
            <span class="popover-user-name">{{ user.name }}</span>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 触发器：只显示人数和第一个用户头像 -->
    <div class="collaboration-toggle">
      <span class="toggle-label">协作</span>
      <span class="toggle-text enabled">已开启 ({{ collaboratorsList.length }})</span>
      <div
        v-if="firstUser"
        class="avatar-item"
        :style="{ backgroundColor: firstUser.color }"
      >
        {{ getAvatarText(firstUser.name) }}
      </div>
    </div>
  </a-popover>
  
  <!-- 未开启协作或无用户时的显示 -->
  <div v-else class="collaboration-toggle">
    <span class="toggle-label">协作</span>
    <span v-if="!enabled" class="toggle-text">已关闭</span>
    <span v-else class="toggle-text enabled">已开启 (0)</span>
  </div>
</template>

<script setup lang="ts">
/**
 * CollaborationToggle - 协作编辑状态显示组件
 * @description 根据传入的 modelValue 控制协作功能的开启/关闭，默认关闭
 */
import { computed } from 'vue'
import { Popover as APopover } from 'ant-design-vue'
import type { CollaboratorInfo } from './types'

interface Props {
  /** 是否启用协作功能（v-model 绑定，默认 false） */
  modelValue?: boolean
  /** 是否显示标签 */
  showLabel?: boolean
  /** 在线用户数（已废弃，使用 collaboratorsList） */
  collaboratorsCount?: number
  /** 在线用户列表 */
  collaboratorsList?: CollaboratorInfo[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  showLabel: false,
  collaboratorsCount: 0,
  collaboratorsList: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

/** 是否启用（内部计算属性，基于 modelValue） */
const enabled = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

/** 在线用户列表（直接使用 props，已有默认值） */
const collaboratorsList = computed(() => props.collaboratorsList)

/** 第一个用户（用于头像显示） */
const firstUser = computed(() => collaboratorsList.value[0] || null)

/**
 * 获取头像文本（用户名首字符或前两个字符）
 * @description 中文取前两个字符，英文取首字母大写
 */
const getAvatarText = (name: string): string => {
  if (!name?.trim()) return '?'
  const trimmed = name.trim()
  // 检测是否为中文（包括中文标点）
  return /[\u4e00-\u9fa5]/.test(trimmed) ? trimmed.slice(0, 2) : trimmed.charAt(0).toUpperCase()
}
</script>

<style scoped lang="css">
.collaboration-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.collaboration-toggle:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.toggle-label {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.toggle-text {
  font-size: 12px;
  color: #666;
}

.toggle-text.enabled {
  color: #52c41a;
}

/* 头像样式 */
.avatar-item,
.popover-avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #fff;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.avatar-item {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

/* Popover 样式 */
.all-collaborators-popover {
  min-width: 180px;
}

.popover-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.popover-users {
  max-height: 300px;
  overflow-y: auto;
}

.popover-user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.popover-user-item:last-child {
  border-bottom: none;
}

.popover-avatar {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.popover-user-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

