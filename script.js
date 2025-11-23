// Elements
const cursorGlow = document.getElementById('cursorGlow');
const hoverCircle = document.getElementById('hoverCircle');
const featuredImageContainer = document.getElementById('featuredImageContainer');
const featuredImage = document.getElementById('featuredImage');

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
    hoverCircle.style.left = mouseX + 'px';
    hoverCircle.style.top = mouseY + 'px';
});

// Split titles into individual characters
const projectTitles = document.querySelectorAll('.project-title');

projectTitles.forEach(title => {
    const text = title.textContent;
    title.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        title.appendChild(span);
    }
});

// Character glow effect based on mouse proximity
function updateCharacterGlow() {
    const glowRadius = 80;

    projectTitles.forEach(title => {
        title.querySelectorAll('.char').forEach(char => {
            const rect = char.getBoundingClientRect();
            const charX = rect.left + rect.width / 2;
            const charY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(mouseX - charX, 2) + Math.pow(mouseY - charY, 2));

            if (distance < glowRadius) {
                const intensity = 1 - (distance / glowRadius);
                const r = Math.round(30 + (224 - 30) * intensity);
                const g = Math.round(45 + (240 - 45) * intensity);
                const b = Math.round(80 + (255 - 80) * intensity);
                char.style.color = `rgb(${r}, ${g}, ${b})`;
            } else {
                char.style.color = '';
            }
        });
    });
    requestAnimationFrame(updateCharacterGlow);
}
updateCharacterGlow();

// Title hover effects
projectTitles.forEach(title => {
    title.addEventListener('mouseenter', () => {
        hoverCircle.classList.add('active');
        cursorGlow.classList.add('over-text');

        featuredImage.src = title.getAttribute('data-image');
        featuredImage.alt = title.textContent;
        positionImageNearTitle(title);
        featuredImageContainer.classList.add('visible');
    });

    title.addEventListener('mouseleave', () => {
        hoverCircle.classList.remove('active');
        cursorGlow.classList.remove('over-text');
        featuredImageContainer.classList.remove('visible');

        title.querySelectorAll('.char').forEach(char => {
            char.style.color = '';
        });
    });
});

// Position image near hovered title with overlap
function positionImageNearTitle(title) {
    const rect = title.getBoundingClientRect();
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const headerBottom = header.getBoundingClientRect().bottom;
    const footerTop = footer.getBoundingClientRect().top;

    const imgWidth = 200;
    const imgHeight = 280;

    // Positions that overlap significantly with the title text
    const titleCenterX = rect.left + rect.width / 2;
    const titleCenterY = rect.top + rect.height / 2;

    const positions = [
        { x: titleCenterX - imgWidth / 2 - 30, y: titleCenterY - imgHeight / 2 - 40 },
        { x: titleCenterX - imgWidth / 2 + 30, y: titleCenterY - imgHeight / 2 - 40 },
        { x: titleCenterX - imgWidth / 2 - 30, y: titleCenterY - imgHeight / 2 + 40 },
        { x: titleCenterX - imgWidth / 2 + 30, y: titleCenterY - imgHeight / 2 + 40 },
        { x: titleCenterX - imgWidth / 2, y: titleCenterY - imgHeight / 2 }
    ];

    const position = positions[Math.floor(Math.random() * positions.length)];
    const finalX = Math.max(10, Math.min(position.x, window.innerWidth - imgWidth - 10));
    const finalY = Math.max(headerBottom + 10, Math.min(position.y, footerTop - imgHeight - 10));

    featuredImageContainer.style.left = finalX + 'px';
    featuredImageContainer.style.top = finalY + 'px';
}

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
document.addEventListener('mouseenter', () => cursorGlow.style.opacity = '1');

// Initial cursor position
cursorGlow.style.left = '-100px';
