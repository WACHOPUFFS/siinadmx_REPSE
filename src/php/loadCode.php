<?php

// Incluir la configuración de la base de datos
include_once 'cors.php'; // Asegúrate de tener configurado correctamente CORS para permitir solicitudes desde tu frontend
include_once 'conexion.php'; // Incluye tu archivo de conexión a la base de datos

// Obtener los datos del cuerpo de la solicitud POST en formato JSON
$json = file_get_contents('php://input');

// Decodificar los datos JSON en un array asociativo
$data = json_decode($json, true);

// Verificar si se recibió el ID de usuario en la solicitud
if (isset($data['idUsuario'])) {
    // Obtener y sanitizar el ID de usuario de la solicitud
    $idUsuario = intval($data['idUsuario']);

    // Consulta SQL para verificar si el usuario ya tiene un código asignado
    $sql_check = "SELECT * FROM usersCodes WHERE userId = ?";
    $stmt_check = $mysqli->prepare($sql_check);
    $stmt_check->bind_param("i", $idUsuario);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        // Si el usuario ya tiene un código asignado, actualizar el código
        $codigoUnico = uniqid();
        $sql_update = "UPDATE usersCodes SET code = ? WHERE userId = ?";
        $stmt_update = $mysqli->prepare($sql_update);
        $stmt_update->bind_param("si", $codigoUnico, $idUsuario);

        // Ejecutar la consulta SQL de actualización
        if ($stmt_update->execute()) {
            // Enviar el nuevo código del usuario como respuesta al cliente
            $response = array("success" => true, "codigoUsuario" => $codigoUnico);
            echo json_encode($response);
        } else {
            // Error al actualizar el código, enviar respuesta de error al cliente
            $response = array("success" => false, "message" => "Error al actualizar el código: " . $stmt_update->error);
            echo json_encode($response);
        }
        $stmt_update->close();
    } else {
        // Si el usuario no tiene un código asignado, generar uno nuevo y guardarlo
        $codigoUnico = uniqid();
        $sql_insert = "INSERT INTO usersCodes (userId, code) VALUES (?, ?)";
        $stmt_insert = $mysqli->prepare($sql_insert);
        $stmt_insert->bind_param("is", $idUsuario, $codigoUnico);

        // Ejecutar la consulta SQL de inserción
        if ($stmt_insert->execute()) {
            // Enviar el código del usuario como respuesta al cliente
            $response = array("success" => true, "codigoUsuario" => $codigoUnico);
            echo json_encode($response);
        } else {
            // Error al insertar el código, enviar respuesta de error al cliente
            $response = array("success" => false, "message" => "Error al generar y guardar el código único: " . $stmt_insert->error);
            echo json_encode($response);
        }
        $stmt_insert->close();
    }
    $stmt_check->close();
} else {
    // Enviar una respuesta de error si no se recibió el ID de usuario en la solicitud
    $response = array("success" => false, "message" => "No se proporcionó el ID de usuario en la solicitud.");
    echo json_encode($response);
}

// Cerrar la conexión a la base de datos
$mysqli->close();

?>
