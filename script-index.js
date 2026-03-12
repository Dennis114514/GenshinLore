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

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let isFormed = false;
let textAlpha = 0;
let particlesExploded = true;
let animationStarted = false;
let particleFadeOut = 1;

const titleString = "All of Sun and Moon";
let fontSize = 72;
let particles = [];

class Particle {
    constructor(targetX, targetY) {
        this.baseX = targetX;
        this.baseY = targetY;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 40;
        this.vy = (Math.random() - 0.5) * 40;
    }
}

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];

    fontSize = Math.min(canvas.width / 12, 72);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.font = `${fontSize}px 'Khaenriah', serif`;
    tempCtx.fillStyle = 'white';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = -2; i <= 2; i++) {
        tempCtx.fillText(titleString, centerX, centerY + i);
    }

    const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const gap = 3;

    for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
            const index = (y * canvas.width + x) * 4;
            const opacity = imageData[index + 3];
            if (opacity > 128) {
                particles.push(new Particle(x, y));
            }
        }
    }
}

function drawRealText(alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${fontSize}px 'Khaenriah', serif`;
    ctx.fillStyle = '#D3BC8E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(211, 188, 142, 0.5)';
    ctx.shadowBlur = 20;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.fillText(titleString, centerX, centerY);
    ctx.restore();
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isFormed) {
        let almostArrived = true;
        particles.forEach(p => {
            p.x += (p.baseX - p.x) * 0.04;
            p.y += (p.baseY - p.y) * 0.04;

            if (Math.abs(p.baseX - p.x) > 15 || Math.abs(p.baseY - p.y) > 15) {
                almostArrived = false;
            }
        });

        if (almostArrived) {
            textAlpha += 0.03;
            if (textAlpha > 1) textAlpha = 1;
        }
        particlesExploded = false;

    } else {
        textAlpha -= 0.1;
        if (textAlpha < 0) textAlpha = 0;

        if (textAlpha <= 0.7) {
            if (!particlesExploded) {
                particles.forEach(p => {
                    p.vx = (Math.random() - 0.5) * 45;
                    p.vy = (Math.random() - 0.5) * 45;
                });
                particlesExploded = true;
            }
        }

        if (particlesExploded) {
            particleFadeOut -= 0.02;
            if (particleFadeOut < 0) particleFadeOut = 0;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.88;
                p.vy *= 0.88;
                p.x += Math.sin(Date.now() * 0.001 + p.baseX) * 0.4;
                p.y += Math.cos(Date.now() * 0.001 + p.baseY) * 0.4;
            });
        }
    }

    let particleAlpha = (1 - textAlpha) * particleFadeOut;

    if (particleAlpha > 0.01) {
        ctx.globalAlpha = particleAlpha;
        ctx.fillStyle = '#D3BC8E';
        ctx.beginPath();
        particles.forEach(p => {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        });
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    if (textAlpha > 0.01) {
        drawRealText(textAlpha);
    }

    requestAnimationFrame(animateParticles);
}

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

function waitForFontLoad() {
    return new Promise((resolve) => {
        if (document.fonts && document.fonts.load) {
            document.fonts.load('72px "Khaenriah"').then(() => {
                resolve();
            }).catch(() => {
                setTimeout(resolve, 500);
            });
        } else {
            setTimeout(resolve, 500);
        }
    });
}

function startIntroAnimation() {
    waitForFontLoad().then(() => {
        initParticles();
        animateParticles();

        setTimeout(() => {
            isFormed = true;
            animationStarted = true;
        }, 500);

        setTimeout(() => {
            enterBtn.classList.add('visible');
        }, 3500);
    });
}

function goToMain() {
    isFormed = false;

    setTimeout(() => {
        contentWrapper.style.transition = 'opacity 1.5s ease';
        contentWrapper.style.opacity = '0';
    }, 300);

    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1800);
}

window.goToMain = goToMain;

window.addEventListener('resize', () => {
    if (animationStarted) {
        waitForFontLoad().then(() => {
            initParticles();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initVideo();
    startIntroAnimation();
});
