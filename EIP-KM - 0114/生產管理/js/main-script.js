/**
 * main-script.js
 * 主要腳本檔案，包含頁面初始化和共通功能
 */

// 當文檔加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化頁面
    initPage();
    
    // 註冊事件監聽
    registerEventListeners();
});

/**
 * 頁面初始化函數
 */
function initPage() {
    // 設置預設日期範圍
    setDefaultDateRange();
    
    // 初始化側邊欄狀態
    initSidebar();
    
    // 預設顯示第一個內容區塊
    showContentSection('serial-management');
    
    console.log('頁面初始化完成');
}

/**
 * 設置預設的日期範圍（當月第一天到今天）
 */
function setDefaultDateRange() {
    // 獲取當前日期
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // 格式化日期 YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // 設置日期選擇器的值
    const startDateEl = document.getElementById('start-date');
    const endDateEl = document.getElementById('end-date');
    
    if (startDateEl && endDateEl) {
        startDateEl.value = formatDate(firstDayOfMonth);
        endDateEl.value = formatDate(today);
    }
}

/**
 * 註冊頁面中所有需要的事件監聽器
 */
function registerEventListeners() {
    // 側邊欄切換按鈕
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // 菜單項目點擊展開/收起
    const menuHeaders = document.querySelectorAll('.menu-header');
    menuHeaders.forEach(header => {
        header.addEventListener('click', toggleMenuItem);
    });
    
    // 子菜單項目點擊
    const submenuItems = document.querySelectorAll('.submenu-item');
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有子菜單項目的活動狀態
            document.querySelectorAll('.submenu-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // 添加當前項目的活動狀態
            this.classList.add('active');
            
            // 獲取對應的內容區塊ID
            const targetSection = this.getAttribute('data-section');
            if (targetSection) {
                showContentSection(targetSection);
                
                // 更新麵包屑導航
                updateBreadcrumb(this.textContent);
            }
        });
    });
    
    // 全選/取消全選
    const selectAllCheckbox = document.querySelector('.select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
    
    // 登出按鈕
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 浮動操作按鈕
    const floatBtn = document.querySelector('.float-action-btn');
    if (floatBtn) {
        floatBtn.addEventListener('click', showHelpModal);
    }
    
    console.log('事件監聽器註冊完成');
}

/**
 * 顯示指定的內容區塊，隱藏其他區塊
 * @param {string} sectionId - 要顯示的區塊ID
 */
function showContentSection(sectionId) {
    // 隱藏所有內容區塊
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // 顯示指定的區塊
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.warn(`區塊 ${sectionId} 不存在`);
    }
}

/**
 * 更新麵包屑導航
 * @param {string} currentPageTitle - 當前頁面標題
 */
function updateBreadcrumb(currentPageTitle) {
    const breadcrumbLastSpan = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbLastSpan) {
        breadcrumbLastSpan.textContent = currentPageTitle;
    }
}

/**
 * 處理登出功能
 * @param {Event} e - 點擊事件
 */
function handleLogout(e) {
    e.preventDefault();
    
    // 在實際應用中這裡會調用登出API
    // 暫時使用確認視窗模擬
    const confirmLogout = confirm('確定要登出系統嗎？');
    if (confirmLogout) {
        console.log('使用者登出');
        // 重定向到登入頁面或進行其他登出操作
        // window.location.href = 'login.html';
    }
}

/**
 * 顯示幫助模態窗口
 */
function showHelpModal() {
    // 設置模態窗口內容
    const modal = document.getElementById('generalModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    modalTitle.textContent = '系統幫助';
    modalBody.innerHTML = `
        <div style="padding: 10px;">
            <h4>製程與資產管理平台使用指南</h4>
            <p>本平台提供了完整的生產管理功能，包括產品序號管理、包裝號管理、箱號管理等。</p>
            <ul style="margin-top: 15px; padding-left: 20px;">
                <li>左側邊欄包含所有功能分類</li>
                <li>點擊功能項目可展開子功能選單</li>
                <li>表格資料可透過上方搜尋與篩選功能進行過濾</li>
                <li>如需進一步協助，請聯繫系統管理員</li>
            </ul>
        </div>
    `;
    
    // 顯示模態窗口
    showModal(modal);
}

/**
 * 顯示模態窗口
 * @param {HTMLElement} modal - 模態窗口元素
 */
function showModal(modal) {
    if (!modal) return;
    
    modal.classList.add('show');
    
    // 註冊關閉按鈕事件
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            hideModal(modal);
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            hideModal(modal);
        };
    }
    
    // 點擊模態窗口外部也可關閉
    modal.onclick = function(e) {
        if (e.target === modal) {
            hideModal(modal);
        }
    };
}

/**
 * 隱藏模態窗口
 * @param {HTMLElement} modal - 模態窗口元素
 */
function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
}

/**
 * 全選/取消全選表格中的所有行
 * @param {Event} e - 改變事件
 */
function toggleSelectAll(e) {
    const isChecked = e.target.checked;
    const rowCheckboxes = document.querySelectorAll('.row-select');
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}
