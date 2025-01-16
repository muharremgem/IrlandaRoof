document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menü Fonksiyonları
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const closeMenu = document.querySelector('.close-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const dropdowns = document.querySelectorAll('.has-dropdown');

    // Menüyü açma/kapama fonksiyonu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    }

    // Hamburger menü tıklama
    hamburger.addEventListener('click', toggleMenu);

    // Çarpı işareti tıklama
    closeMenu.addEventListener('click', toggleMenu);

    // Overlay tıklama
    menuOverlay.addEventListener('click', toggleMenu);

    // Mobilde dropdown menüler için
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Sayfa yüklendiğinde ve resize olduğunda kontrol
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                console.log('Form submitted successfully');
                form.reset();
            }
        });
    });

    // Testimonials Slider
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let autoSlideInterval;

    // Otomatik kaydırma fonksiyonu
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 5000); // Her 5 saniyede bir kaydir
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Slider'ı güncelle
    function updateSlider() {
        slider.scrollTo({
            left: slides[currentSlide].offsetLeft,
            behavior: 'smooth'
        });
        updateDots();
    }

    // Dots'ları güncelle
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = index;
            updateSlider();
            startAutoSlide();
        });
    });

    // Touch events için
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        touchStartX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        startAutoSlide();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Sola kaydırma
                currentSlide = (currentSlide + 1) % slides.length;
            } else {
                // Sağa kaydırma
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            }
            updateSlider();
        }
    }

    // Scroll event için
    let isScrolling;
    slider.addEventListener('scroll', () => {
        stopAutoSlide();
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            // En yakın slide'ı bul
            const scrollLeft = slider.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            currentSlide = Math.round(scrollLeft / slideWidth);
            updateDots();
            startAutoSlide();
        }, 150);
    });

    // Başlangıçta otomatik kaydırmayı başlat
    startAutoSlide();
}); 