<?php
header('Content-Type: application/json');

require_once 'cors.php';
require_once 'conexion.php';

// Obtener los datos del cuerpo de la solicitud
$input = json_decode(file_get_contents('php://input'), true);

$weekNumber = $input['week_number'] ?? null;
$companyId = $input['company_id'] ?? null;
$periodTypeId = $input['period_type_id'] ?? null;
$startDate = $input['start_date'] ?? null;
$endDate = $input['end_date'] ?? null;

// Verificar que se recibieron todos los datos necesarios
if (!$weekNumber || !$companyId || !$periodTypeId || !$startDate || !$endDate) {
    echo json_encode(['error' => 'Faltan datos necesarios para procesar la semana.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$weekNumber = intval($weekNumber);
$companyId = intval($companyId);
$periodTypeId = intval($periodTypeId);
$startDate = $mysqli->real_escape_string($startDate);
$endDate = $mysqli->real_escape_string($endDate);

// Verificar si la semana ya ha sido procesada
$checkQuery = "SELECT is_processed FROM week_confirmations WHERE week_number = $weekNumber AND company_id = $companyId AND period_type_id = $periodTypeId";
$checkResult = $mysqli->query($checkQuery);

if ($checkResult && $checkResult->num_rows > 0) {
    $row = $checkResult->fetch_assoc();
    if ($row['processed']) {
        echo json_encode(['error' => 'La semana ya ha sido procesada.']);
        exit;
    }
}

// Marcar la semana como procesada
$updateQuery = "UPDATE week_confirmations SET is_processed = 1 WHERE week_number = $weekNumber AND company_id = $companyId AND period_type_id = $periodTypeId";
if ($mysqli->query($updateQuery)) {
    // Insertar la semana en la tabla weeks_processed
    $insertQuery = "INSERT INTO weeks_processed (week_number, company_id, period_type_id, start_date, end_date) VALUES ($weekNumber, $companyId, $periodTypeId, '$startDate', '$endDate')";

    if ($mysqli->query($insertQuery)) {
        echo json_encode(['success' => 'Semana procesada exitosamente.']);
    } else {
        echo json_encode(['error' => 'Error al insertar en la tabla weeks_processed: ' . $mysqli->error]);
    }
} else {
    echo json_encode(['error' => 'Error al actualizar la semana como procesada: ' . $mysqli->error]);
}

$mysqli->close();
?>