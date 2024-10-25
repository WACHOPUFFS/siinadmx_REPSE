<?php
header('Content-Type: application/json');

// Incluir archivos para CORS y conexión a la base de datos
require_once 'cors.php';
require_once 'conexion.php';

// Obtener los datos de la solicitud
$payload = json_decode(file_get_contents('php://input'), true);

// Extraer variables del payload
$companyId = $payload['company_id'];
$periodId = $payload['period_id'];
$periodTypeId = $payload['period_type_id'];
$weekNumber = $payload['week_number'];

// Verificar si se recibieron todos los parámetros necesarios
if (!isset($companyId, $periodId, $periodTypeId, $weekNumber)) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$companyId = intval($companyId);
$periodId = intval($periodId);
$periodTypeId = intval($periodTypeId);
$weekNumber = intval($weekNumber);

// Verificar si la semana ya está confirmada en la tabla `week_confirmations`
$checkSql = "SELECT * FROM week_confirmations 
             WHERE company_id = $companyId 
               AND period_id = $periodId 
               AND period_type_id = $periodTypeId
               AND week_number = $weekNumber";
$result = $mysqli->query($checkSql);

if ($result->num_rows > 0) {
    // Si la semana ya está confirmada, no permitir otra confirmación
    echo json_encode(['error' => 'La semana ya ha sido confirmada previamente y no puede confirmarse de nuevo.']);
    exit;
}

// Si la semana no está confirmada, proceder a insertar un nuevo registro
$insertSql = "INSERT INTO week_confirmations 
              (company_id, period_id, period_type_id, week_number, confirmed_at, created_at, updated_at) 
              VALUES ($companyId, $periodId, $periodTypeId, $weekNumber, NOW(), NOW(), NOW())";

if ($mysqli->query($insertSql)) {
    // Si la inserción fue exitosa, devolver una respuesta de éxito
    echo json_encode(['success' => 'Semana confirmada exitosamente.']);
} else {
    // Si hubo un error al insertar la confirmación de la semana
    echo json_encode(['error' => 'Error al confirmar la semana.']);
}

// Cerrar la conexión con la base de datos
$mysqli->close();
