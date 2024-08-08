<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Obtener los datos enviados desde el cliente
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['employee_id']) && isset($data['status'])) {
  $employee_id = $data['employee_id'];
  $status = $data['status'];

  // Actualizar el estado de la solicitud de empleado
  $query = "UPDATE employee_requests SET status = '$status' WHERE employee_id = $employee_id";

  if ($mysqli->query($query) === TRUE) {
    echo json_encode(['message' => 'Solicitud actualizada exitosamente.']);
  } else {
    echo json_encode(['error' => 'Error al actualizar la solicitud: ' . $mysqli->error]);
  }

  $mysqli->close();
} else {
  echo json_encode(['error' => 'Datos incompletos.']);
}
?>
