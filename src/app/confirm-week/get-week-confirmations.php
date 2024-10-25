<?php
header('Content-Type: application/json');

require_once 'cors.php';
require_once 'conexion.php';

// Obtener los parámetros de la URL
$companyId = $_GET['company_id'];
$periodTypeId = $_GET['period_type_id']; // Cambiar period_id a period_type_id
$weekNumber = $_GET['week_number'];

// Verificar que se recibieron todos los parámetros necesarios
if (!isset($companyId, $periodTypeId, $weekNumber)) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$companyId = intval($companyId);
$periodTypeId = intval($periodTypeId); // Cambiar periodId a periodTypeId
$weekNumber = intval($weekNumber);

// Consulta para verificar si la semana ya está confirmada
$sqlConfirm = "SELECT * FROM week_confirmations 
               WHERE company_id = $companyId 
                 AND period_type_id = $periodTypeId 
                 AND week_number = $weekNumber";

$resultConfirm = $mysqli->query($sqlConfirm);

$weekConfirmed = [];

// Verificar si se encontraron resultados
if ($resultConfirm->num_rows > 0) {
    while ($row = $resultConfirm->fetch_assoc()) {
        $weekConfirmed[] = $row;
    }
}

// Devolver los resultados en formato JSON
echo json_encode($weekConfirmed);

$mysqli->close();
?>
