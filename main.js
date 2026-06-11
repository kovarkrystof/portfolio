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
        let delayCounter = 0;
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Přidáme zpoždění, pokud se objeví více prvků naráz (stagger efekt)
                entry.target.style.transitionDelay = `${delayCounter * 0.15}s`;
                entry.target.classList.add('show');
                delayCounter++;
                
                // Přestaneme sledovat po prvním zobrazení
                observer.unobserve(entry.target);
                
                // Jakmile animace doběhne, zrušíme delay, aby neblokoval hover efekty
                setTimeout(() => {
                    entry.target.style.transitionDelay = '0s';
                }, 1000 + (delayCounter * 150));
            }
        });
    }, {
        threshold: 0.1 // Prvek musí být alespoň 10% v obraze, než začne animace
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));


    /**
     * 1.5. VLASTNÍ PLYNULÉ ROLOVÁNÍ (CONSTANT SPEED)
     * Nahrazuje nativní scroll-behavior: smooth, které má fixní čas a při dlouhých
     * skocích (např. přes 250vh sekci Procesu) roluje "warpovou" rychlostí.
     * Naše funkce vypočítá čas na základě vzdálenosti (např. 1 ms na 1 pixel).
     */
    const customSmoothScroll = (targetInput) => {
        const headerOffset = 100; // Respektování scroll-padding-top
        
        let targetPosition;
        if (typeof targetInput === 'number') {
            targetPosition = targetInput; // Pokud předáme přesné číslo (např. 0 pro vrch)
        } else {
            targetPosition = targetInput.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        }

        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        
        // Rychlost: cca 1.2 ms na pixel (nastavitelné). Minimum 500ms, maximum 3000ms pro extrémní vzdálenosti.
        const duration = Math.min(Math.max(Math.abs(distance) * 1.2, 500), 3000); 
        let start = null;

        const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutQuad(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    // Zachytit kliknutí na odkazy začínající křížkem (#)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignorovat prázdné hashe
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Zrušíme výchozí chování prohlížeče
                
                // Pokud je otevřené mobilní menu, zavřeme ho
                const navLinks = document.getElementById('nav-links');
                const burgerMenu = document.getElementById('burger-menu');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burgerMenu.classList.remove('open');
                }

                customSmoothScroll(targetElement);
            }
        });
    });

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

    /**
     * 10. MORPHING FLOATING PILL (SCROLL COMPANION)
     * ===========================================
     * Tracks which section is visible in the middle of the viewport using a
     * dedicated IntersectionObserver with a tight rootMargin (-30% top and bottom).
     * That narrow "trigger band" means the state only changes when the section is
     * clearly in focus — preventing jitter when scrolling quickly over short sections.
     *
     * State dictionary maps section IDs → { icon class, label text, scroll target }.
     * On Contact we merge pill functionality with scroll-to-top to avoid clutter.
     */
    const companion       = document.getElementById('floating-companion');
    const fcIcon          = document.getElementById('fc-icon');
    const fcText          = document.getElementById('fc-text');

    if (companion && fcIcon && fcText) {

        // ── State dictionary (Phase 3) ──────────────────────────────────────
        // Each key is a section ID; each value defines icon, text, and target.
        const SECTION_STATES = {
            hero: {
                icon:   'fa-solid fa-arrow-down',
                text:   'Zjistit více',
                target: '#about',
                label:  'Přejít na Přístup'
            },
            about: {
                icon:   'fa-solid fa-lightbulb',
                text:   'Jak pracuji',
                target: '#process',
                label:  'Přejít na Proces'
            },
            process: {
                icon:   'fa-solid fa-screwdriver-wrench',
                text:   'Ukázky práce',
                target: '#projects',
                label:  'Přejít na Portfolio'
            },
            projects: {
                icon:   'fa-solid fa-rocket',
                text:   'Napsat zprávu',
                target: '#contact',
                label:  'Přejít na Kontakt'
            },
            // faq falls through to the contact state (same target)
            faq: {
                icon:   'fa-solid fa-rocket',
                text:   'Napsat zprávu',
                target: '#contact',
                label:  'Přejít na Kontakt'
            },
            contact: {
                // Special state: pill becomes a "Back to top" button
                icon:   'fa-solid fa-arrow-up',
                text:   'Zpět nahoru',
                target: null,  // null → scroll to top
                label:  'Zpět nahoru'
            }
        };

        // Track what we're currently pointing at (avoids redundant DOM writes)
        let currentSectionId = null;
        let mobileExpandTimeout = null;

        // ── DOM Update Helper (Phase 4) ─────────────────────────────────────
        /**
         * updatePillState(sectionId)
         * Applies the correct icon, text, ARIA label, and visual state classes
         * for the given section. Triggers a brief CSS spin on the icon wrapper
         * so the transition feels lively without needing GSAP.
         */
        function updatePillState(sectionId) {
            const state = SECTION_STATES[sectionId];
            if (!state || sectionId === currentSectionId) return;
            
            // Do not expand on the very first load
            const isFirstLoad = (currentSectionId === null);
            currentSectionId = sectionId;

            const iconWrap = companion.querySelector('.fc-icon-wrap');

            // 1. Kick off icon spin micro-animation
            if (iconWrap) {
                iconWrap.classList.remove('fc-spin');
                // Force reflow so removing then re-adding the class actually re-triggers
                void iconWrap.offsetWidth;
                iconWrap.classList.add('fc-spin');
                // Remove class once animation completes (0.35s)
                setTimeout(() => iconWrap.classList.remove('fc-spin'), 350);
            }

            // 2. Swap icon class – remove all fa-* classes then add the new one
            //    (Keeps any non-icon classes like 'fa-solid' / 'fa-regular' safe)
            fcIcon.className = state.icon;

            // 3. Swap label text
            fcText.textContent = state.text;

            // 4. Update ARIA label for screen-reader clarity
            companion.setAttribute('aria-label', state.label);

            // 5. Apply / remove special visual states
            if (sectionId === 'contact') {
                // Merge pill with scroll-to-top: make it a solid primary button
                companion.classList.add('fc-top-state');
                companion.classList.remove('fc-hidden');
            } else {
                companion.classList.remove('fc-top-state', 'fc-hidden');
            }

            // 6. Mobile UX: Temporarily expand the pill to show the new text label, then collapse
            if (!isFirstLoad && window.innerWidth <= 768) {
                companion.classList.add('fc-expanded-mobile');
                clearTimeout(mobileExpandTimeout);
                mobileExpandTimeout = setTimeout(() => {
                    companion.classList.remove('fc-expanded-mobile');
                }, 2500); // Zůstane rozbaleno 2.5 sekundy
            }
        }

        // ── Click Handler (Phase 4) ─────────────────────────────────────────
        /**
         * On click, scroll smoothly to the target defined for the current state.
         * If target is null (Contact state) → scroll to top.
         */
        companion.addEventListener('click', () => {
            const state = SECTION_STATES[currentSectionId];
            if (!state) return;

            if (state.target === null) {
                // Back-to-top behaviour
                customSmoothScroll(0);
            } else {
                const targetEl = document.querySelector(state.target);
                if (targetEl) {
                    customSmoothScroll(targetEl);
                }
            }
        });

        // ── IntersectionObserver (Phase 3) ─────────────────────────────────
        /**
         * rootMargin: '-30% 0px -30% 0px'
         * This creates a 40%-tall detection band in the vertical middle of the
         * viewport. A section must occupy that band to be considered "active".
         * Prevents flicker when two sections are partially visible simultaneously.
         *
         * threshold: 0 means the observer fires as soon as even 1px enters the band.
         */
        const companionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id && SECTION_STATES[id]) {
                        updatePillState(id);
                    }
                }
            });
        }, {
            rootMargin: '-30% 0px -30% 0px',
            threshold:  0
        });

        // Observe each named section (hero, about, process, projects, faq, contact)
        const companionSections = document.querySelectorAll(
            '#hero, #about, #process, #projects, #faq, #contact'
        );
        companionSections.forEach(sec => companionObserver.observe(sec));

        // ── Initial State ──────────────────────────────────────────────────
        // Set the pill to Hero state immediately so it's ready before scrolling starts.
        // The pill only becomes visible once the user begins to scroll (handled via
        // the observer firing naturally when #hero enters the detection band on load).
        updatePillState('hero');

    } // end if (companion)

    /**
     * 11. PROCESS SLIDER
     * Interaktivní horizontální krokování procesu s progress barem.
     */
    const processTabs = document.querySelectorAll('.process-tab');
    const processPanels = document.querySelectorAll('.process-panel');
    const progressBar = document.getElementById('process-progress');
    let processInterval;

    if (processTabs.length > 0 && processPanels.length > 0 && progressBar) {
        
        const activateStep = (stepNumber) => {
            // Zvýraznění aktivní záložky
            processTabs.forEach(tab => {
                if (tab.getAttribute('data-step') === String(stepNumber)) {
                    tab.classList.add('active');
                    // Scroll záložky do viditelné oblasti na mobilu
                    if (window.innerWidth < 768) {
                        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                } else {
                    tab.classList.remove('active');
                }
            });

            // Zobrazení odpovídajícího panelu
            processPanels.forEach(panel => {
                if (panel.getAttribute('data-step') === String(stepNumber)) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        };

        const totalSteps = processTabs.length;

        // Skrolování (Scroll-jacking)
        const processSection = document.getElementById('process');
        
        if (processSection) {
            window.addEventListener('scroll', () => {
                const rect = processSection.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Efekt začíná přesně, když se parent sekce dotkne horního okraje obrazovky
                // (Protože sticky container má top: 0 a height: 100vh, obsah se tím vycentruje)
                const startThreshold = 0; 
                
                // Celková vzdálenost, po kterou je sekce sticky (výška sekce mínus viewport)
                const scrollableDistance = processSection.offsetHeight - viewportHeight;
                
                if (scrollableDistance <= 0) return;

                if (rect.top <= startThreshold && rect.bottom >= startThreshold) {
                    // Jak daleko uživatel odscrolloval v rámci sekce
                    const scrolledIn = startThreshold - rect.top;
                    
                    // Progress od 0.0 do 1.0
                    let progress = Math.max(0, Math.min(1, scrolledIn / scrollableDistance));
                    
                    // Krok na základě progressu
                    let step = Math.min(totalSteps, Math.floor(progress * totalSteps) + 1);
                    if (progress >= 0.99) step = totalSteps;

                    activateStep(step);
                    
                    // Plynulý progress bar přesně podle scrollu
                    progressBar.style.width = `${progress * 100}%`;
                } else if (rect.top > startThreshold) {
                    // Uživatel je nad sekcí
                    activateStep(1);
                    progressBar.style.width = `0%`;
                } else if (rect.bottom < startThreshold) {
                    // Uživatel sekci přejel
                    activateStep(totalSteps);
                    progressBar.style.width = `100%`;
                }
            }, { passive: true });
        }

        // Manuální přepínání kliknutím přesune okno na odpovídající výšku
        processTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const step = parseInt(tab.getAttribute('data-step'), 10);
                if (processSection) {
                    const scrollableDistance = processSection.offsetHeight - window.innerHeight;
                    // Výpočet scroll pozice: začátek sekce + offset pro daný krok
                    const targetScroll = window.scrollY + processSection.getBoundingClientRect().top + ((step - 0.5) / totalSteps) * scrollableDistance;
                    
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

});
