<?php
    include 'coneccion.php';
    header('Content-Type: application/json');
    ob_clean(); // Limpia cualquier salida previa
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "No hay usuario en sesión"]);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    // ✅ Consulta mejorada para obtener el PERÍODO ACADÉMICO correctamente
    $sql = "SELECT 
                e.nombre_completo AS nombre, 
                e.cedula, 
                c.nombre_carrera AS carrera,
                (SELECT p.descripcion 
                 FROM periodo p
                 JOIN carreraperiodo cp ON p.codigo = cp.periodo_id
                 WHERE cp.carrera_id = e.carrera_id
                 ORDER BY p.codigo DESC 
                 LIMIT 1) AS periodo_academico
            FROM estudiante e
            JOIN carrera c ON e.carrera_id = c.codigo
            WHERE e.codigo = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user_id); // 🔹 Solo necesita el ID del estudiante
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "No se encontraron datos del usuario."]);
    }

    $stmt->close();
    $conn->close();
?>
