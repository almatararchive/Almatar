// ========== CAROUSEL ==========
let idx = 0;

function slide(dir) {
    const s = document.querySelectorAll('.car-slide');
    const d = document.querySelectorAll('.dot');
    s[idx].classList.remove('active');
    d[idx].classList.remove('active');
    idx = (idx + dir + s.length) % s.length;
    s[idx].classList.add('active');
    d[idx].classList.add('active');
}

function dotGo(i) {
    const s = document.querySelectorAll('.car-slide');
    const d = document.querySelectorAll('.dot');
    s[idx].classList.remove('active');
    d[idx].classList.remove('active');
    idx = i;
    s[idx].classList.add('active');
    d[idx].classList.add('active');
}

// Auto slide every 5 seconds
setInterval(function () {
    slide(1);
}, 5000);

// ========== TOGGLE ENVELOPE ==========
function toggleEnvelope(el) {
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
    var links = document.querySelectorAll('.menu a');
    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove('on');
    }
    if (event && event.target) {
        event.target.classList.add('on');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
}
