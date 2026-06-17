document.addEventListener("DOMContentLoaded", () => {
    const api = "http://localhost:3000/clientes-fornecedores";
  const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");
    const btnAdicionar = document.getElementById("btnAdicionar");
    const btnCancelar = document.getElementById("btnCancelar");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnMenu = document.getElementById("btnMenu");
    const btnPerfil = document.getElementById("btnPerfil");
    const menuDropdown = document.getElementById("menuDropdown");
    const sair = document.getElementById("sair");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

        btnPerfil?.addEventListener("click", () => {
        window.location.href = "perfil.html";
    });

    btnMenu?.addEventListener("click", () => {
        menuDropdown.style.display =
            menuDropdown.style.display === "flex"
                ? "none"
                : "flex";
    });

    if (usuario.role !== "administrador") {
        const gerenciarUsuariosLink = document.querySelector('a[href="gerenciarUsuarios.html"]');
        if (gerenciarUsuariosLink) {
        gerenciarUsuariosLink.style.display = "none";
        }
    }

    sair?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    let listaRegistros = [];
    let registroEditando = null;

    async function carregarRegistros() {
        try {
            const response = await fetch(api, {
                headers: {
                    Autorizado: `Bearer ${token}`
                }
            });

            console.log("STATUS:", response.status);

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
                return;
            }


            if (!response.ok) {
                throw new Error("Erro ao buscar registros");
            }

            const dados = await response.json();

            listaRegistros = dados;

            renderizarTabela(dados);

        } catch (error) {
            console.error("Erro ao carregar registros:", error);
        }
    }

    function renderizarTabela(registros) {
        const tabela =
            document.getElementById("tabelaClienteOuFornecedor");

        tabela.innerHTML = "";

        let clientes = 0;
        let fornecedores = 0;

        registros.forEach(registro => {

            if (registro.tipo === "cliente") clientes++;
            if (registro.tipo === "fornecedor") fornecedores++;

            tabela.innerHTML += `
                <tr>
                    <td>${registro.tipo}</td>
                    <td>${registro.nome}</td>
                    <td>${registro.cpf_cnpj}</td>
                    <td>${registro.email ?? ""}</td>
                    <td>${registro.telefone ?? ""}</td>
                    <td>${registro.endereco ?? ""}</td>
                    <td>${registro.status ? "Ativo" : "Inativo"}</td>
                    <td>
                        <button
                            class="btn btn-warning btn-sm"
                            onclick="editarRegistro(${registro.id})">
                            Editar
                        </button>

                        <button
                            class="btn ${registro.status ? "btn-danger" : "btn-success"} btn-sm"
                            onclick="alterarStatus(${registro.id}, ${registro.status})">
                            ${registro.status ? "Inativar" : "Ativar"}
                        </button>
                    </td>
                </tr>
            `;
        });

        document.getElementById("totalClienteOuFornecedor").innerText =
            registros.length;

        document.getElementById("totalClientes").innerText =
            clientes;

        document.getElementById("totalFornecedores").innerText =
            fornecedores;
    }

    function buscarRegistro() {
        const termo =
            document.getElementById("buscar")
                .value
                .toLowerCase();

        const filtrados =
            listaRegistros.filter(registro =>
                registro.nome.toLowerCase().includes(termo) ||
                registro.cpf_cnpj.toLowerCase().includes(termo)
            );

        renderizarTabela(filtrados);
    }

    function abrirModal() {
        document.getElementById("modal").style.display = "flex";
    }

    function fecharModal() {
        document.getElementById("modal").style.display = "none";
    }

    function limparFormulario() {
        registroEditando = null;

        document.getElementById("modalTitulo").innerText =
            "Novo Cliente ou Fornecedor";

        document.getElementById("tipo").value = "cliente";
        document.getElementById("nome").value = "";
        document.getElementById("cpf_cnpj").value = "";
        document.getElementById("email").value = "";
        document.getElementById("telefone").value = "";
        document.getElementById("endereco").value = "";
    }

    async function salvarRegistro() {
        const registro = {
            tipo: document.getElementById("tipo").value,
            nome: document.getElementById("nome").value,
            cpf_cnpj: document.getElementById("cpf_cnpj").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            endereco: document.getElementById("endereco").value
        };

        try {
            let response;

            if (registroEditando) {
                response = await fetch(
                    `${api}/${registroEditando}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Autorizado: `Bearer ${token}`
                        },
                        body: JSON.stringify(registro)
                    }
                );
            } else {
                response = await fetch(
                    api,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Autorizado: `Bearer ${token}`
                        },
                        body: JSON.stringify(registro)
                    }
                );
            }

            if (!response.ok) {
                throw new Error("Erro ao salvar registro");
            }

            fecharModal();
            limparFormulario();
            carregarRegistros();

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar registro.");
        }
    }

    function editarRegistro(id) {
        const registro =
            listaRegistros.find(r => r.id === id);

        if (!registro) return;

        registroEditando = id;

        document.getElementById("modalTitulo").innerText =
            "Editar Cliente ou Fornecedor";

        document.getElementById("tipo").value = registro.tipo;
        document.getElementById("nome").value = registro.nome;
        document.getElementById("cpf_cnpj").value = registro.cpf_cnpj;
        document.getElementById("email").value = registro.email ?? "";
        document.getElementById("telefone").value = registro.telefone ?? "";
        document.getElementById("endereco").value = registro.endereco ?? "";

        abrirModal();
    }

    async function alterarStatus(id, statusAtual) {
        try {

            let response;

            if (statusAtual) {
                response = await fetch(
                    `${api}/inativar/${id}`,
                    {
                        method: "PATCH",
                        headers: {
                            Autorizado: `Bearer ${token}`
                        }
                    }
                );
            } else {
                response = await fetch(
                    `${api}/${id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Autorizado: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            status: true
                        })
                    }
                );
            }

            if (!response.ok) {
                throw new Error("Erro ao alterar status");
            }

            carregarRegistros();

        } catch (error) {
            console.error(error);
        }
    }

    window.editarRegistro = editarRegistro;
    window.alterarStatus = alterarStatus;

    btnAdicionar?.addEventListener("click", () => {
        limparFormulario();
        abrirModal();
    });

    btnCancelar?.addEventListener("click", fecharModal);
    btnSalvar?.addEventListener("click", salvarRegistro);
    btnBuscar?.addEventListener("click", buscarRegistro);

    carregarRegistros();
});