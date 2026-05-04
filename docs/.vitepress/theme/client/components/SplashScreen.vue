<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Particle from '../core/particle'

const videoLoaded = ref(false)
const enterVisible = ref(false)
const quoteVisible = ref(false)
const enterFading = ref(false)
const quoteSmall = ref(false)

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let isFormed = false
let textAlpha = 0
let particlesExploded = true
let particleFadeOut = 1
let fontSize = 72
let particles: Particle[] = []
let fontLoaded = false

function initParticles() {
  const c = canvas!
  c.width = window.innerWidth
  c.height = window.innerHeight
  particles = []

  if (c.width < 1200) {
    fontSize = Math.min(c.width / 16, 72)
  } else {
    fontSize = 72
  }

  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')!
  tempCanvas.width = c.width
  tempCanvas.height = c.height

  tempCtx.font = `${fontSize}px 'Khaenriah', serif`
  tempCtx.fillStyle = 'white'
  tempCtx.textAlign = 'center'
  tempCtx.textBaseline = 'middle'

  const centerX = c.width / 2
  const centerY = c.height * 0.382
  const titleString = 'All of Sun and Moon'

  for (let i = -2; i <= 2; i++) {
    tempCtx.fillText(titleString, centerX, centerY + i)
  }

  const imageData = tempCtx.getImageData(0, 0, c.width, c.height).data
  const gap = 3

  for (let y = 0; y < c.height; y += gap) {
    for (let x = 0; x < c.width; x += gap) {
      const index = (y * c.width + x) * 4
      const opacity = imageData[index + 3]
      if (opacity > 128) {
        particles.push(new Particle(x, y, c.width, c.height))
      }
    }
  }
}

const drawRealText = (alpha: number) => {
  const c = canvas!
  const cx = ctx!
  cx.save()
  cx.globalAlpha = alpha
  cx.font = `${fontSize}px 'Khaenriah', serif`
  cx.fillStyle = '#D3BC8E'
  cx.textAlign = 'center'
  cx.textBaseline = 'middle'
  cx.shadowColor = 'rgba(211, 188, 142, 0.5)'
  cx.shadowBlur = 20

  const centerX = c.width / 2
  const centerY = c.height * 0.382
  cx.fillText('All of Sun and Moon', centerX, centerY)
  cx.restore()
}

const animateParticles = () => {
  const c = canvas!
  const cx = ctx!
  cx.clearRect(0, 0, c.width, c.height)

  if (isFormed) {
    let almostArrived = true
    particles.forEach((p) => {
      p.x += (p.baseX - p.x) * 0.04
      p.y += (p.baseY - p.y) * 0.04
      if (Math.abs(p.baseX - p.x) > 15 || Math.abs(p.baseY - p.y) > 15) {
        almostArrived = false
      }
    })

    if (almostArrived) {
      textAlpha += 0.03
      if (textAlpha > 1) textAlpha = 1
    }
    particlesExploded = false
  } else {
    textAlpha -= 0.1
    if (textAlpha < 0) textAlpha = 0

    if (textAlpha <= 0.7) {
      if (!particlesExploded) {
        particles.forEach((p) => {
          p.vx = (Math.random() - 0.5) * 45
          p.vy = (Math.random() - 0.5) * 45
        })
        particlesExploded = true
      }
    }

    if (particlesExploded) {
      particleFadeOut -= 0.02
      if (particleFadeOut < 0) particleFadeOut = 0
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += Math.sin(Date.now() * 0.001 + p.baseX) * 0.4
        p.y += Math.cos(Date.now() * 0.001 + p.baseY) * 0.4
      })
    }
  }

  const particleAlpha = (1 - textAlpha) * particleFadeOut
  if (particleAlpha > 0.01) {
    cx.globalAlpha = particleAlpha
    cx.fillStyle = '#D3BC8E'
    cx.beginPath()
    particles.forEach((p) => {
      cx.moveTo(p.x, p.y)
      cx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    })
    cx.fill()
    cx.globalAlpha = 1.0
  }

  if (textAlpha > 0.01) {
    drawRealText(textAlpha)
  }

  animationId = requestAnimationFrame(animateParticles)
}

const startIntroAnimation = () => {
  initParticles()
  animateParticles()

  setTimeout(() => {
    isFormed = true
  }, 500)

  setTimeout(() => {
    enterVisible.value = true
  }, 3500)
}

const handleEnter = () => {
  enterFading.value = true
  isFormed = false

  setTimeout(() => {
    quoteVisible.value = true
  }, 1800)

  setTimeout(() => {
    window.location.href = '/home'
  }, 7100)
}

const checkScreenArea = () => {
  const area = window.innerWidth * window.innerHeight
  quoteSmall.value = area < 301840
}

const onResize = () => {
  if (fontLoaded) {
    initParticles()
  }
  checkScreenArea()
}

onMounted(async () => {
  canvas = document.getElementById('particle-canvas') as HTMLCanvasElement
  ctx = canvas!.getContext('2d', { willReadFrequently: true })

  // Load Khaenriah font
  try {
    if (document.fonts && document.fonts.load) {
      await document.fonts.load('72px "Khaenriah"')
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  fontLoaded = true

  startIntroAnimation()
  checkScreenArea()
  window.addEventListener('resize', onResize)

  // Attempt autoplay
  const video = document.getElementById('bg-video') as HTMLVideoElement
  if (video) {
    video
      .play()
      .then(() => {
        videoLoaded.value = true
      })
      .catch(() => {
        // Autoplay blocked; user interaction will trigger it
      })
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="splash-root relative overflow-hidden w-screen h-screen bg-black">
    <!-- 由于实际主页系由画布与背景视频构成，为做到SEO友好，故添加一个隐藏的sitemap按钮供搜索引擎爬虫使用。 -->
    <a href="/home" class="absolute -left-2499.75 -top-2499.75 w-px h-px overflow-hidden opacity-0"
      >Sitemap</a
    >

    <!-- Splash Screen开始 -->
    <div class="fixed w-full h-full z-1 top-0 left-0">
      <video
        id="bg-video"
        class="w-full h-full object-contain bg-black opacity-0"
        muted
        loop
        playsinline
        :class="{ loaded: videoLoaded }"
        src="https://uploadstatic.mihoyo.com/hk4e/upload/officialsites/202009/%E8%B6%B3%E8%BF%B9_1601249080_8615.mp4"
      />
      <div class="absolute top-0 left-0 w-full h-full bg-[#4D4F5333] z-2 pointer-events-none"></div>
    </div>

    <!-- 粒子效果画布 -->
    <canvas id="particle-canvas" class="fixed top-0 left-0 w-full h-full z-5 pointer-events-none" />

    <!-- 日月前事标题（目前是不可见的） -->
    <div
      class="fixed top-[38.2%] left-[50%] translate-[50%] z-10 text-center flex flex-col items-center gap-10 pointer-events-none"
    >
      <h1 class="title-text" style="opacity: 0">All of Sun and Moon</h1>
    </div>

    <button
      class="enter-btn"
      :class="{ visible: enterVisible, 'fade-out': enterFading }"
      @click="handleEnter"
    >
      进入
    </button>

    <!-- 书记官语录 -->
    <div
      class="quote-overlay fixed top-0 left-0 w-full h-full bg-white z-100 flex items-center justify-center opacity-[0] invisible"
      :class="{ visible: quoteVisible }"
    >
      <div class="quote-content" :class="{ 'small-screen': quoteSmall }">
        <p>文字之渊源已不可考，穷究言语之滥觞亦是罪责。</p>
        <p>但文字诞生以来，就一直沉默地记录着一切：</p>
        <p>天空，星辰，群山，飞鸟，争执，和平……各式各样的人生。</p>
        <p>无数的文字汇聚成档案，编纂成历史，尘封在岁月中。</p>
        <p>书记官收录真相，也收录真相背后的疑问，</p>
        <p>许多疑问永远不会有答案。</p>
        <br />
        <p>欲答永恒之疑问，唯有永恒之沉默。</p>
        <p class="quote-author">--艾尔海森</p>
        <p class="quote-hint">点击任意位置或者等待5秒后进入</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash-root {
  font-family: 'Genshin', sans-serif;
}

.splash-root #bg-video {
  transition: opacity 1s ease;
}

#bg-video.loaded {
  opacity: 1;
}

.splash-root .title-text {
  font-family: 'Khaenriah', serif;
  font-size: 72px;
  color: #d3bc8e;
  letter-spacing: 8px;
  text-shadow: 0 0 30px rgba(211, 188, 142, 0.5);
}

@media (max-width: 1199px) {
  .splash-root .title-text {
    font-size: calc(100vw / 16);
  }
}

.splash-root .enter-btn {
  font-family: 'Genshin', sans-serif;
  font-size: 20px;
  color: #d3bc8e;
  background-color: transparent;
  border: 2px solid #d3bc8e;
  padding: 15px 50px;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.4s ease,
    background-color 0.4s ease,
    color 0.4s ease,
    box-shadow 0.4s ease;
  letter-spacing: 3px;
  pointer-events: auto;
  border-radius: 8px;
  position: fixed;
  bottom: 38.2%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.splash-root .enter-btn.visible {
  opacity: 1;
}

.splash-root .enter-btn:hover {
  background-color: #d3bc8e;
  color: #4d4f53;
  box-shadow: 0 0 20px rgba(211, 188, 142, 0.6);
}

.splash-root .enter-btn.fade-out {
  opacity: 0 !important;
  pointer-events: none;
  transition: opacity 1s ease;
}

@media (max-width: 1199px) {
  .splash-root .enter-btn {
    font-size: 16px;
    padding: 12px 35px;
    letter-spacing: 2px;
  }
}

/* Quote overlay */
.splash-root .quote-overlay {
  transition:
    opacity 0.8s ease,
    visibility 0.8s ease;
}

.splash-root .quote-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.splash-root .quote-content {
  max-width: 800px;
  padding: 40px;
  text-align: center;
}

.splash-root .quote-content p {
  font-family: 'Genshin', sans-serif;
  font-size: 20px;
  line-height: 2;
  color: #000000;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.splash-root .quote-author {
  font-family: 'Genshin', sans-serif;
  font-size: 18px !important;
  color: #333333 !important;
  margin-top: 20px !important;
}

.splash-root .quote-hint {
  font-family: 'Common', sans-serif;
  font-size: 14px !important;
  color: #838383 !important;
  margin-top: 40px !important;
  letter-spacing: 1px !important;
}

.splash-root .quote-content.small-screen p {
  font-size: calc(100vw / 50) !important;
  line-height: 1.8 !important;
}

.splash-root .quote-content.small-screen .quote-author {
  font-size: calc(100vw / 60) !important;
}

.splash-root .quote-content.small-screen .quote-hint {
  font-size: calc(100vw / 70) !important;
  margin-top: 30px !important;
}
</style>
