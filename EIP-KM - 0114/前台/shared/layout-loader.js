/**
 * layout-loader.js
 * 載入共用的 header 和 sidebar 元素
 */

const HEADER_FALLBACK_HTML = `<!-- 頂部導航欄 -->
<header class="top-header">
    <div class="header-left">
        <button class="menu-toggle" id="menuToggle">
            <i class="fa-solid fa-bars"></i>
        </button>
        <h1 class="header-title">Vera EIP (DEV)</h1>
    </div>

    <div class="header-right">
        <!-- 搜尋框 -->
        <div class="search-box">
            <input type="text" placeholder="請輸入關鍵字" id="globalSearch">
            <button class="search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
        
        <!-- 語言選擇 -->
        <div class="language-selector">
            <span>繁體中...</span>
            <i class="fa-solid fa-chevron-down"></i>
        </div>
        
        <!-- 使用者資訊 -->
        <div class="user-info">
            <div class="user-avatar">
                <i class="fa-solid fa-house"></i>
            </div>
            <span class="user-name">Miranda</span>
        </div>
    </div>
</header>`;

const SIDEBAR_FALLBACK_HTML = `<!-- 側邊欄 -->
<aside class="sidebar" id="sidebar">
    <nav class="sidebar-nav">
        <!-- 公佈欄 -->
        <a href="index.html" class="nav-item" data-page="home">
            <i class="fa-solid fa-bullhorn"></i>
            <span>公佈欄*</span>
        </a>

        <!-- 物品領用 -->
        <a href="#" class="nav-item" data-page="items">
            <i class="fa-solid fa-box-open"></i>
            <span>物品領用</span>
        </a>

        <!-- 投票問券 -->
        <a href="#" class="nav-item" data-page="vote">
            <i class="fa-solid fa-square-poll-vertical"></i>
            <span>投票問券</span>
        </a>

        <!-- 待辦事項 -->
        <a href="#" class="nav-item" data-page="todo">
            <i class="fa-solid fa-list-check"></i>
            <span>待辦事項</span>
        </a>

        <!-- 通訊錄 -->
        <a href="index.html?page=contacts" class="nav-item" data-page="contacts">
            <i class="fa-solid fa-address-book"></i>
            <span>通訊錄</span>
        </a>

        <!-- 影音相簿 -->
        <a href="#" class="nav-item" data-page="media">
            <i class="fa-solid fa-photo-film"></i>
            <span>影音相簿</span>
        </a>

        <!-- 檔案中心（文件庫管理） -->
        <a href="km-recent.html" class="nav-item" data-page="km">
            <i class="fa-solid fa-folder-tree"></i>
            <span>文件庫管理</span>
        </a>

        <!-- KM 知識管理 -->
        <a href="km-knowledge.html" class="nav-item" data-page="km-knowledge">
            <i class="fa-solid fa-brain"></i>
            <span>KM 知識管理</span>
        </a>

        <!-- 組織圖 -->
        <a href="org-chart.html" class="nav-item" data-page="org-chart">
            <i class="fa-solid fa-sitemap"></i>
            <span>組織圖</span>
        </a>

        <!-- 投影機 -->
        <a href="#" class="nav-item" data-page="projector">
            <i class="fa-solid fa-tv"></i>
            <span>投影機</span>
        </a>

        <!-- 按摩預約 -->
        <a href="#" class="nav-item" data-page="massage">
            <i class="fa-solid fa-spa"></i>
            <span>按摩預約</span>
        </a>

        <!-- 電子表單申請 -->
        <a href="#" class="nav-item" data-page="eform-apply">
            <i class="fa-solid fa-file-signature"></i>
            <span>電子表單申請*</span>
        </a>

        <!-- 電子表單簽核 -->
        <a href="#" class="nav-item" data-page="eform-sign">
            <i class="fa-solid fa-file-circle-check"></i>
            <span>電子表單簽核</span>
        </a>

        <!-- 投票問券 (重複項) -->
        <a href="#" class="nav-item" data-page="survey">
            <i class="fa-solid fa-clipboard-question"></i>
            <span>投票問券</span>
        </a>

        <!-- IT 服務區 -->
        <a href="#" class="nav-item" data-page="it-service">
            <i class="fa-solid fa-headset"></i>
            <span>IT 服務區</span>
        </a>

        <!-- 會議管理 -->
        <a href="#" class="nav-item" data-page="meeting">
            <i class="fa-solid fa-calendar-check"></i>
            <span>會議管理</span>
        </a>

        <!-- 活動預約 -->
        <a href="#" class="nav-item" data-page="activity">
            <i class="fa-solid fa-calendar-days"></i>
            <span>活動預約</span>
        </a>
    </nav>
</aside>`;

const KM_NAV_FALLBACK_HTML = `<div class="km-nav">
    <a href="km-recent.html" class="km-nav-btn" data-km-page="my-space">
        <i class="fa-solid fa-folder"></i> 近期存取
    </a>
    <a href="km-my-org.html" class="km-nav-btn" data-km-page="org">
        <i class="fa-solid fa-building"></i> 共享部門
    </a>
    <!-- 暫時隱藏「我的」按鈕
    <a href="km-my.html" class="km-nav-btn" data-km-page="my">
        <i class="fa-solid fa-user"></i> 我的
    </a>
    -->
</div>

<script>
// 設置 KM 導航的 active 狀態
(function() {
    const currentPage = window.location.pathname.split('/').pop();
    const pageMap = {
        'km-recent.html': 'my-space',
        'km-my-org.html': 'org',
        'km-my.html': 'my'
    };
    
    const currentKmPage = pageMap[currentPage];
    if (currentKmPage) {
        const activeBtn = document.querySelector(\`.km-nav-btn[data-km-page="\${currentKmPage}"]\`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
})();
</script>`;

const KM_KNOWLEDGE_NAV_FALLBACK_HTML = `<div class="km-nav">
    <a href="km-knowledge.html" class="km-nav-btn" data-km-page="km-home">
        <i class="fa-solid fa-brain"></i> 知識總覽
    </a>
    <a href="km-shares.html" class="km-nav-btn" data-km-page="shares" style="display:none;">
        <i class="fa-solid fa-share-nodes"></i> 分享中心
    </a>
    <div class="km-nav-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" id="kmSearchInput" placeholder="搜尋知識庫文章…"
               onkeydown="if(event.key==='Enter'){event.preventDefault();window.location.href='km-search.html?q='+encodeURIComponent(this.value);}">
    </div>
    <span class="km-nav-spacer"></span>
    <a href="km-ai.html" class="km-nav-btn ai-btn" data-km-page="ai">
        <i class="fa-solid fa-bolt"></i><span class="nav-label-full"> AI 加值</span><span class="nav-label-short"> AI</span>
    </a>
    <a href="km-editor.html" class="km-nav-btn km-nav-btn-add" data-km-page="editor">
        <i class="fa-solid fa-plus"></i><span class="nav-label-full"> 新增知識庫文章</span><span class="nav-label-short"> 文章</span>
    </a>
</div>

<script>
(function() {
    const currentPage = window.location.pathname.split('/').pop();
    const pageMap = {
        'km-knowledge.html': 'km-home',
        'km-shares.html': 'shares',
        'km-ai.html': 'ai',
        'km-review.html': 'km-home',
        'km-hot.html': 'km-home',
        'km-latest.html': 'km-home',
        'km-favorites.html': 'km-home',
        'km-manage.html': 'km-home',
        'km-search.html': 'km-home',
    };
    const currentKmPage = pageMap[currentPage];
    if (currentKmPage) {
        const activeBtn = document.querySelector(\`.km-nav-btn[data-km-page="\${currentKmPage}"]\`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // 已在當前頁面的導航按鈕，點擊時不重新載入
    document.querySelectorAll('.km-nav-btn[href]').forEach(btn => {
        const href = btn.getAttribute('href');
        if (href && href.split('?')[0] === currentPage) {
            btn.addEventListener('click', e => e.preventDefault());
        }
    });
})();
</script>`;

function executeInlineScripts(container) {
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.head.appendChild(newScript);
        script.remove();
    });
}

function applyFragment(targetId, html) {
    const target = document.getElementById(targetId);
    if (!target) return false;
    target.innerHTML = html;
    executeInlineScripts(target);
    return true;
}

// 載入 HTML 片段
async function loadHTMLFragment(url, targetId, fallbackHtml = '') {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`無法載入 ${url}`);
        const html = await response.text();
        return applyFragment(targetId, html);
    } catch (error) {
        console.error('載入片段失敗:', error);
        if (fallbackHtml) {
            console.warn(`改用內建片段：${targetId}`);
            return applyFragment(targetId, fallbackHtml);
        }
        return false;
    }
}

// 初始化共用佈局
async function initSharedLayout() {
    // 載入 header
    await loadHTMLFragment('shared/header.html', 'header-container', HEADER_FALLBACK_HTML);
    
    // 載入 sidebar
    await loadHTMLFragment('shared/sidebar.html', 'sidebar-container', SIDEBAR_FALLBACK_HTML);
    
    // 載入 KM 導航（如果頁面有此容器）
    const kmNavContainer = document.getElementById('km-nav-container');
    if (kmNavContainer) {
        // 判斷是文件庫頁面還是 KM 知識管理頁面
        const currentPage = window.location.pathname.split('/').pop();
        const kmKnowledgePages = ['km-knowledge.html', 'km-shares.html', 'km-ai.html', 'km-editor.html', 'km-hot.html', 'km-latest.html', 'km-favorites.html', 'km-manage.html', 'km-review.html', 'km-search.html', 'km-article.html'];
        
        if (kmKnowledgePages.includes(currentPage)) {
            await loadHTMLFragment('shared/km-knowledge-nav.html', 'km-nav-container', KM_KNOWLEDGE_NAV_FALLBACK_HTML);
        } else {
            await loadHTMLFragment('shared/km-nav.html', 'km-nav-container', KM_NAV_FALLBACK_HTML);
        }
    }
    
    // 初始化側邊欄功能（如漢堡選單）
    initMenuToggle();
    
    // 設置當前頁面的 active 狀態
    setActiveMenuItem();
}

// 初始化漢堡選單（委派給 sidebar-script.js 的完整邏輯）
function initMenuToggle() {
    if (typeof initSidebar === 'function') {
        initSidebar();
    } else {
        // fallback：sidebar-script.js 未載入時的簡易處理
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
            });
        }
    }
}

// 設置側邊欄的 active 狀態
function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // 移除所有 active
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 根據當前頁面設置 active
    let selector = '';
    const kmKnowledgePages = ['km-knowledge.html', 'km-shares.html', 'km-ai.html', 'km-editor.html', 'km-hot.html', 'km-latest.html', 'km-favorites.html', 'km-manage.html', 'km-review.html', 'km-search.html', 'km-article.html'];
    if (kmKnowledgePages.includes(currentPage)) {
        selector = '.nav-item[data-page="km-knowledge"]';
    } else if (currentPage === 'org-chart.html') {
        selector = '.nav-item[data-page="org-chart"]';
    } else if (currentPage.startsWith('km-')) {
        selector = '.nav-item[data-page="km"]';
    } else if (currentPage === 'index.html' || currentPage === '') {
        selector = '.nav-item[data-page="home"]';
    }
    
    if (selector) {
        const activeItem = document.querySelector(selector);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', async function() {
    await initSharedLayout();
    // 佈局載入完成，僅顯示主內容區
    const mc = document.querySelector('.main-content');
    if (mc) mc.classList.add('layout-ready');

    // 佈局載入完成後，重新初始化全站搜尋（因為 header 是動態載入的）
    if (window.__globalSearch && typeof window.__globalSearch.initGlobalSearch === 'function') {
        window.__globalSearch.initGlobalSearch();
    }
});
