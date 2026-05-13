<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'

const containerRef = ref<HTMLElement | null>(null)

function isHeadingElement(el: Element): boolean {
  return ['H2', 'H3', 'H4', 'H5'].includes(el.tagName)
}

function isLevel4Numbered(text: string): boolean {
  return /^\d+\./.test(text)
}

function wrapTimelineItems() {
  const timeline = containerRef.value
  if (!timeline) return

  const h4Elements = timeline.querySelectorAll('h4')

  h4Elements.forEach((h4) => {
    const text = h4.textContent?.trim() ?? ''

    if (isLevel4Numbered(text)) {
      h4.classList.add('timeline-main-title')
      return
    }

    wrapAsTimelineItem(h4)
  })

  const h5Elements = timeline.querySelectorAll('h5')
  h5Elements.forEach((h5) => {
    wrapAsTimelineItem(h5)
  })

  wrapOrphanContent(timeline)

  assignClasses(timeline)
  wrapSections(timeline)
}

function wrapOrphanContent(timeline: Element) {
  const children = Array.from(timeline.children)
  let orphanGroup: Element[] = []

  for (const child of children) {
    if (isHeadingElement(child) || child.classList.contains('timeline-item')) {
      flushOrphanGroup(orphanGroup)
      orphanGroup = []
    } else {
      orphanGroup.push(child)
    }
  }
  flushOrphanGroup(orphanGroup)
}

function wrapAsTimelineItem(heading: Element) {
  const group: Node[] = [heading]
  let next = heading.nextSibling

  while (next && !isHeadingElement(next as Element)) {
    group.push(next)
    next = next.nextSibling
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'timeline-item'
  heading.parentNode?.insertBefore(wrapper, heading)
  group.forEach((el) => wrapper.appendChild(el))
}

function flushOrphanGroup(group: Element[]) {
  if (group.length === 0) return
  const wrapper = document.createElement('div')
  wrapper.className = 'timeline-item'
  const first = group[0]
  first.parentNode?.insertBefore(wrapper, first)
  group.forEach((el) => wrapper.appendChild(el))
}

function assignClasses(timeline: Element) {
  timeline.querySelectorAll('h3').forEach((el) => {
    el.classList.add('timeline-main-title')
  })

  timeline.querySelectorAll('.timeline-item h4, .timeline-item h5').forEach((el) => {
    el.classList.add('timeline-subtitle')
  })

  timeline.querySelectorAll('.timeline-item p').forEach((el) => {
    el.classList.add('timeline-content')
  })
}

function wrapSections(timeline: Element) {
  const children = Array.from(timeline.children)
  let sectionGroup: Element[] = []

  for (const child of children) {
    if (child.tagName === 'H2') {
      flushSection(timeline, sectionGroup)
      sectionGroup = [child]
    } else {
      sectionGroup.push(child)
    }
  }
  flushSection(timeline, sectionGroup)
}

function flushSection(timeline: Element, group: Element[]) {
  if (group.length === 0) return
  const section = document.createElement('div')
  section.className = 'timeline-section'
  const first = group[0]
  first.parentNode?.insertBefore(section, first)
  group.forEach((el) => {
    if (el.tagName === 'H2') {
      el.classList.add('timeline-period')
    }
    section.appendChild(el)
  })
}

onMounted(async () => {
  await nextTick()
  wrapTimelineItems()
})
</script>

<template>
  <div ref="containerRef" class="timeline">
    <slot />
  </div>
</template>
