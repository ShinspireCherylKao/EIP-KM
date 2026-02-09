/**
 * main-script.js
 * 主要腳本檔案，處理全域事件與初始化
 */

// 當 DOM 載入完成後執行初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('後台管理系統已初始化');
    
    // 初始化側邊欄
    initSidebar();
    
    // 初始化內容區域
    initContent();
    
    // 綁定登出按鈕事件
    bindLogoutEvent();
});

/**
 * 初始化內容區域
 * 設置預設顯示的內容區段
 */
function initContent() {
    // 預設顯示首頁內容
    showContentSection('home-content');
}

/**
 * 顯示指定的內容區段
 * @param {string} sectionId - 區段的 ID
 */
function showContentSection(sectionId) {
    // 隱藏所有內容區段
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 顯示指定的區段
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

/**
 * 綁定登出按鈕事件
 */
function bindLogoutEvent() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('確定要登出系統嗎？')) {
                // 這裡可以加入登出邏輯
                console.log('使用者已登出');
                // window.location.href = '/login';
                alert('已登出系統');
            }
        });
    }
}

/**
 * 全域工具函式：顯示通知訊息
 * @param {string} message - 訊息內容
 * @param {string} type - 訊息類型 (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // 建立通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // 加入頁面
    document.body.appendChild(notification);
    
    // 顯示動畫
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒後移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * 取得通知圖示
 * @param {string} type - 通知類型
 * @returns {string} - Font Awesome 圖示類別
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * 全域工具函式：格式化日期
 * @param {Date|string} date - 日期物件或字串
 * @param {string} format - 格式化模式
 * @returns {string} - 格式化後的日期字串
 */
function formatDate(date, format = 'YYYY/MM/DD') {
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
