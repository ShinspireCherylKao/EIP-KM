# 文件庫管理系統 - 前後台連動說明

## 📋 概述

本系統實現了前台（用戶介面）和後台（管理介面）的文件庫管理資料連動功能。

## 🔗 連動架構

```
前台 (前台/index.html)
    ↓ 讀取
共享資料層 (shared/km-data.js)
    ↑ 更新
後台 (後台管理/index.html)
```

## 📊 共享資料內容

### 1. 部門與權限設定
- **departments**: 部門列表 (HR、管理部、行政部)
- **permissionLevels**: 權限等級定義
- **folderPermissions**: 資料夾權限矩陣

### 2. 檔案標籤系統
- **tags**: 標籤列表（8個預設標籤）
  - 包含：ID、名稱、顏色、部門、關聯檔案數

### 3. 檔案操作記錄
- **fileRecords**: 操作記錄列表（8筆範例）
  - 包含：時間戳記、操作者、部門、動作類型、檔案名稱、IP位址
  - 支援警示標記（跨部門存取）

### 4. 大型檔案列表
- **largeFiles**: 大型影片檔案列表（7個檔案）
  - 用於篩選搜尋功能
  - 包含：檔名、大小、擁有者、修改日期、路徑

## 🛠️ 工具函數

### checkPermission(folderName, department, requiredLevel)
檢查特定部門是否有權限存取資料夾

### addRecord(record)
新增操作記錄並觸發更新事件

### updateFolderPermission(folderName, department, permission)
更新資料夾權限並觸發更新事件

### addTag(tag) / deleteTag(tagId) / mergeTags(tagIds, newTagName, newColor)
標籤管理功能

### filterLargeFiles(options)
根據條件篩選大型檔案

## 🔄 連動機制

### 後台 → 前台 資料流

1. **權限變更**
   ```javascript
   // 後台執行
   window.__sharedKmData.utils.updateFolderPermission('公司規章', 'HR', 'control');
   
   // 觸發事件
   window.dispatchEvent(new CustomEvent('kmDataUpdated', { 
       detail: { type: 'permission', action: 'update', data: {...} } 
   }));
   
   // 前台自動接收並更新顯示
   ```

2. **標籤管理**
   ```javascript
   // 後台新增標籤
   window.__sharedKmData.utils.addTag({
       name: '重要文件',
       color: 'red',
       department: 'HR'
   });
   
   // 前台標籤選單自動更新
   ```

3. **操作記錄**
   ```javascript
   // 前台操作自動記錄
   window.__sharedKmData.utils.addRecord({
       operator: '王小明',
       department: 'HR',
       action: 'download',
       fileName: '薪資表.xlsx',
       filePath: '/HR/財務/',
       ip: '192.168.1.105'
   });
   
   // 後台記錄管理即時顯示
   ```

## 📖 使用範例

### 範例 1：修改權限
```javascript
// 在後台管理介面
// 1. 選擇「瀏覽權限管理」
// 2. 修改「公司規章」的 HR 權限為「完全控制」
// 3. 點擊「儲存」按鈕

// 系統會：
// - 更新 shared/km-data.js 中的 folderPermissions
// - 觸發 kmDataUpdated 事件
// - 前台自動檢查新權限，更新可見內容
```

### 範例 2：新增標籤
```javascript
// 在後台管理介面
// 1. 選擇「檔案標籤設定」
// 2. 輸入標籤名稱「緊急文件」
// 3. 選擇紅色
// 4. 選擇部門「通用」
// 5. 點擊「新增標籤」

// 系統會：
// - 在 shared/km-data.js 新增標籤
// - 前台標籤列表自動更新
// - 可立即在前台使用新標籤
```

### 範例 3：查看操作記錄
```javascript
// 在前台下載檔案時
// 系統自動記錄：
// - 操作者：當前登入用戶
// - 動作：download
// - 時間：當前時間戳記
// - IP：用戶 IP

// 後台管理員可以在「檔案紀錄管理」看到：
// - 即時操作記錄
// - 跨部門存取警示
// - 可篩選、匯出報表
```

## ⚠️ 跨部門存取警示

系統會自動偵測跨部門存取：

```javascript
// 範例：行政部員工下載 HR 專用檔案
{
    operator: '張志強',
    department: '行政部',
    action: 'download',
    fileName: '員工個資檔案_HR專用.xlsx',
    filePath: '/HR/機密/',
    isWarning: true,  // 觸發警示
    warningReason: '跨部門下載敏感檔案'
}

// 在後台記錄管理中會以紅色背景顯示
```

## 🎯 主要功能頁面

### 後台管理
1. **瀏覽權限管理** - 設定各部門對資料夾的存取權限
2. **檔案紀錄管理** - 查看所有操作記錄，含警示功能
3. **檔案標籤設定** - 新增、編輯、刪除、合併標籤
4. **篩選搜尋檔案** - 搜尋大型檔案，支援批量操作

### 前台使用
1. **近期存取** - 根據權限顯示可存取的資料夾
2. **標籤** - 使用後台設定的標籤進行分類
3. **分享中心** - 檔案分享功能
4. **我的** - 個人檔案管理
5. **AI 加值** - AI 輔助功能

## 🔧 技術實作

### 資料檔案
- `shared/km-data.js` - 共享資料中心

### 後台腳本
- `後台管理/js/km-admin-script.js` - 後台管理邏輯

### 前台腳本
- `前台/js/km-script.js` - 前台文件庫功能

### 事件系統
使用瀏覽器原生 CustomEvent 進行跨頁面通訊

```javascript
// 觸發事件
window.dispatchEvent(new CustomEvent('kmDataUpdated', { 
    detail: { type: 'permission', action: 'update', data: {...} } 
}));

// 監聽事件
window.addEventListener('kmDataUpdated', function(event) {
    // 處理更新
});
```

## 📌 注意事項

1. **瀏覽器限制**：同源政策要求前後台在同一域名下
2. **即時性**：目前資料更新需要手動刷新頁面（可後續改用 WebSocket）
3. **資料持久化**：目前資料存在記憶體中，重新整理會重置（可連接後端 API）
4. **權限檢查**：前台會根據 shared/km-data.js 中的權限設定過濾內容

## 🚀 未來擴充

1. **WebSocket 即時同步** - 無需刷新頁面即可看到更新
2. **後端 API 整合** - 將資料持久化到數據庫
3. **版本控制** - 追蹤權限變更歷史
4. **更細緻的權限** - 檔案級別的權限控制
5. **通知系統** - 權限變更時通知相關用戶

## 📞 測試方法

1. 開啟 `後台管理/index.html`
2. 開啟瀏覽器開發者工具 (F12)
3. 在 Console 中輸入：
   ```javascript
   // 查看共享資料
   console.log(window.__sharedKmData);
   
   // 測試更新權限
   window.__sharedKmData.utils.updateFolderPermission('公司規章', 'HR', 'control');
   
   // 測試新增記錄
   window.__sharedKmData.utils.addRecord({
       operator: '測試用戶',
       department: 'HR',
       action: 'view',
       fileName: '測試.pdf',
       filePath: '/test/',
       ip: '127.0.0.1'
   });
   ```

---

✅ **系統已完成前後台連動設定！**

如需進一步的功能擴充或問題排除，請參考各檔案中的程式碼註解。
