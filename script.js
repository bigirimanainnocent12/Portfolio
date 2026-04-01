document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Background Animation (Canvas)
    const canvas = document.createElement('canvas');
    canvas.id = 'data-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 60;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.update();
            p.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 150)})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    initParticles();
    animate();

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal Animation & ScrollSpy
    const revealElements = document.querySelectorAll('.reveal, .reveal-right');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleScroll = () => {
        const scrollPosition = window.scrollY + 100;

        // Scroll Progress logic
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scroll-progress").style.width = scrolled + "%";

        // Back to Top button visibility
        const backToTop = document.getElementById('back-to-top');
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Reveal Animation logic
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });

        // ScrollSpy logic
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    // 4. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // 5. Smooth Scroll & Close Mobile Menu
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (menuToggle) {
                menuToggle.classList.remove('is-active');
                navLinksContainer.classList.remove('active');
                document.body.classList.remove('menu-open');
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 6. Magnetic Button & Glow Interaction
    const heroBtn = document.querySelector('.hero-btns .btn-primary');
    if (heroBtn) {
        heroBtn.addEventListener('mousemove', (e) => {
            const rect = heroBtn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update button "shine" position
            heroBtn.style.setProperty('--x', `${x}px`);
            heroBtn.style.setProperty('--y', `${y}px`);

            // Subtle magnetic pull
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) * 0.2;
            const moveY = (y - centerY) * 0.2;

            heroBtn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });

        heroBtn.addEventListener('mouseleave', () => {
            heroBtn.style.transform = '';
        });
    }

    // 5. Form Handling (Interactive Feedback)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Initialisation du transfert...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerText = 'Données transmises !';
                btn.style.background = '#22c55e';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }
});
