# 项目贡献说明

## 项目文件结构

```
GenshinLore/
├── .github/
│   └── workflows/
│       └── main.yml     # 自动构建README中的文件树
├── basiclore/           # “基本设定”页面的子页面内容
│   ├── descenders/      # 降临者
│   │   └── base.html
│   ├── elementusage/    # 提瓦特常见元素力的使用者
│   │   └── base.html
│   ├── facilities/      # 大地及装置
│   │   └── base.html
│   ├── god/
│   │   └── base.html    # 魔神
│   ├── lightrelam/
│   │   └── base.html    # 龙/龙蜥/光界
│   ├── principles/
│   │   └── base.html    # 天理/人界
│   ├── stars/
│   │   └── base.html    # 星空
│   └── void/
│       └── base.html    # 深渊/虚界
├── docimg/
│   ├── icon.png         # 网站图标（白）
│   └── icondark.png     # 网站图标（黑）
├── fonts/               # 字体
│   ├── common.woff2     # Noto Sans SC（此文件仅作备用，目前已经修改为从Google的api加载子集化字体）
│   ├── genshin.woff2    # 汉仪文黑85W（原神默认字体）
│   └── Khaenriah.woff2  # 坎瑞亚风格字体
├── his/                 # 各国历史子页面
│   ├── Fontaine/        # 枫丹
│   │   ├── base.html    # 主页面
│   │   └── content.js   # 用于向主页面写入内容
│   ├── Inazuma/         # 稲妻
│   │   ├── base.html
│   │   └── content.js
│   ├── Khaenriah/       # 坎瑞亚
│   │   ├── base.html
│   │   └── content.js
│   ├── Liyue/           # 璃月
│   │   ├── base.html
│   │   └── content.js
│   ├── Mondstadt/       # 蒙德
│   │   ├── base.html
│   │   └── content.js
│   ├── Natlan/          # 纳塔
│   │   ├── base.html
│   │   └── content.js
│   ├── Snezhnaya/       # 至冬
│   │   ├── base.html
│   │   └── content.js
│   └── Sumeru/          # 须弥
│       ├── base.html
│       └── content.js
├── img/                 # 全站图片
│   ├── context/ (150 files)# 主段落内容插图；章首一、二级标题处的背景图
│   ├── country/ (14 files)# “各国历史”导航页图片
│   ├── logo/ (15 files) # 全站的图标，包括手册图标、favicon、“关于本站”页面的鸣谢图片、原神各国图标（已弃用）
│   └── others/ (4 files)# 404页面图片（虽然实际页面是内嵌的base64）、诗漱的头像等
├── Linear/              # “原神剧情线性观看顺序”页面
│   ├── base.html        # 主页面
│   └── marker.js        # 用于标记任务完成状态
├── md/                  # markdown源文件
│   ├── about.md         # “关于手册”页面
│   ├── aboutsite.md     # “关于本站”页面（不影响实际网页）
│   ├── Fontaine.md      # 枫丹页面
│   ├── Inazuma.md       # 稲妻页面
│   ├── Khaenriah.md     # 坎瑞亚页面
│   ├── Liyue.md         # 璃月页面
│   ├── main.md          # 主页部分鸣谢名单（不影响实际网页）
│   ├── Mondstadt.md     # 蒙德页面
│   ├── Natlan.md        # 纳塔页面
│   ├── preface.md       # 前言页面（不影响实际网页）
│   ├── Snezhnaya.md     # 至冬页面
│   ├── somewords.md     # 杂谈页面（不影响实际网页）
│   ├── Sumeru.md        # 须弥页面
│   └── Teyvathis.md     # 提瓦特历史页面
├── .gitignore           
├── 404.html             # 404页面
├── about.html           # “关于手册”页面
├── aboutcontent.js      # 用于向“关于手册”页面写入内容
├── aboutsite.html       # “关于本站”页面
├── basiclore.html       # “基本设定”导航页
├── BingSiteAuth.xml     
├── contentteyvat.js     # 用于向“提瓦特历史”页面写入内容
├── genshinbasichis.html # “时间线”页面
├── history-country.html # “各国历史”导航页
├── index.html           # 开屏页
├── interestfacts.html   # 彩蛋页
├── interestfacts.json   # 彩蛋页数据
├── LICENCE.md           
├── main.html            # 主页
├── md.html              # markdown源文件提供页面
├── mermaid.min.js       # mermaid渲染器
├── notice.js            # 公告模块
├── notice.json          # 公告模块数据
├── preface.html         # 前言页面
├── README.md            
├── script-index.js      # 开屏页脚本
├── script.js            # 全站脚本
├── sitemap.xml
├── somewords.html       # 杂谈页面
├── styles-index.css     # 开屏页样式
├── styles.css           # 全站样式
├── Teyvathis.html       # 提瓦特历史页面
├── useragreement.js     # 用户协议模块
├── useragreementversion.json# 用户协议模块数据
├── Via_7.0.0.zip        # 自用，借一下cloudflare服务器不过分吧
└── watermarkDiv.js      # “时间线”页面和“原神剧情线性观看顺序”页面水印模块
```