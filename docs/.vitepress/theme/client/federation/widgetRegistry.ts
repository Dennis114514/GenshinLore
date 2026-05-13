import type { Component } from 'vue'
import Card from './CardFederated.vue'
import Footnote from '../widgets/Footnote.vue'
import Grid from '../widgets/Grid.vue'
import Intro from '../widgets/Intro.vue'
import MidTitle from '../widgets/MidTitle.vue'
import QuoteBlock from '../widgets/QuoteBlock.vue'
import SecondaryQuote from '../widgets/SecondaryQuote.vue'
import Spacer from '../widgets/Spacer.vue'
import Timeline from '../widgets/Timeline.vue'
import './widget-shared.css'

export const widgetRegistry: Record<string, Component> = {
  Card,
  Footnote,
  Grid,
  Intro,
  MidTitle,
  QuoteBlock,
  SecondaryQuote,
  Spacer,
  Timeline,
}

export const widgetList = Object.keys(widgetRegistry)

export type WidgetName = keyof typeof widgetRegistry
