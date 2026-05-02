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

## 项目结构
```
GenshinLore/
├── .gitignore    #防止下游仓库配置的 actions 被覆盖
├── 404.html    #404 错误页面
├── BingSiteAuth.xml    #Bing 搜索引擎验证
├── Teyvathis.html    #“提瓦特历史”页面
├── _headers    #预加载字体资源
├── about.html    #关于手册页面
├── aboutsite.html    #关于网站页面
├── basiclore.html    #基础设定入口页
├── genshinbasichis.html    #时间线页面
├── history-country.html    #各国历史入口页
├── index.html    #起始页
├── interestfacts.html    #制作组的小巧思页面
├── interestfacts.json    #制作组的小巧思数据
├── main.html    #主页
├── notice.js    #公告加载器
├── notice.json    #公告数据
├── preface.html    #前言页面
├── script-index.js    #起始页动画
├── script.js    #全站 JavaScript
├── somewords.html    #杂谈页面
├── styles-index.css   #起始页 CSS
├── styles.css    #全站 CSS
├── useragreement.js    #用户协议加载器
├── useragreementversion.json    #用户协议版本数据
├── watermarkDiv.js    #时间线页面保护器
├── sitemap.xml    #网站地图
├── md.html    #Markdown版本入口
│
├── basiclore/                        # 基础世界观
│   ├── descenders/            #降临者
│   │   └── base.html
│   ├── facilities/                 #大地和装置
│   │   └── base.html
│   ├── god/                         #魔神
│   │   └── base.html
│   ├── lightrelam/              #龙族和光界
│   │   └── base.html
│   ├── principles/              #天理和人界
│   │   └── base.html
│   ├── stars/                      #星空
│   │   └── base.html
│   └── void/                        #深渊
│       └── base.html
│
├── fonts/                            # 字体资源
│   ├── Khaenriah.woff2
│   ├── common.woff2
│   └── genshin.woff2
│
├── his/                              # 各国历史
│   ├── Fontaine/
│   │   ├── base.html
│   │   └── content.js
│   ├── Inazuma/
│   │   ├── base.html
│   │   └── content.js
│   ├── Khaenriah/
│   │   ├── base.html
│   │   └── content.js
│   ├── Liyue/
│   │   ├── base.html
│   │   └── content.js
│   ├── Mondstadt/
│   │   └── base.html
│   ├── Natlan/
│   │   ├── base.html
│   │   └── content.js
│   ├── Snezhnaya/
│   │   ├── base.html
│   │   └── content.js
│   └── Sumeru/
│       ├── base.html
│       └── content.js
│
├── img/                              # 图片资源
│   ├── context/                      # 内容配图
│   │   ├── about/                    (2 张)
│   │   ├── basiclore/               (1 张)
│   │   ├── Fontaine/                (8 张)
│   │   ├── gallery/                 (1 张)
│   │   ├── Inazuma/                 (10 张)
│   │   ├── Liyue/                   (5 张)
│   │   ├── Mondstadt/               (26 张)
│   │   ├── Natlan/                  (23 张)
│   │   ├── Snezhnaya/               (2 张)
│   │   ├── Sumeru/                  (7 张)
│   │   └── teyvathis/               (2 张)
│   ├── country/                      # 各国背景 & 角色
│   │   ├── fontaine-bg.jpg / fontaine-char.png
│   │   ├── inazuma-bg.jpg / inazuma-char.png
│   │   ├── liyue-bg.jpg / liyue-char.png
│   │   ├── mondstadt-bg.jpg / mondstadt-char.png
│   │   ├── natlan-bg.jpg / natlan-char.png
│   │   └── sumeru-bg.jpg / sumeru-char.png
│   ├── logo/                         # Logo
│   │   ├── Fontaine / Inazuma / Khaenriah / Liyue
│   │   ├── Mondstadt / Natlan / Snezhnaya / Sumeru
│   │   ├── genshinlogo.webp
│   │   └── website/
│   │       ├── Cloudflare.png
│   │       ├── Github.png
│   │       └── Rainyun.png
│   └── others/
│       ├── 404.png
│       └── star.png
│
├── video/                            # 背景视频
│   ├── backgroundA.mp4
│   ├── backgroundB.mp4
│   └── backgroundC.mp4
└── md/
│   (各页面的markdown版本)
```
