<?php
    include('coneccion.php'); // Conectar a la BD

    // 🔹 Forzar salida en JSON y evitar errores de salida accidental
    header("Content-Type: application/json");
    ob_clean();
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }


    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $raw_input = file_get_contents("php://input");
        $data = json_decode($raw_input, true);

        if (!$data) {
            echo json_encode(["success" => false, "message" => "Error al recibir los datos"]);
            die();
        }

        $correo = $data["correo"];
        $password = $data["password"];

        $query = "SELECT * FROM estudiante WHERE correo = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) {
            echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
            die();
        }

        $user = $result->fetch_assoc();

        if ($user["verificado"] == 0) {
            echo json_encode(["success" => false, "message" => "Debes verificar tu cuenta antes de iniciar sesión."]);
            die();
        }

        if (!password_verify($password, $user["password"])) {
            echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
            die();
        }

        // 🔹 Guardar sesión correctamente
        $_SESSION["user_id"] = $user["codigo"];
        $_SESSION["user_name"] = $user["nombre_completo"];
        file_put_contents("debug_login.txt", "Sesión guardada en login.php:\n" . print_r($_SESSION, true));


        echo json_encode(["success" => true, "user" => $_SESSION["user_name"]]);
        die();
    }
?>
