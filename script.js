// === CURSOR ELEMENTS ===
const cursorGlow = document.getElementById('cursorGlow');
const cursorTrail = document.getElementById('cursorTrail');
const hoverCircle = document.getElementById('hoverCircle');
const featuredImageContainer = document.getElementById('featuredImageContainer');
const featuredImage = document.getElementById('featuredImage');

// === CURSOR POSITION ===
let mouseX = 0;
let mouseY = 0;
let trailX = 0;
let trailY = 0;

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

// === TRAIL ANIMATION - Smooth following ===
function animateTrail() {
    // Smooth interpolation for trail (creates the "hale" effect)
    const speed = 0.15;
    trailX += (mouseX - trailX) * speed;
    trailY += (mouseY - trailY) * speed;

    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';

    requestAnimationFrame(animateTrail);
}
animateTrail();

// === PROJECT TITLES HOVER EFFECTS ===
const projectTitles = document.querySelectorAll('.project-title');

projectTitles.forEach(title => {
    title.addEventListener('mouseenter', (e) => {
        // Activate hover circle
        hoverCircle.classList.add('active');

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
        // Deactivate hover circle
        hoverCircle.classList.remove('active');

        // Hide featured image
        featuredImageContainer.classList.remove('visible');
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
    const imgWidth = 300;
    const imgHeight = 400;

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
    cursorTrail.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
    cursorTrail.style.opacity = '1';
});

// === INITIAL CURSOR POSITION (off-screen) ===
cursorGlow.style.left = '-100px';
cursorTrail.style.left = '-100px';
