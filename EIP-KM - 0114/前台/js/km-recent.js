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
 * 渲染左側「最近檔案」列表
 * 即使資料夾不可見，只要檔案有獨立存取權限，仍會顯示
 */
/**
 * 載入「最近檔案」到右側面板
 * 包含資料夾不可見但檔案有獨立存取權限的情境
 */
function loadRecentFilesView() {
    const recentNames = JSON.parse(localStorage.getItem('recentFiles') || '[]');
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;

    const db = JSON.parse(data);
    // 取出最近檔案：不論資料夾是否可見，只要檔案本身有權限就顯示
    const files = recentNames
        .map(name => db.files.find(f => f.name === name))
        .filter(f => f && f.permissions[currentUserDept] !== '不可見');

    renderFileTable(files, true);
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

    // 預設選取左側「所有空間」的第一個項目
    _selectFirstSpaceOrShowEmpty();

    console.log('✅ 共享部門已初始化');
}

/**
 * 自動選取左側「所有空間」的第一個資料夾，若無空間則顯示提示訊息
 */
function _selectFirstSpaceOrShowEmpty() {
    const firstSpace = document.querySelector('#deptFoldersList .nav-item');
    if (firstSpace && firstSpace.dataset.path) {
        // 自動選取第一個空間
        selectFolder(firstSpace.dataset.path);
    } else {
        // 無空間權限，顯示提示
        const titleEl = document.getElementById('currentFolderName');
        if (titleEl) titleEl.textContent = '無空間權限';
        const tbody = document.getElementById('fileListBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; padding:60px 20px; color:#94A3B8;">
                        <i class="fa-solid fa-folder-xmark" style="font-size:48px; margin-bottom:16px; display:block; color:#CBD5E1;"></i>
                        <div style="font-size:15px; font-weight:500;">您目前沒有任何空間權限</div>
                        <div style="font-size:13px; margin-top:6px;">請聯繫系統管理員取得權限</div>
                    </td>
                </tr>`;
        }
        // 隱藏上傳與新增按鈕
        const uploadBtn = document.getElementById('uploadBtn');
        const newFolderBtn = document.getElementById('newFolderBtn');
        if (uploadBtn) uploadBtn.style.display = 'none';
        if (newFolderBtn) newFolderBtn.style.display = 'none';
    }
}

/**
 * 載入頂層部門資料夾到右側面板
 */
function loadTopDeptFolders() {
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;

    const db = JSON.parse(data);
    const topDepts = ['HR', '管理部', '行政部', '專案'];
    const deptNames = {
        'HR': 'HR (人資部)',
        '管理部': '會議記錄',
        '行政部': '年報',
        '專案': '分享資料'
    };

    const topFolders = topDepts
        .map(dept => db.folders.find(f => f.name === dept))
        .filter(f => f && f.permissions[currentUserDept] !== '不可見');

    const tbody = document.getElementById('fileListBody');
    if (!tbody) return;

    // 隱藏表頭的日期與操作欄
    const thead = tbody.closest('table')?.querySelector('thead');
    if (thead) {
        thead.querySelectorAll('.col-date, .col-actions').forEach(th => th.style.display = 'none');
        thead.querySelectorAll('.col-tags').forEach(th => th.style.display = 'none');
    }

    // 隱藏上傳檔案與新增資料夾按鈕
    const uploadBtn = document.getElementById('uploadBtn');
    const newFolderBtn = document.getElementById('newFolderBtn');
    if (uploadBtn) uploadBtn.style.display = 'none';
    if (newFolderBtn) newFolderBtn.style.display = 'none';

    tbody.innerHTML = topFolders.map(f => {
        const displayName = deptNames[f.name] || f.name;
        const safeName = f.name.replace(/'/g, "\\'");
        return `
            <tr class="folder-row" style="cursor:pointer;" onclick="selectFolder('${safeName}')">
                <td class="col-name">
                    <div class="file-name-cell">
                        <i class="fa-solid fa-folder" style="color:#F59E0B;font-size:18px;"></i>
                        <div>
                            <div class="file-name">${displayName}</div>
                        </div>
                    </div>
                </td>
            </tr>`;
    }).join('');
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
        '管理部': '會議記錄',
        '行政部': '年報',
        '專案': '分享資料'
    };
    
    // 區分：部門空間（可管理）與共享資料夾（僅可讀取）
    let spaceHtml = '';   // 所有空間
    let sharedHtml = '';  // 共享資料夾
    
    topDepts.forEach(dept => {
        const deptFolder = db.folders.find(f => f.name === dept);
        const perm = deptFolder?.permissions[currentUserDept];
        if (perm === '不可見') return;

        const isManageable = (typeof _myManageableFolders !== 'undefined') && _myManageableFolders.includes(dept);
        const displayName = deptNames[dept] || dept;
        const safeDept = dept.replace(/'/g, "\\'");
        
        if (isManageable) {
            // 部門空間 → 房子圖示
            spaceHtml += `
                <div class="nav-item nav-dept" data-path="${dept}" onclick="selectFolder('${safeDept}')">
                    <i class="fa-solid fa-building"></i>
                    <span>${displayName}</span>
                </div>
            `;
        } else {
            // 共享資料夾 → 資料夾圖示
            sharedHtml += `
                <div class="nav-item nav-dept" data-path="${dept}" onclick="selectFolder('${safeDept}')">
                    <i class="fa-solid fa-folder" style="color:#F59E0B;"></i>
                    <span>${displayName}</span>
                </div>
            `;
        }
    });
    
    container.innerHTML = spaceHtml;

    // 渲染共享資料夾區塊
    const sharedContainer = document.getElementById('sharedFoldersList');
    const sharedSection = document.getElementById('sharedFoldersSection');
    if (sharedContainer) sharedContainer.innerHTML = sharedHtml;
    // 若無共享資料夾則隱藏該區塊
    if (sharedSection) sharedSection.style.display = sharedHtml ? '' : 'none';
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
    
    // 更新標題為可點擊的麵包屑路徑
    document.getElementById('currentFolderName').innerHTML = renderFolderBreadcrumb(folderPath);
    
    // 載入檔案
    loadFilesForFolder(folderPath);
}

/**
 * 產生可點擊的資料夾麵包屑路徑 HTML
 * 例如 "HR/表單/請假" → "HR (人資部) / 表單 / 請假"
 * 每一層（除了最後一層）可點擊回到該層資料夾
 */
function renderFolderBreadcrumb(folderPath) {
    // 頂層資料夾顯示名稱對照
    const folderDisplayNames = {
        'HR': 'HR (人資部)',
        '管理部': '會議記錄',
        '行政部': '年報',
        '專案': '分享資料'
    };
    const parts = folderPath.split('/');
    const crumbs = [];
    
    for (let i = 0; i < parts.length; i++) {
        const partPath = parts.slice(0, i + 1).join('/');
        // 頂層使用顯示名稱，子層使用原始名稱
        const displayName = (i === 0) ? (folderDisplayNames[parts[i]] || parts[i]) : parts[i];
        
        if (i < parts.length - 1) {
            // 可點擊的父層連結
            const safePath = partPath.replace(/'/g, "\\'");
            crumbs.push(`<a class="breadcrumb-link" href="javascript:void(0)" onclick="selectFolder('${safePath}')">${displayName}</a>`);
        } else {
            // 目前所在層（不可點擊）
            crumbs.push(`<span class="breadcrumb-current">${displayName}</span>`);
        }
    }
    
    return crumbs.join('<span class="breadcrumb-sep"> / </span>');
}

/**
 * 選擇快速檢視
 */
function selectQuickView(view) {
    currentView = view;
    currentFolder = null;
    setTrashNoticeVisible(view === 'trash');
    setTrashActionsVisible(view !== 'trash' && view !== 'fav' && view !== 'recentFiles');
    
    // 更新 active 狀態
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const target = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (target) target.classList.add('active');
    
    // 更新標題
    const titles = { 'recent': '最近存取', 'fav': '我的收藏', 'trash': '垃圾桶', 'recentFiles': '最近檔案' };
    document.getElementById('currentFolderName').textContent = titles[view];
    
    // 載入檔案
    if (view === 'recent') {
        loadRecentFiles();
    } else if (view === 'fav') {
        loadFavoriteFiles();
    } else if (view === 'trash') {
        loadTrashFiles();
    } else if (view === 'recentFiles') {
        loadRecentFilesView();
    }
}

/**
 * 載入資料夾的檔案
 */
function loadFilesForFolder(folderPath) {
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;
    
    const db = JSON.parse(data);

    // 取得直接子資料夾
    const subFolders = db.folders.filter(f => {
        if (!f.name.startsWith(folderPath + '/')) return false;
        const rest = f.name.slice(folderPath.length + 1);
        return rest && !rest.includes('/'); // 只取直接子資料夾
    });

    const files = db.files.filter(f => {
        const isInFolder = f.folder === folderPath;
        const perm = f.permissions[currentUserDept];
        return isInFolder && perm !== '不可見';
    });
    
    renderFileTable(files, false, subFolders);
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
    
    const recentFilesCount = document.getElementById('recentFilesCount');

    if (recentCount) recentCount.textContent = recentFiles.length;
    if (favCount) favCount.textContent = favFiles.length;
    if (trashCount) trashCount.textContent = trashFiles.length;
    if (recentFilesCount) recentFilesCount.textContent = recentFiles.length;
}

/**
 * 渲染檔案表格
 */
function renderFileTable(files, showFolder = false, subFolders = []) {
    const tbody = document.getElementById('fileListBody');
    if (!tbody) return;

    // 還原被 loadTopDeptFolders 隱藏的表頭欄位
    const thead = tbody.closest('table')?.querySelector('thead');
    if (thead) {
        thead.querySelectorAll('.col-date, .col-actions, .col-tags').forEach(th => th.style.display = '');
    }

    // 還原上傳檔案與新增資料夾按鈕（快速檢視模式下隱藏）
    const uploadBtn = document.getElementById('uploadBtn');
    const newFolderBtn = document.getElementById('newFolderBtn');
    const quickViews = ['fav', 'trash', 'recentFiles'];
    if (currentView && quickViews.includes(currentView)) {
        if (uploadBtn) uploadBtn.style.display = 'none';
        if (newFolderBtn) newFolderBtn.style.display = 'none';
    } else {
        // 所有資料夾（含共享資料夾）皆顯示上傳與新增資料夾按鈕
        if (uploadBtn) uploadBtn.style.display = '';
        if (newFolderBtn) newFolderBtn.style.display = '';
    }
    
    if (files.length === 0 && subFolders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">此資料夾沒有檔案</td></tr>';
        return;
    }

    // 子資料夾列
    const favFolders = JSON.parse(localStorage.getItem('favoriteFolders') || '[]');
    let folderHtml = subFolders.map(sf => {
        const displayName = sf.name.split('/').pop();
        const safeName = sf.name.replace(/'/g, "\\'");
        const safeId = sf.name.replace(/[^a-zA-Z0-9一-龥]/g, '_');
        const isFolderFav = favFolders.includes(sf.name);
        const folderFavIcon = isFolderFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
        const folderFavClass = isFolderFav ? 'fav-active' : '';
        return `
            <tr class="folder-row" style="cursor:pointer;">
                <td class="col-name" onclick="selectFolder('${safeName}')">
                    <div class="file-name-cell">
                        <i class="fa-solid fa-folder" style="color:#F59E0B;font-size:18px;"></i>
                        <div>
                            <div class="file-name">${displayName}</div>
                        </div>
                    </div>
                </td>
                <td class="col-tags" onclick="selectFolder('${safeName}')"></td>
                <td class="col-date" onclick="selectFolder('${safeName}')"><span class="file-date">—</span></td>
                <td class="col-actions">
                    <div class="file-actions">
                        <button class="btn small ghost ${folderFavClass}" onclick="event.stopPropagation(); toggleFolderFavorite('${safeName}')" title="${isFolderFav ? '取消收藏' : '加入收藏'}">
                            <i class="${folderFavIcon}"></i>
                        </button>
                        <button class="btn small ghost" onclick="event.stopPropagation(); quickShare('folder', '${safeName}')" title="分享">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                        <div class="more-menu-wrapper">
                            <button class="btn small ghost" onclick="event.stopPropagation(); toggleMoreMenu(event, '${safeName}')" title="更多操作">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div class="more-menu-dropdown" id="moreMenu_${safeId}">
                                <button class="menu-item" onclick="openPermOrgModal('${safeName}')">
                                    <i class="fa-solid fa-shield-halved"></i>權限設定
                                </button>
                                <button class="menu-item" onclick="renameFolder('${safeName}')">
                                    <i class="fa-solid fa-pen"></i>重新命名
                                </button>
                                <button class="menu-item danger" onclick="deleteFolderConfirm('${safeName}')">
                                    <i class="fa-solid fa-trash-can"></i>刪除資料夾
                                </button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
    }).join('');
    
    const html = files.map(file => {
        const icon = getFileIconClass(file.name);
        const isFav = isFileFavorited(file.name);
        const favIcon = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
        const favClass = isFav ? 'fav-active' : '';
        const ext = file.name.split('.').pop().toLowerCase();
        const canPreview = ['pdf','png','jpg','jpeg'].includes(ext);
        
        const tagsHtml = (file.tags || []).slice(0, 3).map(tag => 
            `<span class="file-tag">${tag}</span>`
        ).join('');
        const filePrivacy = getItemPrivacy(file.name);
        const filePrivBadgeId = 'privacyBadge_' + file.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
        const fileIsConfidential = filePrivacy === 'confidential';
        const fileSafeName = file.name.replace(/'/g, "\\'");
        
        return `
            <tr data-filename="${file.name}">
                <td class="col-name">
                    <div class="file-name-cell">
                        <i class="fa-solid ${icon}"></i>
                        <div>
                            <div class="file-name">${file.name}<span class="privacy-badge confidential" id="${filePrivBadgeId}" style="display:${fileIsConfidential ? 'inline-flex' : 'none'}"><i class="fa-solid fa-lock"></i>機密</span></div>
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
                        <button class="btn small ghost" onclick="quickShare('file', '${file.name}', '${file.folder}')" title="分享">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                        <button class="btn small ghost${canPreview ? '' : ' disabled'}" ${canPreview ? `onclick="viewFile('${file.name}')"` : ''} title="${canPreview ? '檢視' : '此檔案格式不支援線上檢視'}" ${canPreview ? '' : 'style="opacity:.35;cursor:not-allowed;"'}>
                            <i class="fa-solid ${canPreview ? 'fa-eye' : 'fa-eye-slash'}"></i>
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
                                    <i class="fa-solid fa-shield-halved"></i>權限設定
                                </button>
                                <button class="menu-item" onclick="openPrivacyDialog('${fileSafeName}')">
                                    <i class="fa-solid fa-lock"></i>檔案隱私
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
    
    tbody.innerHTML = folderHtml + html;
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
 * 切換資料夾收藏
 */
function toggleFolderFavorite(folderPath) {
    let favFolders = JSON.parse(localStorage.getItem('favoriteFolders') || '[]');

    if (favFolders.includes(folderPath)) {
        favFolders = favFolders.filter(f => f !== folderPath);
        showToast('已取消收藏');
    } else {
        favFolders.push(folderPath);
        showToast('⭐ 已加入收藏');
    }

    localStorage.setItem('favoriteFolders', JSON.stringify(favFolders));

    // 重新載入以更新星星狀態
    if (currentFolder) loadFilesForFolder(currentFolder);
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
                        <i class="fa-solid ${icon}"></i>
                        <div>
                            <div class="file-name">${file.name}</div>
                            <div class="file-folder">原位置: ${file.originalFolder}</div>
                        </div>
                    </div>
                </td>
                <td class="col-tags">
                    <span class="file-date">刪除於 ${file.deletedAt}</span>
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
 * 重新命名資料夾
 */
function renameFolder(folderPath) {
    closeAllMoreMenus();

    // 權限檢查
    const dbCheck = localStorage.getItem('fileDatabase');
    if (dbCheck) {
        const parsed = JSON.parse(dbCheck);
        const folderObj = parsed.folders.find(f => f.name === folderPath);
        if (folderObj && folderObj.permissions) {
            const myPerm = folderObj.permissions[currentUserDept];
            if (myPerm !== '完全控制') {
                showToast('⚠️ 您沒有此資料夾的編輯權限，無法重新命名', 'warning');
                return;
            }
        }
    }

    const oldName = folderPath.split('/').pop();
    const newName = prompt('請輸入新的資料夾名稱：', oldName);

    if (newName === null || newName.trim() === '' || newName.trim() === oldName) return;

    const data = localStorage.getItem('fileDatabase');
    if (!data) { showToast('無法載入資料庫'); return; }

    const db = JSON.parse(data);
    const parentPath = folderPath.includes('/') ? folderPath.substring(0, folderPath.lastIndexOf('/')) : '';
    const newFolderPath = parentPath ? parentPath + '/' + newName.trim() : newName.trim();

    // 檢查同層是否有同名資料夾
    if (db.folders.some(f => f.name === newFolderPath)) {
        showToast('已存在同名的資料夾'); return;
    }

    // 更新此資料夾及其所有子資料夾的路徑
    db.folders.forEach(f => {
        if (f.name === folderPath) {
            f.name = newFolderPath;
        } else if (f.name.startsWith(folderPath + '/')) {
            f.name = newFolderPath + f.name.slice(folderPath.length);
        }
    });

    // 更新檔案的 folder 路徑
    db.files.forEach(f => {
        if (f.folder === folderPath) {
            f.folder = newFolderPath;
        } else if (f.folder.startsWith(folderPath + '/')) {
            f.folder = newFolderPath + f.folder.slice(folderPath.length);
        }
    });

    localStorage.setItem('fileDatabase', JSON.stringify(db));
    showToast(`✏️ 資料夾已重新命名為「${newName.trim()}」`);

    if (currentFolder) loadFilesForFolder(currentFolder);
}

/**
 * 刪除資料夾確認
 */
function deleteFolderConfirm(folderPath) {
    closeAllMoreMenus();

    // 權限檢查
    const dbCheck = localStorage.getItem('fileDatabase');
    if (dbCheck) {
        const parsed = JSON.parse(dbCheck);
        const folderObj = parsed.folders.find(f => f.name === folderPath);
        if (folderObj && folderObj.permissions) {
            const myPerm = folderObj.permissions[currentUserDept];
            if (myPerm !== '完全控制') {
                showToast('⚠️ 您沒有此資料夾的編輯權限，無法刪除', 'warning');
                return;
            }
        }
    }

    const displayName = folderPath.split('/').pop();
    if (!confirm(`確定要刪除資料夾「${displayName}」及其中所有內容嗎？\n此操作無法復原。`)) return;

    const data = localStorage.getItem('fileDatabase');
    if (!data) return;

    const db = JSON.parse(data);

    // 刪除資料夾本身及所有子資料夾
    db.folders = db.folders.filter(f => f.name !== folderPath && !f.name.startsWith(folderPath + '/'));

    // 刪除該資料夾及子資料夾中的所有檔案
    db.files = db.files.filter(f => f.folder !== folderPath && !f.folder.startsWith(folderPath + '/'));

    localStorage.setItem('fileDatabase', JSON.stringify(db));
    showToast(`🗑️ 已刪除資料夾「${displayName}」`);

    if (currentFolder) loadFilesForFolder(currentFolder);
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
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'warning' ? ' toast-warning' : '');
    const icon = type === 'warning' ? 'fa-triangle-exclamation' : 'fa-check-circle';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
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

// ==================== 上傳功能 ====================
let uploadSelectedFiles = [];

/**
 * 開啟上傳 Modal
 */
function openUploadModal() {
    uploadSelectedFiles = [];
    renderUploadFileList();
    openModal('uploadModal');
    initUploadDropzone();
}

/**
 * 初始化拖曳上傳區
 */
function initUploadDropzone() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('uploadFiles');
    const uploadBtn = document.getElementById('uploadFileBtn');
    if (!dropzone || !fileInput) return;

    if (dropzone.dataset.bound) return;
    dropzone.dataset.bound = '1';

    dropzone.addEventListener('click', (e) => {
        if (e.target.closest('.file-remove')) return;
        fileInput.click();
    });

    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }

    fileInput.addEventListener('change', (e) => {
        addUploadFiles(e.target.files);
        fileInput.value = '';
    });

    dropzone.addEventListener('dragenter', (e) => {
        e.preventDefault(); e.stopPropagation();
        dropzone.classList.add('dragging');
    });
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault(); e.stopPropagation();
        dropzone.classList.add('dragging');
    });
    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (!dropzone.contains(e.relatedTarget)) dropzone.classList.remove('dragging');
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault(); e.stopPropagation();
        dropzone.classList.remove('dragging');
        if (e.dataTransfer.files.length > 0) addUploadFiles(e.dataTransfer.files);
    });
}

/**
 * 新增檔案到上傳列表
 */
function addUploadFiles(fileList) {
    const maxFiles = 10;
    if (uploadSelectedFiles.length + fileList.length > maxFiles) {
        alert('⚠️ 一次最多上傳 ' + maxFiles + ' 個檔案');
    }
    for (const file of fileList) {
        if (uploadSelectedFiles.length >= maxFiles) break;
        if (!uploadSelectedFiles.find(f => f.name === file.name && f.size === file.size)) {
            uploadSelectedFiles.push(file);
        }
    }
    renderUploadFileList();
}

/**
 * 移除上傳列表中的檔案
 */
function removeUploadFile(index) {
    uploadSelectedFiles.splice(index, 1);
    renderUploadFileList();
}

/**
 * 格式化檔案大小
 */
function uploadFormatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * 根據副檔名取得上傳檔案圖示
 */
function getUploadFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const map = {
        'pdf': 'fa-solid fa-file-pdf', 'doc': 'fa-solid fa-file-word', 'docx': 'fa-solid fa-file-word',
        'xls': 'fa-solid fa-file-excel', 'xlsx': 'fa-solid fa-file-excel',
        'ppt': 'fa-solid fa-file-powerpoint', 'pptx': 'fa-solid fa-file-powerpoint',
        'jpg': 'fa-solid fa-file-image', 'jpeg': 'fa-solid fa-file-image', 'png': 'fa-solid fa-file-image',
        'gif': 'fa-solid fa-file-image', 'svg': 'fa-solid fa-file-image',
        'mp3': 'fa-solid fa-file-audio', 'wav': 'fa-solid fa-file-audio',
        'mp4': 'fa-solid fa-file-video', 'zip': 'fa-solid fa-file-zipper', 'rar': 'fa-solid fa-file-zipper',
        'txt': 'fa-solid fa-file-lines',
    };
    return map[ext] || 'fa-solid fa-file';
}

/**
 * 渲染已選檔案列表
 */
function renderUploadFileList() {
    const listEl = document.getElementById('uploadFileList');
    const progressFill = document.getElementById('uploadProgressFill');
    const progressText = document.getElementById('uploadProgressText');
    const dropzoneContent = document.querySelector('.upload-dropzone-content');
    if (!listEl) return;

    const count = uploadSelectedFiles.length, max = 10;
    if (progressFill) progressFill.style.width = Math.min((count / max) * 100, 100) + '%';
    if (progressText) progressText.textContent = count + '/' + max;

    if (count === 0) {
        listEl.innerHTML = '';
        if (dropzoneContent) dropzoneContent.style.display = '';
        return;
    }

    if (dropzoneContent) dropzoneContent.style.display = 'none';
    listEl.innerHTML = uploadSelectedFiles.map((file, idx) =>
        `<div class="upload-file-item">
            <i class="file-icon ${getUploadFileIcon(file.name)}"></i>
            <span class="file-name" title="${file.name}">${file.name}</span>
            <span class="file-size">${uploadFormatFileSize(file.size)}</span>
            <button class="file-remove" onclick="event.stopPropagation(); removeUploadFile(${idx})"><i class="fa-solid fa-xmark"></i></button>
        </div>`
    ).join('');
}

/**
 * 切換上傳檔案隱私性設定
 * @param {HTMLElement} btn - 被點擊的按鈕
 * @param {string} value - 'general' 或 'confidential'
 */
function setUploadPrivacy(btn, value) {
    const toggle = btn.closest('.upload-privacy-toggle');
    toggle.querySelectorAll('.privacy-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // 儲存目前選擇的隱私性
    window._uploadPrivacy = value;
}

// 預設隱私性為一般
window._uploadPrivacy = 'general';

// ===== 檔案／資料夾隱私設定 =====

/**
 * 取得項目隱私設定
 * @param {string} name - 檔案名稱或資料夾路徑
 * @returns {string} 'general' 或 'confidential'
 */
function getItemPrivacy(name) {
    const settings = JSON.parse(localStorage.getItem('itemPrivacySettings') || '{}');
    return settings[name] || 'general';
}

/**
 * 設定項目隱私並持久化
 * @param {string} name - 檔案名稱或資料夾路徑
 * @param {string} value - 'general' 或 'confidential'
 */
function setItemPrivacy(name, value) {
    const settings = JSON.parse(localStorage.getItem('itemPrivacySettings') || '{}');
    if (value === 'general') {
        delete settings[name]; // 預設值不需儲存
    } else {
        settings[name] = value;
    }
    localStorage.setItem('itemPrivacySettings', JSON.stringify(settings));
}

/**
 * 開啟檔案隱私設定 Dialog
 * @param {string} name - 檔案名稱或資料夾路徑
 */
function openPrivacyDialog(name) {
    closeAllMoreMenus();
    const current = getItemPrivacy(name);
    window._privacyDialogTarget = name;
    // 更新 dialog 顯示名稱
    const displayName = name.split('/').pop();
    const nameEl = document.getElementById('privacyDialogName');
    if (nameEl) nameEl.textContent = displayName;
    // 設定當前選擇狀態
    document.querySelectorAll('#privacyDialog .privacy-dialog-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.value === current);
    });
    // 顯示 dialog
    const dialog = document.getElementById('privacyDialog');
    if (dialog) dialog.classList.add('show');
}

/**
 * 關閉檔案隱私設定 Dialog
 */
function closePrivacyDialog() {
    const dialog = document.getElementById('privacyDialog');
    if (dialog) dialog.classList.remove('show');
    window._privacyDialogTarget = null;
}

/**
 * 點擊隱私選項
 * @param {HTMLElement} optEl - 被點擊的選項元素
 */
function selectPrivacyOption(optEl) {
    document.querySelectorAll('#privacyDialog .privacy-dialog-option').forEach(o => o.classList.remove('active'));
    optEl.classList.add('active');
}

/**
 * 確認檔案隱私設定
 */
function confirmPrivacyDialog() {
    const name = window._privacyDialogTarget;
    if (!name) return;
    const activeOpt = document.querySelector('#privacyDialog .privacy-dialog-option.active');
    const value = activeOpt ? activeOpt.dataset.value : 'general';
    setItemPrivacy(name, value);
    // 更新檔案名稱旁的機密標記
    const safeId = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const badge = document.getElementById('privacyBadge_' + safeId);
    if (badge) {
        badge.style.display = (value === 'confidential') ? 'inline-flex' : 'none';
    }
    // 提示
    const label = value === 'confidential' ? '機密' : '一般';
    if (typeof showToast === 'function') {
        showToast('已將「' + name.split('/').pop() + '」設為' + label);
    }
    closePrivacyDialog();
}

/**
 * 重置上傳隱私性為預設值（一般）
 */
function resetUploadPrivacy() {
    window._uploadPrivacy = 'general';
    document.querySelectorAll('.upload-privacy-toggle .privacy-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === 'general');
    });
    // 重置「覆蓋同名檔案」勾選狀態
    const overwriteCheck = document.getElementById('uploadOverwriteCheck');
    if (overwriteCheck) overwriteCheck.checked = false;
}

/**
 * 執行上傳
 */
function doUpload() {
    if (uploadSelectedFiles.length === 0) {
        alert('請先選擇要上傳的檔案');
        return;
    }

    const targetFolder = currentFolder || 'HR/FAQ';
    const currentUserDept = 'HR';

    const data = localStorage.getItem('fileDatabase');
    if (!data) {
        alert('無法載入檔案資料庫');
        return;
    }

    const db = JSON.parse(data);
    const today = new Date().toISOString().split('T')[0];

    // 取得「覆蓋同名檔案」勾選狀態
    const overwriteCheck = document.getElementById('uploadOverwriteCheck');
    const isOverwrite = overwriteCheck ? overwriteCheck.checked : false;

    uploadSelectedFiles.forEach(file => {
        const existingIndex = db.files.findIndex(f => f.name === file.name && f.folder === targetFolder);
        let finalName = file.name;

        if (existingIndex !== -1) {
            if (isOverwrite) {
                // 覆蓋模式：更新既有檔案的中繼資訊，保留原有 ID
                db.files[existingIndex].size = uploadFormatFileSize(file.size);
                db.files[existingIndex].sizeBytes = file.size;
                db.files[existingIndex].uploadDate = today;
                db.files[existingIndex].privacy = window._uploadPrivacy || 'general';
                console.log('🔄 覆蓋同名檔案:', file.name);
                return; // 已覆蓋，不需再新增
            } else {
                // 重新命名模式：在副檔名前加上時間戳記 _YYYYMMDDHHmmssSSS
                const now = new Date();
                const timestamp = now.getFullYear().toString()
                    + String(now.getMonth() + 1).padStart(2, '0')
                    + String(now.getDate()).padStart(2, '0')
                    + String(now.getHours()).padStart(2, '0')
                    + String(now.getMinutes()).padStart(2, '0')
                    + String(now.getSeconds()).padStart(2, '0')
                    + String(now.getMilliseconds()).padStart(3, '0');
                const dotIndex = file.name.lastIndexOf('.');
                if (dotIndex > 0) {
                    finalName = file.name.substring(0, dotIndex) + '_' + timestamp + file.name.substring(dotIndex);
                } else {
                    finalName = file.name + '_' + timestamp;
                }
                console.log('📝 同名檔案重新命名:', file.name, '→', finalName);
            }
        }

        const newFile = {
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            name: finalName,
            path: '/' + targetFolder + '/',
            folder: targetFolder,
            department: currentUserDept,
            size: uploadFormatFileSize(file.size),
            sizeBytes: file.size,
            uploadDate: today,
            privacy: window._uploadPrivacy || 'general', // 隱私性：general(一般) / confidential(機密)
            tags: [],
            permissions: {
                'HR': '完全控制',
                '管理部': '僅瀏覽',
                '行政部': '僅瀏覽'
            }
        };
        db.files.push(newFile);
    });

    localStorage.setItem('fileDatabase', JSON.stringify(db));

    const count = uploadSelectedFiles.length;
    showToast('✅ 已成功上傳 ' + count + ' 個檔案到「' + targetFolder + '」');

    uploadSelectedFiles = [];
    renderUploadFileList();
    resetUploadPrivacy();
    closeModal('uploadModal');

    if (currentFolder) {
        loadFilesForFolder(currentFolder);
    }
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

// ==================== 快速分享功能 ====================

/**
 * 快速分享：產生連結並複製到剪貼簿
 * @param {'folder'|'file'} type - 分享類型
 * @param {string} name - 資料夾路徑或檔案名稱
 * @param {string} [folder] - 檔案所屬資料夾（僅 type=file 時使用）
 */
function quickShare(type, name, folder) {
    let itemId = '';
    let displayName = name;

    if (type === 'folder') {
        // 資料夾：以資料夾路徑產生 ID
        itemId = encodeURIComponent(name);
        displayName = name.split('/').pop();
    } else {
        // 檔案：從 fileDatabase 取得檔案 ID
        const data = localStorage.getItem('fileDatabase');
        if (data) {
            const db = JSON.parse(data);
            const file = db.files.find(f => f.name === name && f.folder === (folder || currentFolder));
            if (file) {
                itemId = file.id;
            }
        }
        if (!itemId) {
            itemId = encodeURIComponent(name);
        }
        displayName = name;
    }

    // 產生分享連結
    const baseUrl = window.location.origin;
    const shareLink = baseUrl + '/share/' + type + '/' + itemId;

    // 複製到剪貼簿
    navigator.clipboard.writeText(shareLink).then(() => {
        showToast('已複製「' + displayName + '」的分享連結');
    }).catch(() => {
        // 降級方案：使用 execCommand
        const tempInput = document.createElement('input');
        tempInput.value = shareLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('已複製「' + displayName + '」的分享連結');
    });
}

// ==================== 共用設定功能 ====================

// 當前分享的檔案資料
let currentShareFile = null;
// 共用對象清單（表格資料）
let _sharePermList = [];

/**
 * 開啟分享 Modal
 */
function openShareModal(fileName, folder) {
    // 取得檔案資料
    const data = localStorage.getItem('fileDatabase');
    if (!data) return;
    
    const db = JSON.parse(data);
    
    // 先從檔案找，找不到就嘗試作為資料夾
    let file = db.files.find(f => f.name === fileName && f.folder === folder);
    let isFolder = false;
    
    if (!file) {
        // 嘗試作為資料夾路徑
        const folderObj = db.folders.find(f => f.name === fileName);
        if (folderObj) {
            isFolder = true;
            const displayName = fileName.split('/').pop();
            file = { name: displayName, folder: fileName, tags: [] };
        }
    }
    
    if (!file) {
        showToast('找不到資料');
        return;
    }
    
    currentShareFile = file;
    currentShareFile._isFolder = isFolder;
    currentShareFile._fullPath = isFolder ? fileName : null;
    
    // 顯示名稱
    const fileNameEl = document.getElementById('shareFileName');
    if (fileNameEl) {
        const icon = isFolder ? 'fa-folder' : getFileIconClass(fileName);
        const iconStyle = isFolder ? ' style="color:#F59E0B;"' : '';
        fileNameEl.innerHTML = `
            <i class="fa-solid ${icon}"${iconStyle}></i>
            <span>${file.name}</span>
        `;
    }
    
    // 檢查是否已有分享
    const shareKey = isFolder ? fileName : file.name;
    const sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const existingShare = sharedByMe.find(s => s.name === shareKey);
    
    if (existingShare && existingShare.shareEntries) {
        _sharePermList = JSON.parse(JSON.stringify(existingShare.shareEntries));
        document.getElementById('shareModalTitle').textContent = isFolder ? '編輯資料夾共用設定' : '編輯共用設定';
        document.getElementById('shareSubmitBtn').textContent = '更新設定';
    } else if (existingShare) {
        _sharePermList = existingShare.to.map(t => ({
            name: t, type: '部門',
            edit: existingShare.perms.includes('編輯'),
            view: true,
            denied: false,
            reason: ''
        }));
        document.getElementById('shareModalTitle').textContent = isFolder ? '編輯資料夾共用設定' : '編輯共用設定';
        document.getElementById('shareSubmitBtn').textContent = '更新設定';
    } else {
        _sharePermList = [];
        document.getElementById('shareModalTitle').textContent = isFolder ? '共用資料夾' : '共用檔案';
        document.getElementById('shareSubmitBtn').textContent = '開始共用';
    }
    
    // 初始化共用組織樹
    _shareOrgExpandedNodes = {};
    if (typeof _permOrgTree !== 'undefined') {
        _shareOrgExpandedNodes[_permOrgTree.id] = true;
    }
    if (document.getElementById('shareOrgSearchInput')) {
        document.getElementById('shareOrgSearchInput').value = '';
    }
    renderShareOrgTree();
    renderSharePermTable();
    
    // 產生共用連結（內網 + 外網）
    const fakeId = btoa(encodeURIComponent(shareKey)).replace(/=/g, '').substring(0, 12);
    const intranetInput = document.getElementById('shareLinkIntranet');
    const externalInput = document.getElementById('shareLinkExternal');
    if (intranetInput) {
        intranetInput.value = 'http://192.168.1.100/km/shared/' + fakeId;
    }
    if (externalInput) {
        externalInput.value = 'https://km.example.com/shared/' + fakeId;
    }

    // 設定共用開關狀態
    const shareToggle = document.getElementById('shareToggleInput');
    const isExisting = !!existingShare;
    if (shareToggle) {
        shareToggle.checked = isExisting;
        updateShareToggleUI(isExisting);
    }
    
    document.getElementById('shareModal').classList.add('show');
}

/** 複製共用連結 */
function copyShareLink(type) {
    const inputId = type === 'external' ? 'shareLinkExternal' : 'shareLinkIntranet';
    const label = type === 'external' ? '外網' : '內網';
    const linkInput = document.getElementById(inputId);
    if (!linkInput) return;
    navigator.clipboard.writeText(linkInput.value).then(() => {
        showToast('已複製' + label + '共用連結');
    }).catch(() => {
        linkInput.select();
        document.execCommand('copy');
        showToast('已複製' + label + '共用連結');
    });
}

/** 共用 Modal 用的組織樹展開狀態 */
let _shareOrgExpandedNodes = {};

/** 渲染共用對象表格 */
function renderSharePermTable() {
    const tbody = document.getElementById('sharePermBody');
    if (!tbody) return;
    if (!_sharePermList.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:18px;">請從上方組織架構勾選共用對象</td></tr>';
        return;
    }
    tbody.innerHTML = _sharePermList.map((e, i) => {
        const typeClass = e.type === '人員' ? 'person' : (e.type === '組別' ? 'team' : 'dept');
        return `<tr>
        <td><b>${e.name}</b></td>
        <td><span class="pm-pill ${typeClass}">${e.type}</span></td>
        <td><input type="radio" name="share-tbl-perm-${i}" value="edit" ${e.edit ? 'checked' : ''} onchange="_sharePermList[${i}].edit=true;_sharePermList[${i}].view=false;_sharePermList[${i}].denied=false;renderShareOrgTree();" style="accent-color:#2563EB;width:16px;height:16px;cursor:pointer;"></td>
        <td><input type="radio" name="share-tbl-perm-${i}" value="view" ${e.view ? 'checked' : ''} onchange="_sharePermList[${i}].view=true;_sharePermList[${i}].edit=false;_sharePermList[${i}].denied=false;renderShareOrgTree();" style="accent-color:#2563EB;width:16px;height:16px;cursor:pointer;"></td>
        <td><input type="radio" name="share-tbl-perm-${i}" value="denied" ${e.denied ? 'checked' : ''} onchange="_sharePermList[${i}].denied=true;_sharePermList[${i}].edit=false;_sharePermList[${i}].view=false;renderShareOrgTree();" style="accent-color:#DC2626;width:16px;height:16px;cursor:pointer;"></td>
        <td><button class="rm-btn" onclick="removeSharePermItem(${i})"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`;
    }).join('');
}

/** 移除共用對象 */
function removeSharePermItem(idx) {
    _sharePermList.splice(idx, 1);
    renderShareOrgTree();
    renderSharePermTable();
}

/** 勾選/取消勾選共用對象 — 部門或組別 */
/** 判斷節點是否為部分選取（有部分人員被選取，但非全部） */
function _isShareNodeIndeterminate(node) {
    const allIds = _collectAllMemberIds(node);
    if (allIds.length === 0) return false;
    const selectedCount = allIds.filter(pid => _sharePermList.some(s => s.id === pid && s.type === '人員')).length;
    return selectedCount > 0 && selectedCount < allIds.length;
}

/** 過組織樹找到指定 nodeId 的節點 */
function _findOrgNode(node, nodeId) {
    if (node.id === nodeId) return node;
    if (node.children) {
        for (const c of node.children) {
            const found = _findOrgNode(c, nodeId);
            if (found) return found;
        }
    }
    return null;
}

/** 遞迴收集節點下所有人員 ID（含子節點） */
function _collectAllMemberIds(node) {
    const ids = [];
    if (node.headPersonId) ids.push(node.headPersonId);
    if (node.members) ids.push(...node.members);
    if (node.children) node.children.forEach(c => ids.push(..._collectAllMemberIds(c)));
    return ids;
}

function toggleShareOrgNodeCheck(nodeId, label, type) {
    const targetNode = _findOrgNode(_permOrgTree, nodeId);
    // 只取該部門直屬成員（不含子部門）
    const directMemberIds = [];
    if (targetNode) {
        if (targetNode.headPersonId) directMemberIds.push(targetNode.headPersonId);
        if (targetNode.members) directMemberIds.push(...targetNode.members);
    }
    const pplLookup = typeof _getPersonById === 'function' ? _getPersonById : (pid => _permOrgPeople.find(pp => pp.id === pid));
    const deptIdx = _sharePermList.findIndex(s => s.id === nodeId && (s.type === '部門' || s.type === '組別'));

    // 判斷該部門直屬成員是否全部已勾選
    const allSelected = directMemberIds.length > 0
        ? directMemberIds.every(pid => _sharePermList.some(s => s.id === pid && s.type === '人員'))
        : deptIdx >= 0;

    if (allSelected) {
        // 全部已選 → 取消全選（移除部門 + 直屬人員）
        if (deptIdx >= 0) _sharePermList.splice(deptIdx, 1);
        directMemberIds.forEach(pid => {
            const pIdx = _sharePermList.findIndex(s => s.id === pid && s.type === '人員');
            if (pIdx >= 0) _sharePermList.splice(pIdx, 1);
        });
    } else {
        // 未全選（含部分選取 / 未選取）→ 全選直屬成員
        if (deptIdx < 0) {
            _sharePermList.push({ id: nodeId, name: label, type: type === 'team' ? '組別' : '部門', owner: false, edit: false, view: true, denied: false, reason: '' });
        }
        directMemberIds.forEach(pid => {
            if (!_sharePermList.some(s => s.id === pid && s.type === '人員')) {
                const p = pplLookup(pid);
                if (p) _sharePermList.push({ id: pid, name: p.name, type: '人員', owner: false, edit: false, view: true, denied: false, reason: '' });
            }
        });
        // 自動展開該節點
        _shareOrgExpandedNodes[nodeId] = true;
    }
    renderShareOrgTree();
    renderSharePermTable();
}

/** 勾選/取消勾選共用對象 — 人員 */
function toggleShareOrgPersonCheck(pid) {
    const idx = _sharePermList.findIndex(s => s.id === pid && s.type === '人員');
    if (idx >= 0) {
        _sharePermList.splice(idx, 1);
    } else {
        const p = typeof _getPersonById === 'function' ? _getPersonById(pid) : _permOrgPeople.find(pp => pp.id === pid);
        if (p) {
            _sharePermList.push({ id: pid, name: p.name, type: '人員', owner: false, edit: false, view: true, denied: false, reason: '' });
        }
    }
    renderShareOrgTree();
    renderSharePermTable();
}

/** 切換節點展開/收合 */
function toggleShareOrgNode(nodeId) {
    _shareOrgExpandedNodes[nodeId] = !_shareOrgExpandedNodes[nodeId];
    renderShareOrgTree();
}

/** 扁平化組織樹，收集所有節點與麵包屑路徑（共用 Modal 用） */
function _flattenShareOrgNodes(node, parentPath) {
    const result = [];
    const currentPath = parentPath ? parentPath + ' > ' + node.label : node.label;
    result.push({ node: node, breadcrumb: parentPath || '' });
    if (node.children) {
        node.children.forEach(child => {
            result.push(..._flattenShareOrgNodes(child, currentPath));
        });
    }
    return result;
}

/** 渲染共用組織樹（扁平化） */
function renderShareOrgTree() {
    const container = document.getElementById('shareOrgTree');
    if (!container) return;
    const keyword = (document.getElementById('shareOrgSearchInput') || {}).value || '';
    const kw = keyword.trim().toLowerCase();
    const flatList = _flattenShareOrgNodes(_permOrgTree, '');
    let html = '';
    flatList.forEach(({ node, breadcrumb }) => {
        const nodeHtml = _buildShareFlatNodeHtml(node, breadcrumb, kw);
        if (nodeHtml) html += nodeHtml;
    });
    container.innerHTML = html;
    // 設定 indeterminate 狀態
    container.querySelectorAll('input.pot-checkbox[data-indeterminate]').forEach(cb => {
        cb.indeterminate = true;
    });
}

/** 建置單一扁平化節點 HTML（共用 Modal 用） */
function _buildShareFlatNodeHtml(node, breadcrumb, keyword) {
    const memberIds = [];
    if (node.headPersonId) memberIds.push(node.headPersonId);
    if (node.members) memberIds.push(...node.members);
    const isExpanded = !!_shareOrgExpandedNodes[node.id];

    // 選取狀態（僅看直屬成員）
    const _selectedCount = memberIds.filter(pid => _sharePermList.some(s => s.id === pid && s.type === '人員')).length;
    const isChecked = memberIds.length > 0
        ? _selectedCount === memberIds.length
        : _sharePermList.some(s => s.id === node.id && (s.type === '部門' || s.type === '組別'));
    const isIndeterminate = memberIds.length > 0 && _selectedCount > 0 && _selectedCount < memberIds.length;

    // 搜尋過濾：節點名稱、麵包屑路徑、人員名稱
    const pplLookup = typeof _getPersonById === 'function' ? _getPersonById : (pid => _permOrgPeople.find(pp => pp.id === pid));
    let matchSelf = !keyword || node.label.toLowerCase().includes(keyword);
    let matchBreadcrumb = !keyword || (breadcrumb && breadcrumb.toLowerCase().includes(keyword));
    let matchMembers = memberIds.filter(pid => {
        const p = pplLookup(pid);
        return p && (p.name.toLowerCase().includes(keyword) || p.title.toLowerCase().includes(keyword));
    });
    if (keyword && !matchSelf && !matchBreadcrumb && matchMembers.length === 0) return '';

    // 人員列
    let membersHtml = '';
    const showMembers = isExpanded;
    if (showMembers && memberIds.length > 0) {
        const filteredMembers = (keyword && !matchSelf && !matchBreadcrumb) ? matchMembers : memberIds;
        membersHtml = filteredMembers.map(pid => {
            const p = pplLookup(pid);
            if (!p) return '';
            const isPC = _sharePermList.some(s => s.id === pid && s.type === '人員');
            const permEntry = _sharePermList.find(s => s.id === pid && s.type === '人員');
            const isOwner = permEntry ? permEntry.owner : false;
            const isEdit = permEntry ? permEntry.edit : false;
            const isView = permEntry ? permEntry.view : true;
            // 決定目前權限等級與顯示文字
            let curLevel = 'none';
            let curLabel = '—';
            if (isPC) {
                if (isOwner) { curLevel = 'owner'; curLabel = '管理者'; }
                else if (isEdit) { curLevel = 'edit'; curLabel = '編輯者'; }
                else if (permEntry && permEntry.denied) { curLevel = 'denied'; curLabel = '拒絕存取'; }
                else { curLevel = 'view'; curLabel = '檢視者'; }
            }
            const dropdownHtml = isPC ? `
                <div class="pot-perm-dropdown" onclick="event.stopPropagation();">
                    <select class="pot-perm-select" data-level="${curLevel}" onchange="onSharePermSelectChange('${pid}', this)">
                        <option value="owner" ${curLevel === 'owner' ? 'selected' : ''}>管理者</option>
                        <option value="edit" ${curLevel === 'edit' ? 'selected' : ''}>編輯者</option>
                        <option value="view" ${curLevel === 'view' ? 'selected' : ''}>檢視者</option>
                        <option value="denied" ${curLevel === 'denied' ? 'selected' : ''}>拒絕存取</option>
                    </select>
                </div>` : '';
            return `<div class="pot-member-row ${isPC ? 'selected' : ''}" onclick="toggleShareOrgPersonCheck('${pid}')">
                <input type="checkbox" class="pot-checkbox" ${isPC ? 'checked' : ''} onclick="event.stopPropagation(); toggleShareOrgPersonCheck('${pid}')">
                <div class="pot-member-info">
                    <span class="pot-member-name">${p.name}</span>
                    <span class="pot-member-title">${p.title} · ${p.empNo || ''}</span>
                </div>
                ${dropdownHtml}
            </div>`;
        }).join('');
    }

    const hasMembers = memberIds.length > 0;
    const toggleClass = hasMembers
        ? (showMembers ? 'expanded' : '')
        : 'no-children';

    return `<div class="pot-node">
        <div class="pot-row ${isChecked || isIndeterminate ? 'selected' : ''}">
            <span class="pot-toggle ${toggleClass}" onclick="event.stopPropagation(); toggleShareOrgNode('${node.id}')">
                <i class="fa-solid fa-caret-right"></i>
            </span>
            <input type="checkbox" class="pot-checkbox" ${isChecked ? 'checked' : ''} ${isIndeterminate ? 'data-indeterminate' : ''} onclick="event.stopPropagation(); toggleShareOrgNodeCheck('${node.id}', '${node.label.replace(/'/g,"\\'")}', '${node.type}')">
            <div class="pot-node-info" onclick="toggleShareOrgNode('${node.id}')">
                <span class="pot-label">${node.label}</span>
                ${breadcrumb ? `<span class="pot-breadcrumb">${breadcrumb}</span>` : ''}
            </div>
        </div>
        <div class="pot-children ${showMembers ? '' : 'collapsed'}">
            ${membersHtml}
        </div>
    </div>`;
}

/** 設定共用對象人員的權限等級（管理者/編輯者/檢視者/拒絕存取） */
function setSharePersonPerm(pid, level) {
    let entry = _sharePermList.find(s => s.id === pid && s.type === '人員');
    if (!entry) {
        // 尚未勾選 → 自動加入並設定權限
        const p = typeof _getPersonById === 'function' ? _getPersonById(pid) : _permOrgPeople.find(pp => pp.id === pid);
        if (!p) return;
        entry = { id: pid, name: p.name, type: '人員', owner: false, edit: false, view: true, denied: false, reason: '' };
        _sharePermList.push(entry);
    }
    entry.owner  = (level === 'owner');
    entry.edit   = (level === 'edit');
    entry.view   = (level === 'view');
    entry.denied = (level === 'denied');
    renderShareOrgTree();
    renderSharePermTable();
}

/** 原生 select 選擇共用權限等級 */
function onSharePermSelectChange(pid, selectEl) {
    event.stopPropagation();
    const level = selectEl.value;
    selectEl.setAttribute('data-level', level);
    setSharePersonPerm(pid, level);
}

/** 搜尋過濾共用組織樹 */
function filterShareOrgTree() {
    const keyword = (document.getElementById('shareOrgSearchInput') || {}).value || '';
    if (keyword.trim()) {
        _expandAllShareNodes(_permOrgTree);
    }
    renderShareOrgTree();
}
function _expandAllShareNodes(node) {
    _shareOrgExpandedNodes[node.id] = true;
    if (node.children) node.children.forEach(c => _expandAllShareNodes(c));
}

/** 開啟新增共用對象 Picker（已棄用，改為直接用樹狀選擇） */
function openShareAddPicker() {
    // 保留向下相容，但不再使用
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
    
    if (_sharePermList.length === 0) {
        showToast('請新增至少一個共用對象');
        return;
    }
    
    const isFolder = currentShareFile._isFolder;
    const shareKey = isFolder ? currentShareFile._fullPath : currentShareFile.name;
    
    // 轉換為相容格式
    const targets = _sharePermList.map(e => e.name);
    const permissions = ['瀏覽'];
    if (_sharePermList.some(e => e.view)) permissions.push('下載');
    if (_sharePermList.some(e => e.edit)) permissions.push('編輯');
    
    // 檢查是否已有分享
    let sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const existingIndex = sharedByMe.findIndex(s => s.name === shareKey);
    
    if (existingIndex !== -1) {
        sharedByMe[existingIndex].to = targets;
        sharedByMe[existingIndex].perms = permissions;
        sharedByMe[existingIndex].shareEntries = JSON.parse(JSON.stringify(_sharePermList));
        showToast('共用設定已更新');
    } else {
        const newShare = {
            id: 'sb' + Date.now(),
            name: shareKey,
            type: isFolder ? 'folder' : 'file',
            fileKind: isFolder ? 'folder' : currentShareFile.name.split('.').pop().toLowerCase(),
            folder: currentShareFile.folder,
            tags: currentShareFile.tags || [],
            to: targets,
            perms: permissions,
            shareEntries: JSON.parse(JSON.stringify(_sharePermList)),
            status: '生效中',
            sharedAt: new Date().toISOString().split('T')[0]
        };
        sharedByMe.push(newShare);
        showToast('已成功共用「' + shareKey + '」');
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
 * 切換共用開關
 */
function toggleShareEnabled() {
    const toggle = document.getElementById('shareToggleInput');
    if (!toggle) return;
    const enabled = toggle.checked;
    updateShareToggleUI(enabled);

    if (!enabled && currentShareFile) {
        // 關閉共用 → 移除共用資料
        const shareKey = currentShareFile._isFolder ? currentShareFile._fullPath : currentShareFile.name;
        let sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
        const existed = sharedByMe.some(s => s.name === shareKey);
        if (existed) {
            sharedByMe = sharedByMe.filter(s => s.name !== shareKey);
            localStorage.setItem('sharedByMe', JSON.stringify(sharedByMe));
            window.__kmData.sharedByMe = sharedByMe;
            showToast('已關閉共用');
        }
    }
}

/** 更新共用開關 UI */
function updateShareToggleUI(enabled) {
    const statusEl = document.getElementById('shareToggleStatus');
    const linkArea = document.getElementById('shareLinkArea');
    if (statusEl) {
        statusEl.textContent = enabled ? '已開啟' : '已關閉';
        statusEl.className = 'stl-status ' + (enabled ? 'on' : 'off');
    }
    // 只控制連結區域顯隱，開關本身始終可見
    if (linkArea) {
        linkArea.style.display = enabled ? '' : 'none';
    }
}

// 點擊 Modal 外部關閉
document.addEventListener('click', function(e) {
    const modal = document.getElementById('shareModal');
    if (modal && e.target === modal) {
        closeShareModal();
    }
});
