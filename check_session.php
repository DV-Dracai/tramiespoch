<?php
    include('coneccion.php');

    // Verificar si la sesión ya está iniciada
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    header("Content-Type: application/json");

    // Si la sesión no está activa, devolver que no está autenticado
    if (!isset($_SESSION["user_id"])) {
        echo json_encode(["authenticated" => false]);
        exit;
    }

    // Verificar si el usuario sigue existiendo en la base de datos
    $stmt = $conn->prepare("SELECT nombre_completo FROM estudiante WHERE codigo = ?");
    $stmt->bind_param("s", $_SESSION["user_id"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(["authenticated" => true, "user" => $user["nombre_completo"]]);
    } else {
        session_destroy(); // Si el usuario ya no existe, destruir la sesión
        echo json_encode(["authenticated" => false]);
    }
    exit;
?>
