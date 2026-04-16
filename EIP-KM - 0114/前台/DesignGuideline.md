# KM 前台 — RWD 設計規範 (Design Guideline)

> **版本**：1.0 | **建立日期**：2026-04-13  
> **適用範圍**：`前台/` 下所有 HTML 頁面  
> **Token 來源**：`css/style-base.css` `:root` 區塊

---

## 1. 斷點系統

| 級別 | 名稱 | max-width | 語意 | Sidebar 狀態 |
|------|------|-----------|------|-------------|
| L | Desktop | — (>1200px) | 寬螢幕，最多三欄 | 完整展開 |
| M | Tablet | 960px | 平板橫向，雙欄→單欄 | 收合（icon-only） |
| S | Mobile | 768px | 手機直向，全面堆疊 | 隱藏（hamburger 開關） |
| XS | Small | 480px | 小手機，極簡模式 | 隱藏 |

### 規則
- **@media 統一語法**：`@media (max-width: Npx)` — 不加 `screen and` 前綴
- **禁止自訂斷點**：不得使用 900px / 500px / 640px / 1024px 等非標準值
- **由大到小排列**：同一 CSS 檔案中 @media 區塊按 960 → 768 → 480 降序排列

---

## 2. 響應式字級

所有字級使用 CSS 變數，**禁止在元件中寫死 px 值**。

| Token | Desktop | ≤960px | ≤768px | ≤480px | 用途 |
|-------|---------|--------|--------|--------|------|
| `--font-page-title` | 26px | 24px | 20px | 18px | 頁面大標題 (h1) |
| `--font-section-title` | 20px | 18px | 17px | 16px | 區塊標題 (h2) |
| `--font-card-title` | 16px | 16px | 15px | 14px | 卡片/項目標題 |
| `--font-body` | 15px | 15px | 14px | 14px | 正文內容 |
| `--font-body-small` | 14px | 14px | 14px | 14px | 正文（緊湊場景） |
| `--font-label` | 13px | 13px | 12px | 12px | 標籤 / Badge / Meta |
| `--font-caption` | 12px | 12px | 12px | 11px | 說明文字 / 時間戳 |

### 使用方式
```css
/* ✅ 正確 */
.page-title { font-size: var(--font-page-title); }

/* ❌ 禁止 */
.page-title { font-size: 26px; }
@media (max-width: 768px) { .page-title { font-size: 20px; } }
```

---

## 3. 響應式間距

| Token | Desktop | ≤960px | ≤768px | ≤480px | 用途 |
|-------|---------|--------|--------|--------|------|
| `--spacing-page` | 32px | 24px | 16px | 12px | 頁面級 padding |
| `--spacing-section` | 24px | 20px | 16px | 12px | 區塊 padding / gap |
| `--spacing-card` | 20px | 18px | 14px | 12px | 卡片內 padding |
| `--spacing-element` | 16px | 16px | 12px | 10px | 元素間 gap |
| `--spacing-compact` | 12px | 12px | 10px | 8px | 緊湊 gap |

### 使用方式
```css
/* ✅ 正確 */
.editor-body { padding: var(--spacing-page); gap: var(--spacing-section); }

/* ❌ 禁止 — 不需要自己寫 @media 覆蓋間距 */
.editor-body { padding: 32px; }
@media (max-width: 768px) { .editor-body { padding: 16px; } }
```

---

## 4. 佈局規則

### 4.1 Sidebar

| 螢幕 | 行為 | CSS |
|------|------|-----|
| >960px | 完整展開 `200px`，顯示圖示+文字 | 預設 |
| ≤960px | 收合 `60px`，僅圖示，`main-content` margin 跟隨 | `style-sidebar.css` + `style-base.css` |
| ≤768px | 隱藏，hamburger 點擊加 `.mobile-open` 展開為 overlay | `style-sidebar.css` + `style-base.css` |

### 4.2 網格欄數

| 螢幕 | 最大欄數 | 說明 |
|------|---------|------|
| >1200px | 3 欄 | Dashboard、知識卡片 |
| 961-1200px | 2 欄 | 收縮佈局 |
| ≤960px | 1 欄 | 全部單欄堆疊 |

### 4.3 水平排列 → 垂直堆疊

≤768px 時，以下元件一律改為 `flex-direction: column`：
- 導覽列 (`.km-nav`)
- 篩選列 (`.filter-bar`)
- 表單雙欄 (`.form-row`)
- 頁尾按鈕列 (`.editor-footer`)

---

## 5. 觸控友善規範

| 規則 | 值 | 說明 |
|------|----|------|
| 最小觸控目標 | `44px × 44px` | 符合 Apple HIG / WCAG 2.1 SC 2.5.5 |
| Token | `var(--touch-target-min)` | 用於 `min-height` / `min-width` |
| 適用對象 | 按鈕、連結、icon button、下拉選單、checkbox/radio | — |
| 間距保護 | 相鄰觸控目標至少間隔 `8px` | 防止誤觸 |

### ≤768px 手機版強制規則
- 所有 `<button>` / `<a>` 互動元素：`min-height: var(--touch-target-min)`
- Toolbar icon buttons：最小 `36px × 36px`（考慮密集排列可接受 36px，但建議 44px）
- 操作按鈕（發佈、儲存等）：`width: 100%` 全寬
- Hover-only 的操作按鈕：手機版改為 `opacity: 1` 常駐可見

---

## 6. 組件 RWD 規格

### 6.1 卡片 (Card)
| 屬性 | Desktop | ≤768px |
|------|---------|--------|
| padding | `var(--spacing-card)` (20px) | 自動縮至 14px |
| 標題字級 | `var(--font-card-title)` | 自動縮至 15px |
| 圓角 | `var(--radius)` (12px) | 不變 |
| 陰影 | `var(--shadow)` | 不變 |

### 6.2 表單 (Form)
| 屬性 | Desktop | ≤768px |
|------|---------|--------|
| input padding | `10px 14px` | `10px 12px` |
| input font-size | `var(--font-body)` | 自動縮至 14px |
| label font-size | `var(--font-card-title)` | 自動縮至 15px |
| 雙欄 `.form-row` | `grid: 1fr 1fr` | `grid: 1fr`（單欄） |

### 6.3 表格 (Table)
| 屬性 | Desktop | ≤768px |
|------|---------|--------|
| font-size | `14px` | `13px` |
| cell padding | `10px 12px` | `8px 10px` |
| 長欄位 | 正常顯示 | `display: none` 或 水平捲動 |

### 6.4 富文字編輯器
| 屬性 | Desktop | ≤768px | ≤480px |
|------|---------|--------|--------|
| toolbar button | `34px` | `32px` | `28px` |
| 內容區 min-height | `320px` | `260px` | `180px` |
| 內容字級 | `16px` | `15px` | `14px` |

---

## 7. 禁止事項

| ❌ 禁止 | ✅ 替代做法 |
|---------|------------|
| 在元件 CSS 寫死字級 px 值 | 使用 `var(--font-*)` token |
| 在元件 CSS 自訂斷點 (900px, 640px...) | 只用 960 / 768 / 480 三個斷點 |
| 在 HTML inline `<style>` 寫 @media | 移至對應的 CSS 檔案 |
| `!important` 覆蓋 RWD 規則 | 提高選擇器優先權或調整結構 |
| 觸控目標小於 36px | 使用 `min-height: var(--touch-target-min)` |

---

## 8. 新頁面 Checklist

建立新頁面時，逐項確認：

- [ ] 引用 `style-base.css`（自動獲得所有 token）
- [ ] 標題使用 `var(--font-page-title)` / `var(--font-section-title)`
- [ ] 間距使用 `var(--spacing-*)` 系列
- [ ] 僅使用 960 / 768 / 480 三個斷點
- [ ] ≤768px 時所有水平排列改為垂直堆疊
- [ ] ≤768px 時操作按鈕全寬
- [ ] 觸控目標 ≥ 44px
- [ ] 不在 HTML 中寫 inline `<style>` 的 @media
