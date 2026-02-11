<template>
  <div class="device-switcher">
    <!-- 设备选择按钮 -->
    <button
      v-for="device in devices"
      :key="device.value"
      class="device-switcher__btn"
      :class="{ 'device-switcher__btn--active': currentDevice === device.value }"
      :title="device.label"
      @click="handleDeviceChange(device.value)"
    >
      <component :is="device.icon" class="device-switcher__icon" />
    </button>
    
    <!-- 横竖屏切换按钮 (仅 Pad/Mobile 显示) -->
    <template v-if="currentDevice !== 'pc'">
      <div class="device-switcher__divider"></div>
      <button
        class="device-switcher__btn device-switcher__btn--orientation"
        :class="{ 'device-switcher__btn--landscape': currentOrientation === 'landscape' }"
        :title="currentOrientation === 'portrait' ? '切换横屏' : '切换竖屏'"
        @click="handleOrientationToggle"
      >
        <component :is="OrientationIcon" class="device-switcher__icon" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * DeviceSwitcher - 设备视图切换组件
 * @description 在 PC、Pad、Mobile 三种设备视图之间切换，支持横竖屏
 */
import { computed, h, onMounted, ref, type FunctionalComponent } from 'vue'

export type DeviceView = 'pc' | 'pad' | 'mobile'
export type Orientation = 'portrait' | 'landscape'

/**
 * 检测当前是否为手机浏览器
 */
function detectMobileBrowser(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  // 匹配常见手机 UA 标识
  return /Android.*Mobile|iPhone|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/i.test(ua)
}

interface Props {
  /** 当前设备视图 */
  modelValue?: DeviceView
  /** 当前屏幕方向 */
  orientation?: Orientation
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'pc',
  orientation: 'portrait',
})

/** 是否为手机浏览器 */
const isMobileBrowser = ref(detectMobileBrowser())

const emit = defineEmits<{
  (e: 'update:modelValue', value: DeviceView): void
  (e: 'update:orientation', value: Orientation): void
  (e: 'change', value: DeviceView): void
  (e: 'orientationChange', value: Orientation): void
}>()

const currentDevice = computed(() => props.modelValue)
const currentOrientation = computed(() => props.orientation)

// 设备图标组件
const DesktopIcon: FunctionalComponent = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}, [
  h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2' }),
  h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
  h('line', { x1: '12', y1: '17', x2: '12', y2: '21' }),
])

const TabletIcon: FunctionalComponent = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}, [
  h('rect', { x: '4', y: '2', width: '16', height: '20', rx: '2' }),
  h('line', { x1: '12', y1: '18', x2: '12', y2: '18' }),
])

const MobileIcon: FunctionalComponent = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}, [
  h('rect', { x: '6', y: '2', width: '12', height: '20', rx: '2' }),
  h('line', { x1: '12', y1: '18', x2: '12', y2: '18' }),
])

// 横竖屏切换图标
const OrientationIcon: FunctionalComponent = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}, [
  h('path', { d: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5c.83 0 1.5-.67 1.5-1.5V4.5' }),
  h('path', { d: 'M16.5 3L21 7.5m0 0L16.5 12M21 7.5H7.5c-.83 0-1.5.67-1.5 1.5v10.5' }),
])

const allDevices = [
  { value: 'pc' as DeviceView, label: 'Desktop', icon: DesktopIcon },
  { value: 'pad' as DeviceView, label: 'Tablet (iPad)', icon: TabletIcon },
  { value: 'mobile' as DeviceView, label: 'Mobile (iPhone)', icon: MobileIcon },
]

// 手机浏览器下只保留 Mobile 选项
const devices = computed(() => {
  if (isMobileBrowser.value) {
    return allDevices.filter(d => d.value === 'mobile')
  }
  return allDevices
})

const handleDeviceChange = (device: DeviceView) => {
  emit('update:modelValue', device)
  emit('change', device)
}

// 手机浏览器下自动切换到 mobile 视图
onMounted(() => {
  if (isMobileBrowser.value && props.modelValue !== 'mobile') {
    emit('update:modelValue', 'mobile')
    emit('change', 'mobile')
  }
})

const handleOrientationToggle = () => {
  const newOrientation = currentOrientation.value === 'portrait' ? 'landscape' : 'portrait'
  emit('update:orientation', newOrientation)
  emit('orientationChange', newOrientation)
}
</script>

<style scoped>
.device-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
}

.device-switcher__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.device-switcher__btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.device-switcher__btn--active {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.device-switcher__icon {
  width: 20px;
  height: 20px;
}

.device-switcher__divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 4px;
}

.device-switcher__btn--orientation {
  transition: transform 0.3s ease, background 0.2s ease, color 0.2s ease;
}

.device-switcher__btn--landscape .device-switcher__icon {
  transform: rotate(90deg);
}
</style>
