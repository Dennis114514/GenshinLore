// https://vitepress.dev/guide/custom-theme
import Layout from './client/Layout.vue'
import type { Theme } from 'vitepress'
import './client/styles/index.css'
import Intro from './client/widgets/Intro.vue'
import MidTitle from './client/widgets/MidTitle.vue'
import Grid from './client/widgets/Grid.vue'
import Card from './client/widgets/Card.vue'
import Spacer from './client/widgets/Spacer.vue'
import Subtitle from './client/widgets/Subtitle.vue'
import SecondaryQuote from './client/widgets/SecondaryQuote.vue'
import QuoteBlock from './client/widgets/QuoteBlock.vue'
import TimelineImage from './client/widgets/TimelineImage.vue'
import Footnote from './client/widgets/Footnote.vue'
import TimelineWrapper from './client/widgets/TimelineWrapper.vue'
import TimelineItem from './client/widgets/TimelineItem.vue'
import TextCenter from './client/widgets/TextCenter.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 将一些可能用的比较多的组件注册为全局组件
    app.component('Intro', Intro)
    app.component('MidTitle', MidTitle)
    app.component('Grid', Grid)
    app.component('Card', Card)
    app.component('Space', Spacer)
    app.component('Subtitle', Subtitle)
    app.component('SecondaryQuote', SecondaryQuote)
    app.component('QuoteBlock', QuoteBlock)
    app.component('TimelineImage', TimelineImage)
    app.component('Footnote', Footnote)
    app.component('TimelineWrapper', TimelineWrapper)
    app.component('TimelineItem', TimelineItem)
    app.component('TextCenter', TextCenter)
  },
} satisfies Theme
