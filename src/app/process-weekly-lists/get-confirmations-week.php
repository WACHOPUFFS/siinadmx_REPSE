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

// Consulta para obtener las semanas confirmadas que NO han sido procesadas (is_processed = 0)
$sqlConfirmations = "SELECT * FROM week_confirmations 
                     WHERE company_id = $companyId 
                       AND period_type_id = $periodTypeId
                       AND is_processed = 0";  // Filtrar semanas no procesadas

$resultConfirmations = $mysqli->query($sqlConfirmations);

$confirmedWeeks = [];

// Verificar si se encontraron semanas confirmadas
if ($resultConfirmations->num_rows > 0) {
    while ($weekRow = $resultConfirmations->fetch_assoc()) {
        $periodId = intval($weekRow['period_id']);

        // Consultar los datos del periodo en payroll_periods
        $sqlPeriod = "SELECT * FROM payroll_periods WHERE period_id = $periodId";
        $resultPeriod = $mysqli->query($sqlPeriod);

        if ($resultPeriod->num_rows > 0) {
            $periodRow = $resultPeriod->fetch_assoc();

            // Añadir los datos del periodo al registro de la semana
            $weekRow['payroll_period'] = $periodRow;
        }

        $confirmedWeeks[] = $weekRow;
    }
}

// Devolver los resultados en formato JSON
echo json_encode($confirmedWeeks);

$mysqli->close();
?>
