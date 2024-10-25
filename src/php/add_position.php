<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si se han pasado los datos necesarios
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['department_id']) || !isset($data['position_name'])) {
    echo json_encode(['error' => 'department_id and position_name are required']);
    exit;
}

$department_id = intval($data['department_id']);
$position_name = $data['position_name'];
$description = isset($data['description']) ? $data['description'] : '';

// Consulta SQL para insertar un nuevo puesto
$sql = "INSERT INTO positions (department_id, position_name, description) VALUES (?, ?, ?)";
$stmt = $mysqli->prepare($sql);

if ($stmt === false) {
    echo json_encode(['error' => 'Failed to prepare the SQL statement']);
    exit;
}

$stmt->bind_param("iss", $department_id, $position_name, $description);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Puesto añadido exitosamente']);
} else {
    echo json_encode(['error' => 'Failed to add position: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
