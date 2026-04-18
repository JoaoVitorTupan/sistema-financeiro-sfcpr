document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const welcome = document.querySelector("h1");
  const btnMenu = document.getElementById("btnMenu");
  const menuDropdown = document.getElementById("menuDropdown");
  const btnProfile = document.getElementById("btnProfile");
  const logout = document.getElementById("logout");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  btnMenu.addEventListener("click", () => {
    menuDropdown.style.display =
       menuDropdown.style.display === "flex" ? "none" : "flex";
  });

  btnProfile.addEventListener("click", () => {
    window.location.href = "profile.html";
  });


  if (user.role !== "administrador") {
    const manageUsersLink = document.querySelector('a[href="manageUsers.html"]');
    if (manageUsersLink) {
      manageUsersLink.style.display = "none";
    }
  }

  logout.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "login.html";
  });

  document.addEventListener("click", (event) => {
    if (!btnMenu.contains(event.target) && !menuDropdown.contains(event.target)) {
      menuDropdown.style.display = "none";
    }
  });

});