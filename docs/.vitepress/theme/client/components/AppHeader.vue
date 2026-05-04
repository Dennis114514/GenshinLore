<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vitepress'

const navItems = [
  { label: '首页', href: '/home' },
  { label: '前言', href: '/preface' },
  { label: '基本设定', href: '/basiclore' },
  { label: '提瓦特历史', href: '/teyvathis' },
  { label: '各国历史', href: '/nations' },
  { label: '时间线', href: '/timeline' },
  { label: '关于手册', href: '/about' },
  { label: '关于本站', href: '/aboutsite' },
]

const router = useRouter()
const route = useRoute()
const INDICATOR_INITIAL = { width: '0px', left: '0px' }
const indicatorStyle = ref<{ width: string; left: string }>({ ...INDICATOR_INITIAL })
const mobileMenuActive = ref(false)

const activeIndex = computed(() => {
  const idx = navItems.findIndex((item) => item.href === route.path)
  return idx >= 0 ? idx : 0
})

const updateIndicator = (el: HTMLElement) => {
  indicatorStyle.value = {
    width: el.offsetWidth + 'px',
    left: el.offsetLeft + 'px',
  }
}

const resetIndicator = () => {
  const active = document.querySelector(
    `.nav-item[data-index="${activeIndex.value}"]`,
  ) as HTMLElement
  if (active) updateIndicator(active)
}

const toggleMobileMenu = (e: Event) => {
  e.stopPropagation()
  mobileMenuActive.value = !mobileMenuActive.value
}

const closeMobileMenu = () => {
  mobileMenuActive.value = false
}

const onResize = () => {
  if (window.innerWidth > 1012) {
    mobileMenuActive.value = false
  }
  resetIndicator()
}

onMounted(() => {
  resetIndicator()
  window.addEventListener('resize', onResize)
  document.addEventListener('click', closeMobileMenu)
})

watch(
  () => route.path,
  () => {
    resetIndicator()
  },
)

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('click', closeMobileMenu)
})
</script>

<template>
  <header
    class="topbar fixed top-0 left-0 w-full h-17.5 bg-[#4d4f53] flex justify-between items-center p-[0_40px] z-10"
  >
    <div class="flex items-center gap-3.75 cursor-pointer topbar-left" @click="router.go('/home')">
      <img
        src="/img/logo/genshinlogo.webp"
        alt="原神Logo"
        class="w-11.25 h-11.25 object-contain logo"
      />
      <span class="site-title text-2xl text-[#d3bc8e]">世界观手册</span>
    </div>
    <nav class="nav-menu" :class="{ active: mobileMenuActive }">
      <div class="mobile-menu-btn" @click="toggleMobileMenu"><span /><span /><span /></div>
      <div class="nav-indicator" :style="indicatorStyle" />
      <ul class="nav-list">
        <li
          v-for="(item, i) in navItems"
          :key="i"
          class="nav-item"
          :class="{ 'nav-item-home': i === activeIndex, active: i === activeIndex }"
          :data-index="i"
          @mouseenter="
            updateIndicator(($event.target as HTMLElement).closest('.nav-item') as HTMLElement)
          "
          @mouseleave="resetIndicator"
        >
          <a :href="item.href">{{ item.label }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.topbar {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.site-title {
  font-family: 'Genshin', serif;
  letter-spacing: 2px;
}

.nav-menu {
  position: relative;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 5px;
}

.nav-item {
  position: relative;
  padding: 10px 18px;
}

.nav-item a {
  font-family: 'Genshin', sans-serif;
  font-size: 15px;
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;
  display: block;
  position: relative;
  z-index: 1;
}

.nav-item:hover a,
.nav-item.active a {
  color: #d3bc8e;
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #d3bc8e;
  border-radius: 2px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

@media screen and (max-width: 1012px) {
  .topbar {
    padding: 0 20px;
    height: 60px;
  }

  .topbar-left {
    gap: 10px;
  }

  .logo {
    width: 35px;
    height: 35px;
  }

  .site-title {
    font-size: 20px;
  }

  .nav-menu {
    position: static;
  }

  .mobile-menu-btn {
    display: block;
    position: relative;
    width: 30px;
    height: 20px;
    cursor: pointer;
    z-index: 20;
    background: transparent;
    border: none;
    padding: 0;
  }

  .mobile-menu-btn span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: #d3bc8e;
    margin: 3px 0;
    transition: 0.3s;
    position: relative;
    border-radius: 2px;
  }

  .nav-menu.active .mobile-menu-btn span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }

  .nav-menu.active .mobile-menu-btn span:nth-child(2) {
    opacity: 0;
  }

  .nav-menu.active .mobile-menu-btn span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }

  .nav-list {
    display: flex;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #4d4f53;
    flex-direction: column;
    padding: 0;
    max-height: 0;
    overflow-y: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 15;
    gap: 0;
    list-style: none;
    margin: 0;
    opacity: 0;
    visibility: hidden;
    transition:
      max-height 0.3s ease-in-out,
      opacity 0.3s ease-in-out,
      visibility 0.3s,
      padding 0.3s;
  }

  .nav-menu.active .nav-list {
    max-height: calc(100vh - 60px);
    opacity: 1;
    visibility: visible;
    padding: 10px 0;
    overflow-y: auto;
  }

  .nav-item {
    padding: 0;
    width: 100%;
    text-align: center;
  }

  .nav-item a {
    font-size: 16px;
    color: #ffffff;
    display: block;
    padding: 12px 0;
    width: 100%;
    text-decoration: none;
  }

  .nav-item:hover a {
    color: #d3bc8e;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .nav-indicator {
    display: none;
  }
}
</style>
