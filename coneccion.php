<?php
    session_start(); // 🔹 Asegurar que la sesión SIEMPRE se inicie

    $host = "localhost";
    $user = "root";  // Cambia si tienes otro usuario en MySQL
    $pass = "";      // Si XAMPP no tiene contraseña, déjalo vacío
    $db = "tramiespoch";

    // Crear conexión
    $conn = new mysqli($host, $user, $pass, $db);

    // Verificar conexión
    if ($conn->connect_error) {
        die("Error de conexión con la base de datos: " . $conn->connect_error);
    }
?>
