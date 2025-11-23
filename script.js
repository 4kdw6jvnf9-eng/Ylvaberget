// === CURSOR ELEMENTS ===
const cursorGlow = document.getElementById('cursorGlow');
const hoverCircle = document.getElementById('hoverCircle');
const featuredImageContainer = document.getElementById('featuredImageContainer');
const featuredImage = document.getElementById('featuredImage');

// === CURSOR POSITION ===
let mouseX = 0;
let mouseY = 0;

// === CUSTOM CURSOR MOVEMENT ===
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Move main cursor glow immediately
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';

    // Move hover circle with cursor
    hoverCircle.style.left = mouseX + 'px';
    hoverCircle.style.top = mouseY + 'px';
});

// === PROJECT TITLES SETUP ===
const projectTitles = document.querySelectorAll('.project-title');

// Split each title into individual character spans
projectTitles.forEach(title => {
    const text = title.textContent;
    title.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i]; // Use non-breaking space
        title.appendChild(span);
    }
});

// === CHARACTER GLOW EFFECT ===
// Update character colors based on mouse proximity
function updateCharacterGlow() {
    projectTitles.forEach(title => {
        const chars = title.querySelectorAll('.char');

        chars.forEach(char => {
            const rect = char.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const charCenterY = rect.top + rect.height / 2;

            // Calculate distance from mouse to character center
            const distance = Math.sqrt(
                Math.pow(mouseX - charCenterX, 2) +
                Math.pow(mouseY - charCenterY, 2)
            );

            // Glow radius - characters within this distance will be affected
            const glowRadius = 100;

            if (distance < glowRadius) {
                // Calculate intensity based on distance (closer = brighter)
                const intensity = 1 - (distance / glowRadius);

                // Interpolate between dark blue and light blue
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

// === PROJECT TITLES HOVER EFFECTS ===
projectTitles.forEach(title => {
    title.addEventListener('mouseenter', (e) => {
        // Activate hover circle and cursor glow
        hoverCircle.classList.add('active');
        cursorGlow.classList.add('over-text');

        // Get image source from data attribute
        const imageSrc = title.getAttribute('data-image');

        // Set and show featured image
        featuredImage.src = imageSrc;
        featuredImage.alt = title.textContent;

        // Position image near the hovered title
        positionImageNearTitle(title);

        featuredImageContainer.classList.add('visible');
    });

    title.addEventListener('mouseleave', () => {
        // Deactivate hover circle and cursor glow
        hoverCircle.classList.remove('active');
        cursorGlow.classList.remove('over-text');

        // Hide featured image
        featuredImageContainer.classList.remove('visible');

        // Reset all character colors
        const chars = title.querySelectorAll('.char');
        chars.forEach(char => {
            char.style.color = '';
        });
    });
});

// === POSITION IMAGE NEAR TITLE ===
// Places image randomly around the hovered title, slightly overlapping
function positionImageNearTitle(title) {
    const rect = title.getBoundingClientRect();
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    // Get boundaries (avoid header and footer)
    const headerBottom = header.getBoundingClientRect().bottom;
    const footerTop = footer.getBoundingClientRect().top;

    // Image dimensions
    const imgWidth = 200;
    const imgHeight = 280;

    // Random positions around the title
    // Array of possible positions relative to title
    const positions = [
        // Above and to the left
        { x: rect.left - imgWidth + 50, y: rect.top - imgHeight + 40 },
        // Above and to the right
        { x: rect.right - 50, y: rect.top - imgHeight + 40 },
        // Below and to the left
        { x: rect.left - imgWidth + 50, y: rect.bottom - 40 },
        // Below and to the right
        { x: rect.right - 50, y: rect.bottom - 40 },
        // To the left, vertically centered
        { x: rect.left - imgWidth + 60, y: rect.top - imgHeight / 2 + rect.height / 2 },
        // To the right, vertically centered
        { x: rect.right - 60, y: rect.top - imgHeight / 2 + rect.height / 2 }
    ];

    // Pick random position
    const randomIndex = Math.floor(Math.random() * positions.length);
    const position = positions[randomIndex];

    // Keep image within viewport bounds and outside header/footer
    const finalX = Math.max(10, Math.min(position.x, window.innerWidth - imgWidth - 10));
    const finalY = Math.max(headerBottom + 10, Math.min(position.y, footerTop - imgHeight - 10));

    // Apply position
    featuredImageContainer.style.left = finalX + 'px';
    featuredImageContainer.style.top = finalY + 'px';
}

// === HIDE CURSOR WHEN LEAVING WINDOW ===
document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
});

// === INITIAL CURSOR POSITION (off-screen) ===
cursorGlow.style.left = '-100px';
