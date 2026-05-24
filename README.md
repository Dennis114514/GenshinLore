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
| `>> ` | 两部分内容之间插入的文字 |
| `> 数字` | 注释详细内容，数字需与正文中的 `<sup></sup>` 对应。如果存在链接，需要在`linkMap`里添加，最终显示的内容为在`linkMap`字符串中添加的内容 |
| `<br>` | 换行，表格中也可以使用 |
| ` <br />` | 表格中的空单元格（注意 `/` 前有一个空格） |
|`\|表格内容\| `|表格|
|`\|\| `|表格空位，如果该位置是表头，且所有表头全为空白，则不会渲染；如果该位置是表格内部，则会以此位置向右和向下查找所有空白位置并合并这些单元格|
| `[Image](图片地址)` |图片，使用时需要将图片放在对应的目录中，每一个页面都有专门的图片目录，可直接复制该页面上已有的图片地址并将最后的文件名改成添加的图片。如果在紧接着的下一行有文字，则这行文字会作为图片底下的图片描述显示|


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

## MCP Server (AI 工具集成)

本项目包含一个 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 服务器，允许 AI 助手（如 Claude、GitHub Copilot 等）查询原神世界观知识库。

### 安装与使用

```bash
cd mcp-server
npm install
npm start            # 启动 MCP 服务器 (默认 http://localhost:3000/mcp)
```

服务器启动时会自动从 `md/` 目录的 Markdown 源文件以及 `basiclore/` 的 HTML 文件中解析内容，无需预构建步骤。

可通过环境变量 `PORT` 自定义端口：

```bash
PORT=8080 npm start  # 使用 8080 端口
```

### 传输协议

服务器使用 **Streamable HTTP** 传输协议（MCP 规范推荐），通过 HTTP 提供服务：

- **MCP 端点**：`POST /mcp`（处理 JSON-RPC 请求）
- **健康检查**：`GET /health`（返回服务器状态）

### 提供的工具

| 工具 | 说明 | 参数 |
|------|------|------|
| `get_categories` | 列出所有可用的知识分类及章节标题 | 无 |
| `read_lore` | 读取指定分类的内容，可选读取特定章节 | `category` (必需), `section` (可选) |
| `search_lore` | 按关键词搜索所有文档，返回匹配的章节和片段 | `query` (必需), `max_results` (可选) |

### MCP 客户端配置示例

在支持 MCP 的客户端（如 Claude Desktop）中添加如下配置：

```json
{
  "mcpServers": {
    "genshinlore": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### 同时提供网页服务

设置环境变量 `SERVE_STATIC=true`，同一个进程即可同时作为 MCP 服务器和静态网站服务器：

```bash
SERVE_STATIC=true npm start
```

此时访问 `http://localhost:3000/` 即可浏览网站，`/mcp` 端点继续处理 MCP 请求。

### 部署到云平台（Railway / Render / Fly.io）

由于服务器是标准的 HTTP 服务，可以直接部署到各类云平台。以 Railway 为例：

1. 在 Railway 创建新项目，连接 GitHub 仓库
2. **Root Directory 保持为仓库根目录**（因为 MCP 服务器需要读取上级目录的 `md/` 和 `basiclore/`）
3. 设置构建与启动命令：
   - **Build Command**: `cd mcp-server && npm install`
   - **Start Command**: `cd mcp-server && npm start`
4. 如需同时提供网页服务，添加环境变量 `SERVE_STATIC=true`
5. `PORT` 环境变量由平台自动注入，无需手动配置
6. 部署后，MCP 端点地址为 `https://<your-app>.up.railway.app/mcp`

客户端配置示例（远程部署）：

```json
{
  "mcpServers": {
    "genshinlore": {
      "url": "https://<your-app>.up.railway.app/mcp"
    }
  }
}
```

## 项目结构
```
<!-- TREE-START -->
.
├── .github
│   └── workflows
│       └── main.yml
├── basiclore
│   ├── descenders
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
│   │   └── base.html
│   ├── Natlan
│   │   ├── base.html
│   │   └── content.js
│   ├── Snezhnaya
│   │   ├── base.html
│   │   └── content.js
│   └── Sumeru
│       ├── base.html
│       └── content.js
├── img (115 files)
├── md
│   ├── Fontaine.md
│   ├── Inazuma.md
│   ├── Khaenriah.md
│   ├── Liyue.md
│   ├── Natlan.md
│   ├── Snezhnaya.md
│   ├── Sumeru.md
│   ├── Teyvathis.md
│   ├── aboutsite.md
│   └── somewords.md
├── .gitignore
├── 404.html
├── BingSiteAuth.xml
├── LICENCE.md
├── README.md
├── Teyvathis.html
├── _headers
├── about.html
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
