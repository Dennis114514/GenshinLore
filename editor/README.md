# GenshinLore Editor

独立在线编辑器工程，技术栈：
- Vue 3 + TypeScript
- Tiptap
- Arco Design
- Module Federation（从文档站共享 widgets 与样式）

## 开发启动（docs:dev 直接可访问 /editor）

在仓库根目录执行：

```bash
npm install
npm run docs:dev
```

这会同时启动：
- VitePress 开发服务（docs）
- editor 开发服务（端口 5174）
- `/editor` 路由由 docs dev 代理到 editor dev

## 推荐发布流程（同域 /editor 路由）

在仓库根目录执行：

```bash
npm run editor:bundle
npm run docs:build
npm run docs:preview
```

这会把 `editor/dist` 发布到 `docs/public/editor/`，最终访问路径为：
- `http://localhost:4173/editor/`
- 远程共享入口同域加载：`/assets/editorRemoteEntry.js`

## 清理发布产物

```bash
npm run editor:clean
```

## 可选：自定义 remote 地址

```bash
VITE_DOCS_REMOTE=http://localhost:4173/assets/editorRemoteEntry.js npm run dev
```

Windows PowerShell:

```powershell
$env:VITE_DOCS_REMOTE='http://localhost:4173/assets/editorRemoteEntry.js'; npm run dev
```
