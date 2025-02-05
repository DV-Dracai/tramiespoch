<?php
    include 'coneccion.php';
    header('Content-Type: application/json');
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // ✅ Evitar doble session_start()
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // 📌 Depuración: Verificar si hay usuario en sesión
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "No hay usuario en sesión"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    // 📌 Depuración: Ver qué datos está recibiendo PHP
    file_put_contents("log_guardar_tramite.txt", print_r($data, true), FILE_APPEND);

    $user_id = $_SESSION['user_id'];
    $tipo_tramite = $data['tipo_tramite'] ?? null;
    $descripcion = $data['descripcion'] ?? null;
    $destinatario_nombre = $data['destinatario_nombre'] ?? null;
    $fecha_tramite = $data['fecha_tramite'] ?? date('Y-m-d'); // Usa la fecha enviada o la del día

    // 📌 Depuración: Verificar valores recibidos antes de continuar
    if (!$tipo_tramite || !$descripcion || !$destinatario_nombre) {
        echo json_encode(["error" => "Faltan datos para guardar el trámite", "data" => $data]);
        exit;
    }

    // Obtener ID del tipo de trámite
    $sql_tipo = "SELECT id FROM tipotramite WHERE nombre = ?";
    $stmt_tipo = $conn->prepare($sql_tipo);
    $stmt_tipo->bind_param("s", $tipo_tramite);
    $stmt_tipo->execute();
    $result_tipo = $stmt_tipo->get_result();
    $row_tipo = $result_tipo->fetch_assoc();
    $tipo_tramite_id = $row_tipo ? $row_tipo['id'] : null;

    // Obtener ID del destinatario
    $sql_dest = "SELECT id FROM destinatario WHERE nombre = ?";
    $stmt_dest = $conn->prepare($sql_dest);
    $stmt_dest->bind_param("s", $destinatario_nombre);
    $stmt_dest->execute();
    $result_dest = $stmt_dest->get_result();
    $row_dest = $result_dest->fetch_assoc();
    $destinatario_id = $row_dest ? $row_dest['id'] : null;

    if (!$tipo_tramite_id || !$destinatario_id) {
        echo json_encode(["error" => "No se encontraron IDs para el trámite o destinatario"]);
        exit;
    }

    // Insertar el trámite con la fecha correcta
    $sql = "INSERT INTO tramite (descripcion, fecha_envio, estudiante_id, tipo_tramite_id, destinatario_id) 
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $descripcion, $fecha_tramite, $user_id, $tipo_tramite_id, $destinatario_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Trámite guardado exitosamente"]);
    } else {
        echo json_encode(["error" => "No se pudo guardar el trámite", "sql_error" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
?>
