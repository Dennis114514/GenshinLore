<script setup lang="ts">
import { useRouter } from 'vitepress'

const props = defineProps<{
  dest: string
}>()
const router = useRouter()

const goDest = () => {
  if (props.dest != '') {
    router.go(props.dest)
  }
}
</script>

<template>
  <div class="card-item" @click="goDest">
    <div class="card-icon">
      <slot name="icon" />
    </div>
    <div class="flex flex-col">
      <h3 class="card-title"><slot name="title" /></h3>
      <span><slot name="subtitle" /></span>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  display: flex;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 8px;
  gap: 20px;
  padding: 25px;
  background: linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(248, 248, 248) 100%);
  border-radius: 12px;
  text-decoration: none;
  transition: 0.3s;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(232, 232, 232);
  border-image: initial;
  cursor: pointer;
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: rgba(211, 188, 142, 0.2) 0 8px 25px;
  border-color: rgb(211, 188, 142);
}

.card-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
}

.card-title {
  font-family: Genshin, sans-serif;
  font-size: 20px;
  color: rgb(77, 79, 83);
  margin: 0 !important;
}
</style>
