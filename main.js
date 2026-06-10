/* ==========================================================================
   HIGH-ENERGY CASUAL DINING SCRIPT - CHACHA WOW (BBQ NATION INSPIRED)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. CUSTOM CURSOR FOLLOWER */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly position the center dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smoothly interpolate the follower ring
        function animateFollower() {
            const ease = 0.15; // Smoothness factor
            followerX += (mouseX - followerX) * ease;
            followerY += (mouseY - followerY) * ease;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Cursor scaling reactions on interactive hover elements
        const hoverElements = document.querySelectorAll('a, button, select, input, textarea, .signature-card, .gallery-item, .menu-item-row');
        hoverElements.forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.backgroundColor = '#1a1a1a';
                follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                follower.style.borderColor = '#ff6200';
            });
            elem.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = '#ff6200';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.borderColor = '#ff6200';
            });
        });
    }

    /* 2. STICKY HEADER SCROLL */
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 3. MOBILE NAVIGATION DRAWER */
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-nav-item');

    function toggleMenu() {
        navToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('open');
        document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* 4. SCROLL TRIGGERS & PARALLAX EFFECT */
    // Trigger animations when entering viewport
    const triggerElements = document.querySelectorAll('.scroll-trigger');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    triggerElements.forEach(el => scrollObserver.observe(el));



    /* 6. MENU PREVIEW CATEGORY TABS */
    const menuTabButtons = document.querySelectorAll('.menu-nav-btn');
    const menuPanes = document.querySelectorAll('.menu-category-pane');

    menuTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-menu-category');

            // Switch active tab styling
            menuTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show selected category pane
            menuPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `menu-${category}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    /* 7. CUSTOM TESTIMONIAL SLIDER */
    const sliderTrack = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentSlide = 0;
    let autoplayTimer = null;
    const slideCount = slides.length;

    function updateSlider(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        currentSlide = index;
        sliderTrack.style.transform = `translateX(-${currentSlide * (100 / slideCount)}%)`;

        // Update active dot
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            updateSlider(currentSlide + 1);
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            updateSlider(currentSlide - 1);
            startAutoplay(); // Reset autoplay timer
        });

        nextBtn.addEventListener('click', () => {
            updateSlider(currentSlide + 1);
            startAutoplay(); // Reset autoplay timer
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'));
            updateSlider(idx);
            startAutoplay();
        });
    });

    // Mobile/Tablet swipe support inside Testimonial Slider
    let startX = 0;
    let endX = 0;
    const sliderContainer = document.querySelector('.testimonial-slider-container');

    if (sliderContainer) {
        sliderContainer.addEventListener('pointerdown', (e) => {
            startX = e.clientX;
            stopAutoplay();
        });

        sliderContainer.addEventListener('pointerup', (e) => {
            endX = e.clientX;
            const threshold = 50; // swipe minimum distance
            if (startX - endX > threshold) {
                updateSlider(currentSlide + 1);
            } else if (endX - startX > threshold) {
                updateSlider(currentSlide - 1);
            }
            startAutoplay();
        });
    }

    startAutoplay();

    /* 8. LEAFLET MAP CUSTOM DARK INTEGRATION */
    const mapElement = document.getElementById('leaflet-map');
    if (mapElement) {
        // Coordinate location centered at Shop No 746, Model Town, Ludhiana, Punjab
        const lat = 30.8986;
        const lng = 75.8361;

        // Initialize leaflet map object
        const map = L.map('leaflet-map', {
            center: [lat, lng],
            zoom: 15,
            scrollWheelZoom: false // Prevent scroll interference when scrolling the page
        });

        // Add Leaflet luxury dark tile layout provider (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Define premium custom Orange SVG Pin Marker (BBQ Nation Theme)
        const orangeIcon = L.divIcon({
            html: `
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#ff6200" stroke="#0f0f0f" stroke-width="1.5"/>
                    <circle cx="12" cy="9" r="2.2" fill="#ffffff"/>
                </svg>
            `,
            className: 'custom-map-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });

        // Place custom gold marker on coordinates
        const marker = L.marker([lat, lng], { icon: orangeIcon }).addTo(map);

        // Custom stylized Leaflet popup bubble (Styled in clean white/orange)
        marker.bindPopup(`
            <div style="background-color:#ffffff; color:#1a1a1a; padding:1.2rem; font-family:'Inter', sans-serif; border: 1.5px solid #ff6200; border-radius:8px; box-shadow:0 10px 20px rgba(0,0,0,0.05);">
                <h4 style="font-family:'Poppins', sans-serif; font-size:1.8rem; margin-bottom:0.5rem; color:#ff6200; font-weight:700;">CHACHA WOW</h4>
                <p style="font-size:1.2rem; margin:0; line-height:1.4; color:#666666; font-weight:400;">Shop 746, Model Town<br>Ludhiana, Punjab</p>
                <a href="https://maps.google.com/?q=Chacha+Wow+Fast+Food+Model+Town+Ludhiana" target="_blank" style="display:inline-block; font-size:1.1rem; color:#ff6200; margin-top:0.8rem; font-weight:600; text-decoration:underline;">Get Directions</a>
            </div>
        `);
    }
});
