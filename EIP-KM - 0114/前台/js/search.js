/**
 * search.js
 * 全站搜尋功能
 * 依 SPEC 1.6 實作：
 *   - 全站搜尋納入文件庫模組的資料夾名稱、檔案名稱、標籤、檔案內容
 *   - 搜尋結果依權限過濾，使用者僅能看到有權限的項目
 *   - 搜尋結果依類型分區顯示（方案 A 智慧分類）
 */

(function () {
    'use strict';

    const CURRENT_USER_DEPT = 'HR';
    const MAX_SUGGESTIONS = 8;
    const DEBOUNCE_MS = 250;

    // ==================== 工具 ====================

    /** 取得 fileDatabase（來自 localStorage） */
    function getFileDB() {
        try {
            return JSON.parse(localStorage.getItem('fileDatabase') || '{}');
        } catch { return {}; }
    }

    /** 判斷使用者是否可見該項目 */
    function isVisible(permissions) {
        if (!permissions) return false;
        const perm = permissions[CURRENT_USER_DEPT];
        return perm && perm !== '不可見';
    }

    /** 取得權限等級 */
    function getPermLevel(permissions) {
        if (!permissions) return null;
        return permissions[CURRENT_USER_DEPT] || null;
    }

    /** 根據副檔名取得 icon class */
    function getSearchFileIcon(name) {
        const ext = name.split('.').pop().toLowerCase();
        const map = {
            pdf: 'fa-file-pdf',
            doc: 'fa-file-word', docx: 'fa-file-word',
            xls: 'fa-file-excel', xlsx: 'fa-file-excel',
            ppt: 'fa-file-powerpoint', pptx: 'fa-file-powerpoint',
            txt: 'fa-file-lines',
            zip: 'fa-file-zipper', rar: 'fa-file-zipper',
            png: 'fa-file-image', jpg: 'fa-file-image', jpeg: 'fa-file-image',
        };
        return 'fa-solid ' + (map[ext] || 'fa-file');
    }

    /** 根據副檔名取得 CSS class */
    function getIconClass(name) {
        const ext = name.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return 'pdf';
        if (['doc', 'docx'].includes(ext)) return 'docx';
        if (['xls', 'xlsx'].includes(ext)) return 'xlsx';
        if (['ppt', 'pptx'].includes(ext)) return 'pptx';
        return 'default';
    }

    /** 高亮文字 */
    function highlightText(text, keyword) {
        if (!keyword) return escapeHtmlStr(text);
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp('(' + escaped + ')', 'gi');
        return escapeHtmlStr(text).replace(re, '<span class="highlight">$1</span>');
    }

    /** HTML 跳脫 */
    function escapeHtmlStr(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /** Debounce */
    function debounce(fn, ms) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    // ==================== 核心搜尋 ====================

    /**
     * 執行全站搜尋
     * @param {string} keyword - 搜尋關鍵字
     * @returns {{ folders: Array, files: Array, total: number }}
     */
    function performSearch(keyword) {
        if (!keyword || !keyword.trim()) return { folders: [], files: [], total: 0 };

        const kw = keyword.trim().toLowerCase();
        const db = getFileDB();
        const folders = db.folders || [];
        const files = db.files || [];

        // 搜尋資料夾名稱
        const matchedFolders = folders.filter(f => {
            if (!isVisible(f.permissions)) return false;
            return f.name.toLowerCase().includes(kw);
        }).map(f => ({
            type: 'folder',
            name: f.name,
            displayName: f.name.split('/').pop(),
            path: f.name,
            permissions: f.permissions,
            permLevel: getPermLevel(f.permissions),
        }));

        // 搜尋檔案（名稱 + 標籤 + 資料夾路徑）
        const matchedFiles = files.filter(f => {
            if (!isVisible(f.permissions)) return false;
            const nameMatch = f.name.toLowerCase().includes(kw);
            const tagMatch = (f.tags || []).some(t => t.toLowerCase().includes(kw));
            const folderMatch = (f.folder || '').toLowerCase().includes(kw);
            return nameMatch || tagMatch || folderMatch;
        }).map(f => ({
            type: 'file',
            name: f.name,
            folder: f.folder,
            uploadDate: f.uploadDate,
            tags: f.tags || [],
            permissions: f.permissions,
            permLevel: getPermLevel(f.permissions),
            ext: f.name.split('.').pop().toLowerCase(),
            // 計算匹配優先度：檔名 > 標籤 > 資料夾
            matchScore: (f.name.toLowerCase().includes(kw) ? 10 : 0)
                + ((f.tags || []).some(t => t.toLowerCase().includes(kw)) ? 5 : 0)
                + ((f.folder || '').toLowerCase().includes(kw) ? 2 : 0),
        }));

        // 按匹配分數排序
        matchedFiles.sort((a, b) => b.matchScore - a.matchScore);

        return {
            folders: matchedFolders,
            files: matchedFiles,
            total: matchedFolders.length + matchedFiles.length,
        };
    }

    // ==================== 搜尋建議下拉 ====================

    /** 建立搜尋建議容器 */
    function ensureSuggestionsContainer(searchBox) {
        let container = searchBox.querySelector('.search-suggestions');
        if (!container) {
            container = document.createElement('div');
            container.className = 'search-suggestions';
            searchBox.appendChild(container);
        }
        return container;
    }

    /** 顯示搜尋建議 */
    function showSuggestions(searchBox, keyword) {
        const container = ensureSuggestionsContainer(searchBox);

        if (!keyword || keyword.trim().length < 1) {
            container.classList.remove('show');
            return;
        }

        const results = performSearch(keyword);

        if (results.total === 0) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #9CA3AF; font-size: 13px;">
                    <i class="fa-solid fa-search" style="font-size: 20px; margin-bottom: 8px; display: block;"></i>
                    找不到「${escapeHtmlStr(keyword)}」的相關結果
                </div>`;
            container.classList.add('show');
            return;
        }

        let html = '';

        // 資料夾建議（最多 3 筆）
        if (results.folders.length > 0) {
            html += '<div class="suggestion-header"><i class="fa-solid fa-folder"></i> 資料夾</div>';
            results.folders.slice(0, 3).forEach(f => {
                html += `
                    <div class="suggestion-item" data-type="folder" data-path="${escapeHtmlStr(f.path)}">
                        <i class="fa-solid fa-folder" style="color: #F59E0B;"></i>
                        <span class="suggestion-text">${highlightText(f.displayName, keyword)}</span>
                        <span class="suggestion-path">${escapeHtmlStr(f.path)}</span>
                    </div>`;
            });
        }

        // 檔案建議（最多 5 筆）
        if (results.files.length > 0) {
            html += '<div class="suggestion-header"><i class="fa-solid fa-file"></i> 檔案</div>';
            results.files.slice(0, MAX_SUGGESTIONS - Math.min(results.folders.length, 3)).forEach(f => {
                html += `
                    <div class="suggestion-item" data-type="file" data-name="${escapeHtmlStr(f.name)}" data-folder="${escapeHtmlStr(f.folder)}">
                        <i class="${getSearchFileIcon(f.name)}"></i>
                        <span class="suggestion-text">${highlightText(f.name, keyword)}</span>
                        <span class="suggestion-path">${escapeHtmlStr(f.folder)}</span>
                    </div>`;
            });
        }

        // 底部：檢視全部結果
        html += `<div class="suggestion-footer" data-action="view-all">
            <i class="fa-solid fa-magnifying-glass"></i> 查看全部 ${results.total} 筆搜尋結果
        </div>`;

        container.innerHTML = html;
        container.classList.add('show');

        // 綁定事件
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const type = this.dataset.type;
                if (type === 'folder') {
                    navigateToFolder(this.dataset.path);
                } else {
                    navigateToFile(this.dataset.name, this.dataset.folder);
                }
                container.classList.remove('show');
            });
        });

        const viewAll = container.querySelector('[data-action="view-all"]');
        if (viewAll) {
            viewAll.addEventListener('click', function (e) {
                e.stopPropagation();
                executeGlobalSearch(keyword);
                container.classList.remove('show');
            });
        }
    }

    /** 隱藏建議 */
    function hideSuggestions(searchBox) {
        const container = searchBox.querySelector('.search-suggestions');
        if (container) container.classList.remove('show');
    }

    // ==================== 搜尋結果頁面 ====================

    /** 執行全站搜尋（完整結果） */
    function executeGlobalSearch(keyword) {
        if (!keyword || !keyword.trim()) return;

        const kw = keyword.trim();
        const results = performSearch(kw);
        const startTime = performance.now();

        // 判斷是否在 index.html 中
        const searchSection = document.getElementById('page-search');

        if (searchSection) {
            // 在 index.html 中，切換到搜尋結果頁
            renderSearchResults(searchSection, kw, results, performance.now() - startTime);
            // 切換頁面
            if (typeof gotoPage === 'function') {
                gotoPage('search');
            } else {
                // 手動切換
                document.querySelectorAll('.page-section').forEach(p => p.style.display = 'none');
                searchSection.style.display = 'block';
                // 更新側邊欄 active
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            }
        } else {
            // 在 KM 或其他頁面，跳轉到 index.html 帶搜尋參數
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage !== 'index.html' && currentPage !== '') {
                window.location.href = 'index.html?search=' + encodeURIComponent(kw);
                return;
            }
        }
    }

    /** 渲染搜尋結果 */
    function renderSearchResults(container, keyword, results, elapsed) {
        const elapsedSec = (elapsed / 1000).toFixed(2);
        let currentFilter = 'all';

        function renderAll() {
            let html = '<div class="search-results-page">';

            // 搜尋頭部
            html += `
                <div class="search-header">
                    <div class="search-query">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <h2>搜尋「<span class="keyword">${escapeHtmlStr(keyword)}</span>」的結果</h2>
                    </div>
                    <div class="search-stats">共找到 ${results.total} 筆結果，耗時 ${elapsedSec} 秒</div>
                    
                    <div class="search-category-tabs">
                        <div class="search-category-tab ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                            <i class="fa-solid fa-layer-group"></i>
                            全部
                            <span class="tab-count">${results.total}</span>
                        </div>`;

            if (results.folders.length > 0) {
                html += `
                        <div class="search-category-tab ${currentFilter === 'folders' ? 'active' : ''}" data-filter="folders">
                            <i class="fa-solid fa-folder"></i>
                            資料夾
                            <span class="tab-count">${results.folders.length}</span>
                        </div>`;
            }
            if (results.files.length > 0) {
                html += `
                        <div class="search-category-tab ${currentFilter === 'files' ? 'active' : ''}" data-filter="files">
                            <i class="fa-solid fa-file"></i>
                            文件檔案
                            <span class="tab-count">${results.files.length}</span>
                        </div>`;
            }

            html += `</div></div>`;

            // 空狀態
            if (results.total === 0) {
                html += `
                    <div class="search-empty">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <h3>找不到相關結果</h3>
                        <p>找不到符合「${escapeHtmlStr(keyword)}」的資料夾或檔案</p>
                    </div>
                    <div class="search-tips">
                        <h4><i class="fa-solid fa-lightbulb"></i> 搜尋提示</h4>
                        <ul>
                            <li>確認關鍵字沒有拼錯</li>
                            <li>嘗試使用更簡短或不同的關鍵字</li>
                            <li>搜尋支援：資料夾名稱、檔案名稱、標籤</li>
                        </ul>
                    </div>`;
                html += '</div>';
                container.innerHTML = html;
                return;
            }

            // 資料夾結果
            if (results.folders.length > 0 && (currentFilter === 'all' || currentFilter === 'folders')) {
                html += renderFolderSection(results.folders, keyword);
            }

            // 檔案結果
            if (results.files.length > 0 && (currentFilter === 'all' || currentFilter === 'files')) {
                html += renderFileSection(results.files, keyword);
            }

            html += '</div>';
            container.innerHTML = html;

            // 綁定過濾 Tab
            container.querySelectorAll('.search-category-tab').forEach(tab => {
                tab.addEventListener('click', function () {
                    currentFilter = this.dataset.filter;
                    renderAll();
                });
            });

            // 綁定結果項目點擊
            container.querySelectorAll('.search-result-item[data-type="folder"]').forEach(item => {
                item.addEventListener('click', function () {
                    navigateToFolder(this.dataset.path);
                });
            });

            container.querySelectorAll('.search-result-item[data-type="file"]').forEach(item => {
                item.addEventListener('click', function () {
                    navigateToFile(this.dataset.name, this.dataset.folder);
                });
            });

            // 綁定操作按鈕
            container.querySelectorAll('.action-btn[data-action]').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const action = this.dataset.action;
                    const name = this.dataset.name;
                    if (action === 'download') {
                        if (typeof downloadFile === 'function') downloadFile(name);
                        else alert('⬇️ 下載：' + name);
                    } else if (action === 'view') {
                        if (typeof viewFile === 'function') viewFile(name);
                        else alert('📄 檢視：' + name);
                    } else if (action === 'favorite') {
                        if (typeof toggleFavorite === 'function') {
                            toggleFavorite(name);
                            // 更新按鈕狀態
                            const icon = this.querySelector('i');
                            if (icon) {
                                const isFav = typeof isFileFavorited === 'function' && isFileFavorited(name);
                                icon.className = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
                                this.style.color = isFav ? '#F59E0B' : '';
                            }
                        }
                    }
                });
            });
        }

        renderAll();
    }

    /** 渲染資料夾區塊 */
    function renderFolderSection(folders, keyword) {
        let html = `
            <div class="search-result-section">
                <div class="search-section-header">
                    <div class="search-section-title folder">
                        <span class="section-icon"><i class="fa-solid fa-folder"></i></span>
                        資料夾
                    </div>
                    <span class="search-section-count">${folders.length} 筆</span>
                </div>
                <div class="search-result-list">`;

        folders.forEach(f => {
            const permLabel = getPermBadge(f.permLevel);
            html += `
                <div class="search-result-item" data-type="folder" data-path="${escapeHtmlStr(f.path)}">
                    <div class="search-result-icon folder">
                        <i class="fa-solid fa-folder"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">
                            ${highlightText(f.displayName, keyword)}
                            ${permLabel}
                        </div>
                        <div class="search-result-meta">
                            <span class="folder-path"><i class="fa-solid fa-folder-tree"></i> ${escapeHtmlStr(f.path)}</span>
                        </div>
                    </div>
                </div>`;
        });

        html += '</div></div>';
        return html;
    }

    /** 渲染檔案區塊 */
    function renderFileSection(files, keyword) {
        let html = `
            <div class="search-result-section">
                <div class="search-section-header">
                    <div class="search-section-title km">
                        <span class="section-icon"><i class="fa-solid fa-file"></i></span>
                        文件檔案
                    </div>
                    <span class="search-section-count">${files.length} 筆</span>
                </div>
                <div class="search-result-list">`;

        files.forEach(f => {
            const iconClass = getIconClass(f.name);
            const isFav = typeof isFileFavorited === 'function' && isFileFavorited(f.name);
            const permLevel = f.permLevel;
            const canDownload = permLevel === '完全控制' || permLevel === '瀏覽+下載';
            const permLabel = getPermBadge(permLevel);

            // 標籤 HTML（最多 3 個）
            let tagsHtml = '';
            if (f.tags.length > 0) {
                tagsHtml = '<div class="search-result-tags">';
                f.tags.slice(0, 3).forEach(t => {
                    tagsHtml += `<span class="tag">${highlightText(t, keyword)}</span>`;
                });
                tagsHtml += '</div>';
            }

            // 操作按鈕（依權限顯示/隱藏）
            let actionsHtml = '<div class="search-result-actions">';
            actionsHtml += `<button class="action-btn" title="收藏" data-action="favorite" data-name="${escapeHtmlStr(f.name)}" style="${isFav ? 'color: #F59E0B;' : ''}">
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>`;
            actionsHtml += `<button class="action-btn" title="檢視" data-action="view" data-name="${escapeHtmlStr(f.name)}">
                <i class="fa-solid fa-eye"></i>
            </button>`;
            if (canDownload) {
                actionsHtml += `<button class="action-btn" title="下載" data-action="download" data-name="${escapeHtmlStr(f.name)}">
                    <i class="fa-solid fa-download"></i>
                </button>`;
            }
            actionsHtml += '</div>';

            html += `
                <div class="search-result-item" data-type="file" data-name="${escapeHtmlStr(f.name)}" data-folder="${escapeHtmlStr(f.folder)}">
                    <div class="search-result-icon ${iconClass}">
                        <i class="${getSearchFileIcon(f.name)}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">
                            ${highlightText(f.name, keyword)}
                            ${permLabel}
                        </div>
                        <div class="search-result-meta">
                            <span class="folder-path"><i class="fa-solid fa-folder"></i> ${escapeHtmlStr(f.folder)}</span>
                            <span>${f.uploadDate || ''}</span>
                        </div>
                    </div>
                    ${tagsHtml}
                    ${actionsHtml}
                </div>`;
        });

        html += '</div></div>';
        return html;
    }

    /** 權限等級標籤 */
    function getPermBadge(permLevel) {
        if (!permLevel) return '';
        switch (permLevel) {
            case '完全控制':
                return '<span class="perm-badge full">完全控制</span>';
            case '瀏覽+下載':
                return '<span class="perm-badge download">瀏覽+下載</span>';
            case '僅瀏覽':
                return '<span class="perm-badge view-only">僅瀏覽</span>';
            default:
                return '';
        }
    }

    // ==================== 導航 ====================

    /** 導航到資料夾 */
    function navigateToFolder(path) {
        // 跳轉到 km-recent.html 並展開該資料夾
        window.location.href = 'km-recent.html?folder=' + encodeURIComponent(path);
    }

    /** 導航到檔案 */
    function navigateToFile(fileName, folder) {
        // 跳轉到 km-recent.html 並選取該檔案所在的資料夾
        window.location.href = 'km-recent.html?folder=' + encodeURIComponent(folder) + '&file=' + encodeURIComponent(fileName);
    }

    // ==================== 初始化 ====================

    /** 初始化全站搜尋 */
    function initGlobalSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;

        const searchBox = searchInput.closest('.search-box');
        if (!searchBox) return;

        const searchBtn = searchBox.querySelector('.search-btn');

        // 輸入即時建議（debounced）
        const debouncedSuggestion = debounce(function () {
            showSuggestions(searchBox, searchInput.value);
        }, DEBOUNCE_MS);

        searchInput.addEventListener('input', debouncedSuggestion);

        // 聚焦時顯示建議
        searchInput.addEventListener('focus', function () {
            if (this.value.trim().length >= 1) {
                showSuggestions(searchBox, this.value);
            }
        });

        // Enter 鍵搜尋
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                hideSuggestions(searchBox);
                executeGlobalSearch(this.value);
            }
            if (e.key === 'Escape') {
                hideSuggestions(searchBox);
            }
        });

        // 搜尋按鈕
        if (searchBtn) {
            searchBtn.addEventListener('click', function (e) {
                e.preventDefault();
                hideSuggestions(searchBox);
                executeGlobalSearch(searchInput.value);
            });
        }

        // 點擊外部關閉建議
        document.addEventListener('click', function (e) {
            if (!searchBox.contains(e.target)) {
                hideSuggestions(searchBox);
            }
        });

        // 檢查 URL 參數
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            searchInput.value = searchQuery;
            // 延遲執行確保 DOM 和資料準備完畢
            setTimeout(function () {
                executeGlobalSearch(searchQuery);
            }, 100);
        }

        console.log('✅ 全站搜尋功能已初始化');
    }

    // ==================== KM 左側面板搜尋 ====================

    /**
     * KM 文件庫內搜尋（左側面板搜尋框）
     * SPEC: 搜尋欄位範圍：檔名 / 標籤 / 資料夾名稱
     */
    function initKmInternalSearch() {
        const searchInput = document.getElementById('folderSearchInput');
        if (!searchInput) return;

        const debouncedSearch = debounce(function () {
            const keyword = searchInput.value.trim().toLowerCase();
            filterKmLeftPanel(keyword);
        }, DEBOUNCE_MS);

        searchInput.addEventListener('input', debouncedSearch);

        console.log('✅ KM 文件庫內搜尋已初始化');
    }

    /**
     * 過濾 KM 左側面板的資料夾
     */
    function filterKmLeftPanel(keyword) {
        const navItems = document.querySelectorAll('#deptFoldersList .nav-item, #deptFoldersList .nav-dept, #deptFoldersList .nav-sub');

        if (!keyword) {
            // 清空搜尋，顯示所有
            navItems.forEach(item => {
                item.style.display = '';
            });
            return;
        }

        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const path = (item.dataset.path || '').toLowerCase();
            if (text.includes(keyword) || path.includes(keyword)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // ==================== 啟動 ====================

    // DOM 載入後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initGlobalSearch();
            initKmInternalSearch();
        });
    } else {
        // DOMContentLoaded 已過，直接執行
        // 延遲以確保 layout-loader 已完成
        setTimeout(function () {
            initGlobalSearch();
            initKmInternalSearch();
        }, 200);
    }

    // 匯出到全域（供其他模組使用）
    window.__globalSearch = {
        performSearch: performSearch,
        executeGlobalSearch: executeGlobalSearch,
        initGlobalSearch: initGlobalSearch,
        initKmInternalSearch: initKmInternalSearch,
    };

})();
