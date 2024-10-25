<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si se ha pasado el parámetro department_id
if (!isset($_GET['department_id'])) {
    echo json_encode(['error' => 'department_id parameter is required']);
    exit;
}

$department_id = intval($_GET['department_id']);

// Consulta SQL para obtener los puestos de un departamento específico
$sql = "SELECT * FROM positions WHERE department_id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $department_id);
$stmt->execute();
$result = $stmt->get_result();

$positions = array();

if ($result->num_rows > 0) {
    // Salida de datos de cada fila
    while($row = $result->fetch_assoc()) {
        $positions[] = $row;
    }
} else {
    echo json_encode([]);
    exit;
}

echo json_encode($positions);

$stmt->close();
$mysqli->close();
?>
