<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import useIsMobile from '../composables/isMobile'

const nations = [
  { name: '蒙德', folder: 'Mondstadt', en: 'mondstadt' },
  { name: '璃月', folder: 'Liyue', en: 'liyue' },
  { name: '稻妻', folder: 'Inazuma', en: 'inazuma' },
  { name: '须弥', folder: 'Sumeru', en: 'sumeru' },
  { name: '枫丹', folder: 'Fontaine', en: 'fontaine' },
  { name: '纳塔', folder: 'Natlan', en: 'natlan' },
  { name: '至冬', folder: 'Snezhnaya', en: 'snezhnaya' },
  { name: '坎瑞亚', folder: 'Khaenriah', en: 'khaenriah' },
]

const isMobile = useIsMobile()
</script>

<template>
  <div class="bg-[#111111BF] w-screen h-full flex flex-col">
    <section class="cities p-0" :class="!isMobile ? 'mt-17.5' : 'mt-15'">
      <ul class="city_list w-full overflow-hidden">
        <li v-for="nation in nations" :key="nation.en" class="city_item">
          <div
            class="city_bg"
            :style="{ backgroundImage: `url(/img/country/${nation.en}-bg.jpg)` }"
          ></div>
          <a :href="`/his/${nation.folder}/base.html`">
            <p style="font-family: 'Genshin', sans-serif">{{ nation.name }}</p>
          </a>
          <div
            class="city_char"
            :style="{ backgroundImage: `url(/img/country/${nation.en}-char.png)` }"
          ></div>
        </li>
      </ul>
    </section>
    <AppFooter />
  </div>
</template>

<style scoped>
.city_list {
  display: block;
  width: 100%;
}

.city_item {
  position: relative;
  width: 100%;
  height: 260px;
  background: center no-repeat;
  background-size: 100% auto;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 0;
}

.city_item::before {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  content: '';
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.city_item:hover::before {
  background: rgba(0, 0, 0, 0.2);
}

.city_bg {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  background: center no-repeat;
  background-size: 1920px 260px;
  transition: transform 0.4s 0s ease-out;
}

.city_item:hover .city_bg {
  transform: scale(1.05);
}

.city_char {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: calc(50% + 360px) 50%;
  background-size: 960px 260px;
  opacity: 0;
  transition: all 0.2s 0s ease-in;
  border: #fff solid 6px;
  box-sizing: border-box;
}

.city_item:hover .city_char {
  opacity: 1;
}

.city_item p,
.city_item a {
  display: inline-block;
  position: relative;
  z-index: 3;
  font-size: 36px;
  color: #fff;
  line-height: 260px;
  width: 100%;
  height: 260px;
  background: url(data:image/png;base64,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)
    center no-repeat;
  background-size: 132px;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin: 0 !important;
  overflow: hidden;
  text-decoration: none;
}

.city_item p::after {
  position: absolute;
  bottom: 91px;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  content: '';
  width: 210px;
  height: 10px;
  background: url(data:image/png;base64,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UmVhZHlxyWU8AAADIWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE5REYyOTI0QTQwODExRUE5RjFBRUY4QkUxOTE1RTkxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE5REYyOTI1QTQwODExRUE5RjFBRUY4QkUxOTE1RTkxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTlERjI5MjJBNDA4MTFFQTlGMUFFRjhCRTE5MTVFOTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaQ6QTlREjI5MjNBNDA4MTFFQTlGMUFFRjhCRTE5MTVFOTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7WUXH5AAAB30lEQVR42uxZTUrEMBRO0mkFN4MLdy5U3HoBxSsoeAXPNhdQRHAhunDhGXSnK/cKTpuJCb7gZ0jSzEzBLt4HH+8vL9O+5KWlI40xwkKKv5CBdFDgk2CrBKsIJyA960D3bCBWg95ExjQwdw3S52yQlDTWxwXIJrBrGl9BDZqEnrM7qEkMiq7NQL1fLY8s34KxO5YPlruBv6N8hEnEUcb83tdCfks+DXkt5LRgdxDvYD4n50HMzfeViLXka4FdYOtA78Cngc6/IB2lpwHpdQG2idTUiEhz9EGK/8EisKvCvAryq8Q96IJ5TCbWFdh9TSRgAXHhXMNcW05h3JR8ewPVVmbuV8KB0iXy/cHU9sw7CeaXmZotltxvZok1MwVrujLUQIshB1pYk2mi3G/oxH0pmEsvWQed2RCxHBXZFKqwxhLocWh5Y7lJvCJfalOvc/iZRM3Dwyt3OleZXF14cKnCRjE917xOc4pVGk7Sqx1jHHBPonvLffBdkjyFBXavfMeRVz/GP4EbaXw4sHy03E7E3y1PLJ+5VOOB4hKMDi/09PmIxD4tz7iJuJEYZXiihpmDz+nnFGNwIzEKcWd5IX6/6jn9lssyTky4BKPGzHJL/PwnNeNyjBf8sYHBGADfAgwA8cikm9LXVvEAAAAASUVORK5CYII=)
    center no-repeat;
  background-size: 210px 10px;
  opacity: 0;
}

.city_item:hover p::after {
  opacity: 1;
}

@media screen and (max-width: 1280px) {
  .city_bg,
  .city_item {
    background-size: 1280px 260px;
  }
}

.cities {
  padding: 0;
}
</style>
