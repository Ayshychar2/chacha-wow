document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Drawer Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeDrawerBtn = document.getElementById('close-drawer');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (hamburgerBtn && mobileDrawer) {
        hamburgerBtn.addEventListener('click', () => {
            mobileDrawer.classList.remove('translate-x-full');
        });
    }

    if (closeDrawerBtn && mobileDrawer) {
        closeDrawerBtn.addEventListener('click', () => {
            mobileDrawer.classList.add('translate-x-full');
        });
    }

    // Close drawer when clicking any link inside
    if (mobileDrawer) {
        const drawerLinks = mobileDrawer.querySelectorAll('a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.add('translate-x-full');
            });
        });
    }

    // 2. Testimonial Slider (index.html)
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevTestiBtn = document.getElementById('prev-testi');
    const nextTestiBtn = document.getElementById('next-testi');
    let currentSlide = 0;

    function showSlide(index) {
        if (testimonialSlides.length === 0) return;
        
        testimonialSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('hidden', 'opacity-0', 'absolute', 'top-0', 'left-0');
                slide.classList.add('opacity-100');
            } else {
                slide.classList.add('hidden', 'opacity-0', 'absolute', 'top-0', 'left-0');
                slide.classList.remove('opacity-100');
            }
        });
    }

    if (prevTestiBtn && nextTestiBtn && testimonialSlides.length > 0) {
        showSlide(currentSlide);

        prevTestiBtn.addEventListener('click', () => {
            currentSlide = (currentSlide === 0) ? testimonialSlides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        });

        nextTestiBtn.addEventListener('click', () => {
            currentSlide = (currentSlide === testimonialSlides.length - 1) ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        });
    }

    // 3. Gallery Filtering (works.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    if (filterButtons.length > 0 && masonryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active styling from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('border-electric-neon', 'text-electric-neon');
                    btn.classList.add('border-muted-silver/40', 'text-muted-silver');
                });
                
                // Add active styling to clicked button
                button.classList.add('border-electric-neon', 'text-electric-neon');
                button.classList.remove('border-muted-silver/40', 'text-muted-silver');

                const filterValue = button.getAttribute('data-filter');

                masonryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Parse initial filter parameter from URL (e.g. ?filter=shopify)
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if (targetBtn) {
                // Let DOM settle slightly to guarantee transitions trigger cleanly
                setTimeout(() => {
                    targetBtn.click();
                }, 100);
            }
        }
    }

    // 4. Contact Form Submission Feedback (index.html)
    const contactForm = document.getElementById('contact-form');
    const formToast = document.getElementById('form-toast');

    if (contactForm && formToast) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show toast notification
            formToast.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                formToast.classList.remove('show');
            }, 3000);
        });
    }

    // 5. Entrance scroll animations (Simple Fade In Up)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const entryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Dynamic classes injector for smooth scroll reveals
    const animatedElements = document.querySelectorAll('section, .glass-panel, .masonry-item');
    
    // Add transition style inline for animation simplicity
    animatedElements.forEach(el => {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        
        scrollObserver.observe(el);
    });

    // 6. Before/After Slider Interaction (social-ads.html)
    const sliderContainer = document.getElementById('before-after-slider');
    const sliderAfterContainer = document.getElementById('slider-after-container');
    const sliderHandle = document.getElementById('slider-handle');
    const sliderAfterImg = document.getElementById('slider-after-img');

    if (sliderContainer && sliderAfterContainer && sliderHandle && sliderAfterImg) {
        // Handle image resizing on slider resize
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                sliderAfterImg.style.width = entry.contentRect.width + 'px';
            }
        });
        resizeObserver.observe(sliderContainer);

        let isSliding = false;

        function updateSlider(xPos) {
            const rect = sliderContainer.getBoundingClientRect();
            let x = xPos - rect.left;
            
            // Constrain between 0 and width
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;
            
            const percentage = (x / rect.width) * 100;
            sliderAfterContainer.style.width = percentage + '%';
            sliderHandle.style.left = percentage + '%';
        }

        // Mouse Events
        sliderContainer.addEventListener('mousedown', (e) => {
            isSliding = true;
            updateSlider(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isSliding = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            updateSlider(e.clientX);
        });

        // Touch Events
        sliderContainer.addEventListener('touchstart', (e) => {
            isSliding = true;
            if (e.touches.length > 0) {
                updateSlider(e.touches[0].clientX);
            }
        });

        window.addEventListener('touchend', () => {
            isSliding = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            if (e.touches.length > 0) {
                updateSlider(e.touches[0].clientX);
            }
        });
    }

    // 7. Dynamic Live Screenshot Loader (using WordPress mshots API)
    const lazyImages = document.querySelectorAll('img[data-live-src]');
    
    if (lazyImages.length > 0) {
        const loadScreenshot = (img) => {
            const url = img.getAttribute('data-live-src');
            const mshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;
            
            // Apply inline transition to guarantee smooth fade-in and hover effects
            img.style.transition = 'opacity 0.6s ease-in-out, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
            img.src = mshotUrl;
            
            img.onload = () => {
                img.classList.remove('opacity-0');
                img.classList.add('opacity-100');
                const loader = img.previousElementSibling;
                if (loader && loader.classList.contains('load-status')) {
                    loader.remove();
                }
            };
            
            img.onerror = () => {
                const loader = img.previousElementSibling;
                if (loader && loader.classList.contains('load-status')) {
                    loader.textContent = "Live Preview Unavailable";
                    loader.classList.remove('animate-pulse');
                    loader.classList.add('text-red-500/80');
                }
            };
        };

        if ('IntersectionObserver' in window) {
            const imgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadScreenshot(img);
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '0px 0px 300px 0px', threshold: 0.05 });

            lazyImages.forEach(img => {
                imgObserver.observe(img);
            });
        } else {
            lazyImages.forEach(img => {
                loadScreenshot(img);
            });
        }
    }

});
