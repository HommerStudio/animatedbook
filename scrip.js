// 1. Setup Data
const book = document.querySelector('#book');
const papers = document.querySelectorAll('.paper');
const flipSound = document.getElementById('flip-sound');

// Start at paper 0 (the cover)
let currentPaper = 0;
let isAnimating = false;

// 2. Initialize Book Z-Indexes
// Unflipped pages must have descending z-indexes so Paper 0 is on top of Paper 1
function initBook() {
    papers.forEach((paper, index) => {
        paper.style.zIndex = papers.length - index;
    });
}
initBook();

// 3. The Page Turning Logic
function turnToPaper(targetPaper) {
    // Prevent overlapping clicks
    if (isAnimating || targetPaper === currentPaper) return;
    
    // Bounds check
    if (targetPaper < 0 || targetPaper >= papers.length) return;

    isAnimating = true;
    
    // Shift book position on mobile if opened/closed
    if (targetPaper > 0) {
        book.classList.add('open');
    } else {
        book.classList.remove('open');
    }

    const isForward = targetPaper > currentPaper;
    const steps = Math.abs(targetPaper - currentPaper);
    let i = 0;

    // We use setInterval to cascade the pages one by one
    const interval = setInterval(() => {
        if (i >= steps) {
            clearInterval(interval);
            isAnimating = false;
            return;
        }

        // Play sound if available
        if (flipSound) {
            flipSound.currentTime = 0;
            flipSound.play().catch(e => console.log("Audio not loaded or blocked"));
        }

        if (isForward) {
            // Turning Forward (Right to Left)
            papers[currentPaper].classList.add('flipped');
            
            // Immediately increase z-index so the flipped page sits on top of the left side
            papers[currentPaper].style.zIndex = currentPaper + 1; 
            currentPaper++;
        } else {
            // Turning Backward (Left to Right)
            currentPaper--;
            papers[currentPaper].classList.remove('flipped');
            
            // Restore original z-index so it sits correctly on the right side
            setTimeout(() => {
                papers[currentPaper].style.zIndex = papers.length - currentPaper;
            }, 400); // Wait halfway through CSS animation
        }

        i++;
    }, 180); // 180ms delay creates a realistic flutter effect for multiple pages
}
