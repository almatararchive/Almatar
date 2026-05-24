// ========== CAROUSEL ==========
let idx = 0;
let autoSlideInterval;

function slide(dir) {
    const s = document.querySelectorAll('.car-slide');
    const d = document.querySelectorAll('.dot');
    if (!s.length) return;
    s[idx].classList.remove('active');
    d[idx].classList.remove('active');
    idx = (idx + dir + s.length) % s.length;
    s[idx].classList.add('active');
    d[idx].classList.add('active');
    resetAutoSlide();
}

function dotGo(i) {
    const s = document.querySelectorAll('.car-slide');
    const d = document.querySelectorAll('.dot');
    if (!s.length) return;
    s[idx].classList.remove('active');
    d[idx].classList.remove('active');
    idx = i;
    s[idx].classList.add('active');
    d[idx].classList.add('active');
    resetAutoSlide();
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(function () {
        slide(1);
    }, 5000);
}

autoSlideInterval = setInterval(function () {
    slide(1);
}, 5000);

// Keyboard navigation for carousel
document.addEventListener('keydown', function (e) {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    const rect = carousel.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;
    if (e.key === 'ArrowRight') { slide(1); }
    if (e.key === 'ArrowLeft') { slide(-1); }
});

// ========== TOGGLE NEWS CARD ==========
function toggleNewsCard(el) {
    const isOpen = el.classList.contains('open');
    // Close all other open cards
    document.querySelectorAll('.news-featured.open, .news-small-card.open').forEach(function (c) {
        if (c !== el) c.classList.remove('open');
    });
    el.classList.toggle('open');
}

// ========== PAGE NAVIGATION ==========
function go(id) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
    document.getElementById('menu').classList.remove('open');
    var menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) menuBtn.classList.remove('active');

    var links = document.querySelectorAll('.menu a');
    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove('on');
        if (links[i].getAttribute('onclick') && links[i].getAttribute('onclick').includes("'" + id + "'")) {
            links[i].classList.add('on');
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Re-run scroll reveal for new page
    setTimeout(initScrollReveal, 100);
    return false;
}

// ========== MOBILE MENU ==========
document.addEventListener('DOMContentLoaded', function () {
    var menuBtn = document.querySelector('.menu-btn');
    var menu = document.getElementById('menu');
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function () {
            menu.classList.toggle('open');
            menuBtn.classList.toggle('active');
        });
        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                menu.classList.remove('open');
                menuBtn.classList.remove('active');
            }
        });
    }
});

// ========== SCROLL REVEAL (Intersection Observer) ==========
function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
        observer.observe(el);
    });
}

initScrollReveal();

// ========== HEADER SCROLL EFFECT ==========
(function () {
    var header = document.querySelector('.header');
    if (!header) return;
    var ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// ========== BACK TO TOP ==========
(function () {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'العودة إلى الأعلى');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);
    var ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (window.scrollY > 400) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ========== ACTIVE LINK ON SCROLL ==========
(function () {
    var sections = document.querySelectorAll('.page');
    var links = document.querySelectorAll('.menu a');
    if (!sections.length || !links.length) return;

    window.addEventListener('scroll', function () {
        var current = '';
        sections.forEach(function (section) {
            var top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        links.forEach(function (link) {
            link.classList.remove('on');
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes("'" + current + "'")) {
                link.classList.add('on');
            }
        });
    });
})();
