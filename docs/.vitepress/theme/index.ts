// https://vitepress.dev/guide/custom-theme
import Layout from './client/Layout.vue'
import type { Theme } from 'vitepress'
import './client/styles/index.css'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme

