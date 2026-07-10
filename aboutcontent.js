/**
 * Copyright (C) 2026 GenshinLore Website & Dennis114514 & other contributors
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * See LICENSE.md file in the project root for full license information.
 */
document.addEventListener('DOMContentLoaded', () => {
    const mdPath = 'md/about.md';
    const containerEl = document.getElementById('about-content');
    const tocList = document.getElementById('toc-list');

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

    function normalizeInline(raw) {
        let s = raw ?? '';
        const DELIM_ALT = '\uE001';
        const DELIM_LINK = '\uE002';
        
        s = s.replaceAll(/\r/g, '');
        s = s.replaceAll(/<br\s*\/?>/gi, '[[[BR]]]');
        s = s.replaceAll(/<sup>\s*(\d+)\s*<\/sup>/gi, '[[[SUP:$1]]]');
        s = s.replaceAll(/<sub>\s*(\d+)\s*<\/sub>/gi, '[[[SUB:$1]]]');
        
        s = s.replaceAll(/!\[(?!Introbg[01]|Imagebg)([^\]]*?)\]\(([^)]*)\)/gi,
            (_, alt, src) => `[[[MDIMG:${src + DELIM_ALT + alt}]]]`);
        s = s.replaceAll(/\[Image\]\s*\(\s*["']([^"']+)["']\s*\)/gi, '[[[IMG:$1]]]');
        s = s.replaceAll(/\[([^\]]*?)\]\(([^)]*)\)/gi,
            (_, text, url) => `[[[LINK:${url + DELIM_LINK + text}]]]`);
        
        s = s.replaceAll(/\*\*([^*]+?)\*\*/g, '<span style="color:red;">$1</span>');
        s = s.replaceAll(/(^|[^*])\*([^*]+?)\*(?!\*)/g, '$1<strong>$2</strong>');
        s = s.replaceAll(/~~([^~~]+?)~~/g, '<del>$1</del>');

        s = s
            .replaceAll('[[[BR]]]', '<br/>')
            .replaceAll(/\[\[\[SUP:(\d+)\]\]\]/g, '<sup>$1</sup>')
            .replaceAll(/\[\[\[SUB:(\d+)\]\]\]/g, '<sub>$1</sub>')
            .replaceAll(/\[\[\[MDIMG:([^\]]+)\]\]\]/g, (match, data) => {
                const idx = data.indexOf(DELIM_ALT);
                const src = idx >= 0 ? data.slice(0, idx) : data;
                const alt = idx >= 0 ? data.slice(idx + 1) : '';
                let fixedSrc = src.replaceAll('\\', '/').replace(/^\/?\.\.\//, '');
                return `<img src="${fixedSrc}" alt="${alt}" style="display:block;margin:0 auto 8px;max-width:100%;height:auto;"><br><p class="image-caption">${alt}</p>`;
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

    function parseFootnotes(markdown) {
        const lines = markdown.split('\n');
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

    function injectFootnoteTooltips(html, footnoteMap) {
        const replacer = (_, n) => {
            const key = String(n);
            const tip = footnoteMap[key] || '';
            return `<span class="has-footnote"><sup>*</sup><span class="tooltip">${tip}</span></span>`;
        };
        return html
            .replaceAll(/<sup>\s*(\d+)\s*<\/sup>/g, replacer)
            .replaceAll(/<sub>\s*(\d+)\s*<\/sub>/g, replacer);
    }

    function splitRow(rowLine) {
        const trimmed = rowLine.trim();
        const core = trimmed.replace(/^\|/, '').replace(/\|$/, '');
        return core.split('|').map(c => (c ?? '').trim());
    }

    function isBlankCell(cell) {
        const t = (cell ?? '').trim();
        if (t === '<br />') return false;
        return t === '' || t === '<br/>' || t === '<br>' || t === '&nbsp;' || t === '&#160;' || t === '—';
    }

    function renderTable(blockLines, footnoteMap) {
        if (blockLines.length < 1) return null;

        const headerCells = splitRow(blockLines[0]);
        let bodyStart = 1;
        if (blockLines.length > 1 && blockLines[1].includes('---')) bodyStart = 2;

        const bodyLines = blockLines.slice(bodyStart);
        const bodyCells = bodyLines.map(splitRow);
        const colCount = Math.max(headerCells.length, ...bodyCells.map(r => r.length));

        while (headerCells.length < colCount) headerCells.push('');
        for (const r of bodyCells) while (r.length < colCount) r.push('');

        const mergedBody = bodyCells.map(row => row.map(text => ({ 
            text, rowspan: 1, colspan: 1, skip: false 
        })));

        for (let r = 0; r < mergedBody.length; r++) {
            for (let c = 0; c < colCount; c++) {
                if (mergedBody[r][c].skip) continue;
                if (!isBlankCell(mergedBody[r][c].text)) {
                    let maxColspan = 1;
                    for (let c2 = c + 1; c2 < colCount; c2++) {
                        if (isBlankCell(mergedBody[r][c2].text) && !mergedBody[r][c2].skip) maxColspan++;
                        else break;
                    }
                    if (maxColspan > 1) {
                        mergedBody[r][c].colspan = maxColspan;
                        for (let c2 = c + 1; c2 < c + maxColspan; c2++) mergedBody[r][c2].skip = true;
                    }
                }
            }
        }
        
        for (let c = 0; c < colCount; c++) {
            for (let r = 0; r < mergedBody.length; r++) {
                if (mergedBody[r][c].skip) continue;
                if (!isBlankCell(mergedBody[r][c].text)) {
                    let maxRowspan = 1;
                    for (let r2 = r + 1; r2 < mergedBody.length; r2++) {
                        if (mergedBody[r2][c].skip) continue;
                        if (isBlankCell(mergedBody[r2][c].text)) maxRowspan++;
                        else break;
                    }
                    if (maxRowspan > 1) {
                        mergedBody[r][c].rowspan = maxRowspan;
                        for (let r2 = r + 1; r2 < r + maxRowspan; r2++) mergedBody[r2][c].skip = true;
                    }
                }
            }
        }

        const table = document.createElement('table');
        table.className = 'common-table';

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

        const tbody = document.createElement('tbody');
        for (let r = 0; r < mergedBody.length; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c < colCount; c++) {
                if (mergedBody[r][c].skip) continue;

                const td = document.createElement('td');
                if (c === 0) td.classList.add('text-left');
                const rs = mergedBody[r][c].rowspan;
                const cs = mergedBody[r][c].colspan;
                if (rs > 1) td.rowSpan = rs;
                if (cs > 1) td.colSpan = cs;

                td.innerHTML = injectFootnoteTooltips(normalizeInline(mergedBody[r][c].text), footnoteMap) || '';
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

    function buildToc(tocItems) {
        tocList.innerHTML = '';
        tocItems.filter(item => item.level <= 4).forEach(item => {
            const li = document.createElement('li');
            li.className = 'toc-item';
            const a = document.createElement('a');
            a.href = '#' + item.id;
            a.className = 'toc-link level-' + item.level;
            a.style.color = '#4d4f53';
            a.style.textDecoration = 'none';
            // Adjust margin based on level
            a.style.paddingLeft = ((item.level - 1) * 15) + 'px';
            a.innerHTML = item.text;
            
            a.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (!targetEl) return;
                const topbarHeight = 70;
                const rect = targetEl.getBoundingClientRect();
                const targetPosition = window.scrollY + rect.top - topbarHeight - 16;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                
                document.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });
    }

    function parseSection(content, footnoteMap, tocItems, tocLevelOffset = 0, isTimeline = false) {
        const lines = content.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
        const container = document.createElement('div');
        let currentSection = container;
        let timelineContainer = null;
        let i = 0;
        let h1Count = 0, h2Count = 0, h3Count = 0, h4Count = 0;

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

            if (!trimmed) { i++; continue; }

            // Title Handlings
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
                tocItems.push({ id, text: text.replace(/<sup>[\s\S]*?<\/sup>/gi, '').replace(/<sub>[\s\S]*?<\/sub>/gi, '').replace(/<[^>]+>/g, ''), level: 1 });
                i++;
                continue;
            }
            if (trimmed.startsWith('## ')) {
                h2Count++; h3Count = 0; h4Count = 0;
                const text = trimmed.slice(3).trim();
                const id = makeId(2);
                const wrapper = document.createElement('div');
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
            if (trimmed.startsWith('### ')) {
                h3Count++; h4Count = 0;
                const text = trimmed.slice(4).trim();
                const id = makeId(3);
                
                if (tocLevelOffset === 2) {
                    // Treat like h2 in his/Mondstadt/content.js for <booklet>
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
            if (trimmed.startsWith('#### ')) {
                h4Count++;
                const text = trimmed.slice(5).trim();
                const id = makeId(4);
                
                if (isTimeline) {
                    // Timeline Item start
                    const item = document.createElement('div');
                    item.className = 'timeline-item';
                    const h4 = document.createElement('h4');
                    h4.id = id;
                    h4.className = 'timeline-main-title';
                    h4.style.fontSize = '1.25em';
                    h4.style.margin = '40px 0 30px 0';
                    h4.innerHTML = injectFootnoteTooltips(normalizeInline(text), footnoteMap);
                    item.appendChild(h4);
                    
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

            // Timeline specific block
            if (trimmed === '<timeline>') {
                isTimeline = true;
                timelineContainer = document.createElement('div');
                timelineContainer.className = 'timeline-container';
                currentSection.appendChild(timelineContainer);
                const oldSection = currentSection;
                currentSection = timelineContainer; // temporarily point to timeline container
                i++;
                continue;
            }
            if (trimmed === '</timeline>') {
                isTimeline = false;
                currentSection = currentSection.parentElement; // back to parent section
                if (currentSection.className === 'timeline-container') currentSection = currentSection.parentElement;
                i++;
                continue;
            }

            // details/summary for L892-893
            if (trimmed.startsWith('<details>')) {
                const details = document.createElement('details');
                let summary = document.createElement('summary');
                summary.textContent = '展开';
                details.appendChild(summary);
                const contentDiv = document.createElement('div');
                details.appendChild(contentDiv);
                currentSection.appendChild(details);
                
                const oldSection = currentSection;
                currentSection = contentDiv;
                i++;
                continue;
            }
            if (trimmed.startsWith('</details>')) {
                currentSection = currentSection.parentElement.parentElement;
                i++;
                continue;
            }
            if (trimmed.startsWith('<summary>')) {
                i++;
                continue;
            }
            if (trimmed.startsWith('</summary>')) {
                i++;
                continue;
            }

            // Quotes
            if (trimmed.startsWith('>')) {
                const q = [];
                while (i < lines.length && ((lines[i] || '').trim().startsWith('>'))) {
                    q.push(lines[i] || '');
                    i++;
                }
                const block = document.createElement('div');
                block.className = 'secondary-text';
                const cleaned = q.map(l => l.replace(/^>\s?/, '').trimEnd()).filter(l => l.trim().length > 0);
                block.innerHTML = cleaned.map(l => `<p>${injectFootnoteTooltips(normalizeInline(l), footnoteMap)}</p>`).join('');
                currentSection.appendChild(block);
                continue;
            }

            // Tables
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

            // 参考资料块：!!! ... !!!
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

            // 编者的话块：::: ... :::
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

            // Special images
            if (/^!\[Introbg0\]/i.test(trimmed)) {
                const m0 = trimmed.match(/^!\[Introbg0\]\(([^)]*)\)/i);
                const bg0Path = m0 ? m0[1] : '';
                i++;
                const blockContent = [];
                let bg1Path = '';
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

            if (/^!\[Imagebg\]/i.test(trimmed)) {
                const m = trimmed.match(/^!\[Imagebg\]\(([^)]*)\)/i);
                const imgPath = m ? m[1] : '';
                i++;
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

            // Text paragraph
            const p = document.createElement('p');
            p.className = 'common-paragraph';
            p.innerHTML = injectFootnoteTooltips(normalizeInline(trimmed), footnoteMap);
            currentSection.appendChild(p);
            i++;
        }

        return container;
    }

    loadMarkdown().then(md => {
        if (!md) return;

        // Extract footnotes
        const footStart = md.indexOf('\n> 1 ');
        let mainContent = md;
        let footnoteMap = {};
        if (footStart !== -1) {
            mainContent = md.slice(0, footStart);
            const footnoteContent = md.slice(footStart);
            footnoteMap = parseFootnotes(footnoteContent);
        }

        // Extract sections
        const postscriptMatch = mainContent.match(/<postscript>([\s\S]*?)<\/postscript>/);
        const bookletMatch = mainContent.match(/<booklet>([\s\S]*?)<\/booklet>/);

        const tocItems = [];

        if (postscriptMatch) {
            const postscriptDiv = document.createElement('div');
            postscriptDiv.className = 'main-text';
            const parsed = parseSection(postscriptMatch[1], footnoteMap, tocItems, 1);
            postscriptDiv.appendChild(parsed);
            containerEl.appendChild(postscriptDiv);
        }

        if (bookletMatch) {
            const bookletDiv = document.createElement('div');
            bookletDiv.className = 'main-text';
            const parsed = parseSection(bookletMatch[1], footnoteMap, tocItems, 2);
            bookletDiv.appendChild(parsed);
            // 插入到关于页面的内容容器中，确保继承页面内边距和样式
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

        buildToc(tocItems);
    });
});