<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si se han pasado los datos necesarios
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['position_id']) || !isset($data['shift_name']) || !isset($data['start_time']) || !isset($data['end_time'])) {
    echo json_encode(['error' => 'position_id, shift_name, start_time, and end_time are required']);
    exit;
}

$position_id = intval($data['position_id']);
$shift_name = $data['shift_name'];
$description = isset($data['description']) ? $data['description'] : '';
$start_time = $data['start_time'];
$end_time = $data['end_time'];

// Consulta SQL para insertar un nuevo turno
$sql = "INSERT INTO shifts (position_id, shift_name, description, start_time, end_time) VALUES (?, ?, ?, ?, ?)";
$stmt = $mysqli->prepare($sql);

if ($stmt === false) {
    echo json_encode(['error' => 'Failed to prepare the SQL statement']);
    exit;
}

$stmt->bind_param("issss", $position_id, $shift_name, $description, $start_time, $end_time);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Turno añadido exitosamente']);
} else {
    echo json_encode(['error' => 'Failed to add shift: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
