// 用户协议功能模块
(function() {
    'use strict';

    const USER_AGREEMENT_URL = 'useragreement.json';
    const COOKIE_NAME = 'user_agreement_version';
    
    // 获取Cookie值
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    // 设置Cookie值
    function setCookie(name, value) {
        const expires = new Date('2999-12-31T23:59:59Z').toUTCString();
        document.cookie = `${name}=${value};expires=${expires};path=/`;
    }
    
    // 获取用户已同意的协议版本
    function getAgreedVersion() {
        const version = getCookie(COOKIE_NAME);
        return version ? parseInt(version, 10) : null;
    }
    
    // 保存用户同意的协议版本
    function saveAgreedVersion(version) {
        setCookie(COOKIE_NAME, version.toString());
    }
    
    // 创建用户协议弹窗HTML
    function createUserAgreementModal() {
        const modal = document.createElement('div');
        modal.id = 'user-agreement-modal';
        modal.className = 'modal user-agreement-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>用户协议</h3>
                </div>
                <div class="modal-body" id="user-agreement-body">
                    <!-- 用户协议内容将在这里动态插入 -->
                </div>
                <div class="modal-footer" id="user-agreement-footer">
                    <button class="btn btn-decline" id="ua-decline-btn">不同意</button>
                    <button class="btn btn-agree" id="ua-agree-btn">同意</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 绑定按钮事件
        const agreeBtn = document.getElementById('ua-agree-btn');
        const declineBtn = document.getElementById('ua-decline-btn');
        
        agreeBtn.addEventListener('click', handleAgree);
        declineBtn.addEventListener('click', handleDecline);
        
        // 禁止点击背景关闭（必须明确选择）
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                e.stopPropagation();
            }
        });
        
        return modal;
    }
    
    // 处理同意按钮点击
    function handleAgree() {
        const latestVersion = window.currentAgreementVersion;
        if (latestVersion) {
            saveAgreedVersion(latestVersion);
        }
        closeUserAgreementModal();
    }
    
    // 处理不同意按钮点击
    function handleDecline() {
        // 关闭当前标签页
        window.open('', '_self').close();
        // 如果上述方法不起作用，尝试重定向到空白页
        window.location.href = 'about:blank';
    }
    
    // 关闭用户协议弹窗
    function closeUserAgreementModal() {
        const modal = document.getElementById('user-agreement-modal');
        if (modal) {
            modal.classList.remove('modal-active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    // 显示用户协议弹窗
    function showUserAgreementModal() {
        const modal = document.getElementById('user-agreement-modal');
        if (modal) {
            modal.style.display = 'flex';
            // 触发动画
            setTimeout(() => {
                modal.classList.add('modal-active');
            }, 10);
        }
    }
    
    // 渲染用户协议内容
    function renderUserAgreement(content) {
        const agreementBody = document.getElementById('user-agreement-body');
        if (!agreementBody || !content || content.length === 0) return;
        
        agreementBody.innerHTML = content.join('');
    }
    
    // 从服务器获取用户协议
    async function fetchUserAgreement() {
        try {
            const response = await fetch(USER_AGREEMENT_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取用户协议失败:', error);
            return null;
        }
    }
    
    // 检查是否需要显示用户协议
    function shouldShowAgreement(currentVersion) {
        const agreedVersion = getAgreedVersion();
        
        // 如果从未同意过，或者版本不一致，则需要显示
        return agreedVersion === null || agreedVersion !== currentVersion;
    }
    
    // 初始化用户协议系统
    async function initUserAgreementSystem() {
        // 创建弹窗
        createUserAgreementModal();
        
        // 获取用户协议数据
        const agreementData = await fetchUserAgreement();
        if (!agreementData) {
            console.error('无法加载用户协议，默认允许访问');
            return;
        }
        
        const currentVersion = agreementData.version;
        const content = agreementData.content;
        
        // 保存当前版本号供全局使用
        window.currentAgreementVersion = currentVersion;
        
        // 检查是否需要显示协议
        if (shouldShowAgreement(currentVersion)) {
            // 渲染协议内容
            renderUserAgreement(content);
            // 显示弹窗
            showUserAgreementModal();
        }
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUserAgreementSystem);
    } else {
        initUserAgreementSystem();
    }
})();
