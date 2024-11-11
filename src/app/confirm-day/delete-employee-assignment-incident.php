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

// Iniciar una transacción
$mysqli->begin_transaction();

try {
    // Consulta para eliminar el registro en employee_assignments
    $sqlAssignment = "DELETE FROM employee_assignments
                      WHERE employee_id = $employeeId
                        AND day_of_week = '$date'";
    $resultAssignment = $mysqli->query($sqlAssignment);

    // Consulta para eliminar la incidencia del mismo empleado en incidents
    $sqlIncident = "DELETE FROM incidents
                    WHERE employee_id = $employeeId
                      AND day_of_week = '$date'";
    $resultIncident = $mysqli->query($sqlIncident);

    // Verificar si ambas eliminaciones fueron exitosas
    if ($resultAssignment && $resultIncident) {
        $mysqli->commit();
        echo json_encode(['success' => true, 'message' => 'Asignación e incidencia eliminadas exitosamente.']);
    } else {
        throw new Exception('No se pudo eliminar la asignación o la incidencia.');
    }
} catch (Exception $e) {
    $mysqli->rollback();
    echo json_encode(['error' => $e->getMessage()]);
}

// Cerrar la conexión
$mysqli->close();
?>
