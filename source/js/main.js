// var navMain = document.querySelector('.main-nav')
// , navToggle = document.querySelector('.main-nav__toggle')
var slider = document.querySelector(".slider")
, buttonBefore = document.querySelector(".slider__toggle--before")
, buttonAfter = document.querySelector(".slider__toggle--after")
, sliderIndicator = document.querySelector(".slider__indicator");

// navToggle.addEventListener('click', function() {
//   if (navMain.classList.contains('main-nav--closed')) {
//     navMain.classList.remove('main-nav--closed');
//     navMain.classList.add('main-nav--opened');
//   } else {
//     navMain.classList.add('main-nav--closed');
//     navMain.classList.remove('main-nav--opened');
//   }
// });


buttonBefore && buttonBefore.addEventListener("click", function() {
    slider.classList.contains("slider--after") && (slider.classList.remove("slider--after"),
    slider.classList.add("slider--before"))
});
buttonAfter && buttonAfter.addEventListener("click", function() {
    slider.classList.contains("slider--before") && (slider.classList.remove("slider--before"),
    slider.classList.add("slider--after"))
});
sliderIndicator && sliderIndicator.addEventListener("click", function() {
    slider.classList.contains("slider--before") ? (slider.classList.remove("slider--before"),
    slider.classList.add("slider--after")) : (slider.classList.remove("slider--after"),
    slider.classList.add("slider--before"))
});
