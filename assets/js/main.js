// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initSmoothScrolling();
    initAnimations();
    initContactForm();
    initGallery();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        // Active navigation highlighting
        highlightActiveSection();
    });
    
    function highlightActiveSection() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations and intersection observer
function initAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .contact-item, .value, .mission, .vision'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // Add CSS for animations
    addAnimationStyles();
}

// Add animation styles dynamically
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav-link.active {
            color: var(--primary-color);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        body.nav-open {
            overflow: hidden;
        }
        
        @media (max-width: 768px) {
            body.nav-open .nav-menu {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
        }
    `;
    document.head.appendChild(style);
}

// Contact form functionality (if needed in the future)
function initContactForm() {
    // WhatsApp link tracking
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track WhatsApp clicks (for analytics if needed)
            console.log('WhatsApp link clicked:', this.href);
        });
    });
    
    // Email link tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track email clicks (for analytics if needed)
            console.log('Email link clicked:', this.href);
        });
    });
}

// Gallery functionality
function initGallery() {
    // CONFIGURACIÓN PRINCIPAL
    const TOTAL_IMAGES = 18; // Número total de imágenes en la carpeta galeria
    const AUTO_ADVANCE_INTERVAL = 4000; // Tiempo para avance automático (4 segundos)
    
    // Elementos DOM principales
    const galleryContainer = document.querySelector('.gallery-container');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.modal-close');
    const prevModalBtn = document.querySelector('.modal-prev');
    const nextModalBtn = document.querySelector('.modal-next');
    const prevCarouselBtn = document.querySelector('.gallery-prev');
    const nextCarouselBtn = document.querySelector('.gallery-next');
    const indicators = document.querySelector('.gallery-indicators');
    
    // Verificar si los elementos existen
    if (!galleryContainer) return;
    
    // Variables de estado
    let currentCarouselIndex = 0;
    let currentModalIndex = 0;
    let imagesPerView = getImagesPerView();
    let totalSlides = Math.ceil(TOTAL_IMAGES / imagesPerView);
    let autoAdvanceTimer = null;
    let isUserInteracting = false;
    
    /**
     * Determina cuántas imágenes mostrar según el tamaño de pantalla
     */
    function getImagesPerView() {
        const width = window.innerWidth;
        if (width >= 768) {
            return 4; // PC/Desktop - mostrar 4 imágenes
        } else {
            return 2; // Mobile - mostrar 2 imágenes
        }
    }

    /**
     * Genera dinámicamente las imágenes para el slide actual
     */
    function generateGalleryImages() {
        galleryContainer.innerHTML = '';
        
        const startIndex = currentCarouselIndex * imagesPerView;
        const endIndex = Math.min(startIndex + imagesPerView, TOTAL_IMAGES);
        
        for (let i = startIndex; i < endIndex; i++) {
            const imageNumber = i + 1;
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="assets/img/galeria/${imageNumber}.jpg" alt="Proyecto veterinario ${imageNumber}" loading="lazy">
                <div class="gallery-overlay">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </div>
            `;
            
            galleryItem.addEventListener('click', () => {
                openModal(i);
            });
            
            galleryContainer.appendChild(galleryItem);
        }
    }
    
    /**
     * Genera los indicadores del carrusel
     */
    function generateIndicators() {
        if (!indicators) return;
        
        indicators.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('span');
            indicator.className = 'gallery-indicator';
            if (i === 0) indicator.classList.add('active');
            indicators.appendChild(indicator);
        }
        attachIndicatorListeners();
    }

    /**
     * Actualiza la vista del carrusel
     */
    function updateCarousel() {
        generateGalleryImages();
        
        const allIndicators = document.querySelectorAll('.gallery-indicator');
        allIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentCarouselIndex);
        });
    }
    
    /**
     * Navega a un slide específico
     */
    function goToSlide(index) {
        currentCarouselIndex = index;
        updateCarousel();
    }
    
    /**
     * Inicia el avance automático del carrusel
     */
    function startAutoAdvance() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
        }
        autoAdvanceTimer = setInterval(() => {
            if (!isUserInteracting && totalSlides > 1) {
                nextSlide();
            }
        }, AUTO_ADVANCE_INTERVAL);
    }
    
    /**
     * Detiene el avance automático
     */
    function stopAutoAdvance() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    }
    
    /**
     * Reinicia el avance automático después de interacción
     */
    function resetAutoAdvance() {
        stopAutoAdvance();
        setTimeout(() => {
            if (!isUserInteracting) {
                startAutoAdvance();
            }
        }, 1000);
    }
    
    /**
     * Avanza al siguiente slide
     */
    function nextSlide() {
        currentCarouselIndex = (currentCarouselIndex + 1) % totalSlides;
        updateCarousel();
    }
    
    /**
     * Retrocede al slide anterior
     */
    function prevSlide() {
        currentCarouselIndex = (currentCarouselIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    /**
     * Abre el modal con una imagen específica
     */
    function openModal(imageIndex) {
        if (!modal || !modalImg) return;
        
        currentModalIndex = imageIndex;
        modalImg.src = `assets/img/galeria/${imageIndex + 1}.jpg`;
        modalImg.alt = `Proyecto veterinario ${imageIndex + 1}`;
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Cierra el modal
     */
    function closeModalFunc() {
        if (!modal) return;
        
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    /**
     * Navega a la siguiente imagen en el modal
     */
    function nextModalImage() {
        if (!modalImg) return;
        
        currentModalIndex = (currentModalIndex + 1) % TOTAL_IMAGES;
        modalImg.src = `assets/img/galeria/${currentModalIndex + 1}.jpg`;
        modalImg.alt = `Proyecto veterinario ${currentModalIndex + 1}`;
    }
    
    /**
     * Navega a la imagen anterior en el modal
     */
    function prevModalImage() {
        if (!modalImg) return;
        
        currentModalIndex = (currentModalIndex - 1 + TOTAL_IMAGES) % TOTAL_IMAGES;
        modalImg.src = `assets/img/galeria/${currentModalIndex + 1}.jpg`;
        modalImg.alt = `Proyecto veterinario ${currentModalIndex + 1}`;
    }
    
    // EVENT LISTENERS DEL CARRUSEL
    if (nextCarouselBtn) {
        nextCarouselBtn.addEventListener('click', () => {
            isUserInteracting = true;
            nextSlide();
            resetAutoAdvance();
            setTimeout(() => { isUserInteracting = false; }, 500);
        });
    }
    
    if (prevCarouselBtn) {
        prevCarouselBtn.addEventListener('click', () => {
            isUserInteracting = true;
            prevSlide();
            resetAutoAdvance();
            setTimeout(() => { isUserInteracting = false; }, 500);
        });
    }
    
    /**
     * Asigna eventos a los indicadores
     */
    function attachIndicatorListeners() {
        const allIndicators = document.querySelectorAll('.gallery-indicator');
        allIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                isUserInteracting = true;
                goToSlide(index);
                resetAutoAdvance();
                setTimeout(() => { isUserInteracting = false; }, 500);
            });
        });
    }

    // EVENT LISTENERS DEL MODAL
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }
    
    if (nextModalBtn) {
        nextModalBtn.addEventListener('click', nextModalImage);
    }
    
    if (prevModalBtn) {
        prevModalBtn.addEventListener('click', prevModalImage);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalFunc();
            }
        });
    }
    
    // NAVEGACIÓN CON TECLADO
    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeModalFunc();
            } else if (e.key === 'ArrowRight') {
                nextModalImage();
            } else if (e.key === 'ArrowLeft') {
                prevModalImage();
            }
        }
    });
    
    // MANEJO DE CAMBIOS DE TAMAÑO DE VENTANA
    function handleResize() {
        const newImagesPerView = getImagesPerView();
        if (newImagesPerView !== imagesPerView) {
            imagesPerView = newImagesPerView;
            totalSlides = Math.ceil(TOTAL_IMAGES / imagesPerView);
            if (currentCarouselIndex >= totalSlides) {
                currentCarouselIndex = totalSlides - 1;
            }
            generateIndicators();
            updateCarousel();
        }
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // CONTROL DE AUTO-AVANCE EN HOVER
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => {
            isUserInteracting = true;
            stopAutoAdvance();
        });
        
        galleryContainer.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            startAutoAdvance();
        });
    }
    
    // INICIALIZACIÓN
    generateIndicators();
    updateCarousel();
    
    if (totalSlides > 1) {
        startAutoAdvance();
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
function initPerformanceOptimizations() {
    // Lazy loading for images (if any are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Resize handler
window.addEventListener('resize', debounce(function() {
    // Handle any resize-specific functionality
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
}, 250));

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker can be added here for offline functionality
    });
}

// Accessibility improvements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    initAccessibility();
    initPerformanceOptimizations();
});

// Export functions for potential external use
window.MiguelFuentesWebsite = {
    initNavigation,
    initScrollEffects,
    initSmoothScrolling,
    initAnimations
};