<script setup lang="ts">
import { WIDGET_DEFINITIONS, type WidgetName } from '../widgetSchemas'

const selectedWidget = defineModel<WidgetName>('selectedWidget', { required: true })

const emit = defineEmits<{
  insert: [name: WidgetName]
}>()
</script>

<template>
  <aside class="left-panel">
    <h1>GenshinLore Editor(test)</h1>

    <div class="section-title">组件插入</div>
    <select v-model="selectedWidget" class="widget-select">
      <option v-for="item in WIDGET_DEFINITIONS" :key="item.name" :value="item.name">
        {{ item.label }}
      </option>
    </select>
    <button class="ui-btn ui-btn-primary" @click="emit('insert', selectedWidget)">插入组件块</button>

    <div class="widget-list">
      <button
        v-for="item in WIDGET_DEFINITIONS"
        :key="item.name"
        class="ui-btn widget-chip"
        @click="emit('insert', item.name)"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="widget-note">
      <p>提示：输入 <code>/</code> 也可快速插入组件与结构块。</p>
    </div>
  </aside>
</template>
