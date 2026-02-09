/**
 * main-script.js
 * 主要腳本檔案，處理全域事件與初始化
 */

// 當 DOM 載入完成後執行初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('JoinTime 前台系統已初始化');
    
    // 初始化側邊欄
    initSidebar();
    
    // 初始化首頁
    initHome();
    
    // 初始化 KM 系統
    initKM();
    
    // 設置導航項目的 tooltip
    setNavTooltips();
});

/**
 * 設置導航項目的 tooltip
 */
function setNavTooltips() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const text = item.querySelector('span');
        if (text) {
            item.setAttribute('data-tooltip', text.textContent);
        }
    });
}

/**
 * 頁面切換功能
 * @param {string} pageId - 頁面 ID
 */
function gotoPage(pageId) {
    // 隱藏所有頁面
    const allPages = document.querySelectorAll('.page-section');
    allPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // 顯示目標頁面
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    // 更新導航項目狀態
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });
    
    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 開啟 Modal
 * @param {string} modalId - Modal ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * 關閉 Modal
 * @param {string} modalId - Modal ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// 點擊 Modal 背景關閉
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// ESC 鍵關閉 Modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }
});

/**
 * 全域工具函式：顯示通知訊息
 * @param {string} message - 訊息內容
 * @param {string} type - 訊息類型 (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // 建立通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // 加入頁面
    document.body.appendChild(notification);
    
    // 3秒後移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * 全域工具函式：格式化日期
 * @param {Date|string} date - 日期物件或字串
 * @param {string} format - 格式化模式
 * @returns {string} - 格式化後的日期字串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
