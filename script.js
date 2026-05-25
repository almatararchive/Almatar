// ========== LOADING SCREEN ==========
(function () {
    var loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                loader.classList.add('hidden');
            }, 600);
        });
        // Fallback: hide after 5s even if not loaded
        setTimeout(function () {
            if (!loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 5000);
    }
})();

// ========== THEME TOGGLE ==========
(function () {
    var toggle = document.getElementById('themeToggle');
    var html = document.documentElement;
    var saved = localStorage.getItem('almatar-theme');
    if (saved === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }
    if (toggle) {
        toggle.addEventListener('click', function () {
            var isDark = html.getAttribute('data-theme') === 'dark';
            if (isDark) {
                html.removeAttribute('data-theme');
                localStorage.setItem('almatar-theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('almatar-theme', 'dark');
            }
        });
    }
})();

// ========== CURSOR GLOW ==========
(function () {
    var glow = document.getElementById('cursorGlow');
    if (!glow) return;
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) { glow.style.display = 'none'; return; }
    var ticking = false;
    document.addEventListener('mousemove', function (e) {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                glow.style.left = e.clientX + 'px';
                glow.style.top = e.clientY + 'px';
                if (glow.style.opacity === '0') glow.style.opacity = '1';
                ticking = false;
            });
            ticking = true;
        }
    });
    document.addEventListener('mouseleave', function () {
        glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
        glow.style.opacity = '1';
    });
})();

// ========== SCROLL PROGRESS BAR ==========
(function () {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            var percent = (scrollTop / docHeight) * 100;
            bar.style.width = percent + '%';
        }
    });
})();

// ========== CAROUSEL ==========
var idx = 0;
var autoSlideInterval;

function slide(dir) {
    var s = document.querySelectorAll('.car-slide');
    var d = document.querySelectorAll('.dot');
    if (!s.length) return;
    s[idx].classList.remove('active');
    d[idx].classList.remove('active');
    idx = (idx + dir + s.length) % s.length;
    s[idx].classList.add('active');
    d[idx].classList.add('active');
    resetAutoSlide();
}

function dotGo(i) {
    var s = document.querySelectorAll('.car-slide');
    var d = document.querySelectorAll('.dot');
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

document.addEventListener('keydown', function (e) {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;
    var rect = carousel.getBoundingClientRect();
    var isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;
    if (e.key === 'ArrowRight') { slide(1); }
    if (e.key === 'ArrowLeft') { slide(-1); }
});

// ========== TOGGLE NEWS CARD ==========
function toggleNewsCard(el) {
    var isOpen = el.classList.contains('open');
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
    setTimeout(initScrollReveal, 100);
    // Re-trigger counter animation on stats page
    setTimeout(animateCounters, 200);
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
        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
                menu.classList.remove('open');
                menuBtn.classList.remove('active');
            }
        });
    }

    // Init counters on load
    setTimeout(animateCounters, 500);
});

// ========== ANIMATED COUNTERS ==========
function animateCounters() {
    var counters = document.querySelectorAll('.stat-num');
    counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-target'));
        var current = parseInt(counter.textContent.replace(/,/g, ''));
        if (current >= target) return;
        var isVisible = function () {
            var rect = counter.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        };
        if (!isVisible()) return;

        var duration = 2000;
        var step = Math.ceil(target / 60);
        var start = 0;

        function update() {
            start += step;
            if (start >= target) {
                counter.textContent = target.toLocaleString();
                return;
            }
            counter.textContent = start.toLocaleString();
            requestAnimationFrame(update);
        }
        update();
    });
}

// Counter observer
(function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    var statsSection = document.querySelector('.stats');
    if (statsSection) observer.observe(statsSection);
})();

// ========== SCROLL REVEAL ==========
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

// ========== 3D TILT EFFECT ==========
(function () {
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    var cards = document.querySelectorAll('.tilt-card');
    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / centerY * -8;
            var rotateY = (x - centerX) / centerX * 8;
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });
})();

// ========== LAZY LOAD POLYFILL ==========
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
} else {
    // Simple fallback: load all images
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    imgs.forEach(function (img) {
        img.src = img.src;
    });
}