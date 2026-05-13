# 编写（贡献）指南

感谢你愿意为本项目做贡献！

## 技术栈

- Node.js 24 （开发环境）
- Vue.js （渐进式框架）
- VitePress （静态站点生成器）
- TailwindCSS （网站样式工具）

## 文档编写规范
为了最大程度上让所有人都能够编写符合本站要求的文档，我们采用VitePress来生成站点，绝大多数内容都可以通过编写markdown文件完成。

以下是对本站markdown文件编写的约束，在进行编写时请遵守：

**第一：** 所有markdown文件必须有frontmatter，它必须出现在文件最开头，以三个英文下的减号（-）开始，并以三个英文下的减号结束。下面对必须包含的参数进行说明：

| 参数名            | 解释                                                            |
|----------------|---------------------------------------------------------------|
| title          | 文章标题（我们不使用markdown的原生一级标题作为页面一级标题，页面标题由该参数指定，它将自动渲染到文章开头。）    |
| secondaryClass | 文章所述的导航标签（设定它时，当你浏览到该页面时，导航栏的游标将自动停靠在该标签下，移动端看不到游标，而是由高亮显示取代） |

接下来对可选的 `secondaryClass` 进行解释列举：

| 参数值        | 解释    |
|------------|-------|
| /basiclore | 基本设定  |
| /teyvathis | 提瓦特历史 |
| /nations   | 各国历史  |

> 此处没有列举的参数值视为你不得在编写时使用的值。另：「/」也必须填写，一个合法的示例：secondaryClass: /nations （冒号到斜杠中间必须有空格）
> 如果你不会写frontmatter，可以直接复制你要编写的文档对应的 `base.md` 文件的frontmatter并进行修改即可。

**第二：** 文档对markdown标准样式的特别约定说明如下：

| Markdown 代码 | 说明                   |
|-------------|----------------------|
| `##`        | 在本站中将视为一级标题，会在大纲里面显示 |
| `###`       | 在本站中将视为二级标题，会在大纲里面显示 |
| `####`      | 在本站中将视为三级标题，会在大纲里面显示 |
| `**文字**`    | 在本站中将被渲染为红色文字，而不是加粗  |

> 其他未被列举到的markdown样式将以其原本的行为在本站中被渲染，**但我们不推荐使用**。若你需要红色文字，除了用 `**文字**` 外，也可以直接写 `<span class="red-text">文字</span>`。

### 表格：直接用 Markdown 原生语法

本站已优化，你可以直接用 Markdown 原生表格语法编写，**无需**再用 `<div>` 包裹或写 HTML `<table>/<tr>/<td>`：

```markdown
| 类型 | 介绍 |
|------|------|
| 魔神 | 原初之人法涅斯的碎片，依附到元素生命上使其成为魔神。 |
| 邪神 | 战败的魔神逃到暗之外海，化作邪神。 |
```

效果：表格会自动居中，单元格内容默认左对齐。对于复杂的合并单元格（如 rowspan/colspan），仍需使用 HTML 表格语法。

### 链接：自动新窗口打开

本站已配置，所有以 `http://` 或 `https://` 开头的外部链接会自动在新标签页打开，**无需**再写 `target="_blank"`。直接用 Markdown 链接即可：

```markdown
[视频链接](https://www.bilibili.com/video/BV1At4y1q7UQ/)
```

等价于：
```html
<a href="https://www.bilibili.com/video/BV1At4y1q7UQ/" target="_blank">视频链接</a>
```

### 脚注中的链接

`<Footnote>` 组件的 `text` 属性支持 Markdown 链接语法 `[文字](链接)`，会自动转为可点击的新窗口链接：

```html
<Footnote n="1" text="参考资料：[B站视频](https://www.bilibili.com/video/BV1At4y1q7UQ/)" />
```

**第三：** 为方便你使用一些复杂样式，我们根据实际编写需要封装出了一些全局可用的自定义DOM，你可以在你的markdown文档内自由使用：

> 如果你不熟悉 HTML 或编程，不必担心。你只需要把下面的示例代码复制到你的 markdown 文件中，然后把示例里的文字替换成你想展示的内容即可。注意保留代码中的尖括号（`< >`）和引号等符号。

### 内容结构类

**`<Intro>` — 导语段落**

显示在文章开头的导语，带有金色左右边框和浅灰背景，适合用来概括全文主旨。

```html
<Intro>
这是文章的开篇导语，用于概述全文内容。
</Intro>
```

**`<MidTitle>` — 居中大标题**

用于页面中段的大标题，居中对齐，下方有一条金色渐变装饰线，适合用来划分文章的不同章节。（注意：该标题不会被大纲索引）

```html
<MidTitle>章节标题</MidTitle>
```

**`<Space>` — 垂直间距**

在页面中插入一块空白区域，用于增加上下内容之间的距离。`size` 参数控制空白高度（单位：像素），不填则默认为 16 像素。

```html
<Space size="30" />
```

### 导航卡片类

**`<Grid>` 与 `<Card>` — 导航卡片组**

`<Grid>` 是一个卡片网格容器，`<Card>` 是其中的可点击卡片。将它们配合使用可以创建导航入口：
- 在电脑上，卡片会自动显示为两列；
- 在手机上，卡片会自动变成一列。

每张 `<Card>` 需要指定三个内容：
- `dest` 参数：点击后跳转的网址（站内路径，例如 `/nations/mondstadt`）
- `#icon` 插槽：卡片的图标（可以是文字或 emoji）
- `#title` 插槽：卡片标题
- `#subtitle` 插槽：卡片副标题

```html
<Grid>
  <Card dest="/basiclore/">
    <template #icon>📖</template>
    <template #title>基本设定</template>
    <template #subtitle>了解提瓦特世界的基础规则</template>
  </Card>
  <Card dest="/nations/">
    <template #icon>🌍</template>
    <template #title>各国历史</template>
    <template #subtitle>探索七国的发展历程</template>
  </Card>
</Grid>
```

### 引用与注释类

**`<QuoteBlock>` — 原文引用（可点击查看完整内容）**

用于引用游戏原文。该组件会在页面中只显示第一行作为预览，并在下方显示「点击查看完整原文」提示。读者点击后，会弹出一个弹窗展示完整引用内容。按下 Esc 键或点击弹窗外部区域即可关闭。

```html
<QuoteBlock>
这里是完整的引用原文。无论原文有多长，页面初次加载时都只会显示第一行，读者点击后才会看到弹窗里的全部内容。
</QuoteBlock>
```

**`<SecondaryQuote>` — 次要引用**

颜色稍浅、字号较小的引用文字，适合用在主引用内容下方的补充说明。

```html
<SecondaryQuote>
这是一段次要的补充引用说明。
</SecondaryQuote>
```

**`<Footnote>` — 脚注（鼠标悬停查看）**

在文字旁边添加一个金色的脚注编号，读者将鼠标移到编号上时会显示脚注内容。需要填写两个参数：
- `n`：脚注编号
- `text`：脚注内容（支持 `[文字](链接)` 格式的 Markdown 链接）

```html
此处是正文内容<Footnote n="1" text="这是脚注的详细说明文字。" />
```

带链接的脚注：
```html
<Footnote n="1" text="参考资料：[B站视频](https://www.bilibili.com/video/BVxxx/)" />
```

### 时间线类

这套组件用于构建游戏世界的时间线页面。

**`<Timeline>` — 时间线容器**

时间线的外层包裹容器，所有时间线相关内容都应放在它的内部。

```html
<Timeline>
  <!-- 时间线内使用 markdown 二级/三级/四级标题，会自动识别为时间线节点。 -->
</Timeline>
```

### 内联样式

以下 CSS 类可以直接用在 `<span>` 等 HTML 标签的 `class` 属性中，为文字附加特殊效果。

**`black-block` — 防剧透黑块**

将一段文字变成黑色方块（文字与背景同色），读者将鼠标移到上面时才会显示内容。适合用来隐藏剧透信息。

```html
此处是正常内容，<span class="black-block">这里是剧透内容，鼠标移上来才能看到</span>。
```

**`red-text` — 红色文字**

将文字渲染为红色。效果等同于用 `**文字**`，当你不想用 markdown 粗体语法时可以直接使用。

```html
这是一句<span class="red-text">需要强调的红色文字</span>。
```

**`khaenriah-font` — 坎瑞亚字体**

为文字应用坎瑞亚风格字体（注意：该字体只支持英文字母，不支持任何语言的标点符号和非26个字母）。

```html
<span class="khaenriah-font">Khaenri'ah</span>
```

**`strikethrough` — 删除线**

为文字添加删除线并降低透明度，适合表示已过时或废弃的内容。

```html
<span class="strikethrough">这段内容已不再适用。</span>
```

**`image-container` 与 `image-caption` — 图片容器与说明**

在文章中插入配图及其说明文字。`image-container` 用于包裹图片并使其居中（同时移除图片默认的阴影），`image-caption` 用于在图片下方添加灰色小字说明。

```html
<div class="image-container">
  <img src="/images/example.jpg" alt="示例图片" />
  <p class="image-caption">图片说明文字</p>
</div>
```

## 如何开始

1. Fork 本仓库
2. 在你的复刻仓库进行修改，但是根据本仓库协议中指定的不得改动的文件除外
3. 推送并发起 Pull Request

## 本地环境搭建步骤

1. 确保你的操作系统已经安装了 Node.js，你可以通过在你的终端内输入 `node --version`
2. 克隆你 fork 的仓库到你的机器
3. 切换终端的工作目录到你克隆下来的项目根目录，例如：`cd /path/to/GenshinLore`
4. 安装依赖，在终端中输入：`npm install`
5. 预览项目效果，在终端中输入：`npm run docs:dev`，然后在你的浏览器地址栏输入 `localhost:5173`


感谢你的贡献 ❤️

**在旅途的终点再见吧，旅行者。**