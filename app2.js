document.addEventListener("DOMContentLoaded", async() => {
    const profileBtn = document.getElementById("profile-btn");
    const menuDropdown = document.getElementById("menu-dropdown");
    const logoutOption = document.getElementById("logout");
    const closeModal = document.querySelector(".close-btn");

    // Datos del usuario (simulación, pero deberías obtenerlos desde la BD)
    const userData = await obtenerDatosUsuario();

    // Cargar datos en la modal
    document.getElementById("profile-name").textContent = userData.nombre || "No disponible";
    document.getElementById("profile-email").textContent = userData.correo || "No disponible";
    document.getElementById("profile-cedula").textContent = userData.cedula || "No disponible";
    document.getElementById("profile-career").textContent = userData.carrera || "No disponible";
    document.getElementById("profile-period").textContent = userData.periodo_academico || "No disponible";

    // Mostrar u ocultar el menú cuando se haga clic en la imagen
    profileBtn.addEventListener("click", () => {
        menuDropdown.style.display = menuDropdown.style.display === "block" ? "none" : "block";
    });

    // Cerrar el menú si se hace clic fuera
    document.addEventListener("click", (event) => {
        if (!profileBtn.contains(event.target) && !menuDropdown.contains(event.target)) {
            menuDropdown.style.display = "none";
        }
    });

    // Mostrar modal cuando se haga clic en "Ver Perfil"
    profileBtn.addEventListener("click", () => {
        profileModal.style.display = "flex";
    });

    // Cerrar modal cuando se haga clic en la "X"
    closeModal.addEventListener("click", () => {
        profileModal.style.display = "none";
    });

    // Cerrar modal si se hace clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === profileModal) {
            profileModal.style.display = "none";
        }
    });

    // Manejar el cierre de sesión desde el menú
    logoutOption.addEventListener("click", async() => {
        if (confirm("¿Seguro que deseas cerrar sesión?")) {
            localStorage.removeItem("user");
            await fetch("/TramiESPOCH/logout.php", { method: "POST" });
            alert("Has cerrado sesión.");
            window.location.reload();
        }
    });
});