const newPasswordInput = document.getElementById("newPassword");
const toggleNewPassword = document.getElementById("toggleNewPassword");

toggleNewPassword.addEventListener("click", () => {
  if (newPasswordInput.type === "password") {
    newPasswordInput.type = "text";
    toggleNewPassword.src = "../assets/eye.png";
  } else {
    newPasswordInput.type = "password";
    toggleNewPassword.src = "../assets/eye-off.png";
  }
});

const confirmPasswordInput = document.getElementById("confirmPassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

toggleConfirmPassword.addEventListener("click", () => {
  if (confirmPasswordInput.type === "password") {
    confirmPasswordInput.type = "text";
    toggleConfirmPassword.src = "../assets/eye.png";
  } else {
    confirmPasswordInput.type = "password";
    toggleConfirmPassword.src = "../assets/eye-off.png";
  }
});


async function resetPassword() {
  const email = document.getElementById("email").value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const error = document.getElementById("error");

  error.innerText = "";

  if (!email || !newPassword || !confirmPassword) {
    error.innerText = "Preencha todos os campos";
    return;
  }

  if (newPassword !== confirmPassword) {
    error.innerText = "As senhas não coincidem";
    return;
  }

  if (newPassword.length < 8) {
    error.innerText = "A senha deve ter no mínimo 8 caracteres";
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/reset-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        newPassword,
        confirmPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      error.innerText = data.message;
      return;
    }

    alert("Senha redefinida com sucesso!");
    window.location.href = "login.html";

  } catch (err) {
    error.innerText = "Erro de conexão com a API";
  }
}
