<?php
include_once 'cors.php';
include_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['companyId']) && isset($data['section'])) {
    $companyId = $mysqli->real_escape_string($data['companyId']);
    $section = $mysqli->real_escape_string($data['section']);

    $query = "DELETE FROM sections WHERE company_id = '$companyId' AND NameSection = '$section'";

    if ($mysqli->query($query)) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false, "error" => "Error al ejecutar la consulta: " . $mysqli->error));
    }
} else {
    echo json_encode(array("success" => false, "error" => "No se proporcionaron los datos necesarios en la solicitud."));
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
