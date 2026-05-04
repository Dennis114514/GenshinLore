<script setup lang="ts">
import useIsMobile from '../composables/isMobile'

const isMobile = useIsMobile()
</script>

<template>
  <div
    class="w-screen h-screen flex items-center justify-center p-5 bg-[#393b40] overflow-hidden"
    :class="isMobile ? 'border-double border-19 border-[orange]' : ''"
  >
    <div class="text-white text-center">
      <img
        src="/img/others/404.png"
        alt="404"
        class="w-[60vh] w-max-[500px] h-auto block m-[0_auto]"
      />
      <div class="flex flex-col mt-7.5">
        <p class="text-[22px] mb-3">这个页面找不到了</p>
        <div class="flex flex-col gap-2.5 mb-7.5">
          <p class="text-[16px] text-[#ccc]">可能跟温迪一起出游了吧</p>
          <p class="text-[16px] text-[#ccc]">可能和钟离在喝茶...</p>
          <p class="text-[16px] text-[#ccc]">可能被寒天之钉砸了...</p>
        </div>
        <img src="/img/others/star.png" alt="star" class="w-5.5 h-5.5 m-[0_auto]" />
        <a href="/" class="mb-7.5 font-[24px] opacity-[0.8] hover:opacity-[1]">返回首页 »</a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
