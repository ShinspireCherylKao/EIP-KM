/**
 * km-data.js
 * 前後台共用的文件庫管理資料
 * 此檔案作為資料中心，前台和後台都會引用此資料
 */

// 共用資料命名空間
window.__sharedKmData = window.__sharedKmData || {};

// ==================== 部門與權限設定 ====================
window.__sharedKmData.departments = ['HR', '管理部', '行政部'];

window.__sharedKmData.permissionLevels = {
    view: '僅瀏覽',
    download: '瀏覽+下載',
    control: '完全控制',
    none: '不可見 (無權限)'
};

// 資料夾權限設定
window.__sharedKmData.folderPermissions = {
    '公司規章': {
        HR: 'download',
        '管理部': 'control',
        '行政部': 'view'
    },
    '人資表單': {
        HR: 'control',
        '管理部': 'view',
        '行政部': 'none'
    },
    '採購合約': {
        HR: 'none',
        '管理部': 'download',
        '行政部': 'download'
    },
    '機密專案': {
        HR: 'none',
        '管理部': 'control',
        '行政部': 'none'
    }
};

// ==================== 檔案標籤系統 ====================
window.__sharedKmData.tags = [
    { id: 1, name: '機密文件', color: 'red', department: 'HR', fileCount: 23 },
    { id: 2, name: '待審核', color: 'orange', department: '通用', fileCount: 15 },
    { id: 3, name: '已核准', color: 'green', department: '通用', fileCount: 89 },
    { id: 4, name: '合約文件', color: 'blue', department: '管理部', fileCount: 34 },
    { id: 5, name: '培訓資料', color: 'purple', department: 'HR', fileCount: 67 },
    { id: 6, name: '財務報表', color: 'yellow', department: '管理部', fileCount: 45 },
    { id: 7, name: '過期文件', color: 'pink', department: '通用', fileCount: 12 },
    { id: 8, name: '內部公告', color: 'teal', department: '行政部', fileCount: 56 }
];

// ==================== 檔案操作記錄 ====================
window.__sharedKmData.fileRecords = [
    {
        id: 1,
        timestamp: '2026-01-15 14:23:15',
        operator: '王小明',
        department: 'HR',
        action: 'download',
        fileName: '2025年度薪資表.xlsx',
        filePath: '/HR/財務資料/',
        ip: '192.168.1.105',
        isWarning: false
    },
    {
        id: 2,
        timestamp: '2026-01-15 13:45:22',
        operator: '李美玲',
        department: '管理部',
        action: 'view',
        fileName: '公司規章2026版.pdf',
        filePath: '/公司規章/',
        ip: '192.168.1.112',
        isWarning: false
    },
    {
        id: 3,
        timestamp: '2026-01-15 12:18:47',
        operator: '張志強',
        department: '行政部',
        action: 'download',
        fileName: '員工個資檔案_HR專用.xlsx',
        filePath: '/HR/機密/',
        ip: '192.168.1.89',
        isWarning: true, // 跨部門存取警示
        warningReason: '跨部門下載敏感檔案'
    },
    {
        id: 4,
        timestamp: '2026-01-15 11:30:09',
        operator: '陳雅婷',
        department: 'HR',
        action: 'permission',
        fileName: '人資表單 (資料夾)',
        filePath: '/HR/',
        ip: '192.168.1.105',
        isWarning: false
    },
    {
        id: 5,
        timestamp: '2026-01-15 10:15:33',
        operator: '林佳慧',
        department: '管理部',
        action: 'download',
        fileName: '採購合約範本.docx',
        filePath: '/採購合約/',
        ip: '192.168.1.123',
        isWarning: false
    },
    {
        id: 6,
        timestamp: '2026-01-15 09:42:18',
        operator: '黃建國',
        department: '行政部',
        action: 'delete',
        fileName: '過期文件_2024.pdf',
        filePath: '/行政部/歸檔/',
        ip: '192.168.1.98',
        isWarning: false
    },
    {
        id: 7,
        timestamp: '2026-01-14 16:55:41',
        operator: '吳文華',
        department: '管理部',
        action: 'view',
        fileName: '季度報告Q4.pptx',
        filePath: '/管理部/報告/',
        ip: '192.168.1.145',
        isWarning: false
    },
    {
        id: 8,
        timestamp: '2026-01-14 15:20:12',
        operator: '劉玉珍',
        department: 'HR',
        action: 'download',
        fileName: '出勤記錄表.xlsx',
        filePath: '/HR/考勤/',
        ip: '192.168.1.107',
        isWarning: false
    }
];

// ==================== 大型檔案列表 (用於篩選搜尋) ====================
window.__sharedKmData.largeFiles = [
    {
        id: 1,
        name: '2025年度總結會議錄影.mp4',
        size: '1.2 GB',
        sizeBytes: 1288490188,
        owner: '李美玲',
        department: '管理部',
        lastModified: '2026-01-10',
        path: '/管理部/會議記錄/2025/',
        type: 'video',
        tags: ['會議記錄', '年度總結']
    },
    {
        id: 2,
        name: '新進人員培訓影片_完整版.mp4',
        size: '856 MB',
        sizeBytes: 897581056,
        owner: '王小明',
        department: 'HR',
        lastModified: '2026-01-08',
        path: '/HR/培訓資料/2026/',
        type: 'video',
        tags: ['培訓資料', '新人訓練']
    },
    {
        id: 3,
        name: 'Q4營運報告簡報錄影.mov',
        size: '1.8 GB',
        sizeBytes: 1932735283,
        owner: '林佳慧',
        department: '管理部',
        lastModified: '2025-12-28',
        path: '/管理部/季度報告/2025Q4/',
        type: 'video',
        tags: ['財務報表', '季度報告']
    },
    {
        id: 4,
        name: '產品發表會全程紀錄.avi',
        size: '2.3 GB',
        sizeBytes: 2469606195,
        owner: '吳文華',
        department: '管理部',
        lastModified: '2025-11-15',
        path: '/管理部/活動記錄/發表會/',
        type: 'video',
        tags: ['活動記錄', '產品發表']
    },
    {
        id: 5,
        name: '員工教育訓練_職業安全.mp4',
        size: '654 MB',
        sizeBytes: 685768090,
        owner: '陳雅婷',
        department: 'HR',
        lastModified: '2025-10-20',
        path: '/HR/培訓資料/安全教育/',
        type: 'video',
        tags: ['培訓資料', '安全教育']
    },
    {
        id: 6,
        name: '董事會議錄影_機密.mp4',
        size: '1.5 GB',
        sizeBytes: 1610612736,
        owner: '李美玲',
        department: '管理部',
        lastModified: '2025-09-30',
        path: '/管理部/機密專案/董事會/',
        type: 'video',
        tags: ['機密文件', '董事會']
    },
    {
        id: 7,
        name: '年終尾牙活動全記錄.mov',
        size: '920 MB',
        sizeBytes: 964689920,
        owner: '劉玉珍',
        department: 'HR',
        lastModified: '2024-12-31',
        path: '/HR/公司活動/尾牙/',
        type: 'video',
        tags: ['活動記錄', '公司活動']
    }
];

// ==================== 工具函數 ====================
window.__sharedKmData.utils = {
    // 檢查用戶是否有權限存取特定資料夾
    checkPermission: function(folderName, department, requiredLevel) {
        const permission = window.__sharedKmData.folderPermissions[folderName];
        if (!permission) return false;
        
        const userLevel = permission[department];
        const levels = ['none', 'view', 'download', 'control'];
        const userLevelIndex = levels.indexOf(userLevel);
        const requiredLevelIndex = levels.indexOf(requiredLevel);
        
        return userLevelIndex >= requiredLevelIndex;
    },
    
    // 新增操作記錄
    addRecord: function(record) {
        window.__sharedKmData.fileRecords.unshift({
            id: window.__sharedKmData.fileRecords.length + 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            ...record
        });
        
        // 觸發更新事件
        window.dispatchEvent(new CustomEvent('kmDataUpdated', { 
            detail: { type: 'record', action: 'add', data: record } 
        }));
    },
    
    // 更新資料夾權限
    updateFolderPermission: function(folderName, department, permission) {
        if (!window.__sharedKmData.folderPermissions[folderName]) {
            window.__sharedKmData.folderPermissions[folderName] = {};
        }
        window.__sharedKmData.folderPermissions[folderName][department] = permission;
        
        // 觸發更新事件
        window.dispatchEvent(new CustomEvent('kmDataUpdated', { 
            detail: { type: 'permission', action: 'update', data: { folderName, department, permission } } 
        }));
    },
    
    // 新增標籤
    addTag: function(tag) {
        const newTag = {
            id: window.__sharedKmData.tags.length + 1,
            fileCount: 0,
            ...tag
        };
        window.__sharedKmData.tags.push(newTag);
        
        // 觸發更新事件
        window.dispatchEvent(new CustomEvent('kmDataUpdated', { 
            detail: { type: 'tag', action: 'add', data: newTag } 
        }));
        
        return newTag;
    },
    
    // 刪除標籤
    deleteTag: function(tagId) {
        const index = window.__sharedKmData.tags.findIndex(t => t.id === tagId);
        if (index > -1) {
            const deletedTag = window.__sharedKmData.tags.splice(index, 1)[0];
            
            // 觸發更新事件
            window.dispatchEvent(new CustomEvent('kmDataUpdated', { 
                detail: { type: 'tag', action: 'delete', data: deletedTag } 
            }));
        }
    },
    
    // 合併標籤
    mergeTags: function(tagIds, newTagName, newColor) {
        const tagsToMerge = window.__sharedKmData.tags.filter(t => tagIds.includes(t.id));
        const totalFileCount = tagsToMerge.reduce((sum, tag) => sum + tag.fileCount, 0);
        
        // 刪除舊標籤
        tagIds.forEach(id => this.deleteTag(id));
        
        // 新增合併後的標籤
        return this.addTag({
            name: newTagName,
            color: newColor,
            department: '通用',
            fileCount: totalFileCount
        });
    },
    
    // 取得特定部門的檔案記錄
    getRecordsByDepartment: function(department) {
        if (department === '全部') {
            return window.__sharedKmData.fileRecords;
        }
        return window.__sharedKmData.fileRecords.filter(r => r.department === department);
    },
    
    // 取得警示記錄
    getWarningRecords: function() {
        return window.__sharedKmData.fileRecords.filter(r => r.isWarning);
    },
    
    // 篩選大型檔案
    filterLargeFiles: function(options = {}) {
        let files = [...window.__sharedKmData.largeFiles];
        
        // 按大小篩選
        if (options.minSize) {
            files = files.filter(f => f.sizeBytes >= options.minSize);
        }
        
        // 按部門篩選
        if (options.departments && options.departments.length > 0) {
            files = files.filter(f => options.departments.includes(f.department));
        }
        
        // 按類型篩選
        if (options.types && options.types.length > 0) {
            files = files.filter(f => options.types.includes(f.type));
        }
        
        return files;
    },
    
    // 格式化檔案大小
    formatFileSize: function(bytes) {
        if (bytes >= 1073741824) {
            return (bytes / 1073741824).toFixed(1) + ' GB';
        } else if (bytes >= 1048576) {
            return (bytes / 1048576).toFixed(0) + ' MB';
        } else if (bytes >= 1024) {
            return (bytes / 1024).toFixed(0) + ' KB';
        }
        return bytes + ' B';
    }
};

// ==================== 以下是原有的檔案內容資料 ====================

// 檔案內容假資料（用於 AI 問答詳細比較）
window.__sharedKmData.fileContents = {
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
    // A 專案需求規格書
    'pa3': {
        title: 'A專案需求規格書',
        summary: '系統整合服務需求規格說明',
        sections: {
            '專案目標': '整合現有 3 套系統，建立統一資料平台',
            '功能範圍': 'SSO 登入、資料同步、報表整合',
            '技術規格': 'RESTful API、OAuth 2.0、PostgreSQL',
            '效能需求': '回應時間 < 2 秒、併發用戶 500+',
            '安全需求': 'HTTPS、資料加密、稽核日誌',
            '驗收標準': '功能測試通過率 95%、壓力測試通過'
        }
    },
    // A 專案服務合約
    'pa1': {
        title: 'A專案服務合約',
        summary: '系統整合服務合約內容',
        sections: {
            '合約類型': '服務合約',
            '合約期間': '2025/01/01 - 2025/12/31',
            '合約金額': 'NT$ 2,500,000',
            '付款方式': '月結 30 天',
            '服務範圍': '系統整合、技術支援、教育訓練',
            '違約條款': '合約金額 10%',
            '保密期限': '3 年'
        }
    },
    // B 專案外包合約
    'pb1': {
        title: 'B專案外包合約',
        summary: '軟體開發外包合約內容',
        sections: {
            '合約類型': '外包合約',
            '合約期間': '2025/03/01 - 2025/09/30',
            '合約金額': 'NT$ 1,800,000',
            '付款方式': '里程碑付款（4 期）',
            '服務範圍': '客製化系統開發、測試、部署',
            '違約條款': '合約金額 15%',
            '保密期限': '5 年'
        }
    },
    // C 專案合作備忘錄
    'pc1': {
        title: 'C專案合作備忘錄',
        summary: '策略合作備忘錄內容',
        sections: {
            '合約類型': 'MOU 合作備忘錄',
            '合約期間': '2025/01/01 - 2026/12/31',
            '合約金額': '依實際服務計價',
            '付款方式': '年繳（每年 1 月）',
            '服務範圍': '技術諮詢、資源共享、聯合開發',
            '違約條款': '合約金額 5%',
            '保密期限': '2 年'
        }
    },
    // D 專案維護合約
    'pd1': {
        title: 'D專案維護合約',
        summary: '系統維護服務合約內容',
        sections: {
            '合約類型': '維護合約',
            '合約期間': '2025/06/01 - 2026/05/31',
            '合約金額': 'NT$ 480,000/年',
            '付款方式': '季繳',
            '服務範圍': '系統監控、問題排除、版本更新',
            '違約條款': '合約金額 8%',
            '保密期限': '3 年'
        }
    },
    // E 專案顧問合約
    'pe1': {
        title: 'E專案顧問合約',
        summary: '顧問諮詢服務合約內容',
        sections: {
            '合約類型': '顧問合約',
            '合約期間': '2025/02/01 - 2025/12/31',
            '合約金額': 'NT$ 1,200,000',
            '付款方式': '專案結案後 30 天',
            '服務範圍': '流程診斷、策略規劃、導入輔導',
            '違約條款': '合約金額 10%',
            '保密期限': '3 年'
        }
    },
    // A 專案報價單
    'pa4': {
        title: 'A專案報價單',
        summary: '系統整合服務報價明細',
        sections: {
            '總金額': 'NT$ 2,500,000',
            '人力成本': '60%（NT$ 1,500,000）',
            '設備費用': '25%（NT$ 625,000）',
            '管理費': '15%（NT$ 375,000）',
            '報價有效期': '30 天',
            '付款狀態': '報價中'
        }
    },
    // B 專案費用明細
    'pb3': {
        title: 'B專案費用明細',
        summary: '外包專案費用結算明細',
        sections: {
            '總金額': 'NT$ 1,650,000',
            '人力成本': '70%（NT$ 1,155,000）',
            '設備費用': '15%（NT$ 247,500）',
            '管理費': '15%（NT$ 247,500）',
            '已付款項': '4 期全數付清',
            '付款狀態': '已結案'
        }
    },
    // C 專案請款單
    'pc4': {
        title: 'C專案請款單',
        summary: '合作專案請款申請',
        sections: {
            '總金額': 'NT$ 800,000',
            '人力成本': '40%（NT$ 320,000）',
            '設備費用': '35%（NT$ 280,000）',
            '管理費': '25%（NT$ 200,000）',
            '本期請款': 'NT$ 400,000',
            '付款狀態': '執行中'
        }
    },
    // D 專案年度預算
    'pd2': {
        title: 'D專案年度預算',
        summary: '系統維護年度預算規劃',
        sections: {
            '總金額': 'NT$ 600,000',
            '人力成本': '55%（NT$ 330,000）',
            '設備費用': '30%（NT$ 180,000）',
            '管理費': '15%（NT$ 90,000）',
            '預算年度': '2025 年',
            '付款狀態': '待核准'
        }
    },
    // E 專案付款時程
    'pe4': {
        title: 'E專案付款時程',
        summary: '顧問專案付款時程規劃',
        sections: {
            '總金額': 'NT$ 1,200,000',
            '人力成本': '75%（NT$ 900,000）',
            '設備費用': '10%（NT$ 120,000）',
            '管理費': '15%（NT$ 180,000）',
            '付款期數': '3 期（結案後付清）',
            '付款狀態': '待付款'
        }
    }
};

// 當前使用者資訊
window.__sharedKmData.currentUser = {
    id: 'u001',
    name: '王小明',
    dept: 'HR',
    role: 'admin'
};

// 部門資料
window.__sharedKmData.departments = [
    { id: 'HR', name: 'HR', desc: '人力資源', accessible: true },
    { id: 'Supply', name: 'Supply', desc: '供應鏈', accessible: true },
    { id: 'Finance', name: 'Finance', desc: '財務', accessible: false },
    { id: 'Projects', name: '專案', desc: '專案管理', accessible: true },
    { id: 'ProjectA', name: 'A專案', desc: 'A專案 - 系統整合服務', accessible: true },
    { id: 'ProjectB', name: 'B專案', desc: 'B專案 - 軟體開發外包', accessible: true },
    { id: 'ProjectC', name: 'C專案', desc: 'C專案 - 策略合作', accessible: true },
    { id: 'ProjectD', name: 'D專案', desc: 'D專案 - 系統維護', accessible: true },
    { id: 'ProjectE', name: 'E專案', desc: 'E專案 - 顧問諮詢', accessible: true },
];

// 所有標籤
window.__sharedKmData.allTags = [
    { id: 't1', name: '合約', color: '#3B82F6', count: 25 },
    { id: 't2', name: '提案', color: '#10B981', count: 18 },
    { id: 't3', name: '帳務', color: '#F59E0B', count: 15 },
    { id: 't4', name: '差旅', color: '#8B5CF6', count: 12 },
    { id: 't5', name: '表單', color: '#EC4899', count: 10 },
    { id: 't6', name: '報銷', color: '#EF4444', count: 8 },
    { id: 't7', name: '需求', color: '#06B6D4', count: 7 },
    { id: 't8', name: '規格', color: '#84CC16', count: 5 },
    { id: 't9', name: 'A專案', color: '#6366F1', count: 4 },
    { id: 't10', name: 'B專案', color: '#F97316', count: 3 },
    { id: 't11', name: 'C專案', color: '#14B8A6', count: 5 },
    { id: 't12', name: 'D專案', color: '#A855F7', count: 3 },
    { id: 't13', name: 'E專案', color: '#F43F5E', count: 5 },
    { id: 't14', name: '請假', color: '#22C55E', count: 4 },
    { id: 't15', name: '制度', color: '#64748B', count: 3 },
    { id: 't16', name: 'MOU', color: '#0EA5E9', count: 2 },
    { id: 't17', name: '外包', color: '#D946EF', count: 3 },
    { id: 't18', name: '維護', color: '#78716C', count: 2 },
    { id: 't19', name: '顧問', color: '#FB923C', count: 2 },
    { id: 't20', name: '結案', color: '#4ADE80', count: 2 },
];

// 所有檔案項目
window.__sharedKmData.indexItems = [
    { id: 'i1', name: '差旅報銷規範.pdf', displayTitle: '差旅報銷（新版）', type: 'file', path: 'HR/FAQ', deptId: 'HR', tags: ['差旅', '報銷'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['HR', 'Finance'], updatedAt: '2025-11-01', createdAt: '2025-09-15', downloads: 120, views: 450, fileKind: 'pdf', fileSize: '2.3 MB', owner: 'u001' },
    { id: 'i2', name: '請假制度.docx', type: 'file', path: 'HR/FAQ', deptId: 'HR', tags: ['請假', '制度'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-10-25', createdAt: '2025-08-10', downloads: 32, views: 156, fileKind: 'docx', fileSize: '856 KB', owner: 'u001' },
    { id: 'i3', name: '海外差旅', displayTitle: '海外差旅（資料夾）', type: 'folder', path: 'HR/FAQ', deptId: 'HR', tags: ['差旅'], actionsAllowed: ['view'], visibilityMode: 'blacklist', visibilityList: ['外包'], updatedAt: '2025-11-04', createdAt: '2025-07-20', downloads: 0, views: 89, fileKind: 'folder', fileSize: '-', owner: 'u001' },
    { id: 'i4', name: '供應商名單.xlsx', type: 'file', path: 'Supply/Vendor', deptId: 'Supply', tags: ['供應商', '採購'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Supply', 'Finance'], updatedAt: '2025-11-03', createdAt: '2025-06-01', downloads: 75, views: 234, fileKind: 'xlsx', fileSize: '1.2 MB', owner: 'u002' },
    { id: 'i5', name: '採購合約', type: 'folder', path: 'Supply/Contract', deptId: 'Supply', tags: ['合約', '保密'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Supply'], updatedAt: '2025-10-29', createdAt: '2025-05-15', downloads: 12, views: 67, fileKind: 'folder', fileSize: '-', owner: 'u002' },
    
    // 專案資料夾
    { id: 'pf1', name: 'A專案', type: 'folder', path: '專案', deptId: 'Projects', tags: ['A專案', '系統整合'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2026-01-15', createdAt: '2025-01-01', downloads: 0, views: 320, fileKind: 'folder', fileSize: '-', owner: 'u003' },
    { id: 'pf2', name: 'B專案', type: 'folder', path: '專案', deptId: 'Projects', tags: ['B專案', '外包開發'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2026-01-14', createdAt: '2025-03-01', downloads: 0, views: 256, fileKind: 'folder', fileSize: '-', owner: 'u004' },
    { id: 'pf3', name: 'C專案', type: 'folder', path: '專案', deptId: 'Projects', tags: ['C專案', '策略合作'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2026-01-16', createdAt: '2025-04-10', downloads: 0, views: 198, fileKind: 'folder', fileSize: '-', owner: 'u005' },
    { id: 'pf4', name: 'D專案', type: 'folder', path: '專案', deptId: 'Projects', tags: ['D專案', '系統維護'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2026-01-13', createdAt: '2025-06-01', downloads: 0, views: 145, fileKind: 'folder', fileSize: '-', owner: 'u006' },
    { id: 'pf5', name: 'E專案', type: 'folder', path: '專案', deptId: 'Projects', tags: ['E專案', '顧問諮詢'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2026-01-15', createdAt: '2025-02-01', downloads: 0, views: 213, fileKind: 'folder', fileSize: '-', owner: 'u007' },
    
    // ========== A 專案文件 ==========
    { id: 'pa1', name: 'A專案服務合約.pdf', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['合約', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-12-01', createdAt: '2025-01-10', downloads: 45, views: 189, fileKind: 'pdf', fileSize: '3.1 MB', owner: 'u003' },
    { id: 'pa2', name: 'A專案提案簡報.pptx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['提案', '簡報', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-11-15', createdAt: '2025-01-05', downloads: 89, views: 312, fileKind: 'pptx', fileSize: '5.8 MB', owner: 'u003' },
    { id: 'pa3', name: 'A專案需求規格書.docx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['需求', '規格', 'A專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-11-20', createdAt: '2025-02-01', downloads: 56, views: 201, fileKind: 'docx', fileSize: '1.5 MB', owner: 'u003' },
    { id: 'pa4', name: 'A專案報價單.xlsx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['帳務', '報價', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-11-10', createdAt: '2025-01-15', downloads: 23, views: 98, fileKind: 'xlsx', fileSize: '456 KB', owner: 'u003' },
    { id: 'pa5', name: 'A專案技術架構圖.pdf', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['技術', '架構', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2026-01-05', createdAt: '2025-02-10', downloads: 34, views: 156, fileKind: 'pdf', fileSize: '2.7 MB', owner: 'u003' },
    { id: 'pa6', name: 'A專案進度報告_Q1.docx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['進度', '報告', 'A專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-03-31', createdAt: '2025-03-28', downloads: 41, views: 178, fileKind: 'docx', fileSize: '1.8 MB', owner: 'u003' },
    { id: 'pa7', name: 'A專案進度報告_Q2.docx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['進度', '報告', 'A專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-06-30', createdAt: '2025-06-28', downloads: 38, views: 165, fileKind: 'docx', fileSize: '2.1 MB', owner: 'u003' },
    { id: 'pa8', name: 'A專案測試計畫.xlsx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['測試', '計畫', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-08-15', createdAt: '2025-08-10', downloads: 29, views: 134, fileKind: 'xlsx', fileSize: '987 KB', owner: 'u003' },
    { id: 'pa9', name: 'A專案使用者手冊.pdf', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['手冊', '教學', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-11-25', createdAt: '2025-11-20', downloads: 67, views: 289, fileKind: 'pdf', fileSize: '4.5 MB', owner: 'u003' },
    { id: 'pa10', name: 'A專案驗收單.pdf', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['驗收', '結案', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-12-20', createdAt: '2025-12-18', downloads: 52, views: 198, fileKind: 'pdf', fileSize: '1.3 MB', owner: 'u003' },
    
    // ========== B 專案文件 ==========
    { id: 'pb1', name: 'B專案外包合約.pdf', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['合約', '外包', 'B專案'], actionsAllowed: ['view'], visibilityMode: 'blacklist', visibilityList: ['外包'], updatedAt: '2025-12-05', createdAt: '2025-03-01', downloads: 34, views: 145, fileKind: 'pdf', fileSize: '2.8 MB', owner: 'u004' },
    { id: 'pb2', name: 'B專案結案報告.pptx', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['結案', '報告', 'B專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-12-10', createdAt: '2025-09-15', downloads: 67, views: 234, fileKind: 'pptx', fileSize: '4.2 MB', owner: 'u004' },
    { id: 'pb3', name: 'B專案費用明細.xlsx', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['帳務', '費用', 'B專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-12-08', createdAt: '2025-09-20', downloads: 41, views: 167, fileKind: 'xlsx', fileSize: '678 KB', owner: 'u004' },
    { id: 'pb4', name: 'B專案開發規範.docx', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['開發', '規範', 'B專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-03-10', createdAt: '2025-03-05', downloads: 28, views: 123, fileKind: 'docx', fileSize: '1.2 MB', owner: 'u004' },
    { id: 'pb5', name: 'B專案原始碼交付清單.xlsx', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['原始碼', '交付', 'B專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-09-25', createdAt: '2025-09-23', downloads: 19, views: 87, fileKind: 'xlsx', fileSize: '543 KB', owner: 'u004' },
    { id: 'pb6', name: 'B專案需求變更記錄.docx', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['需求', '變更', 'B專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-08-20', createdAt: '2025-04-01', downloads: 45, views: 189, fileKind: 'docx', fileSize: '2.3 MB', owner: 'u004' },
    { id: 'pb7', name: 'B專案測試報告.pdf', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['測試', '報告', 'B專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-09-10', createdAt: '2025-09-05', downloads: 33, views: 145, fileKind: 'pdf', fileSize: '3.6 MB', owner: 'u004' },
    { id: 'pb8', name: 'B專案部署文件.pdf', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['部署', '文件', 'B專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-09-28', createdAt: '2025-09-25', downloads: 27, views: 118, fileKind: 'pdf', fileSize: '1.9 MB', owner: 'u004' },
    
    // ========== C 專案文件 ==========
    { id: 'pc1', name: 'C專案合作備忘錄.pdf', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['合約', 'MOU', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-11-28', createdAt: '2025-04-10', downloads: 28, views: 112, fileKind: 'pdf', fileSize: '1.9 MB', owner: 'u005' },
    { id: 'pc2', name: 'C專案技術提案.pptx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['提案', '技術', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-11-25', createdAt: '2025-04-15', downloads: 52, views: 198, fileKind: 'pptx', fileSize: '6.1 MB', owner: 'u005' },
    { id: 'pc3', name: 'C專案表單需求.docx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['需求', '表單', 'C專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-12-02', createdAt: '2025-05-01', downloads: 19, views: 76, fileKind: 'docx', fileSize: '923 KB', owner: 'u005' },
    { id: 'pc4', name: 'C專案請款單.xlsx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['帳務', '請款', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-12-12', createdAt: '2025-06-01', downloads: 15, views: 54, fileKind: 'xlsx', fileSize: '345 KB', owner: 'u005' },
    { id: 'pc5', name: 'C專案會議紀錄.docx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['會議', '紀錄', 'C專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-12-14', createdAt: '2025-06-15', downloads: 8, views: 43, fileKind: 'docx', fileSize: '567 KB', owner: 'u005' },
    { id: 'pc6', name: 'C專案資源規劃.xlsx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['資源', '規劃', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-05-20', createdAt: '2025-05-15', downloads: 36, views: 154, fileKind: 'xlsx', fileSize: '678 KB', owner: 'u005' },
    { id: 'pc7', name: 'C專案風險管理計畫.docx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['風險', '管理', 'C專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-06-10', createdAt: '2025-06-05', downloads: 24, views: 98, fileKind: 'docx', fileSize: '1.4 MB', owner: 'u005' },
    { id: 'pc8', name: 'C專案時程表.xlsx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['時程', '排程', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2026-01-10', createdAt: '2025-04-20', downloads: 61, views: 243, fileKind: 'xlsx', fileSize: '823 KB', owner: 'u005' },
    { id: 'pc9', name: 'C專案交付檢核表.pdf', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['交付', '檢核', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-12-20', createdAt: '2025-12-15', downloads: 43, views: 187, fileKind: 'pdf', fileSize: '1.1 MB', owner: 'u005' },
    
    // ========== D 專案文件 ==========
    { id: 'pd1', name: 'D專案維護合約.pdf', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['合約', '維護', 'D專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-10-15', createdAt: '2025-06-01', downloads: 62, views: 234, fileKind: 'pdf', fileSize: '2.4 MB', owner: 'u006' },
    { id: 'pd2', name: 'D專案年度預算.xlsx', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['帳務', '預算', 'D專案'], actionsAllowed: ['view'], visibilityMode: 'blacklist', visibilityList: ['外包'], updatedAt: '2025-10-20', createdAt: '2025-06-10', downloads: 38, views: 145, fileKind: 'xlsx', fileSize: '789 KB', owner: 'u006' },
    { id: 'pd3', name: 'D專案驗收報告.pptx', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['驗收', '報告', 'D專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-11-05', createdAt: '2025-10-01', downloads: 44, views: 178, fileKind: 'pptx', fileSize: '3.5 MB', owner: 'u006' },
    { id: 'pd4', name: 'D專案系統監控報告.pdf', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['監控', '報告', 'D專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2026-01-05', createdAt: '2025-07-01', downloads: 71, views: 298, fileKind: 'pdf', fileSize: '5.2 MB', owner: 'u006' },
    { id: 'pd5', name: 'D專案問題追蹤清單.xlsx', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['問題', '追蹤', 'D專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2026-01-12', createdAt: '2025-06-15', downloads: 89, views: 356, fileKind: 'xlsx', fileSize: '1.8 MB', owner: 'u006' },
    { id: 'pd6', name: 'D專案備份計畫.docx', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['備份', '計畫', 'D專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-08-15', createdAt: '2025-08-10', downloads: 32, views: 134, fileKind: 'docx', fileSize: '967 KB', owner: 'u006' },
    { id: 'pd7', name: 'D專案SLA協議.pdf', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['SLA', '協議', 'D專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-06-05', createdAt: '2025-06-01', downloads: 47, views: 192, fileKind: 'pdf', fileSize: '1.6 MB', owner: 'u006' },
    
    // ========== E 專案文件 ==========
    { id: 'pe1', name: 'E專案顧問合約.pdf', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['合約', '顧問', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-12-01', createdAt: '2025-02-01', downloads: 21, views: 89, fileKind: 'pdf', fileSize: '2.1 MB', owner: 'u007' },
    { id: 'pe2', name: 'E專案商業提案.pptx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['提案', '商業', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-11-30', createdAt: '2025-02-15', downloads: 76, views: 287, fileKind: 'pptx', fileSize: '7.2 MB', owner: 'u007' },
    { id: 'pe3', name: 'E專案表單流程設計.docx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['表單', '流程', 'E專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-12-08', createdAt: '2025-03-01', downloads: 33, views: 123, fileKind: 'docx', fileSize: '1.1 MB', owner: 'u007' },
    { id: 'pe4', name: 'E專案付款時程.xlsx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['帳務', '付款', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-12-10', createdAt: '2025-03-15', downloads: 18, views: 67, fileKind: 'xlsx', fileSize: '423 KB', owner: 'u007' },
    { id: 'pe5', name: 'E專案風險評估.docx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['風險', '評估', 'E專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-12-05', createdAt: '2025-04-01', downloads: 27, views: 98, fileKind: 'docx', fileSize: '876 KB', owner: 'u007' },
    { id: 'pe6', name: 'E專案流程診斷報告.pdf', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['診斷', '報告', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-05-15', createdAt: '2025-05-10', downloads: 54, views: 223, fileKind: 'pdf', fileSize: '4.8 MB', owner: 'u007' },
    { id: 'pe7', name: 'E專案導入計畫.docx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['導入', '計畫', 'E專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-06-20', createdAt: '2025-06-15', downloads: 41, views: 178, fileKind: 'docx', fileSize: '2.3 MB', owner: 'u007' },
    { id: 'pe8', name: 'E專案訪談記錄.docx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['訪談', '記錄', 'E專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', visibilityList: [], updatedAt: '2025-04-25', createdAt: '2025-04-20', downloads: 29, views: 115, fileKind: 'docx', fileSize: '1.6 MB', owner: 'u007' },
    { id: 'pe9', name: 'E專案優化建議書.pptx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['優化', '建議', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects'], updatedAt: '2025-08-30', createdAt: '2025-08-25', downloads: 63, views: 267, fileKind: 'pptx', fileSize: '5.4 MB', owner: 'u007' },
    { id: 'pe10', name: 'E專案成效評估報告.pdf', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['成效', '評估', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', visibilityList: ['Projects', 'Finance'], updatedAt: '2025-12-28', createdAt: '2025-12-20', downloads: 38, views: 167, fileKind: 'pdf', fileSize: '3.2 MB', owner: 'u007' },
];

// 檔案存取紀錄
window.__sharedKmData.accessLogs = [
    { id: 'log1', fileId: 'i1', fileName: '差旅報銷規範.pdf', userId: 'u001', userName: '王小明', action: 'view', timestamp: '2025-12-19 09:30:15', ip: '192.168.1.100' },
    { id: 'log2', fileId: 'pa1', fileName: 'A專案服務合約.pdf', userId: 'u003', userName: '李大華', action: 'download', timestamp: '2025-12-19 09:25:30', ip: '192.168.1.101' },
    { id: 'log3', fileId: 'pb2', fileName: 'B專案結案報告.pptx', userId: 'u004', userName: '陳美玲', action: 'view', timestamp: '2025-12-19 09:20:00', ip: '192.168.1.102' },
    { id: 'log4', fileId: 'pc3', fileName: 'C專案表單需求.docx', userId: 'u005', userName: '張志豪', action: 'edit', timestamp: '2025-12-19 09:15:45', ip: '192.168.1.103' },
    { id: 'log5', fileId: 'pd1', fileName: 'D專案維護合約.pdf', userId: 'u006', userName: '林雅婷', action: 'download', timestamp: '2025-12-19 09:10:20', ip: '192.168.1.104' },
    { id: 'log6', fileId: 'pe2', fileName: 'E專案商業提案.pptx', userId: 'u007', userName: '黃建中', action: 'view', timestamp: '2025-12-19 09:05:00', ip: '192.168.1.105' },
    { id: 'log7', fileId: 'i2', fileName: '請假制度.docx', userId: 'u001', userName: '王小明', action: 'view', timestamp: '2025-12-18 17:30:00', ip: '192.168.1.100' },
    { id: 'log8', fileId: 'pa4', fileName: 'A專案報價單.xlsx', userId: 'u003', userName: '李大華', action: 'download', timestamp: '2025-12-18 16:45:30', ip: '192.168.1.101' },
    { id: 'log9', fileId: 'pb3', fileName: 'B專案費用明細.xlsx', userId: 'u004', userName: '陳美玲', action: 'edit', timestamp: '2025-12-18 16:00:00', ip: '192.168.1.102' },
    { id: 'log10', fileId: 'pc4', fileName: 'C專案請款單.xlsx', userId: 'u005', userName: '張志豪', action: 'upload', timestamp: '2025-12-18 15:30:15', ip: '192.168.1.103' },
];

// AI 加值設定
window.__sharedKmData.aiSettings = {
    enabled: true,
    features: {
        smartSearch: { enabled: true, name: '智慧問答', description: '使用 AI 回答文件相關問題' },
        autoSummary: { enabled: true, name: '自動摘要', description: '自動產生文件摘要' },
        fileCompare: { enabled: true, name: '檔案比較', description: '比較多個文件的差異' },
        aiTranslate: { enabled: false, name: 'AI 翻譯', description: '翻譯文件內容' },
    },
    model: 'gpt-4',
    maxTokens: 4000,
    temperature: 0.7,
    apiKey: '***hidden***',
    usageStats: {
        totalQueries: 1234,
        thisMonth: 156,
        avgResponseTime: '2.3s'
    }
};

// 使用者清單（用於權限管理）
window.__sharedKmData.users = [
    { id: 'u001', name: '王小明', dept: 'HR', role: 'admin', email: 'xiaoming@company.com' },
    { id: 'u002', name: '李小芳', dept: 'Supply', role: 'user', email: 'xiaofang@company.com' },
    { id: 'u003', name: '李大華', dept: 'Projects', role: 'manager', email: 'dahua@company.com' },
    { id: 'u004', name: '陳美玲', dept: 'Projects', role: 'user', email: 'meiling@company.com' },
    { id: 'u005', name: '張志豪', dept: 'Projects', role: 'user', email: 'zhihao@company.com' },
    { id: 'u006', name: '林雅婷', dept: 'Projects', role: 'manager', email: 'yating@company.com' },
    { id: 'u007', name: '黃建中', dept: 'Projects', role: 'user', email: 'jianzhong@company.com' },
    { id: 'u008', name: '外包人員A', dept: '外包', role: 'external', email: 'external_a@partner.com' },
];

/**
 * 資料操作方法
 */
window.__sharedKmData.api = {
    // 取得所有檔案
    getFiles: function(filters = {}) {
        let items = [...window.__sharedKmData.indexItems];
        
        if (filters.type) {
            items = items.filter(i => i.type === filters.type);
        }
        if (filters.deptId) {
            items = items.filter(i => i.deptId === filters.deptId);
        }
        if (filters.tags && filters.tags.length > 0) {
            items = items.filter(i => filters.tags.some(t => i.tags.includes(t)));
        }
        if (filters.keyword) {
            const kw = filters.keyword.toLowerCase();
            items = items.filter(i => 
                i.name.toLowerCase().includes(kw) || 
                i.path.toLowerCase().includes(kw) ||
                i.tags.some(t => t.toLowerCase().includes(kw))
            );
        }
        
        return items;
    },
    
    // 更新檔案權限
    updateFilePermission: function(fileId, permissionData) {
        const item = window.__sharedKmData.indexItems.find(i => i.id === fileId);
        if (item) {
            if (permissionData.visibilityMode) item.visibilityMode = permissionData.visibilityMode;
            if (permissionData.visibilityList) item.visibilityList = permissionData.visibilityList;
            if (permissionData.actionsAllowed) item.actionsAllowed = permissionData.actionsAllowed;
            return true;
        }
        return false;
    },
    
    // 更新檔案標籤
    updateFileTags: function(fileId, tags) {
        const item = window.__sharedKmData.indexItems.find(i => i.id === fileId);
        if (item) {
            item.tags = tags;
            return true;
        }
        return false;
    },
    
    // 新增標籤
    addTag: function(tagData) {
        const newTag = {
            id: 't' + (window.__sharedKmData.allTags.length + 1),
            name: tagData.name,
            color: tagData.color || '#6B7280',
            count: 0
        };
        window.__sharedKmData.allTags.push(newTag);
        return newTag;
    },
    
    // 刪除標籤
    deleteTag: function(tagId) {
        const index = window.__sharedKmData.allTags.findIndex(t => t.id === tagId);
        if (index > -1) {
            const tagName = window.__sharedKmData.allTags[index].name;
            window.__sharedKmData.allTags.splice(index, 1);
            // 從所有檔案移除此標籤
            window.__sharedKmData.indexItems.forEach(item => {
                item.tags = item.tags.filter(t => t !== tagName);
            });
            return true;
        }
        return false;
    },
    
    // 取得存取紀錄
    getAccessLogs: function(filters = {}) {
        let logs = [...window.__sharedKmData.accessLogs];
        
        if (filters.fileId) {
            logs = logs.filter(l => l.fileId === filters.fileId);
        }
        if (filters.userId) {
            logs = logs.filter(l => l.userId === filters.userId);
        }
        if (filters.action) {
            logs = logs.filter(l => l.action === filters.action);
        }
        if (filters.dateFrom) {
            logs = logs.filter(l => l.timestamp >= filters.dateFrom);
        }
        if (filters.dateTo) {
            logs = logs.filter(l => l.timestamp <= filters.dateTo);
        }
        
        return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    },
    
    // 更新 AI 設定
    updateAiSettings: function(settings) {
        Object.assign(window.__sharedKmData.aiSettings, settings);
        return true;
    },
    
    // 儲存資料到 localStorage（模擬持久化）
    saveToStorage: function() {
        try {
            localStorage.setItem('kmData_indexItems', JSON.stringify(window.__sharedKmData.indexItems));
            localStorage.setItem('kmData_allTags', JSON.stringify(window.__sharedKmData.allTags));
            localStorage.setItem('kmData_aiSettings', JSON.stringify(window.__sharedKmData.aiSettings));
            return true;
        } catch (e) {
            console.error('儲存資料失敗:', e);
            return false;
        }
    },
    
    // 從 localStorage 載入資料
    loadFromStorage: function() {
        try {
            const items = localStorage.getItem('kmData_indexItems');
            const tags = localStorage.getItem('kmData_allTags');
            const aiSettings = localStorage.getItem('kmData_aiSettings');
            
            if (items) window.__sharedKmData.indexItems = JSON.parse(items);
            if (tags) window.__sharedKmData.allTags = JSON.parse(tags);
            if (aiSettings) window.__sharedKmData.aiSettings = JSON.parse(aiSettings);
            
            return true;
        } catch (e) {
            console.error('載入資料失敗:', e);
            return false;
        }
    }
};

// 初始化時嘗試載入 localStorage 資料
window.__sharedKmData.api.loadFromStorage();

console.log('[KM] 共用資料已載入');
