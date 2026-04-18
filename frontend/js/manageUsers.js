document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "administrador") {
    alert("Acesso negado!");
    window.location.href = "login.html";
    return;
  }
  
  loadUsers();

  const modal = document.getElementById("modal");
  const btnAdicionar = document.getElementById("btnAdicionar");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnSalvar = document.getElementById("btnSalvar");

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
    btnSalvar.addEventListener("click", register);
  }
});


async function loadUsers() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/users", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }

    const users = await response.json();

    const table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach(user => {
      const row = `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${formatRole(user.role)}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Excluir</button>
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


function formatRole(role) {
  if (role === "administrador") return "Administrador";
  if (role === "gestor") return "Gestor";
  if (role === "financeiro") return "Financeiro";
  return role;
}


function searchUser() {
  const search = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#userTable tr");

  rows.forEach(row => {
    const name = row.children[0].innerText.toLowerCase();
    row.style.display = name.includes(search) ? "" : "none";
  });
}


async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;
  const error = document.getElementById("error");

  error.innerText = "";

  if (!name || !email || !password || !confirmPassword) {
    error.innerText = "Preencha todos os campos";
    return;
  }

  if (password.length < 8) {
    error.innerText = "Senha deve ter no mínimo 8 caracteres";
    return;
  }

  if (password !== confirmPassword) {
    error.innerText = "As senhas não coincidem";
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
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

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";

    loadUsers();

  } catch (err) {
    error.innerText = "Erro de conexão com a API";
  }
}


function editUser(id) {
  const rows = document.querySelectorAll("#userTable tr");

  rows.forEach(row => {
    if (row.innerHTML.includes(`editUser(${id})`)) {
      document.getElementById("editId").value = id;
      document.getElementById("editName").value = row.children[0].innerText;
      document.getElementById("editEmail").value = row.children[1].innerText;

      const roleText = row.children[2].innerText.toLowerCase();

      if (roleText.includes("admin")) {
        document.getElementById("editRole").value = "administrador";
      } else if (roleText.includes("gestor")) {
        document.getElementById("editRole").value = "gestor";
      } else {
        document.getElementById("editRole").value = "financeiro";
      }
    }
  });

  document.getElementById("modalEdit").style.display = "flex";
}


function closeEdit() {
  document.getElementById("modalEdit").style.display = "none";
}


async function updateUser() {
  const id = document.getElementById("editId").value;
  const name = document.getElementById("editName").value;
  const email = document.getElementById("editEmail").value;
  const role = document.getElementById("editRole").value;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, role })
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar");
    }

    alert("Usuário atualizado com sucesso!");

    document.getElementById("modalEdit").style.display = "none";

    loadUsers();

  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar usuário");
  }
}


async function deleteUser(id) {
  const confirmDelete = confirm("Deseja excluir este usuário?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir usuário");
    }

    alert("Usuário excluído com sucesso!");
    loadUsers();

  } catch (error) {
    console.error(error);
    alert("Erro ao excluir usuário");
  }
}