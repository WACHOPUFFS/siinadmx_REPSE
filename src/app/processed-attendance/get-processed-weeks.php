<?php
header('Content-Type: application/json');

require_once 'cors.php';
require_once 'conexion.php';

// Obtener los parámetros de la URL
$companyId = $_GET['company_id'];
$periodTypeId = $_GET['period_type_id'];

// Verificar que se recibieron todos los parámetros necesarios
if (!isset($companyId, $periodTypeId)) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$companyId = intval($companyId);
$periodTypeId = intval($periodTypeId);

// Consulta para obtener las semanas procesadas que no han sido confirmadas (is_processed = 0)
$sqlProcessedWeeks = "SELECT * FROM weeks_processed 
                      WHERE company_id = $companyId 
                        AND period_type_id = $periodTypeId
                        AND is_processed = 0";

$resultProcessedWeeks = $mysqli->query($sqlProcessedWeeks);

$processedWeeks = [];

// Verificar si se encontraron semanas procesadas no confirmadas
if ($resultProcessedWeeks->num_rows > 0) {
    while ($weekRow = $resultProcessedWeeks->fetch_assoc()) {
        // Añadir la semana procesada a la lista de resultados
        $processedWeeks[] = $weekRow;
    }
}

// Devolver los resultados en formato JSON
echo json_encode($processedWeeks);

$mysqli->close();
?>
