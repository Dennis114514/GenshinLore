const navPageMap = {
    'home': 'main.html',
    'basic': 'basiclore.html',
    'history': 'Teyvathis.html',
    'nations': 'history-country.html',
    'brief': 'genshinbasichis.html',
    'about-manual': 'about.html',
    'about-site': 'aboutsite.html'
};


function goToMain() {
    const currentPage = window.location.href;
    if (!currentPage.includes('main.html')) {
        const basePath = getBasePath();
        window.location.href = basePath + 'main.html';
    }
}

window.goToMain = goToMain;

document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.nav-indicator');

    function updateIndicator(item) {
        const itemWidth = item.offsetWidth;
        const itemLeft = item.offsetLeft;
        
        indicator.style.width = itemWidth + 'px';
        indicator.style.left = itemLeft + 'px';
    }

    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            updateIndicator(this);
        });
    });

    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        updateIndicator(activeItem);
    }

    window.addEventListener('resize', function() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            updateIndicator(activeItem);
        }
    });
});
