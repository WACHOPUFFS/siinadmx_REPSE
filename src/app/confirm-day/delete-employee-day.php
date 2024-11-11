<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión y habilitar CORS
require_once 'cors.php';
require_once 'conexion.php';

// Obtener los datos enviados en el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);
$employeeId = $data['employee_id'];
$date = $data['date'];

// Verificar que se recibieron los parámetros necesarios
if (!isset($employeeId, $date)) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$employeeId = intval($employeeId);
$date = $mysqli->real_escape_string($date);

// Consulta para eliminar el registro de asignación de empleado para el día especificado
$sql = "DELETE FROM employee_assignments
        WHERE employee_id = $employeeId
          AND day_of_week = '$date'";

$result = $mysqli->query($sql);

// Verificar si la eliminación fue exitosa
if ($result && $mysqli->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Empleado eliminado exitosamente.']);
} else {
    echo json_encode(['error' => 'No se pudo eliminar el empleado o no se encontró el registro.']);
}

// Cerrar la conexión
$mysqli->close();
?>
