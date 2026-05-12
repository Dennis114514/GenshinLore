<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  n: string
  text: string
}>()

const triggerRef = ref<HTMLElement | null>(null)
const desktopTooltipRef = ref<HTMLElement | null>(null)
const mobileTooltipRef = ref<HTMLElement | null>(null)
const mobileOpen = ref(false)
const desktopPlacement = ref<'right' | 'left' | 'center'>('right')
const desktopTooltipStyle = ref<Record<string, string>>({})
const mobileTooltipStyle = ref<Record<string, string>>({})
const mobilePlacement = ref<'top' | 'bottom'>('bottom')

const isMobileViewport = () => window.innerWidth <= 768

const mobileTooltipClass = computed(() => ({
  'is-visible': mobileOpen.value,
  'is-above': mobilePlacement.value === 'top',
}))

const desktopTooltipClass = computed(() => ({
  'is-left': desktopPlacement.value === 'left',
  'is-center': desktopPlacement.value === 'center',
}))

function updateDesktopTooltipPosition() {
  if (!triggerRef.value || !desktopTooltipRef.value || isMobileViewport()) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const edgePadding = 12
  const gap = 5

  const desktopMaxWidth = Math.max(220, Math.min(350, viewportWidth - edgePadding * 2))
  desktopTooltipStyle.value = {
    '--desktop-tooltip-width': `${desktopMaxWidth}px`,
  }

  const rightSpace = viewportWidth - triggerRect.right - gap - edgePadding
  const leftSpace = triggerRect.left - gap - edgePadding
  const desiredWidth = desktopMaxWidth

  if (rightSpace >= desiredWidth || rightSpace >= leftSpace) {
    desktopPlacement.value = 'right'
    return
  }

  if (leftSpace >= desiredWidth) {
    desktopPlacement.value = 'left'
    return
  }

  desktopPlacement.value = 'center'
}

function updateMobileTooltipPosition() {
  if (!triggerRef.value || !mobileTooltipRef.value || !isMobileViewport()) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = mobileTooltipRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const gap = 8
  const edgePadding = 12

  let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
  left = Math.max(edgePadding, Math.min(left, viewportWidth - tooltipRect.width - edgePadding))
  const triggerCenter = triggerRect.left + triggerRect.width / 2
  const arrowPadding = 14
  const arrowLeft = Math.max(
    arrowPadding,
    Math.min(triggerCenter - left, tooltipRect.width - arrowPadding),
  )

  let top = triggerRect.bottom + gap
  mobilePlacement.value = 'bottom'

  if (
    top + tooltipRect.height > viewportHeight - edgePadding
    && triggerRect.top - gap - tooltipRect.height >= edgePadding
  ) {
    top = triggerRect.top - gap - tooltipRect.height
    mobilePlacement.value = 'top'
  }
  else if (top + tooltipRect.height > viewportHeight - edgePadding) {
    top = Math.max(edgePadding, viewportHeight - tooltipRect.height - edgePadding)
  }

  mobileTooltipStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    '--footnote-arrow-left': `${arrowLeft}px`,
  }
}

async function openMobileTooltip() {
  mobileOpen.value = true
  await nextTick()
  updateMobileTooltipPosition()
}

function closeMobileTooltip() {
  mobileOpen.value = false
}

function handleTriggerClick(event: MouseEvent) {
  if (!isMobileViewport()) return

  event.preventDefault()
  event.stopPropagation()

  if (mobileOpen.value) {
    closeMobileTooltip()
    return
  }

  openMobileTooltip()
}

function handleDocumentClick(event: MouseEvent) {
  if (!mobileOpen.value) return
  if (triggerRef.value?.contains(event.target as Node)) return
  if (mobileTooltipRef.value?.contains(event.target as Node)) return
  closeMobileTooltip()
}

function handleViewportChange() {
  if (!isMobileViewport()) {
    updateDesktopTooltipPosition()
  }

  if (!mobileOpen.value) return

  if (!isMobileViewport()) {
    closeMobileTooltip()
    return
  }

  updateMobileTooltipPosition()
}

function handleTriggerEnter() {
  if (!isMobileViewport()) {
    updateDesktopTooltipPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('scroll', handleViewportChange, true)
  nextTick(() => {
    updateDesktopTooltipPosition()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('resize', handleViewportChange)
  window.removeEventListener('scroll', handleViewportChange, true)
})
</script>

<template>
  <span ref="triggerRef" class="footnote" @click="handleTriggerClick" @mouseenter="handleTriggerEnter">
    <sup>{{ props.n }}</sup>
    <span
      ref="desktopTooltipRef"
      class="footnote-tooltip desktop-tooltip"
      :class="desktopTooltipClass"
      :style="desktopTooltipStyle"
      v-html="props.text"
    ></span>
  </span>
  <Teleport to="body">
    <span
      v-if="mobileOpen"
      ref="mobileTooltipRef"
      class="footnote-tooltip mobile-tooltip"
      :class="mobileTooltipClass"
      :style="mobileTooltipStyle"
      v-html="props.text"
    ></span>
  </Teleport>
</template>

<style scoped>
.footnote {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  cursor: help;
}

.footnote sup {
  color: #D3BC8E;
  margin-left: 2px;
}

.footnote-tooltip {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 5px;
  background-color: #4d4f53;
  color: #D3BC8E;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 14px;
  white-space: normal;
  width: var(--desktop-tooltip-width, 350px);
  max-width: var(--desktop-tooltip-width, 350px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 4000;
  pointer-events: none;
  text-align: left;
  line-height: 1.5;
  font-family: 'Common', sans-serif;
}

.footnote:hover .footnote-tooltip {
  opacity: 1;
  visibility: visible;
}

.desktop-tooltip.is-left {
  left: auto;
  right: 100%;
  margin-left: 0;
  margin-right: 5px;
}

.desktop-tooltip.is-center {
  left: 50%;
  right: auto;
  top: calc(100% + 8px);
  margin-left: 0;
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  .footnote {
    cursor: pointer;
  }

  .desktop-tooltip {
    display: none;
  }

  .mobile-tooltip {
    position: fixed;
    margin: 0;
    width: max-content;
    max-width: calc(100vw - 24px);
    opacity: 0;
    visibility: hidden;
    transition: none;
    pointer-events: auto;
    z-index: 5000;
  }

  .mobile-tooltip.is-visible {
    opacity: 1;
    visibility: visible;
  }

  .mobile-tooltip.is-visible::after {
    content: '';
    position: absolute;
    left: var(--footnote-arrow-left, 50%);
    margin-left: -6px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }

  .mobile-tooltip.is-visible:not(.is-above)::after {
    top: auto;
    bottom: 100%;
    border-top: none;
    border-bottom: 6px solid #4d4f53;
  }

  .mobile-tooltip.is-above::after {
    top: 100%;
    bottom: auto;
    border-top: 6px solid #4d4f53;
    border-bottom: none;
  }
}
</style>
