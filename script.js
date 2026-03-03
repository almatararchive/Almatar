/* ============================================
   AL MATAR FAMILY - PREMIUM JAVASCRIPT
   ============================================ */

// ── State ──
let currentPage = 'home';
let treeScale = 1;
let fontSizeLevel = 0;

// ── Preloader ──
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
        initReveal();
        showToast('أهلاً بكم في موقع عائلة المطر');
    }, 1800);
});

// ── Navigation ──
function navigateTo(pageId) {
    if (currentPage === pageId && pageId !== 'home') return;
    
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.animation = '';
    });
    
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        target.style.animation = 'fadeIn 0.4s ease';
    }
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    currentPage = pageId;
    localStorage.setItem('lastPage', pageId);
    
    setTimeout(initReveal, 100);
}

// ── Mobile Menu ──
const navToggleBtn = document.getElementById('navToggle');
if (navToggleBtn) {
    navToggleBtn.addEventListener('click', () => {
        const menu = document.getElementById('navMenu');
        const toggle = document.getElementById('navToggle');
        if (menu && toggle) {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        }
    });
}

// Close menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('navToggle');
    const mobileActions = document.querySelector('.nav-actions-mobile');
    if (menu && toggle && menu.classList.contains('active')) {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && 
            (!mobileActions || !mobileActions.contains(e.target))) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ── Scroll Effects ──
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);
    
    const btt = document.getElementById('backToTop');
    const fc = document.getElementById('fontControls');
    if (btt) btt.classList.toggle('visible', scrollY > 400);
    if (fc) fc.classList.toggle('visible', scrollY > 400);
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    const readingProgress = document.getElementById('readingProgress');
    if (readingProgress) readingProgress.style.width = progress + '%';
    
    revealElements();
});

const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Scroll Reveal ──
function initReveal() {
    document.querySelectorAll('.reveal-up').forEach(el => {
        el.classList.remove('revealed');
    });
    setTimeout(revealElements, 50);
}

function revealElements() {
    document.querySelectorAll('.reveal-up:not(.revealed)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add('revealed');
        }
    });
}

// ── Dark Mode ── (FIXED: using correct ID)
const themeToggleMobile = document.getElementById('themeToggleMobile');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateAllThemeIcons(savedTheme);

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateAllThemeIcons(next);
    showToast(next === 'dark' ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع النهاري ☀️');
}

function updateAllThemeIcons(theme) {
    // Update all theme toggle buttons
    document.querySelectorAll('#themeToggleMobile, #themeToggle, .theme-toggle, .theme-toggle-mobile').forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
}

// Attach click event to theme toggle
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

// ── Toast Notifications ──
function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ── Lightbox ──
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (lb && img) {
        img.src = src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }
}

const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
    lightboxEl.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeLightbox();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ── Event Detail Toggle ──
function toggleEventDetail(id) {
    const detail = document.getElementById(id);
    if (detail) {
        detail.classList.toggle('active');
        const btn = detail.previousElementSibling;
        if (btn && btn.tagName === 'BUTTON') {
            const icon = btn.querySelector('i');
            if (icon) {
                if (detail.classList.contains('active')) {
                    icon.className = 'fas fa-eye-slash';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i> إخفاء الدعوة';
                } else {
                    icon.className = 'fas fa-eye';
                    btn.innerHTML = '<i class="fas fa-eye"></i> عرض الدعوة كاملة';
                }
            }
        }
    }
}

// ── Events Filter ──
function filterEvents(type) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    
    document.querySelectorAll('.event-card').forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.4s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ── Countdown Timer ──
function updateCountdown() {
    const target = new Date('2026-02-20T18:00:00');
    const now = new Date();
    const diff = target - now;
    
    const toArabic = (n) => n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    
    if (diff <= 0) {
        ['countDays','countHours','countMinutes','countSeconds'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '٠';
        });
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = toArabic(val); };
    setVal('countDays', days);
    setVal('countHours', hours);
    setVal('countMinutes', minutes);
    setVal('countSeconds', seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Family Tree Controls ──
function zoomTree(delta) {
    treeScale = Math.max(0.3, Math.min(2, treeScale + delta));
    const canvas = document.getElementById('treeCanvas');
    if (canvas) canvas.style.transform = `scale(${treeScale})`;
}

function resetTree() {
    treeScale = 1;
    const canvas = document.getElementById('treeCanvas');
    if (canvas) canvas.style.transform = 'scale(1)';
}

// Tree Drag
const treeViewport = document.getElementById('treeViewport');
if (treeViewport) {
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    treeViewport.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - treeViewport.offsetLeft;
        startY = e.pageY - treeViewport.offsetTop;
        scrollLeft = treeViewport.scrollLeft;
        scrollTop = treeViewport.scrollTop;
    });
    
    treeViewport.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - treeViewport.offsetLeft;
        const y = e.pageY - treeViewport.offsetTop;
        treeViewport.scrollLeft = scrollLeft - (x - startX);
        treeViewport.scrollTop = scrollTop - (y - startY);
    });
    
    document.addEventListener('mouseup', () => { isDragging = false; });
    
    // Touch support
    treeViewport.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - treeViewport.offsetLeft;
        startY = e.touches[0].pageY - treeViewport.offsetTop;
        scrollLeft = treeViewport.scrollLeft;
        scrollTop = treeViewport.scrollTop;
    }, { passive: true });
    
    treeViewport.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - treeViewport.offsetLeft;
        const y = e.touches[0].pageY - treeViewport.offsetTop;
        treeViewport.scrollLeft = scrollLeft - (x - startX);
        treeViewport.scrollTop = scrollTop - (y - startY);
    }, { passive: true });
    
    treeViewport.addEventListener('touchend', () => { isDragging = false; }, { passive: true });
}

// ── Font Size Control ──
function changeFontSize(direction) {
    fontSizeLevel = Math.max(-3, Math.min(5, fontSizeLevel + direction));
    document.documentElement.style.fontSize = (16 + fontSizeLevel) + 'px';
    showToast(direction > 0 ? 'تم تكبير الخط' : 'تم تصغير الخط');
}

// ── Contact Form ──
function handleContact(e) {
    e.preventDefault();
    showToast('تم إرسال رسالتك بنجاح! ✅');
    e.target.reset();
}

// ── Keyboard Shortcuts ──
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const shortcuts = {
        '1': 'home', '2': 'about', '3': 'tree',
        '4': 'notable', '5': 'deceased', '6': 'events', '7': 'gallery', '8': 'contact'
    };
    
    if (shortcuts[e.key]) {
        e.preventDefault();
        navigateTo(shortcuts[e.key]);
    }
    
    if (e.key === 'd' || e.key === 'D' || e.key === 'ي') {
        toggleTheme();
    }
});

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    revealElements();
});
