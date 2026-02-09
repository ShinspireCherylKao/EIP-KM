/**
 * sidebar-script.js
 * 側邊欄相關的功能腳本，處理側邊欄的展開/收起與互動
 */

// 側邊欄狀態變數
let sidebarState = {
    collapsed: false,
    activeMenuItem: null
};

/**
 * 初始化側邊欄
 * 從本地存儲獲取側邊欄狀態，並設置預設活動的菜單項目
 */
function initSidebar() {
    // 嘗試從 localStorage 獲取側邊欄狀態
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            sidebarState = { ...sidebarState, ...parsedState };
            
            // 如果之前是收起狀態，則應用收起樣式
            if (sidebarState.collapsed) {
                document.querySelector('.sidebar').classList.add('collapsed');
            }
        } catch (error) {
            console.error('無法解析儲存的側邊欄狀態:', error);
        }
    }
    
    // 設置預設活動的菜單項目
    setActiveMenuItem();
}

/**
 * 設置活動的菜單項目
 * 根據 URL 或記憶的狀態設置
 */
function setActiveMenuItem() {
    // 獲取所有菜單項
    const menuItems = document.querySelectorAll('.menu-item');
    
    // 如果有儲存的活動菜單項，使用它
    if (sidebarState.activeMenuItem) {
        const savedActiveItem = document.querySelector(`.menu-item:nth-child(${sidebarState.activeMenuItem})`);
        if (savedActiveItem) {
            savedActiveItem.classList.add('active');
            
            // 取得該菜單項下第一個子項目並激活它
            const firstSubItem = savedActiveItem.querySelector('.submenu-item');
            if (firstSubItem) {
                firstSubItem.classList.add('active');
            }
            
            return;
        }
    }
    
    // 預設激活第一個菜單項
    if (menuItems.length > 0) {
        menuItems[0].classList.add('active');
        
        // 取得第一個菜單項下的第一個子項目並激活它
        const firstSubItem = menuItems[0].querySelector('.submenu-item');
        if (firstSubItem) {
            firstSubItem.classList.add('active');
        }
        
        // 儲存活動菜單項索引（以1為基礎）
        sidebarState.activeMenuItem = 1;
        saveSidebarState();
    }
}

/**
 * 切換側邊欄的展開/收起狀態
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    
    // 更新狀態並保存
    sidebarState.collapsed = sidebar.classList.contains('collapsed');
    saveSidebarState();
}

/**
 * 切換菜單項的展開/收起狀態
 * @param {Event} e - 點擊事件
 */
function toggleMenuItem(e) {
    e.preventDefault();
    
    // 獲取當前點擊的菜單項容器
    const menuItem = this.parentElement;
    
    // 獲取所有菜單項
    const menuItems = document.querySelectorAll('.menu-item');
    
    // 獲取點擊的菜單項索引（以1為基礎）
    let clickedIndex = 1;
    menuItems.forEach((item, index) => {
        if (item === menuItem) {
            clickedIndex = index + 1;
        }
    });
    
    // 如果點擊的是當前活動項目，則只切換展開/收起狀態
    if (menuItem.classList.contains('active')) {
        menuItem.classList.toggle('active');
        
        // 如果收起了活動項目，則清除活動菜單項狀態
        if (!menuItem.classList.contains('active')) {
            sidebarState.activeMenuItem = null;
        } else {
            sidebarState.activeMenuItem = clickedIndex;
        }
        
        saveSidebarState();
        return;
    }
    
    // 將所有菜單項設為非活動狀態
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 將點擊的菜單項設為活動狀態
    menuItem.classList.add('active');
    
    // 儲存活動菜單項索引
    sidebarState.activeMenuItem = clickedIndex;
    saveSidebarState();
    
    // 取得該菜單項下第一個子項目並激活它
    const firstSubItem = menuItem.querySelector('.submenu-item');
    if (firstSubItem) {
        document.querySelectorAll('.submenu-item').forEach(item => {
            item.classList.remove('active');
        });
        firstSubItem.classList.add('active');
        
        // 獲取對應的內容區塊ID並顯示
        const targetSection = firstSubItem.getAttribute('data-section');
        if (targetSection) {
            showContentSection(targetSection);
            
            // 更新麵包屑導航
            updateBreadcrumb(firstSubItem.textContent);
        }
    }
}

/**
 * 保存側邊欄狀態到本地存儲
 */
function saveSidebarState() {
    try {
        localStorage.setItem('sidebarState', JSON.stringify(sidebarState));
    } catch (error) {
        console.error('無法儲存側邊欄狀態:', error);
    }
}

/**
 * 處理移動裝置上側邊欄的顯示/隱藏
 * @param {boolean} show - 是否顯示側邊欄
 */
function handleMobileSidebar(show) {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.menu-overlay');
    
    if (show) {
        sidebar.classList.add('mobile-show');
        
        // 創建遮罩層（如果不存在）
        if (!overlay) {
            const overlayDiv = document.createElement('div');
            overlayDiv.className = 'menu-overlay';
            document.body.appendChild(overlayDiv);
            
            // 點擊遮罩層隱藏側邊欄
            overlayDiv.addEventListener('click', function() {
                handleMobileSidebar(false);
            });
        }
        
        // 顯示遮罩層
        document.querySelector('.menu-overlay').classList.add('show');
    } else {
        sidebar.classList.remove('mobile-show');
        
        // 隱藏遮罩層
        if (overlay) {
            overlay.classList.remove('show');
        }
    }
}

// 監聽視窗大小變化，處理響應式側邊欄
window.addEventListener('resize', function() {
    const isMobile = window.innerWidth <= 768;
    const sidebar = document.querySelector('.sidebar');
    
    if (isMobile) {
        if (!sidebar.classList.contains('mobile-initialized')) {
            // 設置移動裝置專用類別
            sidebar.classList.add('mobile-initialized');
            
            // 確保側邊欄一開始是隱藏的
            sidebar.classList.remove('mobile-show');
            
            // 修改菜單按鈕的事件處理
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                // 清除原有事件監聽器（這是簡化處理，實際可能需要更複雜的處理）
                menuToggle.onclick = null;
                
                // 添加新的事件處理
                menuToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMobileSidebar(true);
                });
            }
        }
    } else {
        // 非移動裝置模式
        sidebar.classList.remove('mobile-initialized');
        sidebar.classList.remove('mobile-show');
        
        // 移除遮罩層
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        // 恢復菜單按鈕的原有功能
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            // 清除原有事件監聽器
            menuToggle.onclick = null;
            
            // 重新添加折疊事件
            menuToggle.addEventListener('click', toggleSidebar);
        }
    }
});
