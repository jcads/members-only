const adminToggle = document.getElementById("adminToggle");

adminToggle.addEventListener("click", () => {
    document.querySelector(".adminField").removeAttribute("hidden"); 
    adminToggle.hidden = true;
});
