/**
 * sidebar-script.js
 * 側邊欄相關的功能腳本
 */

// 側邊欄狀態
let sidebarCollapsed = false;

/**
 * 初始化側邊欄
 */
function initSidebar() {
    // 從 localStorage 恢復狀態
    const savedState = localStorage.getItem('sidebarCollapsed');
    const sidebar = document.getElementById('sidebar');
    if (savedState === 'true') {
        sidebarCollapsed = true;
        if (sidebar) {
            sidebar.classList.add('collapsed');
        }
    }
    
    // 綁定漢堡選單事件
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // 響應式處理
    handleResponsiveSidebar();
    window.addEventListener('resize', handleResponsiveSidebar);
}

/**
 * 切換側邊欄
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebar) return;
    
    if (window.innerWidth <= 640) {
        // 手機版：顯示/隱藏
        sidebar.classList.toggle('show');
        if (sidebarContainer) {
            sidebarContainer.classList.toggle('mobile-open');
        }
    } else {
        // 桌面版：收合/展開
        sidebar.classList.toggle('collapsed');
        sidebarCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }
}

/**
 * 響應式側邊欄處理
 */
function handleResponsiveSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebar) return;
    
    if (window.innerWidth <= 640) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.remove('show');
        if (sidebarContainer) sidebarContainer.classList.remove('mobile-open');
    } else if (window.innerWidth <= 960) {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('show');
    } else {
        sidebar.classList.remove('show');
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }
}

// 點擊內容區關閉手機版側邊欄
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (window.innerWidth <= 640 && 
        sidebar && 
        menuToggle &&
        sidebar.classList.contains('show') && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('show');
        const sidebarContainer = document.getElementById('sidebar-container');
        if (sidebarContainer) sidebarContainer.classList.remove('mobile-open');
    }
});
