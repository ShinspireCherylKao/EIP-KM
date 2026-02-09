/**
 * km-base.js
 * KM 系統共用的資料和基礎函式
 */

// 檔案內容假資料（用於 AI 問答詳細比較）
window.__kmFileContents = {
    // C 專案表單需求
    'pc3': {
        title: 'C專案表單需求',
        summary: '本文件說明 C 專案所需的表單設計需求',
        sections: {
            '表單類型': '採購申請表、驗收單、付款申請單',
            '填寫對象': '專案成員、部門主管',
            '審核層級': '3 級審核（專案經理 → 部門主管 → 財務）',
            '必填欄位': '申請日期、品項名稱、數量、單價、供應商',
            '附件需求': '報價單（PDF）、規格書（選填）',
            '整合系統': 'ERP 採購模組、財務系統',
            '預計上線': '2025 年 Q2',
            '特殊需求': '支援行動裝置填寫、電子簽章'
        }
    },
    // E 專案表單流程設計
    'pe3': {
        title: 'E專案表單流程設計',
        summary: '本文件定義 E 專案的表單流程設計規範',
        sections: {
            '表單類型': '顧問服務申請單、工時回報單、費用報銷單',
            '填寫對象': '顧問人員、專案協調員',
            '審核層級': '2 級審核（專案協調員 → 部門主管）',
            '必填欄位': '服務日期、工時數、服務內容說明、客戶簽核',
            '附件需求': '客戶確認函（必填）、交通憑證（選填）',
            '整合系統': 'HR 系統、費用報銷系統',
            '預計上線': '2025 年 Q1',
            '特殊需求': '自動計算工時費用、客戶端線上簽核'
        }
    },
    // 更多檔案內容...
};

// Mock 資料
window.__kmData = {
    me: { id: 'u001', name: '王小明', dept: 'HR', role: 'admin' },
    departments: [
        { id: 'HR', name: 'HR', desc: '人力資源', accessible: true },
        { id: 'Supply', name: 'Supply', desc: '供應鏈', accessible: true },
        { id: 'Finance', name: 'Finance', desc: '財務', accessible: false },
        { id: 'Projects', name: '專案', desc: '專案管理', accessible: true },
    ],
    indexItems: [
        { id: 'i1', name: '差旅報銷規範.pdf', displayTitle: '差旅報銷（新版）', type: 'file', path: 'HR/FAQ', deptId: 'HR', tags: ['差旅', '報銷'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-11-01', downloads: 120, fileKind: 'pdf' },
        { id: 'i2', name: '請假制度.docx', type: 'file', path: 'HR/FAQ', deptId: 'HR', tags: ['請假', '制度'], actionsAllowed: ['view'], visibilityMode: 'inherit', updatedAt: '2025-10-25', downloads: 32, fileKind: 'docx' },
        // ...更多資料
    ],
    folders: {
        'HR/FAQ': {
            path: 'HR/FAQ', inherit: true, deptId: 'HR', items: []
        }
        // ...更多資料夾
    },
    tags: { popular: [
        { tag: '合約', count: 25 }, 
        { tag: '提案', count: 18 }, 
        { tag: '帳務', count: 15 }
    ]},
    // 分享資料會從 localStorage 讀取
    sharedWithMe: [],
    sharedByMe: [],
    shareLinks: [],
    meData: { recent: ['i1', 'i4', 'i2'], favorites: ['i1', 'i5'] }
};

// ==================== 分享功能 ====================

/**
 * 初始化分享資料
 */
function initShareData() {
    // 「與我共用」的假資料 - 對應近期存取裡的檔案
    const defaultSharedWithMe = [
        {
            id: 'sw1',
            name: '2026年度預算規劃.xlsx',
            type: 'file',
            fileKind: 'xlsx',
            folder: '管理部/財務報表',
            tags: ['預算', '規劃'],
            owner: '李經理',
            ownerDept: '管理部',
            perms: ['瀏覽', '下載'],
            sharedAt: '2026-01-20'
        },
        {
            id: 'sw2',
            name: '年度策略規劃會議紀錄.docx',
            type: 'file',
            fileKind: 'docx',
            folder: '管理部/會議紀錄',
            tags: ['會議', '策略'],
            owner: '陳總監',
            ownerDept: '管理部',
            perms: ['瀏覽', '下載'],
            sharedAt: '2026-01-15'
        },
        {
            id: 'sw3',
            name: '2025年Q4營運檢討會議紀錄.docx',
            type: 'file',
            fileKind: 'docx',
            folder: '管理部/會議紀錄',
            tags: ['會議', '營運', 'Q4'],
            owner: '張副理',
            ownerDept: '管理部',
            perms: ['瀏覽'],
            sharedAt: '2026-01-12'
        },
        {
            id: 'sw4',
            name: 'A專案需求規格書.docx',
            type: 'file',
            fileKind: 'docx',
            folder: '專案/A專案',
            tags: ['需求', 'A專案'],
            owner: '林專案經理',
            ownerDept: '專案部門',
            perms: ['瀏覽', '下載', '編輯'],
            sharedAt: '2026-01-10'
        },
        {
            id: 'sw5',
            name: 'A專案服務合約.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: '專案/A專案',
            tags: ['合約', 'A專案'],
            owner: '林專案經理',
            ownerDept: '專案部門',
            perms: ['瀏覽'],
            sharedAt: '2026-01-08'
        },
        {
            id: 'sw6',
            name: '2026年春節假期公告.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: '行政部/公告',
            tags: ['公告', '假期'],
            owner: '王小姐',
            ownerDept: '行政部',
            perms: ['瀏覽'],
            sharedAt: '2026-01-20'
        },
        {
            id: 'sw7',
            name: '辦公室搬遷通知.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: '行政部/公告',
            tags: ['公告', '行政'],
            owner: '王小姐',
            ownerDept: '行政部',
            perms: ['瀏覽'],
            sharedAt: '2026-01-15'
        }
    ];
    
    // 「我分享的」的假資料 - 對應近期存取裡的 HR 檔案
    const defaultSharedByMe = [
        {
            id: 'sb1',
            name: '差旅報銷規範_2026版.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: 'HR/FAQ',
            tags: ['差旅', '報銷', 'FAQ'],
            to: ['管理部', '行政部'],
            perms: ['瀏覽', '下載'],
            status: '生效中',
            sharedAt: '2026-01-15'
        },
        {
            id: 'sb2',
            name: '員工福利手冊.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: 'HR/FAQ',
            tags: ['福利', '必讀'],
            to: ['全公司'],
            perms: ['瀏覽'],
            status: '生效中',
            sharedAt: '2026-01-10'
        },
        {
            id: 'sb3',
            name: '請假制度說明.docx',
            type: 'file',
            fileKind: 'docx',
            folder: 'HR/FAQ',
            tags: ['請假', '制度', 'FAQ'],
            to: ['管理部', '行政部', '專案部門'],
            perms: ['瀏覽', '下載'],
            status: '生效中',
            sharedAt: '2026-01-08'
        },
        {
            id: 'sb4',
            name: '入職流程SOP.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: 'HR/SOP',
            tags: ['SOP', '入職'],
            to: ['管理部'],
            perms: ['瀏覽', '下載'],
            status: '生效中',
            sharedAt: '2026-01-12'
        },
        {
            id: 'sb5',
            name: '新人訓練手冊.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: 'HR/培訓',
            tags: ['培訓', '新人', '必讀'],
            to: ['全公司'],
            perms: ['瀏覽'],
            status: '生效中',
            sharedAt: '2026-01-10'
        },
        {
            id: 'sb6',
            name: '資安教育訓練講義.pptx',
            type: 'file',
            fileKind: 'pptx',
            folder: 'HR/培訓',
            tags: ['培訓', '資安'],
            to: ['全公司'],
            perms: ['瀏覽', '下載'],
            status: '生效中',
            sharedAt: '2025-12-20'
        },
        {
            id: 'sb7',
            name: '請假申請單.xlsx',
            type: 'file',
            fileKind: 'xlsx',
            folder: 'HR/表單/請假',
            tags: ['請假', '表單'],
            to: ['管理部', '行政部'],
            perms: ['瀏覽', '下載'],
            status: '生效中',
            sharedAt: '2026-01-22'
        }
    ];

    // 「分享連結」的假資料 - 對外分享用
    const defaultShareLinks = [
        {
            id: 'sl1',
            name: '2026人資培訓簡報.pptx',
            type: 'file',
            fileKind: 'pptx',
            folder: 'HR/培訓',
            tags: ['培訓', '對外'],
            targets: ['外部講師 - 林老師'],
            perms: ['瀏覽'],
            status: '生效中',
            sharedAt: '2026-02-01',
            expiresAt: '2026-03-01',
            link: 'https://km.example.com/share/sl1'
        },
        {
            id: 'sl2',
            name: '產品簡介_對外版.pdf',
            type: 'file',
            fileKind: 'pdf',
            folder: '管理部/對外資料',
            tags: ['對外展示'],
            targets: ['業務展示'],
            perms: ['瀏覽', '下載'],
            status: '生效中',
            sharedAt: '2026-02-03',
            expiresAt: '2026-02-20',
            link: 'https://km.example.com/share/sl2'
        },
        {
            id: 'sl3',
            name: '合作提案_外部審閱.docx',
            type: 'file',
            fileKind: 'docx',
            folder: '專案/合作',
            tags: ['提案'],
            targets: ['合作夥伴 - 新創A'],
            perms: ['瀏覽'],
            status: '已停用',
            sharedAt: '2026-01-25',
            expiresAt: '2026-02-05',
            link: 'https://km.example.com/share/sl3'
        }
    ];
    
    // 只有在 localStorage 沒有資料時才初始化
    if (!localStorage.getItem('sharedWithMe')) {
        localStorage.setItem('sharedWithMe', JSON.stringify(defaultSharedWithMe));
    }
    if (!localStorage.getItem('sharedByMe')) {
        localStorage.setItem('sharedByMe', JSON.stringify(defaultSharedByMe));
    }
    if (!localStorage.getItem('shareLinks')) {
        localStorage.setItem('shareLinks', JSON.stringify(defaultShareLinks));
    }
    
    // 同步到 window.__kmData
    window.__kmData.sharedWithMe = JSON.parse(localStorage.getItem('sharedWithMe') || '[]');
    window.__kmData.sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    window.__kmData.shareLinks = JSON.parse(localStorage.getItem('shareLinks') || '[]');
}

/**
 * 重置分享資料（強制使用預設假資料）
 */
function resetShareData() {
    localStorage.removeItem('sharedWithMe');
    localStorage.removeItem('sharedByMe');
    localStorage.removeItem('shareLinks');
    initShareData();
    console.log('✅ 分享資料已重置');
}

/**
 * 取得分享資料
 */
function getShareData() {
    return {
        sharedWithMe: JSON.parse(localStorage.getItem('sharedWithMe') || '[]'),
        sharedByMe: JSON.parse(localStorage.getItem('sharedByMe') || '[]'),
        shareLinks: JSON.parse(localStorage.getItem('shareLinks') || '[]')
    };
}

/**
 * 新增分享
 */
function addShare(fileData, shareConfig) {
    const sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    
    const newShare = {
        id: 'sb' + Date.now(),
        name: fileData.name,
        type: 'file',
        fileKind: fileData.name.split('.').pop().toLowerCase(),
        folder: fileData.folder,
        tags: fileData.tags || [],
        to: shareConfig.targets,
        perms: shareConfig.permissions,
        status: '生效中',
        sharedAt: new Date().toISOString().split('T')[0]
    };
    
    sharedByMe.push(newShare);
    localStorage.setItem('sharedByMe', JSON.stringify(sharedByMe));
    window.__kmData.sharedByMe = sharedByMe;
    
    return newShare;
}

/**
 * 移除分享
 */
function removeShare(shareId) {
    let sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    sharedByMe = sharedByMe.filter(s => s.id !== shareId);
    localStorage.setItem('sharedByMe', JSON.stringify(sharedByMe));
    window.__kmData.sharedByMe = sharedByMe;
}

/**
 * 更新分享
 */
function updateShare(shareId, shareConfig) {
    let sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const index = sharedByMe.findIndex(s => s.id === shareId);
    
    if (index !== -1) {
        sharedByMe[index] = {
            ...sharedByMe[index],
            to: shareConfig.targets,
            perms: shareConfig.permissions
        };
        localStorage.setItem('sharedByMe', JSON.stringify(sharedByMe));
        window.__kmData.sharedByMe = sharedByMe;
    }
}

// 初始化分享資料
document.addEventListener('DOMContentLoaded', function() {
    initShareData();
});

/**
 * 取得顯示名稱
 */
function getDisplayName(item) {
    return (item.displayTitle && item.displayTitle.trim()) ? item.displayTitle.trim() : item.name;
}

/**
 * 取得檔案圖示 class
 */
function getFileIcon(item) {
    if (item.type === 'folder') return 'fa-folder folder-icon';
    const ext = item.fileKind || item.name.split('.').pop().toLowerCase();
    switch (ext) {
        case 'pdf': return 'fa-file-pdf pdf-icon';
        case 'doc':
        case 'docx': return 'fa-file-word doc-icon';
        case 'xls':
        case 'xlsx': return 'fa-file-excel xls-icon';
        case 'ppt':
        case 'pptx': return 'fa-file-powerpoint';
        default: return 'fa-file';
    }
}

/**
 * 根據檔名取得圖標（帶顏色）
 */
function getFileIconByName(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconMap = {
        'pdf': 'fa-solid fa-file-pdf',
        'doc': 'fa-solid fa-file-word',
        'docx': 'fa-solid fa-file-word',
        'xls': 'fa-solid fa-file-excel',
        'xlsx': 'fa-solid fa-file-excel',
        'ppt': 'fa-solid fa-file-powerpoint',
        'pptx': 'fa-solid fa-file-powerpoint',
        'txt': 'fa-solid fa-file-lines',
        'zip': 'fa-solid fa-file-zipper'
    };
    
    const colorMap = {
        'pdf': 'color: #EF4444;',
        'doc': 'color: #3B82F6;',
        'docx': 'color: #3B82F6;',
        'xls': 'color: #10B981;',
        'xlsx': 'color: #10B981;',
        'ppt': 'color: #F97316;',
        'pptx': 'color: #F97316;',
        'txt': 'color: #6B7280;',
        'zip': 'color: #EAB308;'
    };
    
    const icon = iconMap[ext] || 'fa-solid fa-file';
    const color = colorMap[ext] || 'color: #9CA3AF;';
    
    return `${icon}" style="${color}`;
}

/**
 * 顯示 Toast 訊息
 */
function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.cssText = `
        background: #1F2937;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 取得收藏清單（從 localStorage）
 */
function getFavorites() {
    const data = localStorage.getItem('kmFavorites');
    return data ? JSON.parse(data) : [];
}

/**
 * 儲存收藏清單（到 localStorage）
 */
function saveFavorites(favorites) {
    localStorage.setItem('kmFavorites', JSON.stringify(favorites));
}

/**
 * 檢查檔案是否已收藏
 */
function isFileFavorited(fileName) {
    const favorites = getFavorites();
    return favorites.includes(fileName);
}

/**
 * 切換檔案收藏狀態
 */
function toggleFavorite(fileName) {
    const favorites = getFavorites();
    const index = favorites.indexOf(fileName);
    
    if (index === -1) {
        favorites.push(fileName);
        saveFavorites(favorites);
        showToast(`⭐ 已將「${fileName}」加入收藏`);
        
        if (typeof addFrontendAuditLog === 'function') {
            addFrontendAuditLog('加入收藏', fileName);
        }
    } else {
        favorites.splice(index, 1);
        saveFavorites(favorites);
        showToast(`已將「${fileName}」移出收藏`);
        
        if (typeof addFrontendAuditLog === 'function') {
            addFrontendAuditLog('取消收藏', fileName);
        }
    }
    
    const currentPath = document.getElementById('currentPath')?.textContent;
    if (currentPath && typeof loadKmFolder === 'function') {
        loadKmFolder(currentPath);
    }
    
    if (typeof renderKmMy === 'function') {
        renderKmMy();
    }
}

/**
 * 關閉所有更多選單
 */
function closeAllMoreMenus() {
    document.querySelectorAll('.more-menu-dropdown.show').forEach(menu => {
        menu.classList.remove('show');
    });
}

/**
 * 切換更多選單顯示
 */
function toggleMoreMenu(event, fileName) {
    event.stopPropagation();
    closeAllMoreMenus();
    
    const menuId = 'moreMenu_' + fileName.replace(/[^a-zA-Z0-9]/g, '_');
    const menu = document.getElementById(menuId);
    if (menu) {
        menu.classList.toggle('show');
    }
}

// 點擊外部關閉選單
document.addEventListener('click', function(event) {
    if (!event.target.closest('.more-menu-wrapper')) {
        closeAllMoreMenus();
    }
});

/**
 * 開啟上傳 Modal
 */
function openUploadModal() {
    const path = document.getElementById('currentPath')?.textContent || 'HR/FAQ';
    const targetPath = document.getElementById('uploadTargetPath');
    if (targetPath) targetPath.textContent = path;
    
    if (typeof openModal === 'function') {
        openModal('uploadModal');
    }
}

/**
 * HTML 跳脫
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
