// Navigation
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.remove('active');
}

let mybutton;

// Inicializace po načtení celého dokumentu
document.addEventListener("DOMContentLoaded", () => {
    mybutton = document.getElementById("upBtn");

    // Přiřazení funkce k události onscroll
    window.onscroll = () => {
        scrollFunction();
        myFunction();
    };
});



// Funkce pro zobrazení/skrytí tlačítka "nahoru"
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// Funkce pro návrat na začátek stránky
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Funkce pro aktualizaci progress baru
function myFunction() {
    // biome-ignore lint/style/noVar: <explanation>
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    // biome-ignore lint/style/noVar: <explanation>
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // biome-ignore lint/style/noVar: <explanation>
    var scrolled = (winScroll / height) * 100;
    // biome-ignore lint/style/useTemplate: <explanation>
    document.getElementById("progressBar").style.width = scrolled + "%";
}

// SLIDESHOW
let slideIndex = 1;
showSlides(slideIndex);

// Funkce pro posun na další/předchozí snímek
function plusSlides(n) {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    showSlides(slideIndex += n);
}

// Funkce pro nastavení aktuálního snímku
function currentSlide(n) {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    showSlides(slideIndex = n);
}

// Funkce pro zobrazení aktuálního snímku a aktualizaci teček
function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}