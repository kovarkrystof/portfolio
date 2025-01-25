document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    const scrollUpBtn = document.getElementById("scrollUpBtn");
    const icon = document.getElementById("icon");
    const themeToggleBtn = document.getElementById("themeToggle");
    const nextSectionBtn = document.getElementById("nextSection");
    const progressBar = document.getElementById("progressBar");

    const toggleNav = () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        document.body.classList.toggle('no-scroll');
    };

    if (burger) {
        burger.addEventListener('click', toggleNav);
    }

    for (const link of navLinks) {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            document.body.classList.remove('no-scroll');
        });
    }

    const updateProgressBar = () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`;
        }
    };

    window.addEventListener('scroll', updateProgressBar);

    if (scrollUpBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollUpBtn.style.display = "block";
            } else {
                scrollUpBtn.style.display = "none";
            }
        });

        scrollUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const setDarkMode = (isDark) => {
        if (isDark) {
            document.body.classList.add("dark-mode");
            if (icon) icon.src = "assets/icons/sun.png";
        } else {
            document.body.classList.remove("dark-mode");
            if (icon) icon.src = "assets/icons/moon.png";
        }
    };

    const darkMode = localStorage.getItem("dark-mode") === "true";
    setDarkMode(darkMode);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle("dark-mode");
            localStorage.setItem("dark-mode", isDarkMode);
            icon.src = isDarkMode ? "assets/icons/sun.png" : "assets/icons/moon.png";
        });
    }

    if (nextSectionBtn) {
        nextSectionBtn.addEventListener("click", () => {
            document.getElementById("about").scrollIntoView({ behavior: "smooth" });
        });
    }

    // --- Přidání animací pro běžné prvky ---
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .zoom-in');

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.1 });

    for (const element of animatedElements) {
        observer.observe(element);
    }

    // --- Přidání animací pro časovou osu (timeline) ---
    const timelineItems = document.querySelectorAll('.timeline-item');

    const timelineObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const content = entry.target.querySelector('.content');
                const index = Array.from(timelineItems).indexOf(entry.target);
                if (content) {
                    // Nastavení zpoždění animace podle indexu prvku
                    content.style.transitionDelay = `${index * 0.3}s`;
                    content.classList.add('visible');
                }
                timelineObserver.unobserve(entry.target);
            }
        }
    }, { threshold: 0.1 });

    for (const item of timelineItems) {
        timelineObserver.observe(item);
    }

    // --- Animace benefitů ---
    const benefits = document.querySelectorAll('.benefit');
    benefits.forEach((benefit, index) => {
        setTimeout(() => {
            benefit.classList.add('visible');
        }, index * 200); // Zpoždění pro každý benefit
    });

    // --- Interaktivní FAQ ---
    // biome-ignore lint/complexity/noForEach: <explanation>
        document.querySelectorAll('.faq-question').forEach(item => {
        item.addEventListener('click', () => {
            const faqItem = item.parentElement;
            faqItem.classList.toggle('active');
            const answer = faqItem.querySelector('.faq-answer');
            if (faqItem.classList.contains('active')) {
                answer.style.display = 'block';
                setTimeout(() => {
                    answer.style.opacity = '1';
                    answer.style.transform = 'translateY(0)';
                }, 10); // Zpoždění pro animaci
            } else {
                answer.style.opacity = '0';
                answer.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    answer.style.display = 'none';
                }, 300); // Čas potřebný pro animaci
            }
        });
    });
});