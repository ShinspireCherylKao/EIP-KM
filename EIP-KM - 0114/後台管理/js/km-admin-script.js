/**
 * km-admin-script.js
 * 後台文件庫管理功能腳本
 * 支援與前台資料連動
 */

// ==================== 資料連動功能 ====================
// 監聽共享資料更新
window.addEventListener('kmDataUpdated', function(event) {
    const { type, action, data } = event.detail;
    console.log(`📡 後台接收到資料更新：${type} - ${action}`, data);
    
    // 根據更新類型執行相應操作
    if (type === 'permission') {
        console.log('✅ 權限已更新，前台將自動同步');
    } else if (type === 'record') {
        console.log('✅ 操作記錄已新增');
    } else if (type === 'tag') {
        console.log('✅ 標籤已更新');
    }
});

// 初始化文件庫管理
function initKmAdmin() {
    console.log('[KM Admin] 初始化文件庫管理後台');
    
    // 載入共用資料
    if (!window.__sharedKmData) {
        console.error('[KM Admin] 共用資料未載入');
        return;
    }
    
    // 初始化各功能模組
    initPermissionManagement();
    initFileRecordManagement();
    initFileTagManagement();
    initFileSearchManagement();
    initAiSettingsManagement();
}

// ============================================
// 瀏覽權限管理
// ============================================
function initPermissionManagement() {
    renderPermissionTable();
}

function renderPermissionTable(filters = {}) {
    const container = document.getElementById('permission-table-body');
    if (!container) return;
    
    let items = window.__sharedKmData.api.getFiles({ type: 'file' });
    
    // 套用篩選條件
    if (filters.dept && filters.dept !== 'all') {
        items = items.filter(i => i.deptId === filters.dept);
    }
    if (filters.visibility && filters.visibility !== 'all') {
        items = items.filter(i => i.visibilityMode === filters.visibility);
    }
    if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(kw));
    }
    
    container.innerHTML = items.map(item => `
        <tr data-id="${item.id}">
            <td>
                <i class="fa-solid ${getFileIcon(item.fileKind)}"></i>
                <span class="file-name">${item.name}</span>
            </td>
            <td>${item.path}</td>
            <td><span class="dept-badge">${item.deptId}</span></td>
            <td>
                <span class="visibility-badge ${item.visibilityMode}">${getVisibilityLabel(item.visibilityMode)}</span>
            </td>
            <td>${item.visibilityList?.join(', ') || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="editPermission('${item.id}')" title="編輯權限">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon" onclick="viewPermissionHistory('${item.id}')" title="查看歷史">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // 更新統計
    document.getElementById('permission-total-count').textContent = items.length;
}

function editPermission(fileId) {
    const item = window.__sharedKmData.indexItems.find(i => i.id === fileId);
    if (!item) return;
    
    // 填入 Modal 表單
    document.getElementById('editPermissionFileId').value = fileId;
    document.getElementById('editPermissionFileName').textContent = item.name;
    document.getElementById('editVisibilityMode').value = item.visibilityMode;
    document.getElementById('editVisibilityList').value = item.visibilityList?.join(', ') || '';
    
    // 勾選操作權限
    document.getElementById('permActionView').checked = item.actionsAllowed?.includes('view');
    document.getElementById('permActionDownload').checked = item.actionsAllowed?.includes('download');
    document.getElementById('permActionEdit').checked = item.actionsAllowed?.includes('edit');
    
    // 顯示 Modal
    openModal('editPermissionModal');
}

function savePermission() {
    const fileId = document.getElementById('editPermissionFileId').value;
    const visibilityMode = document.getElementById('editVisibilityMode').value;
    const visibilityList = document.getElementById('editVisibilityList').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
    
    const actionsAllowed = [];
    if (document.getElementById('permActionView').checked) actionsAllowed.push('view');
    if (document.getElementById('permActionDownload').checked) actionsAllowed.push('download');
    if (document.getElementById('permActionEdit').checked) actionsAllowed.push('edit');
    
    // 更新資料
    const success = window.__sharedKmData.api.updateFilePermission(fileId, {
        visibilityMode,
        visibilityList,
        actionsAllowed
    });
    
    if (success) {
        // 儲存到 localStorage
        window.__sharedKmData.api.saveToStorage();
        
        // 重新渲染表格
        renderPermissionTable();
        
        // 關閉 Modal
        closeModal('editPermissionModal');
        
        // 顯示成功訊息
        showToast('權限已更新', 'success');
    } else {
        showToast('更新失敗', 'error');
    }
}

function viewPermissionHistory(fileId) {
    const logs = window.__sharedKmData.api.getAccessLogs({ fileId });
    const item = window.__sharedKmData.indexItems.find(i => i.id === fileId);
    
    document.getElementById('historyFileName').textContent = item?.name || fileId;
    
    const container = document.getElementById('permissionHistoryList');
    container.innerHTML = logs.length ? logs.map(log => `
        <div class="history-item">
            <div class="history-icon ${log.action}">
                <i class="fa-solid ${getActionIcon(log.action)}"></i>
            </div>
            <div class="history-content">
                <div class="history-text">${log.userName} ${getActionLabel(log.action)}</div>
                <div class="history-time">${log.timestamp}</div>
            </div>
        </div>
    `).join('') : '<p class="empty-text">暫無存取紀錄</p>';
    
    openModal('permissionHistoryModal');
}

function filterPermissions() {
    const dept = document.getElementById('filterPermDept').value;
    const visibility = document.getElementById('filterPermVisibility').value;
    const keyword = document.getElementById('filterPermKeyword').value;
    
    renderPermissionTable({ dept, visibility, keyword });
}

// ============================================
// 檔案紀錄管理
// ============================================
function initFileRecordManagement() {
    renderFileRecordTable();
    updateFileRecordStats();
}

function renderFileRecordTable(filters = {}) {
    const container = document.getElementById('file-record-table-body');
    if (!container) return;
    
    let logs = window.__sharedKmData.api.getAccessLogs(filters);
    
    container.innerHTML = logs.map(log => `
        <tr>
            <td>${log.timestamp}</td>
            <td>
                <i class="fa-solid ${getFileIconByName(log.fileName)}"></i>
                ${log.fileName}
            </td>
            <td>${log.userName}</td>
            <td><span class="action-badge ${log.action}">${getActionLabel(log.action)}</span></td>
            <td>${log.ip}</td>
        </tr>
    `).join('');
}

function updateFileRecordStats() {
    const logs = window.__sharedKmData.accessLogs;
    const today = new Date().toISOString().split('T')[0];
    
    const todayLogs = logs.filter(l => l.timestamp.startsWith(today));
    const viewCount = logs.filter(l => l.action === 'view').length;
    const downloadCount = logs.filter(l => l.action === 'download').length;
    
    document.getElementById('statTodayAccess').textContent = todayLogs.length;
    document.getElementById('statTotalViews').textContent = viewCount;
    document.getElementById('statTotalDownloads').textContent = downloadCount;
}

function filterFileRecords() {
    const action = document.getElementById('filterRecordAction').value;
    const dateFrom = document.getElementById('filterRecordDateFrom').value;
    const dateTo = document.getElementById('filterRecordDateTo').value;
    
    const filters = {};
    if (action && action !== 'all') filters.action = action;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    
    renderFileRecordTable(filters);
}

function exportFileRecords() {
    const logs = window.__sharedKmData.accessLogs;
    const csv = [
        ['時間', '檔案名稱', '使用者', '動作', 'IP 位址'].join(','),
        ...logs.map(l => [l.timestamp, l.fileName, l.userName, l.action, l.ip].join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('紀錄已匯出', 'success');
}

// ============================================
// 檔案標籤設定
// ============================================
function initFileTagManagement() {
    renderTagList();
    renderTagUsageChart();
}

function renderTagList() {
    const container = document.getElementById('tag-list-container');
    if (!container) return;
    
    const tags = window.__sharedKmData.allTags;
    
    container.innerHTML = tags.map(tag => `
        <div class="tag-item" data-id="${tag.id}">
            <div class="tag-color" style="background-color: ${tag.color}"></div>
            <div class="tag-info">
                <span class="tag-name">${tag.name}</span>
                <span class="tag-count">${tag.count} 個檔案</span>
            </div>
            <div class="tag-actions">
                <button class="btn-icon" onclick="editTag('${tag.id}')" title="編輯">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteTag('${tag.id}')" title="刪除">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderTagUsageChart() {
    const container = document.getElementById('tag-usage-chart');
    if (!container) return;
    
    const tags = window.__sharedKmData.allTags.slice(0, 10);
    const maxCount = Math.max(...tags.map(t => t.count));
    
    container.innerHTML = tags.map(tag => `
        <div class="chart-bar-row">
            <span class="chart-label">${tag.name}</span>
            <div class="chart-bar-container">
                <div class="chart-bar" style="width: ${(tag.count / maxCount) * 100}%; background-color: ${tag.color}"></div>
            </div>
            <span class="chart-value">${tag.count}</span>
        </div>
    `).join('');
}

function showAddTagModal() {
    document.getElementById('addTagName').value = '';
    document.getElementById('addTagColor').value = '#3B82F6';
    openModal('addTagModal');
}

function saveNewTag() {
    const name = document.getElementById('addTagName').value.trim();
    const color = document.getElementById('addTagColor').value;
    
    if (!name) {
        showToast('請輸入標籤名稱', 'error');
        return;
    }
    
    // 檢查是否已存在
    if (window.__sharedKmData.allTags.some(t => t.name === name)) {
        showToast('標籤名稱已存在', 'error');
        return;
    }
    
    window.__sharedKmData.api.addTag({ name, color });
    window.__sharedKmData.api.saveToStorage();
    
    renderTagList();
    renderTagUsageChart();
    closeModal('addTagModal');
    showToast('標籤已新增', 'success');
}

function editTag(tagId) {
    const tag = window.__sharedKmData.allTags.find(t => t.id === tagId);
    if (!tag) return;
    
    document.getElementById('editTagId').value = tagId;
    document.getElementById('editTagName').value = tag.name;
    document.getElementById('editTagColor').value = tag.color;
    
    openModal('editTagModal');
}

function saveEditTag() {
    const tagId = document.getElementById('editTagId').value;
    const name = document.getElementById('editTagName').value.trim();
    const color = document.getElementById('editTagColor').value;
    
    if (!name) {
        showToast('請輸入標籤名稱', 'error');
        return;
    }
    
    const tag = window.__sharedKmData.allTags.find(t => t.id === tagId);
    if (tag) {
        const oldName = tag.name;
        tag.name = name;
        tag.color = color;
        
        // 更新所有檔案中的標籤名稱
        if (oldName !== name) {
            window.__sharedKmData.indexItems.forEach(item => {
                const idx = item.tags.indexOf(oldName);
                if (idx > -1) item.tags[idx] = name;
            });
        }
        
        window.__sharedKmData.api.saveToStorage();
        renderTagList();
        closeModal('editTagModal');
        showToast('標籤已更新', 'success');
    }
}

function deleteTag(tagId) {
    const tag = window.__sharedKmData.allTags.find(t => t.id === tagId);
    if (!tag) return;
    
    if (!confirm(`確定要刪除標籤「${tag.name}」嗎？\n此操作會從所有檔案移除此標籤。`)) {
        return;
    }
    
    window.__sharedKmData.api.deleteTag(tagId);
    window.__sharedKmData.api.saveToStorage();
    
    renderTagList();
    renderTagUsageChart();
    showToast('標籤已刪除', 'success');
}

// ============================================
// 篩選搜尋檔案
// ============================================
function initFileSearchManagement() {
    renderSearchResults();
}

function renderSearchResults(filters = {}) {
    const container = document.getElementById('search-results-body');
    if (!container) return;
    
    let items = window.__sharedKmData.api.getFiles(filters);
    
    container.innerHTML = items.map(item => `
        <tr data-id="${item.id}">
            <td>
                <i class="fa-solid ${getFileIcon(item.fileKind)}"></i>
                ${item.displayTitle || item.name}
            </td>
            <td>${item.path}</td>
            <td><span class="dept-badge">${item.deptId}</span></td>
            <td>
                ${item.tags.map(t => `<span class="tag-chip">${t}</span>`).join(' ')}
            </td>
            <td>${item.fileSize}</td>
            <td>${item.updatedAt}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="viewFileDetail('${item.id}')" title="查看詳情">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editFileTags('${item.id}')" title="編輯標籤">
                        <i class="fa-solid fa-tags"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('search-result-count').textContent = items.length;
}

function doFileSearch() {
    const keyword = document.getElementById('searchKeyword').value;
    const dept = document.getElementById('searchDept').value;
    const fileType = document.getElementById('searchFileType').value;
    
    const filters = {};
    if (keyword) filters.keyword = keyword;
    if (dept && dept !== 'all') filters.deptId = dept;
    if (fileType && fileType !== 'all') {
        // 根據檔案類型篩選
        filters.fileKind = fileType;
    }
    
    renderSearchResults(filters);
}

function viewFileDetail(fileId) {
    const item = window.__sharedKmData.indexItems.find(i => i.id === fileId);
    const content = window.__sharedKmData.fileContents[fileId];
    
    if (!item) return;
    
    document.getElementById('detailFileName').textContent = item.displayTitle || item.name;
    document.getElementById('detailFilePath').textContent = item.path;
    document.getElementById('detailFileSize').textContent = item.fileSize;
    document.getElementById('detailFileType').textContent = item.fileKind.toUpperCase();
    document.getElementById('detailCreatedAt').textContent = item.createdAt;
    document.getElementById('detailUpdatedAt').textContent = item.updatedAt;
    document.getElementById('detailViews').textContent = item.views;
    document.getElementById('detailDownloads').textContent = item.downloads;
    document.getElementById('detailTags').innerHTML = item.tags.map(t => `<span class="tag-chip">${t}</span>`).join(' ');
    
    // 顯示檔案內容摘要
    const summaryContainer = document.getElementById('detailSummary');
    if (content) {
        summaryContainer.innerHTML = `
            <h4>${content.title}</h4>
            <p>${content.summary}</p>
            ${Object.entries(content.sections || {}).map(([k, v]) => `
                <div class="detail-section">
                    <strong>${k}：</strong>${v}
                </div>
            `).join('')}
        `;
    } else {
        summaryContainer.innerHTML = '<p class="empty-text">暫無摘要內容</p>';
    }
    
    openModal('fileDetailModal');
}

function editFileTags(fileId) {
    const item = window.__sharedKmData.indexItems.find(i => i.id === fileId);
    if (!item) return;
    
    document.getElementById('editFileTagsId').value = fileId;
    document.getElementById('editFileTagsName').textContent = item.name;
    
    // 渲染標籤選擇
    const container = document.getElementById('fileTagsCheckboxes');
    container.innerHTML = window.__sharedKmData.allTags.map(tag => `
        <label class="tag-checkbox">
            <input type="checkbox" value="${tag.name}" ${item.tags.includes(tag.name) ? 'checked' : ''}>
            <span class="tag-chip-select" style="border-color: ${tag.color}">${tag.name}</span>
        </label>
    `).join('');
    
    openModal('editFileTagsModal');
}

function saveFileTags() {
    const fileId = document.getElementById('editFileTagsId').value;
    const checkboxes = document.querySelectorAll('#fileTagsCheckboxes input[type="checkbox"]:checked');
    const tags = Array.from(checkboxes).map(cb => cb.value);
    
    window.__sharedKmData.api.updateFileTags(fileId, tags);
    window.__sharedKmData.api.saveToStorage();
    
    renderSearchResults();
    closeModal('editFileTagsModal');
    showToast('標籤已更新', 'success');
}

// ============================================
// AI 加值應用設定
// ============================================
function initAiSettingsManagement() {
    renderAiSettings();
    renderAiUsageStats();
}

function renderAiSettings() {
    const settings = window.__sharedKmData.aiSettings;
    
    // 總開關
    document.getElementById('aiMasterSwitch').checked = settings.enabled;
    
    // 各功能開關
    Object.entries(settings.features).forEach(([key, feature]) => {
        const checkbox = document.getElementById(`aiFeature_${key}`);
        if (checkbox) checkbox.checked = feature.enabled;
    });
    
    // 模型設定
    document.getElementById('aiModel').value = settings.model;
    document.getElementById('aiMaxTokens').value = settings.maxTokens;
    document.getElementById('aiTemperature').value = settings.temperature;
}

function renderAiUsageStats() {
    const stats = window.__sharedKmData.aiSettings.usageStats;
    
    document.getElementById('aiTotalQueries').textContent = stats.totalQueries.toLocaleString();
    document.getElementById('aiMonthlyQueries').textContent = stats.thisMonth;
    document.getElementById('aiAvgResponseTime').textContent = stats.avgResponseTime;
}

function toggleAiMaster() {
    const enabled = document.getElementById('aiMasterSwitch').checked;
    window.__sharedKmData.aiSettings.enabled = enabled;
    window.__sharedKmData.api.saveToStorage();
    
    // 禁用/啟用所有功能開關
    document.querySelectorAll('.ai-feature-switch').forEach(sw => {
        sw.disabled = !enabled;
    });
    
    showToast(enabled ? 'AI 功能已啟用' : 'AI 功能已關閉', 'success');
}

function toggleAiFeature(featureKey) {
    const checkbox = document.getElementById(`aiFeature_${featureKey}`);
    if (!checkbox) return;
    
    window.__sharedKmData.aiSettings.features[featureKey].enabled = checkbox.checked;
    window.__sharedKmData.api.saveToStorage();
    
    showToast('設定已儲存', 'success');
}

function saveAiModelSettings() {
    const model = document.getElementById('aiModel').value;
    const maxTokens = parseInt(document.getElementById('aiMaxTokens').value);
    const temperature = parseFloat(document.getElementById('aiTemperature').value);
    
    window.__sharedKmData.aiSettings.model = model;
    window.__sharedKmData.aiSettings.maxTokens = maxTokens;
    window.__sharedKmData.aiSettings.temperature = temperature;
    window.__sharedKmData.api.saveToStorage();
    
    showToast('模型設定已儲存', 'success');
}

// ============================================
// 輔助函數
// ============================================
function getFileIcon(fileKind) {
    const icons = {
        'pdf': 'fa-file-pdf text-red',
        'doc': 'fa-file-word text-blue',
        'docx': 'fa-file-word text-blue',
        'xls': 'fa-file-excel text-green',
        'xlsx': 'fa-file-excel text-green',
        'ppt': 'fa-file-powerpoint text-orange',
        'pptx': 'fa-file-powerpoint text-orange',
        'folder': 'fa-folder text-yellow',
    };
    return icons[fileKind] || 'fa-file';
}

function getFileIconByName(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return getFileIcon(ext);
}

function getVisibilityLabel(mode) {
    const labels = {
        'whitelist': '白名單',
        'blacklist': '黑名單',
        'inherit': '繼承上層',
        'public': '公開'
    };
    return labels[mode] || mode;
}

function getActionIcon(action) {
    const icons = {
        'view': 'fa-eye',
        'download': 'fa-download',
        'edit': 'fa-pen',
        'upload': 'fa-upload',
        'delete': 'fa-trash'
    };
    return icons[action] || 'fa-circle';
}

function getActionLabel(action) {
    const labels = {
        'view': '檢視',
        'download': '下載',
        'edit': '編輯',
        'upload': '上傳',
        'delete': '刪除'
    };
    return labels[action] || action;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 等待共用資料載入
    if (window.__sharedKmData) {
        initKmAdmin();
    } else {
        // 如果共用資料還沒載入，等待一下
        setTimeout(initKmAdmin, 100);
    }
});
