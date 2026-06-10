/**
 * main.js
 * Hlavní skript pro interaktivitu a animace na stránce.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. OBSERVER PRO ANIMACE PŘI SCROLLOVÁNÍ (FADE IN)
     * Sleduje prvky s třídou .hidden. Jakmile se při scrollování
     * objeví na obrazovce, přidá jim třídu .show, čímž spustí CSS animaci odhalení.
     */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));


    /**
     * 2. REAKTIVNÍ NAVIGACE (SCROLLSPY)
     * Sleduje všechny hlavní sekce (section, main). Zvýrazní v horní navigaci
     * ten odkaz, který odpovídá sekci, kterou si uživatel právě prohlíží.
     */
    const sections = document.querySelectorAll('section[id], main[id]');
    const navLinksList = document.querySelectorAll('.nav-links a');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -60% 0px' // Změní se, jakmile sekce protne prostředek obrazovky
    });

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });


    /**
     * 3. OTÁČENÍ KARET PROJEKTŮ (FLIP EFEKT)
     * Přidává a odebírá třídu .flipped pro zobrazení detailů projektu na zadní straně karty.
     */
    document.querySelectorAll('.flip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.closest('.project-card').classList.add('flipped');
        });
    });

    document.querySelectorAll('.flip-back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.closest('.project-card').classList.remove('flipped');
        });
    });


    /**
     * 4. PŘEPÍNÁNÍ TMAVÉHO/SVĚTLÉHO REŽIMU (DARK MODE)
     * Uchovává volbu uživatele v localStorage prohlížeče a přepíná HTML atribut data-theme.
     */
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');

    const updateIcon = (isDark) => {
        themeToggleBtns.forEach(btn => {
            const themeIcon = btn.querySelector('i');
            if (themeIcon) {
                if (isDark) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                    const textSpan = btn.querySelector('span');
                    if (textSpan) textSpan.textContent = 'Světlý režim';
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                    const textSpan = btn.querySelector('span');
                    if (textSpan) textSpan.textContent = 'Tmavý režim';
                }
            }
        });
    };

    // Zkontroluje naposledy zvolené téma při načtení webu (kvůli zamezení blikání je v headu také rychlý skript)
    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateIcon(currentTheme === 'dark');

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme === 'dark');
        });
    });


    /**
     * 5. TLAČÍTKO "NÁVRAT NAHORU" (SCROLL TO TOP)
     * Zobrazí plovoucí šipku vpravo dole, pokud uživatel odscroluje alespoň o 500px dolů.
     */
    const scrollTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
                scrollTopBtn.classList.remove('hidden-btn');
            } else {
                scrollTopBtn.classList.remove('visible');
                scrollTopBtn.classList.add('hidden-btn');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /**
     * 6. AUTOMATICKÝ ROK V PATIČCE
     * Zajistí, že rok v copyright textu v patičce bude vždy odpovídat aktuálnímu roku.
     */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }


    /**
     * 7. MOBILNÍ MENU (HAMBURGER ICON)
     * Stará se o rozbalování/sbalování menu na mobilních telefonech
     * a také o jeho automatické zavření, když uživatel klikne mimo něj.
     */
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // Zabránit probublání, aby to nezachytil click listener na documentu
            navLinks.classList.toggle('active');
            burgerMenu.classList.toggle('open'); // Mění X na tři čárky a naopak
        });

        // Zavřít menu, když uživatel vybere nějakou sekci z menu
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burgerMenu.classList.remove('open');
            });
        });

        // Zavřít menu, když uživatel klikne kamkoliv jinam do prostoru stránky
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !burgerMenu.contains(e.target)) {
                navLinks.classList.remove('active');
                burgerMenu.classList.remove('open');
            }
        });
    }


    /**
     * 8. MAGNETICKÁ TLAČÍTKA
     * Interaktivní designový prvek: tlačítka s mírným zpožděním následují kurzor
     * a vytvářejí moderní WOW efekt při najetí myší.
     */
    const magneticButtons = document.querySelectorAll('.nav-cta, .cta-button');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Výpočet pozice kurzoru vůči středu tlačítka
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Fyzikální přitažení (násobitel 0.2 určuje, jak moc se tlačítko hýbe)
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Pružné vrácení na původní místo po odjetí kurzoru
            btn.style.transform = 'translate(0px, 0px)';
        });
    });


    /**
     * 9. AJAX KONTAKTNÍ FORMULÁŘ (FORMSPREE)
     * Odešle formulář zcela na pozadí, aniž by došlo k nežádoucímu přesměrování
     * na ošklivou stránku Formspree s poděkováním.
     */
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('form-status');

    if (form && statusDiv) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Zastaví klasické, zastaralé odeslání HTML formuláře
            
            statusDiv.innerHTML = 'Odesílám... ⏳';
            statusDiv.style.color = 'var(--text-color)';
            
            const data = new FormData(form);
            
            try {
                // Fetch API k odeslání dat potichu
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    statusDiv.innerHTML = 'Zpráva byla úspěšně odeslána. Brzy se vám ozvu! ✅';
                    statusDiv.style.color = '#22c55e';
                    form.reset(); // Vyčistí všechna políčka po úspěchu
                } else {
                    statusDiv.innerHTML = 'Něco se pokazilo. Zkontrolujte prosím vyplněné údaje a zkuste to znovu. ❌';
                    statusDiv.style.color = '#ef4444';
                }
            } catch (error) {
                // Pokud uživateli spadne internet nebo je blokován AdBlockem
                statusDiv.innerHTML = 'Chyba připojení. Zkuste to prosím znovu. ❌';
                statusDiv.style.color = '#ef4444';
            }
        });
    }

});
