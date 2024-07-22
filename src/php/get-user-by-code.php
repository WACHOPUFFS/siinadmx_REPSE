<?php
include_once 'cors.php';
// Incluir el archivo de conexión
include 'conexion.php';

// Leer datos de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

$userCode = $data['userCode'];

// Preparar y ejecutar consulta SQL para obtener el employee_id desde el código
$sqlGetEmployeeId = "SELECT employee_id FROM employee_codes WHERE code = ?";
$stmtGetEmployeeId = $mysqli->prepare($sqlGetEmployeeId);

if ($stmtGetEmployeeId === false) {
    header('Content-Type: application/json');
    echo json_encode(array("error" => "Error en la preparación de la consulta: " . $mysqli->error));
    exit();
}

$stmtGetEmployeeId->bind_param("s", $userCode);
$stmtGetEmployeeId->execute();
$resultGetEmployeeId = $stmtGetEmployeeId->get_result();

$response = [];

if ($resultGetEmployeeId->num_rows > 0) {
    $employeeIdRow = $resultGetEmployeeId->fetch_assoc();
    $employeeId = $employeeIdRow['employee_id'];

    // Preparar y ejecutar consulta SQL para obtener el usuario por employee_id
    $sqlGetUser = "SELECT * FROM users WHERE id = ?";
    $stmtGetUser = $mysqli->prepare($sqlGetUser);

    if ($stmtGetUser === false) {
        header('Content-Type: application/json');
        echo json_encode(array("error" => "Error en la preparación de la consulta: " . $mysqli->error));
        exit();
    }

    $stmtGetUser->bind_param("s", $employeeId);
    $stmtGetUser->execute();
    $resultGetUser = $stmtGetUser->get_result();

    if ($resultGetUser->num_rows > 0) {
        $user = $resultGetUser->fetch_assoc();
        $response['success'] = true;
        $response['user'] = $user;
    } else {
        $response['success'] = false;
        $response['error'] = "Usuario no encontrado.";
    }

    $stmtGetUser->close();
} else {
    $response['success'] = false;
    $response['error'] = "Código de usuario no encontrado.";
}

$stmtGetEmployeeId->close();
$mysqli->close();

// Devolver respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
