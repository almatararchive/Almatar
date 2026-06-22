function renderSpotlight() {
    var container = document.getElementById('spotlightCards');
    if (!container) return;
    var html = '';
    var visible = [];
    for (var i = 0; i < newsData.length; i++) {
        if (!newsData[i].hidden) visible.push(newsData[i]);
    }
    for (var i = 0; i < Math.min(visible.length, 2); i++) {
        var item = visible[i];
        var imgHtml;
        if (item.image) {
            imgHtml = '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">';
        } else if (item.pdf) {
            imgHtml = '<div class="spot-pdf-icon">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
                '<span>PDF</span>' +
                '</div>';
        } else {
            imgHtml = '';
        }
        var spotTarget = item.pdf ? 'articles' : 'events';
        html += '<div class="spot-card" onclick="go(\'' + spotTarget + '\')">' +
            '<div class="spot-card-img">' +
            imgHtml +
            '<span class="spot-tag">' + item.tag + '</span>' +
            '</div>' +
            '<div class="spot-card-body">' +
            '<h3>' + item.title + '</h3>' +
            '<span class="spot-date">' + item.date + '</span>' +
            '</div>' +
            '</div>';
    }
    container.innerHTML = html;
}

function renderNews() {
    var featuredList = document.getElementById('newsFeaturedList');
    var sideList = document.getElementById('newsSideList');
    if (!featuredList) return;

    var featuredHtml = '';
    var sideHtml = '';

    for (var i = 0; i < newsData.length; i++) {
        var item = newsData[i];
        if (item.hidden) continue;
        if (item.image || item.pdf) {
            featuredHtml += renderFeatured(item);
        } else {
            sideHtml += renderSmallCard(item, i);
        }
    }

    featuredList.innerHTML = featuredHtml;
    if (sideList) sideList.innerHTML = sideHtml;
}

function renderFeatured(item) {
    var isPdf = item.pdf;

    var headerHtml;
    if (isPdf) {
        var imgStyle = item.image ? 'style="background-image:url(\'' + item.image + '\')"' : '';
        headerHtml = '<div class="news-featured-img news-pdf-header" ' + imgStyle + ' onclick="event.stopPropagation()">' +
            (item.image ? '' : '<div class="news-pdf-icon-wrap">' +
            '<svg class="news-pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
            '<span class="news-pdf-label">PDF</span>' +
            '</div>') +
            '<span class="news-tag">' + item.tag + '</span>' +
            '</div>';
    } else {
        var paras = '';
        for (var p = 0; p < item.paragraphs.length; p++) {
            if (item.isHadith && item.isHadith[p]) {
                paras += '<p class="hadith-text">' + item.paragraphs[p] + '</p>';
            } else {
                paras += '<p>' + item.paragraphs[p] + '</p>';
            }
        }

        var metaHtml = '';
        if (item.meta) {
            metaHtml = '<div class="news-meta">';
            for (var m = 0; m < item.meta.length; m++) {
                metaHtml += '<span>' + item.meta[m] + '</span>';
            }
            metaHtml += '</div>';
        }

        headerHtml = '<div class="news-featured-img" onclick="event.stopPropagation();openImgViewer(\'' + item.image + '\')">' +
            '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<span class="news-tag">' + item.tag + '</span>' +
            '</div>';
    }

    var clickHandler = isPdf ? 'openPdfFullpage(\'' + item.id + '\')' : 'toggleNewsCard(this)';

    var bodyHtml = '<h3>' + item.title + '</h3>' +
        '<p class="news-date">' + item.date + '</p>';

    if (!isPdf) {
        bodyHtml += '<div class="news-expand-content">' + paras + metaHtml + '</div>';
    }

    return '<div class="news-featured tilt-card" onclick="' + clickHandler + '">' +
        headerHtml +
        '<div class="news-featured-body">' +
        bodyHtml +
        '</div>' +
        '</div>';
}

function renderSmallCard(item, index) {
    var stagger = 'stagger-' + ((index % 3) + 1);

    return '<div class="news-small-card tilt-card reveal ' + stagger + '" onclick="toggleNewsCard(this)">' +
        '<div class="news-small-icon">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
        '</div>' +
        '<div class="news-small-body">' +
        '<span class="news-tag small">' + item.tag + '</span>' +
        '<h4>' + item.title + '</h4>' +
        '<p class="news-date">' + item.date + '</p>' +
        '<div class="news-expand-content">' +
        '<p>' + item.paragraphs[0] + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function renderArticles() {
    var container = document.getElementById('articlesGrid');
    if (!container) return;

    var html = '';
    for (var i = 0; i < newsData.length; i++) {
        var item = newsData[i];
        if (!item.pdf) continue;

        var thumbContent;
        if (item.image) {
            thumbContent = '<img src="' + item.image + '" alt="' + item.title + '" class="article-card-img" loading="lazy" onerror="this.style.display=\'none\'">';
        } else {
            thumbContent = '<iframe src="' + item.pdf + '#page=1&toolbar=0&navpanes=0&scrollbar=0&zoom=100" class="article-card-pdf-thumb" loading="lazy"></iframe>';
        }

        html += '<div class="article-card tilt-card" onclick="openPdfFullpage(\'' + item.id + '\')">' +
            '<div class="article-card-thumb">' +
            thumbContent +
            '<div class="article-card-overlay">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
            '<span>قراءة المقال</span>' +
            '</div>' +
            '<span class="news-tag">' + item.tag + '</span>' +
            '</div>' +
            '<div class="article-card-body">' +
            '<h3>' + item.title + '</h3>' +
            '<span class="article-card-date">' + item.date + '</span>' +
            '</div>' +
            '</div>';
    }

    container.innerHTML = html;
}

function openPdfFullpage(id) {
    var item = null;
    for (var i = 0; i < newsData.length; i++) {
        if (newsData[i].id === id) {
            item = newsData[i];
            break;
        }
    }
    if (!item || !item.pdf) return;

    var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;

    if (isMobile) {
        window.open(item.pdf, '_blank');
    } else {
        var modal = document.getElementById('pdfFullpage');
        var iframe = document.getElementById('pdfFullpageIframe');
        var titleEl = document.getElementById('pdfFullpageTitle');

        if (iframe) iframe.src = item.pdf;
        if (titleEl) titleEl.textContent = item.title;
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }
}

function initNews() {
    renderSpotlight();
    renderNews();
    renderArticles();
}
