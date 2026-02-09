/**
 * sidebar-script.js
 * 側邊欄相關的功能腳本，處理側邊欄的展開/收起與選單互動
 */

// 側邊欄狀態變數
let sidebarState = {
    collapsed: false,
    activeMenu: null
};

/**
 * 初始化側邊欄
 * 綁定事件並恢復之前的狀態
 */
function initSidebar() {
    // 從 localStorage 恢復狀態
    loadSidebarState();
    
    // 綁定漢堡選單切換事件
    bindMenuToggle();
    
    // 綁定選單項目點擊事件
    bindMenuItems();
    
    // 綁定子選單項目點擊事件
    bindSubmenuItems();
    
    // 設置 tooltip 屬性
    setMenuTooltips();
}

/**
 * 從 localStorage 載入側邊欄狀態
 */
function loadSidebarState() {
    const savedState = localStorage.getItem('adminSidebarState');
    if (savedState) {
        try {
            sidebarState = JSON.parse(savedState);
            
            // 應用收合狀態
            if (sidebarState.collapsed) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.add('collapsed');
                }
            }
            
            // 恢復展開的選單
            if (sidebarState.activeMenu) {
                const menuHeader = document.querySelector(`[data-menu="${sidebarState.activeMenu}"]`);
                if (menuHeader) {
                    menuHeader.parentElement.classList.add('active');
                }
            }
        } catch (error) {
            console.error('無法解析側邊欄狀態:', error);
        }
    }
}

/**
 * 儲存側邊欄狀態到 localStorage
 */
function saveSidebarState() {
    localStorage.setItem('adminSidebarState', JSON.stringify(sidebarState));
}

/**
 * 綁定漢堡選單切換事件
 */
function bindMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            sidebarState.collapsed = sidebar.classList.contains('collapsed');
            saveSidebarState();
            
            // 觸發視窗調整事件，讓內容區重新計算
            window.dispatchEvent(new Event('resize'));
        });
    }
}

/**
 * 綁定選單項目點擊事件
 */
function bindMenuItems() {
    const menuHeaders = document.querySelectorAll('.menu-header');
    
    menuHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            
            const menuItem = this.parentElement;
            const menuName = this.getAttribute('data-menu');
            const isActive = menuItem.classList.contains('active');
            
            // 收合所有其他選單
            const allMenuItems = document.querySelectorAll('.menu-item');
            allMenuItems.forEach(item => {
                if (item !== menuItem) {
                    item.classList.remove('active');
                }
            });
            
            // 切換當前選單
            if (isActive) {
                menuItem.classList.remove('active');
                sidebarState.activeMenu = null;
            } else {
                menuItem.classList.add('active');
                sidebarState.activeMenu = menuName;
            }
            
            saveSidebarState();
        });
    });
}

/**
 * 綁定子選單項目點擊事件
 */
function bindSubmenuItems() {
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除其他項目的 active 狀態
            submenuItems.forEach(subItem => {
                subItem.classList.remove('active');
            });
            
            // 設置當前項目為 active
            this.classList.add('active');
            
            // 取得對應的內容區段 ID
            const sectionId = this.getAttribute('data-section');
            
            // 如果有對應的區段，顯示它
            if (sectionId && typeof showContentSection === 'function') {
                showContentSection(sectionId);
            }
        });
    });
}

/**
 * 設置選單 tooltip（用於收合狀態）
 */
function setMenuTooltips() {
    const menuHeaders = document.querySelectorAll('.menu-header');
    
    menuHeaders.forEach(header => {
        const menuText = header.querySelector('.menu-text');
        if (menuText) {
            header.setAttribute('data-tooltip', menuText.textContent);
        }
    });
}

/**
 * 切換側邊欄展開/收合
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        sidebarState.collapsed = sidebar.classList.contains('collapsed');
        saveSidebarState();
    }
}

/**
 * 展開指定的選單
 * @param {string} menuName - 選單名稱
 */
function expandMenu(menuName) {
    const menuHeader = document.querySelector(`[data-menu="${menuName}"]`);
    if (menuHeader) {
        const menuItem = menuHeader.parentElement;
        
        // 收合其他選單
        const allMenuItems = document.querySelectorAll('.menu-item');
        allMenuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // 展開指定選單
        menuItem.classList.add('active');
        sidebarState.activeMenu = menuName;
        saveSidebarState();
    }
}

/**
 * 設置當前活動的子選單項目
 * @param {string} sectionId - 區段 ID
 */
function setActiveSubmenuItem(sectionId) {
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    submenuItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
            
            // 確保父選單也是展開狀態
            const parentMenu = item.closest('.menu-item');
            if (parentMenu) {
                parentMenu.classList.add('active');
            }
        } else {
            item.classList.remove('active');
        }
    });
}

// 響應式處理：在小螢幕上點擊內容區時收合側邊欄
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('show');
    }
});

// 監聽視窗大小變化
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 768 && sidebar) {
        sidebar.classList.remove('show');
    }
});
