var menu = document.querySelector (".main-nav");
var menuButton = document.querySelector (".main-nav__toggle");

menuButton.addEventListener("click", function (evt) {
	evt.preventDefault();
	menu.classList.add("main-nav--open");
});