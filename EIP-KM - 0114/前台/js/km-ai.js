/**
 * km-ai.js  
 * AI 加值頁面專用 JS（完整功能）
 */

/**
 * 切換 AI 頁籤
 */
function switchAiTab(tabId) {
    document.querySelectorAll('.ai-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    document.querySelectorAll('.ai-panel').forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById('ai-' + tabId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

/**
 * 初始化 AI 檔案選擇器
 */
function initAiFileSelectors() {
    console.log('AI 檔案選擇器初始化中...');
    // 初始化比較檔案選擇器
    const compareFileA = document.getElementById('compareFileA');
    const compareFileB = document.getElementById('compareFileB');
    const summaryFile = document.getElementById('summaryFile');
    
    if (window.__kmData && window.__kmData.indexItems) {
        const files = window.__kmData.indexItems.filter(i => i.type === 'file');
        const options = files.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
        
        if (compareFileA) compareFileA.innerHTML = '<option value="">請選擇檔案...</option>' + options;
        if (compareFileB) compareFileB.innerHTML = '<option value="">請選擇檔案...</option>' + options;
        if (summaryFile) summaryFile.innerHTML = '<option value="">請選擇檔案...</option>' + options;
    }
}

/**
 * 填入快速提問
 */
function fillQuickQuestion(question) {
    const input = document.getElementById('aiSearchInput');
    if (input) {
        input.value = question;
        input.focus();
    }
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
        if (typeof updateSearchScope === 'function') {
            updateSearchScope();
        }
    }
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
 * 檢查檔案權限
 * @param {Object} item - 檔案項目
 * @returns {Object} { hasAccess: boolean, reason: string }
 */
function checkFilePermission(item) {
    // 取得當前使用者資訊
    const me = window.__kmData?.me || { role: 'user', dept: 'IT' };
    const dept = window.__kmData?.depts?.find(d => d.id === item.deptId);
    
    // 管理員有完全權限
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
            if (item.deptId !== me.dept && me.role !== 'admin') {
                return { hasAccess: false, reason: '您不在此檔案的授權名單中' };
            }
            break;
        case 'whitelist':
            break;
        case 'inherit':
            break;
    }
    
    // 檢查操作權限
    if (!item.actionsAllowed?.includes('view')) {
        return { hasAccess: false, reason: '無檢視權限' };
    }
    
    return { hasAccess: true, reason: '' };
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
 * 產生比較類型的回應（表格格式）
 */
function generateCompareResponse(question, mentionedProjects = []) {
    const q = question.toLowerCase();
    const items = window.__kmData?.indexItems?.filter(i => i.type === 'file') || [];
    
    // 如果有指定專案，只篩選該專案的檔案
    let scopedItems = items;
    if (mentionedProjects.length > 0) {
        scopedItems = items.filter(item => {
            return mentionedProjects.some(proj => {
                if (proj === 'HR') {
                    return item.deptId === 'HR';
                }
                return item.path?.includes(proj) || item.tags?.includes(proj);
            });
        });
    }
    
    // 根據問題關鍵字篩選相關檔案
    let relatedItems = [];
    if (/合約/.test(q)) {
        relatedItems = scopedItems.filter(i => i.tags?.includes('合約'));
    } else if (/提案|簡報/.test(q)) {
        relatedItems = scopedItems.filter(i => i.tags?.includes('提案') || i.fileKind === 'pptx');
    } else if (/預算|費用|帳務|報價|旅費/.test(q)) {
        relatedItems = scopedItems.filter(i => i.tags?.includes('帳務') || i.fileKind === 'xlsx');
    } else {
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
    
    // 產生比較表格
    if (/合約/.test(q)) {
        return generateContractCompareTable(accessible.filter(i => i.tags?.includes('合約')), permissionNotice, mentionedProjects);
    } else if (/提案|簡報/.test(q)) {
        return generatePresentationCompareTable(accessible.filter(i => i.tags?.includes('提案') || i.fileKind === 'pptx'), permissionNotice, mentionedProjects);
    } else if (/預算|費用|帳務|報價|旅費/.test(q)) {
        return generateFinanceCompareTable(accessible.filter(i => i.tags?.includes('帳務') || i.fileKind === 'xlsx'), permissionNotice, mentionedProjects, question);
    } else {
        return generateDefaultCompareTable(accessible, permissionNotice, question, mentionedProjects);
    }
}

/**
 * 產生合約比較表格
 */
function generateContractCompareTable(files, permissionNotice, mentionedProjects = []) {
    if (files.length === 0) {
        return `<p>未找到您有權限存取的合約文件。</p>${permissionNotice}`;
    }
    
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
 */
function generatePresentationCompareTable(files, permissionNotice, mentionedProjects = []) {
    if (files.length === 0) {
        return `<p>未找到您有權限存取的提案簡報。</p>${permissionNotice}`;
    }
    
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
 * 產生財務資料比較表格（含旅費表格）
 */
function generateFinanceCompareTable(files, permissionNotice, mentionedProjects = [], question = '') {
    // 特殊處理：近三年旅費表格差異
    if (/旅費|差旅/.test(question) && /近.*年|三年|3年/.test(question)) {
        return generateTravelExpenseCompareTable(permissionNotice, question);
    }
    
    if (files.length === 0) {
        return `<p>未找到您有權限存取的財務資料。</p>${permissionNotice}`;
    }
    
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
 * 產生近三年旅費表格差異比較
 */
function generateTravelExpenseCompareTable(permissionNotice, question) {
    return `
        <p>根據您的問題「${escapeHtml(question)}」，我比較了近三年的申請旅費表格，以下是主要差異：</p>
        ${permissionNotice}
        <div class="ai-table-wrapper">
            <table class="ai-compare-table">
                <thead>
                    <tr>
                        <th>比較項目</th>
                        <th>2024 年版</th>
                        <th>2025 年版</th>
                        <th>2026 年版</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>表格版本</strong></td>
                        <td>v2.1</td>
                        <td>v3.0</td>
                        <td>v3.2</td>
                    </tr>
                    <tr>
                        <td><strong>住宿費上限</strong></td>
                        <td>NT$ 2,500/晚</td>
                        <td>NT$ 3,000/晚</td>
                        <td>NT$ 3,500/晚</td>
                    </tr>
                    <tr>
                        <td><strong>餐費標準</strong></td>
                        <td>NT$ 500/日</td>
                        <td>NT$ 600/日</td>
                        <td>NT$ 700/日</td>
                    </tr>
                    <tr>
                        <td><strong>交通費規定</strong></td>
                        <td>僅限大眾運輸</td>
                        <td>大眾運輸 + 計程車（需說明）</td>
                        <td>大眾運輸 + 計程車 + 租車（需主管核准）</td>
                    </tr>
                    <tr>
                        <td><strong>申請時限</strong></td>
                        <td>返回後 5 個工作天</td>
                        <td>返回後 7 個工作天</td>
                        <td>返回後 7 個工作天</td>
                    </tr>
                    <tr>
                        <td><strong>核銷方式</strong></td>
                        <td>紙本申請</td>
                        <td>線上系統 + 紙本單據</td>
                        <td>全線上（電子發票可直接上傳）</td>
                    </tr>
                    <tr>
                        <td><strong>審批層級</strong></td>
                        <td>部門主管 → 財務</td>
                        <td>部門主管 → 財務</td>
                        <td>部門主管 → 財務（超過 NT$10,000 需副總核准）</td>
                    </tr>
                    <tr>
                        <td><strong>新增欄位</strong></td>
                        <td>-</td>
                        <td>出差目的說明</td>
                        <td>出差成果報告、碳排放計算</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="ai-summary">
            <strong>📋 主要變更摘要：</strong><br>
            • 2025 年起提高住宿、餐費標準，反映物價上漲<br>
            • 2025 年導入線上申請系統，簡化流程<br>
            • 2026 年新增碳排放計算欄位，配合公司 ESG 政策<br>
            • 2026 年大額支出（超過 NT$10,000）需額外副總核准
        </p>
        <p class="ai-source">📂 來源：HR/SOP/差旅報銷規範</p>
    `;
}

/**
 * 產生預設比較表格
 */
function generateDefaultCompareTable(files, permissionNotice, question, mentionedProjects = []) {
    if (files.length === 0) {
        return `<p>未找到您有權限存取的相關文件。</p>${permissionNotice}`;
    }
    
    const maxDisplay = mentionedProjects.length > 0 ? mentionedProjects.length + 1 : 3;
    const displayFiles = files.slice(0, maxDisplay);
    const headers = displayFiles.map(f => `<th>${f.name}</th>`).join('');
    
    const projectDesc = mentionedProjects.length > 0 
        ? mentionedProjects.join('、') + ' 的'
        : '';
    
    return `
        <p>根據您的問題「${escapeHtml(question)}」，我比較了${projectDesc}相關文件的內容差異：</p>
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
 */
function generateMultiFileResponse(question, mentionedProjects = []) {
    const items = window.__kmData?.indexItems?.filter(i => i.type === 'file') || [];
    const q = question.toLowerCase();
    
    let scopedItems = items;
    if (mentionedProjects.length > 0) {
        scopedItems = items.filter(item => {
            return mentionedProjects.some(proj => {
                if (proj === 'HR') {
                    return item.deptId === 'HR';
                }
                return item.path?.includes(proj) || item.tags?.includes(proj);
            });
        });
    }
    
    let filteredItems = scopedItems;
    
    if (/合約/.test(q)) {
        filteredItems = scopedItems.filter(i => i.tags?.includes('合約'));
    } else if (/提案|簡報/.test(q)) {
        filteredItems = scopedItems.filter(i => i.tags?.includes('提案') || i.fileKind === 'pptx');
    } else if (/帳務|財務|預算/.test(q)) {
        filteredItems = scopedItems.filter(i => i.tags?.includes('帳務') || i.fileKind === 'xlsx');
    }
    
    const { accessible, restricted } = filterByPermission(filteredItems);
    const permissionNotice = generatePermissionNotice(restricted);
    
    if (accessible.length === 0 && restricted.length > 0) {
        return `
            <p>根據您的問題，找到了 ${restricted.length} 個相關檔案，但您沒有存取權限。</p>
            ${permissionNotice}
        `;
    }
    
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
 */
function generateGeneralResponse(question, mentionedProjects = []) {
    const items = window.__kmData?.indexItems?.filter(i => i.type === 'file') || [];
    const q = question.toLowerCase();
    
    let scopedItems = items;
    if (mentionedProjects.length > 0) {
        scopedItems = items.filter(item => {
            return mentionedProjects.some(proj => {
                if (proj === 'HR') {
                    return item.deptId === 'HR';
                }
                return item.path?.includes(proj) || item.tags?.includes(proj);
            });
        });
    }
    
    let relatedItems = scopedItems.filter(item => {
        const searchText = `${item.name} ${item.tags?.join(' ') || ''} ${item.path}`.toLowerCase();
        const keywords = q.split(/\s+/).filter(k => k.length > 1);
        return keywords.some(kw => searchText.includes(kw)) || 
               item.tags?.some(tag => q.includes(tag.toLowerCase()));
    });
    
    if (relatedItems.length === 0) {
        if (mentionedProjects.length > 0) {
            relatedItems = scopedItems.slice(0, 3);
        } else {
            relatedItems = items.filter(i => i.deptId === 'HR').slice(0, 3);
        }
    }
    
    const { accessible, restricted } = filterByPermission(relatedItems);
    const permissionNotice = generatePermissionNotice(restricted);
    
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
 */
function generateDetailedCompareResponse(files, mentionedProjects, question, permissionNotice) {
    const fileContents = window.__kmFileContents || {};
    const filesWithContent = files.filter(f => fileContents[f.id]);
    
    if (filesWithContent.length < 2) {
        const projectDesc = mentionedProjects.join('、');
        const headers = files.slice(0, 4).map(f => `<th>${f.name.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '')}</th>`).join('');
        
        const allSections = new Set();
        files.slice(0, 4).forEach(f => {
            const content = fileContents[f.id];
            if (content && content.sections) {
                Object.keys(content.sections).forEach(key => allSections.add(key));
            }
        });
        
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
        
        return `
            <p>根據您的問題「${escapeHtml(question)}」，我找到了 ${projectDesc} 的相關文件：</p>
            ${permissionNotice}
            ${files.slice(0, 5).map(f => `<p>📄 <strong>${f.name}</strong> - ${f.tags?.slice(0, 2).join('、') || f.path}</p>`).join('')}
            <p class="ai-source">📂 來源：${files.map(f => f.path).filter((v, i, a) => a.indexOf(v) === i).join('、')}</p>
        `;
    }
    
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
    
    const allSections = new Set();
    displayFiles.forEach(f => {
        const content = fileContents[f.id];
        if (content?.sections) {
            Object.keys(content.sections).forEach(key => allSections.add(key));
        }
    });
    
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
 */
function downloadKmFile(fileId, fileName) {
    const toast = document.createElement('div');
    toast.className = 'km-download-toast';
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>檔案「${fileName}」已開始下載</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    console.log(`[KM] 下載檔案: ${fileId} - ${fileName}`);
    
    const mockContent = `這是 ${fileName} 的模擬內容\n\n在實際專案中，此處會下載真實的檔案。`;
    const blob = new Blob([mockContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.(pdf|docx?|xlsx?|pptx?)$/i, '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * 取得檔案圖示類別
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
 * 文件比較功能
 */
function compareFiles() {
    const fileA = document.getElementById('compareFileA').value;
    const fileB = document.getElementById('compareFileB').value;
    
    if (!fileA || !fileB) {
        alert('請選擇兩個檔案進行比較');
        return;
    }
    
    const resultDiv = document.getElementById('compareResult');
    resultDiv.innerHTML = `
        <div class="compare-loading">
            <i class="fa-solid fa-spinner fa-spin"></i> 正在分析文件差異...
        </div>
    `;
    
    setTimeout(() => {
        const itemA = window.__kmData?.indexItems?.find(i => i.id === fileA);
        const itemB = window.__kmData?.indexItems?.find(i => i.id === fileB);
        
        resultDiv.innerHTML = `
            <h4>文件比較結果</h4>
            <div class="ai-table-wrapper">
                <table class="ai-compare-table">
                    <thead>
                        <tr>
                            <th>比較項目</th>
                            <th>${itemA?.name || '檔案 A'}</th>
                            <th>${itemB?.name || '檔案 B'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>檔案類型</strong></td>
                            <td>${itemA?.fileKind?.toUpperCase() || '-'}</td>
                            <td>${itemB?.fileKind?.toUpperCase() || '-'}</td>
                        </tr>
                        <tr>
                            <td><strong>所屬部門</strong></td>
                            <td>${itemA?.deptId || '-'}</td>
                            <td>${itemB?.deptId || '-'}</td>
                        </tr>
                        <tr>
                            <td><strong>更新日期</strong></td>
                            <td>${itemA?.updatedAt || '-'}</td>
                            <td>${itemB?.updatedAt || '-'}</td>
                        </tr>
                        <tr>
                            <td><strong>標籤</strong></td>
                            <td>${itemA?.tags?.join('、') || '-'}</td>
                            <td>${itemB?.tags?.join('、') || '-'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }, 1500);
}

/**
 * 產生智能摘要
 */
function generateSummary() {
    const fileId = document.getElementById('summaryFile').value;
    
    if (!fileId) {
        alert('請選擇要摘要的檔案');
        return;
    }
    
    const resultDiv = document.getElementById('summaryResult');
    resultDiv.innerHTML = `
        <div class="summary-loading">
            <i class="fa-solid fa-spinner fa-spin"></i> 正在產生摘要...
        </div>
    `;
    
    setTimeout(() => {
        const item = window.__kmData?.indexItems?.find(i => i.id === fileId);
        
        resultDiv.innerHTML = `
            <h4>${item?.name || '文件'} 摘要</h4>
            <div class="summary-content">
                <p><strong>文件概述：</strong></p>
                <p>本文件為 ${item?.tags?.[0] || '一般'} 類型文件，主要內容包含相關政策規範與操作說明。</p>
                
                <p><strong>重點摘要：</strong></p>
                <ul>
                    <li>適用對象：全體員工</li>
                    <li>生效日期：${item?.updatedAt || '2025-01-01'}</li>
                    <li>主要章節：政策說明、操作流程、注意事項</li>
                </ul>
                
                <p><strong>關鍵字：</strong></p>
                <p>${item?.tags?.map(t => `<span class="tag">${t}</span>`).join(' ') || '-'}</p>
            </div>
        `;
    }, 2000);
}

/**
 * 產生知識圖譜
 */
function generateKnowledgeGraph() {
    const graphCanvas = document.getElementById('graphCanvas');
    
    graphCanvas.innerHTML = `
        <div class="graph-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>AI 正在分析文件關聯性...</p>
        </div>
    `;
    
    setTimeout(() => {
        graphCanvas.innerHTML = `
            <div class="graph-result">
                <div class="graph-header">
                    <h4><i class="fa-solid fa-diagram-project"></i> 知識圖譜分析結果</h4>
                    <div class="graph-stats">
                        <span class="stat-item"><i class="fa-solid fa-file"></i> 文件數：156</span>
                        <span class="stat-item"><i class="fa-solid fa-link"></i> 關聯數：324</span>
                        <span class="stat-item"><i class="fa-solid fa-tags"></i> 主題群：8</span>
                    </div>
                </div>
                
                <div class="graph-canvas-inner">
                    <svg width="100%" height="400" style="background:#f5f5f5;">
                        <!-- 中心節點 -->
                        <circle cx="400" cy="200" r="50" fill="#4285f4" stroke="#fff" stroke-width="3"/>
                        <text x="400" y="205" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">HR 政策</text>
                        
                        <!-- 周圍節點 -->
                        <circle cx="250" cy="120" r="35" fill="#34a853" stroke="#fff" stroke-width="2"/>
                        <text x="250" y="125" text-anchor="middle" fill="#fff" font-size="11">請假制度</text>
                        <line x1="250" y1="120" x2="400" y2="200" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="550" cy="120" r="35" fill="#34a853" stroke="#fff" stroke-width="2"/>
                        <text x="550" y="125" text-anchor="middle" fill="#fff" font-size="11">考勤規範</text>
                        <line x1="550" y1="120" x2="400" y2="200" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="250" cy="280" r="35" fill="#fbbc04" stroke="#fff" stroke-width="2"/>
                        <text x="250" y="285" text-anchor="middle" fill="#fff" font-size="11">福利說明</text>
                        <line x1="250" y1="280" x2="400" y2="200" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="550" cy="280" r="35" fill="#fbbc04" stroke="#fff" stroke-width="2"/>
                        <text x="550" y="285" text-anchor="middle" fill="#fff" font-size="11">獎懲辦法</text>
                        <line x1="550" y1="280" x2="400" y2="200" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="150" cy="200" r="30" fill="#ea4335" stroke="#fff" stroke-width="2"/>
                        <text x="150" y="205" text-anchor="middle" fill="#fff" font-size="10">SOP</text>
                        <line x1="150" y1="200" x2="400" y2="200" stroke="#999" stroke-width="2"/>
                        
                        <circle cx="650" cy="200" r="30" fill="#ea4335" stroke="#fff" stroke-width="2"/>
                        <text x="650" y="205" text-anchor="middle" fill="#fff" font-size="10">FAQ</text>
                        <line x1="650" y1="200" x2="400" y2="200" stroke="#999" stroke-width="2"/>
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
    const graphCanvas = document.getElementById('graphCanvas');
    graphCanvas.innerHTML = `<p class="text-center mut">點擊「產生知識圖譜」開始分析...</p>`;
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('km-ai.html')) {
        initAiFileSelectors();
    }
});
