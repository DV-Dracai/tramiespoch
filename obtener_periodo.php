<?php
    include 'coneccion.php';
    header('Content-Type: application/json');

    $sql = "SELECT descripcion AS periodo_academico FROM periodo ORDER BY codigo DESC LIMIT 1";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "No se encontró ningún periodo académico."]);
    }

    $conn->close();
?>
