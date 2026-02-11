<template>
  <div 
    class="device-frame"
    :class="[
      `device-frame--${device}`,
      `device-frame--${orientation}`,
    ]"
    :style="frameStyle"
  >
    <!-- iPad Frame -->
    <div v-if="device === 'pad'" class="device-frame__ipad">
      <div class="device-frame__ipad-notch"></div>
      <div class="device-frame__ipad-screen">
        <slot></slot>
      </div>
      <div class="device-frame__ipad-button"></div>
    </div>
    
    <!-- iPhone Frame (仅 PC 浏览器预览时显示外框) -->
    <div v-else-if="device === 'mobile' && !isMobileBrowser" class="device-frame__iphone">
      <div class="device-frame__iphone-notch">
        <div class="device-frame__iphone-speaker"></div>
        <div class="device-frame__iphone-camera"></div>
      </div>
      <div class="device-frame__iphone-screen">
        <slot></slot>
      </div>
      <div class="device-frame__iphone-home"></div>
    </div>

    <!-- PC / 手机浏览器 - No Frame -->
    <div v-else class="device-frame__pc">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * DeviceFrame - 设备外框组件
 * @description 为编辑器添加 iPad/iPhone 设备外框
 */
import { computed } from 'vue'
import type { DeviceView } from './DeviceSwitcher.vue'

export type Orientation = 'portrait' | 'landscape'

/**
 * 检测当前是否为手机浏览器
 */
function detectMobileBrowser(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /Android.*Mobile|iPhone|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/i.test(ua)
}

interface Props {
  /** 设备类型 */
  device: DeviceView
  /** 屏幕方向 */
  orientation?: Orientation
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'portrait',
})

/** 手机浏览器下跳过设备外框，直接展示内容 */
const isMobileBrowser = detectMobileBrowser()

// 设备尺寸配置 - 使用最大高度，让内容自适应
const deviceSizes = {
  pc: { width: '100%', height: 'auto', maxHeight: 'none' },
  pad: {
    portrait: { width: '820px', height: 'auto', maxHeight: '85vh' },
    landscape: { width: '100%', height: 'auto', maxHeight: '600px' },
  },
  mobile: {
    portrait: { width: '430px', height: 'auto', maxHeight: '85vh' },
    landscape: { width: '100%', height: 'auto', maxHeight: '400px' },
  },
}

const frameStyle = computed(() => {
  // 手机浏览器下不限制尺寸，全屏展示
  if (props.device === 'pc' || (props.device === 'mobile' && isMobileBrowser)) {
    return { width: '100%', height: 'auto' }
  }

  const sizes = deviceSizes[props.device]
  const size = sizes[props.orientation]
  return {
    width: size.width,
    height: size.height,
    maxHeight: size.maxHeight,
  }
})
</script>

<style scoped>
.device-frame {
  position: relative;
  margin: 0 auto;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* ===== PC 模式 - 无外框 ===== */
.device-frame--pc {
  width: 100%;
  height: 100%;
}

.device-frame__pc {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== iPad 外框 ===== */
.device-frame__ipad {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 500px;
  background: linear-gradient(145deg, #e8e8e8 0%, #d0d0d0 100%);
  border-radius: 36px;
  padding: 40px 24px 24px 24px;
  box-shadow: 
    0 0 0 2px #a8a8a8,
    0 20px 60px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.device-frame__ipad-notch {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  z-index: 10;
}

.device-frame__ipad-screen {
  flex: 1;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: auto;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.device-frame__ipad-button {
  display: none; /* Hide home button for modern iPads */
}

/* iPad 横屏调整 */
.device-frame--pad.device-frame--landscape .device-frame__ipad {
  flex-direction: row;
  padding: 24px 40px 24px 24px;
  min-height: 400px;
}

.device-frame--pad.device-frame--landscape .device-frame__ipad-notch {
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 6px;
  height: 80px;
}

.device-frame--pad.device-frame--landscape .device-frame__ipad-screen {
  flex: 1;
  height: 100%;
}

/* ===== iPhone 外框 ===== */
.device-frame__iphone {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 600px;
  background: linear-gradient(145deg, #2c2c2c 0%, #1a1a1a 100%);
  border-radius: 44px;
  padding: 48px 12px 32px 12px;
  box-shadow: 
    0 0 0 3px #1a1a1a,
    0 0 0 5px #333,
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.device-frame__iphone-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 28px;
  background: #1a1a1a;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}

.device-frame__iphone-speaker {
  width: 50px;
  height: 4px;
  background: #333;
  border-radius: 2px;
}

.device-frame__iphone-camera {
  width: 10px;
  height: 10px;
  background: #222;
  border-radius: 50%;
  border: 2px solid #333;
}

.device-frame__iphone-screen {
  flex: 1;
  width: 100%;
  background: #fff;
  border-radius: 24px;
  overflow: auto;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.device-frame__iphone-home {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: #fff;
  border-radius: 2px;
  opacity: 0.8;
}

/* iPhone 横屏调整 */
.device-frame--mobile.device-frame--landscape .device-frame__iphone {
  flex-direction: row;
  padding: 12px 32px 12px 48px;
  min-height: 320px;
}

.device-frame--mobile.device-frame--landscape .device-frame__iphone-notch {
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 28px;
  height: 120px;
  border-radius: 16px;
  flex-direction: column;
}

.device-frame--mobile.device-frame--landscape .device-frame__iphone-speaker {
  width: 4px;
  height: 50px;
}

.device-frame--mobile.device-frame--landscape .device-frame__iphone-screen {
  flex: 1;
  height: 100%;
}

.device-frame--mobile.device-frame--landscape .device-frame__iphone-home {
  bottom: 50%;
  right: 8px;
  left: auto;
  transform: translateY(50%);
  width: 4px;
  height: 100px;
}

/* ===== 深色模式 ===== */
[data-theme="dark"] .device-frame__ipad {
  background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%);
  box-shadow: 
    0 0 0 2px #555,
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .device-frame__ipad-screen,
[data-theme="dark"] .device-frame__iphone-screen {
  background: #1e1e1e;
}

/* ===== 内部编辑器适配 ===== */
.device-frame__pc :deep(.demo-card),
.device-frame__ipad-screen :deep(.demo-card),
.device-frame__iphone-screen :deep(.demo-card) {
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.device-frame__pc :deep(.tiptap-pro-editor),
.device-frame__ipad-screen :deep(.tiptap-pro-editor),
.device-frame__iphone-screen :deep(.tiptap-pro-editor) {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 工具栏固定在顶部 */
.device-frame__pc :deep(.word-toolbar),
.device-frame__ipad-screen :deep(.word-toolbar),
.device-frame__iphone-screen :deep(.word-toolbar) {
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}

/* 文档内容区域可滚动 */
.device-frame__pc :deep(.word-document-container),
.device-frame__ipad-screen :deep(.word-document-container),
.device-frame__iphone-screen :deep(.word-document-container) {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}
</style>
