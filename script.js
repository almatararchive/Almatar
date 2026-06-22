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

    var pageNames = { home: 'الرئيسية', about: 'عن العائلة', tree: 'شجرة العائلة', figures: 'أعلام العائلة', departed: 'الراحلون', events: 'الأخبار والمناسبات', articles: 'المقالات', gallery: 'ألبوم الصور' };
    document.title = (id === 'home' ? '' : pageNames[id] + ' | ') + 'عائلة المَطَر | الأحساء - بلدة الفضول';

    localStorage.setItem('almatar-page', id);
    window.location.hash = id;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initScrollReveal, 100);
    return false;
}

(function restorePage() {
    var saved = localStorage.getItem('almatar-page');
    var hash = window.location.hash.replace('#', '');
    var target = hash || saved;
    if (target && target !== 'home') {
        var waitFor = setInterval(function () {
            if (document.getElementById(target) && typeof initScrollReveal === 'function') {
                clearInterval(waitFor);
                go(target);
            }
        }, 50);
    }
})();

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
});

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

if (typeof initNews === 'function') initNews();
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
            if (section.offsetParent === null) return;
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

// ========== IMAGE VIEWER ==========
function openImgViewer(src) {
    var modal = document.getElementById('imgModal');
    var img = document.getElementById('imgModalContent');
    if (!modal || !img) return;
    img.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeImgViewer() {
    var modal = document.getElementById('imgModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeImgViewer(); closePdfFullpage(); }
});

// ========== FULL-PAGE PDF VIEWER ==========
function closePdfFullpage() {
    var modal = document.getElementById('pdfFullpage');
    var iframe = document.getElementById('pdfFullpageIframe');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
    if (iframe) iframe.src = '';
}

// ========== ARTICLE JSON-LD SCHEMA ==========
(function injectArticleSchemas() {
    if (typeof newsData === 'undefined') return;
    var schemas = [];
    for (var i = 0; i < newsData.length; i++) {
        var item = newsData[i];
        if (item.hidden) continue;
        schemas.push({
            "@context": "https://schema.org",
            "@type": item.pdf ? "Article" : "NewsArticle",
            "headline": item.title,
            "datePublished": item.date,
            "image": item.image ? "https://almatararchive.github.io/Almatar/" + item.image : "",
            "author": { "@type": "Organization", "name": "عائلة المطر" },
            "description": (item.paragraphs && item.paragraphs.length) ? item.paragraphs[0].replace(/<[^>]*>/g, '') : "",
            "inLanguage": "ar-SA",
            "url": "https://almatararchive.github.io/Almatar/#" + (item.pdf ? "articles" : "events"),
            "isPartOf": { "@type": "WebSite", "name": "عائلة المطر", "url": "https://almatararchive.github.io/Almatar" }
        });
    }
    if (schemas.length) {
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemas);
        document.head.appendChild(script);
    }
})();

// ========== LAZY LOAD POLYFILL ==========
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
} else {
    // Simple fallback: load all images
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    imgs.forEach(function(img) {
        img.src = img.src;
    });
}

// ========== SEARCH FUNCTIONALITY ==========
var searchIndex = [];
var allContent = [];

// Initialize search index
(function() {
    // Collect all searchable content
    var contentItems = [];
    
    // Add news articles
    if (typeof newsData !== 'undefined') {
        for (var i = 0; i < newsData.length; i++) {
            var item = newsData[i];
            if (item.hidden) continue;
            
            contentItems.push({
                type: item.pdf ? 'article' : 'news',
                title: item.title,
                description: item.paragraphs ? item.paragraphs.join(' ') : '',
                date: item.date,
                tag: item.tag,
                url: item.pdf ? 'articles/' + item.id + '.html' : 'index.html#' + item.id,
                image: item.image,
                id: item.id
            });
        }
    }
    
    // Add articles page content
    var articles = document.querySelectorAll('.article-card');
    articles.forEach(function(article) {
        var title = article.querySelector('h3');
        var date = article.querySelector('.article-card-date');
        var tag = article.querySelector('.news-tag');
        
        if (title && date && tag) {
            contentItems.push({
                type: 'article',
                title: title.textContent,
                description: '',
                date: date.textContent,
                tag: tag.textContent,
                url: article.href || '#',
                image: null
            });
        }
    });
    
    // Add home page spotlight content
    var spotlightCards = document.querySelectorAll('.spot-card');
    spotlightCards.forEach(function(card) {
        var title = card.querySelector('h3');
        var date = card.querySelector('.spot-date');
        var tag = card.querySelector('.spot-tag');
        
        if (title && date && tag) {
            contentItems.push({
                type: 'spotlight',
                title: title.textContent,
                description: '',
                date: date.textContent,
                tag: tag.textContent,
                url: card.href || '#',
                image: null
            });
        }
    });
    
    // Add family names and terms
    var familyTerms = [
        'عائلة المطر', 'آل المطر', 'المطر', 'الأحساء', 'الفضول', 'بلدة الفضول', 
        'شجرة العائلة', 'أعلام العائلة', 'الراحلون', 'الأخبار', 'المناسبات', 
        'المقالات', 'التعارف', 'نسب', 'قبائل', 'بحث', 'تاريخ', 'ثقافة'
    ];
    
    familyTerms.forEach(function(term) {
        contentItems.push({
            type: 'term',
            title: term,
            description: 'مصطلح العائلة',
            date: '',
            tag: 'مصطلح',
            url: '#',
            image: null
        });
    });
    
    searchIndex = contentItems;
    allContent = contentItems.map(function(item) {
        return item.title + ' ' + item.description + ' ' + item.tag + ' ' + item.date;
    });
})();

// Search toggle functions
(function() {
    var searchToggle = document.getElementById('searchToggle');
    var searchBox = document.getElementById('searchBox');
    var searchOverlay = document.getElementById('searchOverlay');
    var searchClose = document.getElementById('searchClose');
    var searchInput = document.getElementById('searchInput');
    var searchInputOverlay = document.getElementById('searchInputOverlay');
    var searchSubmit = document.getElementById('searchSubmit');
    var searchSubmitOverlay = document.getElementById('searchSubmitOverlay');
    
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            if (searchBox.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }
    
    if (searchOverlay && searchClose) {
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            if (searchInputOverlay) searchInputOverlay.value = '';
            if (document.getElementById('searchResultsContainer')) {
                document.getElementById('searchResultsContainer').innerHTML = '';
            }
        });
    }
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (searchBox && !searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
            searchBox.classList.remove('active');
        }
    });
    
    // Search functions
    function performSearch(query) {
        var resultsContainer = document.getElementById('searchResultsContainer');
        var loading = document.getElementById('searchLoading');
        var empty = document.getElementById('searchEmpty');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        loading.style.display = 'block';
        empty.style.display = 'none';
        
        setTimeout(function() {
            loading.style.display = 'none';
            
            var searchTerm = query.toLowerCase();
            var filtered = searchIndex.filter(function(item) {
                var title = item.title.toLowerCase();
                var description = item.description.toLowerCase();
                var tag = item.tag.toLowerCase();
                var date = item.date.toLowerCase();
                
                return title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       tag.includes(searchTerm) || 
                       date.includes(searchTerm) ||
                       searchTerm.includes(title) ||
                       searchTerm.includes(description) ||
                       searchTerm.includes(tag) ||
                       searchTerm.includes(date);
            });
            
            if (filtered.length === 0) {
                empty.style.display = 'block';
                resultsContainer.innerHTML = '';
            } else {
                empty.style.display = 'none';
                renderSearchResults(filtered, searchTerm);
            }
        }, 300);
    }
    
    function renderSearchResults(results, searchTerm) {
        var container = document.getElementById('searchResultsContainer');
        var html = '';
        
        for (var i = 0; i < results.length; i++) {
            var item = results[i];
            
            // Highlight search term
            var highlightedTitle = item.title.replace(new RegExp(searchTerm, 'gi'), function(match) {
                return '<span class="search-highlight">' + match + '</span>';
            });
            
            var highlightedDesc = item.description ? item.description.replace(new RegExp(searchTerm, 'gi'), function(match) {
                return '<span class="search-highlight">' + match + '</span>';
            }) : '';
            
            var highlightedTag = item.tag ? item.tag.replace(new RegExp(searchTerm, 'gi'), function(match) {
                return '<span class="search-highlight">' + match + '</span>';
            }) : '';
            
            var imageHtml = item.image ? '<img src="' + item.image + '" alt="' + item.title + '" class="search-result-img" loading="lazy">' : '';
            
            html += '<a href="' + item.url + '" class="search-result-item">' +
                imageHtml +
                '<div class="search-result-content">' +
                    '<h3 class="search-result-title">' + highlightedTitle + '</h3>' +
                    (highlightedDesc ? '<p class="search-result-desc">' + highlightedDesc + '</p>' : '') +
                    '<div class="search-result-meta">' +
                        '<span class="search-result-tag">' + highlightedTag + '</span>' +
                        (item.date ? '<span>' + item.date + '</span>' : '') +
                        '<span>' + item.type + '</span>' +
                    '</div>' +
                '</div>' +
            '</a>';
        }
        
        container.innerHTML = html;
    }
    
    // Event listeners for search
    if (searchSubmit) {
        searchSubmit.addEventListener('click', function() {
            var query = searchInput.value;
            if (query.trim()) {
                searchOverlay.classList.add('active');
                performSearch(query);
            }
        });
    }
    
    if (searchSubmitOverlay) {
        searchSubmitOverlay.addEventListener('click', function() {
            var query = searchInputOverlay.value;
            if (query.trim()) {
                performSearch(query);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var query = searchInput.value;
                if (query.trim()) {
                    searchOverlay.classList.add('active');
                    performSearch(query);
                }
            }
        });
    }
    
    if (searchInputOverlay) {
        searchInputOverlay.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var query = searchInputOverlay.value;
                if (query.trim()) {
                    performSearch(query);
                }
            }
        });
    }
})();