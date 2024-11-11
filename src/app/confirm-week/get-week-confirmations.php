<?php
header('Content-Type: application/json');

require_once 'cors.php';
require_once 'conexion.php';

// Obtener los parámetros de la URL
$companyId = $_GET['company_id'];
$periodId = $_GET['period_id']; // Ahora estamos usando period_id directamente

// Verificar que se recibieron todos los parámetros necesarios
if (!isset($companyId, $periodId)) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$companyId = intval($companyId);
$periodId = intval($periodId);

// Consulta para verificar si el período ya está confirmado
$sqlConfirm = "SELECT * FROM week_confirmations 
               WHERE company_id = $companyId 
                 AND period_id = $periodId";

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
