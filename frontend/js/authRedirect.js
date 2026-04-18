function checkAuth() {
    const token = localStorage.getItem("token");

    if (token) {
        window.location.replace("pages/financeiro.html");
    } else {
        window.location.replace("pages/login.html");
    }
}

checkAuth();