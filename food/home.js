//navbar-iin 3n zuraas buhii button
const toggle = document.getElementById("toggle");

// modal tsonhnii close button
const close = document.getElementById("close");

//navbar-iin SIGN UP button
const open = document.getElementById("open");

const modal = document.getElementById("modal");

// toggle NAVbar garch irdeg heseg
toggle.addEventListener("click", () => {
  document.body.classList.toggle("show-nav");
});

// SHOW MODAL heseg
open.addEventListener("click", () => {
  modal.classList.add("show-modal");
});

// HIDE MODAL heseg
close.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});

// HIDE MODAL outside click
// Zaawal close button dr darahgviger MODAL tsonhnii gadna tald haana ch bsan darahad alga bolno.
window.addEventListener("click", (e) => {
  e.target == modal ? modal.classList.remove("show-modal") : false;
});
