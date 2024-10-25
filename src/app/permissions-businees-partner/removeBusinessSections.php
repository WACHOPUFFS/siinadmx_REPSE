<?php
include_once 'cors.php';
include_once 'conexion.php';

// Obtener los datos enviados en la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Verificar que los campos necesarios se hayan proporcionado
if  (isset($data['businessPartnerId']) && isset($data['section'])) {
    // Escapar las entradas para evitar inyección SQL
    $businessPartnerId = $mysqli->real_escape_string($data['businessPartnerId']);
    $section = $mysqli->real_escape_string($data['section']);
    

    // Query para eliminar la sección correspondiente
    $deleteQuery = "DELETE FROM business_partner_sections WHERE association_id = '$businessPartnerId' AND name_section = '$section'";

    if ($mysqli->query($deleteQuery)) {
        // Si la eliminación fue exitosa
        echo json_encode(array("success" => true));
    } else {
        // Si hubo un error al eliminar
        echo json_encode(array("success" => false, "error" => "Error al eliminar la sección: " . $mysqli->error));
    }
} else {
    // Si faltan datos en la solicitud
    echo json_encode(array("success" => false, "error" => "No se proporcionaron los datos necesarios en la solicitud."));
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
