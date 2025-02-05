<?php
    include('coneccion.php');

    if (isset($_GET['codigo'])) {
        $codigo_verificacion = $_GET['codigo'];

        // Buscar usuario con ese código
        $query = "SELECT * FROM estudiante WHERE codigo_verificacion = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $codigo_verificacion);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Activar la cuenta
            $updateQuery = "UPDATE estudiante SET verificado = 1, codigo_verificacion = NULL WHERE codigo_verificacion = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param("s", $codigo_verificacion);

            if ($stmt->execute()) {
                echo "✅ Cuenta verificada con éxito. Ahora puedes iniciar sesión.";
            } else {
                echo "⚠️ Error al verificar la cuenta.";
            }
        } else {
            echo "❌ Código de verificación inválido o la cuenta ya ha sido verificada.";
        }
    }
?>


