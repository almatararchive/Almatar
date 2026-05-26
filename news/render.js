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
        html += '<div class="spot-card" onclick="go(\'events\')">' +
            '<div class="spot-card-img">' +
            (item.image ? '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
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
        if (item.image) {
            featuredHtml += renderFeatured(item);
        } else {
            sideHtml += renderSmallCard(item, i);
        }
    }

    featuredList.innerHTML = featuredHtml;
    if (sideList) sideList.innerHTML = sideHtml;
}

function renderFeatured(item) {
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

    return '<div class="news-featured tilt-card" onclick="toggleNewsCard(this)">' +
        '<div class="news-featured-img" onclick="event.stopPropagation();openImgViewer(\'' + item.image + '\')">' +
        '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">' +
        '<span class="news-tag">' + item.tag + '</span>' +
        '</div>' +
        '<div class="news-featured-body">' +
        '<h3>' + item.title + '</h3>' +
        '<p class="news-date">' + item.date + '</p>' +
        '<div class="news-expand-content">' +
        paras +
        metaHtml +
        '</div>' +
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

function initNews() {
    renderSpotlight();
    renderNews();
    if (typeof initScrollReveal === 'function') {
        initScrollReveal();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNews);
} else {
    initNews();
}
