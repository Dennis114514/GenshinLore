# 日月全事——全网最详尽的原神世界观手册
![Logo](docimg/icondark.png)
## 项目简介
本项目是[「日月全事」原神世界观手册网站](https://genshinlore.cn/)的代码存储库，存储了该网站的全部内容和程序代码，供开源社区查看和维护。

关于「日月全事」原神世界观手册，请查看原版手册作者[诗漱](https://space.bilibili.com/1916076420/)的相关动态和视频。

关于本网站，请查看本站的“关于本站”页面

## 项目使用说明

关于本项目的授权许可等法律问题，请参考LICENCE.md

本项目使用了最原始的HTML+JavaScript+CSS的技术栈，以确保易用和简洁，~~还有我不会Vue这些？~~，服务器由Cloudflare Pages提供，域名由我自费购买。

你可以做的：
1. 针对本站的使用体验、bug等技术问题提出issues  
**注意：内容问题请联系诗漱，反馈时请遵守他的反馈信息处理原则，在本项目issues中反馈内容问题不保证能得到处理**
2. 如果你有能力，可以提交Pull Request，我们会根据实际需求merge  
**注意：严禁直接commit到main分支，一旦发现，无论修改的多好，一律refuse，除仓库owner之外的所有人必须在develop分支中开发**
3. 查看本项目的源代码，学习，研究或用于AI训练
4. 为本项目网站建立镜像站  
**如果有建立镜像站的，请联系我，我会把镜像站加入本文档中。**
5. 其他在合理使用范围内的行为

你不能做的：
1. 一切违反LICENSE.md的行为
2. 一切商业行为，包含但不限于倒卖本仓库和网站访问地址，将网站内容或UI设计用作商业用途，试图说服owner商业化运营网站，将网站的程序代码进行修改或在其他地方使用而未遵守GPLv3协议等。
3. 一切网络暴力行为，包含但不限于辱骂他人，开盒挂人等行为。

## 关于纯JavaScript页面的编辑说明

为了便于看不懂HTML的人编辑，本站的部分页面使用了JavaScript数组存储markdown内容并动态解析，对于这部分内容的编辑说明如下：

|markdown代码 |说明 |  
|----|----|
|`#`|一级标题|
|`##`|二级标题|
|`###`|三级标题|
|`####`|四级标题|
|`•`|事件小标题|
|`**文字**`|红色文字|
|`<sup>数字</sup>`|注释角标|
|`>`|引用文字|
|`> 数字`|注释详细内容，数字要和正文中的<sup></sup>对应|
|`<br>`|换行，表格里面也可使用|
|` <br />`|（/前面加空格）表格空单元格|

## 镜像站列表
|地址|来源|说明|
|---|---|---|
|genshinlore.cn|Dennis114514|首选，主站|
|genshinlore.pages.dev|Dennis114514|Cloudflare Pages的默认域名，国内部分地区无法访问|
|genshinlore.github.io|Dennis114514|部署在Github Pages上面的镜像站，每24小时同步一次|

## 项目结构
```
GenshinLore/
├── .gitignore    #防止下游仓库配置的actions被覆盖
├── 404.html    #404错误页面
├── BingSiteAuth.xml    #bing搜索引擎验证
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
├── script.js    #全站JavaScript
├── somewords.html    #杂谈页面
├── styles-index.css   #起始页CSS
├── styles.css    #全站CSS
├── useragreement.js    #用户协议加载器
├── useragreementversion.json    #用户协议版本数据
├── watermarkDiv.js    #时间线页面保护器
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
└── video/                            # 背景视频
    ├── backgroundA.mp4
    ├── backgroundB.mp4
    └── backgroundC.mp4
    
```