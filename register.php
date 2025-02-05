<?php
    include('coneccion.php');
    require 'enviar_correo.php'; // Asegurar que incluimos la función de enviar correo

    require __DIR__ . '/vendor/autoload.php';
    ob_clean(); // ❌ Limpia cualquier salida previa al JSON
    header("Content-Type: application/json"); // Asegurar que la salida es JSON


    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Intentar recibir los datos en JSON o en $_POST
        $raw_input = file_get_contents("php://input");
        $data = json_decode($raw_input, true);
    
        
        /* $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            $data = $_POST; // Usar $_POST si JSON no se recibió
        }*/

        if (!$data) {
            echo json_encode(["success" => false, "message" => "Error al recibir los datos."]);
            die();
        }

        // Sanitizar los datos recibidos
        $id_estudiante = mysqli_real_escape_string($conn, $data["id_estudiante"]);
        $nombre = mysqli_real_escape_string($conn, $data["nombre"]);
        $correo = mysqli_real_escape_string($conn, $data["correo"]);
        $password = password_hash($data["password"], PASSWORD_DEFAULT); // Hashear la contraseña
        $cedula = mysqli_real_escape_string($conn, $data["cedula"]);
        $carrera_id = 1; // Ajustar si se obtiene dinámicamente
        $codigo_verificacion = md5(uniqid(rand(), true)); // Generar código de verificación

        // Verificar si el usuario ya existe
        $checkQuery = "SELECT * FROM estudiante WHERE codigo = ? OR correo = ?";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bind_param("ss", $id_estudiante, $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "El usuario ya está registrado."]);
            die(); // 🔹 IMPORTANTE: Asegurar que el script termina aquí
        }

    // Insertar usuario en la BD
        $query = "INSERT INTO estudiante (codigo, nombre_completo, cedula, correo, password, carrera_id, verificado, codigo_verificacion) 
                VALUES (?, ?, ?, ?, ?, ?, 0, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssssss", $id_estudiante, $nombre, $cedula, $correo, $password, $carrera_id, $codigo_verificacion);

        if ($stmt->execute()) {
            enviarCorreo($correo, $codigo_verificacion);
            echo json_encode(["success" => true, "message" => "Registro exitoso. Revisa tu correo para verificar tu cuenta."]);
            die();
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar en la base de datos."]);
            die();
        }
    }
?>
