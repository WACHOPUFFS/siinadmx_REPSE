<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si se han pasado los datos necesarios
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['position_id']) || !isset($data['position_name'])) {
    echo json_encode(['error' => 'position_id and position_name are required']);
    exit;
}

$position_id = intval($data['position_id']);
$position_name = $mysqli->real_escape_string($data['position_name']);
$description = isset($data['description']) ? $mysqli->real_escape_string($data['description']) : '';

// Consulta SQL para actualizar el puesto
$sql = "UPDATE positions SET position_name = '$position_name', description = '$description' WHERE position_id = $position_id";

if ($mysqli->query($sql)) {
    if ($mysqli->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Puesto actualizado exitosamente']);
    } else {
        echo json_encode(['error' => 'No se encontró ningún puesto con ese ID o no hubo cambios en los datos']);
    }
} else {
    echo json_encode(['error' => 'Failed to update position: ' . $mysqli->error]);
}

$mysqli->close();
?>
