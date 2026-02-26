const videoSources = [
    'video/backgroundA.mp4',
    'video/backgroundB.mp4',
    'video/backgroundC.mp4'
];

let currentVideoIndex = 0;
const video = document.getElementById('bg-video');
const titleText = document.querySelector('.title-text');
const enterBtn = document.querySelector('.enter-btn');
const contentWrapper = document.querySelector('.content-wrapper');

function initVideo() {
    video.src = videoSources[currentVideoIndex];
    video.load();
    
    video.addEventListener('ended', function onEnded() {
        currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
        video.src = videoSources[currentVideoIndex];
        video.play();
    });
    
    video.play().then(() => {
        video.classList.add('loaded');
    }).catch(err => {
        console.log('自动播放被阻止，等待用户交互');
    });
}

function startIntroAnimation() {
    setTimeout(() => {
        // 标题文字使用CSS动画，不需要添加类
    }, 500);
    
    setTimeout(() => {
        enterBtn.classList.add('visible');
    }, 2500);
}

function goToMain() {
    contentWrapper.style.transition = 'opacity 1.5s ease';
    contentWrapper.style.opacity = '0';
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1500);
}

window.goToMain = goToMain;

document.addEventListener('DOMContentLoaded', function() {
    initVideo();
    startIntroAnimation();
});
