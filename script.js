/* =========================================
   عائلة المطر - الأحساء | السكريبت الرئيسي
   ========================================= */

// === PRELOADER ===
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 2200);
});

// === PAGE NAVIGATION ===
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');
    
    // Update nav active state
    document.querySelectorAll('.nav-links button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) btn.classList.add('active');
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show/hide footer
    const footer = document.getElementById('siteFooter');
    footer.style.display = pageId === 'home' ? 'none' : 'block';
    
    // Trigger fade animations
    setTimeout(() => initFadeAnimations(), 150);
    
    // Close mobile menu
    closeMobile();
}

// Hide footer initially (home page)
document.getElementById('siteFooter').style.display = 'none';

// === NAVBAR SCROLL ===
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const backTop = document.getElementById('backTop');
    
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backTop.classList.toggle('visible', window.scrollY > 350);
});

// === MOBILE MENU ===
function toggleMobile() {
    document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobile() {
    document.getElementById('mobileMenu').classList.remove('open');
}

// === MODAL ===
function showPersonModal(name, desc) {
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('personModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    document.getElementById('personModal').classList.remove('open');
    document.body.style.overflow = '';
}
document.getElementById('personModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// === FORM SUBMIT ===
function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fas fa-check-circle"></i> تم الإرسال بنجاح!';
    btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
}

// === GALLERY FILTER ===
function filterGallery(cat, btn) {
    document.querySelectorAll('.gt-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.g-card').forEach(card => {
        const show = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.style.display = show ? 'block' : 'none';
        if (show) card.style.animation = 'modIn .4s ease';
    });
}

// === EVENTS TAB FILTER ===
function switchEvTab(type, btn) {
    document.querySelectorAll('.ev-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.ev-card').forEach(card => {
        const cardType = card.getAttribute('data-type');
        const show = type === 'all' || cardType === type || cardType === 'all';
        card.style.display = show ? 'flex' : 'none';
        if (show) card.style.animation = 'modIn .4s ease';
    });
}

// === TREE ZOOM ===
let treeZoom = 1;
function zoomTree(factor) {
    treeZoom *= factor;
    treeZoom = Math.max(0.35, Math.min(1.6, treeZoom));
    const canvas = document.getElementById('treeCanvas');
    if (canvas) canvas.style.transform = `scale(${treeZoom})`;
}
function resetTreeZoom() {
    treeZoom = 1;
    const canvas = document.getElementById('treeCanvas');
    if (canvas) canvas.style.transform = 'scale(1)';
}

// === FADE-IN ANIMATIONS ===
function initFadeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), idx * 80);
            }
        });
    }, { threshold: 0.08 });
    
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
}
initFadeAnimations();

// === HERO PARTICLES ===
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    const colors = [
        'rgba(37,99,235,.06)',
        'rgba(30,64,175,.05)',
        'rgba(59,130,246,.05)',
        'rgba(96,165,250,.04)',
        'rgba(184,134,11,.03)'
    ];
    
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 130 + 25;
        p.style.cssText = `
            width:${size}px;height:${size}px;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            top:${Math.random() * 100}%;left:${Math.random() * 100}%;
            animation-delay:${Math.random() * 10}s;
            animation-duration:${Math.random() * 15 + 15}s;
        `;
        container.appendChild(p);
    }
}
createParticles();

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeMobile();
    }
});

// === TREE DRAG SCROLL ===
const treeW = document.getElementById('treeWrapper');
if (treeW) {
    let isDown = false, startX, startY, scrollL, scrollT;
    
    treeW.addEventListener('mousedown', (e) => {
        if (e.target.closest('.t-person')) return;
        isDown = true;
        treeW.style.cursor = 'grabbing';
        startX = e.pageX - treeW.offsetLeft;
        startY = e.pageY - treeW.offsetTop;
        scrollL = treeW.scrollLeft;
        scrollT = treeW.scrollTop;
    });
    
    treeW.addEventListener('mouseleave', () => { isDown = false; treeW.style.cursor = 'grab'; });
    treeW.addEventListener('mouseup', () => { isDown = false; treeW.style.cursor = 'grab'; });
    
    treeW.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - treeW.offsetLeft;
        const y = e.pageY - treeW.offsetTop;
        treeW.scrollLeft = scrollL - (x - startX) * 1.5;
        treeW.scrollTop = scrollT - (y - startY) * 1.5;
    });
    
    treeW.style.cursor = 'grab';
}

// === SMOOTH HOVER ===
document.querySelectorAll('.t-person').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all .3s cubic-bezier(.34,1.56,.64,1)';
    });
});
