/**
 * km-tags.js
 * 標籤頁專用 JS
 */

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
                <button class="btn small ghost"><i class="fa-solid fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('km-tags.html')) {
        renderKmTags();
    }
});
