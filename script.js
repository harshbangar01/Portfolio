// Portfolio Application JavaScript
class PortfolioApp {
    constructor() {
        this.isLoading = true;
        this.isDarkTheme = true;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.loadData();
        this.setupScrollAnimations();
        this.setupTheme();
        this.hideLoader();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('theme-toggle-mobile').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    this.closeMobileMenu();
                }
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Contact form
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            this.handleContactForm(e);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    initializeComponents() {
        this.initThreeJS();
        this.initParticles();
        this.initTypedText();
        this.initGSAP();
    }

    initThreeJS() {
        const container = document.getElementById('three-scene');
        if (!container) return;

        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // Create floating geometry
        this.createFloatingGeometry();

        // Position camera
        this.camera.position.z = 5;

        // Start animation loop
        this.animate();
    }

    createFloatingGeometry() {
        const geometries = [
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.ConeGeometry(0.3, 0.6, 8),
            new THREE.OctahedronGeometry(0.4),
            new THREE.TetrahedronGeometry(0.4)
        ];

        const materials = [
            new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true }),
            new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true }),
            new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true }),
            new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true }),
            new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true })
        ];

        this.floatingObjects = [];

        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            // Random position
            mesh.position.x = (Math.random() - 0.5) * 10;
            mesh.position.y = (Math.random() - 0.5) * 10;
            mesh.position.z = (Math.random() - 0.5) * 5;

            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            // Random scale
            const scale = Math.random() * 0.5 + 0.5;
            mesh.scale.set(scale, scale, scale);

            this.scene.add(mesh);
            this.floatingObjects.push({
                mesh: mesh,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.5 + 0.5,
                initialY: mesh.position.y
            });
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Animate floating objects
        const time = Date.now() * 0.001;
        this.floatingObjects.forEach(obj => {
            obj.mesh.rotation.x += obj.rotationSpeed.x;
            obj.mesh.rotation.y += obj.rotationSpeed.y;
            obj.mesh.rotation.z += obj.rotationSpeed.z;
            
            obj.mesh.position.y = obj.initialY + Math.sin(time * obj.floatSpeed) * 0.5;
        });

        this.renderer.render(this.scene, this.camera);
    }

    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#06b6d4'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        animation: {
                            enable: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        animation: {
                            enable: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#06b6d4',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    initTypedText() {
        if (typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: [
                    'Full Stack Developer',
                    'React Specialist',
                    'UI/UX Designer',
                    'Problem Solver',
                    'Alex Chen'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                startDelay: 500,
                loop: false,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    initGSAP() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero section animations
            gsap.from('.hero-content > *', {
                duration: 1,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out'
            });

            // Section animations
            gsap.utils.toArray('section').forEach((section, index) => {
                gsap.from(section.querySelectorAll('h2, p, .fade-in'), {
                    duration: 1,
                    y: 50,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            // Skill bars animation
            gsap.utils.toArray('.skill-progress').forEach(bar => {
                gsap.from(bar, {
                    duration: 1.5,
                    width: 0,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            // Service cards stagger animation
            gsap.from('.service-card', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.service-card',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate skill bars
                    if (entry.target.classList.contains('skill-progress')) {
                        entry.target.style.transform = 'translateX(0)';
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .skill-progress').forEach(el => {
            observer.observe(el);
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollTop / scrollHeight;

        // Update progress bar
        document.getElementById('progress-bar').style.width = `${scrollProgress * 100}%`;

        // Update navbar
        const navbar = document.getElementById('navbar');
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Parallax effect for hero section
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrollTop * 0.5}px)`;
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('show');
            toggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
            toggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('show');
        toggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        const body = document.body;
        const themeButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
        
        if (this.isDarkTheme) {
            body.classList.remove('light-theme');
            themeButtons.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-sun text-yellow-400"></i>';
            });
        } else {
            body.classList.add('light-theme');
            themeButtons.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-moon text-blue-400"></i>';
            });
        }
        
        // Save theme preference
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
            if (!this.isDarkTheme) {
                this.toggleTheme();
            }
        }
    }

    async loadData() {
        try {
            await Promise.all([
                this.loadProjects(),
                this.loadBlogPosts()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error loading data. Please refresh the page.', 'error');
        }
    }

    async loadProjects() {
        const projectsData = [
            {
                id: 1,
                title: 'Collage Management Platform',
                description: 'A full-stack collage management solution with React, Node.js, and MongoDB',
                image: 'https://cdn.prod.website-files.com/65fabbf8f7f7323a634a308c/66c478f331c8f9c5995f02ba_Group%201171275868.png',
                technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
                liveUrl: 'https://harshbangar01.github.io/collegeMG/',
                githubUrl: 'https://github.com/harshbangar01/collegeMG',
                category: 'web'
            },
            {
                id: 2,
                title: ' UrbanMoon Studio',
                description: 'Urban Moon is a multi-disciplinary studio focused on creating unique, end-to-end experiences and environments.',
                image: 'https://media.istockphoto.com/id/1280169428/video/the-silhouette-of-a-wolf-standing-on-a-cliff-edge-howling-at-a-blood-red-moon.jpg?s=640x640&k=20&c=3roQiw4rL_heSGYlioU3abMnSzZr2n_KFUPSlxTk1SY=',
                technologies: ['React', 'Socket.io', 'Express', 'MongoDB'],
                liveUrl: 'https://harshbangar01.github.io/Urban-Moon-Studio/',
                githubUrl: 'https://github.com/harshbangar01/Urban-Moon-Studio',
                category: 'web'
            },
            {
                id: 3,
                title: 'Calculator ',
                description: 'A responsive calculator application with real-time updates',
                image: 'https://thumbs.dreamstime.com/b/cartoon-calculator-pen-note-smiling-electronic-character-paper-calculations-hands-education-finance-design-58070835.jpg',
                technologies: ['React', ' Vite', 'Stripe', 'Tailwind'],
                liveUrl: 'https://harshbangar01.github.io/calculator/',
                githubUrl: 'https://github.com/harshbangar01/calculator',
                category: 'App'
            },
            {
                id: 4,
                title: 'Scroll Base Web',
                description: 'A 3D model scroll base Website',
                image: 'https://img.freepik.com/premium-psd/3d-illustration-man-character-open-both-hand-wide-running_537883-193.jpg',
                technologies: ['React', 'Three.js', ' Gsap', 'Redux'],
                liveUrl: 'https://harshbangar01.github.io/3D-model/',
                githubUrl: 'https://github.com/harshbangar01/3D-model',
                category: 'Web'
            },
            {
                id: 5,
                title: 'AI Chat Assistant',
                description: 'An intelligent chatbot with natural language processing capabilities',
                image: 'https://cdn.analyticsvidhya.com/wp-content/uploads/2023/12/final_keyword_header.width-1600.format-webp.webp',
                technologies: ['React', 'TailwindCSS', 'OpenAI API'],
                liveUrl: 'https://harshbangar01.github.io/Gemini/',
                githubUrl: 'https://github.com/harshbangar01/Gemini',
                category: 'Ai'
            },
            {
                id: 6,
                title: 'Chess Game',
                description: 'A real time multiplayer chess game with online matchmaking',
                image: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/PedroPinhata/phpxsIApe.png',
                technologies: ['Ejs', 'Socket.io', 'Express', 'Node.js'],
                liveUrl: 'https://harshbangar01.github.io/Portfolio/',
                githubUrl: 'https://github.com/harshbangar01/Chess.io',
                category: 'Game'
            }
        ];

        this.renderProjects(projectsData);
    }

    async loadBlogPosts() {
        const blogData = [
            {
                id: 1,
                title: 'Modern Web Development Best Practices',
                excerpt: 'Explore the latest trends and best practices in web development for 2024',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
                publishedAt: '2024-06-15',
                readTime: '5 min read',
                tags: ['Web Development', 'JavaScript', 'React']
            },
            {
                id: 2,
                title: 'Building Scalable APIs with Node.js',
                excerpt: 'Learn how to design and build APIs that can handle millions of requests',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
                publishedAt: '2025-02-21',
                readTime: '8 min read',
                tags: ['Node.js', 'API', 'Backend']
            },
            {
                id: 3,
                title: 'The Future of Frontend Development',
                excerpt: 'Discover emerging technologies and frameworks shaping the future of frontend',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
                publishedAt: '2025-04-05',
                readTime: '6 min read',
                tags: ['Frontend', 'React', 'Vue', 'Angular']
            }
        ];

        this.renderBlogPosts(blogData);
    }

    renderProjects(projects) {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card glass-effect rounded-xl overflow-hidden fade-in">
                <div class="relative">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
                    <div class="project-overlay">
                        <div class="flex space-x-4">
                            <a href="${project.liveUrl}" target="_blank" class="bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors duration-300">
                                <i class="fas fa-external-link-alt mr-2"></i>Live Demo
                            </a>
                            <a href="${project.githubUrl}" target="_blank" class="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300">
                                <i class="fab fa-github mr-2"></i>Code
                            </a>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
                    <p class="text-gray-300 mb-4 text-sm">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.technologies.map(tech => `
                            <span class="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-xs">${tech}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderBlogPosts(posts) {
        const blogPosts = document.getElementById('blog-posts');
        if (!blogPosts) return;

        blogPosts.innerHTML = posts.map(post => `
            <div class="blog-card glass-effect rounded-xl overflow-hidden fade-in">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex items-center text-sm text-gray-400 mb-3">
                        <span>${this.formatDate(post.publishedAt)}</span>
                        <span class="mx-2">•</span>
                        <span>${post.readTime}</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">${post.title}</h3>
                    <p class="text-gray-300 mb-4 text-sm">${post.excerpt}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${post.tags.map(tag => `
                            <span class="px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">${tag}</span>
                        `).join('')}
                    </div>
                    <a href="#" class="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium">
                        Read More <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            e.target.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Error sending message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    handleResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    this.isLoading = false;
                }, 500);
            }
        }, 2000);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Clean up event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        if (window.portfolioApp && window.portfolioApp.animationId) {
            cancelAnimationFrame(window.portfolioApp.animationId);
        }
    } else {
        // Resume animations when page becomes visible
        if (window.portfolioApp && window.portfolioApp.animate) {
            window.portfolioApp.animate();
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Utility functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    roundTo(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }
};

// Export for use in other modules
window.Utils = Utils;
