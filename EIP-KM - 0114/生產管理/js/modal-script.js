/**
 * modal-script.js
 * 模態窗口相關功能腳本，處理彈出窗口的顯示與互動
 */

/**
 * 顯示模態窗口
 * @param {HTMLElement} modal - 模態窗口元素
 */
function showModal(modal) {
    if (!modal) return;
    
    // 淡入顯示模態窗口
    modal.classList.add('show');
    
    // 禁止背景滾動
    document.body.style.overflow = 'hidden';
    
    // 註冊關閉按鈕事件
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            hideModal(modal);
        };
    }
    
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            hideModal(modal);
        };
    }
    
    // 點擊模態窗口外部也可關閉
    modal.onclick = function(e) {
        if (e.target === modal) {
            hideModal(modal);
        }
    };
    
    // 按 ESC 鍵關閉
    document.onkeydown = function(e) {
        if (e.key === 'Escape') {
            hideModal(modal);
        }
    };
}

/**
 * 隱藏模態窗口
 * @param {HTMLElement} modal - 模態窗口元素
 */
function hideModal(modal) {
    if (!modal) return;
    
    // 淡出隱藏模態窗口
    modal.classList.remove('show');
    
    // 恢復背景滾動
    document.body.style.overflow = '';
    
    // 清理事件監聽器
    document.onkeydown = null;
    
    // 如果是帶表單的模態窗口，可以選擇性地重置表單
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
}

/**
 * 創建並顯示自定義內容的模態窗口
 * @param {string} title - 模態窗口標題
 * @param {string|HTMLElement} content - 模態窗口內容
 * @param {Object} options - 配置選項
 * @param {string} options.size - 窗口大小 ('small', 'default', 'large', 'full')
 * @param {Array} options.buttons - 按鈕配置陣列
 */
function createModal(title, content, options = {}) {
    options = Object.assign({
        size: 'default',
        buttons: [{
            text: '確定',
            type: 'primary',
            handler: null
        }]
    }, options);
    
    // 使用通用模態窗口元素
    const modal = document.getElementById('generalModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    
    // 設置模態窗口大小
    modalContent.className = 'modal-content';
    if (options.size !== 'default') {
        modalContent.classList.add(options.size);
    }
    
    // 設置標題
    modalTitle.textContent = title;
    
    // 設置內容
    if (typeof content === 'string') {
        modalBody.innerHTML = content;
    } else {
        modalBody.innerHTML = '';
        modalBody.appendChild(content);
    }
    
    // 設置按鈕
    modalFooter.innerHTML = '';
    options.buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.className = btn.type === 'primary' ? 'primary-btn confirm-btn' : 'secondary-btn cancel-btn';
        
        if (btn.handler) {
            button.onclick = function() {
                btn.handler();
                if (btn.closeAfterClick !== false) {
                    hideModal(modal);
                }
            };
        } else {
            button.onclick = function() {
                hideModal(modal);
            };
        }
        
        modalFooter.appendChild(button);
    });
    
    // 顯示模態窗口
    showModal(modal);
    
    return modal;
}

/**
 * 創建並顯示確認模態窗口
 * @param {string} title - 模態窗口標題
 * @param {string} message - 確認消息文本
 * @param {Function} onConfirm - 確認按鈕回調函數
 * @param {Function} onCancel - 取消按鈕回調函數
 * @param {Object} options - 配置選項
 */
function showConfirmModal(title, message, onConfirm, onCancel = null, options = {}) {
    options = Object.assign({
        icon: 'question',
        confirmText: '確定',
        cancelText: '取消',
        confirmButtonType: 'primary',
        detail: ''
    }, options);
    
    // 設置圖標
    let iconClass = 'fa-solid fa-question-circle';
    let iconColor = 'var(--primary-color)';
    
    switch (options.icon) {
        case 'warning':
            iconClass = 'fa-solid fa-exclamation-triangle';
            iconColor = 'var(--warning-color)';
            break;
        case 'danger':
            iconClass = 'fa-solid fa-exclamation-circle';
            iconColor = 'var(--danger-color)';
            break;
        case 'info':
            iconClass = 'fa-solid fa-info-circle';
            iconColor = 'var(--info-color)';
            break;
        case 'success':
            iconClass = 'fa-solid fa-check-circle';
            iconColor = 'var(--success-color)';
            break;
    }
    
    // 創建內容
    const content = `
        <div class="confirm-modal">
            <div class="icon-container">
                <i class="${iconClass}" style="color: ${iconColor};"></i>
            </div>
            <p class="confirm-message">${message}</p>
            ${options.detail ? `<p class="confirm-detail">${options.detail}</p>` : ''}
        </div>
    `;
    
    // 設置按鈕
    const buttons = [
        {
            text: options.cancelText,
            type: 'secondary',
            handler: onCancel
        },
        {
            text: options.confirmText,
            type: options.confirmButtonType,
            handler: onConfirm
        }
    ];
    
    // 創建模態窗口
    return createModal(title, content, {
        size: 'small',
        buttons: buttons
    });
}

/**
 * 創建並顯示提示消息模態窗口
 * @param {string} title - 模態窗口標題
 * @param {string} message - 消息文本
 * @param {string} type - 消息類型 ('success', 'info', 'warning', 'danger')
 * @param {Function} onClose - 關閉回調函數
 */
function showMessageModal(title, message, type = 'info', onClose = null) {
    // 設置圖標
    let iconClass = 'fa-solid fa-info-circle';
    let iconColor = 'var(--info-color)';
    
    switch (type) {
        case 'success':
            iconClass = 'fa-solid fa-check-circle';
            iconColor = 'var(--success-color)';
            break;
        case 'warning':
            iconClass = 'fa-solid fa-exclamation-triangle';
            iconColor = 'var(--warning-color)';
            break;
        case 'danger':
            iconClass = 'fa-solid fa-exclamation-circle';
            iconColor = 'var(--danger-color)';
            break;
    }
    
    // 創建內容
    const content = `
        <div class="confirm-modal">
            <div class="icon-container">
                <i class="${iconClass}" style="color: ${iconColor};"></i>
            </div>
            <p class="confirm-message">${message}</p>
        </div>
    `;
    
    // 創建模態窗口
    return createModal(title, content, {
        size: 'small',
        buttons: [{
            text: '確定',
            type: 'primary',
            handler: onClose
        }]
    });
}

/**
 * 創建並顯示載入中模態窗口
 * @param {string} message - 載入消息文本
 * @returns {HTMLElement} 模態窗口元素
 */
function showLoadingModal(message = '處理中，請稍候...') {
    // 使用通用模態窗口元素
    const modal = document.getElementById('generalModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    
    // 設置樣式
    modalContent.className = 'modal-content small';
    
    // 隱藏標題和頁腳
    modalTitle.style.display = 'none';
    modalFooter.style.display = 'none';
    
    // 移除關閉按鈕
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.style.display = 'none';
    }
    
    // 設置載入中內容
    modalBody.innerHTML = `
        <div class="loading-container" style="text-align: center; padding: 30px 20px;">
            <div class="spinner" style="margin-bottom: 20px;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 40px; color: var(--primary-color);"></i>
            </div>
            <p style="font-size: 16px;">${message}</p>
        </div>
    `;
    
    // 顯示模態窗口
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 禁止點擊關閉
    modal.onclick = null;
    document.onkeydown = null;
    
    return modal;
}

/**
 * 關閉載入中模態窗口
 * @param {HTMLElement} modal - 模態窗口元素
 */
function hideLoadingModal(modal = null) {
    if (!modal) {
        modal = document.getElementById('generalModal');
    }
    
    if (modal) {
        // 恢復預設設置
        const modalTitle = modal.querySelector('.modal-title');
        const modalFooter = modal.querySelector('.modal-footer');
        const closeBtn = modal.querySelector('.close-btn');
        
        modalTitle.style.display = '';
        modalFooter.style.display = '';
        
        if (closeBtn) {
            closeBtn.style.display = '';
        }
        
        // 隱藏模態窗口
        hideModal(modal);
    }
}

// 為簡化起見，將主要模態函數暴露到全局範圍
window.showModal = showModal;
window.hideModal = hideModal;
window.createModal = createModal;
window.showConfirmModal = showConfirmModal;
window.showMessageModal = showMessageModal;
window.showLoadingModal = showLoadingModal;
window.hideLoadingModal = hideLoadingModal;
