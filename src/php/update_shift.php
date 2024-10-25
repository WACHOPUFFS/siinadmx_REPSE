<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si se han pasado los datos necesarios
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['shift_id']) || !isset($data['shift_name']) || !isset($data['start_time']) || !isset($data['end_time'])) {
    echo json_encode(['error' => 'shift_id, shift_name, start_time, and end_time are required']);
    exit;
}

$shift_id = intval($data['shift_id']);
$shift_name = $data['shift_name'];
$description = isset($data['description']) ? $data['description'] : '';
$start_time = $data['start_time'];
$end_time = $data['end_time'];

// Consulta SQL para actualizar el turno
$sql = "UPDATE shifts SET shift_name = ?, description = ?, start_time = ?, end_time = ? WHERE shift_id = ?";
$stmt = $mysqli->prepare($sql);

if ($stmt === false) {
    echo json_encode(['error' => 'Failed to prepare the SQL statement']);
    exit;
}

$stmt->bind_param("ssssi", $shift_name, $description, $start_time, $end_time, $shift_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Turno actualizado exitosamente']);
    } else {
        echo json_encode(['error' => 'No se encontró ningún turno con ese ID o no hubo cambios en los datos']);
    }
} else {
    echo json_encode(['error' => 'Failed to update shift: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
