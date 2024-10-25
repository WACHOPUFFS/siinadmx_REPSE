<?php
// Mostrar todos los errores para facilitar la depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Establecer el tipo de contenido como JSON
header('Content-Type: application/json');

// Incluir el archivo de conexión y habilitar CORS
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Only POST is allowed.']);
    exit;
}

// Obtener y decodificar los datos JSON de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si la decodificación fue exitosa
if (!$data) {
    echo json_encode(['error' => 'Invalid input. No data received.']);
    exit;
}

// Verificar que todos los campos necesarios están presentes
if (!isset($data['employee_id'], $data['period_id'], $data['day_of_week'], $data['work_week'], $data['incident_type'])) {
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

// Extraer datos de la solicitud
$employee_id = intval($data['employee_id']);
$period_id = intval($data['period_id']);
$day_of_week = $mysqli->real_escape_string($data['day_of_week']);
$work_week = $mysqli->real_escape_string($data['work_week']);
$incident_type = $mysqli->real_escape_string($data['incident_type']);
$description = isset($data['description']) ? $mysqli->real_escape_string($data['description']) : null;

// Iniciar una transacción para insertar el registro de incidencia
$mysqli->begin_transaction();

try {
    // Construir la consulta SQL para insertar la incidencia
    $sql = "
        INSERT INTO incidents 
        (employee_id, period_id, day_of_week, work_week, incident_type, description, created_at)
        VALUES 
        (
            $employee_id, 
            $period_id, 
            '$day_of_week', 
            '$work_week', 
            '$incident_type', 
            " . ($description ? "'$description'" : "NULL") . ",
            NOW()
        )";

    // Ejecutar la consulta
    if (!$mysqli->query($sql)) {
        throw new Exception('Error al insertar la incidencia: ' . $mysqli->error);
    }

    // Confirmar la transacción
    $mysqli->commit();
    // Enviar la respuesta JSON válida
    echo json_encode(['success' => true, 'message' => 'Incidencia guardada exitosamente.']);

} catch (Exception $e) {
    // Si hay un error, revertir la transacción
    $mysqli->rollback();
    echo json_encode(['error' => 'Failed to save incident: ' . $e->getMessage()]);
}

// Cerrar la conexión
$mysqli->close();
