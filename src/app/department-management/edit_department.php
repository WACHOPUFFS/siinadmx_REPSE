<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si se han pasado los datos necesarios
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['company_id']) || !isset($data['department_name']) || !isset($data['department_id'])) {
    echo json_encode(['error' => 'company_id, department_name and department_id are required']);
    exit;
}

$department_id = intval($data['department_id']);
$company_id = intval($data['company_id']);
$department_name = $data['department_name'];
$description = isset($data['description']) ? $data['description'] : '';

// Consulta SQL para actualizar un departamento existente
$sql = "UPDATE departments SET department_name = ?, description = ? WHERE department_id = ? AND company_id = ?";
$stmt = $mysqli->prepare($sql);

if ($stmt === false) {
    echo json_encode(['error' => 'Failed to prepare the SQL statement']);
    exit;
}

$stmt->bind_param("ssii", $department_name, $description, $department_id, $company_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Departamento actualizado exitosamente']);
} else {
    echo json_encode(['error' => 'Failed to update department: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
