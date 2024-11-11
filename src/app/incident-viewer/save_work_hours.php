<?php
// Mostrar todos los errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Establecer el tipo de contenido a JSON
header('Content-Type: application/json');

// Incluir conexión y habilitar CORS
require_once 'cors.php';
require_once 'conexion.php';

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Only POST is allowed.']);
    exit;
}

// Decodificar los datos JSON de entrada
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si la decodificación fue exitosa
if (!$data) {
    echo json_encode(['error' => 'Invalid input. No data received.']);
    exit;
}

// Validar campos obligatorios
if (!isset(
    $data['employee_id'], 
    $data['period_id'], 
    $data['day_of_week'], 
    $data['work_week'],
    $data['entry_time'],
    $data['lunch_start_time'],
    $data['lunch_end_time'],
    $data['exit_time']
)) {
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

// Extraer campos
$employee_id = intval($data['employee_id']);
$period_id = intval($data['period_id']);
$day_of_week = $mysqli->real_escape_string($data['day_of_week']);
$work_week = $mysqli->real_escape_string($data['work_week']);
$entry_time = $mysqli->real_escape_string($data['entry_time']);
$lunch_start_time = $mysqli->real_escape_string($data['lunch_start_time']);
$lunch_end_time = $mysqli->real_escape_string($data['lunch_end_time']);
$exit_time = $mysqli->real_escape_string($data['exit_time']);

// Verificar si la segunda hora de comida está presente y escapar
$second_lunch_start_time = isset($data['second_lunch_start_time']) ? $mysqli->real_escape_string($data['second_lunch_start_time']) : null;
$second_lunch_end_time = isset($data['second_lunch_end_time']) ? $mysqli->real_escape_string($data['second_lunch_end_time']) : null;

// Construir la consulta SQL para insertar las horas de trabajo, incluyendo la segunda hora de comida si está presente
$sql = "
    INSERT INTO work_hours 
    (employee_id, period_id, day_of_week, work_week, entry_time, lunch_start_time, lunch_end_time, exit_time, second_lunch_start_time, second_lunch_end_time, created_at)
    VALUES 
    (
        $employee_id, 
        $period_id, 
        '$day_of_week', 
        '$work_week', 
        '$entry_time', 
        '$lunch_start_time', 
        '$lunch_end_time', 
        '$exit_time',
        " . ($second_lunch_start_time ? "'$second_lunch_start_time'" : "NULL") . ",
        " . ($second_lunch_end_time ? "'$second_lunch_end_time'" : "NULL") . ",
        NOW()
    )
";

// Ejecutar la consulta
if ($mysqli->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Work hours saved successfully.']);
} else {
    echo json_encode(['error' => 'Failed to save work hours: ' . $mysqli->error]);
}

// Cerrar la conexión
$mysqli->close();
?>
