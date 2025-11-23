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

        // Position image at random edge position
        positionImageAtEdge();

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

// === POSITION IMAGE AT RANDOM EDGE ===
// Grid: 4 columns (horizontal) x 3 rows (vertical)
function positionImageAtEdge() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    // Get boundaries (avoid header and footer)
    const headerHeight = header.offsetHeight + header.offsetTop;
    const footerTop = footer.offsetTop;

    // Available area
    const availableWidth = window.innerWidth;
    const availableHeight = footerTop - headerHeight;

    // Image dimensions
    const imgWidth = 200;
    const imgHeight = 280;

    // Define grid positions along edges
    // 4 columns x 3 rows = 12 edge positions
    const gridCols = 4;
    const gridRows = 3;

    // Calculate cell sizes
    const cellWidth = availableWidth / gridCols;
    const cellHeight = availableHeight / gridRows;

    // Create array of edge positions
    const edgePositions = [];

    // Top edge (row 0, all columns)
    for (let col = 0; col < gridCols; col++) {
        edgePositions.push({
            x: col * cellWidth + (cellWidth - imgWidth) / 2,
            y: headerHeight + 20
        });
    }

    // Bottom edge (row 2, all columns)
    for (let col = 0; col < gridCols; col++) {
        edgePositions.push({
            x: col * cellWidth + (cellWidth - imgWidth) / 2,
            y: footerTop - imgHeight - 20
        });
    }

    // Left edge (col 0, middle rows)
    for (let row = 1; row < gridRows - 1; row++) {
        edgePositions.push({
            x: 20,
            y: headerHeight + row * cellHeight + (cellHeight - imgHeight) / 2
        });
    }

    // Right edge (col 3, middle rows)
    for (let row = 1; row < gridRows - 1; row++) {
        edgePositions.push({
            x: availableWidth - imgWidth - 20,
            y: headerHeight + row * cellHeight + (cellHeight - imgHeight) / 2
        });
    }

    // Pick random position
    const randomIndex = Math.floor(Math.random() * edgePositions.length);
    const position = edgePositions[randomIndex];

    // Apply position
    featuredImageContainer.style.left = Math.max(0, position.x) + 'px';
    featuredImageContainer.style.top = Math.max(headerHeight, position.y) + 'px';
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
