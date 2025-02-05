<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Content-Type: application/json");

    include ('coneccion.php'); // Incluir conexión a la base de datos

    // Verificar si la solicitud es POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Obtener los datos JSON enviados desde el frontend
        $data = json_decode(file_get_contents("php://input"), true);

        if (!empty($data['name']) && !empty($data['email'])) {
            $name = $conn->real_escape_string($data['name']);
            $email = $conn->real_escape_string($data['email']);
            $career_id = 1; // Fijar ID de carrera en 1 (Software en FIE)

            // Validar si el estudiante ya existe
            $checkQuery = "SELECT * FROM estudiante WHERE correo_institucional = '$email'";
            $result = $conn->query($checkQuery);

            if ($result->num_rows > 0) {
                echo json_encode(["status" => "exists", "message" => "El estudiante ya está registrado."]);
            } else {
                // Insertar en la base de datos
                $query = "INSERT INTO estudiante (nombre_completo, correo_institucional, carrera_id) 
                        VALUES ('$name', '$email', '$career_id')";
                if ($conn->query($query) === TRUE) {
                    echo json_encode(["status" => "success", "message" => "Estudiante registrado correctamente."]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Error al guardar: " . $conn->error]);
                }
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    }
?>
