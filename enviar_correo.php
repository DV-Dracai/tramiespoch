<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require __DIR__ . '/vendor/autoload.php';

    require __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
    require __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';


    function enviarCorreo($correo, $codigo_verificacion) {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // 🔹 Puedes cambiar a Outlook o Yahoo
            $mail->SMTPAuth = true;
            $mail->Username = 'jonathanlizlizano8@gmail.com'; // 🔹 Tu correo
            $mail->Password = 'egke oozf dgzx gurf'; // 🔹 Tu contraseña o clave de aplicación
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Configuración del correo
            $mail->setFrom('tuemail@gmail.com', 'TramiESPOCH');
            $mail->addAddress($correo);
            $mail->Subject = "Verifica tu cuenta - TramiESPOCH";

            // 🔹 Enlace de verificación
            $enlace_verificacion = "http://localhost/TramiESPOCH/verificar.php?codigo=$codigo_verificacion";

            // 🔹 Contenido del correo
            $mail->Body = "Hola, <br><br> 
                        Para completar tu registro en <b>TramiESPOCH</b>, por favor verifica tu cuenta haciendo clic en el siguiente enlace:<br><br> 
                        <a href='$enlace_verificacion'>Verificar mi cuenta</a><br><br> 
                        Si no solicitaste este registro, ignora este mensaje.";
            $mail->isHTML(true); // 📌 Formato HTML para el enlace

            $mail->send();
            //return true; // 🔹 Devolver `true` si se envió correctamente
        } catch (Exception $e) {
            error_log("Error al enviar correo: {$mail->ErrorInfo}");
        }
    }
?>
