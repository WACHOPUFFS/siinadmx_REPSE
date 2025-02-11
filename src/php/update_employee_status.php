<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Obtener los datos enviados desde el cliente
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se recibieron los datos necesarios
if (isset($data['employee_id']) && isset($data['status'])) {
  $employee_id = $data['employee_id'];
  $status = $data['status'];
  $employee_status = isset($data['employee_status']) ? $data['employee_status'] : null; // Verificar la existencia de employee_status

  // Actualizar el estado de la solicitud de empleado en la tabla employee_requests
  $query1 = "UPDATE employee_requests SET status = '$status' WHERE employee_id = $employee_id";

  // Ejecutar la primera consulta
  if ($mysqli->query($query1) === TRUE) {
    // Si la primera consulta fue exitosa, proceder con la segunda consulta
    if ($employee_status !== null) {
      // Actualizar employee_status en la tabla employees
      $query2 = "UPDATE employees SET employee_status = '$employee_status' WHERE employee_id = $employee_id";

      // Ejecutar la segunda consulta
      if ($mysqli->query($query2) === TRUE) {
        echo json_encode(['message' => 'Solicitud y estado de empleado actualizados exitosamente.']);
      } else {
        echo json_encode(['error' => 'Error al actualizar el estado de empleado: ' . $mysqli->error]);
      }
    } else {
      // Si no se proporciona employee_status, solo la primera consulta es exitosa
      echo json_encode(['message' => 'Solicitud actualizada exitosamente.']);
    }
  } else {
    echo json_encode(['error' => 'Error al actualizar la solicitud: ' . $mysqli->error]);
  }

  $mysqli->close();
} else {
  echo json_encode(['error' => 'Datos incompletos.']);
}
?>
