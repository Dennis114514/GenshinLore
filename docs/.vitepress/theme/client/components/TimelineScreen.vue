<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import AppFooter from './AppFooter.vue'
import { nationColumns, timelinePeriods } from '../../data/timelineData'
import type { TimelineCell } from '../../data/timelineData'

const blurred = ref(false)
const tableScrollRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showBackToTop = ref(false)

function onVisibilityChange() {
  blurred.value = document.hidden
}

function onWindowBlur() {
  blurred.value = true
}

function onWindowFocus() {
  blurred.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault()
    return
  }
  if (
    e.ctrlKey &&
    e.shiftKey &&
    (e.key === 'I' ||
      e.key === 'i' ||
      e.key === 'J' ||
      e.key === 'j' ||
      e.key === 'C' ||
      e.key === 'c')
  ) {
    e.preventDefault()
    return
  }
  if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault()
    return
  }
}

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
}

function updateScrollIndicators() {
  const el = tableScrollRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 8
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 8
  showBackToTop.value = el.scrollTop > 320
}

function onTableScroll() {
  updateScrollIndicators()
}

function onResize() {
  updateScrollIndicators()
}

function scrollTimelineToTop() {
  const el = tableScrollRef.value
  if (!el) return
  el.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('blur', onWindowBlur)
  window.addEventListener('focus', onWindowFocus)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('resize', onResize)
  nextTick(() => {
    updateScrollIndicators()
  })
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('blur', onWindowBlur)
  window.removeEventListener('focus', onWindowFocus)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('contextmenu', onContextMenu)
  window.removeEventListener('resize', onResize)
})

// 计算一个国家内哪些单元格应该合并（连续相同的单元格）
function cellsEqual(a: TimelineCell, b: TimelineCell): boolean {
  if (a.isEmpty && b.isEmpty) return true
  if (a.heading !== b.heading) return false
  if (a.items.length !== b.items.length) return false
  return a.items.every((item, i) => item === b.items[i])
}

interface MergedCell {
  colspan: number
  cell: TimelineCell
}

// 预计算每行需要合并的空内容格数
const rowsWithMergedCells = computed(() => {
  return timelinePeriods.map((period) => ({
    name: period.name,
    rows: period.rows.map((row) => {
      const merged: MergedCell[] = []
      let ci = 0
      for (const nc of nationColumns) {
        // 在该国家内对连续相同的单元格进行分组
        const groupStart = ci
        const groupEnd = ci + nc.colSpan
        let j = groupStart
        while (j < groupEnd) {
          let k = j + 1
          while (k < groupEnd && cellsEqual(row.cells[j], row.cells[k])) {
            k++
          }
          merged.push({ colspan: k - j, cell: row.cells[j] })
          j = k
        }
        ci = groupEnd
      }
      return { subPeriod: row.subPeriod, cells: merged }
    }),
  }))
})

//const totalCols = nationColumns.reduce((sum, c) => sum + c.colSpan, 0)
</script>

<template>
  <!-- 按照原设计意图，本页面全页禁止选中 -->
  <div v-if="!blurred" class="timeline-page select-none">
    <div class="table-wrapper" :class="{ 'can-scroll-left': canScrollLeft, 'can-scroll-right': canScrollRight }">
      <div ref="tableScrollRef" class="table-scroll" @scroll="onTableScroll">
        <table class="timeline-table">
          <thead>
            <tr class="header-row">
              <th class="period-header period-col">时期</th>
              <th class="period-header subperiod-col">子时期</th>
              <th
                v-for="col in nationColumns"
                :key="col.nation"
                :colspan="col.colSpan"
                class="nation-header"
              >
                {{ col.nation }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="period in rowsWithMergedCells" :key="period.name">
              <tr v-for="(row, ri) in period.rows" :key="`${period.name}-${ri}`" class="data-row">
                <td v-if="ri === 0" :rowspan="period.rows.length" class="period-cell">
                  {{ period.name }}
                </td>
                <td class="subperiod-cell">
                  {{ row.subPeriod || '　' }}
                </td>
                <td
                  v-for="(mc, mi) in row.cells"
                  :key="mi"
                  :colspan="mc.colspan"
                  class="data-cell"
                  :class="{ 'cell-empty': mc.cell.isEmpty }"
                >
                  <template v-if="!mc.cell.isEmpty">
                    <div v-if="mc.cell.heading" class="cell-heading">
                      {{ mc.cell.heading }}
                    </div>
                    <ul v-if="mc.cell.items.length" class="cell-items">
                      <li v-for="(item, ii) in mc.cell.items" :key="ii">
                        {{ item }}
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <span class="cell-placeholder">&nbsp;</span>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <button v-if="showBackToTop" class="timeline-backtop" @click="scrollTimelineToTop">
        回到顶部
      </button>
    </div>
    <AppFooter />
  </div>
  <!-- 失焦遮罩 -->
  <div v-else class="blur-overlay">
    <p class="blur-text">页面已受保护</p>
    <p class="blur-text">请将焦点保持在当前窗口</p>
  </div>
</template>

<style scoped>
.timeline-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #26292e 0%, #1b1d21 52%, #17181b 100%);
  padding-top: calc(var(--mirror-notice-height, 0px) + var(--site-header-height-desktop, 70px));
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  border-top: 1px solid rgba(211, 188, 142, 0.22);
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.table-wrapper::before,
.table-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 22px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
  z-index: 12;
}

.table-wrapper.can-scroll-left::before {
  opacity: 1;
}

.table-wrapper.can-scroll-right::after {
  opacity: 1;
}

.table-scroll {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - var(--mirror-notice-height, 0px) - var(--site-header-height-desktop, 70px) - 80px);
  position: relative;
  scrollbar-gutter: stable both-edges;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.timeline-table {
  border-collapse: collapse;
  table-layout: auto;
  min-width: 100%;
  font-family: 'Common', sans-serif;
  font-size: 13px;
  line-height: 1.65;
  color: #e9dfcc;
}

.header-row th {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(180deg, #3f4348 0%, #35383d 100%);
  color: #d3bc8e;
  font-family: 'Genshin', sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  padding: 8px 6px;
  border: 1px solid #5a5a5a;
  white-space: nowrap;
}

.period-header {
  position: sticky;
  left: 0;
  z-index: 30;
}

.period-col {
  min-width: 48px;
  width: 48px;
}

.subperiod-col {
  min-width: 90px;
  width: 90px;
  left: 48px;
  z-index: 29;
}

.nation-header {
  min-width: 100px;
}

.data-row {
  background: #1e1e1e;
}

.data-row:nth-child(even) {
  background: #1a1a1a;
}

.period-cell {
  position: sticky;
  left: 0;
  z-index: 20;
  background: linear-gradient(180deg, #2f3237 0%, #2a2d31 100%);
  color: #d3bc8e;
  font-family: 'Genshin', sans-serif;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  vertical-align: middle;
  padding: 8px 4px;
  border: 1px solid #4a4a4a;
  writing-mode: vertical-rl;
  letter-spacing: 4px;
  min-width: 48px;
}

.subperiod-cell {
  position: sticky;
  left: 48px;
  z-index: 19;
  background: linear-gradient(180deg, #2f3237 0%, #2a2d31 100%);
  color: #d3bc8e;
  font-family: 'Genshin', sans-serif;
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  vertical-align: top;
  padding: 8px 6px;
  border: 1px solid #4a4a4a;
  white-space: nowrap;
  min-width: 90px;
}

.data-cell {
  padding: 8px 10px;
  border: 1px solid #3a3a3a;
  vertical-align: top;
  min-width: 100px;
  max-width: 260px;
  transition: background-color 0.15s ease;
}

.cell-empty {
  background: #151515;
}

.cell-heading {
  font-weight: 700;
  color: #d3bc8e;
  font-family: 'Genshin', sans-serif;
  font-size: 12px;
  margin-bottom: 4px;
}

.cell-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cell-items li {
  position: relative;
  padding-left: 12px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #d8d8d8;
}

.cell-items li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: #d3bc8e;
}

.cell-placeholder {
  color: transparent;
}

.data-row:hover .data-cell {
  background-color: rgba(211, 188, 142, 0.08);
}

.data-row:hover .cell-empty {
  background-color: rgba(211, 188, 142, 0.04);
}

.timeline-backtop {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 14;
  border: 1px solid rgba(211, 188, 142, 0.45);
  background: rgba(29, 31, 35, 0.88);
  color: #d3bc8e;
  font-family: 'Common', sans-serif;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timeline-backtop:hover {
  background: rgba(211, 188, 142, 0.2);
  border-color: rgba(211, 188, 142, 0.65);
  color: #e6d2a7;
}

.blur-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

.blur-text {
  font-family: 'Genshin', sans-serif;
  font-size: 20px;
  color: #d3bc8e;
  letter-spacing: 2px;
}

@media screen and (max-width: 768px) {
  .timeline-page {
    padding-top: calc(var(--mirror-notice-height, 0px) + var(--site-header-height-mobile, 60px));
  }

  .table-wrapper {
    border-top-color: rgba(211, 188, 142, 0.16);
  }

  .table-scroll {
    max-height: calc(100vh - var(--mirror-notice-height, 0px) - var(--site-header-height-mobile, 60px) - 72px);
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  .timeline-table {
    font-size: 12px;
    line-height: 1.6;
  }

  .header-row th {
    font-size: 12px;
    padding: 7px 6px;
  }

  .period-col {
    min-width: 58px;
    width: 58px;
  }

  .subperiod-col {
    min-width: 86px;
    width: 86px;
    left: auto;
  }

  .period-header {
    left: auto;
    z-index: 10;
  }

  .subperiod-cell {
    position: static;
    left: auto;
    z-index: auto;
    min-width: 86px;
    font-size: 11px;
    padding: 6px 6px;
  }

  .period-cell {
    position: static;
    left: auto;
    z-index: auto;
    min-width: 58px;
    writing-mode: horizontal-tb;
    letter-spacing: 1px;
    font-size: 11px;
    padding: 6px 6px;
    white-space: nowrap;
  }

  .data-cell {
    min-width: 140px;
    max-width: 220px;
    padding: 6px 8px;
  }

  .cell-heading {
    font-size: 12px;
    margin-bottom: 5px;
  }

  .cell-items li {
    font-size: 12px;
    line-height: 1.6;
    margin-bottom: 3px;
  }

  .table-wrapper::before,
  .table-wrapper::after,
  .timeline-backtop {
    display: none;
  }
}
</style>
