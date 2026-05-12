<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

declare const __MIRROR_COMMIT__: string

const STORAGE_KEY = 'mirror_notice_closed_v1'
const OFFICIAL_URL = 'https://genshinlore.cn/'
const commitShort = typeof __MIRROR_COMMIT__ !== 'undefined' ? __MIRROR_COMMIT__ : 'unknown'

const visible = ref(true)
const shouldScroll = ref(false)
const marqueeStyle = ref<Record<string, string>>({})

const trackWrapRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

function applyNoticeHeight() {
  document.documentElement.style.setProperty('--mirror-notice-height', visible.value ? '32px' : '0px')
}

function updateMarquee() {
  if (!visible.value || !trackWrapRef.value || !textRef.value) return

  const containerWidth = trackWrapRef.value.clientWidth
  const textWidth = textRef.value.scrollWidth
  const gap = 48

  if (textWidth <= containerWidth) {
    shouldScroll.value = false
    marqueeStyle.value = {}
    return
  }

  shouldScroll.value = true
  const distance = textWidth + gap
  const duration = Math.max(8, distance / 70)
  marqueeStyle.value = {
    '--mirror-scroll-distance': `${distance}px`,
    '--mirror-scroll-duration': `${duration}s`,
    '--mirror-scroll-gap': `${gap}px`,
  }
}

function closeNotice() {
  visible.value = false
  localStorage.setItem(STORAGE_KEY, '1')
  applyNoticeHeight()
}

function onResize() {
  updateMarquee()
}

onMounted(() => {
  visible.value = localStorage.getItem(STORAGE_KEY) !== '1'
  applyNoticeHeight()
  nextTick(() => {
    updateMarquee()
  })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  document.documentElement.style.setProperty('--mirror-notice-height', '0px')
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div v-if="visible" class="mirror-notice">
    <div ref="trackWrapRef" class="mirror-notice-track-wrap">
      <div class="mirror-notice-track" :class="{ scrolling: shouldScroll }" :style="marqueeStyle">
        <span ref="textRef" class="mirror-notice-line">
          您当前访问的是《日月全事》镜像站，内容请以官方站为准：
          <a :href="OFFICIAL_URL" target="_blank" rel="noopener noreferrer">{{ OFFICIAL_URL }}</a>
          ｜ 当前镜像版本：{{ commitShort }}
        </span>
        <span v-if="shouldScroll" class="mirror-notice-line clone" aria-hidden="true">
          您当前访问的是《日月全事》镜像站，内容请以官方站为准：
          <a :href="OFFICIAL_URL" target="_blank" rel="noopener noreferrer">{{ OFFICIAL_URL }}</a>
          ｜ 当前镜像版本：{{ commitShort }}
        </span>
      </div>
    </div>
    <button class="mirror-notice-close" @click="closeNotice" aria-label="关闭镜像站提示">×</button>
  </div>
</template>

<style scoped>
.mirror-notice {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: #2f3338;
  color: #f0e6d2;
  z-index: 13000;
  border-bottom: 1px solid rgba(211, 188, 142, 0.38);
  box-sizing: border-box;
}

.mirror-notice-track-wrap {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.mirror-notice-track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.mirror-notice-track.scrolling {
  gap: var(--mirror-scroll-gap, 48px);
  animation: mirror-scroll var(--mirror-scroll-duration, 16s) linear infinite;
}

.mirror-notice-line {
  font-family: 'Common', sans-serif;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.mirror-notice-line a {
  color: #e3c784;
  text-decoration: underline;
}

.mirror-notice-close {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(211, 188, 142, 0.55);
  border-radius: 50%;
  background: rgba(211, 188, 142, 0.12);
  color: #f0e6d2;
  line-height: 1;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

@keyframes mirror-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-1 * var(--mirror-scroll-distance, 300px)));
  }
}

@media (max-width: 1012px) {
  .mirror-notice {
    height: 32px;
    padding: 0 10px;
  }

  .mirror-notice-line {
    font-size: 11px;
  }
}
</style>
