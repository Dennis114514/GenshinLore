const navPageMap = {
    'home': 'main.html',
    'basic': 'basiclore.html',
    'history': 'Teyvathis.html',
    'nations': 'history-country.html',
    'brief': 'genshinbasichis.html',
    'about-manual': 'about.html',
    'about-site': 'aboutsite.html'
};


function goToMain() {
    const currentPage = window.location.href;
    if (!currentPage.includes('main.html')) {
        const basePath = getBasePath();
        window.location.href = basePath + 'main.html';
    }
}

window.goToMain = goToMain;

// 全局的目录导航收起/展开函数
let tocCollapseBtn, tocExpandBtn, tocSidebar;

function collapseToc() {
    try {
        if (tocSidebar) tocSidebar.classList.add('collapsed');
        if (tocCollapseBtn) tocCollapseBtn.style.display = 'none';
        if (tocExpandBtn) tocExpandBtn.classList.add('visible');
    } catch (e) {
        console.error('collapseToc error:', e);
    }
}

function expandToc() {
    try {
        if (tocSidebar) tocSidebar.classList.remove('collapsed');
        if (tocCollapseBtn) tocCollapseBtn.style.display = 'flex';
        if (tocExpandBtn) tocExpandBtn.classList.remove('visible');
    } catch (e) {
        console.error('expandToc error:', e);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.nav-indicator');
    const navMenu = document.querySelector('.nav-menu');

    function updateIndicator(item) {
        const itemWidth = item.offsetWidth;
        const itemLeft = item.offsetLeft;
        
        indicator.style.width = itemWidth + 'px';
        indicator.style.left = itemLeft + 'px';
    }

    function resetIndicator() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            updateIndicator(activeItem);
        }
    }

    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            updateIndicator(this);
        });
    });

    navMenu.addEventListener('mouseleave', function() {
        resetIndicator();
    });

    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        updateIndicator(activeItem);
    }

    window.addEventListener('resize', function() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            updateIndicator(activeItem);
        }
    });

    // 初始化移动端菜单
    initMobileMenu();

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    if (modal && modalBody && closeModal) {
        function openModal(quoteId) {
            const text = quoteData[quoteId];
            if (text) {
                modalBody.innerHTML = text.content;
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('modal-active');
                }, 10);
            }
        }

        function closeModalFunc() {
            modal.classList.remove('modal-active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        document.querySelectorAll('.quote-block').forEach(block => {
            block.addEventListener('click', function() {
                const quoteId = this.getAttribute('data-quote');
                openModal(quoteId);
            });
        });

        closeModal.addEventListener('click', closeModalFunc);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModalFunc();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModalFunc();
            }
        });
    }

    // TOC toggle functionality
    tocCollapseBtn = document.getElementById('toc-collapse');
    tocExpandBtn = document.getElementById('toc-expand');
    tocSidebar = document.querySelector('.toc-sidebar');
    
    if (tocCollapseBtn && tocSidebar) {
        tocCollapseBtn.addEventListener('click', collapseToc);
    }
    
    if (tocExpandBtn && tocSidebar) {
        tocExpandBtn.addEventListener('click', expandToc);
    }
    
    // 初始化移动端目录导航
    initMobileToc();

    // 初始化移动端 tooltip 垂直位置适配
    initMobileTooltip();
});

// 初始化移动端目录导航
function initMobileToc() {
    const tocSidebar = document.querySelector('.toc-sidebar');
    if (!tocSidebar) return;
    
    // 创建遮罩层
    const tocOverlay = document.createElement('div');
    tocOverlay.className = 'mobile-toc-overlay';
    
    // 创建悬浮球按钮
    const mobileTocBtn = document.createElement('button');
    mobileTocBtn.className = 'mobile-toc-btn';
    mobileTocBtn.setAttribute('aria-label', '打开目录');
    
    tocSidebar.parentNode.insertBefore(tocOverlay, tocSidebar.nextSibling);
    document.body.appendChild(mobileTocBtn);
    
    function isMobile() {
        return window.innerWidth <= 1012;
    }
    
    function updateMobileTocVisibility() {
        if (isMobile()) {
            mobileTocBtn.classList.remove('hidden');
            tocSidebar.classList.remove('collapsed');
        } else {
            mobileTocBtn.classList.add('hidden');
            closeMobileToc();
        }
    }
    
    function openMobileToc() {
        tocSidebar.classList.add('mobile-active');
        tocOverlay.classList.add('active');
        mobileTocBtn.classList.add('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileToc() {
        tocSidebar.classList.remove('mobile-active');
        tocOverlay.classList.remove('active');
        setTimeout(() => {
            mobileTocBtn.classList.remove('hidden');
        }, 350);
        document.body.style.overflow = '';
    }
    
    mobileTocBtn.addEventListener('click', openMobileToc);
    tocOverlay.addEventListener('click', closeMobileToc);
    
    // 点击收起按钮关闭侧边栏
    const collapseBtn = document.querySelector('.toc-collapse-btn');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isMobile()) {
                closeMobileToc();
            } else {
                // 桌面端：调用收起目录导航的函数
                if (typeof collapseToc === 'function') {
                    collapseToc();
                }
            }
        });
    }
    
    // 点击目录项后关闭侧边栏
    tocSidebar.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', function() {
            closeMobileToc();
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && tocSidebar.classList.contains('mobile-active')) {
            closeMobileToc();
        }
    });
    
    window.addEventListener('resize', updateMobileTocVisibility);
    
    updateMobileTocVisibility();
}

// 初始化移动端汉堡菜单
function initMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileBtn = document.createElement('div');
    mobileBtn.className = 'mobile-menu-btn';
    mobileBtn.innerHTML = '<span></span><span></span><span></span>';
    
    // 将按钮插入到导航菜单中
    navMenu.insertBefore(mobileBtn, navMenu.firstChild);

    // 为按钮添加点击事件
    mobileBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        navMenu.classList.toggle('active');
    });

    // 点击文档其他地方收起菜单
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // 监听窗口大小变化，自动收起菜单
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1012) {
            navMenu.classList.remove('active');
        }
    });
}

// 初始化 tooltip 位置适配
// 在 <768px 时，tooltip 通过 CSS 固定为 position:fixed 并水平居中屏幕，
// 在桌面端，.quote-preview 内的 tooltip 也使用 position:fixed 以突破父容器裁剪，
// 此函数负责在 hover/touch 时将其 top 设置为关联文本元素的垂直位置，
// 从而满足"垂直相对文本元素、水平固定屏幕居中"的响应式需求。
function initMobileTooltip() {
    let activeFootnote = null;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function needsFixedPosition(footnote) {
        return isMobile() || footnote.closest('.quote-preview') !== null;
    }

    function positionTooltip(footnote) {
        if (!footnote) return;
        const tooltip = footnote.querySelector('.tooltip');
        if (!tooltip) return;
        const rect = footnote.getBoundingClientRect();
        
        if (isMobile()) {
            tooltip.style.setProperty('top', rect.top + 'px', 'important');
        } else if (footnote.closest('.quote-preview') !== null) {
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        }
    }

    function clearTooltipPosition(footnote) {
        const tooltip = footnote?.querySelector('.tooltip');
        if (!tooltip) return;
        tooltip.style.removeProperty('top');
        tooltip.style.removeProperty('left');
    }

    document.querySelectorAll('.has-footnote').forEach(footnote => {
        const tooltip = footnote.querySelector('.tooltip');
        if (!tooltip) return;

        footnote.addEventListener('mouseenter', function() {
            activeFootnote = footnote;
            if (needsFixedPosition(footnote)) {
                positionTooltip(footnote);
            }
        });

        footnote.addEventListener('touchstart', function() {
            activeFootnote = footnote;
            if (needsFixedPosition(footnote)) {
                positionTooltip(footnote);
            }
        }, { passive: true });

        footnote.addEventListener('mouseleave', function() {
            if (needsFixedPosition(footnote)) {
                clearTooltipPosition(footnote);
            }
            activeFootnote = null;
        });
    });

    // 滚动时重新定位当前可见的 tooltip，避免 fixed 定位与文本元素错位
    window.addEventListener('scroll', function() {
        if (activeFootnote && needsFixedPosition(activeFootnote)) {
            positionTooltip(activeFootnote);
        }
    }, { passive: true });

    // 窗口尺寸变化：重新定位或清除内联样式
    window.addEventListener('resize', function() {
        if (activeFootnote) {
            if (needsFixedPosition(activeFootnote)) {
                positionTooltip(activeFootnote);
            } else {
                clearTooltipPosition(activeFootnote);
            }
        } else {
            document.querySelectorAll('.tooltip').forEach(tooltip => {
                tooltip.style.removeProperty('top');
                tooltip.style.removeProperty('left');
            });
        }
    });
}