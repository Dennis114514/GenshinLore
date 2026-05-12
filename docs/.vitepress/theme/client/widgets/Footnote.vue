<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  n: string
  text: string
}>()

const parsedText = computed(() =>
  props.text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  ),
)

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const active = ref(false)
const locked = ref(false)
const placement = ref<'right' | 'left' | 'center'>('right')
const arrowSide = ref<'top' | 'bottom'>('bottom')
const tooltipStyle = ref<Record<string, string>>({})

const isMobile = () => window.innerWidth <= 768
let hoverTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function updatePosition() {
  if (!triggerRef.value || !tooltipRef.value) return

  const trigger = triggerRef.value.getBoundingClientRect()
  const tooltip = tooltipRef.value.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (isMobile()) {
    const pad = 12
    let left = trigger.left + trigger.width / 2 - tooltip.width / 2
    left = Math.max(pad, Math.min(left, vw - tooltip.width - pad))
    let top = trigger.bottom + 8
    arrowSide.value = 'bottom'
    if (top + tooltip.height > vh - pad && trigger.top - 8 - tooltip.height >= pad) {
      top = trigger.top - 8 - tooltip.height
      arrowSide.value = 'top'
    } else if (top + tooltip.height > vh - pad) {
      top = Math.max(pad, vh - tooltip.height - pad)
    }

    const arrowLeft = Math.max(14, Math.min(trigger.left + trigger.width / 2 - left, tooltip.width - 14))
    tooltipStyle.value = {
      left: `${left}px`,
      top: `${top}px`,
      '--arrow-left': `${arrowLeft}px`,
      '--desktop-tooltip-width': `${Math.min(350, vw - 24)}px`,
    }
  } else {
    const pad = 12
    const gap = 5
    const maxW = Math.max(220, Math.min(350, vw - pad * 2))
    const rightSpace = vw - trigger.right - gap - pad
    const leftSpace = trigger.left - gap - pad

    let left: number
    if (rightSpace >= maxW || rightSpace >= leftSpace) {
      placement.value = 'right'
      left = trigger.right + gap
    } else if (leftSpace >= maxW) {
      placement.value = 'left'
      left = trigger.left - gap - maxW
    } else {
      placement.value = 'center'
      left = Math.max(pad, (vw - maxW) / 2)
    }

    tooltipStyle.value = {
      '--desktop-tooltip-width': `${maxW}px`,
      left: `${left}px`,
      top: `${trigger.top}px`,
    }
  }
}

async function show() {
  if (isMobile()) return
  clearTimeout(hideTimer!)
  hoverTimer = setTimeout(async () => {
    active.value = true
    await nextTick()
    updatePosition()
  }, 250)
}

function hide() {
  if (isMobile() || locked.value) return
  clearTimeout(hoverTimer!)
  hideTimer = setTimeout(() => {
    active.value = false
  }, 200)
}

function handleClick(event: MouseEvent) {
  if (isMobile()) {
    event.preventDefault()
    event.stopPropagation()
    locked.value = !locked.value
    active.value = locked.value
    if (locked.value) {
      nextTick().then(updatePosition)
    }
    return
  }

  clearTimeout(hoverTimer!)
  locked.value = !locked.value
  active.value = locked.value || active.value
  if (locked.value) {
    nextTick().then(updatePosition)
  } else {
    active.value = false
  }
}

function handleOutsideClick(event: MouseEvent) {
  if (!locked.value) return
  if (triggerRef.value?.contains(event.target as Node)) return
  if (tooltipRef.value?.contains(event.target as Node)) return
  locked.value = false
  active.value = false
}

function handleResize() {
  if (active.value) updatePosition()
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize, true)
  clearTimeout(hoverTimer!)
  clearTimeout(hideTimer!)
})
</script>

<template>
  <span
    ref="triggerRef"
    class="footnote"
    @click="handleClick"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <sup>{{ props.n }}</sup>
  </span>
  <Teleport to="body">
    <span
      v-if="active"
      ref="tooltipRef"
      class="footnote-tooltip"
      :class="{
        'is-left': placement === 'left',
        'is-center': placement === 'center',
        'is-mobile': isMobile(),
        'is-above': arrowSide === 'top',
      }"
      :style="tooltipStyle"
      v-html="parsedText"
    ></span>
  </Teleport>
</template>

<style scoped>
.footnote {
  display: inline-flex;
  align-items: flex-start;
  cursor: pointer;
}

.footnote sup {
  color: #d3bc8e;
  margin-left: 2px;
}

.footnote-tooltip {
  position: fixed;
  background-color: #4d4f53;
  color: #d3bc8e;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 14px;
  white-space: normal;
  width: var(--desktop-tooltip-width, 350px);
  max-width: var(--desktop-tooltip-width, 350px);
  z-index: 500;
  text-align: left;
  line-height: 1.5;
  font-family: 'Common', sans-serif;
  pointer-events: auto;
}

.footnote-tooltip :deep(a) {
  color: #d3bc8e;
}

@media (max-width: 768px) {
  .footnote-tooltip {
    width: max-content;
    max-width: calc(100vw - 24px);
  }

  .footnote-tooltip::after {
    content: '';
    position: absolute;
    left: var(--arrow-left, 50%);
    margin-left: -6px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }

  .footnote-tooltip.is-above::after {
    bottom: -6px;
    border-top: 6px solid #4d4f53;
  }

  .footnote-tooltip:not(.is-above)::after {
    top: -6px;
    border-bottom: 6px solid #4d4f53;
  }
}
</style>
