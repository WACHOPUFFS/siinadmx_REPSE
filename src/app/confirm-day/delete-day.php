<?php
// Incluir el archivo de conexión y CORS
require_once 'cors.php';  // Si tienes un archivo para manejar CORS
require_once 'conexion.php';  // Conexión a la base de datos usando MySQLi

header('Content-Type: application/json');

// Verificar si se ha proporcionado el ID de la asignación (assignment_id)
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['assignment_id'])) {
    echo json_encode(['error' => 'Falta el parámetro assignment_id']);
    exit();
}

$assignment_id = $mysqli->real_escape_string($data['assignment_id']);

// Realizar la consulta para eliminar el registro en employee_assignments
$query_delete = "DELETE FROM employee_assignments WHERE assignment_id = '$assignment_id'";

if ($mysqli->query($query_delete)) {
    echo json_encode(['success' => 'Registro eliminado exitosamente']);
} else {
    echo json_encode(['error' => 'Error al eliminar el registro']);
}

// Cerrar conexión
$mysqli->close();
?>
