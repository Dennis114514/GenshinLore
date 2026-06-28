/**
 * Copyright (C) 2026 GenshinLore Website & Dennis114514 & other contributors
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * See LICENSE.md file in the project root for full license information.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * 自定义链接样式元素
     * 创建一个style标签，定义.custom-link类的样式
     * 用于美化文档中的链接显示效果
     */
    const linkStyle = document.createElement('style');
    linkStyle.textContent = `.custom-link{color:#D3BC8E;text-decoration:none}.custom-link:hover{color:#B59A7E}`;
    document.head.appendChild(linkStyle);
    // Markdown 文件名与路径
    const mdFileName = (() => {
        const segments = window.location.pathname.split('/').filter(Boolean);
        const region = segments[segments.length - 2] || 'Sumeru';
        return `${decodeURIComponent(region)}.md`;
    })();
    const mdPath = `../../md/${mdFileName}`;

    async function loadMarkdown() {
        try {
            const response = await fetch(mdPath);
            if (!response.ok) throw new Error(`Failed to load ${mdPath}: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error('Markdown load failed:', error);
            return `# 加载失败\n\n无法从 ${mdPath} 读取内容。`;
        }
    }
    /**
     * 页面DOM元素引用
     * 获取页面中用于渲染内容的关键DOM节点
     */
    const pageTitleEl = document.getElementById('page-title');  // 页面标题元素
    const introEl = document.getElementById('timeline-intro');   // 引言内容区域
    const timelineEl = document.getElementById('timeline');     // 时间线主体区域
    const tocList = document.getElementById('toc-list');         // 目录列表容器

    /**
     * 模态框相关元素
     * 用于展示引文详情的弹窗组件
     */
    const modal = document.getElementById('modal');           // 模态框容器
    const modalBody = document.getElementById('modal-body');   // 模态框内容区域
    const closeModal = document.getElementById('close-modal'); // 关闭按钮

    /**
     * 打开模态框函数
     * @param {string} html - 要显示的HTML内容
     */
    function openModal(html) {
        modalBody.innerHTML = html;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-active'), 10);
    }

    /**
     * 关闭模态框函数
     * 带有淡出动画效果
     */
    function closeModalFunc() {
        modal.classList.remove('modal-active');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }

    // 绑定模态框关闭事件
    closeModal.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFunc(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModalFunc();
    });

    /**
     * HTML转义函数
     * 将特殊字符转换为HTML实体，防止XSS攻击
     * @param {string} text - 待转义的文本
     * @returns {string} - 转义后的文本
     */
    function escapeHtml(text) {
        return text

    }
    /**
     * 行内文本标准化函数
     * 将Markdown格式转换为HTML，并处理特殊标记
     * @param {string} raw - 原始文本
     * @returns {string} - 转换后的HTML字符串
     */
    function normalizeInline(raw) {
        let s = raw ?? '';
        // 使用Unicode私有区域字符作为临时分隔符
        const DELIM_ALT = '\uE001';   // 图片alt文本分隔符
        const DELIM_LINK = '\uE002';  // 链接文本分隔符
        
        // 预处理：移除回车符，保护特殊HTML标签
        s = s.replaceAll(/\r/g, '');
        s = s.replaceAll(/<br\s*\/?>/gi, '[[[BR]]]');
        s = s.replaceAll(/<sup>\s*(\d+)\s*<\/sup>/gi, '[[[SUP:$1]]]');
        s = s.replaceAll(/<sub>\s*(\d+)\s*<\/sub>/gi, '[[[SUB:$1]]]');
        
        // 保护Markdown图片格式（排除特殊标记）
        s = s.replaceAll(/!\[(?!Introbg[01]|Imagebg)([^\]]*?)\]\(([^)]*)\)/gi,
            (_, alt, src) => `[[[MDIMG:${src + DELIM_ALT + alt}]]]`);
        
        // 保护[Image](...)格式（必须在链接保护之前）
        s = s.replaceAll(/\[Image\]\s*\(\s*["']([^"']+)["']\s*\)/gi, '[[[IMG:$1]]]');
        
        // 保护Markdown链接格式
        s = s.replaceAll(/\[([^\]]*?)\]\(([^)]*)\)/gi,
            (_, text, url) => `[[[LINK:${url + DELIM_LINK + text}]]]`);
        
        // HTML转义
        s = escapeHtml(s);

        // Markdown格式化：加粗/删除线
        s = s.replaceAll(/\*\*([^*]+?)\*\*/g, '<span style="color:red;">$1</span>');  // 加粗
        s = s.replaceAll(/(^|[^*])\*([^*]+?)\*(?!\*)/g, '$1<strong>$2</strong>');      // 单星号也解析为加粗
        s = s.replaceAll(/~~([^~~]+?)~~/g, '<del>$1</del>');                           // 删除线

        // 还原允许的标签并生成最终HTML
        s = s
            .replaceAll('[[[BR]]]', '<br/>')
            .replaceAll(/\[\[\[SUP:(\d+)\]\]\]/g, '<sup>$1</sup>')
            .replaceAll(/\[\[\[SUB:(\d+)\]\]\]/g, '<sub>$1</sub>')
            .replaceAll(/\[\[\[MDIMG:([^\]]+)\]\]\]/g, (match, data) => {
                const idx = data.indexOf(DELIM_ALT);
                const src = idx >= 0 ? data.slice(0, idx) : data;
                const alt = idx >= 0 ? data.slice(idx + 1) : '';
                let fixedSrc = src.replaceAll('\\', '/').replace(/^\/?\.\.\//, '../../');
                return `<img src="${fixedSrc}" alt="${alt}" class="timeline-image-inline" style="display:block;margin:0 auto 8px;max-width:100%;height:auto;"><span class="image-caption">${alt}</span>`;
            })
            .replaceAll(/\[\[\[LINK:([^\]]+)\]\]\]/g, (match, data) => {
                const idx = data.indexOf(DELIM_LINK);
                const url = idx >= 0 ? data.slice(0, idx) : '';
                const text = idx >= 0 ? data.slice(idx + 1) : data;
                return `<a href="${url}" target="_blank" class="custom-link">${text}</a>`;
            })
            .replaceAll(/\[\[\[IMG:([^\]]+)\]\]\]/g, (match, src) => {
                let fixedSrc = src.replaceAll('\\', '/').replace(/^\/?\.\.\//, '../../');
                return `<img src="${fixedSrc}" alt="image" class="table-inline-image" style="display:block;margin:0 auto 8px;max-width:100%;height:auto;">`;
            });

        return s;
    }

            function parseFootnotes(lines) {
                /** @type {Record<string, string>} */
                const map = {};
                let currentKey = null;

                for (const raw of lines) {
                    const line = (raw || '').trim();
                    if (!line.startsWith('>')) continue;

                    const m = line.match(/^>\s*(\d+)\s+(.*)$/);
                    if (m) {
                        currentKey = m[1];
                        map[currentKey] = normalizeInline(m[2].trim());
                        continue;
                    }

                    const cont = line.replace(/^>\s*/, '').trim();
                    if (currentKey && cont) {
                        map[currentKey] = (map[currentKey] || '') + '<br/>' + normalizeInline(cont);
                    }
                }

                return map;
            }

    /**
     * 解析通用内容区块函数
     * 将<commoncontent>标签内的Markdown内容转换为DOM元素
     * @param {string} markdown - Markdown内容
     * @param {Record<string, string>} footnoteMap - 脚注映射表
     * @returns {HTMLElement} - 包含解析后内容的容器元素
     */
    function parseCommonContent(markdown, footnoteMap) {
        const allLines = markdown.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
        const container = document.createElement('div');
        container.className = 'commoncontent-container';
        container.style.cssText = 'padding:20px 0;max-width:800px;margin:0 auto;';

        let i = 0;
        
        /**
         * 判断是否为表格行
         * @param {string} line - 待判断的行
         * @returns {boolean} - 是否为表格行
         */
        function isTableLine(line) {
            const t = (line || '').trim();
            return t.startsWith('|') && t.includes('|');
        }

        while (i < allLines.length) {
            const rawLine = allLines[i] || '';
            const line = rawLine.trimEnd();
            const trimmed = line.trim();

            if (!trimmed) { i++; continue; }

            // 二级标题处理
            if (trimmed.startsWith('## ')) {
                const text = trimmed.slice(3).trim();
                if (!text) { i++; continue; }
                const h2 = document.createElement('h2');
                h2.style.cssText = 'font-size:1.5em;color:#D3BC8E;border-bottom:1px solid #8B7355;padding-bottom:8px;margin-top:32px;';
                h2.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                container.appendChild(h2);
                i++;
                continue;
            }

            // 三级标题处理
            if (trimmed.startsWith('### ')) {
                const text = trimmed.slice(4).trim();
                if (!text) { i++; continue; }
                const h3 = document.createElement('h3');
                h3.style.cssText = 'font-size:1.25em;color:#D3BC8E;margin-top:24px;';
                h3.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                container.appendChild(h3);
                i++;
                continue;
            }
            // 四级标题处理
            if (trimmed.startsWith('#### ')) {
                const text = trimmed.slice(5).trim();
                if (!text) { i++; continue; }
                const h4 = document.createElement('h4');
                h4.style.cssText = 'font-size:1em;color:#D3BC8E;margin-top:16px;';
                h4.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                container.appendChild(h4);
                i++;
                continue;
            }

            // 参考资料块：!!! ... !!!
            if (trimmed === '!!!') {
                i++;
                const blockLines = [];
                while (i < allLines.length && (allLines[i] || '').trim() !== '!!!') {
                    blockLines.push((allLines[i] || '').trimEnd());
                    i++;
                }
                i++;
                const div = document.createElement('div');
                div.className = 'second-text';
                const innerHTML = blockLines.map(l => normalizeInline(l)).join('<br/>');
                div.innerHTML = `<p style="font-size:115%;margin:0 0 6px;font-weight:bold;">参考资料</p><p>${innerHTML}</p>`;
                container.appendChild(div);
                continue;
            }

            // 编者的话块：::: ... :::
            if (trimmed === ':::') {
                i++;
                const blockLines = [];
                while (i < allLines.length && (allLines[i] || '').trim() !== ':::') {
                    blockLines.push((allLines[i] || '').trimEnd());
                    i++;
                }
                i++;
                const div = document.createElement('div');
                div.className = 'second-text';
                const innerHTML = blockLines.map(l => normalizeInline(l)).join('<br/>');
                div.innerHTML = `<p style="font-size:115%;margin:0 0 6px;font-weight:bold;">编者的话</p><p>${innerHTML}</p>`;
                container.appendChild(div);
                continue;
            }

            // 金色分割线：*******
            if (trimmed === '*******') {
                const hr = document.createElement('hr');
                hr.style.cssText = 'border:none;border-top:2px solid #D3BC8E;margin:24px 0;';
                container.appendChild(hr);
                i++;
                continue;
            }

            // 表格处理
            if (isTableLine(trimmed)) {
                const block = [];
                while (i < allLines.length && isTableLine(allLines[i] || '')) {
                    block.push(allLines[i] || '');
                    i++;
                }
                const tableEl = renderTable(block, footnoteMap);
                if (tableEl) container.appendChild(tableEl);
                continue;
            }

            // 图片处理（排除特殊标记图片）
            if (/^!\[[^\]]*\]\([^)]*\)/.test(trimmed) && !/^!\[(Imagebg|Introbg)/i.test(trimmed)) {
                const m = trimmed.match(/^!\[([^\]]*?)\]\(([^)]*)\)/);
                if (m) {
                    const alt = m[1];
                    const src = m[2];
                    const fixedSrc = src.replace(/^\/?\.\.\//, '../../').replaceAll('\\', '/');
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = 'text-align:center;margin:16px 0;';
                    wrapper.innerHTML = `<img src="${fixedSrc}" alt="${escapeHtml(alt)}" style="max-width:100%;height:auto;border-radius:4px;"><p class="image-caption" style="color:#8B7355;font-size:0.9em;margin-top:8px;">${escapeHtml(alt)}</p>`;
                    container.appendChild(wrapper);
                    i++;
                    continue;
                }
            }

            // 引用块处理
            if (trimmed.startsWith('>')) {
                const q = [];
                while (i < allLines.length && ((allLines[i] || '').trim().startsWith('>'))) {
                    q.push(allLines[i] || '');
                    i++;
                }
                const block = document.createElement('div');
                block.className = 'second-text';
                const cleaned = q.map(l => l.replace(/^>\s?/, '').trimEnd()).filter(l => l.trim().length > 0);
                block.innerHTML = cleaned.map(l => `<p class="second-text;">${injectFootnoteTooltips(normalizeInline(l), footnoteMap)}</p>`).join('');
                container.appendChild(block);
                continue;
            }

            // 普通段落处理
            const p = document.createElement('p');
            p.style.cssText = 'color:#000;font-family:Common;line-height:1.8;margin:12px 0;';
            p.innerHTML = injectFootnoteTooltips(normalizeInline(trimmed), footnoteMap);
            container.appendChild(p);
            i++;
        }

        return container;
    }

    /**
     * 注入脚注提示函数
     * 将HTML中的<sup>/<sub>标签转换为带tooltip的脚注引用
     * @param {string} html - 待处理的HTML字符串
     * @param {Record<string, string>} footnoteMap - 脚注映射表
     * @returns {string} - 处理后的HTML字符串
     */
    function injectFootnoteTooltips(html, footnoteMap) {
        const replacer = (_, n) => {
            const key = String(n);
            const tip = footnoteMap[key] || '';
            return `<p class="has-footnote"><sup>*</sup><span class="tooltip">${tip}</span></p>`;
        };

        return html
            .replaceAll(/<sup>\s*(\d+)\s*<\/sup>/g, replacer)
            .replaceAll(/<sub>\s*(\d+)\s*<\/sub>/g, replacer);
    }

    /**
     * 分割表格行函数
     * 将Markdown表格行按|分割为单元格数组
     * @param {string} rowLine - 表格行字符串
     * @returns {string[]} - 单元格内容数组
     */
    function splitRow(rowLine) {
        const trimmed = rowLine.trim();
        const core = trimmed.replace(/^\|/, '').replace(/\|$/, '');
        return core.split('|').map(c => (c ?? '').trim());
    }

    /**
     * 判断是否为空白单元格
     * @param {string} cell - 单元格内容
     * @returns {boolean} - 是否为空白单元格
     */
    function isBlankCell(cell) {
        const t = (cell ?? '').trim();
        // 只有真正空白的单元格才参与合并
        // 严格匹配：只有内容恰好是 <br /> 的单元格视为有内容，不合并
        // 其他情况（<br/>、<br>）视为空白单元格
                if (t === '<br />') return false;
                return t === '' || t === '<br/>' || t === '<br>' || t === '&nbsp;' || t === '&#160;' || t === '—';
            }

    /**
     * 渲染表格函数
     * 将Markdown表格转换为HTML表格，支持单元格合并
     * @param {string[]} blockLines - 表格行数组
     * @param {Record<string, string>} footnoteMap - 脚注映射表
     * @returns {HTMLElement|null} - 表格容器元素或null
     */
    function renderTable(blockLines, footnoteMap) {
        if (blockLines.length < 1) return null;

        const headerCells = splitRow(blockLines[0]);  // 解析表头行
        let bodyStart = 1;  // 表体起始行索引
        
        // 识别分隔行（包含---的行，如 |---|---|---|）
        const hasSeparatorRow = blockLines.length > 1 && blockLines[1].includes('---');
        if (hasSeparatorRow) bodyStart = 2;

        const bodyLines = blockLines.slice(bodyStart);      // 表体行
        const bodyCells = bodyLines.map(splitRow);          // 解析所有表体单元格
        const colCount = Math.max(headerCells.length, ...bodyCells.map(r => r.length));  // 计算最大列数

        // 补齐列数（确保每行列数一致）
        while (headerCells.length < colCount) headerCells.push('');
        for (const r of bodyCells) while (r.length < colCount) r.push('');

        // 初始化合并信息矩阵
        /** @type {Array<Array<{text:string, rowspan:number, colspan:number, skip:boolean}>>} */
        const mergedBody = bodyCells.map(row => row.map(text => ({ 
            text,       // 单元格内容
            rowspan: 1, // 纵向合并行数
            colspan: 1, // 横向合并列数
            skip: false // 是否跳过（已被合并）
        })));

        // 阶段一：横向合并（从有内容的单元格开始，向右合并空白单元格）
        for (let r = 0; r < mergedBody.length; r++) {
            for (let c = 0; c < colCount; c++) {
                if (mergedBody[r][c].skip) continue;  // 跳过已被合并的单元格
                
                if (!isBlankCell(mergedBody[r][c].text)) {
                    // 计算该单元格能向右延伸多少列（右方必须是空白单元格）
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
                        // 标记被横向合并的单元格（防止后续被纵向合并）
                        for (let c2 = c + 1; c2 < c + maxColspan; c2++) {
                            mergedBody[r][c2].skip = true;
                        }
                    }
                }
            }
        }
        
        // 阶段二：纵向合并（从有内容的单元格开始，向下合并空白单元格）
        for (let c = 0; c < colCount; c++) {
            for (let r = 0; r < mergedBody.length; r++) {
                if (mergedBody[r][c].skip) continue;  // 跳过已被合并的单元格
                
                if (!isBlankCell(mergedBody[r][c].text)) {
                    // 计算该单元格能向下延伸多少行（下方必须是空白单元格且未被横向合并标记）
                    let maxRowspan = 1;
                    for (let r2 = r + 1; r2 < mergedBody.length; r2++) {
                        if (mergedBody[r2][c].skip) continue;  // 跳过被横向合并标记的单元格
                        if (isBlankCell(mergedBody[r2][c].text)) {
                            maxRowspan++;
                        } else {
                            break;
                        }
                    }
                    
                    if (maxRowspan > 1) {
                        mergedBody[r][c].rowspan = maxRowspan;
                        // 标记被纵向合并的单元格
                        for (let r2 = r + 1; r2 < r + maxRowspan; r2++) {
                            mergedBody[r2][c].skip = true;
                        }
                    }
                }
            }
        }

                const table = document.createElement('table');
                table.className = 'common-table';

                // 检查表头是否有内容
                const hasHeaderContent = headerCells.some(cell => !isBlankCell(cell));

                // 渲染表头（仅当表头有内容时）
                if (hasHeaderContent) {
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    for (let c = 0; c < colCount; c++) {
                        const th = document.createElement('th');
                        let html = normalizeInline(headerCells[c] || '');
                        html = injectFootnoteTooltips(html, footnoteMap);
                        th.innerHTML = html || '';
                        headerRow.appendChild(th);
                    }
                    thead.appendChild(headerRow);
                    table.appendChild(thead);
                }

                // 渲染表体
                const tbody = document.createElement('tbody');
                for (let r = 0; r < mergedBody.length; r++) {
                    const tr = document.createElement('tr');
                    for (let c = 0; c < colCount; c++) {
                        if (mergedBody[r][c].skip) continue;

                        const td = document.createElement('td');
                        if (c === c) td.classList.add('text-left');
                        const rs = mergedBody[r][c].rowspan;
                        const cs = mergedBody[r][c].colspan;
                        if (rs > 1) td.rowSpan = rs;
                        if (cs > 1) td.colSpan = cs;

                        let html = normalizeInline(mergedBody[r][c].text);
                        html = injectFootnoteTooltips(html, footnoteMap);
                        td.innerHTML = html || '';
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);

                const wrapper = document.createElement('div');
                wrapper.className = 'table-container';
                wrapper.appendChild(table);
                return wrapper;
            }

    /**
     * 解析Markdown内容并渲染到页面函数
     * 这是核心渲染函数，负责将完整的Markdown内容转换为页面DOM元素
     * @param {string} markdown - Markdown格式的内容
     * @returns {{tocItems: Array<{id:string,text:string,level:1|2}>, quoteData: Record<string, {content: string}>}}
     */
    function parseMarkdownToPage(markdown) {
        const allLines = markdown.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');

        // 提取 <commoncontent> 块（特殊内容区块）
        const commoncontentBlocks = [];
        const commoncontentRegex = /<commoncontent>([\s\S]*?)<\/commoncontent>/g;
        let processedMarkdown = markdown;
        let match;
        while ((match = commoncontentRegex.exec(markdown)) !== null) {
            commoncontentBlocks.push(match[1]);
        }
        processedMarkdown = markdown.replace(commoncontentRegex, '<COMMONCONTENT_PLACEHOLDER>');

        // 识别文末注释区（以 > 数字 格式开始的行作为脚注起点）
        let footStart = -1;
        const processedLines = processedMarkdown.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
        for (let idx = 0; idx < processedLines.length; idx++) {
            if (/^>\s*\d+\s+/.test((processedLines[idx] || '').trim())) {
                footStart = idx;
                break;
            }
        }

        // 分离正文内容和脚注内容
        const contentLines = footStart === -1 ? processedLines : processedLines.slice(0, footStart);
        const footnoteLines = footStart === -1 ? [] : processedLines.slice(footStart);
        const footnoteMap = parseFootnotes(footnoteLines);  // 解析脚注

        /** @type {Array<{id:string,text:string,level:1|2}>} */
        const tocItems = [];      // 目录项数组
        /** @type {Record<string, {content: string}>} */
        const quoteData = {};     // 引文数据映射
        let quoteIndex = 0;       // 引文计数器
        let sectionIndex = 0;     // 章节计数器
        let subIndex = 0;         // 子章节计数器
        let commoncontentIndex = 0; // commoncontent块计数器

        /**
         * 添加目录项
         * @param {string} id - 章节ID
         * @param {string} text - 章节标题文本
         * @param {1|2} level - 目录级别（1=二级标题，2=三级标题）
         */
        function pushToc(id, text, level) {
            tocItems.push({ id, text, level });
        }

        /**
         * 清理目录文本（移除HTML标签和Markdown格式）
         * @param {string} raw - 原始文本
         * @returns {string} - 清理后的文本
         */
        function cleanTocText(raw) {
            return (raw || '')
                .replace(/<\s*sup[^>]*>[\s\S]*?<\s*\/\s*sup\s*>/gi, '')  // 移除上标标签
                .replace(/<\s*sub[^>]*>[\s\S]*?<\s*\/\s*sub\s*>/gi, '')  // 移除下标标签
                .replace(/\*\*(.*?)\*\*/g, '$1')                         // 移除加粗格式
                .replace(/\*(.*?)\*/g, '$1')                            // 移除斜体格式
                .replace(/^\*\s*/g, '')                                  // 移除开头的*
                .replace(/<[^>]+>/g, '')                                 // 移除所有HTML标签
                .replace(/\s+/g, ' ')                                    // 合并空格
                .trim();
        }

        /**
         * 生成章节ID
         * @param {number} level - 章节级别
         * @returns {string} - 生成的ID
         */
        function makeId(level) {
            if (level === 1) return `section-${sectionIndex}`;
                    return `section-${sectionIndex}-${subIndex}`;
                }

                let i = 0;

                // 标题
                let titleText = '蒙德';
                if ((contentLines[i] || '').startsWith('# ')) {
                    titleText = (contentLines[i] || '').slice(2).trim();
                    i++;
                }
                pageTitleEl.innerHTML = injectFootnoteTooltips(normalizeInline(titleText), footnoteMap);

                // Intro：直到第一个二级标题
                const introParas = [];
                let introBg0Path = null;
                let introBg1Path = null;
                let introBgContent = [];
                let inIntroBg = false;
                while (i < contentLines.length && !(contentLines[i] || '').startsWith('## ')) {
                    const line = (contentLines[i] || '').trimEnd();
                    const trimmed = line.trim();
                    if (/^!\[Introbg0\]/i.test(trimmed) && !inIntroBg) {
                        inIntroBg = true;
                        const m = trimmed.match(/^!\[Introbg0\]\(([^)]*)\)/i);
                        introBg0Path = m ? m[1] : '';
                        i++;
                        continue;
                    }
                    if (inIntroBg && /^!\[Introbg1\]/i.test(trimmed)) {
                        const m = trimmed.match(/^!\[Introbg1\]\(([^)]*)\)/i);
                        introBg1Path = m ? m[1] : '';
                        inIntroBg = false;
                        i++;
                        continue;
                    }
                    if (inIntroBg) {
                        introBgContent.push(line);
                    } else {
                        if (trimmed) introParas.push(line);
                    }
                    i++;
                }
                let introHTML = introParas.map((p, idx) => {
                    const raw = p.trim();
                    const isLatin = /^[a-zA-Z\s]+$/.test(raw) && raw.length <= 60;
                    let html = normalizeInline(raw);
                    html = injectFootnoteTooltips(html, footnoteMap);
                    if (isLatin && idx === 0) {
                        return `<p><strong class="khaenriah-font">${html}</strong></p>`;
                    }
                    return `<p>${html}</p>`;
                }).join('');
                if (introBg0Path && introBg1Path) {
                    const fixedBg0 = introBg0Path.replace(/^\/?\.\.\//, '../../').replaceAll('\\', '/');
                    const fixedBg1 = introBg1Path.replace(/^\/?\.\.\//, '../../').replaceAll('\\', '/');
                    const contentHTML = introBgContent
                        .filter(l => (l || '').trim())
                        .map(l => {
                            let html = normalizeInline((l || '').trimEnd());
                            html = injectFootnoteTooltips(html, footnoteMap);
                            return `<p>${html}</p>`;
                        }).join('');
                    introHTML += `<div class="intro-bg"><img class="bg-top" src="${fixedBg0}" alt=""><div class="intro-content">${contentHTML}</div><img class="bg-bottom" src="${fixedBg1}" alt=""></div>`;
                }
                introEl.innerHTML = introHTML;

                // Timeline 构建
                timelineEl.innerHTML = '';
                let currentSection = null;
                let currentItem = null;

                function ensureSection() {
                    if (!currentSection) {
                        currentSection = document.createElement('div');
                        currentSection.className = 'timeline-section';
                        timelineEl.appendChild(currentSection);
                    }
                    return currentSection;
                }

                function startNewItem() {
                    const item = document.createElement('div');
                    item.className = 'timeline-item';
                    ensureSection().appendChild(item);
                    currentItem = item;
                    return item;
                }

                function appendToCurrent(targetEl) {
                    if (currentItem) currentItem.appendChild(targetEl);
                    else ensureSection().appendChild(targetEl);
                }

                function renderContentPara(text) {
                    const p = document.createElement('p');
                    p.className = 'timeline-content';
                    let html = normalizeInline(text);
                    html = injectFootnoteTooltips(html, footnoteMap);
                    p.innerHTML = html;
                    return p;
                }

                function renderSubtitle(text, tag = 'h3') {
                    const h = document.createElement(tag);
                    h.className = 'timeline-subtitle';
                    let html = normalizeInline(text);
                    html = injectFootnoteTooltips(html, footnoteMap);
                    h.innerHTML = html;
                    return h;
                }

                function renderQuoteBlock(quoteLines) {
                    quoteIndex += 1;
                    const quoteId = `quote-liyue-${quoteIndex}`;

                    const cleaned = quoteLines
                        .map(l => l.replace(/^>\s?/, '').replace(/\s{2,}$/, '').trimEnd())
                        .filter(l => l.trim().length > 0);

                    const first = cleaned[0] || '（引文）';
                    const preview = first.length > 70 ? (first.slice(0, 70) + '…') : first;

                    const block = document.createElement('div');
                    block.className = 'quote-block';
                    block.setAttribute('data-quote', quoteId);
                    block.innerHTML = `
                        <p class="quote-preview">${injectFootnoteTooltips(normalizeInline(preview), footnoteMap)}</p>
                        <p class="quote-link">[点击查看完整原文]</p>
                    `;

                    const fullHtml = cleaned.map(line => {
                        let html = normalizeInline(line);
                        html = injectFootnoteTooltips(html, footnoteMap);
                        return `<p>${html}</p>`;
                    }).join('');
                    quoteData[quoteId] = { content: fullHtml };

                    block.addEventListener('click', () => openModal(quoteData[quoteId].content));
                    return block;
                }

                function isTableLine(line) {
                    const t = (line || '').trim();
                    return t.startsWith('|') && t.includes('|');
                }

                while (i < contentLines.length) {
                    const rawLine = contentLines[i] || '';
                    const line = rawLine.trimEnd();
                    const trimmed = line.trim();

                    // 空行：不输出，但用于分隔
                    if (!trimmed) { i++; continue; }

                    // commoncontent 占位符
                    if (trimmed === '<COMMONCONTENT_PLACEHOLDER>') {
                        currentItem = null;
                        if (commoncontentIndex < commoncontentBlocks.length) {
                            const ccContainer = parseCommonContent(commoncontentBlocks[commoncontentIndex], footnoteMap);
                            ensureSection().appendChild(ccContainer);
                            commoncontentIndex++;
                        }
                        i++;
                        continue;
                    }

                    // 二级标题：新章节
                    if (trimmed.startsWith('## ')) {
                        sectionIndex += 1;
                        subIndex = 0;
                        currentItem = null;

                        const text = trimmed.slice(3).trim().replace(/^\*\s*/g, '');
                        if (!text) { i++; continue; }
                        const id = makeId(1);

                        currentSection = document.createElement('div');
                        currentSection.className = 'timeline-section';

                        const h2 = document.createElement('h2');
                        h2.className = 'timeline-period';
                        h2.id = id;
                        h2.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                        currentSection.appendChild(h2);
                        timelineEl.appendChild(currentSection);

                        pushToc(id, cleanTocText(text), 1);
                        i++;
                        continue;
                    }

                    // 三级标题：主标题
                    if (trimmed.startsWith('### ')) {
                        subIndex += 1;
                        currentItem = null;

                        const text = trimmed.slice(4).trim().replace(/^\*\s*/g, '');
                        if (!text) { i++; continue; }
                        const id = makeId(2);

                        const h4 = document.createElement('h4');
                        h4.className = 'timeline-main-title';
                        h4.id = id;
                        h4.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                        ensureSection().appendChild(h4);

                        pushToc(id, cleanTocText(text), 2);
                        i++;
                        continue;
                    }

                    // 四级标题：细分段落
                    if (trimmed.startsWith('#### ')) {
                        const raw = trimmed.slice(5).trim();

                        // 其它四级标题按子标题处理
                        currentItem = startNewItem();
                        currentItem.appendChild(renderSubtitle(raw, 'h5'));
                        i++;
                        continue;
                    }

                    // 特殊标记：![Introbg0] ... ![Introbg1]
                    if (/^!\[Introbg0\]/i.test(trimmed)) {
                        const m0 = trimmed.match(/^!\[Introbg0\]\(([^)]*)\)/i);
                        const bg0Path = m0 ? m0[1] : '';
                        i++;
                        const blockContent = [];
                        let bg1Path = '';
                        while (i < contentLines.length && !/^!\[Introbg1\]/i.test((contentLines[i] || '').trim())) {
                            blockContent.push(contentLines[i] || '');
                            i++;
                        }
                        if (i < contentLines.length) {
                            const m1 = (contentLines[i] || '').trim().match(/^!\[Introbg1\]\(([^)]*)\)/i);
                            bg1Path = m1 ? m1[1] : '';
                            i++;
                        }
                        const fixedBg0 = bg0Path.replace(/^\/?\.\.\//, '../../').replaceAll('\\', '/');
                        const fixedBg1 = bg1Path.replace(/^\/?\.\.\//, '../../').replaceAll('\\', '/');
                        const wrapper = document.createElement('div');
                        wrapper.className = 'intro-bg';
                        const contentHTML = blockContent
                            .filter(l => (l || '').trim())
                            .map(l => {
                                let html = normalizeInline((l || '').trimEnd());
                                html = injectFootnoteTooltips(html, footnoteMap);
                                return `<p>${html}</p>`;
                            }).join('');
                        wrapper.innerHTML = `<img class="bg-top" src="${fixedBg0}" alt=""><div class="intro-content">${contentHTML}</div><img class="bg-bottom" src="${fixedBg1}" alt="">`;
                        appendToCurrent(wrapper);
                        continue;
                    }

                    // 特殊标记：![Imagebg] + 代码块（\`\`\` 格式）
                    if (/^!\[Imagebg\]/i.test(trimmed)) {
                        const m = trimmed.match(/^!\[Imagebg\]\(([^)]*)\)/i);
                        const imgPath = m ? m[1] : '';
                        i++;
                        while (i < contentLines.length && !(contentLines[i] || '').trim()) i++;
                        if (i < contentLines.length && /^(?:\\`){3}/.test((contentLines[i] || '').trim())) {
                            i++;
                            const codeLines = [];
                            while (i < contentLines.length && !/^(?:\\`){3}/.test((contentLines[i] || '').trim())) {
                                codeLines.push(contentLines[i] || '');
                                i++;
                            }
                            i++;
                            const fixedSrc = imgPath.replace(/^\/?\.\.\//, '../../').replaceAll('\\', '/');
                            const div = document.createElement('div');
                            div.className = 'second-intro';

                            const codeHtml = codeLines
                                .map(line => normalizeInline(line))
                                .join('\n');

                            div.innerHTML = `<img class="bg-img" src="${fixedSrc}" alt=""><div class="intro-content"><pre>${codeHtml}</pre></div>`;
                            appendToCurrent(div);
                        }
                        continue;
                    }

                    // 特殊块：!!! ... !!!（参考资料）
                    if (trimmed === '!!!') {
                        i++;
                        const blockLines = [];
                        while (i < contentLines.length && (contentLines[i] || '').trim() !== '!!!') {
                            blockLines.push((contentLines[i] || '').trimEnd());
                            i++;
                        }
                        i++;
                        const div = document.createElement('div');
                        div.className = 'second-text';
                        const innerHTML = blockLines
                            .map(l => normalizeInline(l))
                            .join('<br/>');
                        div.innerHTML = `<p style="font-size:115%;margin:0 0 6px;font-weight:bold;">参考资料</p><p>${innerHTML}</p>`;
                        appendToCurrent(div);
                        continue;
                    }

                    // 特殊块：::: ... :::（编者的话）
                    if (trimmed === ':::') {
                        i++;
                        const blockLines = [];
                        while (i < contentLines.length && (contentLines[i] || '').trim() !== ':::') {
                            blockLines.push((contentLines[i] || '').trimEnd());
                            i++;
                        }
                        i++;
                        const div = document.createElement('div');
                        div.className = 'second-text';
                        const innerHTML = blockLines
                            .map(l => normalizeInline(l))
                            .join('<br/>');
                        div.innerHTML = `<p style="font-size:115%;margin:0 0 6px;font-weight:bold;">编者的话</p><p>${innerHTML}</p>`;
                        appendToCurrent(div);
                        continue;
                    }

                    // 金色分割线
                    if (trimmed === '*******') {
                        const hr = document.createElement('hr');
                        hr.style.cssText = 'border:none;border-top:2px solid #D3BC8E;margin:24px 0;';
                        appendToCurrent(hr);
                        i++;
                        continue;
                    }

                    // 常规独立图片行：![alt](path)
                    if (/^!\[[^\]]*\]\([^)]*\)/.test(trimmed) && !/^!\[(Imagebg|Introbg)/i.test(trimmed)) {
                        const m = trimmed.match(/^!\[([^\]]*?)\]\(([^)]*)\)/);
                        if (m) {
                            const alt = m[1];
                            const src = m[2];
                            const fixedSrc = src.replace(/^\/?\.\.\//, '../../').replaceAll('\\', '/');
                            const wrapper = document.createElement('div');
                            wrapper.className = 'timeline-image';
                            wrapper.innerHTML = `<img src="${fixedSrc}" alt="${escapeHtml(alt)}" style="max-width:calc(100% - 100px);display:block;margin:0 auto;"><p class="image-caption">${escapeHtml(alt)}</p>`;
                            appendToCurrent(wrapper);
                            i++;
                            continue;
                        }
                    }

                    // Mermaid 图表代码块
                    if (/^```\s*mermaid\b/i.test(trimmed)) {
                        i++;
                        const codeLines = [];
                        while (i < contentLines.length && !/^```/.test((contentLines[i] || '').trim())) {
                            codeLines.push(contentLines[i] || '');
                            i++;
                        }
                        if (i < contentLines.length && /^```/.test((contentLines[i] || '').trim())) i++;
                        const code = codeLines.join('\n');
                        const wrapper = document.createElement('div');
                        wrapper.className = 'timeline-mermaid';
                        wrapper.style.cssText = 'text-align:center;margin:16px 0;';
                        wrapper.innerHTML = `<pre class="mermaid" style="max-width:calc(100% - 100px);display:block;margin:0 auto;background:transparent;border:none;">${escapeHtml(code)}</pre>`;
                        appendToCurrent(wrapper);
                        continue;
                    }

                    // 引文（blockquote）
                    if (trimmed.startsWith('>')) {
                        const q = [];
                        while (i < contentLines.length && ((contentLines[i] || '').trim().startsWith('>'))) {
                            q.push(contentLines[i] || '');
                            i++;
                        }
                        appendToCurrent(renderQuoteBlock(q));
                        continue;
                    }

                    // 表格
                    if (isTableLine(trimmed)) {
                        const block = [];
                        while (i < contentLines.length && isTableLine(contentLines[i] || '')) {
                            block.push(contentLines[i] || '');
                            i++;
                        }
                        const tableEl = renderTable(block, footnoteMap);
                        if (tableEl) appendToCurrent(tableEl);
                        continue;
                    }

                    // 项目符号（·）作为子标题
                    if (/^·/.test(trimmed)) {
                        currentItem = startNewItem();
                        currentItem.appendChild(renderSubtitle(trimmed, 'h3'));
                        i++;
                        continue;
                    }

                    // 常规文本：放入当前 item，否则新建 item
                    if (!currentItem) startNewItem();
                    currentItem.appendChild(renderContentPara(trimmed));
                    i++;
                }

                return { tocItems, quoteData };
            }

    /**
     * 构建目录函数
     * 根据目录项数组生成目录列表，并绑定滚动高亮事件
     * @param {Array<{id:string,text:string,level:1|2}>} tocItems - 目录项数组
     */
    function buildToc(tocItems) {
        tocList.innerHTML = '';  // 清空现有目录

        // 遍历目录项，创建目录链接
        tocItems.forEach(item => {
            const li = document.createElement('li');
            li.className = `toc-item level-${item.level}`;

            const a = document.createElement('a');
            a.href = '#' + item.id;
            a.className = 'toc-link level-' + item.level;
            a.textContent = item.text;

            // 点击目录链接时平滑滚动到对应章节
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(item.id);
                if (!target) return;
                const offset = 100;  // 滚动偏移量（避免标题被顶部遮挡）
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                updateTocHighlight(item.id);
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });

        // 初始化高亮状态并绑定滚动事件
        updateTocHighlight();
        window.addEventListener('scroll', () => updateTocHighlight());

        /**
         * 更新目录高亮函数
         * 根据滚动位置自动高亮当前章节对应的目录项
         * @param {string|null} forceId - 强制高亮的章节ID（可选）
         */
        function updateTocHighlight(forceId = null) {
            const links = document.querySelectorAll('.toc-link');
            
            // 强制高亮指定章节
            if (forceId) {
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + forceId);
                });
                return;
            }

            // 根据滚动位置计算当前章节
            const sections = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
            let current = '';
            let minDistance = Infinity;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top - 100);  // 计算到视口顶部100px位置的距离
                if (rect.top <= 100 && rect.bottom >= 0) {  // 章节在视口可见范围内
                    if (distance < minDistance) {
                        minDistance = distance;
                        current = section.id;
                    }
                }
            });

            // 默认高亮第一个章节
            if (!current && sections.length > 0) current = sections[0].id;
            
            // 更新高亮状态
            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        }
    }

            introEl.innerHTML = '<p>（内容加载中）</p>';

            loadMarkdown().then((md) => {
                if (!md.trim()) {
                    introEl.innerHTML = '<p>（内容为空）</p>';
                    return;
                }

                // 如果 Markdown 中包含 mermaid 代码块，则动态加载 mermaid 脚本（只加载一次）
                try {
                    if (/```\s*mermaid\b/i.test(md)) {
                        if (!document.querySelector('script[data-mermaid]')) {
                            const s = document.createElement('script');
                            s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
                            s.setAttribute('data-mermaid', '1');
                            document.head.appendChild(s);
                        }
                    }
                } catch (e) {
                    console.warn('mermaid check failed', e);
                }

                const { tocItems } = parseMarkdownToPage(md);
                buildToc(tocItems);
            });
        });
