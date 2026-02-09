/**
 * table-script.js
 * 表格相關功能腳本，處理表格的排序、篩選和分頁等功能
 */

// 表格狀態變數
let tableState = {
    currentPage: 1,
    totalPages: 1,
    rowsPerPage: 10,
    sortColumn: null,
    sortDirection: 'asc',
    filters: {}
};

/**
 * 當文檔加載完成後初始化表格功能
 */
document.addEventListener('DOMContentLoaded', function() {
    initTableFunctions();
});

/**
 * 初始化表格功能
 */
function initTableFunctions() {
    // 綁定表格排序事件
    initTableSorting();
    
    // 綁定表格篩選事件
    initTableFilters();
    
    // 綁定分頁控制事件
    initPagination();
    
    // 綁定表格行操作事件
    initRowActions();
}

/**
 * 初始化表格排序功能
 */
function initTableSorting() {
    const tableHeaders = document.querySelectorAll('.data-table thead th');
    
    tableHeaders.forEach(header => {
        // 跳過不需要排序的列（如勾選框列和操作列）
        if (header.classList.contains('no-sort') || header.querySelector('input[type="checkbox"]')) {
            return;
        }
        
        // 添加排序指示器
        const sortIndicator = document.createElement('span');
        sortIndicator.className = 'sort-indicator';
        sortIndicator.innerHTML = ' <i class="fa-solid fa-sort"></i>';
        header.appendChild(sortIndicator);
        
        // 添加點擊事件
        header.addEventListener('click', function() {
            sortTable(this);
        });
    });
}

/**
 * 排序表格
 * @param {HTMLElement} headerElement - 點擊的表頭元素
 */
function sortTable(headerElement) {
    // 獲取所有表頭
    const tableHeaders = document.querySelectorAll('.data-table thead th');
    
    // 獲取點擊的列索引
    let columnIndex = Array.from(tableHeaders).indexOf(headerElement);
    
    // 如果是同一列，切換排序方向
    if (tableState.sortColumn === columnIndex) {
        tableState.sortDirection = tableState.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        // 如果是新列，設置為升序並更新當前排序列
        tableState.sortDirection = 'asc';
        tableState.sortColumn = columnIndex;
    }
    
    // 更新排序指示器
    updateSortIndicators(headerElement);
    
    // 進行表格排序
    performTableSort(columnIndex);
}

/**
 * 更新排序指示器
 * @param {HTMLElement} activeHeader - 當前排序的表頭元素
 */
function updateSortIndicators(activeHeader) {
    // 獲取所有表頭
    const tableHeaders = document.querySelectorAll('.data-table thead th');
    
    // 重置所有排序指示器
    tableHeaders.forEach(header => {
        const indicator = header.querySelector('.sort-indicator');
        if (indicator) {
            indicator.innerHTML = ' <i class="fa-solid fa-sort"></i>';
        }
    });
    
    // 設置當前排序列的指示器
    const activeIndicator = activeHeader.querySelector('.sort-indicator');
    if (activeIndicator) {
        activeIndicator.innerHTML = tableState.sortDirection === 'asc' 
            ? ' <i class="fa-solid fa-sort-up"></i>' 
            : ' <i class="fa-solid fa-sort-down"></i>';
    }
}

/**
 * 執行表格排序
 * @param {number} columnIndex - 排序的列索引
 */
function performTableSort(columnIndex) {
    const table = document.querySelector('.data-table table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // 按指定列排序行
    rows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent.trim();
        let bValue = b.cells[columnIndex].textContent.trim();
        
        // 嘗試解析為數字
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        // 如果都是有效數字則比較數值
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return tableState.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // 如果是日期格式（例如：yyyy/mm/dd）
        if (/^\d{4}\/\d{2}\/\d{2}$/.test(aValue) && /^\d{4}\/\d{2}\/\d{2}$/.test(bValue)) {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            return tableState.sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        // 否則比較字符串
        return tableState.sortDirection === 'asc' 
            ? aValue.localeCompare(bValue, 'zh-TW') 
            : bValue.localeCompare(aValue, 'zh-TW');
    });
    
    // 重新添加排序後的行
    rows.forEach(row => {
        tbody.appendChild(row);
    });
}

/**
 * 初始化表格篩選功能
 */
function initTableFilters() {
    // 綁定篩選條件變化事件
    const filterInputs = document.querySelectorAll('.filter-item select, .filter-item input');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateFilters();
        });
    });
    
    // 綁定搜尋按鈕點擊事件
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-group input');
            if (searchInput) {
                tableState.filters.search = searchInput.value.trim();
                applyFilters();
            }
        });
    }
    
    // 綁定搜尋輸入框的 Enter 鍵事件
    const searchInput = document.querySelector('.search-group input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                tableState.filters.search = this.value.trim();
                applyFilters();
            }
        });
    }
}

/**
 * 更新篩選條件
 */
function updateFilters() {
    // 獲取產品型號篩選值
    const productFilter = document.getElementById('product-filter');
    if (productFilter) {
        tableState.filters.product = productFilter.value;
    }
    
    // 獲取狀態篩選值
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        tableState.filters.status = statusFilter.value;
    }
    
    // 獲取日期範圍
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    if (startDate && endDate) {
        tableState.filters.startDate = startDate.value;
        tableState.filters.endDate = endDate.value;
    }
    
    // 應用篩選
    applyFilters();
}

/**
 * 應用篩選條件到表格
 */
function applyFilters() {
    const table = document.querySelector('.data-table table');
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    // 遍歷所有行並根據篩選條件決定顯示或隱藏
    rows.forEach(row => {
        let showRow = true;
        
        // 產品型號篩選
        if (tableState.filters.product && tableState.filters.product !== '') {
            const productCell = row.cells[2]; // 產品型號列的索引
            if (productCell && productCell.textContent.trim() !== tableState.filters.product) {
                showRow = false;
            }
        }
        
        // 狀態篩選
        if (showRow && tableState.filters.status && tableState.filters.status !== '') {
            const statusCell = row.cells[6]; // 狀態列的索引
            const statusText = statusCell.textContent.trim();
            
            // 根據狀態值篩選
            const statusMap = {
                'active': '啟用',
                'pending': '待審核',
                'rejected': '拒絕',
                'inactive': '停用'
            };
            
            if (statusText !== statusMap[tableState.filters.status]) {
                showRow = false;
            }
        }
        
        // 日期範圍篩選（這裡以建立日期為例）
        if (showRow && tableState.filters.startDate && tableState.filters.endDate) {
            const dateCell = row.cells[7]; // 建立日期列的索引
            const dateStr = dateCell.textContent.trim();
            const rowDate = new Date(dateStr);
            
            const startDate = new Date(tableState.filters.startDate);
            const endDate = new Date(tableState.filters.endDate);
            
            // 設置為當天結束時間
            endDate.setHours(23, 59, 59, 999);
            
            if (rowDate < startDate || rowDate > endDate) {
                showRow = false;
            }
        }
        
        // 關鍵字搜尋（搜尋序號和產品型號）
        if (showRow && tableState.filters.search && tableState.filters.search !== '') {
            const searchTerm = tableState.filters.search.toLowerCase();
            const serialCell = row.cells[1]; // 序號列的索引
            const productCell = row.cells[2]; // 產品型號列的索引
            
            const serialText = serialCell ? serialCell.textContent.trim().toLowerCase() : '';
            const productText = productCell ? productCell.textContent.trim().toLowerCase() : '';
            
            if (!serialText.includes(searchTerm) && !productText.includes(searchTerm)) {
                showRow = false;
            }
        }
        
        // 顯示或隱藏行
        row.style.display = showRow ? '' : 'none';
    });
    
    // 更新分頁信息
    updatePagination();
}

/**
 * 初始化分頁控制
 */
function initPagination() {
    // 計算總頁數
    updatePagination();
    
    // 綁定分頁按鈕點擊事件
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        if (!button.classList.contains('active') && !button.disabled) {
            button.addEventListener('click', function() {
                if (this.textContent) {
                    // 數字頁按鈕
                    const pageNum = parseInt(this.textContent);
                    if (!isNaN(pageNum)) {
                        navigateToPage(pageNum);
                    }
                } else if (this.querySelector('i.fa-angle-left')) {
                    // 上一頁按鈕
                    navigateToPage(tableState.currentPage - 1);
                } else if (this.querySelector('i.fa-angle-right')) {
                    // 下一頁按鈕
                    navigateToPage(tableState.currentPage + 1);
                } else if (this.querySelector('i.fa-angles-left')) {
                    // 首頁按鈕
                    navigateToPage(1);
                } else if (this.querySelector('i.fa-angles-right')) {
                    // 末頁按鈕
                    navigateToPage(tableState.totalPages);
                }
            });
        }
    });
}

/**
 * 更新分頁信息
 */
function updatePagination() {
    const table = document.querySelector('.data-table table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
        row.style.display !== 'none'
    );
    
    // 計算總頁數
    tableState.totalPages = Math.ceil(rows.length / tableState.rowsPerPage);
    if (tableState.totalPages === 0) tableState.totalPages = 1;
    
    // 確保當前頁在有效範圍內
    if (tableState.currentPage > tableState.totalPages) {
        tableState.currentPage = tableState.totalPages;
    } else if (tableState.currentPage < 1) {
        tableState.currentPage = 1;
    }
    
    // 更新頁面信息顯示
    const pageInfo = document.querySelector('.page-info');
    if (pageInfo) {
        const startRow = (tableState.currentPage - 1) * tableState.rowsPerPage + 1;
        const endRow = Math.min(tableState.currentPage * tableState.rowsPerPage, rows.length);
        pageInfo.textContent = `顯示 ${rows.length > 0 ? startRow : 0} 到 ${endRow} 筆，共 ${rows.length} 筆資料`;
    }
    
    // 更新頁碼按鈕
    updatePageButtons();
    
    // 應用分頁顯示
    applyPagination(rows);
}

/**
 * 更新頁碼按鈕狀態
 */
function updatePageButtons() {
    // 獲取頁碼按鈕容器
    const pageControls = document.querySelector('.page-controls');
    if (!pageControls) return;
    
    // 清空現有按鈕
    pageControls.innerHTML = '';
    
    // 添加首頁按鈕
    const firstBtn = document.createElement('button');
    firstBtn.className = 'page-btn';
    firstBtn.disabled = tableState.currentPage === 1;
    firstBtn.innerHTML = '<i class="fa-solid fa-angles-left"></i>';
    pageControls.appendChild(firstBtn);
    
    // 添加上一頁按鈕
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.disabled = tableState.currentPage === 1;
    prevBtn.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
    pageControls.appendChild(prevBtn);
    
    // 生成頁碼按鈕
    let startPage = Math.max(1, tableState.currentPage - 2);
    let endPage = Math.min(tableState.totalPages, startPage + 4);
    
    // 調整起始頁，確保顯示5個頁碼
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        if (i === tableState.currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i.toString();
        pageControls.appendChild(pageBtn);
    }
    
    // 添加下一頁按鈕
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.disabled = tableState.currentPage === tableState.totalPages;
    nextBtn.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
    pageControls.appendChild(nextBtn);
    
    // 添加末頁按鈕
    const lastBtn = document.createElement('button');
    lastBtn.className = 'page-btn';
    lastBtn.disabled = tableState.currentPage === tableState.totalPages;
    lastBtn.innerHTML = '<i class="fa-solid fa-angles-right"></i>';
    pageControls.appendChild(lastBtn);
    
    // 重新綁定頁碼按鈕事件
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        if (!button.classList.contains('active') && !button.disabled) {
            button.addEventListener('click', function() {
                if (this.textContent) {
                    // 數字頁按鈕
                    const pageNum = parseInt(this.textContent);
                    if (!isNaN(pageNum)) {
                        navigateToPage(pageNum);
                    }
                } else if (this.querySelector('i.fa-angle-left')) {
                    // 上一頁按鈕
                    navigateToPage(tableState.currentPage - 1);
                } else if (this.querySelector('i.fa-angle-right')) {
                    // 下一頁按鈕
                    navigateToPage(tableState.currentPage + 1);
                } else if (this.querySelector('i.fa-angles-left')) {
                    // 首頁按鈕
                    navigateToPage(1);
                } else if (this.querySelector('i.fa-angles-right')) {
                    // 末頁按鈕
                    navigateToPage(tableState.totalPages);
                }
            });
        }
    });
}

/**
 * 應用分頁顯示
 * @param {Array} rows - 表格行數組
 */
function applyPagination(rows) {
    const startIndex = (tableState.currentPage - 1) * tableState.rowsPerPage;
    const endIndex = startIndex + tableState.rowsPerPage;
    
    // 先隱藏所有行
    rows.forEach((row, index) => {
        if (index >= startIndex && index < endIndex) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * 導航到指定頁面
 * @param {number} pageNum - 頁碼
 */
function navigateToPage(pageNum) {
    // 確保頁碼在有效範圍內
    if (pageNum < 1 || pageNum > tableState.totalPages) return;
    
    tableState.currentPage = pageNum;
    updatePagination();
}

/**
 * 初始化表格行操作功能
 */
function initRowActions() {
    // 綁定查看按鈕點擊事件
    document.querySelectorAll('.action-icons .fa-eye').forEach(btn => {
        btn.addEventListener('click', function() {
            // 獲取當前行的數據
            const row = this.closest('tr');
            const serialNo = row.cells[1].textContent;
            
            // 顯示詳細信息模態窗口
            showDetailModal(serialNo);
        });
    });
    
    // 綁定編輯按鈕點擊事件
    document.querySelectorAll('.action-icons .fa-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            // 獲取當前行的數據
            const row = this.closest('tr');
            const serialNo = row.cells[1].textContent;
            
            // 顯示編輯模態窗口
            showEditModal(serialNo);
        });
    });
    
    // 綁定刪除按鈕點擊事件
    document.querySelectorAll('.action-icons .fa-trash').forEach(btn => {
        btn.addEventListener('click', function() {
            // 獲取當前行的數據
            const row = this.closest('tr');
            const serialNo = row.cells[1].textContent;
            
            // 顯示刪除確認模態窗口
            showDeleteConfirmModal(serialNo);
        });
    });
}

/**
 * 顯示詳細信息模態窗口
 * @param {string} serialNo - 序號
 */
function showDetailModal(serialNo) {
    const modal = document.getElementById('generalModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    
    modalTitle.textContent = `產品序號詳細資訊 - ${serialNo}`;
    
    // 在實際應用中，這裡應該是從後端 API 獲取數據
    // 這裡使用模擬數據
    const detailHtml = `
        <div class="detail-view">
            <div class="detail-section">
                <h4>基本資訊</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>序號</label>
                        <div>${serialNo}</div>
                    </div>
                    <div class="detail-item">
                        <label>產品型號</label>
                        <div>TPM-2000</div>
                    </div>
                    <div class="detail-item">
                        <label>序號格式</label>
                        <div>標準格式</div>
                    </div>
                    <div class="detail-item">
                        <label>製造日期</label>
                        <div>2025/05/01</div>
                    </div>
                    <div class="detail-item">
                        <label>製造廠商</label>
                        <div>台灣製造廠</div>
                    </div>
                    <div class="detail-item">
                        <label>狀態</label>
                        <div><span class="status-badge active">啟用</span></div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>產品規格</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>CPU</label>
                        <div>Intel i7-12700K</div>
                    </div>
                    <div class="detail-item">
                        <label>記憶體</label>
                        <div>32GB DDR4</div>
                    </div>
                    <div class="detail-item">
                        <label>儲存容量</label>
                        <div>1TB SSD</div>
                    </div>
                    <div class="detail-item">
                        <label>顯示晶片</label>
                        <div>NVIDIA RTX 4060</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>包裝與運送資訊</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>包裝號</label>
                        <div>PKG202505010023</div>
                    </div>
                    <div class="detail-item">
                        <label>箱號</label>
                        <div>BOX202505010005</div>
                    </div>
                    <div class="detail-item">
                        <label>產地</label>
                        <div>台灣</div>
                    </div>
                    <div class="detail-item">
                        <label>目的地</label>
                        <div>台北市</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>審核資訊</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>建立人員</label>
                        <div>王小明</div>
                    </div>
                    <div class="detail-item">
                        <label>建立時間</label>
                        <div>2025/05/01 10:30:45</div>
                    </div>
                    <div class="detail-item">
                        <label>審核人員</label>
                        <div>張經理</div>
                    </div>
                    <div class="detail-item">
                        <label>審核時間</label>
                        <div>2025/05/01 14:20:15</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = detailHtml;
    
    // 更新按鈕
    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    confirmBtn.textContent = '確定';
    cancelBtn.style.display = 'none';  // 隱藏取消按鈕
    
    // 顯示模態窗口
    showModal(modal);
    
    // 確定按鈕事件
    confirmBtn.onclick = function() {
        hideModal(modal);
        // 重新顯示取消按鈕（恢復預設狀態）
        cancelBtn.style.display = '';
    };
}

/**
 * 顯示編輯模態窗口
 * @param {string} serialNo - 序號
 */
function showEditModal(serialNo) {
    const modal = document.getElementById('generalModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    modalTitle.textContent = `編輯產品序號 - ${serialNo}`;
    
    // 在實際應用中，這裡應該是從後端 API 獲取數據
    // 這裡使用模擬數據
    const editHtml = `
        <div class="form-container">
            <div class="form-section">
                <div class="form-grid cols-2">
                    <div class="form-item">
                        <label>序號 <span class="required-mark">*</span></label>
                        <input type="text" value="${serialNo}" readonly>
                        <div class="help-text">序號不可修改</div>
                    </div>
                    <div class="form-item">
                        <label>產品型號 <span class="required-mark">*</span></label>
                        <select>
                            <option value="TPM-2000" selected>TPM-2000</option>
                            <option value="TPM-3000">TPM-3000</option>
                            <option value="TPM-4000">TPM-4000</option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label>序號格式</label>
                        <select>
                            <option value="standard" selected>標準格式</option>
                            <option value="special">特殊格式</option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label>製造日期 <span class="required-mark">*</span></label>
                        <input type="date" value="2025-05-01">
                    </div>
                    <div class="form-item">
                        <label>製造廠商</label>
                        <select>
                            <option value="1" selected>台灣製造廠</option>
                            <option value="2">深圳製造廠</option>
                            <option value="3">上海製造廠</option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label>狀態</label>
                        <select>
                            <option value="active" selected>啟用</option>
                            <option value="pending">待審核</option>
                            <option value="rejected">拒絕</option>
                            <option value="inactive">停用</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <h4 class="form-section-title">產品規格</h4>
                <div class="form-grid cols-2">
                    <div class="form-item">
                        <label>CPU</label>
                        <input type="text" value="Intel i7-12700K">
                    </div>
                    <div class="form-item">
                        <label>記憶體</label>
                        <input type="text" value="32GB DDR4">
                    </div>
                    <div class="form-item">
                        <label>儲存容量</label>
                        <input type="text" value="1TB SSD">
                    </div>
                    <div class="form-item">
                        <label>顯示晶片</label>
                        <input type="text" value="NVIDIA RTX 4060">
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <h4 class="form-section-title">包裝與運送資訊</h4>
                <div class="form-grid cols-2">
                    <div class="form-item">
                        <label>包裝號</label>
                        <input type="text" value="PKG202505010023">
                    </div>
                    <div class="form-item">
                        <label>箱號</label>
                        <input type="text" value="BOX202505010005">
                    </div>
                    <div class="form-item">
                        <label>產地</label>
                        <input type="text" value="台灣">
                    </div>
                    <div class="form-item">
                        <label>目的地</label>
                        <input type="text" value="台北市">
                    </div>
                </div>
            </div>
            
            <div class="form-section">
                <h4 class="form-section-title">備註</h4>
                <div class="form-item">
                    <textarea rows="3"></textarea>
                </div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = editHtml;
    
    // 更新按鈕
    const confirmBtn = document.querySelector('.confirm-btn');
    confirmBtn.textContent = '儲存';
    
    // 顯示模態窗口
    showModal(modal);
    
    // 儲存按鈕事件
    confirmBtn.onclick = function() {
        // 在實際應用中，這裡會提交表單數據到後端 API
        alert('資料已儲存！');
        hideModal(modal);
    };
}

/**
 * 顯示刪除確認模態窗口
 * @param {string} serialNo - 序號
 */
function showDeleteConfirmModal(serialNo) {
    const modal = document.getElementById('generalModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    modalTitle.textContent = '確認刪除';
    
    const deleteHtml = `
        <div class="confirm-modal">
            <div class="icon-container">
                <i class="fa-solid fa-exclamation-triangle"></i>
            </div>
            <p class="confirm-message">您確定要刪除序號 ${serialNo} 的記錄嗎？</p>
            <p class="confirm-detail">此操作無法復原，請謹慎操作。</p>
        </div>
    `;
    
    modalBody.innerHTML = deleteHtml;
    
    // 更新按鈕
    const confirmBtn = document.querySelector('.confirm-btn');
    confirmBtn.textContent = '刪除';
    confirmBtn.style.backgroundColor = 'var(--danger-color)';
    
    // 顯示模態窗口
    showModal(modal);
    
    // 刪除按鈕事件
    confirmBtn.onclick = function() {
        // 在實際應用中，這裡會調用後端 API 刪除記錄
        alert(`序號 ${serialNo} 的記錄已刪除！`);
        hideModal(modal);
        
        // 恢復按鈕樣式
        confirmBtn.style.backgroundColor = '';
    };
    
    // 恢復模態窗口關閉後的按鈕樣式
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = function() {
        hideModal(modal);
        confirmBtn.style.backgroundColor = '';
    };
    
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.onclick = function() {
        hideModal(modal);
        confirmBtn.style.backgroundColor = '';
    };
}
