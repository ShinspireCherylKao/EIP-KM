/**
 * km-recent.js
 * 近期存取專用 JS - 雙欄檔案瀏覽器
 */

// 當前狀態
let currentFolder = null;
let currentView = null;
const currentUserDept = 'HR';

/**
 * 初始化「近期存取」假資料到 localStorage
 */
function initMySpaceData() {
    // 強制重新初始化（開發測試用）
    const forceReinit = true;
    
    // 檢查是否已有資料
    const existingData = localStorage.getItem('fileDatabase');
    if (existingData && !forceReinit) {
        const db = JSON.parse(existingData);
        if (db.files && db.files.length > 0) {
            console.log('📁 fileDatabase 已存在，跳過初始化');
            return;
        }
    }

    // 建立假資料
    const mockData = {
        folders: [
            { name: 'HR', permissions: { 'HR': '完全控制', '管理部': '僅瀏覽', '行政部': '不可見' } },
            { name: 'HR/FAQ', permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: 'HR/SOP', permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: 'HR/表單', permissions: { 'HR': '完全控制', '管理部': '僅瀏覽', '行政部': '不可見' } },
            { name: 'HR/表單/差旅', permissions: { 'HR': '完全控制', '管理部': '僅瀏覽', '行政部': '不可見' } },
            { name: 'HR/表單/請假', permissions: { 'HR': '完全控制', '管理部': '僅瀏覽', '行政部': '不可見' } },
            { name: 'HR/培訓', permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '管理部', permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '僅瀏覽' } },
            { name: '管理部/會議紀錄', permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '僅瀏覽' } },
            { name: '管理部/財務報表', permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '不可見' } },
            { name: '管理部/採購合約', permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '瀏覽+下載' } },
            { name: '行政部', permissions: { 'HR': '僅瀏覽', '管理部': '僅瀏覽', '行政部': '完全控制' } },
            { name: '行政部/公告', permissions: { 'HR': '僅瀏覽', '管理部': '僅瀏覽', '行政部': '完全控制' } },
            { name: '行政部/庶務', permissions: { 'HR': '不可見', '管理部': '僅瀏覽', '行政部': '完全控制' } },
            { name: '專案', permissions: { 'HR': '僅瀏覽', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '專案/A專案', permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } },
            { name: '專案/B專案', permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } }
        ],
        files: [
            // HR/FAQ
            { name: '差旅報銷規範_2026版.pdf', folder: 'HR/FAQ', uploadDate: '2026-01-15', tags: ['差旅', '報銷', 'FAQ'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '請假制度說明.docx', folder: 'HR/FAQ', uploadDate: '2026-01-10', tags: ['請假', '制度', 'FAQ'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '員工福利手冊.pdf', folder: 'HR/FAQ', uploadDate: '2025-12-20', tags: ['福利', '必讀'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '瀏覽+下載' } },
            { name: '新進人員FAQ.docx', folder: 'HR/FAQ', uploadDate: '2026-01-08', tags: ['新人', 'FAQ'], permissions: { 'HR': '完全控制', '管理部': '僅瀏覽', '行政部': '僅瀏覽' } },
            { name: '考勤規則Q&A.pdf', folder: 'HR/FAQ', uploadDate: '2025-11-25', tags: ['考勤', 'FAQ'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },

            // HR/SOP
            { name: '入職流程SOP.pdf', folder: 'HR/SOP', uploadDate: '2026-01-12', tags: ['SOP', '入職'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '離職流程SOP.pdf', folder: 'HR/SOP', uploadDate: '2025-12-15', tags: ['SOP', '離職'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '績效考核SOP.docx', folder: 'HR/SOP', uploadDate: '2026-01-05', tags: ['SOP', '績效'], permissions: { 'HR': '完全控制', '管理部': '僅瀏覽', '行政部': '不可見' } },
            { name: '招募面試SOP.pdf', folder: 'HR/SOP', uploadDate: '2025-11-30', tags: ['SOP', '招募'], permissions: { 'HR': '完全控制', '管理部': '僅瀏覽', '行政部': '不可見' } },

            // HR/表單/差旅
            { name: '國內差旅申請單.xlsx', folder: 'HR/表單/差旅', uploadDate: '2026-01-20', tags: ['差旅', '表單'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '海外差旅申請單.xlsx', folder: 'HR/表單/差旅', uploadDate: '2026-01-18', tags: ['差旅', '表單', '海外'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '差旅費用報銷單.xlsx', folder: 'HR/表單/差旅', uploadDate: '2026-01-15', tags: ['差旅', '報銷', '表單'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },

            // HR/表單/請假
            { name: '請假申請單.xlsx', folder: 'HR/表單/請假', uploadDate: '2026-01-22', tags: ['請假', '表單'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '瀏覽+下載' } },
            { name: '特休申請說明.pdf', folder: 'HR/表單/請假', uploadDate: '2025-12-28', tags: ['請假', '特休'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '瀏覽+下載' } },

            // HR/培訓
            { name: '新人訓練手冊.pdf', folder: 'HR/培訓', uploadDate: '2026-01-10', tags: ['培訓', '新人', '必讀'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '僅瀏覽' } },
            { name: '資安教育訓練講義.pptx', folder: 'HR/培訓', uploadDate: '2025-12-20', tags: ['培訓', '資安'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '瀏覽+下載' } },
            { name: '職業安全訓練簡報.pptx', folder: 'HR/培訓', uploadDate: '2025-11-15', tags: ['培訓', '安全'], permissions: { 'HR': '完全控制', '管理部': '瀏覽+下載', '行政部': '瀏覽+下載' } },

            // 管理部/會議紀錄
            { name: '2026年1月份主管會議紀錄.docx', folder: '管理部/會議紀錄', uploadDate: '2026-01-25', tags: ['會議', '主管'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '僅瀏覽' } },
            { name: '2025年Q4營運檢討會議紀錄.docx', folder: '管理部/會議紀錄', uploadDate: '2025-12-30', tags: ['會議', '營運', 'Q4'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '僅瀏覽' } },
            { name: '年度策略規劃會議紀錄.docx', folder: '管理部/會議紀錄', uploadDate: '2025-12-15', tags: ['會議', '策略'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } },

            // 管理部/財務報表
            { name: '2025年度財務報表.xlsx', folder: '管理部/財務報表', uploadDate: '2026-01-28', tags: ['財報', '機密', '年度'], permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '不可見' } },
            { name: '2025年Q4損益表.xlsx', folder: '管理部/財務報表', uploadDate: '2026-01-20', tags: ['財報', 'Q4'], permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '不可見' } },
            { name: '2026年度預算規劃.xlsx', folder: '管理部/財務報表', uploadDate: '2026-01-15', tags: ['預算', '規劃'], permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '不可見' } },

            // 管理部/採購合約
            { name: '辦公設備採購合約.pdf', folder: '管理部/採購合約', uploadDate: '2026-01-10', tags: ['合約', '採購'], permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '瀏覽+下載' } },
            { name: '軟體授權合約.pdf', folder: '管理部/採購合約', uploadDate: '2025-12-20', tags: ['合約', '軟體'], permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '瀏覽+下載' } },
            { name: '供應商名冊2026.xlsx', folder: '管理部/採購合約', uploadDate: '2026-01-05', tags: ['供應商', '採購'], permissions: { 'HR': '不可見', '管理部': '完全控制', '行政部': '瀏覽+下載' } },

            // 行政部/公告
            { name: '2026年春節假期公告.pdf', folder: '行政部/公告', uploadDate: '2026-01-20', tags: ['公告', '假期'], permissions: { 'HR': '僅瀏覽', '管理部': '僅瀏覽', '行政部': '完全控制' } },
            { name: '辦公室搬遷通知.pdf', folder: '行政部/公告', uploadDate: '2026-01-15', tags: ['公告', '行政'], permissions: { 'HR': '僅瀏覽', '管理部': '僅瀏覽', '行政部': '完全控制' } },
            { name: '停車位申請辦法.docx', folder: '行政部/公告', uploadDate: '2025-12-10', tags: ['公告', '停車'], permissions: { 'HR': '僅瀏覽', '管理部': '僅瀏覽', '行政部': '完全控制' } },

            // 行政部/庶務
            { name: '文具用品請購單.xlsx', folder: '行政部/庶務', uploadDate: '2026-01-22', tags: ['庶務', '請購'], permissions: { 'HR': '不可見', '管理部': '僅瀏覽', '行政部': '完全控制' } },
            { name: '會議室預約管理規則.docx', folder: '行政部/庶務', uploadDate: '2025-12-25', tags: ['庶務', '會議室'], permissions: { 'HR': '不可見', '管理部': '僅瀏覽', '行政部': '完全控制' } },

            // 專案/A專案
            { name: 'A專案服務合約.pdf', folder: '專案/A專案', uploadDate: '2025-12-01', tags: ['合約', 'A專案'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } },
            { name: 'A專案需求規格書.docx', folder: '專案/A專案', uploadDate: '2025-11-20', tags: ['需求', 'A專案'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } },
            { name: 'A專案進度報告_Q1.pptx', folder: '專案/A專案', uploadDate: '2025-03-31', tags: ['進度', 'A專案'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } },

            // 專案/B專案
            { name: 'B專案外包合約.pdf', folder: '專案/B專案', uploadDate: '2025-12-05', tags: ['合約', '外包', 'B專案'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } },
            { name: 'B專案結案報告.pptx', folder: '專案/B專案', uploadDate: '2025-12-10', tags: ['結案', 'B專案'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } },
            { name: 'B專案費用明細.xlsx', folder: '專案/B專案', uploadDate: '2025-12-08', tags: ['帳務', 'B專案'], permissions: { 'HR': '僅瀏覽', '管理部': '完全控制', '行政部': '不可見' } }
        ]
    };

    localStorage.setItem('fileDatabase', JSON.stringify(mockData));
    console.log('✅ 近期存取假資料已初始化，共', mockData.files.length, '個檔案');

    // 初始化最近存取檔案
    const recentFiles = [
        '差旅報銷規範_2026版.pdf',
        '請假制度說明.docx',
        '2026年1月份主管會議紀錄.docx',
        '國內差旅申請單.xlsx',
        '新人訓練手冊.pdf',
        '資安教育訓練講義.pptx',
        '2026年春節假期公告.pdf',
        '入職流程SOP.pdf'
    ];
    localStorage.setItem('recentFiles', JSON.stringify(recentFiles));

    // 初始化收藏檔案
    const favoriteFiles = [
        '員工福利手冊.pdf',
        '差旅報銷規範_2026版.pdf',
        '請假申請單.xlsx',
        '新人訓練手冊.pdf',
        '考勤規則Q&A.pdf',
        '2026年春節假期公告.pdf'
    ];
    localStorage.setItem('favoriteFiles', JSON.stringify(favoriteFiles));

    // 初始化垃圾桶檔案
    const trashFiles = [
        {
            name: '舊版差旅規範_2024.pdf',
            originalFolder: 'HR/FAQ',
            uploadDate: '2024-03-15',
            tags: ['差旅', '已過期'],
            deletedAt: '2026-01-28'
        },
        {
            name: '2024年度預算草案.xlsx',
            originalFolder: '管理部/財務報表',
            uploadDate: '2024-01-10',
            tags: ['預算', '草案'],
            deletedAt: '2026-01-25'
        },
        {
            name: '員工通訊錄_舊版.xlsx',
            originalFolder: 'HR/FAQ',
            uploadDate: '2025-06-20',
            tags: ['通訊錄'],
            deletedAt: '2026-02-01'
        },
        {
            name: '會議室使用須知_v1.docx',
            originalFolder: '行政部/庶務',
            uploadDate: '2025-08-12',
            tags: ['會議室', '須知'],
            deletedAt: '2026-02-03'
        },
        {
            name: '暫存簡報草稿.pptx',
            originalFolder: 'HR/培訓',
            uploadDate: '2025-12-05',
            tags: ['草稿'],
            deletedAt: '2026-02-05'
        }
    ];
    localStorage.setItem('trashFiles', JSON.stringify(trashFiles));
}

/**
 * 初始化近期存取
 */
function initKmMySpace() {
    initMySpaceData();
    renderDeptFolders();
    updateQuickViewCounts();
    
    // 預設選擇第一個常用資料夾
    selectFolder('HR/FAQ');
    console.log('✅ 近期存取已初始化');
}

/**
 * 初始化共享部門
 */
function initKmMyOrg() {
    initMySpaceData();
    renderDeptFolders();
    updateQuickViewCounts();

    currentFolder = null;
    currentView = null;
    setTrashNoticeVisible(false);
    setTrashActionsVisible(true);

    const titleEl = document.getElementById('currentFolderName');
    if (titleEl) titleEl.textContent = '所有部門';

    console.log('✅ 共享部門已初始化');
}

/**
 * 渲染部門資料夾列表
 */
function renderDeptFolders() {
    const container = document.getElementById('deptFoldersList');
    if (!container) return;
    
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;
    
    const db = JSON.parse(data);
    const topDepts = ['HR', '管理部', '行政部', '專案'];
    const deptNames = {
        'HR': 'HR (人資部)',
        '管理部': '管理部',
        '行政部': '行政部',
        '專案': '專案部門'
    };
    
    let html = '';
    
    topDepts.forEach(dept => {
        const deptFolder = db.folders.find(f => f.name === dept);
        const perm = deptFolder?.permissions[currentUserDept];
        if (perm === '不可見') return;
        
        // 子資料夾
        const subFolders = db.folders.filter(f => {
            const isSubFolder = f.name.startsWith(dept + '/');
            const subPerm = f.permissions[currentUserDept];
            return isSubFolder && subPerm !== '不可見';
        });
        
        const deptId = dept.replace(/[^a-zA-Z0-9]/g, '_');
        
        html += `
            <div class="nav-item nav-dept" data-path="${dept}" onclick="toggleDept('${deptId}')">
                <i class="fa-solid fa-building"></i>
                <span>${deptNames[dept]}</span>
                <i class="fa-solid fa-chevron-down nav-arrow" id="arrow_${deptId}"></i>
            </div>
            <div class="nav-sublist" id="sublist_${deptId}">
        `;
        
        subFolders.forEach(sf => {
            const sfName = sf.name.split('/').slice(1).join('/');
            html += `
                <div class="nav-item" data-path="${sf.name}" onclick="selectFolder('${sf.name}')">
                    <i class="fa-solid fa-folder"></i>
                    <span>${sfName}</span>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

/**
 * 展開/收合部門
 */
function toggleDept(deptId) {
    const sublist = document.getElementById('sublist_' + deptId);
    const arrow = document.getElementById('arrow_' + deptId);
    if (sublist) {
        sublist.classList.toggle('show');
        if (arrow) arrow.style.transform = sublist.classList.contains('show') ? 'rotate(180deg)' : '';
    }
}

/**
 * 選擇資料夾
 */
function selectFolder(folderPath) {
    currentFolder = folderPath;
    currentView = null;
    setTrashNoticeVisible(false);
    setTrashActionsVisible(true);
    
    // 更新 active 狀態
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const target = document.querySelector(`.nav-item[data-path="${folderPath}"]`);
    if (target) target.classList.add('active');
    
    // 更新標題
    document.getElementById('currentFolderName').textContent = folderPath;
    
    // 載入檔案
    loadFilesForFolder(folderPath);
}

/**
 * 選擇快速檢視
 */
function selectQuickView(view) {
    currentView = view;
    currentFolder = null;
    setTrashNoticeVisible(view === 'trash');
    setTrashActionsVisible(view !== 'trash');
    
    // 更新 active 狀態
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const target = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (target) target.classList.add('active');
    
    // 更新標題
    const titles = { 'recent': '最近存取', 'fav': '我的收藏', 'trash': '垃圾桶' };
    document.getElementById('currentFolderName').textContent = titles[view];
    
    // 載入檔案
    if (view === 'recent') {
        loadRecentFiles();
    } else if (view === 'fav') {
        loadFavoriteFiles();
    } else if (view === 'trash') {
        loadTrashFiles();
    }
}

/**
 * 載入資料夾的檔案
 */
function loadFilesForFolder(folderPath) {
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;
    
    const db = JSON.parse(data);
    const files = db.files.filter(f => {
        const isInFolder = f.folder === folderPath;
        const perm = f.permissions[currentUserDept];
        return isInFolder && perm !== '不可見';
    });
    
    renderFileTable(files);
}

/**
 * 載入最近存取檔案
 */
function loadRecentFiles() {
    const recentNames = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;
    
    const db = JSON.parse(data);
    const files = recentNames.map(name => db.files.find(f => f.name === name)).filter(Boolean);
    renderFileTable(files, true);
}

/**
 * 載入收藏檔案
 */
function loadFavoriteFiles() {
    const favNames = JSON.parse(localStorage.getItem('favoriteFiles') || '[]');
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;
    
    const db = JSON.parse(data);
    const files = favNames.map(name => db.files.find(f => f.name === name)).filter(Boolean);
    renderFileTable(files, true);
}

/**
 * 更新快速檢視計數
 */
function updateQuickViewCounts() {
    const recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    const favFiles = JSON.parse(localStorage.getItem('favoriteFiles') || '[]');
    const trashFiles = JSON.parse(localStorage.getItem('trashFiles') || '[]');
    
    const recentCount = document.getElementById('recentCount');
    const favCount = document.getElementById('favCount');
    const trashCount = document.getElementById('trashCount');
    
    if (recentCount) recentCount.textContent = recentFiles.length;
    if (favCount) favCount.textContent = favFiles.length;
    if (trashCount) trashCount.textContent = trashFiles.length;
}

/**
 * 渲染檔案表格
 */
function renderFileTable(files, showFolder = false) {
    const tbody = document.getElementById('fileListBody');
    if (!tbody) return;
    
    if (files.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">此資料夾沒有檔案</td></tr>';
        return;
    }
    
    const html = files.map(file => {
        const icon = getFileIconClass(file.name);
        const isFav = isFileFavorited(file.name);
        const favIcon = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
        const favClass = isFav ? 'fav-active' : '';
        
        const tagsHtml = (file.tags || []).slice(0, 3).map(tag => 
            `<span class="file-tag">${tag}</span>`
        ).join('');
        
        return `
            <tr data-filename="${file.name}">
                <td class="col-name">
                    <div class="file-name-cell">
                        <i class="fa-solid ${icon}"></i>
                        <div>
                            <div class="file-name">${file.name}</div>
                            ${showFolder ? `<div class="file-folder">${file.folder}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td class="col-tags">
                    <div class="file-tags">${tagsHtml}</div>
                </td>
                <td class="col-date">
                    <span class="file-date">${file.uploadDate}</span>
                </td>
                <td class="col-actions">
                    <div class="file-actions">
                        <button class="btn small ghost ${favClass}" onclick="toggleFavorite('${file.name}')" title="${isFav ? '取消收藏' : '加入收藏'}">
                            <i class="${favIcon}"></i>
                        </button>
                        <button class="btn small ghost" onclick="viewFile('${file.name}')" title="檢視">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn small ghost" onclick="downloadFile('${file.name}')" title="下載">
                            <i class="fa-solid fa-download"></i>
                        </button>
                        <div class="more-menu-wrapper">
                            <button class="btn small ghost" onclick="toggleMoreMenu(event, '${file.name.replace(/'/g, "\\'")}')" title="更多操作">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div class="more-menu-dropdown" id="moreMenu_${file.name.replace(/[^a-zA-Z0-9一-龥]/g, '_')}">
                                <button class="menu-item" onclick="openShareModal('${file.name}', '${file.folder}')">
                                    <i class="fa-solid fa-share-nodes"></i>共用
                                </button>
                                <button class="menu-item" onclick="renameFile('${file.name}')">
                                    <i class="fa-solid fa-pen"></i>修改檔名
                                </button>
                                <button class="menu-item danger" onclick="moveToTrash('${file.name}')">
                                    <i class="fa-solid fa-trash-can"></i>移到垃圾桶
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = html;
}

/**
 * 取得檔案圖示
 */
function getFileIconClass(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
        case 'pdf': return 'fa-file-pdf file-icon pdf-icon';
        case 'doc':
        case 'docx': return 'fa-file-word file-icon doc-icon';
        case 'xls':
        case 'xlsx': return 'fa-file-excel file-icon xls-icon';
        case 'ppt':
        case 'pptx': return 'fa-file-powerpoint file-icon ppt-icon';
        default: return 'fa-file file-icon';
    }
}

/**
 * 檢查是否已收藏
 */
function isFileFavorited(fileName) {
    const favFiles = JSON.parse(localStorage.getItem('favoriteFiles') || '[]');
    return favFiles.includes(fileName);
}

/**
 * 切換收藏
 */
function toggleFavorite(fileName) {
    let favFiles = JSON.parse(localStorage.getItem('favoriteFiles') || '[]');
    
    if (favFiles.includes(fileName)) {
        favFiles = favFiles.filter(f => f !== fileName);
        showToast('已取消收藏');
    } else {
        favFiles.push(fileName);
        showToast('已加入收藏');
    }
    
    localStorage.setItem('favoriteFiles', JSON.stringify(favFiles));
    updateQuickViewCounts();
    
    // 更新表格中的收藏按鈕
    const row = document.querySelector(`tr[data-filename="${fileName}"]`);
    if (row) {
        const btn = row.querySelector('.file-actions button:first-child');
        const icon = btn?.querySelector('i');
        if (favFiles.includes(fileName)) {
            btn?.classList.add('fav-active');
            if (icon) icon.className = 'fa-solid fa-star';
        } else {
            btn?.classList.remove('fav-active');
            if (icon) icon.className = 'fa-regular fa-star';
        }
    }
    
    // 如果在收藏檢視，重新載入
    if (currentView === 'fav') {
        loadFavoriteFiles();
    }
}

/**
 * 載入垃圾桶檔案
 */
function loadTrashFiles() {
    const trashFiles = JSON.parse(localStorage.getItem('trashFiles') || '[]');
    
    if (trashFiles.length === 0) {
        const tbody = document.getElementById('fileListBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><i class="fa-solid fa-trash-can" style="font-size: 48px; color: #d1d5db; margin-bottom: 16px;"></i><br>垃圾桶是空的</td></tr>';
        }
        return;
    }
    
    renderTrashTable(trashFiles);
}

/**
 * 渲染垃圾桶表格
 */
function renderTrashTable(files) {
    const tbody = document.getElementById('fileListBody');
    if (!tbody) return;
    
    const html = files.map(file => {
        const icon = getFileIconClass(file.name);
        
        return `
            <tr data-filename="${file.name}" class="trash-item">
                <td class="col-name">
                    <div class="file-name-cell">
                        <i class="fa-solid ${icon}" style="opacity: 0.5;"></i>
                        <div>
                            <div class="file-name" style="color: #9ca3af;">${file.name}</div>
                            <div class="file-folder">原位置: ${file.originalFolder}</div>
                        </div>
                    </div>
                </td>
                <td class="col-tags">
                    <span class="file-date" style="color: #9ca3af;">刪除於 ${file.deletedAt}</span>
                </td>
                <td class="col-date">
                    <span class="file-date">${file.uploadDate || '-'}</span>
                </td>
                <td class="col-actions">
                    <div class="file-actions">
                        <button class="btn small danger" onclick="permanentDelete('${file.name}')" title="永久刪除">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = html;
}

/**
 * 顯示/隱藏垃圾桶提示列（僅垃圾桶頁顯示）
 */
function setTrashNoticeVisible(isVisible) {
    const notice = document.getElementById('trashNoticeBar');
    if (!notice) return;
    notice.classList.toggle('show', isVisible);
}

/**
 * 顯示/隱藏垃圾桶頁工具列按鈕
 */
function setTrashActionsVisible(isVisible) {
    const uploadBtn = document.getElementById('uploadBtn');
    const newFolderBtn = document.getElementById('newFolderBtn');
    if (uploadBtn) uploadBtn.style.display = isVisible ? '' : 'none';
    if (newFolderBtn) newFolderBtn.style.display = isVisible ? '' : 'none';
}

/**
 * 移動檔案到垃圾桶
 */
function moveToTrash(fileName) {
    closeAllMoreMenus();
    
    // 從 fileDatabase 取得檔案資訊
    const data = localStorage.getItem('fileDatabase');
    if (!data) {
        showToast('無法載入檔案資料庫');
        return;
    }
    
    const db = JSON.parse(data);
    const fileIndex = db.files.findIndex(f => f.name === fileName);
    
    if (fileIndex === -1) {
        showToast('找不到該檔案');
        return;
    }
    
    const file = db.files[fileIndex];
    
    // 建立垃圾桶項目
    const trashItem = {
        name: file.name,
        originalFolder: file.folder,
        uploadDate: file.uploadDate,
        tags: file.tags,
        permissions: file.permissions,
        deletedAt: new Date().toISOString().split('T')[0]
    };
    
    // 從資料庫移除
    db.files.splice(fileIndex, 1);
    localStorage.setItem('fileDatabase', JSON.stringify(db));
    
    // 加入垃圾桶
    let trashFiles = JSON.parse(localStorage.getItem('trashFiles') || '[]');
    trashFiles.push(trashItem);
    localStorage.setItem('trashFiles', JSON.stringify(trashFiles));
    
    // 從收藏移除
    let favFiles = JSON.parse(localStorage.getItem('favoriteFiles') || '[]');
    favFiles = favFiles.filter(f => f !== fileName);
    localStorage.setItem('favoriteFiles', JSON.stringify(favFiles));
    
    // 從最近存取移除
    let recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    recentFiles = recentFiles.filter(f => f !== fileName);
    localStorage.setItem('recentFiles', JSON.stringify(recentFiles));
    
    showToast(`🗑️ 已將「${fileName}」移到垃圾桶`);
    updateQuickViewCounts();
    
    // 重新載入當前檢視
    if (currentFolder) {
        loadFilesForFolder(currentFolder);
    } else if (currentView === 'recent') {
        loadRecentFiles();
    } else if (currentView === 'fav') {
        loadFavoriteFiles();
    }
}

/**
 * 永久刪除檔案
 */
function permanentDelete(fileName) {
    if (!confirm(`確定要永久刪除「${fileName}」嗎？\n\n此操作無法復原！`)) {
        return;
    }
    
    let trashFiles = JSON.parse(localStorage.getItem('trashFiles') || '[]');
    trashFiles = trashFiles.filter(f => f.name !== fileName);
    localStorage.setItem('trashFiles', JSON.stringify(trashFiles));
    
    showToast(`🗑️ 已永久刪除「${fileName}」`);
    updateQuickViewCounts();
    
    // 重新載入垃圾桶
    loadTrashFiles();
}

/**
 * 清空垃圾桶
 */
function emptyTrash() {
    const trashFiles = JSON.parse(localStorage.getItem('trashFiles') || '[]');
    
    if (trashFiles.length === 0) {
        showToast('垃圾桶已經是空的');
        return;
    }
    
    if (!confirm(`確定要清空垃圾桶嗎？\n\n共 ${trashFiles.length} 個檔案將被永久刪除，此操作無法復原！`)) {
        return;
    }
    
    localStorage.setItem('trashFiles', JSON.stringify([]));
    showToast('🗑️ 垃圾桶已清空');
    updateQuickViewCounts();
    loadTrashFiles();
}

/**
 * 切換更多選單
 */
function toggleMoreMenu(event, fileName) {
    event.stopPropagation();
    
    // 關閉所有其他選單
    document.querySelectorAll('.more-menu-dropdown.show').forEach(menu => {
        menu.classList.remove('show');
    });
    
    // 切換目標選單
    const menuId = 'moreMenu_' + fileName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const menu = document.getElementById(menuId);
    if (menu) {
        menu.classList.toggle('show');
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

// 點擊外部關閉選單
document.addEventListener('click', function(event) {
    if (!event.target.closest('.more-menu-wrapper')) {
        closeAllMoreMenus();
    }
});

/**
 * 建立副本
 */
function duplicateFile(fileName) {
    closeAllMoreMenus();
    
    const data = localStorage.getItem('fileDatabase');
    if (!data) {
        showToast('無法載入檔案資料庫');
        return;
    }
    
    const db = JSON.parse(data);
    const file = db.files.find(f => f.name === fileName);
    
    if (!file) {
        showToast('找不到該檔案');
        return;
    }
    
    // 產生副本名稱
    const ext = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';
    const baseName = fileName.replace(ext, '');
    let copyName = `${baseName} - 副本${ext}`;
    let counter = 1;
    
    while (db.files.some(f => f.name === copyName && f.folder === file.folder)) {
        counter++;
        copyName = `${baseName} - 副本 (${counter})${ext}`;
    }
    
    // 建立副本
    const newFile = {
        ...file,
        name: copyName,
        uploadDate: new Date().toISOString().split('T')[0]
    };
    
    db.files.push(newFile);
    localStorage.setItem('fileDatabase', JSON.stringify(db));
    
    showToast(`📋 已建立副本「${copyName}」`);
    
    // 重新載入當前資料夾
    if (currentFolder) {
        loadFilesForFolder(currentFolder);
    }
}

/**
 * 修改檔名
 */
function renameFile(oldName) {
    closeAllMoreMenus();
    
    const newName = prompt('請輸入新的檔案名稱：', oldName);
    
    if (newName === null || newName.trim() === '' || newName.trim() === oldName) {
        return;
    }
    
    const data = localStorage.getItem('fileDatabase');
    if (!data) {
        showToast('無法載入檔案資料庫');
        return;
    }
    
    const db = JSON.parse(data);
    const file = db.files.find(f => f.name === oldName);
    
    if (!file) {
        showToast('找不到該檔案');
        return;
    }
    
    // 檢查新名稱是否已存在
    if (db.files.some(f => f.name === newName.trim() && f.folder === file.folder)) {
        showToast('此資料夾中已存在同名檔案');
        return;
    }
    
    // 更新檔名
    file.name = newName.trim();
    localStorage.setItem('fileDatabase', JSON.stringify(db));
    
    // 更新收藏
    let favFiles = JSON.parse(localStorage.getItem('favoriteFiles') || '[]');
    const favIndex = favFiles.indexOf(oldName);
    if (favIndex !== -1) {
        favFiles[favIndex] = newName.trim();
        localStorage.setItem('favoriteFiles', JSON.stringify(favFiles));
    }
    
    // 更新最近存取
    let recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    const recentIndex = recentFiles.indexOf(oldName);
    if (recentIndex !== -1) {
        recentFiles[recentIndex] = newName.trim();
        localStorage.setItem('recentFiles', JSON.stringify(recentFiles));
    }
    
    showToast(`✏️ 檔名已更新為「${newName.trim()}」`);
    
    // 重新載入當前檢視
    if (currentFolder) {
        loadFilesForFolder(currentFolder);
    } else if (currentView === 'recent') {
        loadRecentFiles();
    } else if (currentView === 'fav') {
        loadFavoriteFiles();
    }
}

/**
 * 搜尋資料夾
 */
function searchFolders(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    
    document.querySelectorAll('.nav-item').forEach(item => {
        const text = item.querySelector('span')?.textContent.toLowerCase() || '';
        if (text.includes(lowerKeyword) || !keyword) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // 展開有匹配項的部門
    if (keyword) {
        document.querySelectorAll('.nav-sublist').forEach(sublist => {
            const hasVisible = Array.from(sublist.querySelectorAll('.nav-item')).some(item => item.style.display !== 'none');
            if (hasVisible) sublist.classList.add('show');
        });
    }
}

/**
 * 顯示 Toast 通知
 */
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

/**
 * 檢視檔案
 */
function viewFile(fileName) {
    console.log('👁️ 檢視檔案:', fileName);
    showToast('正在開啟: ' + fileName);
    
    let recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    recentFiles = recentFiles.filter(f => f !== fileName);
    recentFiles.unshift(fileName);
    recentFiles = recentFiles.slice(0, 10);
    localStorage.setItem('recentFiles', JSON.stringify(recentFiles));
    updateQuickViewCounts();
}

/**
 * 下載檔案
 */
function downloadFile(fileName) {
    console.log('⬇️ 下載檔案:', fileName);
    showToast('開始下載: ' + fileName);
}

/**
 * 開啟上傳 Modal
 */
function openUploadModal() {
    showToast('上傳功能開發中...');
}

/**
 * 重置資料
 */
function resetMySpaceData() {
    localStorage.removeItem('fileDatabase');
    localStorage.removeItem('recentFiles');
    localStorage.removeItem('favoriteFiles');
    console.log('🗑️ 已清除舊資料');
    initKmMySpace();
    console.log('✅ 假資料已重新初始化');
}

// 頁面載入初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('km-recent.html')) {
        initKmMySpace();
    }
    if (window.location.pathname.includes('km-my-org.html')) {
        initKmMyOrg();
    }
});

// ==================== 分享功能 ====================

// 當前分享的檔案資料
let currentShareFile = null;

/**
 * 開啟分享 Modal
 */
function openShareModal(fileName, folder) {
    // 取得檔案資料
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;
    
    const db = JSON.parse(data);
    const file = db.files.find(f => f.name === fileName && f.folder === folder);
    
    if (!file) {
        showToast('找不到檔案資料');
        return;
    }
    
    currentShareFile = file;
    
    // 顯示檔案名稱
    const fileNameEl = document.getElementById('shareFileName');
    if (fileNameEl) {
        fileNameEl.innerHTML = `
            <i class="fa-solid ${getFileIconClass(fileName)}"></i>
            <span>${fileName}</span>
        `;
    }
    
    // 重置表單
    document.querySelectorAll('#shareModal input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('permView').checked = true;
    
    // 檢查是否已有分享
    const sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const existingShare = sharedByMe.find(s => s.name === fileName);
    
    if (existingShare) {
        // 填入現有分享設定
        existingShare.to.forEach(target => {
            const cb = document.querySelector(`#shareModal input[value="${target}"]`);
            if (cb) cb.checked = true;
        });
        existingShare.perms.forEach(perm => {
            if (perm === '瀏覽') document.getElementById('permView').checked = true;
            if (perm === '下載') document.getElementById('permDownload').checked = true;
            if (perm === '編輯') document.getElementById('permEdit').checked = true;
        });
        
        document.getElementById('shareModalTitle').textContent = '編輯共用設定';
        document.getElementById('shareSubmitBtn').textContent = '更新設定';
    } else {
        document.getElementById('shareModalTitle').textContent = '共用檔案';
        document.getElementById('shareSubmitBtn').textContent = '開始共用';
    }
    
    // 顯示 Modal
    document.getElementById('shareModal').classList.add('show');
}

/**
 * 關閉分享 Modal
 */
function closeShareModal() {
    document.getElementById('shareModal').classList.remove('show');
    currentShareFile = null;
}

/**
 * 提交分享設定
 */
function submitShare() {
    if (!currentShareFile) return;
    
    // 收集分享對象
    const targets = [];
    document.querySelectorAll('#shareTargets input[type="checkbox"]:checked').forEach(cb => {
        targets.push(cb.value);
    });
    
    if (targets.length === 0) {
        showToast('請選擇至少一個共用對象');
        return;
    }
    
    // 收集權限
    const permissions = [];
    if (document.getElementById('permView')?.checked) permissions.push('瀏覽');
    if (document.getElementById('permDownload')?.checked) permissions.push('下載');
    if (document.getElementById('permEdit')?.checked) permissions.push('編輯');
    
    // 檢查是否已有分享
    let sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const existingIndex = sharedByMe.findIndex(s => s.name === currentShareFile.name);
    
    if (existingIndex !== -1) {
        // 更新現有分享
        sharedByMe[existingIndex].to = targets;
        sharedByMe[existingIndex].perms = permissions;
        showToast('共用設定已更新');
    } else {
        // 新增分享
        const newShare = {
            id: 'sb' + Date.now(),
            name: currentShareFile.name,
            type: 'file',
            fileKind: currentShareFile.name.split('.').pop().toLowerCase(),
            folder: currentShareFile.folder,
            tags: currentShareFile.tags || [],
            to: targets,
            perms: permissions,
            status: '生效中',
            sharedAt: new Date().toISOString().split('T')[0]
        };
        sharedByMe.push(newShare);
        showToast('已成功共用「' + currentShareFile.name + '」');
    }
    
    localStorage.setItem('sharedByMe', JSON.stringify(sharedByMe));
    window.__kmData.sharedByMe = sharedByMe;
    
    closeShareModal();
    
    // 重新載入檔案列表以更新分享狀態
    if (currentFolder) {
        loadFilesForFolder(currentFolder);
    } else if (currentView) {
        if (currentView === 'recent') loadRecentFiles();
        else if (currentView === 'fav') loadFavoriteFiles();
    }
}

/**
 * 取消分享
 */
function cancelShare() {
    if (!currentShareFile) return;
    
    let sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const existingShare = sharedByMe.find(s => s.name === currentShareFile.name);
    
    if (!existingShare) {
        showToast('此檔案尚未共用');
        return;
    }
    
    if (confirm(`確定要取消共用「${currentShareFile.name}」嗎？`)) {
        sharedByMe = sharedByMe.filter(s => s.name !== currentShareFile.name);
        localStorage.setItem('sharedByMe', JSON.stringify(sharedByMe));
        window.__kmData.sharedByMe = sharedByMe;
        
        showToast('已取消共用');
        closeShareModal();
    }
}

// 點擊 Modal 外部關閉
document.addEventListener('click', function(e) {
    const modal = document.getElementById('shareModal');
    if (modal && e.target === modal) {
        closeShareModal();
    }
});
