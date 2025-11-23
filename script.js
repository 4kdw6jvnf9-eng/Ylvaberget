// Elements
const cursorGlow = document.getElementById('cursorGlow');
const hoverCircle = document.getElementById('hoverCircle');
const featuredImageContainer = document.getElementById('featuredImageContainer');
const featuredImage = document.getElementById('featuredImage');

// Mouse position
let mouseX = 0;
let mouseY = 0;
let currentHoveredTitle = null;

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

// Check if mouse is actually over the text characters
function isMouseOverText(title) {
    const chars = title.querySelectorAll('.char');
    for (const char of chars) {
        const rect = char.getBoundingClientRect();
        if (mouseX >= rect.left && mouseX <= rect.right &&
            mouseY >= rect.top && mouseY <= rect.bottom) {
            return true;
        }
    }
    return false;
}

// Character glow effect and hover detection
function updateEffects() {
    const glowRadius = 80;
    let foundHover = null;

    projectTitles.forEach(title => {
        let isOverThisTitle = false;

        title.querySelectorAll('.char').forEach(char => {
            const rect = char.getBoundingClientRect();
            const charX = rect.left + rect.width / 2;
            const charY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(mouseX - charX, 2) + Math.pow(mouseY - charY, 2));

            // Check if mouse is directly over this character
            if (mouseX >= rect.left && mouseX <= rect.right &&
                mouseY >= rect.top && mouseY <= rect.bottom) {
                isOverThisTitle = true;
            }

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

        if (isOverThisTitle) {
            foundHover = title;
        }
    });

    // Handle hover state changes
    if (foundHover !== currentHoveredTitle) {
        if (currentHoveredTitle) {
            // Mouse left previous title
            hoverCircle.classList.remove('active');
            cursorGlow.classList.remove('over-text');
            featuredImageContainer.classList.remove('visible');
        }

        if (foundHover) {
            // Mouse entered new title
            hoverCircle.classList.add('active');
            cursorGlow.classList.add('over-text');
            featuredImage.src = foundHover.getAttribute('data-image');
            featuredImage.alt = foundHover.textContent;
            positionImageNearTitle(foundHover);
            featuredImageContainer.classList.add('visible');
        }

        currentHoveredTitle = foundHover;
    }

    requestAnimationFrame(updateEffects);
}
updateEffects();

// Position image with just a corner/edge overlapping the title
function positionImageNearTitle(title) {
    const rect = title.getBoundingClientRect();
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const headerBottom = header.getBoundingClientRect().bottom;
    const footerTop = footer.getBoundingClientRect().top;

    const imgWidth = 200;
    const imgHeight = 280;

    // Positions where just a corner overlaps with title
    const positions = [
        // Top-left corner of image overlaps bottom-right of title
        { x: rect.right - 30, y: rect.bottom - 30 },
        // Top-right corner of image overlaps bottom-left of title
        { x: rect.left - imgWidth + 30, y: rect.bottom - 30 },
        // Bottom-left corner of image overlaps top-right of title
        { x: rect.right - 30, y: rect.top - imgHeight + 30 },
        // Bottom-right corner of image overlaps top-left of title
        { x: rect.left - imgWidth + 30, y: rect.top - imgHeight + 30 }
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
