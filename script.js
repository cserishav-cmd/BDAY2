document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const TOTAL_IMAGES = 22; // Set to exact number of images
    // Map directly to assets 1-22
    const imagePath = (num) => `assets/${num}.jpeg`;
    const pageFlipSound = new Audio('assets/page_flip.mp3');
    const stickerNames = [
        "sticker_childhood", "sticker_cool", "sticker_fun",
        "sticker_grad", "sticker_love", "sticker_nature",
        "sticker_nostalgia", "sticker_party", "sticker_school",
        "sticker_travel", "sticker_girlfriend", "sticker_love_fly",
        "sticker_travelinghill"
    ];

    // --- Load Environment Variables ---
    let env = { login_id: '', login_pass: '' };
    fetch('config.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP status ${res.status}`);
            return res.json();
        })
        .then(data => {
            env = data; // Simple assignment for JSON
        })
        .catch(e => {
            console.error("Failed to load config.json", e);
            const err = document.getElementById('error-msg');
            if (err) {
                err.innerHTML = "⚠️ Config load failed. If opening file directly, use a local server.";
                err.classList.remove('hidden');
                err.style.color = "#ffdd57";
            }
        });

    // --- Image Protection (No Right Click / Drag) ---
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // --- Countdown Timer ---
    const targetDate = new Date("February 01, 2026 00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes");
        const sEl = document.getElementById("seconds");
        const cEl = document.getElementById("countdown");

        if (distance < 0) {
            // Birthday has arrived!
            if (cEl) cEl.innerHTML = "<div class='time-block'><span>Happy Birthday!</span></div>";
        } else {
            if (dEl) dEl.innerText = String(days).padStart(2, '0');
            if (hEl) hEl.innerText = String(hours).padStart(2, '0');
            if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
            if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // --- Gallery Population ---
    const galleryContainer = document.getElementById('gallery-container');
    const captions = [
        "Howrah Jn (HWH)", "Tikiapara (TPKR)", "Santragachi Jn (SRC)",
        "Andul (ADL)", "Sankrail (SEL)", "Nalpur (NALR)",
        "Bauria (BVA)", "Uluberia (ULB)", "Kulgachia (KGY)",
        "Bagnan (BZN)", "Deulti (DTE)", "Kolaghat (QGT)",
        "Mecheda (MCA)", "Bhogpur (BOP)", "Panskura Jn (PKU)",
        "Khirai (KHAI)", "Haur (HAUR)", "Radhamohanpur (RDU)",
        "Balichak (BCK)", "Shyam Chak (SMCK)", "Madpur (MPD)",
        "Kharagpur Jn (KGP)"
    ];

    // Love Notes for Modal (Pop-up)
    const loveNotes = [
        "You, me, and our forever. ❤️",
        "You are my forever favorite person. ❤️",
        "Our love knows no boundaries or borders. ❤️",
        "You are the home my heart belongs to. 🫰🏻",
        "Let's get lost in our own little world. 😘",
        "Collecting a lifetime of memories with you. ❤️",
        "You are the only notification I wait for.❤️",
        "I'm so incredibly glad you exist in my life. 😘",
        "Always and forever, it's just us. ❤️",
        "আমাদের হবু বাবা ও মা হওয়ার সুন্দর যাত্রা। ❤️",
        "You plus me equals a lifetime of love. ❤️<br><br> You + Me = <3",
        "You and I, a perfect little world. 🫰🏻",
        "Our love story needs no caption. ❤️",
        "Our love story needs no caption to be perfect. ❤️",
        "Hi love ❤️",
        "A love so pure it needs no caption. ❤️",
        "No caption ❤️",
        "হ্যালো!! আমার প্রিয় বোমকেশ, আমি তোমার চিরকালের সত্যবতী! ❤️🫰🏻",
        "বোমকেশ আর সত্যবতীর এক মিষ্টি প্রেমের গল্প। ❤️🫰🏻",
        "❤️",
        "মা দুগ্গা আমাদের দুজনকে সবসময় খুব ভালো রাখুক।❤️",
        "🩷😎"
    ];

    // Single Word Labels for Polaroids (Visible on card)
    const polaroidLabels = [
        "Forever", "Soulmate", "Journey", "Home", "Magic",
        "Memories", "Notification", "Blessing", "Us", "Future",
        "Infinity", "World", "Unspoken", "Perfect", "Love",
        "Pure", "Canvas", "Byomkesh", "Story", "Heart",
        "Protection", "Vibe"
    ];

    // Random Dates for 22 Images
    const dates = [
        "14 Feb 2024", "02 Mar 2024", "18 Mar 2024", "05 Apr 2024",
        "22 Apr 2024", "09 May 2024", "26 May 2024", "12 Jun 2024",
        "29 Jun 2024", "16 Jul 2024", "02 Aug 2024", "19 Aug 2024",
        "05 Sep 2024", "22 Sep 2024", "09 Oct 2024", "26 Oct 2024",
        "12 Nov 2024", "29 Nov 2024", "16 Dec 2024", "02 Jan 2025",
        "19 Jan 2025", "01 Feb 2026"
    ];

    // Generate dates starting from a meaningful date or random
    // const baseDate = new Date("2025-08-18"); 
    // const generateDate = (index) => { ... } // Removed

    if (galleryContainer) {
        for (let i = 1; i <= TOTAL_IMAGES; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'polaroid-item fade-on-scroll';

            // Inner Card for the Photo (The destination)
            const innerCard = document.createElement('div');
            innerCard.className = 'polaroid-wrapper-inner';

            // Random Rotation Variable
            // const randomRot = Math.random() * 6 - 3; 
            // wrapper.style.setProperty('--rotation', `${randomRot}deg`);
            wrapper.style.setProperty('--rotation', `0deg`); // Force straight

            const img = document.createElement('img');
            img.src = imagePath(i);
            img.className = 'polaroid-photo'; // Add specific class
            img.loading = 'lazy';
            img.alt = `Memory ${i}`;

            // Staggered entrance delay
            wrapper.style.animationDelay = `${i * 0.1}s`;

            // Caption (The Station Board - Outside inner card)
            const caption = document.createElement('div');
            caption.className = 'caption';
            // Recycle captions
            caption.innerText = captions[(i - 1) % captions.length] || "Station";

            // Corner Sticker
            const stickerImg = document.createElement('img');
            // Cycle through stickers to ensure all are used
            const stickerName = stickerNames[(i - 1) % stickerNames.length];
            stickerImg.src = `assets/${stickerName}.png`;
            stickerImg.className = 'sticker-corner';
            stickerImg.alt = 'sticker';

            // Handwritten Caption on Polaroid
            const noteText = document.createElement('div');
            noteText.className = 'polaroid-handwriting';
            // Use the single word label
            noteText.innerHTML = polaroidLabels[i - 1] || "Love";

            // Magic Overlay (simplified)
            const overlay = document.createElement('div');
            overlay.className = 'magic-overlay';
            overlay.innerHTML = `<div class="butterfly b1"><i class="fas fa-dove"></i></div>`;

            // Assemble Inner Card
            innerCard.appendChild(img);
            innerCard.appendChild(stickerImg);
            innerCard.appendChild(noteText); // Add text
            innerCard.appendChild(overlay);

            // Assemble Main Item (Row)
            // Order depends on CSS flex-direction, but DOM order: InnerCard, Caption
            wrapper.appendChild(innerCard);
            wrapper.appendChild(caption);

            galleryContainer.appendChild(wrapper);

            // Click Listener (on the card)
            innerCard.addEventListener('click', () => {
                // Trigger fly animation
                stickerImg.classList.add('fly-effect');
                currentSticker = stickerImg;

                pageFlipSound.currentTime = 0;
                pageFlipSound.play().catch(e => console.error("Sound play failed:", e));

                // Delay modal slightly to show effect
                setTimeout(() => {
                    // Pass 0-based index
                    openModal(i - 1);
                }, 600);
            });
        }
    }

    // --- Content Observer ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px" };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.fade-on-scroll');
    scrollElements.forEach(el => scrollObserver.observe(el));

    // --- Music Player Logic ---
    const bgMusic = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-pause-btn');
    const musicIcon = document.querySelector('.music-note-anim');

    let isPlaying = false;

    function togglePlay() {
        if (isPlaying) {
            bgMusic.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (musicIcon) musicIcon.style.animationPlayState = 'paused';
        } else {
            bgMusic.play().then(() => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                if (musicIcon) musicIcon.style.animationPlayState = 'running';
            }).catch(e => console.log("Audio play blocked:", e));
        }
        isPlaying = !isPlaying;
    }

    const lyricsBtn = document.getElementById('floating-lyrics-btn');
    const lyricsWidget = document.querySelector('.now-playing-widget');

    if (playBtn) playBtn.addEventListener('click', togglePlay);

    if (lyricsBtn && lyricsWidget) {
        lyricsBtn.addEventListener('click', () => {
            lyricsWidget.classList.toggle('active');
            // Toggle active state styling on button
            if (lyricsWidget.classList.contains('active')) {
                lyricsBtn.style.background = 'var(--primary-color)';
                lyricsBtn.style.color = '#fff';
            } else {
                lyricsBtn.style.background = '#fff';
                lyricsBtn.style.color = 'var(--primary-color)';
            }
        });
    }

    // --- Lyrics Sync Logic ---
    const lyricsData = [
        { start: 0, end: 5, text: "নাথ, তুমি এসো ধীরে" },
        { start: 5, end: 11, text: "সুখ-দুঃখ-হাসি-নয়ননীরে" },
        { start: 11, end: 16, text: "লহো আমার জীবন ঘিরে" },
        { start: 16, end: 21, text: "লহো আমার জীবন ঘিরে" },
        { start: 22, end: 32, text: "সংসারে সব কাজে ধ্যানে জ্ঞানে হৃদয়ে রহো ॥" },
        { start: 33, end: 39, text: "হে সখা, মম হৃদয়ে রহো।" },
        { start: 39, end: 43, text: "হে সখা, মম হৃদয়ে রহো।" }
    ];

    const lyricsContainer = document.querySelector('.lyrics-content');

    if (bgMusic && lyricsContainer) {
        // Clear static placeholder content
        lyricsContainer.innerHTML = '';

        // Populate initial lyrics
        lyricsData.forEach((line, index) => {
            const p = document.createElement('p');
            p.innerText = line.text;
            p.dataset.index = index;
            lyricsContainer.appendChild(p);
        });

        let lastActiveIndex = -1;

        bgMusic.addEventListener('timeupdate', () => {
            const currentTime = bgMusic.currentTime;

            // Find active lyric
            let activeIndex = -1;
            for (let i = 0; i < lyricsData.length; i++) {
                if (currentTime >= lyricsData[i].start && currentTime < lyricsData[i].end) {
                    activeIndex = i;
                    break;
                }
            }

            // Only update if changed prevents scroll locking
            if (activeIndex !== lastActiveIndex) {
                const lines = lyricsContainer.querySelectorAll('p');
                lines.forEach((line, idx) => {
                    if (idx === activeIndex) {
                        line.classList.add('highlight');
                        // Auto-scroll logic (manual calculation to prevent page jump)
                        if (lyricsContainer) {
                            const containerHeight = lyricsContainer.clientHeight;
                            const lineHeight = line.clientHeight;
                            const lineTop = line.offsetTop;
                            // Scroll container to center the line
                            lyricsContainer.scrollTo({
                                top: lineTop - containerHeight / 2 + lineHeight / 2,
                                behavior: 'smooth'
                            });
                        }
                    } else {
                        line.classList.remove('highlight');
                    }
                });
                lastActiveIndex = activeIndex;
            }
        });
    }

    document.body.addEventListener('click', () => {
        if (!isPlaying && bgMusic.paused) { /* togglePlay(); */ }
    }, { once: true });


    // --- Music Play Helper ---
    function tryPlayMusic() {
        if (!isPlaying && bgMusic.paused) {
            bgMusic.play().then(() => {
                isPlaying = true;
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                if (musicIcon) musicIcon.style.animationPlayState = 'running';
            }).catch(e => console.log("Auto-play blocked:", e));
        }
    }

    // --- Caution Page Logic ---
    const cautionPage = document.getElementById('caution-page');
    const enterBtn = document.getElementById('enter-site-btn');

    // Only activate caution logic if on mobile (matching CSS breakpoint)
    if (cautionPage && enterBtn && window.innerWidth <= 900) {
        document.body.classList.add('locked'); // Lock scroll

        enterBtn.addEventListener('click', () => {
            cautionPage.style.opacity = '0';
            cautionPage.style.pointerEvents = 'none'; // Allow clicks through
            document.body.classList.remove('locked'); // Unlock scroll

            tryPlayMusic(); // Start music

            setTimeout(() => {
                cautionPage.style.display = 'none';
            }, 800);
        });
    }

    // --- Login Logic ---
    const introPage = document.getElementById('intro-page');
    const loginBtn = document.getElementById('login-btn');
    const loginInput = document.getElementById('login-pass');
    const loginUser = document.getElementById('login-user');
    const errorMsg = document.getElementById('error-msg');

    function checkLogin() {
        const password = loginInput.value.trim();
        const username = loginUser ? loginUser.value.trim() : "";

        if (username === "ambar" && password === "ambar@51") {
            // Success
            if (errorMsg) errorMsg.classList.add('hidden');

            // Fade out intro
            introPage.style.opacity = '0';
            introPage.style.pointerEvents = 'none';
            document.body.classList.remove('locked');

            tryPlayMusic(); // Start music

            setTimeout(() => {
                introPage.style.display = 'none';
            }, 800);
        } else {
            // Failure
            if (errorMsg) {
                errorMsg.innerText = "Incorrect Username or Password!";
                errorMsg.classList.remove('hidden');

                // Shake effect on both
                if (loginUser) loginUser.style.border = "2px solid red";
                loginInput.style.border = "2px solid red";

                setTimeout(() => {
                    if (loginUser) loginUser.style.border = "2px solid rgba(212, 175, 55, 0.5)";
                    loginInput.style.border = "2px solid rgba(212, 175, 55, 0.5)";
                }, 500);
            }
        }
    }

    // Only activate login logic if on desktop/active intro
    if (introPage && loginBtn) {
        document.body.classList.add('locked');

        loginBtn.addEventListener('click', checkLogin);

        // Enter key support
        loginInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkLogin();
        });

        if (loginUser) {
            loginUser.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loginInput.focus();
            });
        }
    }

    // --- Modal Logic with Swipe & Navigation ---
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalDate = document.getElementById('modal-date-text');
    const closeModal = document.querySelector('.modal-close-btn');
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');

    let currentSticker = null; // Track current flying sticker
    let currentGalleryIndex = 0; // Track current image index (0-based)

    function openModal(index) {
        currentGalleryIndex = index;
        updateModalContent();
        modal.style.display = "flex";
        document.body.style.overflow = 'hidden';
        spawnModalStickers();
    }

    function updateModalContent() {
        // Wrap index if out of bounds
        if (currentGalleryIndex < 0) currentGalleryIndex = TOTAL_IMAGES - 1;
        if (currentGalleryIndex >= TOTAL_IMAGES) currentGalleryIndex = 0;

        const imgNum = currentGalleryIndex + 1; // 1-based asset index
        modalImg.src = imagePath(imgNum);

        // Update Text
        const note = loveNotes[currentGalleryIndex] || "Just You & Me ❤️";
        const date = dates[currentGalleryIndex] || "Forever";

        modalCaption.innerHTML = `“${note}”`;
        if (modalDate) modalDate.innerText = date;
    }

    function changeImage(direction) {
        currentGalleryIndex += direction;

        // Add minimal fade effect for smoother transition
        modalImg.style.opacity = 0;
        setTimeout(() => {
            updateModalContent();
            modalImg.onload = () => {
                modalImg.style.opacity = 1;
            };
            // Fallback if cached
            if (modalImg.complete) modalImg.style.opacity = 1;
        }, 150);
    }

    function spawnModalStickers() {
        const modalContent = document.querySelector('.modal-content-wrapper');
        // Clear previous if any (though standard cleanup handles it)
        const old = document.querySelectorAll('.modal-floating-sticker');
        old.forEach(el => el.remove());

        for (let i = 0; i < 8; i++) {
            const s = document.createElement('img');
            const randomSticker = stickerNames[Math.floor(Math.random() * stickerNames.length)];
            s.src = `assets/${randomSticker}.png`;
            s.className = 'modal-floating-sticker';

            // Random start position within modal
            // Start near bottom or center
            s.style.left = Math.random() * 80 + 10 + '%';
            s.style.top = Math.random() * 80 + 10 + '%';

            // Random travel direction (tx, ty) and rotation
            const tx = (Math.random() - 0.5) * 200 + 'px';
            const ty = -100 - Math.random() * 200 + 'px'; // Move up mostly
            const rot = (Math.random() - 0.5) * 60 + 'deg';

            s.style.setProperty('--tx', tx);
            s.style.setProperty('--ty', ty);
            s.style.setProperty('--rot', rot);

            // Random duration between 2s and 5s
            s.style.animationDuration = Math.random() * 3 + 2 + 's';
            s.style.animationDelay = Math.random() * 0.5 + 's';

            modal.appendChild(s);
        }
    }

    function cleanupModalStickers() {
        const stickers = document.querySelectorAll('.modal-floating-sticker');
        stickers.forEach(el => el.remove());
    }

    if (closeModal) {
        closeModal.onclick = () => {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
            cleanupModalStickers();
            // Reset sticker
            if (currentSticker) {
                currentSticker.classList.remove('fly-effect');
                currentSticker = null;
            }
        };
    }

    // Button Listeners
    if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal close
        changeImage(-1);
    });

    if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent modal close
        changeImage(1);
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "flex") {
            if (e.key === "ArrowLeft") changeImage(-1);
            if (e.key === "ArrowRight") changeImage(1);
            if (e.key === "Escape") closeModal.click();
        }
    });

    // Swipe Navigation
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50; // Min distance
        if (touchEndX < touchStartX - threshold) {
            changeImage(1); // Swipe Left -> Next
        }
        if (touchEndX > touchStartX + threshold) {
            changeImage(-1); // Swipe Right -> Prev
        }
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
            cleanupModalStickers();
            if (currentSticker) {
                currentSticker.classList.remove('fly-effect');
                currentSticker = null;
            }
        }
    };

    // --- Simple Particle System (Canvas-free for simplicity & performance) ---
    // Using CSS for the main particles, but let's add some dynamic "confetti" on load
    const particlesContainer = document.getElementById('particles-js');
    const colors = ['#FFC0CB', '#FFD700', '#ADD8E6', '#98FB98'];

    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = Math.random() * 8 + 4 + 'px';
        p.style.height = p.style.width;
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.borderRadius = '50%';
        p.style.opacity = Math.random();
        p.style.pointerEvents = 'none';

        // Simple float animation
        const duration = Math.random() * 10 + 10;
        p.style.animation = `float ${duration}s infinite linear`;

        if (particlesContainer) particlesContainer.appendChild(p);
    }

    // --- Rail Track Connection Logic (Curved Winding Path) ---
    function drawTracks() {
        const svg = document.getElementById('gallery-svg');
        const items = document.querySelectorAll('.polaroid-item'); // The wrappers
        // We really want to connect the inner cards specifically
        const innerCards = document.querySelectorAll('.polaroid-wrapper-inner');

        if (!svg || innerCards.length < 2) return;

        // Clear previous
        svg.innerHTML = '';

        const containerRect = document.getElementById('gallery-container').getBoundingClientRect();

        let pathD = "";

        for (let i = 0; i < innerCards.length - 1; i++) {
            const current = innerCards[i].getBoundingClientRect();
            const next = innerCards[i + 1].getBoundingClientRect();

            // Centers relative to container
            const x1 = (current.left + current.width / 2) - containerRect.left;
            const y1 = (current.top + current.height / 2) - containerRect.top;
            const x2 = (next.left + next.width / 2) - containerRect.left;
            const y2 = (next.top + next.height / 2) - containerRect.top;

            // Move to start
            if (i === 0) {
                pathD += `M ${x1} ${y1} `;
            }

            // Grid Logic Connection
            // Determine relative position
            const dx = x2 - x1;
            const dy = y2 - y1;

            // Case 1: Same Row (approx) -> Horizontal connection
            // Case 2: Wrap to new row -> Long diagonal connection

            // To make it look "winding" and not just straight diagonals:
            // Use control points that dip or rise.
            // Let's use standard cubic Bezier with vertical emphasis to avoid sharp corners

            const tension = 0.5;
            const cp1x = x1 + dx * tension;
            const cp1y = y1 + dy * 0.1; // Mainly horizontal start? No.

            // Simple S-curve connecting two points:
            // C cp1, cp2, end
            // Let's assume flow is "Next Station".
            // If we just use (x1 + dx/2, y1) and (x2 - dx/2, y2) it works for horizontal.
            // For diagonal, it might look odd.

            // Generic Flow: Start horizontal/vertical mix
            // CP1: Pull towards half way
            const cp1_x = x1 + (dx / 2);
            const cp1_y = y1 + (Math.abs(dx) > 50 ? 0 : 50); // Angle down if vertical jump

            // Better Generic Curve:
            // Just use the vertical midpoint logic from before, it works surprisingly well for Z-grids.
            // CP1: (x1, y1 + dy/2)
            // CP2: (x2, y2 - dy/2)
            // This creates a vertical-first S-curve.
            // For horizontal neighbors (dy ~ 0), this is flat.
            // For vertical wrap (dy large, dx large negative), this creates a nice swoop down then left.

            const cpx1 = x1;
            const cpy1 = y1 + dy * 0.5;
            const cpx2 = x2;
            const cpy2 = y2 - dy * 0.5;

            pathD += `C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2} `;
        }

        // Layer 1: Sleepers (Sitar Frets - Gold/Brass)
        const sleepers = document.createElementNS("http://www.w3.org/2000/svg", "path");
        sleepers.setAttribute("d", pathD);
        sleepers.setAttribute("class", "track-path-sleepers");
        sleepers.setAttribute("fill", "none");
        sleepers.setAttribute("stroke", "#d4af37"); /* Gold */
        sleepers.setAttribute("stroke-width", "16");
        sleepers.setAttribute("stroke-dasharray", "4 12");
        svg.appendChild(sleepers);

        // Layer 2: Main Path (Sitar Strings - Silver)
        const railPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        railPath.setAttribute("id", "main-track-path"); // ID FOR TRAIN
        railPath.setAttribute("d", pathD);
        railPath.setAttribute("fill", "none");
        railPath.setAttribute("stroke", "#e0e0e0"); /* Silver String */
        railPath.setAttribute("stroke-width", "6");
        railPath.setAttribute("stroke-dasharray", "10 10");
        railPath.setAttribute("opacity", "0.9");
        svg.appendChild(railPath);

        initTrainAnimation();
    }

    // --- Train Animation ---
    let trainAnimFrame;
    let trainProgress = 0;
    let trainDirection = 1; // 1 = forward, -1 = backward
    const TRAIN_SPEED = 0.0005; // Adjust speed

    function initTrainAnimation() {
        // Ensure train element exists
        let train = document.getElementById('train-engine');
        if (!train) {
            train = document.createElement('div');
            train.id = 'train-engine';
            train.innerHTML = '<img src="assets/train.png" alt="Train">';
            document.getElementById('gallery-container').appendChild(train);
        }

        // Cancel old loop if any
        if (trainAnimFrame) cancelAnimationFrame(trainAnimFrame);
        animateTrain();
    }

    function animateTrain() {
        const path = document.getElementById('main-track-path');
        const train = document.getElementById('train-engine');
        const container = document.getElementById('gallery-container');

        if (!path || !train || !container) {
            trainAnimFrame = requestAnimationFrame(animateTrain);
            return;
        }

        const len = path.getTotalLength();
        if (len === 0) return;

        // Move progress
        trainProgress += trainDirection * TRAIN_SPEED * (6000 / len);

        // Bounce Logic
        if (trainProgress >= 1) {
            trainProgress = 1;
            trainDirection = -1; // Reverse
        } else if (trainProgress <= 0) {
            trainProgress = 0;
            trainDirection = 1; // Forward
        }

        // Get Point
        const point = path.getPointAtLength(trainProgress * len);

        // Get Rotation - Look ahead in direction of travel
        const lookAhead = 10 * trainDirection;
        const curDist = trainProgress * len;
        const nextDist = Math.max(0, Math.min(len, curDist + lookAhead));
        const nextPoint = path.getPointAtLength(nextDist);

        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;

        // Calculate shallow angle (slope) - prevent upside down
        let angle = Math.atan(dy / (Math.abs(dx) || 0.001)) * 180 / Math.PI;

        // Handle vertical/zero case
        if (isNaN(angle)) angle = 0;

        // Check direction
        const isMovingLeft = dx < 0;

        train.style.left = point.x + 'px';
        train.style.top = point.y + 'px';
        train.style.transform = `translate(-50%, -50%) scaleX(${isMovingLeft ? -1 : 1}) rotate(${angle}deg)`;

        // Smoke logic (random interval)
        if (Math.random() < 0.1) spawnSmoke(point.x, point.y);

        trainAnimFrame = requestAnimationFrame(animateTrain);
    }

    function spawnSmoke(x, y) {
        const container = document.getElementById('gallery-container');
        const puff = document.createElement('div');
        puff.className = 'smoke-puff';
        puff.style.left = x + 'px';
        puff.style.top = y + 'px';
        container.appendChild(puff);

        // Auto remove
        setTimeout(() => puff.remove(), 2000);
    }

    // Draw on load and resize
    window.addEventListener('load', drawTracks);
    window.addEventListener('resize', () => { setTimeout(drawTracks, 100); });
    // Check periodically
    setTimeout(drawTracks, 500);
    setTimeout(drawTracks, 2000);

    // Start Visual Effects
    setInterval(spawnPetals, 400);
});

// --- Falling Petals Logic ---
function spawnPetals() {
    const container = document.body;
    if (!container) return;

    const petal = document.createElement('div');

    // Randomize styles
    const styles = ['', 'style-2', 'style-3', 'style-3']; // More snow/dust frequency
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    petal.className = `petal ${randomStyle}`;

    // Randomize position and size
    const left = Math.random() * 100; // 0 to 100vw
    const size = Math.random() * 12 + 8; // 8px to 20px
    const duration = Math.random() * 5 + 5; // 5s to 10s
    const swayDuration = Math.random() * 2 + 2; // 2s to 4s

    petal.style.left = `${left}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;

    // Combine animations
    petal.style.animation = `fall ${duration}s linear infinite, sway ${swayDuration}s ease-in-out infinite`;

    container.appendChild(petal);

    // Cleanup
    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}
