const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('premiumCard');
let isWiping = false;
let hasStarted = false; 

// Initialize Screen
function startGame() {
    const nameValue = document.getElementById('userName').value;
    if (nameValue.trim() !== "") {
        document.getElementById('display-name').innerText = "প্রিয় " + nameValue + ",";
        
        // Hide name screen gently
        document.getElementById('name-screen').style.opacity = "0";
        setTimeout(() => {
            document.getElementById('name-screen').style.display = "none";
            hasStarted = true;
            initFog(); // Name lekhara por-i shudhu fog ashbe
        }, 800);
    } else {
        alert("তোমার নাম লিখো আগে!");
    }
}

function initFog() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Thick Fog Layer
    ctx.fillStyle = 'rgba(25, 35, 50, 0.98)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function wipe(e) {
    if (!isWiping || !hasStarted) return;
    if (e.cancelable) e.preventDefault(); // Stop scrolling

    let x = (e.touches ? e.touches[0].clientX : e.clientX);
    let y = (e.touches ? e.touches[0].clientY : e.clientY);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
}

function checkScratch() {
    if (!hasStarted) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    // Check every 40th pixel for performance
    for (let i = 3; i < pixels.length; i += 160) {
        if (pixels[i] === 0) transparent++;
    }

    const total = pixels.length / 160;
    const percentage = (transparent / total) * 100;

    // Strict Check: User-ke pray 60% window ghoshte hobe
    if (percentage > 60) {
        revealCard();
    }
}

function revealCard() {
    canvas.style.transition = "opacity 2s ease";
    canvas.style.opacity = "0";
    
    setTimeout(() => {
        card.classList.add('active'); // Final Letter Show
        canvas.style.display = "none";
        document.getElementById('msg').style.display = "none";
    }, 1000);
}

function closeCard() {
    card.classList.remove('active');
    canvas.style.display = "block";
    canvas.style.opacity = "1";
    initFog(); // Reset scratch
}

// Listeners for Mouse and Touch
canvas.addEventListener('mousedown', () => isWiping = true);
window.addEventListener('mouseup', () => { isWiping = false; checkScratch(); });
canvas.addEventListener('mousemove', wipe);

canvas.addEventListener('touchstart', (e) => { isWiping = true; }, {passive: false});
canvas.addEventListener('touchend', () => { isWiping = false; checkScratch(); });
canvas.addEventListener('touchmove', wipe, {passive: false});
