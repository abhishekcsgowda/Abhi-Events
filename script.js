// Automatic Gallery Slider
let index = 0;
const slides = document.querySelectorAll('.slide');
setInterval(() => {
    index = (index + 1) % slides.length;
    document.querySelector('.slider').style.transform = `translateX(-${index * 100}%)`;
}, 3000);
