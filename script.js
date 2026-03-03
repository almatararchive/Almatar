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
        document.getElementById('preloader').classList.add('hidden');
        initReveal();
        showToast('أهلاً بكم في موقع عائلة المطر');
    }, 1800);
});

// ── Navigation ──
function navigateTo(pageId) {
    if (currentPage === pageId && pageId !== 'home') return;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.animation = '';
    });
    
    // Show target page
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        target.style.animation = 'fadeIn 0.4s ease';
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // Close mobile menu
    document.getElementById('navMenu').classList.remove('active');
    document.getElementById('navToggle').classList.remove('active');
    document.body.style.overflow = '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    currentPage = pageId;
    
    // Save last visited page
    localStorage.setItem('lastPage', pageId);
    
    // Re-init reveal animations
    setTimeout(initReveal, 100);
}

// ── Mobile Menu ──
document.getElementById('navToggle').addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('navToggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('navToggle');
    if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ── Scroll Effects ──
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Navbar
    document.getElementById('navbar').classList.toggle('scrolled', scrollY > 50);
    
    // Back to top
    const btt = document.getElementById('backToTop');
    const fc = document.getElementById('fontControls');
    if (scrollY > 400) {
        btt.classList.add('visible');
        fc.classList.add('visible');
    } else {
        btt.classList.remove('visible');
        fc.classList.remove('visible');
    }
    
    // Reading progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    document.getElementById('readingProgress').style.width = progress + '%';
    
    // Reveal elements
    revealElements();
});

document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

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

// ── Dark Mode ──
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    showToast(next === 'dark' ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع النهاري ☀️');
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ── Toast Notifications ──
function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');
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
    document.getElementById('lightboxImg').src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ── Event Detail Toggle ──
function toggleEventDetail(id) {
    const detail = document.getElementById(id);
    if (detail) {
        detail.classList.toggle('active');
    }
}

// ── Events Filter ──
function filterEvents(type) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
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
    
    if (diff <= 0) {
        document.getElementById('countDays').textContent = '٠';
        document.getElementById('countHours').textContent = '٠';
        document.getElementById('countMinutes').textContent = '٠';
        document.getElementById('countSeconds').textContent = '٠';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const toArabic = (n) => n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    
    document.getElementById('countDays').textContent = toArabic(days);
    document.getElementById('countHours').textContent = toArabic(hours);
    document.getElementById('countMinutes').textContent = toArabic(minutes);
    document.getElementById('countSeconds').textContent = toArabic(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Family Tree Controls ──
function zoomTree(delta) {
    treeScale = Math.max(0.3, Math.min(2, treeScale + delta));
    document.getElementById('treeCanvas').style.transform = `scale(${treeScale})`;
}

function resetTree() {
    treeScale = 1;
    document.getElementById('treeCanvas').style.transform = 'scale(1)';
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
        '4': 'notable', '5': 'events', '6': 'gallery', '7': 'contact'
    };
    
    if (shortcuts[e.key]) {
        e.preventDefault();
        navigateTo(shortcuts[e.key]);
    }
    
    if (e.key === 'd' || e.key === 'D' || e.key === 'ي') {
        themeToggle.click();
    }
});

// ── Restore Last Page ──
const lastPage = localStorage.getItem('lastPage');
if (lastPage && lastPage !== 'home') {
    // Uncomment below to auto-restore:
    // navigateTo(lastPage);
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    revealElements();
});
