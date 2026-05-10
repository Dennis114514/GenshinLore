<script setup lang="ts">
import { ref } from 'vue'
import Spacer from '../widgets/Spacer.vue'
import { easterEggs } from '../../data/interestfactsData'

const showModal = ref(false)
const easterEggsData = easterEggs

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
  <div class="w-screen">
    <main class="mt-17.5">
      <Spacer :size="20" />
      <p class="genshin-font text-center text-[#4d4f53] text-4xl">
        关于原神你不知道的很多事实和彩蛋
      </p>
      <Spacer :size="20" />
      <p class="text-center text-[#8d8f93]">
        这里会存放一些制作组的小巧思，欢迎各位旅行者投稿。投稿即代表你同意《<span
          class="agreement-link"
          @click="open"
          >投稿协议</span
        >》
      </p>
      <Spacer :size="30" />
      <div class="max-w-300 m-[0_auto]">
        <div v-for="entry in easterEggsData" :key="entry.id" class="fact-item">
          <div class="flex items-start gap-2.5 mb-3.75">
            <span class="fact-id">#{{ entry.id }}</span>
            <div class="flex flex-1 gap-2.5 items-center">
              <span class="fact-title">{{ entry.title }}</span>
              <span v-if="entry.isItTrue" class="shrink-0 text-[20px] text-[#4CAF50]">✓</span>
            </div>
          </div>
          <div class="flex gap-2.5 mb-3 text-[#8d8f93] text-xs">
            <span>作者：{{ entry.name }}</span>
            <span>时间：{{ entry.time }}</span>
          </div>
          <div class="text-sm whitespace-pre-wrap text-[#4d4f53]">{{ entry.facts }}</div>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">投稿协议</h2>
            <button class="modal-close" @click="close">&times;</button>
          </div>
          <div class="modal-body">
            <h3>一、总则</h3>
            <p>欢迎向"日月全事"网站投稿原神制作组的小巧思和彩蛋。在投稿前，请仔细阅读本协议。</p>

            <h3>二、投稿内容要求</h3>
            <ul>
              <li>投稿内容必须与《原神》游戏相关，包括但不限于游戏彩蛋、隐藏机制、剧情细节等。</li>
              <li>严禁包含违法、色情、暴力、歧视或其他不当内容。</li>
              <li>不得侵犯他人的知识产权、隐私权等合法权益。</li>
              <li>
                不得含有恶意解读、歪曲官方剧情的内容，严禁P鬼图、侮辱角色等一切可能伤害到其他玩家的内容
              </li>
            </ul>

            <h3>三、知识产权</h3>
            <ul>
              <li>
                由于"发现彩蛋"这类事件的特殊性，我们无法寻找到第一个发现彩蛋的人是谁，如果你是在互联网上发现某条评论并投稿到本网站的，请务必注明来源；如果你发现投稿时间晚于你发布评论的时间，需要修改署名，请联系本站并且携带发布时评论的截图以及跳转到对应平台的链接，本站将会处理。
              </li>
              <li>投稿即视为授权网站对内容进行发布、展示和传播。</li>
              <li>网站将在适当位置标注投稿者署名（如提供）。</li>
            </ul>

            <h3>四、审核与发布</h3>
            <ul>
              <li>所有投稿将经过人工审核，审核通过后方会发布。</li>
              <li>网站有权拒绝不符合要求的投稿，且无需说明理由。</li>
            </ul>

            <h3>五、免责声明</h3>
            <ul>
              <li>投稿内容仅代表作者个人观点，不代表网站立场。</li>
              <li>如因投稿内容引发任何纠纷，由投稿者自行承担法律责任。</li>
              <li>网站保留对已发布内容进行修改或删除的权利。</li>
            </ul>

            <h3>六、其他</h3>
            <ul>
              <li>本协议的解释权归"日月全事"网站所有。</li>
              <li>网站有权根据需要更新本协议，更新后的协议将在网站上公布。</li>
              <li>投稿即视为同意本协议的所有条款。</li>
            </ul>

            <p class="update-time">最后更新时间：2026年5月</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.genshin-font {
  font-family: 'Genshin', sans-serif;
}

.agreement-link {
  color: #d3bc8e;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.agreement-link:hover {
  color: #b8a570;
}

.fact-item {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #d3bc8e;
  transition: box-shadow 0.2s ease;
}

.fact-item:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fact-id {
  font-family: 'Common', sans-serif;
  font-size: 14px;
  color: #8d8f93;
  background-color: #e8e8e8;
  padding: 4px 10px;
  border-radius: 4px;
  flex-shrink: 0;
}

.fact-title {
  font-family: 'Genshin', serif;
  font-size: 18px;
  color: #4d4f53;
  line-height: 1.4;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 900px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #d3bc8e;
}

.modal-title {
  font-family: 'Genshin', sans-serif;
  font-size: 24px;
  color: #4d4f53;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #8d8f93;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: #4d4f53;
}

.modal-body {
  font-size: 14px;
  line-height: 1.8;
  color: #4d4f53;
}

.modal-body h3 {
  font-family: 'Genshin', sans-serif;
  font-size: 18px;
  color: #4d4f53;
  margin-top: 20px;
  margin-bottom: 10px;
}

.modal-body p {
  margin-bottom: 10px;
}

.modal-body ul {
  margin-left: 20px;
  margin-bottom: 10px;
}

.modal-body li {
  margin-bottom: 5px;
}

.update-time {
  margin-top: 20px;
  color: #8d8f93;
  font-size: 12px;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }
}
</style>
