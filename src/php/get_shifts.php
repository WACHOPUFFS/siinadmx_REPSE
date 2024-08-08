<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';
// Verificar si se ha pasado el parámetro position_id
if (!isset($_GET['position_id'])) {
    echo json_encode(['error' => 'position_id parameter is required']);
    exit;
}

$position_id = intval($_GET['position_id']);

// Consulta SQL para obtener los turnos de un puesto específico
$sql = "SELECT shift_id, shift_name FROM shifts WHERE position_id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $position_id);
$stmt->execute();
$result = $stmt->get_result();

$shifts = array();

if ($result->num_rows > 0) {
    // Salida de datos de cada fila
    while($row = $result->fetch_assoc()) {
        $shifts[] = $row;
    }
} else {
    echo json_encode([]);
    exit;
}

echo json_encode($shifts);

$stmt->close();
$mysqli->close();
?>
