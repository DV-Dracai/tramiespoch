<?php
include 'coneccion.php';
header('Content-Type: application/json');


if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "No hay usuario en sesión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $_SESSION['user_id'];
$tipo_tramite = $data['tipo_tramite'] ?? null;
$descripcion = $data['descripcion'] ?? null;
$destinatario_nombre = $data['destinatario_nombre'] ?? null;
$fecha_tramite = $data['fecha_tramite'] ?? date('Y-m-d'); // ✅ Usa la fecha del trámite o la actual si no se envía

if (!$tipo_tramite || !$descripcion || !$destinatario_nombre) {
    echo json_encode(["error" => "Faltan datos para guardar el trámite"]);
    exit;
}

// 🔥 Activar mensajes de error de MySQL para depuración
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Obtener ID del tipo de trámite
    $sql_tipo = "SELECT id FROM tipotramite WHERE nombre = ?";
    $stmt_tipo = $conn->prepare($sql_tipo);
    $stmt_tipo->bind_param("s", $tipo_tramite);
    $stmt_tipo->execute();
    $result_tipo = $stmt_tipo->get_result();
    $row_tipo = $result_tipo->fetch_assoc();
    $tipo_tramite_id = $row_tipo['id'] ?? null;

    // Obtener ID del destinatario
    $sql_dest = "SELECT id FROM destinatario WHERE nombre = ?";
    $stmt_dest = $conn->prepare($sql_dest);
    $stmt_dest->bind_param("s", $destinatario_nombre);
    $stmt_dest->execute();
    $result_dest = $stmt_dest->get_result();
    $row_dest = $result_dest->fetch_assoc();
    $destinatario_id = $row_dest['id'] ?? null;

    if (!$tipo_tramite_id || !$destinatario_id) {
        echo json_encode(["error" => "No se encontraron IDs para el trámite o destinatario", "tipo_tramite" => $tipo_tramite, "destinatario" => $destinatario_nombre]);
        exit;
    }

    // Insertar el trámite con la fecha del trámite proporcionada
    $sql = "INSERT INTO tramite (descripcion, fecha_envio, estudiante_id, tipo_tramite_id, destinatario_id) 
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $descripcion, $fecha_tramite, $user_id, $tipo_tramite_id, $destinatario_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Trámite guardado exitosamente"]);
    } else {
        echo json_encode(["error" => "No se pudo guardar el trámite", "mysqli_error" => $stmt->error]);
    }

    // Cerrar conexiones
    $stmt->close();
    $stmt_tipo->close();
    $stmt_dest->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(["error" => "Excepción en la BD", "message" => $e->getMessage()]);
}
?>
