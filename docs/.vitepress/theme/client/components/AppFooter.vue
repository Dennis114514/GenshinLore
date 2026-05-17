<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface RecordConfig {
  number?: string
}

const { theme } = useData()
const compliance = computed(() => (theme.value?.compliance ?? {}) as {
  icp?: RecordConfig
  mps?: RecordConfig
})

const icp = computed(() => compliance.value.icp ?? {})
const mps = computed(() => compliance.value.mps ?? {})

const showIcp = computed(() => Boolean(icp.value.number))
const showMps = computed(() => Boolean(mps.value.number))

const MPS_LINK_BASE = 'https://beian.mps.gov.cn/#/query/webSearch?code='
const mpsCode = computed(() => {
  const raw = mps.value.number ?? ''
  const matched = raw.match(/\d+/g)
  return matched ? matched.join('') : ''
})
const mpsLink = computed(() => (mpsCode.value ? `${MPS_LINK_BASE}${mpsCode.value}` : MPS_LINK_BASE))
</script>

<template>
  <footer class="app-footer text-center p-10 text-[#9d9f93] text-sm">
    <p class="m-[5px_0] text-center">愿风指引你们的道路</p>
    <p class="m-[5px_0] text-center">
      <a class="hover:underline" href="https://github.com/Dennis114514/GenshinLore" target="_blank"
        >GenshinLore</a
      >
      2026
    </p>
    <p v-if="showIcp || showMps" class="record-row m-[5px_0] text-center">
      <a
        v-if="showIcp"
        class="record-link hover:underline"
        href="https://beian.miit.gov.cn"
        target="_blank"
        rel="noreferrer"
      >
        {{ icp.number }}
      </a>
      <a
        v-if="showMps"
        class="record-link record-link-mps hover:underline"
        :href="mpsLink"
        target="_blank"
        rel="noreferrer"
      >
        <img src="/img/others/mps.png" alt="" class="record-icon" />
        <span>{{ mps.number }}</span>
      </a>
    </p>
     <p class="m-[5px_0] text-center">
      <a class="hover:underline" href="/editor/" target="_blank"
        >编辑器(test)</a
      >
    </p>
  </footer>
</template>

<style scoped>
.app-footer {
  font-family: 'Genshin', sans-serif !important;
}

.record-row {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.record-link {
  color: #9d9f93;
  text-decoration: none;
}

.record-link-mps {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.record-icon {
  width: 15px;
  height: 15px;
  object-fit: contain;
}
</style>
