# 日月全事——全网最详尽的原神世界观手册
![Logo](docimg/icondark.png)
## 项目简介
本项目是[「日月全事」原神世界观手册网站](https://genshinlore.cn/)的代码仓库，托管了该网站的全部内容与程序代码，面向开源社区开放查看与维护。

关于「日月全事」原神世界观手册本身，请参阅原版手册作者[诗漱](https://space.bilibili.com/1916076420/)的相关动态与视频。  
关于本网站，请查看本站的“关于本站”页面。

## 项目使用说明

有关本项目的授权许可等法律问题，请参阅 [LICENCE.md](LICENCE.md)。

本项目采用最原始的 HTML + JavaScript + CSS 技术栈，以确保易用和简洁，~~还有我不会 Vue 这些？~~。服务器由 Cloudflare Pages 提供，域名由我自费购买。

你可以做的：
1. 针对本站的使用体验、Bug 等技术问题提交 Issue  
**注意：内容问题请联系诗漱，反馈时请遵守他制定的反馈信息处理原则。在本仓库的 Issue 中反馈内容问题，不保证能得到处理。**
2. 如果你有能力，可以提交 Pull Request，我们会根据实际需求合并（merge）  
**注意：请务必先fork仓库，在自己的GitHub账号下修改好后再提交Pull Request。**
3. 查看本项目的源代码，用于学习、研究或 AI 训练
4. 为本项目网站建立镜像站  
**如果你建立了镜像站，请联系我，我会将镜像站加入本文档的列表中。**
5. 其他在合理使用范围内的行为

你不能做的：
1. 一切违反 [LICENCE.md](LICENCE.md) 的行为
2. 一切商业行为，包括但不限于倒卖本仓库和网站访问地址、将网站内容或 UI 设计用作商业用途、试图说服 owner 将网站商业化运营、将网站的程序代码进行修改或在其他地方使用而未遵守 GPLv3 协议等
3. 一切网络暴力行为，包括但不限于辱骂他人、开盒挂人等

## 关于纯 JavaScript 页面的编辑说明

为方便不了解 HTML 的人编辑，本站的部分页面使用 JavaScript 数组存储 Markdown 内容并动态解析。这些内容的编辑约定如下：

| Markdown 代码 | 说明 |
|----|----|
| `#` | 一级标题，页面最上方的大标题 |
| `##` | 二级标题，会在大纲里面显示 |
| `###` | 三级标题，会在大纲里面显示 |
| `####` | 四级标题，大纲里不显示 |
| `•` | 事件小标题 |
| `**文字**` | 红色文字 |
| `<sup>数字</sup>` | 注释角标 |
| `> ` | 引用文字 |
| `> 数字` | 注释详细内容，数字需与正文中的 `<sup></sup>` 对应 |
| `<br>` | 换行，表格中也可以使用 |
| ` <br />` | 表格中的空单元格（注意 `/` 前有一个空格） |

## 镜像站列表
| 地址 | 来源 | 说明 |
|---|---|---|
| genshinlore.cn | Dennis114514 | 主站（首选） |
| genshinlore.pages.dev | Dennis114514 | Cloudflare Pages 默认域名，国内部分地区无法访问 |
| genshinlore.github.io | Dennis114514 | 部署在 GitHub Pages 上的镜像站，每 24 小时同步一次 |
|genshinlore.hut.ao|Masterain98|由[Masterain98](https://github.com/Masterain98)在 Netlify部署的镜像站，国内访问体验较好，感谢他对本网站的支持|

## 项目结构
```
GenshinLore/
├── .gitignore               # Git 忽略配置
├── .github/                 # GitHub Actions 工作流
│   └── workflows/
│       └── workflow.yml
├── .prettierignore          # Prettier 忽略配置
├── LICENCE.md               # 许可证
├── README.md                # 项目说明
├── docimg/                  # 文档配图
│   ├── icon.png
│   └── icondark.png
├── eslint.config.mjs        # ESLint 配置
├── package.json             # 项目依赖（VitePress + Tailwind CSS）
├── prettier.config.mjs      # Prettier 配置
│
├── docs/                    # VitePress 站点（主站内容）
│   ├── .vitepress/          # VitePress 配置与主题
│   │   ├── config.mts       # 站点配置
│   │   ├── tsconfig.json
│   │   └── theme/           # 自定义主题
│   │       ├── index.ts
│   │       ├── types/
│   │       │   └── params.ts
│   │       ├── data/        # 站点数据
│   │       │   ├── eulaContent.ts
│   │       │   ├── interestfactsData.ts
│   │       │   ├── navData.ts
│   │       │   └── timelineData.ts
│   │       └── client/
│   │           ├── Layout.vue       # 整个网页的根布局
│   │           ├── tsconfig.json
│   │           ├── components/      # Vue 组件 （全局性组件和导航栏项下的各门户页面）
│   │           │   ├── AppFooter.vue
│   │           │   ├── AppHeader.vue
│   │           │   ├── Article.vue
│   │           │   ├── EastereggScreen.vue   # 小巧思页面
│   │           │   ├── HomeScreen.vue
│   │           │   ├── NationScreen.vue
│   │           │   ├── NotFound.vue
│   │           │   ├── NoticeModal.vue
│   │           │   ├── SplashScreen.vue  # 开屏视频
│   │           │   ├── TableOfContents.vue  # 文章页侧的toc
│   │           │   ├── TimelineScreen.vue  # @诗漱 的excel导出表格
│   │           │   └── UserAgreementModal.vue
│   │           ├── composables/     # Vue 组合函数
│   │           │   ├── filePage.ts
│   │           │   └── isMobile.ts
│   │           ├── core/            # 核心工具
│   │           │   ├── cookies.ts
│   │           │   └── particle.ts
│   │           ├── styles/          # 全局样式
│   │           │   ├── content.css
│   │           │   └── index.css
│   │           └── widgets/         # 页面小组件（用于markdown页面，也可以在其他vue组件里使用，它们都已全局注册）
│   │               ├── Card.vue
│   │               ├── Footnote.vue
│   │               ├── Grid.vue
│   │               ├── Intro.vue
│   │               ├── MidTitle.vue
│   │               ├── QuoteBlock.vue
│   │               ├── SecondaryQuote.vue
│   │               ├── Spacer.vue
│   │               ├── Subtitle.vue
│   │               ├── TextCenter.vue
│   │               ├── TimelineImage.vue
│   │               ├── TimelineItem.vue
│   │               └── TimelineWrapper.vue
│   │
│   ├── index.md             # 首页（VitePress home 布局）
│   ├── home.md              # 主导航页
│   ├── preface.md           # 前言
│   ├── about.md             # 关于手册
│   ├── aboutsite.md         # 关于网站
│   ├── basiclore.md         # 基础设定入口
│   ├── nations.md           # 各国历史入口
│   ├── teyvathis.md         # 提瓦特历史
│   ├── timeline.md          # 时间线
│   │
│   ├── about/               # 杂谈与巧思
│   │   ├── interestfacts.md
│   │   └── somewords.md
│   │
│   ├── basiclore/           # 基础世界观
│   │   ├── descenders/base.md    # 降临者
│   │   ├── facilities/base.md    # 大地和装置
│   │   ├── god/base.md           # 魔神
│   │   ├── lightrelam/base.md    # 龙族和光界
│   │   ├── principles/base.md    # 天理和人界
│   │   ├── stars/base.md         # 星空
│   │   └── void/base.md          # 深渊
│   │
│   ├── his/                 # 各国历史
│   │   ├── Fontaine/base.md
│   │   ├── Inazuma/base.md
│   │   ├── Khaenriah/base.md
│   │   ├── Liyue/base.md
│   │   ├── Mondstadt/base.md
│   │   ├── Natlan/base.md
│   │   ├── Snezhnaya/base.md
│   │   └── Sumeru/base.md
│   │
│   └── public/              # 静态资源（构建时复制到输出目录）
│       ├── _headers         # Cloudflare 缓存头
│       ├── BingSiteAuth.xml # Bing 搜索引擎验证
│       ├── favicon.png
│       ├── notice.json      # 公告数据
│       ├── useragreementversion.json
│       ├── fonts/           # 字体资源
│       │   ├── Khaenriah.woff2
│       │   ├── common.woff2
│       │   └── genshin.woff2
│       └── img/             # 图片资源
│           ├── context/     # 内容配图
│           │   ├── about/            (2 张)
│           │   ├── basiclore/        (1 张)
│           │   ├── Fontaine/         (8 张)
│           │   ├── gallery/          (1 张)
│           │   ├── Inazuma/          (10 张)
│           │   ├── Liyue/            (5 张)
│           │   ├── Mondstadt/        (26 张)
│           │   ├── Natlan/           (23 张)
│           │   ├── Snezhnaya/        (2 张)
│           │   ├── Sumeru/           (7 张)
│           │   └── teyvathis/        (2 张)
│           ├── country/    # 各国背景 & 角色
│           │   ├── fontaine-bg.jpg / fontaine-char.png
│           │   ├── inazuma-bg.jpg / inazuma-char.png
│           │   ├── liyue-bg.jpg / liyue-char.png
│           │   ├── mondstadt-bg.jpg / mondstadt-char.png
│           │   ├── natlan-bg.jpg / natlan-char.png
│           │   └── sumeru-bg.jpg / sumeru-char.png
│           ├── logo/       # Logo 与标识
│           │   ├── Fontaine / Inazuma / Khaenriah / Liyue
│           │   ├── Mondstadt / Natlan / Snezhnaya / Sumeru
│           │   ├── genshinlogo.webp
│           │   ├── favicon32x32.png
│           │   └── website/
│           │       ├── Cloudflare.png
│           │       ├── Github.png
│           │       └── Rainyun.png
│           └── others/     # 其他图片
│               ├── 404.png
│               ├── GenshinLore.png
│               └── star.png
```

---

本项目已迁移至 VitePress + Vue + TypeScript 技术栈，使用 Tailwind CSS 进行样式设计。

本站的内容页面使用 Markdown 文件（`.md`）编写，由 VitePress 渲染。