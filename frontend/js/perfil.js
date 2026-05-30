document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  async function carregarPerfil() {
    try {
      const response = await fetch("http://localhost:3000/usuarios/perfil", {
        headers: {
          "Autorizado": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar perfil");
      }

      const usuario = await response.json();
      const nome = document.getElementById("nomeUsuario");
      const email = document.getElementById("emailUsuario");
      const role = document.getElementById("roleUsuario");

      if (nome) nome.innerText = usuario.nome;
      if (email) email.innerText = usuario.email;

      let roleText = "Usuário";

      if (usuario.role === "administrador") {
        roleText = "Administrador";
      } else if (usuario.role === "gestor") {
        roleText = "Gestor";
      } else if (usuario.role === "financeiro") {
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

  const sairLink = document.getElementById("sairLink");

  if (sairLink) {
    sairLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

  carregarPerfil();
});