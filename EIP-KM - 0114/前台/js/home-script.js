/**
 * home-script.js
 * 首頁相關的功能腳本
 */

// 輪播狀態
let currentSlide = 0;
let slideInterval = null;

/**
 * 初始化首頁
 */
function initHome() {
    // 初始化輪播
    initCarousel();
}

/**
 * 初始化輪播
 */
function initCarousel() {
    const container = document.getElementById('carouselContainer');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!container || !dotsContainer) return;
    
    const slides = container.querySelectorAll('.carousel-slide');
    
    // 建立導航點
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    // 自動輪播
    startAutoSlide();
    
    // 滑鼠懸停暫停
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
}

/**
 * 前往指定幻燈片
 * @param {number} index - 幻燈片索引
 */
function goToSlide(index) {
    const container = document.getElementById('carouselContainer');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!container || !dotsContainer) return;
    
    const slides = container.querySelectorAll('.carousel-slide');
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    // 移除當前 active
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    
    // 設置新的 active
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
}

/**
 * 下一張幻燈片
 */
function nextSlide() {
    goToSlide(currentSlide + 1);
}

/**
 * 上一張幻燈片
 */
function prevSlide() {
    goToSlide(currentSlide - 1);
}

/**
 * 開始自動輪播
 */
function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 5000);
}

/**
 * 停止自動輪播
 */
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

/**
 * 切換公告頁籤
 * @param {string} tab - 頁籤類型 (all/dept)
 */
function switchAnnouncementTab(tab) {
    const tabs = document.querySelectorAll('.announcement-card .tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'all') {
        tabs[0]?.classList.add('active');
    } else {
        tabs[1]?.classList.add('active');
    }
    
    // 這裡可以根據 tab 載入不同的公告資料
    console.log('切換到公告頁籤:', tab);
}
