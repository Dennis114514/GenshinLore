declare module 'vitepress' {
  namespace DefaultTheme {
    interface Config {
      compliance?: {
        icp?: {
          number?: string
        }
        mps?: {
          number?: string
        }
      }
    }
  }
}

export {}
