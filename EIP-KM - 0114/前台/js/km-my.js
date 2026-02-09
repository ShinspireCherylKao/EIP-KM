/**
 * km-my.js
 * 我的頁面專用 JS
 */

/**
 * 渲染「我的」頁面
 */
function renderKmMy() {
    const idx = new Map(window.__kmData.indexItems.map(i => [i.id, i]));
    
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
    
    const favorites = getFavorites();
    const favBody = document.getElementById('favBody');
    
    if (favBody) {
        if (favorites.length === 0) {
            favBody.innerHTML = '<tr><td colspan="6" class="mut text-center">尚無收藏</td></tr>';
        } else {
            const dbData = localStorage.getItem('fileDatabase');
            const db = dbData ? JSON.parse(dbData) : { files: [] };
            
            const favItems = favorites.map(fileName => {
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
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    }
}

/**
 * 切換我的頁籤
 */
function switchMyTab(which) {
    const tabs = document.querySelectorAll('.tabs .tab-btn');
    const recentPanel = document.getElementById('recentPanel');
    const favPanel = document.getElementById('favPanel');
    
    if (which === 'recent') {
        tabs[0]?.classList.add('active');
        tabs[1]?.classList.remove('active');
        if (recentPanel) recentPanel.style.display = 'block';
        if (favPanel) favPanel.style.display = 'none';
    } else {
        tabs[0]?.classList.remove('active');
        tabs[1]?.classList.add('active');
        if (recentPanel) recentPanel.style.display = 'none';
        if (favPanel) favPanel.style.display = 'block';
    }
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('km-my.html')) {
        renderKmMy();
    }
});
