document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || usuario.role !== "administrador") {
    alert("Acesso negado!");
    window.location.href = "login.html";
    return;
  }
  
  carregarUsuarios();

  const modal = document.getElementById("modal");
  const btnAdicionar = document.getElementById("btnAdicionar");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnMenu = document.getElementById("btnMenu");
  const btnPerfil = document.getElementById("btnPerfil");
  const menuDropdown = document.getElementById("menuDropdown");
  const sair = document.getElementById("sair");

  if (btnAdicionar) {
    btnAdicionar.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", registrar);
  }

    if (btnPerfil) {
    btnPerfil.addEventListener("click", () => {
      window.location.href = "perfil.html";
    });
  }

  if (btnMenu) {
    btnMenu.addEventListener("click", () => {

      menuDropdown.style.display =
        menuDropdown.style.display === "flex"
          ? "none"
          : "flex";

    });
  }

  document.addEventListener("click", (e) => {

    if (
      btnMenu &&
      menuDropdown &&
      !btnMenu.contains(e.target) &&
      !menuDropdown.contains(e.target)
    ) {
      menuDropdown.style.display = "none";
    }

  });

  if (sair) {
    sair.addEventListener("click", (e) => {

      e.preventDefault();

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      window.location.href = "login.html";

    });
  }
});


async function carregarUsuarios() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/usuarios", {
      headers: {
        "Autorizado": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }

    const usuarios = await response.json();

    const table = document.getElementById("usuariosTable");
    table.innerHTML = "";

    usuarios.forEach(usuario => {
      const row = `
        <tr>
          <td>${usuario.nome}</td>
          <td>${usuario.email}</td>
          <td>${formatarRole(usuario.role)}</td>
          <td>${usuario.status ? "Ativo" : "Inativo"}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id})">Editar</button>
          </td>
        </tr>
      `;
      table.innerHTML += row;
    });

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao carregar usuários");
  }
}


function formatarRole(role) {
  if (role === "administrador") return "Administrador";
  if (role === "gestor") return "Gestor";
  if (role === "financeiro") return "Financeiro";
  return role;
}


function buscarUsuarios() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const rows = document.querySelectorAll("#usuariosTable tr");

  rows.forEach(row => {
    const nome = row.children[0].innerText.toLowerCase();
    row.style.display = nome.includes(busca) ? "" : "none";
  });
}


async function registrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmSenha = document.getElementById("confirmSenha").value;
  const role = document.getElementById("role").value;
  const error = document.getElementById("error");

  error.innerText = "";

  if (!nome || !email || !senha || !confirmSenha) {
    error.innerText = "Preencha todos os campos";
    return;
  }

  if (senha.length < 8) {
    error.innerText = "Senha deve ter no mínimo 8 caracteres";
    return;
  }

  if (senha !== confirmSenha) {
    error.innerText = "As senhas não coincidem";
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Autorizado": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
        confirmSenha,
        role
      })
    });

    const data = await response.json();

    if (!response.ok) {
      error.innerText = data.error || "Erro ao cadastrar";
      return;
    }

    alert("Usuário cadastrado com sucesso!");

    document.getElementById("modal").style.display = "none";

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("confirmSenha").value = "";

    carregarUsuarios();

  } catch (err) {
    error.innerText = "Erro de conexão com a API";
  }
}

function editarUsuario(id) {
  const rows = document.querySelectorAll("#usuariosTable tr");

  rows.forEach(row => {

    if (row.innerHTML.includes(`editarUsuario(${id})`)) {

      document.getElementById("editarId").value = id;

      document.getElementById("editarNome").value =
        row.children[0].innerText;

      document.getElementById("editarEmail").value =
        row.children[1].innerText;

      const roleText =
        row.children[2].innerText.toLowerCase();

      if (roleText.includes("admin")) {

        document.getElementById("editarRole").value =
          "administrador";

      } else if (roleText.includes("gestor")) {

        document.getElementById("editarRole").value =
          "gestor";

      } else {

        document.getElementById("editarRole").value =
          "financeiro";
      }

      const statusText = row.children[3].innerText;

      document.getElementById("editarStatus").value =
        statusText === "Ativo"
          ? "true"
          : "false";
    }

  });

  document.getElementById("modalEditar").style.display =
    "flex";
}

function fecharEditar() {
  document.getElementById("modalEditar").style.display = "none";
}


async function atualizarUsuario() {
  const id = document.getElementById("editarId").value;
  const nome = document.getElementById("editarNome").value;
  const email = document.getElementById("editarEmail").value;
  const role = document.getElementById("editarRole").value;
  const status = document.getElementById("editarStatus").value === "true";

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Autorizado": `Bearer ${token}`
      },
      body: JSON.stringify({ nome, email, role, status })
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar");
    }

    alert("Usuário atualizado com sucesso!");

    document.getElementById("modalEditar").style.display = "none";

    carregarUsuarios();

  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar usuário");
  }
}


