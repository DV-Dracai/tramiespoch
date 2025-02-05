<?php
    include 'coneccion.php'; // Aseguramos la conexión a la BD

    header('Content-Type: application/json');

    $sql = "SELECT nombre FROM tipotramite";
    $result = $conn->query($sql);

    $tramites = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $tramites[] = $row['nombre'];
        }
    }

    echo json_encode($tramites);
    $conn->close();
?>
