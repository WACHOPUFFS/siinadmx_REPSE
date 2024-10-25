<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión a la base de datos
require_once 'cors.php';  // Si tienes un archivo para manejar CORS
require_once 'conexion.php';  // Conexión a la base de datos usando MySQLi

// Obtener los datos de la solicitud
$payload = json_decode(file_get_contents('php://input'), true);

$companyId = $payload['company_id'];
$periodId = $payload['period_id'];
$periodTypeId = $payload['period_type_id']; // Obtener el period_type_id del payload
$dayOfWeek = $payload['day_of_week'];
$weekNumber = $payload['week_number'];
$confirmationDate = $payload['confirmation_date'];
$status = $payload['status']; // Cambiado de `confirmed` a `status`

// Verificar si se recibieron todos los parámetros necesarios
if (!isset($companyId, $periodId, $periodTypeId, $dayOfWeek, $weekNumber, $confirmationDate, $status)) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$companyId = intval($companyId);
$periodId = intval($periodId);
$periodTypeId = intval($periodTypeId); // Sanitizar period_type_id
$weekNumber = intval($weekNumber);
$status = $mysqli->real_escape_string($status); // Sanitizar `status`
$confirmationDate = $mysqli->real_escape_string($confirmationDate);
$dayOfWeek = $mysqli->real_escape_string($dayOfWeek);

// Verificar si el día ya está confirmado en la tabla `day_confirmations`
$checkSql = "SELECT status FROM day_confirmations 
             WHERE company_id = $companyId 
               AND period_id = $periodId 
               AND period_type_id = $periodTypeId
               AND day_of_week = '$dayOfWeek'
               AND week_number = $weekNumber 
               AND status = 'confirmed'";
$result = $mysqli->query($checkSql);

if ($result->num_rows > 0) {
    // Si el día ya está confirmado, no permitir otra confirmación
    echo json_encode(['error' => 'El día ya ha sido confirmado previamente y no puede confirmarse de nuevo.']);
    exit;
}

// Si el día no existe o no está confirmado, proceder a insertar un nuevo registro
$insertSql = "INSERT INTO day_confirmations 
              (company_id, period_id, period_type_id, day_of_week, week_number, confirmation_date, status, created_at)
              VALUES ($companyId, $periodId, $periodTypeId, '$dayOfWeek', $weekNumber, '$confirmationDate', '$status', NOW())";

if ($mysqli->query($insertSql)) {
    // Si la inserción fue exitosa, actualizar los registros de empleados
    $updateAssignmentsSql = "UPDATE employee_assignments 
                             SET project_status = '$status'
                             WHERE company_id = $companyId 
                               AND period_id = $periodId 
                               AND work_week = $weekNumber 
                               AND day_of_week = '$dayOfWeek'"; // Solo actualizar si el estado es `pending`
    if ($mysqli->query($updateAssignmentsSql)) {
        echo json_encode(['success' => 'Día confirmado exitosamente y registros de empleados actualizados.']);
    } else {
        echo json_encode(['error' => 'Error al actualizar los registros de empleados en employee_assignments.']);
    }
} else {
    echo json_encode(['error' => 'Error al insertar la confirmación del día.']);
}

// Cerrar la conexión con la base de datos
$mysqli->close();
