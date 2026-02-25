/**
 * contacts-script.js
 * 通訊錄功能腳本
 */

// ===== 通訊錄資料 =====
const contactsData = [
    // 總經理室
    { dept: '總經理室', subGroup: '-', title: '總經理', nameZh: '李佳蔚', nameEn: 'Harry LI', email: 'harry@shinda.com.tw' },
    { dept: '總經理室', subGroup: '-', title: '管理師', nameZh: '許惠林', nameEn: 'huilin hsu', email: 'huilin.hsu@shinda.com.tw' },

    // 董事長室
    { dept: '董事長室', subGroup: '-', title: '董事長', nameZh: '蔡宜芯', nameEn: 'Richio TS', email: 'richio@shinda.com.tw' },

    // 總公司
    { dept: '總公司', subGroup: '-', title: '經理', nameZh: '蔡宜芯', nameEn: 'Richio TS', email: 'richio@shinda.com.tw' },
    { dept: '總公司', subGroup: '-', title: '助理管理師', nameZh: '林育如', nameEn: 'Yuru LIN', email: 'yuru.lin@shinda.com.tw' },
    { dept: '總公司', subGroup: '-', title: '助理管理師', nameZh: '李佩芬', nameEn: 'peipei li', email: 'peipei.li@shinda.com.tw' },

    // 業務部
    { dept: '業務部', subGroup: '-', title: '組長', nameZh: '林信瑩', nameEn: 'Lesley LI', email: 'lesley.lin@shinda.com.tw' },
    { dept: '業務部', subGroup: '-', title: '資深管理師', nameZh: '林展億', nameEn: 'Charles L', email: 'charles.lin@shinda.com.tw' },
    { dept: '業務部', subGroup: '-', title: '助理管理師', nameZh: '王文玲', nameEn: 'Amy WAI', email: 'amy.wang@shinda.com.tw' },
    { dept: '業務部', subGroup: '-', title: '助理管理師', nameZh: '廖婀晴', nameEn: 'yiching liao', email: 'yiching.liao@shinda.com.tw' },

    // 客服品管組
    { dept: '客服品管組', subGroup: '-', title: '應用系統品質管理', nameZh: '許玉婷', nameEn: 'Michelle', email: 'michelle.hsu@shinda.com.tw' },
    { dept: '客服品管組', subGroup: '-', title: '資深管理師', nameZh: '陳法佑', nameEn: 'Angel Ch', email: 'angel.chen@shinda.com.tw' },
    { dept: '客服品管組', subGroup: '-', title: '管理師', nameZh: '沈彥宇', nameEn: 'Stanley S', email: 'stanley.shen@shinda.com.tw' },
    { dept: '客服品管組', subGroup: '-', title: '管理師', nameZh: '陳姿均', nameEn: 'Chloe Ch', email: 'chloe.chen@shinda.com.tw' },
    { dept: '客服品管組', subGroup: '-', title: '管理師', nameZh: '謝宜岑', nameEn: 'Yvonne H', email: 'yvonne.hsieh@shinda.com.tw' },

    // 新加坡新途
    { dept: '新加坡新途', subGroup: '-', title: '商務開發經理', nameZh: '郭雯琪', nameEn: 'daphne k', email: 'daphne.kuo@shinda.com.tw' },
    { dept: '新加坡新途', subGroup: '-', title: '高級管理師', nameZh: '陳思倩', nameEn: 'Lila chen', email: 'lila.chen@shinda.com.tw' },

    // BU1 數位轉型 - PM
    { dept: 'BU1 數位轉型', subGroup: 'PM', title: '資深管理師', nameZh: '古家寶', nameEn: 'Bella Ku', email: 'bella.ku@shinda.com.tw' },

    // BU1 數位轉型 - 開發一組
    { dept: 'BU1 數位轉型', subGroup: '開發一組', title: '組長', nameZh: '董至軒', nameEn: 'Large DONG', email: 'Large.dong@shinda.com.tw' },
    { dept: 'BU1 數位轉型', subGroup: '開發一組', title: '工程師', nameZh: '林瓊瑤', nameEn: 'Tina LIN', email: 'tina.lin@shinda.com.tw' },
    { dept: 'BU1 數位轉型', subGroup: '開發一組', title: '工程師', nameZh: '陳曉靜', nameEn: 'Nancy Chen', email: 'nancy.chen@shinda.com.tw' },
    { dept: 'BU1 數位轉型', subGroup: '開發一組', title: '工程師', nameZh: '楊雅婷', nameEn: 'Avril Yang', email: 'avril.yang@shinda.com.tw' },

    // BU1 數位轉型 - 開發二組
    { dept: 'BU1 數位轉型', subGroup: '開發二組', title: '組長', nameZh: '蕭耿維', nameEn: 'Wade Xiao', email: 'Wade.xiao@shinda.com.tw' },
    { dept: 'BU1 數位轉型', subGroup: '開發二組', title: '工程師', nameZh: '王思愛', nameEn: 'Natasha', email: 'Natasha.wang@shinda.com.tw' },
    { dept: 'BU1 數位轉型', subGroup: '開發二組', title: '工程師', nameZh: '李家豪', nameEn: 'Jiahao Li', email: 'jiahao.li@shinda.com.tw' },
    { dept: 'BU1 數位轉型', subGroup: '開發二組', title: '工程師', nameZh: '李所原', nameEn: 'Wayne Li', email: 'wayne.li@shinda.com.tw' },
    { dept: 'BU1 數位轉型', subGroup: '開發二組', title: '工程師', nameZh: 'Nguyễn Ngoc Dũng', nameEn: 'Nguyễn Ngoc Dũng', email: 'ngngocdung94@gmail.com' },

    // BU2 數位應用策 - 解決方案組
    { dept: 'BU2 數位應用策', subGroup: '解決方案組', title: '經理', nameZh: '許舜博', nameEn: 'Paul HSU', email: 'paul.hsu@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '解決方案組', title: '工程師', nameZh: '吳星瑋', nameEn: 'Phoebe Wu', email: 'phoebe.wu@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '解決方案組', title: '工程師', nameZh: '張丞緯', nameEn: 'ChungWei CHANG', email: 'chungwei.chang@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '解決方案組', title: '工程師', nameZh: 'Lai Hồng Khải', nameEn: 'Kai', email: 'laihongkhai.work@gmail.com' },

    // BU2 數位應用策 - 精實組
    { dept: 'BU2 數位應用策', subGroup: '精實組', title: '副理', nameZh: '洪名陞', nameEn: 'Vincent HONG', email: 'vincent.hong@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '精實組', title: '組長', nameZh: '鄭仲珉', nameEn: 'Kenny ZHENG', email: 'kenny.zheng@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '精實組', title: '組長', nameZh: 'Hà Huy Khôi', nameEn: 'Kuro', email: 'khoic3b1999@gmail.com' },
    { dept: 'BU2 數位應用策', subGroup: '精實組', title: '工程師', nameZh: '葉東諺', nameEn: 'dongyan ye', email: 'dongyan.ye@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '精實組', title: '工程師', nameZh: '黃妤樺', nameEn: 'Ashily Huang', email: 'ashily.huang@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '精實組', title: '工程師', nameZh: 'Trần Nguyễn Vĩnh Tười', nameEn: 'Michael', email: 'trannguyenvinhtuong@gmail.com' },

    // BU2 數位應用策 - 神燈精靈組
    { dept: 'BU2 數位應用策', subGroup: '神燈精靈組', title: '組長', nameZh: '林怡君', nameEn: 'Janet LIN', email: 'Janet.lin@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '神燈精靈組', title: '組長', nameZh: '柯宇慧', nameEn: 'Dora KE', email: 'dora.ke@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '神燈精靈組', title: '資深管理師', nameZh: '吳靖子', nameEn: 'Dora WU', email: 'Dora.wu@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '神燈精靈組', title: '資深工程師', nameZh: '張睿', nameEn: 'Zinzan CHANG', email: 'zinzan.chang@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '神燈精靈組', title: '管理師', nameZh: '高千薰', nameEn: 'Cheryl Kao', email: 'cheryl.kao@shinda.com.tw' },

    // BU2 數位應用策 - 共好達成組
    { dept: 'BU2 數位應用策', subGroup: '共好達成組', title: '組長', nameZh: '劉家妘', nameEn: 'Jia LIU', email: 'jia.liu@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '共好達成組', title: '管理師', nameZh: '蔡乙瑄', nameEn: 'Wendy Tsai', email: 'wendy.tsai@shinda.com.tw' },
    { dept: 'BU2 數位應用策', subGroup: '共好達成組', title: '管理師', nameZh: '廖哲甫', nameEn: 'Andra Liao', email: 'andra.liao@shinda.com.tw' },

    // BU3 雲端及資安 - PM一組
    { dept: 'BU3 雲端及資安', subGroup: 'PM一組', title: '助理管理師', nameZh: '林詩婷', nameEn: 'Lisa Lin', email: 'lisa.lin@shinda.com.tw' },
    { dept: 'BU3 雲端及資安', subGroup: 'PM一組', title: '助理管理師', nameZh: '蘇映綺', nameEn: 'Abby su', email: 'abby.su@shinda.com.tw' },

    // BU3 雲端及資安 - 研發一組
    { dept: 'BU3 雲端及資安', subGroup: '研發一組', title: '資深工程師', nameZh: '周理恩', nameEn: 'Lien ZHOU', email: 'lien.zhou@shinda.com.tw' },
    { dept: 'BU3 雲端及資安', subGroup: '研發一組', title: '工程師', nameZh: '李宜紘', nameEn: 'Eric Li', email: 'Eric.li@shinda.com.tw' },
    { dept: 'BU3 雲端及資安', subGroup: '研發一組', title: '工程師', nameZh: 'Võ Ngoc Đức', nameEn: 'Andy', email: 'ngocducvo1408@gmail.com' },

    // BU3 雲端及資安 - MIS
    { dept: 'BU3 雲端及資安', subGroup: 'MIS', title: '高級工程師', nameZh: '張文豪', nameEn: 'Tony ZHANG', email: 'Tony.Zhang@shinda.com.tw' },
    { dept: 'BU3 雲端及資安', subGroup: 'MIS', title: '工程師', nameZh: '張峻誠', nameEn: 'Jeff CHANG', email: 'jeff.chang@shinda.com.tw' },

    // BU0
    { dept: 'BU0', subGroup: '-', title: '高級工程師', nameZh: '王祐丞', nameEn: 'royma WANG', email: 'royma.wang@shinda.com.tw' },
];

// 部門圖示對照表
const deptIcons = {
    '總經理室': 'fa-solid fa-user-tie',
    '董事長室': 'fa-solid fa-crown',
    '總公司': 'fa-solid fa-building',
    '業務部': 'fa-solid fa-chart-line',
    '客服品管組': 'fa-solid fa-headset',
    '新加坡新途': 'fa-solid fa-earth-asia',
    'BU1 數位轉型': 'fa-solid fa-code',
    'BU2 數位應用策': 'fa-solid fa-lightbulb',
    'BU3 雲端及資安': 'fa-solid fa-cloud-bolt',
    'BU0': 'fa-solid fa-layer-group',
};

// 頭像色彩 hash
function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 'avatar-bg-' + ((Math.abs(hash) % 8) + 1);
}

// 職稱等級分類
function getTitleLevel(title) {
    if (/董事長|總經理/.test(title)) return 'level-exec';
    if (/經理|副理/.test(title)) return 'level-manager';
    if (/組長|主管/.test(title)) return 'level-lead';
    if (/資深|高級/.test(title)) return 'level-senior';
    return 'level-staff';
}

// ===== 目前的篩選狀態 =====
let currentDeptFilter = '全部';
let currentSearchKeyword = '';

// ===== 取得所有部門清單（去重、保持原順序）=====
function getUniqueDepts() {
    const seen = new Set();
    const result = [];
    contactsData.forEach(c => {
        if (!seen.has(c.dept)) {
            seen.add(c.dept);
            result.push(c.dept);
        }
    });
    return result;
}

// ===== 篩選資料 =====
function getFilteredContacts() {
    return contactsData.filter(c => {
        const matchDept = (currentDeptFilter === '全部') || (c.dept === currentDeptFilter);
        if (!matchDept) return false;

        if (!currentSearchKeyword) return true;

        const kw = currentSearchKeyword.toLowerCase();
        return (
            c.nameZh.toLowerCase().includes(kw) ||
            c.nameEn.toLowerCase().includes(kw) ||
            c.email.toLowerCase().includes(kw) ||
            c.title.toLowerCase().includes(kw) ||
            c.dept.toLowerCase().includes(kw) ||
            c.subGroup.toLowerCase().includes(kw)
        );
    });
}

// ===== 渲染通訊錄 =====
function renderContacts() {
    const filtered = getFilteredContacts();
    const container = document.getElementById('contactsListBody');
    if (!container) return;

    // 更新計數
    const countEl = document.getElementById('contactsVisibleCount');
    if (countEl) countEl.textContent = `顯示 ${filtered.length} / ${contactsData.length} 人`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="contacts-empty">
                <i class="fa-solid fa-address-book"></i>
                <p>找不到符合條件的聯絡人</p>
            </div>`;
        return;
    }

    // 依部門分組
    const groups = {};
    filtered.forEach(c => {
        if (!groups[c.dept]) groups[c.dept] = [];
        groups[c.dept].push(c);
    });

    let html = '';
    for (const dept in groups) {
        const members = groups[dept];
        const icon = deptIcons[dept] || 'fa-solid fa-building';

        html += `<div class="contacts-group" data-dept="${dept}">`;
        html += `<div class="contacts-group-header" onclick="toggleContactGroup(this)">
                    <i class="group-icon ${icon}"></i>
                    <span class="group-name">${dept}</span>
                    <span class="group-count">${members.length} 人</span>
                    <i class="toggle-icon fa-solid fa-chevron-down"></i>
                 </div>`;
        html += `<div class="contacts-table-wrap">
                    <table class="contacts-table">
                        <thead>
                            <tr>
                                <th style="width:22%">姓名</th>
                                <th style="width:14%">子組別/功能</th>
                                <th style="width:16%">職稱</th>
                                <th style="width:30%">電子信箱</th>
                            </tr>
                        </thead>
                        <tbody>`;

        members.forEach(m => {
            const avatarChar = m.nameZh.charAt(0);
            const avatarClass = getAvatarColor(m.nameZh);
            const titleLevel = getTitleLevel(m.title);

            html += `<tr>
                        <td>
                            <div class="contact-name-cell">
                                <div class="contact-avatar ${avatarClass}">${avatarChar}</div>
                                <div class="contact-name-info">
                                    <span class="contact-name-zh">${m.nameZh}</span>
                                    <span class="contact-name-en">${m.nameEn}</span>
                                </div>
                            </div>
                        </td>
                        <td>${m.subGroup !== '-' ? `<span class="contact-sub-group">${m.subGroup}</span>` : '-'}</td>
                        <td><span class="contact-title-badge ${titleLevel}">${m.title}</span></td>
                        <td class="contact-email"><a href="mailto:${m.email}">${m.email}</a></td>
                     </tr>`;
        });

        html += `       </tbody>
                    </table>
                 </div>
             </div>`;
    }

    container.innerHTML = html;
}

// ===== 展開/摺疊群組 =====
function toggleContactGroup(headerEl) {
    const group = headerEl.closest('.contacts-group');
    if (group) group.classList.toggle('collapsed');
}

// ===== 渲染篩選按鈕 =====
function renderContactFilters() {
    const filterContainer = document.getElementById('contactsDeptFilters');
    if (!filterContainer) return;

    const depts = getUniqueDepts();

    let html = `<button class="filter-btn active" onclick="filterByDept('全部', this)">全部</button>`;
    depts.forEach(d => {
        html += `<button class="filter-btn" onclick="filterByDept('${d}', this)">${d}</button>`;
    });
    filterContainer.innerHTML = html;
}

// ===== 按部門篩選 =====
function filterByDept(dept, btnEl) {
    currentDeptFilter = dept;
    // 更新按鈕 active 狀態
    document.querySelectorAll('#contactsDeptFilters .filter-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    renderContacts();
}

// ===== 搜尋 =====
function onContactsSearch(e) {
    currentSearchKeyword = e.target.value.trim();
    renderContacts();
}

// ===== 初始化通訊錄 =====
function initContacts() {
    renderContactFilters();
    renderContacts();

    const searchInput = document.getElementById('contactsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', onContactsSearch);
    }
}

// 當切換到通訊錄時初始化
document.addEventListener('DOMContentLoaded', function () {
    // 若直接顯示通訊錄頁面則馬上初始化
    const page = document.getElementById('page-contacts');
    if (page && page.style.display !== 'none') {
        initContacts();
    }
});
