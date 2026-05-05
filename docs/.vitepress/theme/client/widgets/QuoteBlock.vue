<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)

function open() {
  showModal.value = true
  document.addEventListener('keydown', onKeydown)
}

function close() {
  showModal.value = false
  document.removeEventListener('keydown', onKeydown)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <div class="quote-block" @click="open">
    <div class="quote-preview">
      <slot />
    </div>
    <p class="quote-link">[点击查看完整原文]</p>
  </div>
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h3>原文</h3>
          <button class="modal-close" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.quote-block {
  background-color: #f5f5f5;
  border-left: 4px solid #d3bc8e;
  padding: 15px 20px;
  margin: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0 4px 4px 0;
}

.quote-block:hover {
  background-color: #efefef;
  border-left-color: #4d4f53;
}

.quote-preview {
  font-family: 'Common', sans-serif;
  font-size: 14px;
  color: #5a5c5f;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.quote-link {
  font-family: 'Common', sans-serif;
  font-size: 12px;
  color: #ceae6d;
  text-align: right;
  margin-top: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80%;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background-color: #4d4f53;
  color: #d3bc8e;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d3bc8e;
}

.modal-header h3 {
  margin: 0;
  font-family: 'Genshin', serif;
  font-size: 18px;
  color: #d3bc8e;
}

.modal-close {
  background: none;
  border: none;
  color: #d3bc8e;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: rgba(211, 188, 142, 0.2);
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Common', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #4d4f53;
}
</style>
