document.addEventListener("DOMContentLoaded", () => {

  window.login = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    error.innerText = "";

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        error.innerText = data.message || "Erro ao fazer login";
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      window.location.href = "financeiro.html";

    } catch (err) {
      error.innerText = "Erro de conexão com a API";
    }
  };

  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";
      togglePassword.src = isPassword ? "../assets/eye.png" : "../assets/eye-off.png";
    });
  }

});