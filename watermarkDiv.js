/**
 * @description 调用并传入配置，即可生成水印
 * @param { Object } config 传入的配置，参考defaultSettings的配置项
 * @param { String } config.waterText 水印文字
 * @param { Number } config.watermark_x 水印起始位置x轴坐标
 * @param { Number } config.watermark_y 水印起始位置Y轴坐标
 * @param { Number } config.watermark_rows 水印行数
 * @param { Number } config.watermark_cols 水印列数
 * @param { Number } config.watermark_x_space 水印x轴间隔
 * @param { Number } config.watermark_y_space 水印y轴间隔
 * @param { String } config.watermark_color 水印字体颜色
 * @param { Number } config.watermark_alpha 水印透明度
 * @param { String } config.watermark_fontsize 水印字体大小
 * @param { String } config.watermark_font 水印字体
 * @param { Number } config.watermark_width 水印宽度
 * @param { Number } config.watermark_height 水印高度
 * @param { Number } config.watermark_angle 水印倾斜度
 */
// 全局变量，供水印脚本调用
let DynamicData = "IP: 加载中... | Time: 加载中...";
let lastWatermarkConfig = null; // 【新增】用于缓存最后一次调用时的配置

async function generateWatermarkData() {
    try {
        // 请求 API 获取 IP (使用支持 CORS 的 API)
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const userIp = data.ip;

        // 获取当前时间并格式化
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });

        // 拼接成字符串存入变量
        DynamicData = `IP: ${userIp} | Time: ${timeString}`;
        
        console.log("水印数据已准备就绪:", DynamicData);

        // 【核心修复】如果数据加载完时，发现页面上已经生成了水印DOM，则主动触发重绘
        if (document.getElementById('water-div')) {
            watermark();
        }
    } catch (error) {
        console.error("IP 获取失败，可能是网络问题或广告拦截器拦截:", error);
        // 获取失败时的 fallback 方案
        const timeString = new Date().toLocaleString('zh-CN');
        DynamicData = `IP: 未知 | Time: ${timeString}`;

        // 【核心修复】获取失败降级后，如果已经有水印DOM，也触发重绘
        if (document.getElementById('water-div')) {
            watermark();
        }
    }
}

// 页面加载时执行
generateWatermarkData();

function watermark(config) {
    // 【核心修复】如果传入了配置，就缓存起来；如果没有传，就沿用上次的缓存
    if (config) {
        lastWatermarkConfig = config;
    }

    // 每次打水印之前先移除旧的dom，防止重复渲染或其他问题
    removeWatermark('water-div')
    var water = document.createElement('div')
    water.id = "water-div"
    
    // 初始设置水印容器高度
    water.innerHTML = "";
    water.style.height = window.screen.availHeight + "px";
    water.style.height = document.documentElement.clientHeight + "px";
    document.body.appendChild(water)
    
    // 水印样式默认设置
    var defaultSettings={
        // 这里每次调用都会自动读取最新更新后的 DynamicData
        watermark_txt:'作者：诗漱' + " 访问者信息：" + DynamicData,
        watermark_x:20,
        watermark_y:20,
        watermark_rows:2000,
        watermark_cols:2000,
        watermark_x_space:70,
        watermark_y_space:30,
        watermark_color:'#aaaaaa',
        watermark_alpha:0.4,
        watermark_fontsize:'12px',
        watermark_font:'',
        watermark_width:350,  // 增加宽度以完整显示 IPv6 地址
        watermark_height:100,  // 增加高度以适应更多内容
        watermark_angle:15
    };
    
    // 【核心修复】合并配置时，优先使用最近一次缓存的配置，避免无参重绘时丢失样式
    var settings = mergeObjects(defaultSettings, lastWatermarkConfig)
    
    // 获取页面最大宽度
    var page_width = Math.max(water.scrollWidth,water.clientWidth);
    // 获取页面最大高度
    var page_height = Math.max(water.scrollHeight,water.clientHeight);

    // 水印数量自适应元素区域尺寸
    settings.watermark_cols=Math.ceil(page_width/(settings.watermark_x_space+settings.watermark_width));
    settings.watermark_rows=Math.ceil(page_height/(settings.watermark_y_space+settings.watermark_height));
    var x;
    var y;
    for (var i = 0; i < settings.watermark_rows; i++) {
        y = settings.watermark_y + (settings.watermark_y_space + settings.watermark_height) * i;
        for (var j = 0; j < settings.watermark_cols; j++) {
            x = settings.watermark_x + (settings.watermark_width + settings.watermark_x_space) * j;
            var mask_div = document.createElement('div');
            mask_div.className = 'mask_div';
            mask_div.innerHTML=(settings.watermark_txt);
            
            // 设置水印div倾斜显示
            mask_div.style.webkitTransform = "rotate(-" + settings.watermark_angle + "deg)";
            mask_div.style.MozTransform = "rotate(-" + settings.watermark_angle + "deg)";
            mask_div.style.msTransform = "rotate(-" + settings.watermark_angle + "deg)";
            mask_div.style.OTransform = "rotate(-" + settings.watermark_angle + "deg)";
            mask_div.style.transform = "rotate(-" + settings.watermark_angle + "deg)";
            mask_div.style.visibility = "";
            mask_div.style.position = "absolute";
            mask_div.style.left = x + 'px';
            mask_div.style.top = y + 'px';
            mask_div.style.overflow = "hidden";
            mask_div.style.zIndex = "9999";
            mask_div.style.pointerEvents='none';
            mask_div.style.opacity = settings.watermark_alpha;
            mask_div.style.fontSize = settings.watermark_fontsize;
            mask_div.style.fontFamily = settings.watermark_font;
            mask_div.style.color = settings.watermark_color;
            mask_div.style.textAlign = "center";
            mask_div.style.width = settings.watermark_width + 'px';
            mask_div.style.height = settings.watermark_height + 'px';
            mask_div.style.display = "block";
            water.appendChild(mask_div);
        }
    }
    insertXHLStyle(`
        #water-div{pointer-events:none;position:fixed;top:0;left:0;right:0;bottom:0;}
        .mask_div{pointer-events:none;}
    `);
}
/**
 * @description 给html中添加style标签
 * @param {string} styleStr 
 */
function insertXHLStyle(styleStr) {
    if (document.all) { // document.createStyleSheet(url)
        window.customStyle = styleStr;
        document.createStyleSheet("javascript:customStyle");
    } else { //document.createElement(style)
        var styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        var styleTextNode = document.createTextNode(styleStr);
        styleNode.appendChild(styleTextNode);
        document.getElementsByTagName('HEAD').item(0).appendChild(styleNode);
    }
}
/**
 * @description 移除水印功能，防止重复渲染
 * @param {string} boxId 
 */
function removeWatermark(boxId){
    let water_div = document.getElementById(boxId)
    if(water_div){
        document.body.removeChild(water_div)
    }
}
/**
 * @description 合并默认配置和传入的配置，传入配置的优先级高于默认
 * @param {*} A 默认配置
 * @param {*} B 传入的配置
 * @returns 合并后的配置
 */
function mergeObjects(A, B) {
    let result = Object.assign({}, A);
    
    for (let key in B) {
        if (B[key]) {
            result[key] = B[key];
        }
    }
    
    return result;
}
(function() {
    // ==========================================
    // 1. 创建 UI 元素：自定义提示框 (Toast) 与 模糊遮罩
    // ==========================================

    // 创建“禁止截图”提示框
    const toastMessage = document.createElement('div');
    toastMessage.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
        z-index: 2147483647; /* 确保在最顶层 */
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
    `;
    toastMessage.innerText = "此页面禁止截图与调试";
    document.body.appendChild(toastMessage);

    // 显示提示框的函数
    let toastTimeout;
    function showWarning() {
        toastMessage.style.opacity = '1';
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastMessage.style.opacity = '0';
        }, 3000);
    }

    // 创建失去焦点时的模糊遮罩
    const blurMask = document.createElement('div');
    blurMask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(15px); /* 高斯模糊效果 */
        -webkit-backdrop-filter: blur(15px);
        z-index: 2147483646;
        display: none; /* 默认隐藏 */
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #333;
    `;
    blurMask.innerHTML = `
        <h1 style="font-size: 28px; margin-bottom: 10px;">页面已受保护</h1>
        <p style="font-size: 16px;">检测到窗口失去焦点，为保护数据安全，已暂停显示内容。</p>
    `;
    document.body.appendChild(blurMask);

    // 用于存储页面的原始 HTML 内容
    let originalBodyHTML = null;


    // ==========================================
    // 2. 拦截可控的按键事件
    // ==========================================

    // 拦截 Keydown 事件 (F12, Ctrl+Shift+I, Ctrl+P等)
    window.addEventListener('keydown', function(e) {
        // 判断是否是 F12
        const isF12 = e.key === 'F12' || e.keyCode === 123;
        
        // 判断是否是 Ctrl+P / Cmd+P (打印)
        const isPrint = (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P');(e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's');
        
        // 判断是否是 Ctrl+Shift+I / Cmd+Option+I (开发者工具)
        const isDevTools = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I');

        if (isF12 || isPrint || isDevTools) {
            e.preventDefault();
            e.stopPropagation();
            showWarning();
            return false;
        }
    }, { capture: true }); // 使用捕获阶段，防止被其他脚本阻止

    // 拦截 PrintScreen (PrtScn)
    // 注意：PrtScn 通常在 keyup 阶段触发，且无法阻止系统把图像存入剪贴板
    // 但我们可以清除剪贴板内容并给予警告
    window.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            showWarning();
            
            // 尝试清空剪贴板（需要页面在 HTTPS 环境且用户授权过剪贴板权限）
            try {
                navigator.clipboard.writeText('此页面内容受版权保护，禁止截图。');
            } catch (err) {
                // 忽略错误
            }
        }
    });


    // ==========================================
    // 3. 页面失焦/聚焦检测（防御系统级截图的核心）
    // ==========================================

    // 辅助函数：隐藏除遮罩外的所有内容（从 DOM 中移除）
    function hideAllContent() {
        if (originalBodyHTML !== null) return; // 已经隐藏过了
        
        // 保存当前 body 的完整 HTML（排除 blurMask）
        const tempDiv = document.createElement('div');
        const allChildren = Array.from(document.body.children);
        
        allChildren.forEach(child => {
            if (child !== blurMask) {
                tempDiv.appendChild(child.cloneNode(true));
            }
        });
        
        originalBodyHTML = tempDiv.innerHTML;
        
        // 清空 body 中除了 blurMask 之外的所有元素
        allChildren.forEach(child => {
            if (child !== blurMask) {
                child.remove();
            }
        });
    }

    // 辅助函数：恢复所有被隐藏的内容
    function showAllContent() {
        if (originalBodyHTML === null) return; // 没有需要恢复的内容
        
        // 创建临时容器解析 HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalBodyHTML;
        
        // 将恢复的元素插入到 blurMask 之前
        const children = Array.from(tempDiv.children);
        children.forEach(child => {
            document.body.insertBefore(child, blurMask);
        });
        
        // 清空缓存
        originalBodyHTML = null;
    }

    window.addEventListener('blur', function() {
        // 窗口失去焦点（包含用户点击浏览器外部、呼出 Win+Shift+S / Mac 截图工具等情况）
        hideAllContent();
        blurMask.style.display = 'flex';
    });

    window.addEventListener('focus', function() {
        // 窗口重新获得焦点
        showAllContent();
        blurMask.style.display = 'none';
    });

    // 补充：针对某些情况下的页面可见性 API 检测 (切换标签页)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            hideAllContent();
            blurMask.style.display = 'flex';
        } else {
            // 只有当窗口也拥有焦点时才解除遮罩
            if (document.hasFocus()) {
                showAllContent();
                blurMask.style.display = 'none';
            }
        }
    });

})();
