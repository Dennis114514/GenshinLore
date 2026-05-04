// https://vitepress.dev/guide/custom-theme
import Layout from './client/Layout.vue'
import type { Theme } from 'vitepress'
import './client/styles/index.css'
import Intro from './client/widgets/Intro.vue'
import MidTitle from './client/widgets/MidTitle.vue'
import Grid from './client/widgets/Grid.vue'
import Card from './client/widgets/Card.vue'
import Spacer from './client/widgets/Spacer.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 将一些可能用的比较多的组件注册为全局组件
    app.component('Intro', Intro)
    app.component('MidTitle', MidTitle)
    app.component('Grid', Grid)
    app.component('Card', Card)
    app.component('Space', Spacer)
  },
} satisfies Theme
