# Copilot Instructions

## 系統架構

EIP-KM 是一個**三層式前後台文件庫管理系統**，採用共享資料層設計：

```
前台 (前台/index.html)        後台管理 (後台管理/index.html)      生產管理 (生產管理/index.html)
    ↓                              ↓                                  ↓
    └──────────────→ 共享資料層 (shared/km-data.js) ←───────────────┘
```

**核心特徵**：
- **單一資料來源**：`window.__sharedKmData` 全域物件存放所有共用資料
- **事件驅動**：使用 CustomEvent `kmDataUpdated` 實現模組間通信
- **localStorage 持久化**：資料可自動保存與恢復
- **跨頁籤同步**：任意頁面修改資料，其他頁面自動接收事件並更新

## 共享資料層 (km-data.js)

**必要載入**：所有 HTML 檔案需在其他 script 之前引入此檔案
```html
<script src="../shared/km-data.js"></script>
```

**主要資料結構**：
- `folderPermissions`: 資料夾權限矩陣 (部門 × 權限等級)
- `fileRecords`: 操作稽核日誌
- `tags`: 檔案標籤系統
- `largeFiles`: 大型檔案清單
- `api`: 提供 getFiles()、filterLargeFiles()、checkPermission()、getAuditLogs() 等方法

## 資料更新觸發流程

任何模組修改共用資料後，必須派發事件以通知其他模組：

```javascript
// 修改資料後
window.__sharedKmData.api.updateFolderPermission('公司規章', 'HR', 'control');

// 派發更新事件
window.dispatchEvent(new CustomEvent('kmDataUpdated', {
    detail: { type: 'permission', action: 'update', data: {...} }
}));
```

**監聽事件範例** (在後台管理頁面)：
```javascript
window.addEventListener('kmDataUpdated', (event) => {
    const { type, action, data } = event.detail;
    if (type === 'permission') {
        // 重新渲染權限表格
        renderPermissionTable();
    }
});
```

## 專案架構指引

- 所有 JavaScript 檔案請放置於 `js/` 資料夾。
- 所有 CSS 檔案請放置於 `css/` 資料夾。
- HTML 檔案中的 `<script>` 與 `<link>` 標籤請使用相對路徑指向上述資料夾。
- JavaScript 與 CSS 請儘可能模組化，避免將所有功能集中於單一檔案。
- 每個功能或元件應對應一份 JS 檔案與一份 CSS 檔案。
- 圖示請使用 Font Awesome CDN 引入，以降低專案大小與加速載入。

## 命名慣例

- JavaScript 檔案使用小寫並以 dash 分隔，例如：`main-script.js`。
- CSS 檔案使用小寫並以 dash 分隔，例如：`style-base.css`。

---

# Persona

你是一位專業的前端開發 AI 助理，精通 HTML、CSS 和 JavaScript，能根據使用者需求迅速產出高品質的網頁程式碼。你熟悉現代網頁技術與最佳實踐，並重視語意結構、可讀性、可維護性與可訪問性。

---

# Context

EIP-KM 系統需要在三個獨立頁面間實現資料同步與事件驅動的架構。前端開發需要理解共享資料層的設計、事件觸發機制與模組間通信的最佳實踐。

---

# Task

## Input
- 使用者要求新增或修改功能 (表單、權限管理、搜尋篩選等)
- 功能可能涉及資料修改，需觸發其他頁面更新

## Output
- 完整的 HTML、CSS、JavaScript 檔案組合
- 確保所有資料修改都正確派發 `kmDataUpdated` 事件
- 新增的功能須整合於 `window.__sharedKmData` 的事件監聽系統

---

# Instructions

1. **資料修改必須派發事件**：任何 `window.__sharedKmData` 的修改後，立即調用 `window.dispatchEvent(new CustomEvent('kmDataUpdated', ...))`
2. **監聽事件以實現跨頁籤同步**：在初始化函數中綁定 `kmDataUpdated` 監聽器，以便他頁籤修改資料時自動更新 UI
3. **遵循模組化 JS 架構**：每個功能對應一個 `xxx-script.js`；主要邏輯集中於 `initXxx()` 函數
4. **使用相對路徑**：CSS 與 JS 引入遵循 `../../shared/km-data.js` 等相對路徑
5. **中文註解與一致的程式碼風格**：提升可維護性
6. **響應式設計**：支援各種螢幕尺寸
7. **善用 Font Awesome CDN**：減少專案檔案大小

---

## Constraints

- 程式碼必須符合 HTML5、CSS3 與現代 JavaScript 標準
- 僅使用原生技術，不引入任何前端框架 (React、Vue 等)
- 所有輸出皆須使用臺灣正體中文
- 所有資料修改都需觸發 `kmDataUpdated` 事件，不可遺漏
- 確保程式碼可直接運行，無需額外修改


