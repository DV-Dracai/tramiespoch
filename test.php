<?php
    include('coneccion.php');

    if ($conn) {
        echo "✅ Conexión exitosa a la base de datos.";
    } else {
        echo "❌ Error al conectar: " . mysqli_connect_error();
    }
?>
