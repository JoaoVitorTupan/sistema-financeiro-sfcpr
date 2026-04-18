document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  async function carregarPerfil() {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar perfil");
      }

      const user = await response.json();
      const nome = document.getElementById("nomeUsuario");
      const email = document.getElementById("emailUsuario");
      const role = document.getElementById("roleUsuario");

      if (nome) nome.innerText = user.name;
      if (email) email.innerText = user.email;

      let roleText = "Usuário";

      if (user.role === "administrador") {
        roleText = "Administrador";
      } else if (user.role === "gestor") {
        roleText = "Gestor";
      } else if (user.role === "financeiro") {
        roleText = "Financeiro";
      }

      if (role) role.innerText = roleText;

    } catch (error) {
      console.error(error);
      alert("Sessão inválida. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  }

  const logoutLink = document.getElementById("logoutLink");

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  carregarPerfil();
});