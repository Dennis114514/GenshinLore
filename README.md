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
| `*文字*` | 加粗黑色文字 |
| `~文字~` | 带删除线文字 |
| `<sup>数字</sup>` | 注释角标 |
| `[文字](链接)` | 外部链接 |
| `> ` | 引用文字 |
| `> 数字 内容` | 注释详细内容，数字需与正文中的 `<sup></sup>` 对应。数字无需按顺序，只需对应即可，最终都会被渲染为*|
| `<br>` | 换行，表格中也可以使用 |
| ` <br />` | 表格中的空单元格（注意 `/` 前有一个空格），用于防止表格被合并|
|`\|表格内容\| `|表格|
|`\|\| `|表格空位，如果该位置是表头，且所有表头全为空白，则不会渲染；如果该位置是表格内部，则会以此位置向右和向下查找所有空白位置并合并这些单元格|
| `*******` | （七个`*`）分割线 |
| `![图片描述](图片地址)` |图片，使用时需要将图片放在对应的目录中，每一个页面都有专门的图片目录，可直接复制该页面上已有的图片地址并将最后的文件名改成添加的图片。|
| `![Introbg0](图片地址)` |章首图，一般无需改动|
| `![Introbg0](图片地址)`内容`![Introbg1](图片地址)` |章首引入，一般无需改动|
| `![Introbg1](图片地址)` |章尾图，一般无需改动|
| `![Imagebg](图片地址)` |二级引文图，一般无需改动|
| `` \`\`\`  `` | 二级引文容器，用于添加二级引文（显示在二级引文图右侧），最好不要在中间加空行，该标签需要紧挨着`![Imagebg](图片地址)` |
| `:::`内容`:::` |“编者的话”部分，不用加编者的话四个字|
| `!!!`内容`!!!` |“参考资料”部分，不用加参考资料四个字|
| `<commoncontent>`内容`</commoncontent>` |普通内容，被这两个标签包裹的内容不会被渲染为时间线形式，而是普通文本形式，如“幕间：编者之声”部分|
|`` ```mermaid `` 内容 `` ``` ``|Mermaid图表，前端自动解析|
| `[Image](图片地址)` |图片标签，**已弃用**|

注意：如需编辑，请编辑`/md/`目录下的 Markdown 文件，对应页面的`content.js`或`contentteyvat.js`文件会自动更新。

## 镜像站列表
注意：镜像站的内容**不一定为最新内容**，访问体验也不一定比主站好，非必要情况下请**优先访问主站**。

| 地址 | 来源 | 说明 |
|---|---|---|
| genshinlore.cn | Dennis114514 | 主站（首选） |
| genshinlore.pages.dev | Dennis114514 | Cloudflare Pages 默认域名，国内部分地区无法访问 |
| genshinlore.github.io | Dennis114514 | 部署在 GitHub Pages 上的镜像站，每 24 小时同步一次 |
|genshinlore.hut.ao|Masterain98|由[Masterain98](https://github.com/Masterain98)在 Netlify部署的镜像站，国内访问体验较好，感谢他对本网站的支持|
|genshinlore.peacefuly.top|MCheping8108|参考[Issue#12](https://github.com/Dennis114514/GenshinLore/issues/12)|
|genshinlore.makotowu.cn|makotowu|参考[PullRequest#13](https://github.com/Dennis114514/GenshinLore/pull/13)，注意该镜像站为Vitepress测试站点，其内容**与主站有较大的不同**，仅用于学习交流|

## 项目结构
```
<!-- TREE-START -->
.
├── .github
│   └── workflows
│       └── main.yml
├── Linear
│   ├── base.html
│   └── marker.js
├── basiclore
│   ├── descenders
│   │   └── base.html
│   ├── elementusage
│   │   └── base.html
│   ├── facilities
│   │   └── base.html
│   ├── god
│   │   └── base.html
│   ├── lightrelam
│   │   └── base.html
│   ├── principles
│   │   └── base.html
│   ├── stars
│   │   └── base.html
│   └── void
│       └── base.html
├── docimg
│   ├── icon.png
│   └── icondark.png
├── fonts
│   ├── Khaenriah.woff2
│   ├── common.woff2
│   └── genshin.woff2
├── his
│   ├── Fontaine
│   │   ├── base.html
│   │   └── content.js
│   ├── Inazuma
│   │   ├── base.html
│   │   └── content.js
│   ├── Khaenriah
│   │   ├── base.html
│   │   └── content.js
│   ├── Liyue
│   │   ├── base.html
│   │   └── content.js
│   ├── Mondstadt
│   │   ├── base.html
│   │   └── content.js
│   ├── Natlan
│   │   ├── base.html
│   │   └── content.js
│   ├── Snezhnaya
│   │   ├── base.html
│   │   └── content.js
│   └── Sumeru
│       ├── base.html
│       └── content.js
├── img (183 files)
├── md
│   ├── Fontaine.md
│   ├── Inazuma.md
│   ├── Khaenriah.md
│   ├── Liyue.md
│   ├── Mondstadt.md
│   ├── Natlan.md
│   ├── Snezhnaya.md
│   ├── Sumeru.md
│   ├── Teyvathis.md
│   ├── about.md
│   ├── aboutsite.md
│   ├── main.md
│   ├── preface.md
│   └── somewords.md
├── .gitignore
├── 404.html
├── BingSiteAuth.xml
├── LICENCE.md
├── README.md
├── Teyvathis.html
├── Via_7.0.0.zip
├── about.html
├── aboutcontent.js
├── aboutsite.html
├── basiclore.html
├── contentteyvat.js
├── genshinbasichis.html
├── history-country.html
├── index.html
├── interestfacts.html
├── interestfacts.json
├── main.html
├── md.html
├── mermaid.min.js
├── notice.js
├── notice.json
├── preface.html
├── script-index.js
├── script.js
├── sitemap.xml
├── somewords.html
├── styles-index.css
├── styles.css
├── useragreement.js
├── useragreementversion.json
└── watermarkDiv.js
<!-- TREE-END -->
```
