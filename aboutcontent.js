/**
 * Copyright (C) 2026 GenshinLore Website & Dennis114514 & other contributors
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * See LICENSE.md file in the project root for full license information.
 */

/**
 * 关于页面内容加载与渲染模块
 * 负责从 Markdown 文件加载"关于手册"页面的内容，
 * 解析脚注、表格、标题层级，并生成目录导航
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Markdown 文件路径
     * 指向关于页面的 Markdown 源文件
     */
    const mdPath = 'md/about.md';

    /**
     * 内容容器元素
     * 用于承载解析后的 Markdown 内容
     */
    const containerEl = document.getElementById('about-content');

    /**
     * 目录列表容器元素
     * 用于渲染页面侧边栏的目录导航
     */
    const tocList = document.getElementById('toc-list');

    /**
     * 异步加载 Markdown 文件内容
     * 通过 fetch 请求获取 Markdown 文件，失败时返回空字符串
     * @returns {Promise<string>} Markdown 文本内容，加载失败返回空字符串
     */
    async function loadMarkdown() {
        try {
            const response = await fetch(mdPath);
            if (!response.ok) throw new Error(`Failed to load ${mdPath}`);
            return await response.text();
        } catch (error) {
            console.error('Markdown load failed:', error);
            return '';
        }
    }

    /**
     * 行内文本标准化函数
     * 将 Markdown 行内格式转换为 HTML，并处理特殊标记。
     * 使用 Unicode 私有区域字符作为临时分隔符保护特殊语法，
     * 先保护后转义，最后还原为 HTML 标签。
     * @param {string} raw - 原始文本（可能包含 Markdown 语法）
     * @returns {string} - 转换后的 HTML 字符串
     */
    function normalizeInline(raw) {
        let s = raw ?? '';
        /** Unicode 私有区域分隔符：图片 alt 文本 */
        const DELIM_ALT = '\uE001';
        /** Unicode 私有区域分隔符：链接文本 */
        const DELIM_LINK = '\uE002';
        
        /** 预处理：移除回车符 */
        s = s.replaceAll(/\r/g, '');
        /** 保护 HTML 换行标签，用占位符替换 */
        s = s.replaceAll(/<br\s*\/?>/gi, '[[[BR]]]');
        /** 保护 HTML 上标标签 */
        s = s.replaceAll(/<sup>\s*(\d+)\s*<\/sup>/gi, '[[[SUP:$1]]]');
        /** 保护 HTML 下标标签 */
        s = s.replaceAll(/<sub>\s*(\d+)\s*<\/sub>/gi, '[[[SUB:$1]]]');
        
        /** 保护 Markdown 图片格式（排除特殊背景标记 Introbg/Imagebg） */
        s = s.replaceAll(/!\[(?!Introbg[01]|Imagebg)([^\]]*?)\]\(([^)]*)\)/gi,
            (_, alt, src) => `[[[MDIMG:${src + DELIM_ALT + alt}]]]`);
        /** 保护 [Image](...) 格式的图片引用（必须在链接保护之前） */
        s = s.replaceAll(/\[Image\]\s*\(\s*["']([^"']+)["']\s*\)/gi, '[[[IMG:$1]]]');
        /** 保护 Markdown 链接格式 */
        s = s.replaceAll(/\[([^\]]*?)\]\(([^)]*)\)/gi,
            (_, text, url) => `[[[LINK:${url + DELIM_LINK + text}]]]`);
        
        /** Markdown 格式化：双星号 -> 红色高亮文字 */
        s = s.replaceAll(/\*\*([^*]+?)\*\*/g, '<span style="color:red;">$1</span>');
        /** Markdown 格式化：单星号 -> 加粗 */
        s = s.replaceAll(/(^|[^*])\*([^*]+?)\*(?!\*)/g, '$1<strong>$2</strong>');
        /** Markdown 格式化：双波浪线 -> 删除线 */
        s = s.replaceAll(/~~([^~~]+?)~~/g, '<del>$1</del>');

        /** 还原占位符，生成最终 HTML */
        s = s
            .replaceAll('[[[BR]]]', '<br/>')
            .replaceAll(/\[\[\[SUP:(\d+)\]\]\]/g, '<sup>$1</sup>')
            .replaceAll(/\[\[\[SUB:(\d+)\]\]\]/g, '<sub>$1</sub>')
            .replaceAll(/\[\[\[MDIMG:([^\]]+)\]\]\]/g, (match, data) => {
                const idx = data.indexOf(DELIM_ALT);
                const src = idx >= 0 ? data.slice(0, idx) : data;
                const alt = idx >= 0 ? data.slice(idx + 1) : '';
                let fixedSrc = src.replaceAll('\\', '/').replace(/^\/?\.\.\//, '');
                return `<img src="${fixedSrc}" alt="${alt}" style="display:block;margin:0 auto 8px;max-width:100%;height:auto;"><p class="image-caption" style="text-align:center;">${alt}</p>`;
            })
            .replaceAll(/\[\[\[LINK:([^\]]+)\]\]\]/g, (match, data) => {
                const idx = data.indexOf(DELIM_LINK);
                const url = idx >= 0 ? data.slice(0, idx) : '';
                const text = idx >= 0 ? data.slice(idx + 1) : data;
                return `<a href="${url}" target="_blank" class="custom-link">${text}</a>`;
            })
            .replaceAll(/\[\[\[IMG:([^\]]+)\]\]\]/g, (match, src) => {
                let fixedSrc = src.replaceAll('\\', '/').replace(/^\/?\.\.\//, '');
                return `<img src="${fixedSrc}" alt="image" style="display:block;margin:0 auto 8px;max-width:100%;height:auto;">`;
            });

        return s;
    }

    /**
     * 解析脚注引用
     * 从 Markdown 文本中提取以 `>` 开头的脚注行，
     * 将脚注编号映射到对应的 HTML 内容
     * @param {string} markdown - 包含脚注的 Markdown 文本
     * @returns {Record<string, string>} 脚注编号到 HTML 内容的映射表
     */
    function parseFootnotes(markdown) {
        /** 按行分割 Markdown 文本 */
        const lines = markdown.split('\n');
        /** 脚注映射表：编号 -> HTML 内容 */
        const map = {};
        /** 当前正在解析的脚注编号 */
        let currentKey = null;

        for (const raw of lines) {
            const line = (raw || '').trim();
            /** 跳过非引用行 */
            if (!line.startsWith('>')) continue;

            /** 匹配脚注编号行：`> 1 内容` */
            const m = line.match(/^>\s*(\d+)\s+(.*)$/);
            if (m) {
                currentKey = m[1];
                map[currentKey] = normalizeInline(m[2].trim());
                continue;
            }

            /** 续行：多行脚注内容的拼接 */
            const cont = line.replace(/^>\s*/, '').trim();
            if (currentKey && cont) {
                map[currentKey] = (map[currentKey] || '') + '<br/>' + normalizeInline(cont);
            }
        }
        return map;
    }

    /**
     * 注入脚注提示函数
     * 将 HTML 中的 `<sup>`/`<sub>` 标签替换为带 tooltip 的脚注引用，
     * 鼠标悬停时显示脚注内容
     * @param {string} html - 待处理的 HTML 字符串
     * @param {Record<string, string>} footnoteMap - 脚注映射表
     * @returns {string} - 注入 tooltip 后的 HTML 字符串
     */
    function injectFootnoteTooltips(html, footnoteMap) {
        /** 替换回调：将数字编号替换为带 tooltip 的 span */
        const replacer = (_, n) => {
            const key = String(n);
            const tip = footnoteMap[key] || '';
            return `<span class="has-footnote"><sup>*</sup><span class="tooltip">${tip}</span></span>`;
        };
        return html
            .replaceAll(/<sup>\s*(\d+)\s*<\/sup>/g, replacer)
            .replaceAll(/<sub>\s*(\d+)\s*<\/sub>/g, replacer);
    }

    /**
     * 分割表格行函数
     * 将 Markdown 表格行按 `|` 分割为单元格数组，
     * 去除首尾的管道符
     * @param {string} rowLine - 表格行字符串（如 `| A | B | C |`）
     * @returns {string[]} - 单元格内容数组
     */
    function splitRow(rowLine) {
        const trimmed = rowLine.trim();
        /** 去除首尾的 `|`，再按 `|` 分割 */
        const core = trimmed.replace(/^\|/, '').replace(/\|$/, '');
        return core.split('|').map(c => (c ?? '').trim());
    }

    /**
     * 判断是否为空白单元格
     * 用于表格单元格合并逻辑，判断单元格是否应被合并。
     * 严格匹配：只有内容恰好是 `<br />` 的单元格视为有内容，不合并。
     * @param {string} cell - 单元格内容
     * @returns {boolean} - 是否为空白单元格
     */
    function isBlankCell(cell) {
        const t = (cell ?? '').trim();
        /** 只有 `<br />`（带空格）视为有内容，其余空白形式均视为空 */
        if (t === '<br />') return false;
        return t === '' || t === '<br/>' || t === '<br>' || t === '&nbsp;' || t === '&#160;' || t === '—';
    }

    /**
     * 渲染表格函数
     * 将 Markdown 表格块转换为 HTML 表格，支持单元格合并。
     * 合并规则：从有内容的单元格开始，向右合并连续的空白单元格（横向合并），
     * 再向下合并连续的空白单元格（纵向合并）。
     * @param {string[]} blockLines - 表格行数组（包含表头和分隔行）
     * @param {Record<string, string>} footnoteMap - 脚注映射表
     * @returns {HTMLElement|null} - 表格容器元素或 null
     */
    function renderTable(blockLines, footnoteMap) {
        if (blockLines.length < 1) return null;

        /** 解析表头行 */
        const headerCells = splitRow(blockLines[0]);
        /** 表体起始行索引，跳过表头行 */
        let bodyStart = 1;
        /** 识别分隔行（包含 `---` 的行，如 `|---|---|---|`） */
        if (blockLines.length > 1 && blockLines[1].includes('---')) bodyStart = 2;

        /** 表体行数组 */
        const bodyLines = blockLines.slice(bodyStart);
        /** 解析所有表体单元格 */
        const bodyCells = bodyLines.map(splitRow);
        /** 计算最大列数（取表头和表体列数的最大值） */
        const colCount = Math.max(headerCells.length, ...bodyCells.map(r => r.length));

        /** 补齐列数：确保每行列数一致 */
        while (headerCells.length < colCount) headerCells.push('');
        for (const r of bodyCells) while (r.length < colCount) r.push('');

        /**
         * 初始化合并信息矩阵
         * @type {Array<Array<{text:string, rowspan:number, colspan:number, skip:boolean}>>}
         */
        const mergedBody = bodyCells.map(row => row.map(text => ({ 
            text,       /** 单元格内容 */
            rowspan: 1, /** 纵向合并行数 */
            colspan: 1, /** 横向合并列数 */
            skip: false /** 是否跳过（已被合并） */
        })));

        /** 阶段一：横向合并（从有内容的单元格开始，向右合并空白单元格） */
        for (let r = 0; r < mergedBody.length; r++) {
            for (let c = 0; c < colCount; c++) {
                /** 跳过已被合并的单元格 */
                if (mergedBody[r][c].skip) continue;
                
                if (!isBlankCell(mergedBody[r][c].text)) {
                    /** 计算该单元格能向右延伸多少列（右方必须是空白单元格） */
                    let maxColspan = 1;
                    for (let c2 = c + 1; c2 < colCount; c2++) {
                        if (isBlankCell(mergedBody[r][c2].text) && !mergedBody[r][c2].skip) {
                            maxColspan++;
                        } else {
                            break;
                        }
                    }
                    
                    if (maxColspan > 1) {
                        mergedBody[r][c].colspan = maxColspan;
                        /** 标记被横向合并的单元格（防止后续被纵向合并） */
                        for (let c2 = c + 1; c2 < c + maxColspan; c2++) {
                            mergedBody[r][c2].skip = true;
                        }
                    }
                }
            }
        }
        
        /** 阶段二：纵向合并（从有内容的单元格开始，向下合并空白单元格） */
        for (let c = 0; c < colCount; c++) {
            for (let r = 0; r < mergedBody.length; r++) {
                /** 跳过已被合并的单元格 */
                if (mergedBody[r][c].skip) continue;
                
                if (!isBlankCell(mergedBody[r][c].text)) {
                    /** 计算该单元格能向下延伸多少行（下方必须是空白单元格且未被横向合并标记） */
                    let maxRowspan = 1;
                    for (let r2 = r + 1; r2 < mergedBody.length; r2++) {
                        if (mergedBody[r2][c].skip) continue;
                        if (isBlankCell(mergedBody[r2][c].text)) maxRowspan++;
                        else break;
                    }
                    if (maxRowspan > 1) {
                        mergedBody[r][c].rowspan = maxRowspan;
                        /** 标记被纵向合并的单元格 */
                        for (let r2 = r + 1; r2 < r + maxRowspan; r2++) mergedBody[r2][c].skip = true;
                    }
                }
            }
        }

        /** 创建 HTML 表格元素 */
        const table = document.createElement('table');
        table.className = 'common-table';

        /** 渲染表头：仅当表头包含非空白内容时输出 thead */
        const hasHeaderContent = headerCells.some(cell => !isBlankCell(cell));
        if (hasHeaderContent) {
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            for (let c = 0; c < colCount; c++) {
                const th = document.createElement('th');
                th.innerHTML = injectFootnoteTooltips(normalizeInline(headerCells[c]), footnoteMap) || '';
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }

        /** 渲染表体 */
        const tbody = document.createElement('tbody');
        for (let r = 0; r < mergedBody.length; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c < colCount; c++) {
                /** 跳过已被合并的单元格 */
                if (mergedBody[r][c].skip) continue;

                const td = document.createElement('td');
                /** 第一列添加左对齐样式 */
                if (c === 0) td.classList.add('text-left');
                const rs = mergedBody[r][c].rowspan;
                const cs = mergedBody[r][c].colspan;
                /** 设置 rowspan 和 colspan 属性 */
                if (rs > 1) td.rowSpan = rs;
                if (cs > 1) td.colSpan = cs;

                td.innerHTML = injectFootnoteTooltips(normalizeInline(mergedBody[r][c].text), footnoteMap) || '';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        /** 包裹在滚动容器中以支持水平滚动 */
        const wrapper = document.createElement('div');
        wrapper.className = 'table-container';
        wrapper.appendChild(table);
        return wrapper;
    }

    /**
     * 构建目录导航
     * 根据解析出的标题列表生成侧边栏目录，仅显示 1-4 级标题。
     * 为每个目录项绑定点击平滑滚动事件，并高亮当前激活项。
     * @param {Array<{id:string, text:string, level:number}>} tocItems - 目录项数组
     */
    function buildToc(tocItems) {
        /** 清空现有目录 */
        tocList.innerHTML = '';
        /** 过滤并渲染 1-4 级标题 */
        tocItems.filter(item => item.level <= 4).forEach(item => {
            const li = document.createElement('li');
            li.className = 'toc-item';
            const a = document.createElement('a');
            a.href = '#' + item.id;
            a.className = 'toc-link level-' + item.level;
            a.style.color = '#4d4f53';
            a.style.textDecoration = 'none';
            /** 根据层级调整左边距 */
            a.style.paddingLeft = ((item.level - 1) * 15) + 'px';
            a.innerHTML = item.text;
            
            /** 点击目录项时平滑滚动到目标位置 */
            a.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (!targetEl) return;
                /** 顶栏高度补偿 */
                const topbarHeight = 70;
                const rect = targetEl.getBoundingClientRect();
                const targetPosition = window.scrollY + rect.top - topbarHeight - 16;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                
                /** 高亮当前激活的目录项 */
                document.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });
    }

    /**
     * 解析 Markdown 章节内容
     * 将 Markdown 文本按行解析为 DOM 元素，支持多级标题、时间线、
     * 引用块、表格、代码块、特殊图片块等多种内容类型。
     * @param {string} content - 要解析的 Markdown 内容
     * @param {Record<string, string>} footnoteMap - 脚注映射表
     * @param {Array<{id:string, text:string, level:number}>} tocItems - 目录项数组（会被修改）
     * @param {number} [tocLevelOffset=0] - 目录层级偏移量（1=后记，2=附赠册）
     * @param {boolean} [isTimeline=false] - 是否处于时间线模式
     * @returns {HTMLElement} - 包含解析后内容的容器元素
     */
    function parseSection(content, footnoteMap, tocItems, tocLevelOffset = 0, isTimeline = false) {
        /** 按行分割内容，统一换行符 */
        const lines = content.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
        /** 顶层容器 */
        const container = document.createElement('div');
        /** 当前内容挂载节点（随标题层级变化） */
        let currentSection = container;
        /** 时间线容器（仅在 <timeline> 块内使用） */
        let timelineContainer = null;
        /** 当前行索引 */
        let i = 0;
        /** 各级标题计数器 */
        let h1Count = 0, h2Count = 0, h3Count = 0, h4Count = 0;

        /**
         * 生成章节 ID
         * 根据标题层级和当前计数器生成唯一锚点 ID
         * @param {number} level - 标题层级（1-5）
         * @returns {string} 唯一 ID 字符串
         */
        function makeId(level) {
            if (level === 1) return `sec-${tocLevelOffset}-${h1Count}`;
            if (level === 2) return `sec-${tocLevelOffset}-${h1Count}-${h2Count}`;
            if (level === 3) return `sec-${tocLevelOffset}-${h1Count}-${h2Count}-${h3Count}`;
            if (level === 4) return `sec-${tocLevelOffset}-${h1Count}-${h2Count}-${h3Count}-${h4Count}`;
            return `sec-${tocLevelOffset}-${h1Count}-${h2Count}-${h3Count}-${h4Count}-5`;
        }

        while (i < lines.length) {
            const rawLine = lines[i] || '';
            const line = rawLine.trimEnd();
            const trimmed = line.trim();

            /** 跳过空行 */
            if (!trimmed) { i++; continue; }

            /** 一级标题（#）：编者注标题 */
            if (trimmed.startsWith('# ')) {
                h1Count++; h2Count = 0; h3Count = 0; h4Count = 0;
                const text = trimmed.slice(2).trim();
                const id = makeId(1);
                const h2 = document.createElement('h2');
                h2.id = id;
                h2.className = 'section-title editor-note-title';
                h2.style.margin = '40px 0 30px 0';
                h2.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                container.appendChild(h2);
                /** 添加到目录（去除 HTML 标签） */
                tocItems.push({ id, text: text.replace(/<sup>[\s\S]*?<\/sup>/gi, '').replace(/<sub>[\s\S]*?<\/sub>/gi, '').replace(/<[^>]+>/g, ''), level: 1 });
                i++;
                continue;
            }
            /** 二级标题（##）：时间线时期标题 */
            if (trimmed.startsWith('## ')) {
                h2Count++; h3Count = 0; h4Count = 0;
                const text = trimmed.slice(3).trim();
                const id = makeId(2);
                const wrapper = document.createElement('div');
                /** 根据 tocLevelOffset 区分 booklet 和 editor-note 样式 */
                wrapper.className = tocLevelOffset === 2 ? 'booklet-section' : 'editor-note-section';
                const h2 = document.createElement('h2');
                h2.id = id;
                h2.className = 'timeline-period';
                h2.style.fontSize = '2em';
                h2.style.margin = '40px 0 30px 0';
                h2.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                wrapper.appendChild(h2);
                container.appendChild(wrapper);
                currentSection = wrapper;
                tocItems.push({ id, text: text.replace(/<sup>[\s\S]*?<\/sup>/gi, '').replace(/<sub>[\s\S]*?<\/sub>/gi, '').replace(/<[^>]+>/g, ''), level: 2 });
                i++;
                continue;
            }
            /** 三级标题（###）：时间线主标题 */
            if (trimmed.startsWith('### ')) {
                h3Count++; h4Count = 0;
                const text = trimmed.slice(4).trim();
                const id = makeId(3);
                
                if (tocLevelOffset === 2) {
                    /** booklet 中三级标题视为独立 section，包裹在 timeline-section 中 */
                    const sectionWrapper = document.createElement('div');
                    sectionWrapper.className = 'timeline-section';
                    const h3 = document.createElement('h3');
                    h3.id = id;
                    h3.className = 'timeline-period';
                    h3.style.margin = '40px 0 30px 0';
                    h3.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                    sectionWrapper.appendChild(h3);
                    container.appendChild(sectionWrapper);
                    currentSection = sectionWrapper;
                } else {
                    const h3 = document.createElement('h3');
                    h3.id = id;
                    h3.className = 'timeline-main-title';
                    h3.style.fontSize = '1.5em';
                    h3.style.margin = '40px 0 30px 0';
                    h3.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                    currentSection.appendChild(h3);
                }
                
                tocItems.push({ id, text: text.replace(/<sup>[\s\S]*?<\/sup>/gi, '').replace(/<sub>[\s\S]*?<\/sub>/gi, '').replace(/<[^>]+>/g, ''), level: 3 });
                i++;
                continue;
            }
            /** 四级标题（####）：时间线条目 */
            if (trimmed.startsWith('#### ')) {
                h4Count++;
                const text = trimmed.slice(5).trim();
                const id = makeId(4);
                
                if (isTimeline) {
                    /** 时间线模式：创建 timeline-item 容器 */
                    const item = document.createElement('div');
                    item.className = 'timeline-item';
                    const h4 = document.createElement('h4');
                    h4.id = id;
                    h4.className = 'timeline-main-title';
                    h4.style.fontSize = '1.25em';
                    h4.style.margin = '40px 0 30px 0';
                    h4.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                    item.appendChild(h4);
                    
                    /** 如果尚未创建时间线容器，则创建之 */
                    if (!timelineContainer) {
                        timelineContainer = document.createElement('div');
                        timelineContainer.className = 'timeline-container';
                        currentSection.appendChild(timelineContainer);
                    }
                    timelineContainer.appendChild(item);
                    currentSection = item;
                } else {
                    const h4 = document.createElement('h4');
                    h4.id = id;
                    h4.className = 'timeline-main-title';
                    h4.style.fontSize = '1em';
                    h4.style.margin = '40px 0 30px 0';
                    h4.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                    currentSection.appendChild(h4);
                }
                tocItems.push({ id, text: text.replace(/<sup>[\s\S]*?<\/sup>/gi, '').replace(/<sub>[\s\S]*?<\/sub>/gi, '').replace(/<[^>]+>/g, ''), level: 4 });
                i++;
                continue;
            }
            /** 五级标题（#####）：时间线副标题 */
            if (trimmed.startsWith('##### ')) {
                const text = trimmed.slice(6).trim();
                const id = makeId(5);
                
                const h5 = document.createElement('h5');
                h5.id = id;
                h5.className = 'timeline-subtitle';
                h5.style.fontSize = '1em';
                h5.style.margin = '40px 0 30px 0';
                h5.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                currentSection.appendChild(h5);
                
                tocItems.push({ id, text: text.replace(/<sup>[\s\S]*?<\/sup>/gi, '').replace(/<sub>[\s\S]*?<\/sub>/gi, '').replace(/<[^>]+>/g, ''), level: 5 });
                i++;
                continue;
            }

            /** 时间线块开始标记：<timeline> */
            if (trimmed === '<timeline>') {
                isTimeline = true;
                timelineContainer = document.createElement('div');
                timelineContainer.className = 'timeline-container';
                currentSection.appendChild(timelineContainer);
                /** 将当前节点切换到时间线容器内 */
                currentSection = timelineContainer;
                i++;
                continue;
            }
            /** 时间线块结束标记：</timeline> */
            if (trimmed === '</timeline>') {
                isTimeline = false;
                /** 恢复到父级 section */
                currentSection = currentSection.parentElement;
                if (currentSection.className === 'timeline-container') currentSection = currentSection.parentElement;
                i++;
                continue;
            }

            /** 折叠详情块：<details> */
            if (trimmed.startsWith('<details>')) {
                const details = document.createElement('details');
                let summary = document.createElement('summary');
                summary.textContent = '展开';
                details.appendChild(summary);
                const contentDiv = document.createElement('div');
                details.appendChild(contentDiv);
                currentSection.appendChild(details);
                
                /** 切换到 details 内容区域 */
                currentSection = contentDiv;
                i++;
                continue;
            }
            /** 折叠详情块结束：</details> */
            if (trimmed.startsWith('</details>')) {
                currentSection = currentSection.parentElement.parentElement;
                i++;
                continue;
            }
            /** 跳过 <summary> 和 </summary>（已在 details 中处理） */
            if (trimmed.startsWith('<summary>')) { i++; continue; }
            if (trimmed.startsWith('</summary>')) { i++; continue; }

            /** 引用块：以 `>` 开头的连续行 */
            if (trimmed.startsWith('>')) {
                const q = [];
                while (i < lines.length && ((lines[i] || '').trim().startsWith('>'))) {
                    q.push(lines[i] || '');
                    i++;
                }
                const block = document.createElement('div');
                block.className = 'secondary-text';
                /** 去除 `> ` 前缀，过滤空行 */
                const cleaned = q.map(l => l.replace(/^>\s?/, '').trimEnd()).filter(l => l.trim().length > 0);
                block.innerHTML = cleaned.map(l => `<p>${injectFootnoteTooltips(normalizeInline(l), footnoteMap)}</p>`).join('');
                currentSection.appendChild(block);
                continue;
            }

            /** 表格：以 `|` 开头且包含 `|` 的连续行 */
            if (trimmed.startsWith('|') && trimmed.includes('|')) {
                const block = [];
                while (i < lines.length && (lines[i] || '').trim().startsWith('|') && (lines[i] || '').trim().includes('|')) {
                    block.push(lines[i] || '');
                    i++;
                }
                const tableEl = renderTable(block, footnoteMap);
                if (tableEl) currentSection.appendChild(tableEl);
                continue;
            }

            /** 参考资料块：`!!!` 包围的内容 */
            if (trimmed === '!!!') {
                i++;
                const blockLines = [];
                while (i < lines.length && (lines[i] || '').trim() !== '!!!') {
                    blockLines.push((lines[i] || '').trimEnd());
                    i++;
                }
                i++;
                const div = document.createElement('div');
                div.className = 'second-text';
                const innerHTML = blockLines.map(l => normalizeInline(l)).join('<br/>');
                div.innerHTML = `<p style="font-size:115%;margin:0 0 6px;font-weight:bold;">参考资料</p><p>${innerHTML}</p>`;
                currentSection.appendChild(div);
                continue;
            }

            /** 编者的话块：`:::` 包围的内容 */
            if (trimmed === ':::') {
                i++;
                const blockLines = [];
                while (i < lines.length && (lines[i] || '').trim() !== ':::') {
                    blockLines.push((lines[i] || '').trimEnd());
                    i++;
                }
                i++;
                const div = document.createElement('div');
                div.className = 'second-text';
                const innerHTML = blockLines.map(l => normalizeInline(l)).join('<br/>');
                div.innerHTML = `<p style="font-size:115%;margin:0 0 6px;font-weight:bold;">编者的话</p><p>${innerHTML}</p>`;
                currentSection.appendChild(div);
                continue;
            }

            /** 特殊背景图片块：!Introbg0/!Introbg1 配对 */
            if (/^!\[Introbg0\]/i.test(trimmed)) {
                const m0 = trimmed.match(/^!\[Introbg0\]\(([^)]*)\)/i);
                const bg0Path = m0 ? m0[1] : '';
                i++;
                const blockContent = [];
                let bg1Path = '';
                /** 收集直到 !Introbg1 的所有内容 */
                while (i < lines.length && !/^!\[Introbg1\]/i.test((lines[i] || '').trim())) {
                    blockContent.push(lines[i] || '');
                    i++;
                }
                if (i < lines.length) {
                    const m1 = (lines[i] || '').trim().match(/^!\[Introbg1\]\(([^)]*)\)/i);
                    bg1Path = m1 ? m1[1] : '';
                    i++;
                }
                const fixedBg0 = bg0Path.replace(/^\/?\.\.\//, '').replaceAll('\\', '/');
                const fixedBg1 = bg1Path.replace(/^\/?\.\.\//, '').replaceAll('\\', '/');
                const wrapper = document.createElement('div');
                wrapper.className = 'intro-bg';
                const contentHTML = blockContent
                    .filter(l => (l || '').trim())
                    .map(l => `<p class="common-paragraph">${injectFootnoteTooltips(normalizeInline(l.trimEnd()), footnoteMap)}</p>`).join('');
                wrapper.innerHTML = `<img class="bg-top" src="${fixedBg0}" alt="" style="width:100vw;max-width:none;margin-left:calc(50% - 50vw);"><div class="intro-content">${contentHTML}</div><img class="bg-bottom" src="${fixedBg1}" alt="" style="width:100vw;max-width:none;margin-left:calc(50% - 50vw);">`;
                currentSection.appendChild(wrapper);
                continue;
            }

            /** 背景图片 + 代码块：!Imagebg + 代码围栏 */
            if (/^!\[Imagebg\]/i.test(trimmed)) {
                const m = trimmed.match(/^!\[Imagebg\]\(([^)]*)\)/i);
                const imgPath = m ? m[1] : '';
                i++;
                /** 跳过空行 */
                while (i < lines.length && !(lines[i] || '').trim()) i++;
                if (i < lines.length && /^(?:\\`){3}/.test((lines[i] || '').trim())) {
                    i++;
                    const codeLines = [];
                    while (i < lines.length && !/^(?:\\`){3}/.test((lines[i] || '').trim())) {
                        codeLines.push(lines[i] || '');
                        i++;
                    }
                    i++;
                    const fixedSrc = imgPath.replace(/^\/?\.\.\//, '').replaceAll('\\', '/');
                    const div = document.createElement('div');
                    div.className = 'second-intro';
                    const codeHtml = codeLines.map(line => normalizeInline(line)).join('\n');
                    div.innerHTML = `<img class="bg-img" src="${fixedSrc}" alt="" style="max-width:100%;"><div class="intro-content"><pre style="font-family:Genshin, sans-serif; color:#4d4f53; font-size:2em; font-weight:bold; text-align:center; background:none; border:none;">${codeHtml}</pre></div>`;
                    currentSection.appendChild(div);
                }
                continue;
            }

            /** 代码围栏块：``` 包围的代码 */
            if (/^(?:\\`){3}/.test(trimmed)) {
                i++;
                const codeLines = [];
                while (i < lines.length && !/^(?:\\`){3}/.test((lines[i] || '').trim())) {
                    codeLines.push(lines[i] || '');
                    i++;
                }
                if (i < lines.length && /^(?:\\`){3}/.test((lines[i] || '').trim())) i++;
                const pre = document.createElement('pre');
                pre.className = 'code-block';
                pre.style.cssText = 'font-family:monospace; color:#4d4f53; font-size:0.9em; line-height:1.6; background:#f5f5f5; border:1px solid #ddd; border-radius:4px; padding:12px 16px; overflow-x:auto; margin:16px 0; white-space:pre-wrap; word-break:break-word;';
                pre.textContent = codeLines.join('\n');
                currentSection.appendChild(pre);
                continue;
            }

            /** 普通段落：其余内容均视为文本段落 */
            const p = document.createElement('p');
            p.className = 'common-paragraph';
            p.innerHTML = injectFootnoteTooltips(normalizeInline(trimmed), footnoteMap);
            currentSection.appendChild(p);
            i++;
        }

        return container;
    }

    /**
     * 主流程：加载 Markdown 并渲染页面
     * 1. 加载关于页面的 Markdown 文件
     * 2. 分离脚注和正文
     * 3. 提取 <postscript>（编者后记）和 <booklet>（附赠册）章节
     * 4. 分别解析并渲染到页面
     * 5. 构建目录导航
     */
    loadMarkdown().then(md => {
        if (!md) return;

        /** 提取脚注：从第一个 `\n> 1 ` 开始分离 */
        const footStart = md.indexOf('\n> 1 ');
        let mainContent = md;
        let footnoteMap = {};
        if (footStart !== -1) {
            mainContent = md.slice(0, footStart);
            const footnoteContent = md.slice(footStart);
            footnoteMap = parseFootnotes(footnoteContent);
        }

        /** 提取 <postscript> 和 <booklet> 章节 */
        const postscriptMatch = mainContent.match(/<postscript>([\s\S]*?)<\/postscript>/);
        const bookletMatch = mainContent.match(/<booklet>([\s\S]*?)<\/booklet>/);

        /** 目录项收集数组 */
        const tocItems = [];

        /** 渲染编者后记（tocLevelOffset=1） */
        if (postscriptMatch) {
            const postscriptDiv = document.createElement('div');
            postscriptDiv.className = 'main-text';
            const parsed = parseSection(postscriptMatch[1], footnoteMap, tocItems, 1);
            postscriptDiv.appendChild(parsed);
            containerEl.appendChild(postscriptDiv);
        }

        /** 渲染附赠册（tocLevelOffset=2） */
        if (bookletMatch) {
            const bookletDiv = document.createElement('div');
            bookletDiv.className = 'main-text';
            const parsed = parseSection(bookletMatch[1], footnoteMap, tocItems, 2);
            bookletDiv.appendChild(parsed);
            /** 插入到关于页面的内容容器中，确保继承页面内边距和样式 */
            if (containerEl) {
                containerEl.appendChild(bookletDiv);
            } else {
                const mainContent = document.querySelector('main.main-content');
                if (mainContent) {
                    mainContent.after(bookletDiv);
                } else {
                    document.body.appendChild(bookletDiv);
                }
            }
        }

        /** 构建并渲染目录导航 */
        buildToc(tocItems);
    });
});