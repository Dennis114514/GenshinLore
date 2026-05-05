<script setup lang="ts">
import AppFooter from './AppFooter.vue'
</script>

<template>
  <div class="bg-[#f5f5f5] w-screen">
    <main class="mt-17.5 genshin-font main-content">
      <section class="home-content max-w-200 m-[0_auto] p-[60px_40px]">
        <h1 class="text-5xl text-[#4d4f53] text-center mb-5">日月全事</h1>
        <p class="text-[20px] text-[#4d4f53] text-center mb-10">
          一本原神世界观手册
          <a
            class="text-sm text-[#d3bc8e] underline"
            href="https://wwaoo.lanzn.com/i5mR13ocqj6b"
            target="_blank"
            >PDF原文下载↗</a
          >
        </p>
        <p class="editor-info">汇编者：诗漱</p>
        <p class="editor-info">
          B站：<a href="https://space.bilibili.com/1916076420" target="_blank">诗漱_小他者水母</a
          >(UID:1916076420)
        </p>
        <p class="editor-info" style="color: red">
          请在阅读手册之前完整阅读<a href="/preface" style="color: #d3bc8e">前言</a>
        </p>

        <div class="home-info">
          <p>文案作者：原神项目组</p>
          <p>审稿者：网友们</p>
          <p>
            网站作者：<a href="https://github.com/Dennis114514" target="_blank">Dennis114514</a>
          </p>
          <p>月之四修订3 总第8版 <a href="/about">查看修订记录</a></p>
          <p>了解更多请点击右上角的"关于手册"和"关于本站"</p>
        </div>

        <section class="thanks-section">
          <h2>感谢</h2>
          <p>为手册添砖加瓦、做出过巨大贡献的人员：</p>
          <ul class="contributors">
            <li>东北徐大饼</li>
            <li>浅水の狐</li>
            <li>谛亚-许伯利翁哀歌</li>
            <li>浮生梦-Negulons</li>
            <li>深渊晓星</li>
            <li>帆之行</li>
            <li>凉凉的湛湛</li>
          </ul>
        </section>

        <section class="thanks-section">
          <h2>感谢</h2>
          <div class="thanks-detail">
            <p>为本手册铺设了叙事舞台的</p>
            <p>尼伯龙根和法涅斯</p>
            <br />
            <p>为本手册设立了框架的</p>
            <p>戴因斯雷布先生</p>
            <p>安娜丝塔夏·费奥多罗夫娜·雪奈茨娜娅女士</p>
            <p>派蒙女士和旅行者</p>
            <br />
            <p>为本手册提供了大量正史及核心世界观指导的</p>
            <p>钟离先生</p>
            <br />
            <p>为本手册增添了一些野史与诗意的</p>
            <p>温迪先生和伊斯塔露女士</p>
            <br />
            <p>为本手册填写了所有故事的</p>
            <p>所有提瓦特人</p>
          </div>
        </section>
      </section>
      <AppFooter />
    </main>
  </div>
</template>

<style scoped>
.genshin-font {
  font-family: 'Genshin', sans-serif;
}
/* Main content */
.editor-info {
  font-size: 18px;
  color: #000000;
  text-align: center;
  margin: 8px 0;
}

.editor-info a {
  color: #000000;
  text-decoration: none;
}

.editor-info a:hover {
  text-decoration: underline;
}

.home-info {
  font-size: 14px;
  color: #6d6f73;
  text-align: center;
  margin-bottom: 60px;
  line-height: 1.8;
}

.home-info p {
  margin: 8px 0;
}

.home-info a {
  color: #d3bc8e;
  text-decoration: none;
}

/* Thanks sections */
.thanks-section {
  margin-bottom: 40px;
}

.thanks-section h2 {
  font-size: 28px;
  color: #4d4f53;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #d3bc8e;
  padding-bottom: 10px;
  display: inline-block;
}

.thanks-section > p {
  font-size: 16px;
  color: #4d4f53;
  text-align: center;
  margin-bottom: 15px;
}

.contributors {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px 30px;
  font-size: 15px;
  color: #5d5f63;
}

.contributors li {
  padding: 5px 15px;
  background-color: rgba(211, 188, 142, 0.1);
  border-radius: 4px;
}

.thanks-detail {
  font-size: 15px;
  color: #5d5f63;
  text-align: center;
  line-height: 2;
}

/* Mobile */
@media screen and (max-width: 1012px) {
  .main-content {
    margin-top: 60px;
  }

  .home-content {
    padding: 30px 20px;
  }
}
</style>
