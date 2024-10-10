document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Toggles navigation visibility and hamburger animation
    const toggleNav = () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        document.body.classList.toggle('no-scroll'); // Přidání/odebrání třídy pro zakázání rolování
    };

    // Toggle navigation on burger click
    burger.addEventListener('click', toggleNav);

    // Close navigation when a link is clicked
    for (const link of navLinks) {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            document.body.classList.remove('no-scroll'); // Umožní rolování při zavření menu
        });
    }

    // Funkce pro aktualizaci progress baru
    const updateProgressBar = () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        const progressBar = document.getElementById("progressBar");
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`; // Použití šablonového řetězce pro zjednodušení
        }
    };

    // Přidání event listeneru pro scroll
    window.addEventListener('scroll', updateProgressBar);

    // Funkce pro scroll up button
    const scrollUpBtn = document.getElementById("scrollUpBtn");

    // Zobrazí nebo skryje tlačítko na základě scrollování
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollUpBtn.style.display = "block"; // Zobrazí tlačítko
        } else {
            scrollUpBtn.style.display = "none"; // Skryje tlačítko
        }
    });

    // Smooth scroll to top
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Plynulý posun k vrcholu
        });
    });

    // Nastavení tmavého režimu
    // biome-ignore lint/style/noVar: <explanation>
        var icon = document.getElementById("icon");

    function setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add("dark-mode");
            icon.src = "assets/icons/sun.png";
        } else {
            document.body.classList.remove("dark-mode");
            icon.src = "assets/icons/moon.png";
        }
    }

    // Zkontrolujte localStorage při načítání stránky
    window.onload = () => {
        const darkMode = localStorage.getItem("dark-mode") === "true"; // Získat hodnotu z localStorage
        setDarkMode(darkMode); // Nastavit tmavý režim
    };

    // Přepnutí tmavého režimu při kliknutí na ikonu
    icon.onclick = () => {
        const isDarkMode = document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", isDarkMode); // Uložit stav do localStorage
        icon.src = isDarkMode ? "assets/icons/sun.png" : "moon.png";
    };

    document.getElementById("nextSection").addEventListener("click", () => {
        document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    });
    
});
