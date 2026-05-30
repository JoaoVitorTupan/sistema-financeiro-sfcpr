document.addEventListener("DOMContentLoaded", () => {

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const bemVindo = document.querySelector("h1");
  const btnMenu = document.getElementById("btnMenu");
  const menuDropdown = document.getElementById("menuDropdown");
  const btnPerfil = document.getElementById("btnPerfil");
  const sair = document.getElementById("sair");

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  btnMenu.addEventListener("click", () => {
    menuDropdown.style.display =
       menuDropdown.style.display === "flex" ? "none" : "flex";
  });

  btnPerfil.addEventListener("click", () => {
    window.location.href = "perfil.html";
  });


  if (usuario.role !== "administrador") {
    const gerenciarUsuariosLink = document.querySelector('a[href="gerenciarUsuarios.html"]');
    if (gerenciarUsuariosLink) {
      gerenciarUsuariosLink.style.display = "none";
    }
  }

  sair.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    window.location.href = "login.html";
  });

  document.addEventListener("click", (event) => {
    if (!btnMenu.contains(event.target) && !menuDropdown.contains(event.target)) {
      menuDropdown.style.display = "none";
    }
  });

});