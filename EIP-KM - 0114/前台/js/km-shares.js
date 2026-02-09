/**
 * km-shares.js
 * 分享中心專用 JS
 */

/**
 * 初始化分享資料（從 localStorage 讀取）
 */
function loadShareData() {
    // 確保分享資料已初始化
    if (typeof initShareData === 'function') {
        initShareData();
    }
    
    // 從 localStorage 讀取最新資料
    window.__kmData.sharedWithMe = JSON.parse(localStorage.getItem('sharedWithMe') || '[]');
    window.__kmData.sharedByMe = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    window.__kmData.shareLinks = JSON.parse(localStorage.getItem('shareLinks') || '[]');
}

/**
 * 渲染分享中心
 */
function renderKmShares() {
    // 先載入最新資料
    loadShareData();
    
    const withMeBody = document.getElementById('withMeBody');
    if (withMeBody) {
        const items = window.__kmData.sharedWithMe || [];
        withMeBody.innerHTML = items.length > 0 ? items.map(item => `
            <tr>
                <td>
                    <div class="file-name">
                        <i class="fa-solid ${getFileIcon(item)}"></i>
                        <span>${getDisplayName(item)}</span>
                    </div>
                </td>
                <td>${(item.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</td>
                <td>${item.type === 'folder' ? '資料夾' : '檔案'}</td>
                <td>
                    <div class="owner-info">
                        <span class="owner-name">${item.owner || '-'}</span>
                        ${item.ownerDept ? `<span class="owner-dept">${item.ownerDept}</span>` : ''}
                    </div>
                </td>
                <td>${(item.perms || []).join(', ')}</td>
                <td>${item.sharedAt || '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn small ghost" onclick="viewSharedFile('${item.id}')" title="檢視">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn small ghost" onclick="addToMySpace('${item.id}')" title="加入近期存取">
                            <i class="fa-solid fa-folder-plus"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="7" class="empty-state text-center">目前沒有與您共用的項目</td></tr>';
    }
    
    const byMeBody = document.getElementById('byMeBody');
    if (byMeBody) {
        const items = window.__kmData.sharedByMe || [];
        byMeBody.innerHTML = items.length > 0 ? items.map(item => `
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
                <td><span class="status-badge ${getStatusClass(item.status)}">${item.status || '-'}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn small ghost" onclick="editShare('${item.id}')" title="編輯共用">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn small ghost danger" onclick="removeShareItem('${item.id}')" title="取消共用">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="7" class="empty-state text-center">目前沒有共用的項目</td></tr>';
    }

    const shareLinkBody = document.getElementById('shareLinkBody');
    if (shareLinkBody) {
        const items = window.__kmData.shareLinks || [];
        shareLinkBody.innerHTML = items.length > 0 ? items.map(item => {
            const status = getShareLinkStatus(item);
            const targetsText = formatShareList(item.targets);
            const permsText = formatShareList(item.perms);
            return `
            <tr>
                <td>
                    <div class="file-name">
                        <i class="fa-solid ${getFileIcon(item)}"></i>
                        <span>${getDisplayName(item)}</span>
                    </div>
                </td>
                <td>${targetsText || '-'}</td>
                <td>${permsText || '-'}</td>
                <td>${item.expiresAt || '-'}</td>
                <td><span class="status-badge ${getStatusClass(status)}">${status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn small ghost" onclick="copyShareLink('${item.id}')" title="複製連結">
                            <i class="fa-solid fa-link"></i>
                        </button>
                        <button class="btn small ghost" onclick="extendShareLink('${item.id}', 7)" title="延長 7 天">
                            <i class="fa-solid fa-clock"></i>
                        </button>
                        <button class="btn small ghost danger" onclick="toggleShareLink('${item.id}')" title="停用/啟用">
                            <i class="fa-solid fa-ban"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
        }).join('') : '<tr><td colspan="6" class="empty-state text-center">目前沒有分享連結</td></tr>';
    }
}

/**
 * 取得狀態樣式 class
 */
function getStatusClass(status) {
    switch (status) {
        case '生效中': return 'active';
        case '已停用': return 'inactive';
        case '待審核': return 'pending';
        case '已過期': return 'expired';
        default: return '';
    }
}

/**
 * 取得分享連結狀態
 */
function getShareLinkStatus(item) {
    if ((item.status || '').includes('停用')) return '已停用';
    if (isShareLinkExpired(item.expiresAt)) return '已過期';
    return item.status || '生效中';
}

/**
 * 格式化分享欄位
 */
function formatShareList(value) {
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'string') return value;
    return '';
}

/**
 * 檢查分享連結是否過期
 */
function isShareLinkExpired(expiresAt) {
    if (!expiresAt) return false;
    const exp = new Date(`${expiresAt}T23:59:59`);
    if (Number.isNaN(exp.getTime())) return false;
    return exp.getTime() < Date.now();
}

/**
 * 檢視共用檔案
 */
function viewSharedFile(shareId) {
    const items = JSON.parse(localStorage.getItem('sharedWithMe') || '[]');
    const item = items.find(i => i.id === shareId);
    if (item) {
        showToast('正在開啟: ' + item.name);
    }
}

/**
 * 加入近期存取（建立捷徑）
 */
function addToMySpace(shareId) {
    const items = JSON.parse(localStorage.getItem('sharedWithMe') || '[]');
    const item = items.find(i => i.id === shareId);
    if (item) {
        showToast('已將「' + item.name + '」加入近期存取捷徑');
    }
}

/**
 * 編輯共用設定
 */
function editShare(shareId) {
    const items = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const item = items.find(i => i.id === shareId);
    if (item) {
        // 跳轉到近期存取並開啟編輯
        showToast('請前往「近期存取」編輯共用設定');
    }
}

/**
 * 移除共用
 */
function removeShareItem(shareId) {
    const items = JSON.parse(localStorage.getItem('sharedByMe') || '[]');
    const item = items.find(i => i.id === shareId);
    
    if (item && confirm(`確定要取消共用「${item.name}」嗎？`)) {
        const newItems = items.filter(i => i.id !== shareId);
        localStorage.setItem('sharedByMe', JSON.stringify(newItems));
        window.__kmData.sharedByMe = newItems;
        renderKmShares();
        showToast('已取消共用');
    }
}

/**
 * 建立分享連結
 */
function createShareLink() {
    showToast('請從檔案清單選擇項目並建立分享連結');
}

/**
 * 複製分享連結
 */
function copyShareLink(shareId) {
    const items = JSON.parse(localStorage.getItem('shareLinks') || '[]');
    const item = items.find(i => i.id === shareId);
    if (!item || !item.link) {
        showToast('找不到分享連結');
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(item.link)
            .then(() => showToast('已複製分享連結'))
            .catch(() => showToast('複製失敗，請手動複製'));
    } else {
        const temp = document.createElement('textarea');
        temp.value = item.link;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('已複製分享連結');
    }
}

/**
 * 延長分享連結期限
 */
function extendShareLink(shareId, days) {
    const items = JSON.parse(localStorage.getItem('shareLinks') || '[]');
    const item = items.find(i => i.id === shareId);
    if (!item) return;

    const extendDays = Number(days) || 7;
    const baseDate = item.expiresAt && !isShareLinkExpired(item.expiresAt)
        ? new Date(`${item.expiresAt}T00:00:00`)
        : new Date();
    baseDate.setDate(baseDate.getDate() + extendDays);
    item.expiresAt = baseDate.toISOString().split('T')[0];
    item.status = '生效中';

    localStorage.setItem('shareLinks', JSON.stringify(items));
    window.__kmData.shareLinks = items;
    renderKmShares();
    showToast(`已延長有效期限至 ${item.expiresAt}`);
}

/**
 * 停用/啟用分享連結
 */
function toggleShareLink(shareId) {
    const items = JSON.parse(localStorage.getItem('shareLinks') || '[]');
    const item = items.find(i => i.id === shareId);
    if (!item) return;

    if (item.status === '已停用') {
        item.status = '生效中';
        showToast('已啟用分享連結');
    } else {
        item.status = '已停用';
        showToast('已停用分享連結');
    }

    localStorage.setItem('shareLinks', JSON.stringify(items));
    window.__kmData.shareLinks = items;
    renderKmShares();
}

/**
 * 切換分享頁籤
 */
function switchShareTab(which) {
    const tabs = document.querySelectorAll('.tabs .tab-btn');
    const commonPanel = document.getElementById('shareCommonPanel');
    const linkPanel = document.getElementById('shareLinkPanel');

    if (which === 'common') {
        tabs[0]?.classList.add('active');
        tabs[1]?.classList.remove('active');
        if (commonPanel) commonPanel.style.display = 'block';
        if (linkPanel) linkPanel.style.display = 'none';
    } else {
        tabs[0]?.classList.remove('active');
        tabs[1]?.classList.add('active');
        if (commonPanel) commonPanel.style.display = 'none';
        if (linkPanel) linkPanel.style.display = 'block';
    }
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('km-shares.html')) {
        renderKmShares();
    }
});
