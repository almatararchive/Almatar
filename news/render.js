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
        html += '<div class="spot-card" onclick="goToArticle(\'' + item.id + '\')">' +
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
    var headerHtml;
    if (item.pdf) {
        headerHtml = '<div class="news-featured-img news-pdf-header">' +
            '<img src="' + item.image + '" alt="' + item.title + '" class="news-pdf-header-img" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<span class="news-tag">' + item.tag + '</span>' +
            '</div>';
    } else {
        headerHtml = '<div class="news-featured-img">' +
            '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<span class="news-tag">' + item.tag + '</span>' +
            '</div>';
    }

    return '<div class="news-featured" onclick="goToArticle(\'' + item.id + '\')">' +
        headerHtml +
        '<div class="news-featured-body">' +
        '<h3>' + item.title + '</h3>' +
        '<p class="news-date">' + item.date + '</p>' +
        '</div>' +
        '</div>';
}

function renderSmallCard(item, index) {
    var stagger = 'stagger-' + ((index % 3) + 1);

    return '<div class="news-small-card reveal ' + stagger + '" onclick="goToArticle(\'' + item.id + '\')">' +
        '<div class="news-small-icon">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
        '</div>' +
        '<div class="news-small-body">' +
        '<span class="news-tag small">' + item.tag + '</span>' +
        '<h4>' + item.title + '</h4>' +
        '<p class="news-date">' + item.date + '</p>' +
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

        html += '<div class="article-card" onclick="goToArticle(\'' + item.id + '\')">' +
            '<div class="article-card-thumb">' +
            '<img src="' + item.image + '" alt="' + item.title + '" class="article-card-img" loading="lazy" onerror="this.style.display=\'none\'">' +
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

function toggleArticle(el) {
    var isOpen = el.classList.contains('open');
    document.querySelectorAll('.article-card.open').forEach(function (c) {
        if (c !== el) c.classList.remove('open');
    });
    el.classList.toggle('open');
}

function renderArticleDetail(id) {
    var item = null;
    for (var i = 0; i < newsData.length; i++) {
        if (newsData[i].id === id) {
            item = newsData[i];
            break;
        }
    }
    if (!item) return;

    var container = document.getElementById('articleViewContent');
    if (!container) return;

    var isPdf = !!item.pdf;

    var parasHtml = '';
    for (var p = 0; p < item.paragraphs.length; p++) {
        if (item.isHadith && item.isHadith[p]) {
            parasHtml += '<p class="hadith-text">' + item.paragraphs[p] + '</p>';
        } else {
            parasHtml += '<p>' + item.paragraphs[p] + '</p>';
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

    var inlineImgHtml = '';
    if (item.image) {
        inlineImgHtml = '<div class="article-detail-inline-img reveal">' +
            '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy">' +
            '</div>';
    }

    var imgHtml;
    if (item.image) {
        imgHtml = '<div class="article-detail-img reveal-scale">' +
            '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<span class="news-tag">' + item.tag + '</span>' +
            '</div>';
    } else {
        imgHtml = '<div class="article-detail-img article-detail-noimg reveal-scale">' +
            '<span class="news-tag">' + item.tag + '</span>' +
            '</div>';
    }

    var pdfHtml = '';
    if (isPdf) {
        var pdfUrl = item.pdf;
        pdfHtml = '<div class="article-detail-pdf-section reveal">' +
            '<h2 class="article-detail-pdf-title">قراءة المستند الأصلي (PDF)</h2>' +
            '<div class="article-detail-pdf-links">' +
            '<a href="' + pdfUrl + '" target="_blank" class="article-detail-pdf-btn" rel="noopener">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
            'فتح PDF في نافذة جديدة' +
            '</a>' +
            '<a href="' + pdfUrl + '" download class="article-detail-pdf-btn article-detail-pdf-btn-dl" rel="noopener">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
            'تحميل PDF' +
            '</a>' +
            '</div>' +
            '<div class="news-pdf-viewer">' +
            '<embed src="' + pdfUrl + '" class="news-pdf-iframe" type="application/pdf">' +
            '</div>' +
            '</div>';
    }

    var html = '<div class="article-detail">' +
        '<div class="container">' +
        '<a href="#" class="article-detail-back" onclick="goBackFromArticle()">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>' +
        ' العودة' +
        '</a>' +
        '<article>' +
        imgHtml +
        pdfHtml +
        '<div class="article-detail-body reveal">' +
        '<h1 class="article-detail-title">' + item.title + '</h1>' +
        '<p class="article-detail-date">' + item.date + '</p>' +
        '<div class="article-detail-content">' +
        parasHtml +
        inlineImgHtml +
        metaHtml +
        '</div>' +
        '</div>' +
        '</article>' +
        '</div>' +
        '</div>';

    container.innerHTML = html;
}

function initNews() {
    renderSpotlight();
    renderNews();
    renderArticles();
}
