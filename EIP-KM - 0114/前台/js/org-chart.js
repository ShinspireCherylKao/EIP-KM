/**
 * org-chart.js
 * 組織圖互動邏輯
 */

// ==================== 組織資料 ====================
const ORG_PEOPLE = [
    // 董事長室
    { id: 'p01', name: '蔡宜芯', nameEn: 'Richio TS', dept: '董事長室', sub: '-', title: '董事長', email: 'richio@shinda.com.tw' },
    // 總經理室
    { id: 'p02', name: '李佳蔚', nameEn: 'Harry LI', dept: '總經理室', sub: '-', title: '總經理', email: 'harry@shinda.com.tw' },
    { id: 'p03', name: '許惠林', nameEn: 'huilin hsu', dept: '總經理室', sub: '-', title: '管理師', email: 'huilin.hsu@shinda.com.tw' },
    // 總公司
    { id: 'p04', name: '蔡宜芯', nameEn: 'Richio TS', dept: '總公司', sub: '-', title: '經理', email: 'richio@shinda.com.tw' },
    { id: 'p05', name: '林育如', nameEn: 'Yuru LIN', dept: '總公司', sub: '-', title: '助理管理師', email: 'yuru.lin@shinda.com.tw' },
    { id: 'p06', name: '李佩芬', nameEn: 'peipei li', dept: '總公司', sub: '-', title: '助理管理師', email: 'peipei.li@shinda.com.tw' },
    // 業務部
    { id: 'p07', name: '林信瑩', nameEn: 'Lesley LI', dept: '業務部', sub: '-', title: '組長', email: 'lesley.lin@shinda.com.tw' },
    { id: 'p08', name: '林展億', nameEn: 'Charles L', dept: '業務部', sub: '-', title: '資深管理師', email: 'charles.lin@shinda.com.tw' },
    { id: 'p09', name: '王文玲', nameEn: 'Amy WANG', dept: '業務部', sub: '-', title: '助理管理師', email: 'amy.wang@shinda.com.tw' },
    { id: 'p10', name: '廖翊晴', nameEn: 'yiching liao', dept: '業務部', sub: '-', title: '助理管理師', email: 'yiching.liao@shinda.com.tw' },
    // 客服品管組
    { id: 'p11', name: '許玉婷', nameEn: 'Michelle', dept: '客服品管組', sub: '-', title: '應用系統品質管理', email: 'michelle.hsu@shinda.com.tw' },
    { id: 'p12', name: '陳法佑', nameEn: 'Angel Chen', dept: '客服品管組', sub: '-', title: '資深管理師', email: 'angel.chen@shinda.com.tw' },
    { id: 'p13', name: '沈彥宇', nameEn: 'Stanley Shen', dept: '客服品管組', sub: '-', title: '管理師', email: 'stanley.shen@shinda.com.tw' },
    { id: 'p14', name: '陳姿均', nameEn: 'Chloe Chen', dept: '客服品管組', sub: '-', title: '管理師', email: 'chloe.chen@shinda.com.tw' },
    { id: 'p15', name: '謝宜岑', nameEn: 'Yvonne Hsieh', dept: '客服品管組', sub: '-', title: '管理師', email: 'yvonne.hsieh@shinda.com.tw' },
    // 新加坡新途
    { id: 'p16', name: '郭雯琪', nameEn: 'daphne kuo', dept: '新加坡新途', sub: '-', title: '商務開發經理', email: 'daphne.kuo@shinda.com.tw' },
    { id: 'p17', name: '陳思蒨', nameEn: 'Lila chen', dept: '新加坡新途', sub: '-', title: '高級管理師', email: 'lila.chen@shinda.com.tw' },
    // BU1 數位轉型
    { id: 'p18', name: '古家賓', nameEn: 'Bella Ku', dept: 'BU1 數位轉型', sub: 'PM', title: '資深管理師', email: 'bella.ku@shinda.com.tw' },
    { id: 'p19', name: '董至軒', nameEn: 'Large DONG', dept: 'BU1 數位轉型', sub: '開發一組', title: '組長', email: 'Large.dong@shinda.com.tw' },
    { id: 'p20', name: '林瓊瑤', nameEn: 'Tina LIN', dept: 'BU1 數位轉型', sub: '開發一組', title: '工程師', email: 'tina.lin@shinda.com.tw' },
    { id: 'p21', name: '陳曉靜', nameEn: 'Nancy Chen', dept: 'BU1 數位轉型', sub: '開發一組', title: '工程師', email: 'nancy.chen@shinda.com.tw' },
    { id: 'p22', name: '楊雅婷', nameEn: 'Avril Yang', dept: 'BU1 數位轉型', sub: '開發一組', title: '工程師', email: 'avril.yang@shinda.com.tw' },
    { id: 'p23', name: '蕭耿維', nameEn: 'Wade Xiao', dept: 'BU1 數位轉型', sub: '開發二組', title: '組長', email: 'Wade.xiao@shinda.com.tw' },
    { id: 'p24', name: '王思愛', nameEn: 'Natasha Wang', dept: 'BU1 數位轉型', sub: '開發二組', title: '工程師', email: 'Natasha.wang@shinda.com.tw' },
    { id: 'p25', name: '李家豪', nameEn: 'Jiahao Li', dept: 'BU1 數位轉型', sub: '開發二組', title: '工程師', email: 'jiahao.li@shinda.com.tw' },
    { id: 'p26', name: '李昕原', nameEn: 'Wayne Li', dept: 'BU1 數位轉型', sub: '開發二組', title: '工程師', email: 'wayne.li@shinda.com.tw' },
    { id: 'p27', name: 'Nguyễn Ngọc Dũng', nameEn: 'Nguyễn Ngọc Dũng', dept: 'BU1 數位轉型', sub: '開發二組', title: '工程師', email: 'ngngocdung94@gmail.com' },
    // BU2 數位應用策略
    { id: 'p28', name: '許舜博', nameEn: 'Paul HSU', dept: 'BU2 數位應用策略', sub: '解決方案組', title: '經理', email: 'paul.hsu@shinda.com.tw' },
    { id: 'p29', name: '吳星瑋', nameEn: 'Phoebe Wu', dept: 'BU2 數位應用策略', sub: '解決方案組', title: '工程師', email: 'phoebe.wu@shinda.com.tw' },
    { id: 'p30', name: '張丞緯', nameEn: 'ChungWei CHANG', dept: 'BU2 數位應用策略', sub: '解決方案組', title: '工程師', email: 'chungwei.chang@shinda.com.tw' },
    { id: 'p31', name: 'Lai Hồng Khải', nameEn: 'Kai', dept: 'BU2 數位應用策略', sub: '解決方案組', title: '工程師', email: 'laihongkhai.work@gmail.com' },
    { id: 'p32', name: '洪名陞', nameEn: 'Vincent HONG', dept: 'BU2 數位應用策略', sub: '精實組', title: '副理', email: 'vincent.hong@shinda.com.tw' },
    { id: 'p33', name: '鄭仲珉', nameEn: 'Kenny ZHENG', dept: 'BU2 數位應用策略', sub: '精實組', title: '組長', email: 'kenny.zheng@shinda.com.tw' },
    { id: 'p34', name: 'Hà Huy Khôi', nameEn: 'Kuro', dept: 'BU2 數位應用策略', sub: '精實組', title: '組長', email: 'khoic3b1999@gmail.com' },
    { id: 'p35', name: '葉東諺', nameEn: 'dongyan ye', dept: 'BU2 數位應用策略', sub: '精實組', title: '工程師', email: 'dongyan.ye@shinda.com.tw' },
    { id: 'p36', name: '黃妲樺', nameEn: 'Ashily Huang', dept: 'BU2 數位應用策略', sub: '精實組', title: '工程師', email: 'ashily.huang@shinda.com.tw' },
    { id: 'p37', name: 'Trần Nguyễn Vĩnh Tường', nameEn: 'Michael', dept: 'BU2 數位應用策略', sub: '精實組', title: '工程師', email: 'trannguyenvinhtuong@gmail.com' },
    { id: 'p38', name: '林怡君', nameEn: 'Janet LIN', dept: 'BU2 數位應用策略', sub: '神燈精靈組', title: '組長', email: 'Janet.lin@shinda.com.tw' },
    { id: 'p39', name: '柯宇慧', nameEn: 'Dora KE', dept: 'BU2 數位應用策略', sub: '神燈精靈組', title: '組長', email: 'dora.ke@shinda.com.tw' },
    { id: 'p40', name: '吳靖子', nameEn: 'Dora WU', dept: 'BU2 數位應用策略', sub: '神燈精靈組', title: '資深管理師', email: 'Dora.wu@shinda.com.tw' },
    { id: 'p41', name: '張睿', nameEn: 'Zinzan CHANG', dept: 'BU2 數位應用策略', sub: '神燈精靈組', title: '資深工程師', email: 'zinzan.chang@shinda.com.tw' },
    { id: 'p42', name: '高千蘊', nameEn: 'Cheryl Kao', dept: 'BU2 數位應用策略', sub: '神燈精靈組', title: '管理師', email: 'cheryl.kao@shinda.com.tw' },
    { id: 'p43', name: '劉家妏', nameEn: 'Jia LIU', dept: 'BU2 數位應用策略', sub: '共好達成組', title: '組長', email: 'jia.liu@shinda.com.tw' },
    { id: 'p44', name: '蔡乙瑄', nameEn: 'Wendy Tsai', dept: 'BU2 數位應用策略', sub: '共好達成組', title: '管理師', email: 'wendy.tsai@shinda.com.tw' },
    { id: 'p45', name: '廖昀甫', nameEn: 'Andra Liao', dept: 'BU2 數位應用策略', sub: '共好達成組', title: '管理師', email: 'andra.liao@shinda.com.tw' },
    // BU3 雲端及資安
    { id: 'p46', name: '林詩婷', nameEn: 'Lisa Lin', dept: 'BU3 雲端及資安', sub: 'PM一組', title: '助理管理師', email: 'lisa.lin@shinda.com.tw' },
    { id: 'p47', name: '蘇映綺', nameEn: 'Abby su', dept: 'BU3 雲端及資安', sub: 'PM一組', title: '助理管理師', email: 'abby.su@shinda.com.tw' },
    { id: 'p48', name: '周理恩', nameEn: 'Lien ZHOU', dept: 'BU3 雲端及資安', sub: '研發一組', title: '資深工程師', email: 'lien.zhou@shinda.com.tw' },
    { id: 'p49', name: '李宜紘', nameEn: 'Eric Li', dept: 'BU3 雲端及資安', sub: '研發一組', title: '工程師', email: 'Eric.li@shinda.com.tw' },
    { id: 'p50', name: 'Võ Ngọc Đức', nameEn: 'Andy', dept: 'BU3 雲端及資安', sub: '研發一組', title: '工程師', email: 'ngocducvo1408@gmail.com' },
    { id: 'p51', name: '張文豪', nameEn: 'Tony ZHANG', dept: 'BU3 雲端及資安', sub: 'MIS', title: '高級工程師', email: 'Tony.Zhang@shinda.com.tw' },
    { id: 'p52', name: '張峻誠', nameEn: 'Jeff CHANG', dept: 'BU3 雲端及資安', sub: 'MIS', title: '工程師', email: 'jeff.chang@shinda.com.tw' },
    // BU0
    { id: 'p53', name: '王祐丞', nameEn: 'royma WANG', dept: 'BU0', sub: '-', title: '高級工程師', email: 'royma.wang@shinda.com.tw' },
];

// ==================== 組織樹結構 ====================
const ORG_TREE = {
    id: 'root',
    label: '董事長室',
    type: 'dept',
    icon: 'fa-building',
    headPersonId: 'p01',
    children: [
        {
            id: 'gm',
            label: '總經理室',
            type: 'dept',
            icon: 'fa-user-tie',
            headPersonId: 'p02',
            members: ['p03'],
            children: []
        },
        {
            id: 'hq',
            label: '總公司',
            type: 'dept',
            icon: 'fa-building-columns',
            headPersonId: 'p04',
            members: ['p05', 'p06'],
            children: []
        },
        {
            id: 'sales',
            label: '業務部',
            type: 'dept',
            icon: 'fa-chart-line',
            headPersonId: 'p07',
            members: ['p08', 'p09', 'p10'],
            children: []
        },
        {
            id: 'qa',
            label: '客服品管組',
            type: 'dept',
            icon: 'fa-headset',
            headPersonId: 'p11',
            members: ['p12', 'p13', 'p14', 'p15'],
            children: []
        },
        {
            id: 'sg',
            label: '新加坡新途',
            type: 'dept',
            icon: 'fa-globe-asia',
            headPersonId: 'p16',
            members: ['p17'],
            children: []
        },
        {
            id: 'bu1',
            label: 'BU1 數位轉型',
            type: 'dept',
            icon: 'fa-rocket',
            children: [
                {
                    id: 'bu1-pm',
                    label: 'PM',
                    type: 'team',
                    icon: 'fa-clipboard-list',
                    members: ['p18'],
                    children: []
                },
                {
                    id: 'bu1-dev1',
                    label: '開發一組',
                    type: 'team',
                    icon: 'fa-code',
                    headPersonId: 'p19',
                    members: ['p20', 'p21', 'p22'],
                    children: []
                },
                {
                    id: 'bu1-dev2',
                    label: '開發二組',
                    type: 'team',
                    icon: 'fa-code-branch',
                    headPersonId: 'p23',
                    members: ['p24', 'p25', 'p26', 'p27'],
                    children: []
                }
            ]
        },
        {
            id: 'bu2',
            label: 'BU2 數位應用策略',
            type: 'dept',
            icon: 'fa-lightbulb',
            children: [
                {
                    id: 'bu2-sol',
                    label: '解決方案組',
                    type: 'team',
                    icon: 'fa-puzzle-piece',
                    headPersonId: 'p28',
                    members: ['p29', 'p30', 'p31'],
                    children: []
                },
                {
                    id: 'bu2-lean',
                    label: '精實組',
                    type: 'team',
                    icon: 'fa-gears',
                    headPersonId: 'p32',
                    members: ['p33', 'p34', 'p35', 'p36', 'p37'],
                    children: []
                },
                {
                    id: 'bu2-lamp',
                    label: '神燈精靈組',
                    type: 'team',
                    icon: 'fa-wand-sparkles',
                    headPersonId: 'p38',
                    members: ['p39', 'p40', 'p41', 'p42'],
                    children: []
                },
                {
                    id: 'bu2-good',
                    label: '共好達成組',
                    type: 'team',
                    icon: 'fa-handshake',
                    headPersonId: 'p43',
                    members: ['p44', 'p45'],
                    children: []
                }
            ]
        },
        {
            id: 'bu3',
            label: 'BU3 雲端及資安',
            type: 'dept',
            icon: 'fa-cloud-bolt',
            children: [
                {
                    id: 'bu3-pm',
                    label: 'PM一組',
                    type: 'team',
                    icon: 'fa-clipboard-list',
                    members: ['p46', 'p47'],
                    children: []
                },
                {
                    id: 'bu3-rd1',
                    label: '研發一組',
                    type: 'team',
                    icon: 'fa-flask',
                    headPersonId: 'p48',
                    members: ['p49', 'p50'],
                    children: []
                },
                {
                    id: 'bu3-mis',
                    label: 'MIS',
                    type: 'team',
                    icon: 'fa-server',
                    headPersonId: 'p51',
                    members: ['p52'],
                    children: []
                }
            ]
        },
        {
            id: 'bu0',
            label: 'BU0',
            type: 'dept',
            icon: 'fa-microchip',
            members: ['p53'],
            children: []
        }
    ]
};

// ==================== 狀態 ====================
let currentView = 'tree';
let zoomScale = 1;
let allExpanded = false;
let collapsedNodes = new Set();
// 拖曳平移
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let scrollStart = { x: 0, y: 0 };

// ==================== 工具函數 ====================
function getPersonById(id) {
    return ORG_PEOPLE.find(p => p.id === id);
}

function getInitials(name) {
    if (!name) return '?';
    // 中文姓名取最後一個字
    if (/[\u4e00-\u9fff]/.test(name)) {
        return name.slice(-1);
    }
    // 英文取首字母
    return name.trim().charAt(0).toUpperCase();
}

function getAvatarClass(title) {
    if (/董事長/.test(title)) return 'avatar-chairman';
    if (/總經理/.test(title)) return 'avatar-gm';
    if (/經理|副理|主管/.test(title)) return 'avatar-manager';
    if (/組長|長/.test(title)) return 'avatar-leader';
    return 'avatar-staff';
}

function getDeptTagClass(dept) {
    const map = {
        '董事長室': 'dept-tag-amber',
        '總經理室': 'dept-tag-blue',
        '總公司': 'dept-tag-slate',
        '業務部': 'dept-tag-green',
        '客服品管組': 'dept-tag-cyan',
        '新加坡新途': 'dept-tag-rose',
        'BU1 數位轉型': 'dept-tag-purple',
        'BU2 數位應用策略': 'dept-tag-orange',
        'BU3 雲端及資安': 'dept-tag-blue',
        'BU0': 'dept-tag-slate'
    };
    return map[dept] || 'dept-tag-slate';
}

function getMemberDotColor(title) {
    if (/董事長|總經理/.test(title)) return '#F59E0B';
    if (/經理|副理|主管/.test(title)) return '#10B981';
    if (/組長/.test(title)) return '#8B5CF6';
    if (/資深/.test(title)) return '#3B82F6';
    return '#94A3B8';
}

function countAllMembers(node) {
    let count = 0;
    if (node.headPersonId) count++;
    if (node.members) count += node.members.length;
    if (node.children) {
        node.children.forEach(c => { count += countAllMembers(c); });
    }
    return count;
}

// ==================== 樹狀圖渲染 ====================
function renderTree() {
    const tree = document.getElementById('orgTree');
    tree.innerHTML = renderNode(ORG_TREE);
}

function renderNode(node) {
    const isCollapsed = collapsedNodes.has(node.id);
    const head = node.headPersonId ? getPersonById(node.headPersonId) : null;
    const members = (node.members || []).map(id => getPersonById(id)).filter(Boolean);
    const hasChildren = (node.children && node.children.length > 0);
    const totalMembers = countAllMembers(node);

    // 節點類型 class
    let nodeClass = 'org-node';
    if (node.id === 'root') nodeClass += ' ceo-node';
    else if (node.type === 'team') nodeClass += ' team-node';
    else nodeClass += ' dept-node';

    // 頭像
    let avatarHtml = '';
    if (head) {
        avatarHtml = `<div class="org-node-avatar ${getAvatarClass(head.title)}">${getInitials(head.name)}</div>`;
    } else if (node.type === 'dept') {
        avatarHtml = `<div class="org-node-avatar avatar-dept"><i class="fa-solid ${node.icon || 'fa-building'}"></i></div>`;
    } else {
        avatarHtml = `<div class="org-node-avatar avatar-team"><i class="fa-solid ${node.icon || 'fa-users'}"></i></div>`;
    }

    // 名稱區
    let nameHtml = '';
    if (head) {
        nameHtml = `
            <div class="org-node-name">${head.name}</div>
            <div class="org-node-title">${head.title}</div>
            <div class="org-node-dept"><i class="fa-solid fa-building" style="font-size:10px;"></i> ${node.label}</div>
        `;
    } else {
        nameHtml = `
            <div class="org-node-name">${node.label}</div>
            <div class="org-node-count"><i class="fa-solid fa-users" style="font-size:10px;"></i> ${totalMembers} 人</div>
        `;
    }

    // 成員列表（節點內展開）
    let membersHtml = '';
    if (members.length > 0) {
        const memberItems = members.map(m => `
            <div class="org-node-member" onclick="event.stopPropagation(); showPersonDetail('${m.id}')">
                <span class="member-dot" style="background:${getMemberDotColor(m.title)};"></span>
                <span class="member-name">${m.name}</span>
                <span class="member-title">${m.title}</span>
            </div>
        `).join('');
        membersHtml = `<div class="org-node-members">${memberItems}</div>`;
    }

    // 展開/收合按鈕
    let toggleHtml = '';
    if (hasChildren) {
        const icon = isCollapsed ? 'fa-plus' : 'fa-minus';
        toggleHtml = `<div class="org-node-toggle" onclick="event.stopPropagation(); toggleNode('${node.id}')"><i class="fa-solid ${icon}"></i></div>`;
    }

    // 子節點
    let childrenHtml = '';
    if (hasChildren && !isCollapsed) {
        const childItems = node.children.map(c => `<li>${renderNode(c)}</li>`).join('');
        childrenHtml = `<ul>${childItems}</ul>`;
    }

    // 點擊展開人員詳情（如果是 head）
    const clickHandler = head
        ? `onclick="showPersonDetail('${head.id}')"`
        : '';

    return `
        <div class="org-node-wrap" data-node-id="${node.id}">
            <div class="${nodeClass}" ${clickHandler}>
                ${avatarHtml}
                ${nameHtml}
                ${membersHtml}
                ${toggleHtml}
            </div>
            ${childrenHtml}
        </div>
    `;
}

function toggleNode(nodeId) {
    if (collapsedNodes.has(nodeId)) {
        collapsedNodes.delete(nodeId);
    } else {
        collapsedNodes.add(nodeId);
    }
    renderTree();
}

// ==================== 清單檢視 ====================
function renderList(filteredPeople) {
    const tbody = document.getElementById('orgListBody');
    const people = filteredPeople || ORG_PEOPLE;

    if (people.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; color:var(--text-muted);">
                    <i class="fa-solid fa-inbox" style="font-size:32px; display:block; margin-bottom:8px;"></i>
                    找不到符合條件的人員
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = people.map(p => `
        <tr onclick="showPersonDetail('${p.id}')" class="org-list-row" data-person-id="${p.id}">
            <td>
                <div class="org-list-avatar ${getAvatarClass(p.title)}">
                    ${getInitials(p.name)}
                </div>
            </td>
            <td>
                <div class="org-list-name">${p.name}</div>
                <div style="font-size:11px; color:var(--text-muted);">${p.nameEn}</div>
            </td>
            <td>${p.title}</td>
            <td>
                <span class="org-dept-tag ${getDeptTagClass(p.dept)}">${p.dept}</span>
            </td>
            <td>${p.sub !== '-' ? p.sub : ''}</td>
            <td><span class="org-list-email">${p.email}</span></td>
        </tr>
    `).join('');
}

// ==================== 人員詳細 Modal ====================
function showPersonDetail(personId) {
    const p = getPersonById(personId);
    if (!p) return;

    document.getElementById('detailTitle').textContent = '人員資訊';
    document.getElementById('detailBody').innerHTML = `
        <div class="detail-profile">
            <div class="detail-avatar ${getAvatarClass(p.title)}">
                ${getInitials(p.name)}
            </div>
            <div class="detail-name">${p.name}</div>
            <div class="detail-title">${p.nameEn}</div>
        </div>
        <div class="detail-fields">
            <div class="detail-field">
                <div class="detail-field-icon blue"><i class="fa-solid fa-id-badge"></i></div>
                <div class="detail-field-content">
                    <div class="detail-field-label">職稱</div>
                    <div class="detail-field-value">${p.title}</div>
                </div>
            </div>
            <div class="detail-field">
                <div class="detail-field-icon purple"><i class="fa-solid fa-building"></i></div>
                <div class="detail-field-content">
                    <div class="detail-field-label">部門</div>
                    <div class="detail-field-value">${p.dept}</div>
                </div>
            </div>
            ${p.sub !== '-' ? `
            <div class="detail-field">
                <div class="detail-field-icon green"><i class="fa-solid fa-users"></i></div>
                <div class="detail-field-content">
                    <div class="detail-field-label">子組別 / 功能</div>
                    <div class="detail-field-value">${p.sub}</div>
                </div>
            </div>
            ` : ''}
            <div class="detail-field">
                <div class="detail-field-icon amber"><i class="fa-solid fa-envelope"></i></div>
                <div class="detail-field-content">
                    <div class="detail-field-label">電子郵件</div>
                    <div class="detail-field-value"><a href="mailto:${p.email}">${p.email}</a></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detailOverlay').classList.add('show');
}

function closeDetail() {
    document.getElementById('detailOverlay').classList.remove('show');
}

// ==================== 搜尋 ====================
let searchTimeout = null;

function handleSearch(query) {
    const q = query.trim().toLowerCase();
    const clearBtn = document.getElementById('searchClear');
    const resultBar = document.getElementById('searchResult');
    const resultText = document.getElementById('searchResultText');

    clearBtn.style.display = q ? 'flex' : 'none';

    if (!q) {
        resultBar.style.display = 'none';
        renderList();
        // 樹狀圖：清除高亮
        document.querySelectorAll('.org-node.highlight').forEach(el => el.classList.remove('highlight'));
        document.querySelectorAll('.org-list-row.highlight').forEach(el => el.classList.remove('highlight'));
        return;
    }

    const matched = ORG_PEOPLE.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.dept.toLowerCase().includes(q) ||
        p.sub.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
    );

    resultBar.style.display = 'flex';
    resultText.textContent = `找到 ${matched.length} 筆結果（關鍵字: "${query.trim()}"）`;

    // 清單檢視 - 篩選
    renderList(matched);

    // 樹狀圖 - 高亮
    document.querySelectorAll('.org-node').forEach(el => el.classList.remove('highlight'));
    const matchedIds = new Set(matched.map(p => p.id));
    // 將相關節點的 DOM 高亮（簡易方式：找包含該人員的 member-name）
    document.querySelectorAll('.org-node-member').forEach(el => {
        const name = el.querySelector('.member-name')?.textContent;
        if (name) {
            const person = ORG_PEOPLE.find(p => p.name === name);
            if (person && matchedIds.has(person.id)) {
                el.closest('.org-node')?.classList.add('highlight');
            }
        }
    });
    // 也高亮 head 節點
    document.querySelectorAll('.org-node .org-node-name').forEach(el => {
        const name = el.textContent;
        const person = ORG_PEOPLE.find(p => p.name === name);
        if (person && matchedIds.has(person.id)) {
            el.closest('.org-node')?.classList.add('highlight');
        }
    });
}

function clearSearch() {
    document.getElementById('orgSearch').value = '';
    handleSearch('');
}

// ==================== 視圖切換 ====================
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.org-view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.querySelectorAll('.org-view').forEach(v => {
        v.classList.toggle('active', v.id === `view-${view}`);
    });
}

// ==================== 全部展開/收合 ====================
function toggleAllNodes() {
    allExpanded = !allExpanded;
    const btn = document.getElementById('toggleAll');

    if (allExpanded) {
        collapsedNodes.clear();
        btn.querySelector('span').textContent = '全部收合';
    } else {
        // 收合所有有子節點的
        collapseAll(ORG_TREE);
        btn.querySelector('span').textContent = '全部展開';
    }
    renderTree();
}

function collapseAll(node) {
    if (node.children && node.children.length > 0) {
        collapsedNodes.add(node.id);
        node.children.forEach(c => collapseAll(c));
    }
}

// ==================== 縮放 ====================
function setZoom(scale) {
    zoomScale = Math.max(0.3, Math.min(1.5, scale));
    const tree = document.getElementById('orgTree');
    tree.style.transform = `scale(${zoomScale})`;
    document.getElementById('zoomLevel').textContent = Math.round(zoomScale * 100) + '%';
}

// ==================== 拖曳平移 ====================
function initDrag() {
    const viewport = document.getElementById('treeViewport');

    viewport.addEventListener('mousedown', (e) => {
        // 忽略按鈕和互動元素
        if (e.target.closest('.org-node-toggle, .org-node-member, .org-node, button, a')) return;
        isDragging = true;
        viewport.classList.add('dragging');
        dragStart = { x: e.clientX, y: e.clientY };
        scrollStart = { x: viewport.scrollLeft, y: viewport.scrollTop };
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        const viewport = document.getElementById('treeViewport');
        viewport.scrollLeft = scrollStart.x - dx;
        viewport.scrollTop = scrollStart.y - dy;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        document.getElementById('treeViewport')?.classList.remove('dragging');
    });

    // Scroll 縮放
    viewport.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(zoomScale + delta);
        }
    }, { passive: false });
}

// ==================== Toast ====================
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'org-toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fadeout');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function () {
    // 總人數
    document.getElementById('totalCount').textContent = ORG_PEOPLE.length + ' 人';

    // 渲染樹狀圖
    renderTree();

    // 渲染清單
    renderList();

    // 搜尋
    const searchInput = document.getElementById('orgSearch');
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(this.value), 250);
    });

    document.getElementById('searchClear').addEventListener('click', clearSearch);
    document.getElementById('searchResultClear').addEventListener('click', clearSearch);

    // 視圖切換
    document.querySelectorAll('.org-view-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // 全部展開/收合
    document.getElementById('toggleAll').addEventListener('click', toggleAllNodes);

    // 縮放
    document.getElementById('zoomIn').addEventListener('click', () => setZoom(zoomScale + 0.1));
    document.getElementById('zoomOut').addEventListener('click', () => setZoom(zoomScale - 0.1));
    document.getElementById('zoomReset').addEventListener('click', () => setZoom(1));

    // 拖曳平移
    initDrag();

    // Modal 關閉
    document.getElementById('detailClose').addEventListener('click', closeDetail);
    document.getElementById('detailOverlay').addEventListener('click', function (e) {
        if (e.target === this) closeDetail();
    });

    // ESC 關閉 modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDetail();
    });
});
