<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Asegura que PHPMailer esté cargado

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Puedes cambiarlo a Outlook o Yahoo
    $mail->SMTPAuth = true;
    $mail->Username = 'jonathanlizlizano8@gmail.com'; // 🔹 Tu correo
    $mail->Password = 'egke oozf dgzx gurf'; // 🔹 Tu contraseña o clave de aplicación
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Configuración del correo
    $mail->setFrom('tuemail@gmail.com', 'TramiESPOCH');
    $mail->addAddress('jhonaliz2405@gmail.com');
    $mail->Subject = 'Prueba de PHPMailer';
    $mail->Body = 'Si ves este correo, PHPMailer está funcionando correctamente.';
    $mail->isHTML(true);

    $mail->send();
    echo "✅ Correo enviado correctamente.";
} catch (Exception $e) {
    echo "❌ Error al enviar el correo: {$mail->ErrorInfo}";
}
?>
