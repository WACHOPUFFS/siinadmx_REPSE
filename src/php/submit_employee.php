<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

// Obtener los datos del formulario
$data = json_decode(file_get_contents("php://input"), true);

// Depuración: Imprimir los datos recibidos
error_log(print_r($data, true));

if (
    isset($data['nombre']) &&
    isset($data['apellidoPaterno']) &&
    isset($data['apellidoMaterno'])
) {
    $nombre = $mysqli->real_escape_string($data['nombre']);
    $apellidoPaterno = $mysqli->real_escape_string($data['apellidoPaterno']);
    $apellidoMaterno = $mysqli->real_escape_string($data['apellidoMaterno']);
    $fechaNacimiento = isset($data['fechaNacimiento']) ? $mysqli->real_escape_string($data['fechaNacimiento']) : NULL;
    $estadoCivil = isset($data['estadoCivil']) ? (int)$data['estadoCivil'] : NULL;
    $sexo = isset($data['sexo']) ? (int)$data['sexo'] : NULL;
    $curp = isset($data['curp']) ? $mysqli->real_escape_string($data['curp']) : '';
    $numeroSeguroSocial = isset($data['numeroSeguroSocial']) ? $mysqli->real_escape_string($data['numeroSeguroSocial']) : '';
    $rfc = isset($data['rfc']) ? $mysqli->real_escape_string($data['rfc']) : '';
    $correoElectronico = isset($data['correoElectronico']) ? $mysqli->real_escape_string($data['correoElectronico']) : '';
    $telefono = isset($data['telefono']) ? $mysqli->real_escape_string($data['telefono']) : '';
    $contactoEmergencia = isset($data['contactoEmergencia']) ? $mysqli->real_escape_string($data['contactoEmergencia']) : '';
    $numEmergencia = isset($data['numEmergencia']) ? $mysqli->real_escape_string($data['numEmergencia']) : '';
    $fechaInicio = isset($data['fechaInicio']) ? $mysqli->real_escape_string($data['fechaInicio']) : NULL;
    $departamento = isset($data['departamento']) ? (int)$data['departamento'] : NULL;
    $puesto = isset($data['puesto']) ? (int)$data['puesto'] : NULL;
    $turno = isset($data['turno']) ? (int)$data['turno'] : NULL;
    $companyId = (int)$data['companyId'];
    $status = $data['status'];

    // Preparar la declaración SQL
    $sql = "INSERT INTO employees (first_name, last_name, middle_name, birth_date, marital_status_id, gender_id, curp, social_security_number, rfc, email, phone_number, emergency_contact_name, emergency_contact_number, start_date, department_id, position_id, shift_id, company_id) VALUES ('$nombre', '$apellidoPaterno', '$apellidoMaterno', '$fechaNacimiento', $estadoCivil, $sexo, '$curp', '$numeroSeguroSocial', '$rfc', '$correoElectronico', '$telefono', '$contactoEmergencia', '$numEmergencia', '$fechaInicio', $departamento, $puesto, $turno, $companyId)";
    
    if ($mysqli->query($sql) === TRUE) {
        $employee_id = $mysqli->insert_id;

        $sql = "INSERT INTO employee_requests (employee_id, status) VALUES ($employee_id, '$status')";
        if ($mysqli->query($sql) === TRUE) {
            echo json_encode(['employee_id' => $employee_id, 'success' => 'Employee request submitted successfully']);
        } else {
            error_log("Error en la consulta: " . $mysqli->error);
            echo json_encode(['error' => 'Error en la consulta SQL al insertar en employee_requests']);
        }
    } else {
        error_log("Error en la consulta: " . $mysqli->error);
        echo json_encode(['error' => 'Error en la consulta SQL al insertar en employees']);
    }
} else {
    echo json_encode(['error' => 'Required fields are missing']);
}

$mysqli->close();
?>
