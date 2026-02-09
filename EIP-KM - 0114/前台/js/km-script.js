/**
 * km-script.js
 * 文件庫管理 (KM) 相關的功能腳本
 * 參考 KM_V2.html 的架構
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
        { id: 'i3', name: '海外差旅', displayTitle: '海外差旅（資料夾）', type: 'folder', path: 'HR/FAQ', deptId: 'HR', tags: ['差旅'], actionsAllowed: ['view'], visibilityMode: 'blacklist', updatedAt: '2025-11-04', downloads: 0, fileKind: 'folder' },
        { id: 'i4', name: '供應商名單.xlsx', type: 'file', path: 'Supply/Vendor', deptId: 'Supply', tags: ['供應商', '採購'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-11-03', downloads: 75, fileKind: 'xlsx' },
        { id: 'i5', name: '採購合約', type: 'folder', path: 'Supply/Contract', deptId: 'Supply', tags: ['合約', '保密'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-10-29', downloads: 12, fileKind: 'folder' },
        // A 專案文件
        { id: 'pa1', name: 'A專案服務合約.pdf', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['合約', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-12-01', downloads: 45, fileKind: 'pdf' },
        { id: 'pa2', name: 'A專案提案簡報.pptx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['提案', '簡報', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-11-15', downloads: 89, fileKind: 'pptx' },
        { id: 'pa3', name: 'A專案需求規格書.docx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['需求', '規格', 'A專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', updatedAt: '2025-11-20', downloads: 56, fileKind: 'docx' },
        { id: 'pa4', name: 'A專案報價單.xlsx', type: 'file', path: '專案/A專案', deptId: 'Projects', tags: ['帳務', '報價', 'A專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-11-10', downloads: 23, fileKind: 'xlsx' },
        // B 專案文件
        { id: 'pb1', name: 'B專案外包合約.pdf', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['合約', '外包', 'B專案'], actionsAllowed: ['view'], visibilityMode: 'blacklist', updatedAt: '2025-12-05', downloads: 34, fileKind: 'pdf' },
        { id: 'pb2', name: 'B專案結案報告.pptx', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['結案', '報告', 'B專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-12-10', downloads: 67, fileKind: 'pptx' },
        { id: 'pb3', name: 'B專案費用明細.xlsx', type: 'file', path: '專案/B專案', deptId: 'Projects', tags: ['帳務', '費用', 'B專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-12-08', downloads: 41, fileKind: 'xlsx' },
        // C 專案文件
        { id: 'pc1', name: 'C專案合作備忘錄.pdf', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['合約', 'MOU', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-11-28', downloads: 28, fileKind: 'pdf' },
        { id: 'pc2', name: 'C專案技術提案.pptx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['提案', '技術', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'inherit', updatedAt: '2025-11-25', downloads: 52, fileKind: 'pptx' },
        { id: 'pc3', name: 'C專案表單需求.docx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['需求', '表單', 'C專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', updatedAt: '2025-12-02', downloads: 19, fileKind: 'docx' },
        { id: 'pc4', name: 'C專案請款單.xlsx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['帳務', '請款', 'C專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-12-12', downloads: 15, fileKind: 'xlsx' },
        { id: 'pc5', name: 'C專案會議紀錄.docx', type: 'file', path: '專案/C專案', deptId: 'Projects', tags: ['會議', '紀錄', 'C專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', updatedAt: '2025-12-14', downloads: 8, fileKind: 'docx' },
        // D 專案文件
        { id: 'pd1', name: 'D專案維護合約.pdf', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['合約', '維護', 'D專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-10-15', downloads: 62, fileKind: 'pdf' },
        { id: 'pd2', name: 'D專案年度預算.xlsx', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['帳務', '預算', 'D專案'], actionsAllowed: ['view'], visibilityMode: 'blacklist', updatedAt: '2025-10-20', downloads: 38, fileKind: 'xlsx' },
        { id: 'pd3', name: 'D專案驗收報告.pptx', type: 'file', path: '專案/D專案', deptId: 'Projects', tags: ['驗收', '報告', 'D專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-11-05', downloads: 44, fileKind: 'pptx' },
        // E 專案文件
        { id: 'pe1', name: 'E專案顧問合約.pdf', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['合約', '顧問', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-12-01', downloads: 21, fileKind: 'pdf' },
        { id: 'pe2', name: 'E專案商業提案.pptx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['提案', '商業', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-11-30', downloads: 76, fileKind: 'pptx' },
        { id: 'pe3', name: 'E專案表單流程設計.docx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['表單', '流程', 'E專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', updatedAt: '2025-12-08', downloads: 33, fileKind: 'docx' },
        { id: 'pe4', name: 'E專案付款時程.xlsx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['帳務', '付款', 'E專案'], actionsAllowed: ['view', 'download'], visibilityMode: 'whitelist', updatedAt: '2025-12-10', downloads: 18, fileKind: 'xlsx' },
        { id: 'pe5', name: 'E專案風險評估.docx', type: 'file', path: '專案/E專案', deptId: 'Projects', tags: ['風險', '評估', 'E專案'], actionsAllowed: ['view'], visibilityMode: 'inherit', updatedAt: '2025-12-05', downloads: 27, fileKind: 'docx' },
    ],
    folders: {
        'HR/FAQ': {
            path: 'HR/FAQ', inherit: true, deptId: 'HR', items: [
                { id: 'f1', name: '差旅報銷規範.pdf', displayTitle: '差旅報銷（新版）', type: 'file', updated: '昨天', visibility: '白名單', tags: ['差旅', '報銷'], deptId: 'HR' },
                { id: 'f2', name: '請假制度.docx', type: 'file', updated: '5 天前', visibility: '繼承', tags: ['請假', '制度'], deptId: 'HR' },
                { id: 'd1', name: '海外差旅', displayTitle: '海外差旅（資料夾）', type: 'folder', updated: '昨天', visibility: '黑名單', tags: ['差旅'], deptId: 'HR' },
            ]
        },
        'HR/SOP': {
            path: 'HR/SOP', inherit: false, deptId: 'HR', items: [
                { id: 'f3', name: '新人報到SOP.docx', type: 'file', updated: '5 天前', visibility: '白名單', tags: ['新人', 'SOP'], deptId: 'HR' }
            ]
        },
        'HR/表單/差旅': { path: 'HR/表單/差旅', inherit: true, deptId: 'HR', items: [] },
        'HR/表單/請假': { path: 'HR/表單/請假', inherit: true, deptId: 'HR', items: [] },
        // A 專案
        '專案/A專案': {
            path: '專案/A專案', inherit: true, deptId: 'Projects', items: [
                { id: 'pa1', name: 'A專案服務合約.pdf', type: 'file', updated: '2 週前', visibility: '白名單', tags: ['合約', 'A專案'], deptId: 'Projects' },
                { id: 'pa2', name: 'A專案提案簡報.pptx', type: 'file', updated: '1 個月前', visibility: '白名單', tags: ['提案', '簡報', 'A專案'], deptId: 'Projects' },
                { id: 'pa3', name: 'A專案需求規格書.docx', type: 'file', updated: '3 週前', visibility: '繼承', tags: ['需求', '規格', 'A專案'], deptId: 'Projects' },
                { id: 'pa4', name: 'A專案報價單.xlsx', type: 'file', updated: '1 個月前', visibility: '白名單', tags: ['帳務', '報價', 'A專案'], deptId: 'Projects' },
            ]
        },
        // B 專案
        '專案/B專案': {
            path: '專案/B專案', inherit: true, deptId: 'Projects', items: [
                { id: 'pb1', name: 'B專案外包合約.pdf', type: 'file', updated: '1 週前', visibility: '黑名單', tags: ['合約', '外包', 'B專案'], deptId: 'Projects' },
                { id: 'pb2', name: 'B專案結案報告.pptx', type: 'file', updated: '5 天前', visibility: '白名單', tags: ['結案', '報告', 'B專案'], deptId: 'Projects' },
                { id: 'pb3', name: 'B專案費用明細.xlsx', type: 'file', updated: '1 週前', visibility: '白名單', tags: ['帳務', '費用', 'B專案'], deptId: 'Projects' },
            ]
        },
        // C 專案
        '專案/C專案': {
            path: '專案/C專案', inherit: true, deptId: 'Projects', items: [
                { id: 'pc1', name: 'C專案合作備忘錄.pdf', type: 'file', updated: '2 週前', visibility: '白名單', tags: ['合約', 'MOU', 'C專案'], deptId: 'Projects' },
                { id: 'pc2', name: 'C專案技術提案.pptx', type: 'file', updated: '3 週前', visibility: '繼承', tags: ['提案', '技術', 'C專案'], deptId: 'Projects' },
                { id: 'pc3', name: 'C專案表單需求.docx', type: 'file', updated: '2 週前', visibility: '繼承', tags: ['需求', '表單', 'C專案'], deptId: 'Projects' },
                { id: 'pc4', name: 'C專案請款單.xlsx', type: 'file', updated: '3 天前', visibility: '白名單', tags: ['帳務', '請款', 'C專案'], deptId: 'Projects' },
                { id: 'pc5', name: 'C專案會議紀錄.docx', type: 'file', updated: '昨天', visibility: '繼承', tags: ['會議', '紀錄', 'C專案'], deptId: 'Projects' },
            ]
        },
        // D 專案
        '專案/D專案': {
            path: '專案/D專案', inherit: false, deptId: 'Projects', items: [
                { id: 'pd1', name: 'D專案維護合約.pdf', type: 'file', updated: '2 個月前', visibility: '白名單', tags: ['合約', '維護', 'D專案'], deptId: 'Projects' },
                { id: 'pd2', name: 'D專案年度預算.xlsx', type: 'file', updated: '2 個月前', visibility: '黑名單', tags: ['帳務', '預算', 'D專案'], deptId: 'Projects' },
                { id: 'pd3', name: 'D專案驗收報告.pptx', type: 'file', updated: '1 個月前', visibility: '白名單', tags: ['驗收', '報告', 'D專案'], deptId: 'Projects' },
            ]
        },
        // E 專案
        '專案/E專案': {
            path: '專案/E專案', inherit: true, deptId: 'Projects', items: [
                { id: 'pe1', name: 'E專案顧問合約.pdf', type: 'file', updated: '2 週前', visibility: '白名單', tags: ['合約', '顧問', 'E專案'], deptId: 'Projects' },
                { id: 'pe2', name: 'E專案商業提案.pptx', type: 'file', updated: '2 週前', visibility: '白名單', tags: ['提案', '商業', 'E專案'], deptId: 'Projects' },
                { id: 'pe3', name: 'E專案表單流程設計.docx', type: 'file', updated: '1 週前', visibility: '繼承', tags: ['表單', '流程', 'E專案'], deptId: 'Projects' },
                { id: 'pe4', name: 'E專案付款時程.xlsx', type: 'file', updated: '5 天前', visibility: '白名單', tags: ['帳務', '付款', 'E專案'], deptId: 'Projects' },
                { id: 'pe5', name: 'E專案風險評估.docx', type: 'file', updated: '1 週前', visibility: '繼承', tags: ['風險', '評估', 'E專案'], deptId: 'Projects' },
            ]
        }
    },
    tags: { popular: [{ tag: '合約', count: 25 }, { tag: '提案', count: 18 }, { tag: '帳務', count: 15 }, { tag: '差旅', count: 12 }, { tag: '表單', count: 10 }, { tag: '報銷', count: 8 }, { tag: 'A專案', count: 4 }, { tag: 'B專案', count: 3 }, { tag: 'C專案', count: 5 }, { tag: 'D專案', count: 3 }, { tag: 'E專案', count: 5 }] },
    sharedWithMe: [
        { id: 's1', name: '供應商名單.xlsx', type: 'file', from: 'Supply 部門', perms: ['view'], updated: '昨天', deptId: 'Supply', tags: ['供應商'] },
        { id: 's2', name: '採購合約', type: 'folder', from: 'Supply 部門', perms: ['view', 'download'], updated: '2 天前', deptId: 'Supply', tags: ['合約', '共享'] }
    ],
    sharedByMe: [
        { id: 'b1', name: '差旅報銷規範.pdf', type: 'file', to: ['Finance 部門', '張華'], perms: ['view'], status: '生效中', deptId: 'HR', displayTitle: '差旅報銷（新版）', tags: ['差旅', '報銷'] },
        { id: 'b2', name: 'HR/FAQ', type: 'folder', to: ['全公司（黑名單：外包）'], perms: ['view', 'download'], status: '生效中', deptId: 'HR', tags: ['FAQ'] }
    ],
    meData: { recent: ['i1', 'i4', 'i2'], favorites: ['i1', 'i5'] }
};

/**
 * 初始化 KM 系統
 */
function initKM() {
    // 初始化部門資訊
    document.getElementById('meDeptChip').textContent = '我的部門：' + window.__kmData.me.dept;
    document.getElementById('meRoleChip').textContent = '角色：' + window.__kmData.me.role;
    document.getElementById('myDept').textContent = window.__kmData.me.dept;

    // 載入預設資料夾
    loadKmFolder('HR/FAQ');

    // 初始化篩選選項
    buildKmFilters();

    // 初始化 AI 加值服務的檔案選擇器
    initAiFileSelectors();

    // 搜尋框 Enter 鍵事件
    const searchInput = document.getElementById('kmSearch');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                gotoKmView('search');
                doKmSearch();
            }
        });
    }
}

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
 * 切換 KM 內部視圖
 */
function gotoKmView(viewId) {
    // 隱藏所有視圖
    document.querySelectorAll('.km-view').forEach(v => v.classList.remove('active'));
    
    // 顯示目標視圖
    const targetView = document.getElementById('km-' + viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    // 更新導航按鈕狀態
    document.querySelectorAll('.km-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const navBtns = document.querySelectorAll('.km-nav-btn');
    const viewMap = { 'home': 0, 'tags': 1, 'shares': 2, 'my': 3 };
    if (viewMap[viewId] !== undefined) {
        navBtns[viewMap[viewId]]?.classList.add('active');
    }
}

/**
 * 載入資料夾內容
 */
function loadKmFolder(path) {
    console.log('📂 載入資料夾:', path);
    
    // 切換回資料夾面板
    switchMyTab('folder');
    
    const tbody = document.getElementById('kmListBody');
    const pathEl = document.getElementById('currentPath');
    const inheritLabel = document.getElementById('inheritLabel');
    
    if (pathEl) pathEl.textContent = path;
    
    // 從 localStorage 讀取檔案
    const data = localStorage.getItem('fileDatabase');
    if (!data) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center">無法載入數據</td></tr>';
        return;
    }
    
    const db = JSON.parse(data);
    const currentUserDept = 'HR'; // 當前用戶部門
    
    // 找出這個資料夾中的檔案
    const folderFiles = db.files.filter(file => {
        const isInFolder = file.folder === path;
        const hasPermission = file.permissions[currentUserDept] !== '不可見';
        console.log(`  檢查檔案: ${file.name}, folder: ${file.folder}, 在此資料夾: ${isInFolder}, 有權限: ${hasPermission}`);
        return isInFolder && hasPermission;
    });
    
    console.log('✅ 找到檔案數量:', folderFiles.length);
    
    // 更新樹狀結構的 active 狀態
    document.querySelectorAll('.folder-tree .tree-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (!tbody) return;
    
    if (folderFiles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">此資料夾目前沒有檔案</td></tr>';
        return;
    }
    
    // 獲取資料夾權限資訊
    const folder = db.folders.find(f => f.name === path);
    const folderPerm = folder ? folder.permissions[currentUserDept] : '僅瀏覽';
    if (inheritLabel) inheritLabel.textContent = `權限：${folderPerm}`;
    
    tbody.innerHTML = folderFiles.map(file => {
        const icon = getFileIconByName(file.name);
        const perm = file.permissions[currentUserDept];
        const canDownload = perm === '瀏覽+下載' || perm === '完全控制';
        
        // 標籤顏色對應
        const tagColors = {
            'SOP': 'background: #3B82F6; color: white;',
            'FAQ': 'background: #10B981; color: white;',
            '必讀': 'background: #EF4444; color: white;',
            '新人': 'background: #8B5CF6; color: white;',
            '請假': 'background: #F59E0B; color: white;',
            '薪資': 'background: #EC4899; color: white;',
            '規章': 'background: #06B6D4; color: white;',
            '考勤': 'background: #84CC16; color: white;',
            '差旅': 'background: #F97316; color: white;',
            '簽核': 'background: #6366F1; color: white;',
            '採購': 'background: #14B8A6; color: white;',
            '財報': 'background: #DC2626; color: white;',
            '機密': 'background: #991B1B; color: white;',
            'Q4': 'background: #7C3AED; color: white;',
            '預算': 'background: #2563EB; color: white;',
            '策略': 'background: #BE123C; color: white;',
            '市場': 'background: #0891B2; color: white;',
            '合約': 'background: #4338CA; color: white;',
            '供應商': 'background: #0D9488; color: white;',
            '報價': 'background: #CA8A04; color: white;',
            '資產': 'background: #65A30D; color: white;',
            '盤點': 'background: #0284C7; color: white;',
            '折舊': 'background: #7C2D12; color: white;'
        };
        
        const tagsHtml = (file.tags || []).map(tag => {
            const style = tagColors[tag] || 'background: #6B7280; color: white;';
            return `<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 4px; ${style}">${tag}</span>`;
        }).join('');
        
        // 檢查是否已收藏
        const isFav = isFileFavorited(file.name);
        const favClass = isFav ? 'active' : '';
        const favIcon = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
        
        return `
        <tr>
            <td>
                <div class="file-name">
                    <i class="${icon}" style="font-size: 18px; margin-right: 8px;"></i>
                    <span>${file.name}</span>
                </div>
            </td>
            <td>${tagsHtml}</td>
            <td>檔案</td>
            <td>${file.uploadDate || '-'}</td>
            <td><span class="pill">${perm}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn small ghost fav-btn ${favClass}" onclick="toggleFavorite('${file.name}')" title="${isFav ? '取消收藏' : '加入收藏'}"><i class="${favIcon}"></i></button>
                    <button class="btn small ghost" onclick="renameFile('${file.name}')" title="修改檔名"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn small ghost" onclick="viewFile('${file.name}')" title="檢視"><i class="fa-solid fa-eye"></i></button>
                    ${canDownload ? `<button class="btn small ghost" onclick="downloadFile('${file.name}')" title="下載"><i class="fa-solid fa-download"></i></button>` : ''}
                    <div class="more-menu-wrapper">
                        <button class="more-menu-btn" onclick="toggleMoreMenu(event, '${file.name}')" title="更多操作"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div class="more-menu-dropdown" id="moreMenu_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}">
                            <button class="menu-item" onclick="duplicateFile('${file.name}')"><i class="fa-regular fa-copy"></i>建立副本</button>
                            <button class="menu-item" onclick="shareFile('${file.name}')"><i class="fa-solid fa-share-nodes"></i>共用</button>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

// 根據檔名取得圖標（帶顏色）
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
    
    // 顏色對應（與 Tailwind CSS 一致）
    const colorMap = {
        'pdf': 'color: #EF4444;',      // red-500
        'doc': 'color: #3B82F6;',      // blue-500
        'docx': 'color: #3B82F6;',     // blue-500
        'xls': 'color: #10B981;',      // green-500
        'xlsx': 'color: #10B981;',     // green-500
        'ppt': 'color: #F97316;',      // orange-500
        'pptx': 'color: #F97316;',     // orange-500
        'txt': 'color: #6B7280;',      // gray-500
        'zip': 'color: #EAB308;'       // yellow-500
    };
    
    const icon = iconMap[ext] || 'fa-solid fa-file';
    const color = colorMap[ext] || 'color: #9CA3AF;'; // gray-400
    
    return `${icon}" style="${color}`;
}

// 下載檔案
function downloadFile(fileName) {
    if (checkFilePermission(fileName, 'download')) {
        // 添加操作記錄
        if (typeof addFrontendAuditLog === 'function') {
            addFrontendAuditLog('下載', fileName);
        }
        alert(`⬇️ 下載檔案：${fileName}\n\n(實際應用中會觸發檔案下載)`);
    }
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
        // 加入收藏
        favorites.push(fileName);
        saveFavorites(favorites);
        showToast(`⭐ 已將「${fileName}」加入收藏`);
        
        // 記錄操作
        if (typeof addFrontendAuditLog === 'function') {
            addFrontendAuditLog('加入收藏', fileName);
        }
    } else {
        // 取消收藏
        favorites.splice(index, 1);
        saveFavorites(favorites);
        showToast(`已將「${fileName}」移出收藏`);
        
        // 記錄操作
        if (typeof addFrontendAuditLog === 'function') {
            addFrontendAuditLog('取消收藏', fileName);
        }
    }
    
    // 重新渲染當前資料夾
    const currentPath = document.getElementById('currentPath')?.textContent;
    if (currentPath) {
        loadKmFolder(currentPath);
    }
    
    // 同時更新我的收藏頁面
    renderKmMy();
}

/**
 * 修改檔名
 */
function renameFile(oldName) {
    const newName = prompt(`請輸入新的檔案名稱：`, oldName);
    
    if (newName === null || newName.trim() === '') {
        return; // 使用者取消或未輸入
    }
    
    if (newName.trim() === oldName) {
        return; // 名稱沒變
    }
    
    // 從 localStorage 取得資料庫
    const data = localStorage.getItem('fileDatabase');
    if (!data) {
        alert('無法載入檔案資料庫');
        return;
    }
    
    const db = JSON.parse(data);
    const file = db.files.find(f => f.name === oldName);
    
    if (!file) {
        alert('找不到該檔案');
        return;
    }
    
    // 檢查新名稱是否已存在
    const exists = db.files.some(f => f.name === newName.trim() && f.folder === file.folder);
    if (exists) {
        alert('此資料夾中已存在同名檔案');
        return;
    }
    
    // 更新檔名
    file.name = newName.trim();
    localStorage.setItem('fileDatabase', JSON.stringify(db));
    
    // 更新收藏清單中的檔名
    const favorites = getFavorites();
    const favIndex = favorites.indexOf(oldName);
    if (favIndex !== -1) {
        favorites[favIndex] = newName.trim();
        saveFavorites(favorites);
    }
    
    showToast(`✏️ 檔名已更新為「${newName.trim()}」`);
    
    // 記錄操作
    if (typeof addFrontendAuditLog === 'function') {
        addFrontendAuditLog('修改檔名', `${oldName} → ${newName.trim()}`);
    }
    
    // 重新渲染當前資料夾
    const currentPath = document.getElementById('currentPath')?.textContent;
    if (currentPath) {
        loadKmFolder(currentPath);
    }
}

/**
 * 切換更多選單顯示
 */
function toggleMoreMenu(event, fileName) {
    event.stopPropagation();
    
    // 關閉所有其他選單
    document.querySelectorAll('.more-menu-dropdown.show').forEach(menu => {
        menu.classList.remove('show');
    });
    
    // 切換目標選單
    const menuId = 'moreMenu_' + fileName.replace(/[^a-zA-Z0-9]/g, '_');
    const menu = document.getElementById(menuId);
    if (menu) {
        menu.classList.toggle('show');
    }
}

/**
 * 建立檔案副本
 */
function duplicateFile(fileName) {
    closeAllMoreMenus();
    
    // 從 localStorage 取得資料庫
    const data = localStorage.getItem('fileDatabase');
    if (!data) {
        alert('無法載入檔案資料庫');
        return;
    }
    
    const db = JSON.parse(data);
    const file = db.files.find(f => f.name === fileName);
    
    if (!file) {
        alert('找不到該檔案');
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
    
    // 記錄操作
    if (typeof addFrontendAuditLog === 'function') {
        addFrontendAuditLog('建立副本', `${fileName} → ${copyName}`);
    }
    
    // 重新渲染當前資料夾
    const currentPath = document.getElementById('currentPath')?.textContent;
    if (currentPath) {
        loadKmFolder(currentPath);
    }
}

/**
 * 共用檔案
 */
function shareFile(fileName) {
    closeAllMoreMenus();
    
    showToast(`🔗 開啟「${fileName}」的共用設定...`);
    
    // 記錄操作
    if (typeof addFrontendAuditLog === 'function') {
        addFrontendAuditLog('共用', fileName);
    }
    
    // 這裡可以開啟共用 Modal，目前先用 alert 示意
    alert(`🔗 共用檔案：${fileName}\n\n（實際應用中會開啟共用設定對話框）`);
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
 * 顯示 Toast 訊息
 */
function showToast(message) {
    // 檢查是否已有 toast 容器
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
    
    // 3 秒後移除
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 點擊外部關閉選單
document.addEventListener('click', function(event) {
    if (!event.target.closest('.more-menu-wrapper')) {
        closeAllMoreMenus();
    }
});

/**
 * 展開/收合所有資料夾
 */
function toggleAllFolders() {
    const tree = document.getElementById('folderTree');
    if (!tree) return;
    
    const details = tree.querySelectorAll('details');
    const allOpen = Array.from(details).every(d => d.open);
    
    details.forEach(d => {
        d.open = !allOpen;
    });
}

/**
 * 建立篩選選項
 */
function buildKmFilters() {
    // 部門篩選
    const deptContainer = document.getElementById('filterDept');
    if (deptContainer) {
        deptContainer.innerHTML = window.__kmData.departments.map(d => `
            <label><input type="checkbox" value="${d.id}" onchange="applyKmFilters()"> ${d.name}</label>
        `).join('');
    }
    
    // 標籤篩選
    const tagsContainer = document.getElementById('filterTags');
    if (tagsContainer) {
        tagsContainer.innerHTML = window.__kmData.tags.popular.map(t => `
            <label><input type="checkbox" value="${t.tag}" onchange="applyKmFilters()"> ${t.tag}</label>
        `).join('');
    }
}

/**
 * 執行搜尋
 */
function doKmSearch() {
    const query = (document.getElementById('kmSearch')?.value || '').trim().toLowerCase();
    const sortBy = document.getElementById('sortBy')?.value || 'relevance';
    
    let items = window.__kmData.indexItems.slice();
    
    // 關鍵字篩選
    if (query) {
        items = items.filter(item => {
            const name = getDisplayName(item).toLowerCase();
            const tags = (item.tags || []).join(' ').toLowerCase();
            return name.includes(query) || tags.includes(query);
        });
    }
    
    // 排序
    items.sort((a, b) => {
        if (sortBy === 'updated') {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        } else if (sortBy === 'downloads') {
            return (b.downloads || 0) - (a.downloads || 0);
        }
        // 預設按名稱
        return getDisplayName(a).localeCompare(getDisplayName(b));
    });
    
    renderKmSearchResults(items);
    updateActiveFilters();
}

/**
 * 套用篩選條件
 */
function applyKmFilters() {
    doKmSearch();
}

/**
 * 清除篩選條件
 */
function clearKmFilters() {
    document.querySelectorAll('#filterDept input, #filterTags input').forEach(i => i.checked = false);
    document.querySelectorAll('[value="file"], [value="folder"], [value="whitelist"], [value="blacklist"], [value="inherit"]').forEach(i => i.checked = false);
    const sinceEl = document.getElementById('filterSince');
    if (sinceEl) sinceEl.value = '';
    
    doKmSearch();
}

/**
 * 渲染搜尋結果
 */
function renderKmSearchResults(items) {
    const tbody = document.getElementById('kmSearchBody');
    if (!tbody) return;
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="mut text-center">沒有符合條件的結果</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>
                <div class="file-name">
                    <i class="fa-solid ${getFileIcon(item)}"></i>
                    <span>${getDisplayName(item)}</span>
                </div>
            </td>
            <td>${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</td>
            <td>${item.deptId}</td>
            <td>${item.type === 'folder' ? '資料夾' : '檔案'}</td>
            <td>${item.visibilityMode || '-'}</td>
            <td>${item.updatedAt || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="btn small ghost" title="檢視"><i class="fa-solid fa-eye"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * 更新活動篩選標籤
 */
function updateActiveFilters() {
    const query = (document.getElementById('kmSearch')?.value || '').trim();
    const filtersEl = document.getElementById('activeFilters');
    
    if (filtersEl) {
        filtersEl.textContent = query ? `關鍵字: ${query}` : '無篩選';
    }
}

/**
 * 渲染標籤頁
 */
function renderKmTags() {
    const tagCloud = document.getElementById('tagCloud');
    if (!tagCloud) return;
    
    const popular = window.__kmData.tags.popular || [];
    tagCloud.innerHTML = popular.map(t => `
        <button class="btn" onclick="openKmTag('${t.tag}')">
            #${t.tag} <span class="mut">(${t.count})</span>
        </button>
    `).join('');
    
    // 預設開啟第一個標籤
    if (popular[0]) {
        openKmTag(popular[0].tag);
    }
}

/**
 * 開啟標籤詳頁
 */
function openKmTag(tag) {
    const titleEl = document.getElementById('tagTitle');
    const tbody = document.getElementById('tagResultBody');
    
    if (titleEl) titleEl.textContent = '#' + tag;
    
    const items = window.__kmData.indexItems.filter(item => (item.tags || []).includes(tag));
    
    if (!tbody) return;
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="mut text-center">此標籤目前沒有項目</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>
                <div class="file-name">
                    <i class="fa-solid ${getFileIcon(item)}"></i>
                    <span>${getDisplayName(item)}</span>
                </div>
            </td>
            <td>${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</td>
            <td>${item.deptId}</td>
            <td>${item.type === 'folder' ? '資料夾' : '檔案'}</td>
            <td>${item.updatedAt || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="btn small ghost"><i class="fa-solid fa-eye"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * 渲染分享中心
 */
function renderKmShares() {
    // 我被分享的
    const withMeBody = document.getElementById('withMeBody');
    if (withMeBody) {
        withMeBody.innerHTML = window.__kmData.sharedWithMe.map(item => `
            <tr>
                <td>
                    <div class="file-name">
                        <i class="fa-solid ${getFileIcon(item)}"></i>
                        <span>${getDisplayName(item)}</span>
                    </div>
                </td>
                <td>${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</td>
                <td>${item.type === 'folder' ? '資料夾' : '檔案'}</td>
                <td>${item.from}</td>
                <td>${(item.perms || []).join(', ')}</td>
                <td>${item.updated || '-'}</td>
                <td>
                    <button class="btn small ghost"><i class="fa-solid fa-eye"></i></button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7" class="mut text-center">目前沒有被分享的項目</td></tr>';
    }
    
    // 我分享的
    const byMeBody = document.getElementById('byMeBody');
    if (byMeBody) {
        byMeBody.innerHTML = window.__kmData.sharedByMe.map(item => `
            <tr>
                <td>
                    <div class="file-name">
                        <i class="fa-solid ${getFileIcon(item)}"></i>
                        <span>${getDisplayName(item)}</span>
                    </div>
                </td>
                <td>${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</td>
                <td>${item.type === 'folder' ? '資料夾' : '檔案'}</td>
                <td>${(item.to || []).join(', ')}</td>
                <td>${(item.perms || []).join(', ')}</td>
                <td>${item.status || '-'}</td>
                <td>
                    <button class="btn small ghost"><i class="fa-solid fa-pen"></i></button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7" class="mut text-center">目前沒有分享的項目</td></tr>';
    }
}

/**
 * 切換分享頁籤
 */
function switchShareTab(which) {
    const tabs = document.querySelectorAll('#page-km .km-view#km-shares .tab-btn');
    const withMePanel = document.getElementById('shareWithMePanel');
    const byMePanel = document.getElementById('shareByMePanel');
    
    if (which === 'withMe') {
        tabs[0]?.classList.add('active');
        tabs[1]?.classList.remove('active');
        if (withMePanel) withMePanel.style.display = 'block';
        if (byMePanel) byMePanel.style.display = 'none';
    } else {
        tabs[0]?.classList.remove('active');
        tabs[1]?.classList.add('active');
        if (withMePanel) withMePanel.style.display = 'none';
        if (byMePanel) byMePanel.style.display = 'block';
    }
}

/**
 * 渲染「我的」頁面
 */
function renderKmMy() {
    const idx = new Map(window.__kmData.indexItems.map(i => [i.id, i]));
    
    // 最近檢視
    const recent = window.__kmData.meData.recent.map(id => idx.get(id)).filter(Boolean);
    const recentBody = document.getElementById('recentBody');
    if (recentBody) {
        recentBody.innerHTML = recent.map(item => `
            <tr>
                <td>
                    <div class="file-name">
                        <i class="fa-solid ${getFileIcon(item)}"></i>
                        <span>${getDisplayName(item)}</span>
                    </div>
                </td>
                <td>${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</td>
                <td>${item.deptId}</td>
                <td>${item.type === 'folder' ? '資料夾' : '檔案'}</td>
                <td>${item.updatedAt || '-'}</td>
                <td>
                    <button class="btn small ghost"><i class="fa-solid fa-eye"></i></button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="6" class="mut text-center">尚無紀錄</td></tr>';
    }
    
    // 我的收藏 - 從 localStorage 讀取
    const favorites = getFavorites();
    const favBody = document.getElementById('favBody');
    
    if (favBody) {
        if (favorites.length === 0) {
            favBody.innerHTML = '<tr><td colspan="6" class="mut text-center">尚無收藏</td></tr>';
        } else {
            // 從 fileDatabase 取得檔案資訊
            const dbData = localStorage.getItem('fileDatabase');
            const db = dbData ? JSON.parse(dbData) : { files: [] };
            
            const favItems = favorites.map(fileName => {
                // 先從 fileDatabase 找
                const dbFile = db.files.find(f => f.name === fileName);
                if (dbFile) {
                    return {
                        name: dbFile.name,
                        tags: dbFile.tags || [],
                        deptId: dbFile.folder?.split('/')[0] || '-',
                        type: 'file',
                        updatedAt: dbFile.uploadDate || '-'
                    };
                }
                // 再從 indexItems 找
                const indexItem = window.__kmData.indexItems.find(i => i.name === fileName);
                if (indexItem) {
                    return indexItem;
                }
                // 找不到，返回基本資訊
                return { name: fileName, tags: [], deptId: '-', type: 'file', updatedAt: '-' };
            }).filter(Boolean);
            
            favBody.innerHTML = favItems.map(item => `
                <tr>
                    <td>
                        <div class="file-name">
                            <i class="fa-solid ${getFileIcon(item)}"></i>
                            <span>${getDisplayName(item)}</span>
                        </div>
                    </td>
                    <td>${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</td>
                    <td>${item.deptId || '-'}</td>
                    <td>${item.type === 'folder' ? '資料夾' : '檔案'}</td>
                    <td>${item.updatedAt || '-'}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn small ghost fav-btn active" onclick="toggleFavorite('${item.name}')" title="取消收藏"><i class="fa-solid fa-star"></i></button>
                            <button class="btn small ghost" onclick="viewFile('${item.name}')" title="檢視"><i class="fa-solid fa-eye"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }
}

/**
 * 切換「我的」頁籤
 */
function switchMyTab(which) {
    const tabs = document.querySelectorAll('#page-km .km-view#km-home .tab-btn');
    const folderPanel = document.getElementById('folderPanel');
    const recentPanel = document.getElementById('recentPanel');
    const favPanel = document.getElementById('favPanel');
    
    if (which === 'recent') {
        tabs[0]?.classList.add('active');
        tabs[1]?.classList.remove('active');
        if (folderPanel) folderPanel.style.display = 'none';
        if (recentPanel) recentPanel.style.display = 'block';
        if (favPanel) favPanel.style.display = 'none';
    } else if (which === 'fav') {
        tabs[0]?.classList.remove('active');
        tabs[1]?.classList.add('active');
        if (folderPanel) folderPanel.style.display = 'none';
        if (recentPanel) recentPanel.style.display = 'none';
        if (favPanel) favPanel.style.display = 'block';
    } else {
        // 預設顯示資料夾面板
        tabs[0]?.classList.remove('active');
        tabs[1]?.classList.remove('active');
        if (folderPanel) folderPanel.style.display = 'block';
        if (recentPanel) recentPanel.style.display = 'none';
        if (favPanel) favPanel.style.display = 'none';
    }
}

/**
 * 開啟上傳 Modal
 */
function openUploadModal() {
    const path = document.getElementById('currentPath')?.textContent || 'HR/FAQ';
    const targetPath = document.getElementById('uploadTargetPath');
    if (targetPath) targetPath.textContent = path;
    
    openModal('uploadModal');
}

/**
 * 執行上傳
 */
function doUpload() {
    const title = document.getElementById('uploadTitle')?.value || '';
    const tags = document.getElementById('uploadTags')?.value || '';
    
    alert('上傳成功（示意）\n標題: ' + (title || '未設定') + '\n標籤: ' + (tags || '無'));
    
    // 清空表單
    if (document.getElementById('uploadTitle')) document.getElementById('uploadTitle').value = '';
    if (document.getElementById('uploadTags')) document.getElementById('uploadTags').value = '';
    if (document.getElementById('uploadDesc')) document.getElementById('uploadDesc').value = '';
    
    closeModal('uploadModal');
}

/**
 * 開啟新增資料夾 Modal
 */
function openCreateFolderModal() {
    const path = document.getElementById('currentPath')?.textContent || 'HR/FAQ';
    const createPath = document.getElementById('createFolderPath');
    if (createPath) createPath.textContent = path;
    
    openModal('createFolderModal');
}

/**
 * 確認新增資料夾
 */
function confirmCreateFolder() {
    const name = document.getElementById('newFolderName')?.value || '';
    
    if (!name.trim()) {
        alert('請輸入資料夾名稱');
        return;
    }
    
    alert('已建立資料夾: ' + name);
    
    // 清空表單
    if (document.getElementById('newFolderName')) document.getElementById('newFolderName').value = '';
    
    closeModal('createFolderModal');
    
    // 重新載入當前資料夾
    const currentPath = document.getElementById('currentPath')?.textContent || 'HR/FAQ';
    loadKmFolder(currentPath);
}

/**
 * 開啟權限設定 Modal
 */
function openPermModal() {
    const path = document.getElementById('currentPath')?.textContent || 'HR/FAQ';
    const permTarget = document.getElementById('permTarget');
    if (permTarget) permTarget.textContent = path;
    
    openModal('permModal');
}

/**
 * 開啟分享 Modal
 */
function openShareModal() {
    const path = document.getElementById('currentPath')?.textContent || 'HR/FAQ';
    const shareTarget = document.getElementById('shareTarget');
    if (shareTarget) shareTarget.textContent = path;
    
    openModal('shareModal');
}

/**
 * 儲存標籤
 */
function saveTags() {
    const itemId = document.getElementById('tagsItemId')?.value;
    const tags = document.getElementById('tagsInput')?.value || '';
    
    alert('標籤已儲存: ' + (tags || '(已清除)'));
    closeModal('tagsModal');
}

// ========================================
// AI 加值功能
// ========================================

/**
 * 初始化 AI 加值服務的檔案選擇器
 * 動態從 window.__kmData.indexItems 讀取所有檔案
 */
function initAiFileSelectors() {
    const items = window.__kmData.indexItems.filter(item => item.type === 'file');
    
    // 依據路徑分組檔案
    const filesByPath = {};
    items.forEach(item => {
        const pathParts = item.path.split('/');
        const groupName = pathParts[0] === '專案' ? pathParts[1] : pathParts[0];
        if (!filesByPath[groupName]) {
            filesByPath[groupName] = [];
        }
        filesByPath[groupName].push(item);
    });
    
    // 取得檔案圖示
    function getIconClass(item) {
        const ext = item.fileKind || item.name.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf': return 'fa-file-pdf pdf-icon';
            case 'doc':
            case 'docx': return 'fa-file-word doc-icon';
            case 'xls':
            case 'xlsx': return 'fa-file-excel xls-icon';
            case 'ppt':
            case 'pptx': return 'fa-file-powerpoint ppt-icon';
            default: return 'fa-file';
        }
    }
    
    // 1. 填充「文件摘要」的檔案清單
    const summaryFileList = document.getElementById('summaryFileList');
    if (summaryFileList) {
        let html = '';
        for (const group in filesByPath) {
            filesByPath[group].forEach(item => {
                html += `
                    <label class="checkbox-label file-item" data-project="${group}">
                        <input type="checkbox" value="${item.id}" onchange="updateSelectedFiles()">
                        <i class="fa-solid ${getIconClass(item)}"></i>
                        <span>${item.name}</span>
                        <small>${group}</small>
                    </label>
                `;
            });
        }
        summaryFileList.innerHTML = html;
    }
    
    // 2. 填充專案篩選下拉選單
    const summaryProjectFilter = document.getElementById('summaryProjectFilter');
    if (summaryProjectFilter) {
        let html = '<option value="all">全部專案</option>';
        for (const group in filesByPath) {
            html += `<option value="${group}">${group}</option>`;
        }
        summaryProjectFilter.innerHTML = html;
    }
    
    // 3. 產生 select 的 optgroup HTML
    function generateSelectOptions() {
        let html = '<option value="">-- 選擇檔案 --</option>';
        for (const group in filesByPath) {
            html += `<optgroup label="${group}">`;
            filesByPath[group].forEach(item => {
                html += `<option value="${item.id}">${item.name}</option>`;
            });
            html += '</optgroup>';
        }
        return html;
    }
    
    // 4. 填充「標籤建議」檔案選擇器
    const tagTargetFile = document.getElementById('tagTargetFile');
    if (tagTargetFile) {
        tagTargetFile.innerHTML = generateSelectOptions();
    }
    
    // 5. 填充「自動分類」檔案選擇器
    const classifyTargetFile = document.getElementById('classifyTargetFile');
    if (classifyTargetFile) {
        classifyTargetFile.innerHTML = generateSelectOptions();
    }
    
    // 6. 填充「相似檔案」檔案選擇器
    const similarTargetFile = document.getElementById('similarTargetFile');
    if (similarTargetFile) {
        similarTargetFile.innerHTML = generateSelectOptions();
    }
    
    // 7. 填充「AI 搜尋」範圍選擇器的資料夾樹狀結構
    const searchScopeFolders = document.getElementById('searchScopeFolders');
    if (searchScopeFolders) {
        // 收集所有唯一的路徑
        const folderPaths = {};
        items.forEach(item => {
            const parts = item.path.split('/');
            // 記錄頂層資料夾
            if (!folderPaths[parts[0]]) {
                folderPaths[parts[0]] = new Set();
            }
            // 記錄子資料夾（如果有的話）
            if (parts.length > 1) {
                folderPaths[parts[0]].add(item.path);
            }
        });
        
        let html = '';
        for (const topFolder in folderPaths) {
            // 頂層資料夾勾選框
            html += `
                <label class="checkbox-label tree-checkbox">
                    <input type="checkbox" value="${topFolder}">
                    <i class="fa-solid fa-folder folder-icon"></i> ${topFolder}
                </label>
            `;
            
            // 子資料夾（如果有的話）
            const subFolders = Array.from(folderPaths[topFolder]);
            if (subFolders.length > 0) {
                html += `<div style="padding-left:16px;">`;
                subFolders.forEach(subPath => {
                    const subName = subPath.split('/').pop();
                    html += `
                        <label class="checkbox-label tree-checkbox">
                            <input type="checkbox" value="${subPath}">
                            <i class="fa-solid fa-folder-open folder-icon"></i> ${subName}
                        </label>
                    `;
                });
                html += `</div>`;
            }
        }
        searchScopeFolders.innerHTML = html;
    }
    
    console.log('AI 檔案選擇器已初始化，共載入', items.length, '個檔案');
}

/**
 * 切換 AI 頁籤
 */
function switchAiTab(tabId) {
    // 更新頁籤按鈕狀態
    document.querySelectorAll('.ai-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // 切換面板顯示
    document.querySelectorAll('.ai-panel').forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById('ai-' + tabId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

/**
 * 更新搜尋範圍顯示
 */
function updateSearchScope() {
    const scopeValue = document.querySelector('input[name="searchScope"]:checked')?.value;
    const scopeTree = document.getElementById('searchScopeTree');
    const hint = document.getElementById('searchScopeHint');
    
    if (scopeValue === 'selected') {
        scopeTree.style.display = 'block';
        hint.textContent = '搜尋範圍：已選擇的專案/資料夾';
    } else {
        scopeTree.style.display = 'none';
        hint.textContent = '搜尋範圍：全部文件';
    }
}

/**
 * 清除 AI 搜尋範圍
 */
function clearAiScope() {
    document.querySelectorAll('#searchScopeTree input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelector('input[name="searchScope"][value="all"]').checked = true;
    updateSearchScope();
}

/**
 * 檢查使用者對檔案的存取權限
 * @param {Object} item - 檔案項目
 * @returns {Object} { hasAccess: boolean, reason: string }
 */
function checkFilePermission(item) {
    const me = window.__kmData.me;
    const dept = window.__kmData.departments.find(d => d.id === item.deptId);
    
    // 管理員擁有所有權限
    if (me.role === 'admin') {
        return { hasAccess: true, reason: '' };
    }
    
    // 檢查部門存取權限
    if (dept && !dept.accessible) {
        return { hasAccess: false, reason: '無部門存取權限' };
    }
    
    // 檢查檔案可見性模式
    switch (item.visibilityMode) {
        case 'blacklist':
            // 黑名單模式：模擬部分使用者被排除
            // 這裡假設非本部門人員可能被排除
            if (item.deptId !== me.dept && me.role !== 'admin') {
                return { hasAccess: false, reason: '您不在此檔案的授權名單中' };
            }
            break;
        case 'whitelist':
            // 白名單模式：預設有權限（模擬已在白名單中）
            break;
        case 'inherit':
            // 繼承模式：依據上層資料夾權限
            break;
    }
    
    // 檢查操作權限
    if (!item.actionsAllowed?.includes('view')) {
        return { hasAccess: false, reason: '無檢視權限' };
    }
    
    return { hasAccess: true, reason: '' };
}

/**
 * 根據權限過濾檔案清單
 * @param {Array} items - 檔案清單
 * @returns {Object} { accessible: Array, restricted: Array }
 */
function filterByPermission(items) {
    const accessible = [];
    const restricted = [];
    
    items.forEach(item => {
        const permission = checkFilePermission(item);
        if (permission.hasAccess) {
            accessible.push(item);
        } else {
            restricted.push({ ...item, restrictReason: permission.reason });
        }
    });
    
    return { accessible, restricted };
}

/**
 * 產生權限限制提示訊息
 * @param {Array} restrictedItems - 無權限的檔案清單
 * @returns {string} HTML 字串
 */
function generatePermissionNotice(restrictedItems) {
    if (!restrictedItems || restrictedItems.length === 0) return '';
    
    const fileNames = restrictedItems.slice(0, 3).map(i => i.name);
    const moreCount = restrictedItems.length - 3;
    
    let filesText = fileNames.join('、');
    if (moreCount > 0) {
        filesText += ` 等 ${restrictedItems.length} 個檔案`;
    }
    
    return `
        <div class="ai-permission-notice">
            <i class="fa-solid fa-lock"></i>
            <div class="notice-content">
                <strong>部分文件您沒有存取權限</strong>
                <p>以下檔案因權限限制無法顯示內容：${filesText}</p>
                <small>如需存取，請向檔案擁有者或管理員申請權限</small>
            </div>
        </div>
    `;
}

/**
 * 發送 AI 問答
 */
function sendAiQuestion() {
    const input = document.getElementById('aiSearchInput');
    const question = input.value.trim();
    
    if (!question) return;
    
    const chatHistory = document.getElementById('aiChatHistory');
    
    // 添加使用者訊息
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user';
    userMsg.innerHTML = `
        <div class="ai-avatar"><i class="fa-solid fa-user"></i></div>
        <div class="ai-bubble"><p>${escapeHtml(question)}</p></div>
    `;
    chatHistory.appendChild(userMsg);
    
    // 清空輸入
    input.value = '';
    
    // 解析問題中提到的專案
    const mentionedProjects = parseProjectsFromQuestion(question);
    
    // 自動更新搜尋範圍勾選框
    updateSearchScopeFromQuestion(mentionedProjects);
    
    // 判斷是否為比較類型的問題
    const isCompareQuestion = /比較|差異|不同|區別|對比|vs|VS|比對/.test(question);
    const isMultiFileQuestion = /多個|各|所有|哪些|列出/.test(question);
    
    // 模擬 AI 回應
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message assistant';
        
        let responseHtml = '';
        
        if (isCompareQuestion) {
            // 比較類型回應：使用表格呈現差異（傳入提到的專案）
            responseHtml = generateCompareResponse(question, mentionedProjects);
        } else if (isMultiFileQuestion) {
            // 多檔案列表回應
            responseHtml = generateMultiFileResponse(question, mentionedProjects);
        } else {
            // 一般回應
            responseHtml = generateGeneralResponse(question, mentionedProjects);
        }
        
        aiMsg.innerHTML = `
            <div class="ai-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="ai-bubble">${responseHtml}</div>
        `;
        chatHistory.appendChild(aiMsg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 1000);
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

/**
 * 解析問題中提到的專案
 * @param {string} question - 使用者問題
 * @returns {Array} 提到的專案代碼陣列
 */
function parseProjectsFromQuestion(question) {
    const projects = [];
    const projectPatterns = [
        { pattern: /A\s*專案|A專案/gi, project: 'A專案' },
        { pattern: /B\s*專案|B專案/gi, project: 'B專案' },
        { pattern: /C\s*專案|C專案/gi, project: 'C專案' },
        { pattern: /D\s*專案|D專案/gi, project: 'D專案' },
        { pattern: /E\s*專案|E專案/gi, project: 'E專案' },
        { pattern: /HR|人資|人力資源/gi, project: 'HR' },
    ];
    
    projectPatterns.forEach(({ pattern, project }) => {
        if (pattern.test(question)) {
            if (!projects.includes(project)) {
                projects.push(project);
            }
        }
    });
    
    return projects;
}

/**
 * 根據問題自動更新搜尋範圍勾選框
 * @param {Array} mentionedProjects - 提到的專案
 */
function updateSearchScopeFromQuestion(mentionedProjects) {
    if (mentionedProjects.length === 0) return;
    
    // 先清除所有勾選
    const checkboxes = document.querySelectorAll('#searchScopeFolders input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // 勾選提到的專案
    mentionedProjects.forEach(project => {
        checkboxes.forEach(cb => {
            const value = cb.value;
            // 匹配專案資料夾路徑
            if (value === project || 
                value === `專案/${project}` || 
                value.includes(project)) {
                cb.checked = true;
            }
        });
    });
    
    // 切換到「選擇專案/資料夾」模式並顯示範圍樹
    const selectedRadio = document.querySelector('input[name="searchScope"][value="selected"]');
    if (selectedRadio) {
        selectedRadio.checked = true;
        updateSearchScope();
    }
}

/**
 * 產生比較類型的回應（表格格式）
 */
function generateCompareResponse(question, mentionedProjects = []) {
    const q = question.toLowerCase();
    const items = window.__kmData.indexItems.filter(i => i.type === 'file');
    
    // 如果有指定專案，只篩選該專案的檔案
    let scopedItems = items;
    if (mentionedProjects.length > 0) {
        scopedItems = items.filter(item => {
            return mentionedProjects.some(proj => {
                if (proj === 'HR') {
                    return item.deptId === 'HR';
                }
                return item.path.includes(proj) || item.tags?.includes(proj);
            });
        });
    }
    
    // 根據問題關鍵字篩選相關檔案
    let relatedItems = [];
    if (/合約/.test(q)) {
        relatedItems = scopedItems.filter(i => i.tags?.includes('合約'));
    } else if (/提案|簡報/.test(q)) {
        relatedItems = scopedItems.filter(i => i.tags?.includes('提案') || i.fileKind === 'pptx');
    } else if (/預算|費用|帳務|報價/.test(q)) {
        relatedItems = scopedItems.filter(i => i.tags?.includes('帳務') || i.fileKind === 'xlsx');
    } else {
        // 如果有指定專案但沒有指定類型，取該專案所有檔案
        relatedItems = scopedItems.length > 0 ? scopedItems : items.filter(i => i.deptId === 'HR');
    }
    
    // 依權限過濾
    const { accessible, restricted } = filterByPermission(relatedItems);
    const permissionNotice = generatePermissionNotice(restricted);
    
    // 如果完全沒有可存取的檔案
    if (accessible.length === 0) {
        return `
            <p>根據您的問題「${escapeHtml(question)}」，找到了相關文件但您沒有存取權限。</p>
            ${permissionNotice}
            <p class="ai-hint">💡 提示：請向檔案擁有者或管理員申請權限後再試一次</p>
        `;
    }
    
    // 產生比較表格（使用可存取的檔案，根據提到的專案數量限制）
    if (/合約/.test(q)) {
        const contractFiles = accessible.filter(i => i.tags?.includes('合約'));
        return generateContractCompareTable(contractFiles, permissionNotice, mentionedProjects);
    } else if (/提案|簡報/.test(q)) {
        const presentationFiles = accessible.filter(i => i.tags?.includes('提案') || i.fileKind === 'pptx');
        return generatePresentationCompareTable(presentationFiles, permissionNotice, mentionedProjects);
    } else if (/預算|費用|帳務|報價/.test(q)) {
        const financeFiles = accessible.filter(i => i.tags?.includes('帳務') || i.fileKind === 'xlsx');
        return generateFinanceCompareTable(financeFiles, permissionNotice, mentionedProjects);
    } else {
        return generateDefaultCompareTable(accessible, permissionNotice, question, mentionedProjects);
    }
}

/**
 * 產生合約比較表格
 * @param {Array} files - 檔案清單
 * @param {string} permissionNotice - 權限提示 HTML
 * @param {Array} mentionedProjects - 問題中提到的專案
 */
function generateContractCompareTable(files, permissionNotice, mentionedProjects = []) {
    if (files.length === 0) {
        return `<p>未找到您有權限存取的合約文件。</p>${permissionNotice}`;
    }
    
    // 產生專案描述文字
    const projectDesc = mentionedProjects.length > 0 
        ? mentionedProjects.join('、') + ' 的'
        : '';
    
    const headers = files.map(f => `<th>${f.name.replace('.pdf', '')}</th>`).join('');
    
    return `
        <p>根據您的問題，我比較了 ${projectDesc}合約文件（共 ${files.length} 份），以下是主要差異：</p>
        ${permissionNotice}
        <div class="ai-table-wrapper">
            <table class="ai-compare-table">
                <thead>
                    <tr>
                        <th>比較項目</th>
                        ${headers}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>合約類型</strong></td>
                        ${files.map((f, i) => `<td>${['服務合約', '外包合約', '維護合約', '顧問合約'][i] || '一般合約'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>合約期間</strong></td>
                        ${files.map((f, i) => `<td>${['2025/01 - 2025/12', '2025/03 - 2025/09', '2025/01 - 2026/12', '2025/06 - 2026/05'][i] || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>付款方式</strong></td>
                        ${files.map((f, i) => `<td>${['月結 30 天', '里程碑付款', '年繳', '專案結案'][i] || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>違約條款</strong></td>
                        ${files.map((f, i) => `<td>合約金額 ${[10, 15, 5, 8][i] || 10}%</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>保密期限</strong></td>
                        ${files.map((f, i) => `<td>${[3, 5, 2, 3][i] || 3} 年</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="ai-source">📂 來源：${files.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
    `;
}

/**
 * 產生提案簡報比較表格
 * @param {Array} files - 檔案清單
 * @param {string} permissionNotice - 權限提示 HTML
 * @param {Array} mentionedProjects - 問題中提到的專案
 */
function generatePresentationCompareTable(files, permissionNotice, mentionedProjects = []) {
    if (files.length === 0) {
        return `<p>未找到您有權限存取的提案簡報。</p>${permissionNotice}`;
    }
    
    // 產生專案描述文字
    const projectDesc = mentionedProjects.length > 0 
        ? mentionedProjects.join('、') + ' 的'
        : '';
    
    const headers = files.map(f => `<th>${f.name.replace('.pptx', '').replace('.ppt', '')}</th>`).join('');
    
    return `
        <p>根據您的問題，我比較了 ${projectDesc}提案簡報（共 ${files.length} 份），以下是主要差異：</p>
        ${permissionNotice}
        <div class="ai-table-wrapper">
            <table class="ai-compare-table">
                <thead>
                    <tr>
                        <th>比較項目</th>
                        ${headers}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>提案重點</strong></td>
                        ${files.map((f, i) => `<td>${['系統整合服務', '技術架構設計', '商業模式創新', '結案報告'][i] || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>預估金額</strong></td>
                        ${files.map((f, i) => `<td>NT$ ${[2500000, 1800000, 3200000, 1650000][i]?.toLocaleString() || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>專案時程</strong></td>
                        ${files.map((f, i) => `<td>${[6, 4, 12, 8][i] || '-'} 個月</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>團隊規模</strong></td>
                        ${files.map((f, i) => `<td>${[5, 3, 8, 4][i] || '-'} 人</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>風險等級</strong></td>
                        ${files.map((f, i) => `<td>${['中', '低', '高', '中'][i] || '-'}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="ai-source">📂 來源：${files.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
    `;
}

/**
 * 產生財務資料比較表格
 * @param {Array} files - 檔案清單
 * @param {string} permissionNotice - 權限提示 HTML
 * @param {Array} mentionedProjects - 問題中提到的專案
 */
function generateFinanceCompareTable(files, permissionNotice, mentionedProjects = []) {
    if (files.length === 0) {
        return `<p>未找到您有權限存取的財務資料。</p>${permissionNotice}`;
    }
    
    // 產生專案描述文字
    const projectDesc = mentionedProjects.length > 0 
        ? mentionedProjects.join('、') + ' 的'
        : '';
    
    const headers = files.map(f => `<th>${f.name.replace('.xlsx', '').replace('.xls', '')}</th>`).join('');
    
    return `
        <p>根據您的問題，我比較了 ${projectDesc}財務資料（共 ${files.length} 份），以下是主要差異：</p>
        ${permissionNotice}
        <div class="ai-table-wrapper">
            <table class="ai-compare-table">
                <thead>
                    <tr>
                        <th>比較項目</th>
                        ${headers}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>總金額</strong></td>
                        ${files.map((f, i) => `<td>NT$ ${[2500000, 1650000, 800000, 1200000][i]?.toLocaleString() || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>人力成本</strong></td>
                        ${files.map((f, i) => `<td>${[60, 70, 40, 55][i] || '-'}%</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>設備費用</strong></td>
                        ${files.map((f, i) => `<td>${[25, 15, 35, 30][i] || '-'}%</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>管理費</strong></td>
                        ${files.map((f, i) => `<td>${[15, 15, 25, 15][i] || '-'}%</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>付款狀態</strong></td>
                        ${files.map((f, i) => `<td>${['報價中', '已結案', '執行中', '待付款'][i] || '-'}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="ai-source">📂 來源：${files.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
    `;
}

/**
 * 產生預設比較表格
 * @param {Array} files - 檔案清單
 * @param {string} permissionNotice - 權限提示 HTML
 * @param {string} question - 使用者問題
 * @param {Array} mentionedProjects - 問題中提到的專案
 */
function generateDefaultCompareTable(files, permissionNotice, question, mentionedProjects = []) {
    if (files.length === 0) {
        return `<p>未找到您有權限存取的相關文件。</p>${permissionNotice}`;
    }
    
    // 根據提到的專案數量決定顯示數量
    const maxDisplay = mentionedProjects.length > 0 ? mentionedProjects.length + 1 : 3;
    const displayFiles = files.slice(0, maxDisplay);
    const headers = displayFiles.map(f => `<th>${f.name}</th>`).join('');
    
    return `
        <p>根據您的問題「${escapeHtml(question)}」，我比較了相關文件的內容差異：</p>
        ${permissionNotice}
        <div class="ai-table-wrapper">
            <table class="ai-compare-table">
                <thead>
                    <tr>
                        <th>比較項目</th>
                        ${headers}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>適用對象</strong></td>
                        ${displayFiles.map(() => `<td>全體員工</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>申請方式</strong></td>
                        ${displayFiles.map((f, i) => `<td>${['線上系統 + 單據', '線上系統', '表單申請'][i] || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>核准層級</strong></td>
                        ${displayFiles.map((f, i) => `<td>${['部門主管 + 財務', '部門主管', '直屬主管'][i] || '-'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>處理時效</strong></td>
                        ${displayFiles.map((f, i) => `<td>${[5, 1, 3][i] || '-'} 個工作天</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="ai-source">📂 來源：${displayFiles.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
    `;
}

/**
 * 產生多檔案列表回應
 * @param {string} question - 使用者問題
 * @param {Array} mentionedProjects - 問題中提到的專案
 */
function generateMultiFileResponse(question, mentionedProjects = []) {
    const items = window.__kmData.indexItems.filter(i => i.type === 'file');
    const q = question.toLowerCase();
    
    // 如果有指定專案，先篩選該專案的檔案
    let scopedItems = items;
    if (mentionedProjects.length > 0) {
        scopedItems = items.filter(item => {
            return mentionedProjects.some(proj => {
                if (proj === 'HR') {
                    return item.deptId === 'HR';
                }
                return item.path.includes(proj) || item.tags?.includes(proj);
            });
        });
    }
    
    let filteredItems = scopedItems;
    
    // 根據關鍵字篩選
    if (/合約/.test(q)) {
        filteredItems = scopedItems.filter(i => i.tags?.includes('合約'));
    } else if (/提案|簡報/.test(q)) {
        filteredItems = scopedItems.filter(i => i.tags?.includes('提案') || i.fileKind === 'pptx');
    } else if (/帳務|財務|預算/.test(q)) {
        filteredItems = scopedItems.filter(i => i.tags?.includes('帳務') || i.fileKind === 'xlsx');
    }
    
    // 依權限過濾
    const { accessible, restricted } = filterByPermission(filteredItems);
    const permissionNotice = generatePermissionNotice(restricted);
    
    // 如果完全沒有可存取的檔案
    if (accessible.length === 0 && restricted.length > 0) {
        return `
            <p>根據您的問題，找到了 ${restricted.length} 個相關檔案，但您沒有存取權限。</p>
            ${permissionNotice}
        `;
    }
    
    // 限制顯示數量
    const displayItems = accessible.slice(0, 8);
    
    let tableRows = displayItems.map(item => `
        <tr>
            <td><i class="fa-solid ${getFileIconForAi(item.fileKind)}"></i> ${item.name}</td>
            <td>${item.path}</td>
            <td>${item.tags?.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join(' ') || '-'}</td>
            <td>${item.updatedAt || '-'}</td>
        </tr>
    `).join('');
    
    return `
        <p>根據您的問題，找到 ${accessible.length} 個您有權限存取的相關檔案：</p>
        ${permissionNotice}
        <div class="ai-table-wrapper">
            <table class="ai-compare-table">
                <thead>
                    <tr>
                        <th>檔案名稱</th>
                        <th>位置</th>
                        <th>標籤</th>
                        <th>更新日期</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
        ${accessible.length > 8 ? `<p class="ai-hint">⋯ 還有 ${accessible.length - 8} 個檔案，請縮小搜尋範圍以獲得更精確的結果</p>` : ''}
    `;
}

/**
 * 產生一般回應
 * @param {string} question - 使用者問題
 * @param {Array} mentionedProjects - 問題中提到的專案
 */
function generateGeneralResponse(question, mentionedProjects = []) {
    const items = window.__kmData.indexItems.filter(i => i.type === 'file');
    const q = question.toLowerCase();
    
    // 如果有指定專案，先篩選該專案的檔案
    let scopedItems = items;
    if (mentionedProjects.length > 0) {
        scopedItems = items.filter(item => {
            return mentionedProjects.some(proj => {
                if (proj === 'HR') {
                    return item.deptId === 'HR';
                }
                return item.path.includes(proj) || item.tags?.includes(proj);
            });
        });
    }
    
    // 根據問題關鍵字搜尋相關檔案
    let relatedItems = scopedItems.filter(item => {
        const searchText = `${item.name} ${item.tags?.join(' ') || ''} ${item.path}`.toLowerCase();
        const keywords = q.split(/\s+/).filter(k => k.length > 1);
        return keywords.some(kw => searchText.includes(kw)) || 
               item.tags?.some(tag => q.includes(tag.toLowerCase()));
    });
    
    // 如果沒找到，預設顯示 HR 文件或指定專案的檔案
    if (relatedItems.length === 0) {
        if (mentionedProjects.length > 0) {
            relatedItems = scopedItems.slice(0, 3);
        } else {
            relatedItems = items.filter(i => i.deptId === 'HR').slice(0, 3);
        }
    }
    
    // 依權限過濾
    const { accessible, restricted } = filterByPermission(relatedItems);
    const permissionNotice = generatePermissionNotice(restricted);
    
    // 如果完全沒有可存取的檔案
    if (accessible.length === 0) {
        if (restricted.length > 0) {
            return `
                <p>根據您的問題「${escapeHtml(question)}」，找到了相關文件但您沒有存取權限。</p>
                ${permissionNotice}
                <p class="ai-hint">💡 提示：請向檔案擁有者或管理員申請權限後再試一次</p>
            `;
        } else {
            return `
                <p>根據您的問題「${escapeHtml(question)}」，未找到相關文件。</p>
                <p class="ai-hint">💡 提示：請嘗試使用不同的關鍵字，或確認搜尋範圍設定</p>
            `;
        }
    }
    
    // 如果涉及多個專案且檔案有詳細內容，產生詳細比較表格
    if (mentionedProjects.length >= 2 && accessible.length >= 2) {
        return generateDetailedCompareResponse(accessible, mentionedProjects, question, permissionNotice);
    }
    
    // 產生檔案列表
    const fileList = accessible.slice(0, 5).map(item => 
        `<p>📄 <strong>${item.name}</strong> - ${item.tags?.slice(0, 2).join('、') || item.path}</p>`
    ).join('');
    
    const sources = accessible.map(i => i.path).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
    
    return `
        <p>根據您的問題「${escapeHtml(question)}」，我找到了以下相關資訊：</p>
        ${permissionNotice}
        ${fileList}
        <p class="ai-source">📂 來源：${sources.join('、')}</p>
        <p class="ai-hint">💡 提示：若需比較多個文件的差異，請在問題中使用「比較」、「差異」等關鍵字</p>
    `;
}

/**
 * 產生詳細的多專案比較回應
 * @param {Array} files - 相關檔案
 * @param {Array} mentionedProjects - 提到的專案
 * @param {string} question - 使用者問題
 * @param {string} permissionNotice - 權限提示
 */
function generateDetailedCompareResponse(files, mentionedProjects, question, permissionNotice) {
    const fileContents = window.__kmFileContents || {};
    
    // 篩選有詳細內容的檔案
    const filesWithContent = files.filter(f => fileContents[f.id]);
    
    if (filesWithContent.length < 2) {
        // 如果沒有足夠的詳細內容，使用預設比較
        const projectDesc = mentionedProjects.join('、');
        const headers = files.slice(0, 4).map(f => `<th>${f.name.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '')}</th>`).join('');
        
        // 收集所有可能的比較項目
        const allSections = new Set();
        files.slice(0, 4).forEach(f => {
            const content = fileContents[f.id];
            if (content && content.sections) {
                Object.keys(content.sections).forEach(key => allSections.add(key));
            }
        });
        
        // 如果有部分內容，使用那些內容
        if (allSections.size > 0) {
            const sectionRows = Array.from(allSections).map(section => {
                const cells = files.slice(0, 4).map(f => {
                    const content = fileContents[f.id];
                    return `<td>${content?.sections?.[section] || '-'}</td>`;
                }).join('');
                return `<tr><td><strong>${section}</strong></td>${cells}</tr>`;
            }).join('');
            
            return `
                <p>根據您的問題「${escapeHtml(question)}」，我比較了 ${projectDesc} 的相關文件（共 ${files.length} 份），以下是詳細內容：</p>
                ${permissionNotice}
                <div class="ai-table-wrapper">
                    <table class="ai-compare-table">
                        <thead>
                            <tr>
                                <th>比較項目</th>
                                ${headers}
                            </tr>
                        </thead>
                        <tbody>
                            ${sectionRows}
                        </tbody>
                    </table>
                </div>
                <p class="ai-source">📂 來源：${files.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
            `;
        }
        
        // 完全沒有內容時的預設回應
        return `
            <p>根據您的問題「${escapeHtml(question)}」，我找到了 ${projectDesc} 的相關文件：</p>
            ${permissionNotice}
            ${files.slice(0, 5).map(f => `<p>📄 <strong>${f.name}</strong> - ${f.tags?.slice(0, 2).join('、') || f.path}</p>`).join('')}
            <p class="ai-source">📂 來源：${files.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
        `;
    }
    
    // 有足夠的詳細內容，產生完整比較表格
    const projectDesc = mentionedProjects.join('、');
    const displayFiles = filesWithContent.slice(0, 4);
    const headers = displayFiles.map(f => {
        const content = fileContents[f.id];
        const title = content?.title || f.name.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '');
        const canDownload = f.actionsAllowed?.includes('download');
        const downloadBtn = canDownload 
            ? `<button class="ai-download-btn" onclick="downloadKmFile('${f.id}', '${f.name}')" title="下載檔案"><i class="fa-solid fa-download"></i></button>`
            : '';
        return `<th><span class="th-content">${title}</span>${downloadBtn}</th>`;
    }).join('');
    
    // 收集所有比較項目
    const allSections = new Set();
    displayFiles.forEach(f => {
        const content = fileContents[f.id];
        if (content?.sections) {
            Object.keys(content.sections).forEach(key => allSections.add(key));
        }
    });
    
    // 產生表格行
    const sectionRows = Array.from(allSections).map(section => {
        const cells = displayFiles.map(f => {
            const content = fileContents[f.id];
            const value = content?.sections?.[section] || '-';
            return `<td>${value}</td>`;
        }).join('');
        return `<tr><td><strong>${section}</strong></td>${cells}</tr>`;
    }).join('');
    
    return `
        <p>根據您的問題「${escapeHtml(question)}」，我詳細比較了 ${projectDesc} 的相關文件內容：</p>
        ${permissionNotice}
        <div class="ai-table-wrapper">
            <table class="ai-compare-table">
                <thead>
                    <tr>
                        <th>比較項目</th>
                        ${headers}
                    </tr>
                </thead>
                <tbody>
                    ${sectionRows}
                </tbody>
            </table>
        </div>
        <p class="ai-summary">
            <strong>📋 摘要分析：</strong><br>
            ${displayFiles.map(f => {
                const content = fileContents[f.id];
                const title = content?.title || f.name;
                const canDownload = f.actionsAllowed?.includes('download');
                const downloadLink = canDownload 
                    ? `<a href="javascript:void(0)" onclick="downloadKmFile('${f.id}', '${f.name}')" class="ai-file-link"><i class="fa-solid fa-${getFileIconClass(f.fileKind)}"></i> ${title}</a>`
                    : `<span class="ai-file-name"><i class="fa-solid fa-${getFileIconClass(f.fileKind)}"></i> ${title}</span>`;
                return `• ${downloadLink}：${content?.summary || '詳見文件內容'}`;
            }).join('<br>')}
        </p>
        <p class="ai-source">📂 來源：${displayFiles.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
    `;
}

/**
 * 模擬下載 KM 檔案
 * @param {string} fileId - 檔案 ID
 * @param {string} fileName - 檔案名稱
 */
function downloadKmFile(fileId, fileName) {
    // 在實際應用中，這裡會呼叫後端 API 下載檔案
    // 目前為模擬行為
    
    // 顯示下載提示
    const toast = document.createElement('div');
    toast.className = 'km-download-toast';
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>檔案「${fileName}」已開始下載</span>
    `;
    document.body.appendChild(toast);
    
    // 動畫效果
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // 模擬下載（實際專案中會產生真實檔案）
    console.log(`[KM] 下載檔案: ${fileId} - ${fileName}`);
    
    // 模擬建立下載連結（實際專案會改為後端 API）
    // 這裡用一個簡單的文字檔作為示範
    const mockContent = `這是 ${fileName} 的模擬內容\n\n在實際專案中，此處會下載真實的檔案。`;
    const blob = new Blob([mockContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '.txt'); // 模擬用 txt
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * 取得檔案圖示類別（不含 fa-file- 前綴）
 * @param {string} fileKind - 檔案類型
 * @returns {string} 圖示名稱
 */
function getFileIconClass(fileKind) {
    switch (fileKind) {
        case 'pdf': return 'file-pdf';
        case 'doc':
        case 'docx': return 'file-word';
        case 'xls':
        case 'xlsx': return 'file-excel';
        case 'ppt':
        case 'pptx': return 'file-powerpoint';
        default: return 'file';
    }
}

/**
 * 取得 AI 回應用的檔案圖示
 */
function getFileIconForAi(fileKind) {
    switch (fileKind) {
        case 'pdf': return 'fa-file-pdf pdf-icon';
        case 'doc':
        case 'docx': return 'fa-file-word doc-icon';
        case 'xls':
        case 'xlsx': return 'fa-file-excel xls-icon';
        case 'ppt':
        case 'pptx': return 'fa-file-powerpoint ppt-icon';
        default: return 'fa-file';
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

/**
 * 更新已選檔案數量
 */
function updateSelectedFiles() {
    const count = document.querySelectorAll('#summaryFileList input:checked').length;
    document.getElementById('selectedFilesCount').textContent = count;
    document.getElementById('runSummaryBtn').disabled = count === 0;
}

/**
 * 篩選摘要檔案
 */
function filterSummaryFiles() {
    const filter = document.getElementById('summaryProjectFilter').value;
    const items = document.querySelectorAll('#summaryFileList .file-item');
    
    items.forEach(item => {
        const dept = item.querySelector('small').textContent;
        if (filter === 'all' || dept === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * 執行摘要分析
 */
function runSummaryAnalysis() {
    const mode = document.querySelector('input[name="analysisMode"]:checked')?.value;
    const prompt = document.getElementById('summaryPrompt')?.value || '';
    const selectedFiles = Array.from(document.querySelectorAll('#summaryFileList input:checked')).map(cb => cb.value);
    
    if (selectedFiles.length === 0) {
        alert('請至少選擇一個檔案');
        return;
    }
    
    // 顯示結果區
    const resultDiv = document.getElementById('summaryResult');
    const contentDiv = document.getElementById('summaryResultContent');
    const sourcesDiv = document.getElementById('summarySources');
    
    // 模擬分析結果
    let resultHtml = '';
    let modeText = '';
    
    switch (mode) {
        case 'single':
            modeText = '單檔摘要';
            resultHtml = `
                <h5>差旅報銷規範.pdf 摘要</h5>
                <p>本文件規定了公司員工差旅報銷的標準程序，包括：</p>
                <ul>
                    <li>差旅申請流程與審批權限</li>
                    <li>各類費用報銷標準（交通、住宿、餐飲）</li>
                    <li>報銷單據要求與時限</li>
                </ul>
            `;
            break;
        case 'merge':
            modeText = '合併摘要';
            resultHtml = `
                <p>根據所選的 ${selectedFiles.length} 個檔案，AI 整理出以下重點：</p>
                <ol>
                    <li><strong>差旅相關</strong>：差旅報銷需在返回後 7 個工作日內提交</li>
                    <li><strong>請假制度</strong>：年假需提前 3 天申請，病假需附醫院證明</li>
                    <li><strong>共同規範</strong>：所有申請需經直屬主管審核後提交 HR</li>
                </ol>
            `;
            break;
        case 'compare':
            modeText = '比較分析';
            resultHtml = `
                <h5>文件比較分析結果</h5>
                <table class="km-table">
                    <thead><tr><th>項目</th><th>差旅報銷</th><th>請假制度</th></tr></thead>
                    <tbody>
                        <tr><td>申請時限</td><td>事後 7 天內</td><td>事前 3 天</td></tr>
                        <tr><td>審批層級</td><td>部門主管 → 財務</td><td>部門主管 → HR</td></tr>
                        <tr><td>所需文件</td><td>發票、行程單</td><td>請假單、證明</td></tr>
                    </tbody>
                </table>
            `;
            break;
        case 'timeline':
            modeText = '時間軸整理';
            resultHtml = `
                <div class="timeline">
                    <p><strong>2025-11-01</strong> - 差旅報銷規範更新（新版）</p>
                    <p><strong>2025-10-25</strong> - 請假制度文件更新</p>
                    <p><strong>2025-10-01</strong> - HR 政策季度審查</p>
                </div>
            `;
            break;
    }
    
    if (prompt) {
        resultHtml += `<hr><p><em>針對您的問題「${escapeHtml(prompt)}」：</em></p><p>根據分析，這些專案主要針對內部行政流程的規範化進行了改進。</p>`;
    }
    
    contentDiv.innerHTML = resultHtml;
    sourcesDiv.innerHTML = selectedFiles.map(id => {
        const item = window.__kmData.indexItems.find(i => i.id === id);
        return item ? `<span class="tag">${item.name}</span>` : '';
    }).join(' ');
    
    resultDiv.style.display = 'block';
}

/**
 * 取得標籤建議
 */
function getTagSuggestions() {
    const fileId = document.getElementById('tagTargetFile').value;
    if (!fileId) {
        alert('請先選擇一個檔案');
        return;
    }
    
    const item = window.__kmData.indexItems.find(i => i.id === fileId);
    const suggestedDiv = document.getElementById('suggestedTags');
    const tagList = document.getElementById('suggestedTagList');
    
    // 模擬 AI 建議標籤
    const suggestions = ['差旅', '報銷', '財務', 'SOP', '政策', '2025'];
    
    tagList.innerHTML = suggestions.map(tag => `
        <span class="tag-suggest" onclick="this.classList.toggle('selected')">${tag}</span>
    `).join('');
    
    suggestedDiv.style.display = 'block';
}

/**
 * 套用選取的標籤
 */
function applySelectedTags() {
    const selected = Array.from(document.querySelectorAll('.tag-suggest.selected')).map(el => el.textContent);
    if (selected.length === 0) {
        alert('請先點選要套用的標籤');
        return;
    }
    alert('已套用標籤：' + selected.join(', '));
    document.getElementById('suggestedTags').style.display = 'none';
}

/**
 * 重新整理標籤建議
 */
function refreshTagSuggestions() {
    document.getElementById('suggestedTags').style.display = 'none';
    document.getElementById('tagTargetFile').value = '';
}

/**
 * 取得分類建議
 */
function getClassifySuggestion() {
    const fileId = document.getElementById('classifyTargetFile').value;
    if (!fileId) {
        alert('請先選擇一個檔案');
        return;
    }
    
    const resultDiv = document.getElementById('classifyResult');
    document.getElementById('currentLocation').textContent = 'HR/FAQ';
    document.getElementById('suggestedLocation').textContent = 'HR/SOP';
    document.getElementById('classifyConfidence').textContent = '信心度: 85%';
    document.getElementById('classifyReason').textContent = '此文件包含標準作業程序相關內容，更適合放在 SOP 資料夾。';
    
    resultDiv.style.display = 'block';
}

/**
 * 移動到建議資料夾
 */
function moveToSuggestedFolder() {
    const suggested = document.getElementById('suggestedLocation').textContent;
    alert('已將檔案移動到：' + suggested);
    document.getElementById('classifyResult').style.display = 'none';
}

/**
 * 尋找相似檔案
 */
function findSimilarFiles() {
    const fileId = document.getElementById('similarTargetFile').value;
    if (!fileId) {
        alert('請先選擇一個檔案');
        return;
    }
    
    const resultDiv = document.getElementById('similarResult');
    const tbody = document.getElementById('similarFilesBody');
    
    // 模擬相似檔案結果
    tbody.innerHTML = `
        <tr>
            <td><i class="fa-solid fa-file-word doc-icon"></i> 請假制度.docx</td>
            <td><span class="tag">78%</span></td>
            <td>HR/FAQ</td>
            <td><span class="tag">制度</span></td>
            <td><button class="btn ghost small"><i class="fa-solid fa-eye"></i></button></td>
        </tr>
        <tr>
            <td><i class="fa-solid fa-file-pdf pdf-icon"></i> 新人報到SOP.docx</td>
            <td><span class="tag">65%</span></td>
            <td>HR/SOP</td>
            <td><span class="tag">SOP</span></td>
            <td><button class="btn ghost small"><i class="fa-solid fa-eye"></i></button></td>
        </tr>
    `;
    
    resultDiv.style.display = 'block';
}
/**
 * 切換知識圖譜的資料夾列表顯示/隱藏
 */
function toggleGraphFolderList() {
    const folderList = document.getElementById('graphFolderList');
    const selectedValue = document.querySelector('input[name="graphScope"]:checked').value;
    
    if (selectedValue === 'folder') {
        folderList.style.display = 'block';
    } else {
        folderList.style.display = 'none';
    }
}

/**
 * 產生知識圖譜
 */
function generateKnowledgeGraph() {
    const scope = document.querySelector('input[name="graphScope"]:checked').value;
    const graphDisplay = document.getElementById('graphDisplay');
    
    // 模擬 AI 分析過程
    graphDisplay.innerHTML = `
        <div class="graph-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>AI 正在分析文件關聯性...</p>
        </div>
    `;
    
    setTimeout(() => {
        let selectedFolders = [];
        if (scope === 'folder') {
            const checkboxes = document.querySelectorAll('#graphFolderList input[type="checkbox"]:checked');
            selectedFolders = Array.from(checkboxes).map(cb => cb.value);
            
            if (selectedFolders.length === 0) {
                alert('請至少選擇一個資料夾');
                graphDisplay.innerHTML = `
                    <div class="graph-placeholder">
                        <i class="fa-solid fa-diagram-project"></i>
                        <p>選擇範圍後點擊「產生圖譜」開始分析</p>
                        <p class="hint">AI 將分析文件間的關聯性，建立知識地圖</p>
                    </div>
                `;
                return;
            }
        }
        
        // 顯示模擬的知識圖譜結果
        graphDisplay.innerHTML = `
            <div class="graph-result">
                <div class="graph-header">
                    <h4><i class="fa-solid fa-diagram-project"></i> 知識圖譜分析結果</h4>
                    <div class="graph-stats">
                        <span class="stat-item"><i class="fa-solid fa-file"></i> 文件數：${scope === 'all' ? '156' : selectedFolders.length * 12}</span>
                        <span class="stat-item"><i class="fa-solid fa-link"></i> 關聯數：${scope === 'all' ? '324' : selectedFolders.length * 28}</span>
                        <span class="stat-item"><i class="fa-solid fa-tags"></i> 主題群：${scope === 'all' ? '8' : selectedFolders.length * 2}</span>
                    </div>
                </div>
                
                <div class="graph-canvas">
                    <svg width="100%" height="500" style="background:#f5f5f5;">
                        <!-- 中心節點 -->
                        <circle cx="400" cy="250" r="60" fill="#4285f4" stroke="#fff" stroke-width="3"/>
                        <text x="400" y="255" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">HR 政策</text>
                        
                        <!-- 周圍節點 -->
                        <circle cx="250" cy="150" r="40" fill="#34a853" stroke="#fff" stroke-width="2"/>
                        <text x="250" y="155" text-anchor="middle" fill="#fff" font-size="12">請假制度</text>
                        <line x1="250" y1="150" x2="400" y2="250" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="550" cy="150" r="40" fill="#34a853" stroke="#fff" stroke-width="2"/>
                        <text x="550" y="155" text-anchor="middle" fill="#fff" font-size="12">考勤規範</text>
                        <line x1="550" y1="150" x2="400" y2="250" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="250" cy="350" r="40" fill="#fbbc04" stroke="#fff" stroke-width="2"/>
                        <text x="250" y="355" text-anchor="middle" fill="#fff" font-size="12">福利說明</text>
                        <line x1="250" y1="350" x2="400" y2="250" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="550" cy="350" r="40" fill="#fbbc04" stroke="#fff" stroke-width="2"/>
                        <text x="550" y="355" text-anchor="middle" fill="#fff" font-size="12">獎懲辦法</text>
                        <line x1="550" y1="350" x2="400" y2="250" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="150" cy="250" r="35" fill="#ea4335" stroke="#fff" stroke-width="2"/>
                        <text x="150" y="255" text-anchor="middle" fill="#fff" font-size="11">SOP</text>
                        <line x1="150" y1="250" x2="400" y2="250" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="650" cy="250" r="35" fill="#ea4335" stroke="#fff" stroke-width="2"/>
                        <text x="650" y="255" text-anchor="middle" fill="#fff" font-size="11">FAQ</text>
                        <line x1="650" y1="250" x2="400" y2="250" stroke="#999" stroke-width="2"/>
                    </svg>
                </div>
                
                <div class="graph-insights">
                    <h5><i class="fa-solid fa-lightbulb"></i> AI 洞察</h5>
                    <ul class="insight-list">
                        <li><strong>核心主題：</strong>HR 政策是文件庫的核心，與 87% 的文件有關聯</li>
                        <li><strong>熱門標籤：</strong>「制度」、「SOP」、「FAQ」出現頻率最高</li>
                        <li><strong>孤島文件：</strong>發現 3 份文件缺乏關聯，建議補充標籤或調整分類</li>
                        <li><strong>建議：</strong>「請假制度」與「考勤規範」內容重疊度達 65%，建議整併</li>
                    </ul>
                </div>
                
                <div class="graph-legend">
                    <span class="legend-item"><span class="legend-color" style="background:#4285f4;"></span> 核心文件</span>
                    <span class="legend-item"><span class="legend-color" style="background:#34a853;"></span> 政策制度</span>
                    <span class="legend-item"><span class="legend-color" style="background:#fbbc04;"></span> 說明文件</span>
                    <span class="legend-item"><span class="legend-color" style="background:#ea4335;"></span> 操作指引</span>
                </div>
            </div>
        `;
    }, 2000);
}

/**
 * 清除知識圖譜
 */
function clearKnowledgeGraph() {
    // 清除所有選取的資料夾
    const checkboxes = document.querySelectorAll('#graphFolderList input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // 重設為全部文件
    document.querySelector('input[name="graphScope"][value="all"]').checked = true;
    
    // 隱藏資料夾列表
    document.getElementById('graphFolderList').style.display = 'none';
    
    // 重設圖譜顯示區
    const graphDisplay = document.getElementById('graphDisplay');
    graphDisplay.innerHTML = `
        <div class="graph-placeholder">
            <i class="fa-solid fa-diagram-project"></i>
            <p>選擇範圍後點擊「產生圖譜」開始分析</p>
            <p class="hint">AI 將分析文件間的關聯性，建立知識地圖</p>
        </div>
    `;
}