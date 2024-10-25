<?php

// Incluir la configuración de la base de datos
include_once 'cors.php';
include_once 'conexion.php';

// Función para generar un token único
function generarToken()
{
    return md5(uniqid(rand(), true));
}

// Función para guardar el token en la base de datos
function guardarToken($mysqli, $correo, $token)
{
    $correoEscapado = $mysqli->real_escape_string($correo);
    $sql = "UPDATE users SET token = '$token' WHERE email = '$correoEscapado'";
    return $mysqli->query($sql);
}

// Obtener los datos del cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"));

// Verificar si se recibieron los datos esperados
if (
    isset($data->idUser) &&
    isset($data->nombreUsuario) &&
    isset($data->nombreCompleto) &&
    isset($data->correo) &&
    isset($data->numTelefonico) &&
    isset($data->contrasena) &&
    isset($data->rfc) &&
    isset($data->roleInCompany) && // Aquí ahora recibimos el ID del rol
    isset($data->nombreEmpresa) &&
    isset($data->fechaInicio) &&
    isset($data->fechaFin) &&
    isset($data->empresaLigada)
) {
    $idUser = $mysqli->real_escape_string($data->idUser);
    $nombreUsuario = $mysqli->real_escape_string($data->nombreUsuario);
    $nombreCompleto = $mysqli->real_escape_string($data->nombreCompleto);
    $correo = $mysqli->real_escape_string($data->correo);
    $numTelefonico = $mysqli->real_escape_string($data->numTelefonico);
    $contrasena = $mysqli->real_escape_string($data->contrasena);
    $rfc = $mysqli->real_escape_string($data->rfc);
    $roleInCompany = $mysqli->real_escape_string($data->roleInCompany); // ID del rol
    $nombreEmpresa = $mysqli->real_escape_string($data->nombreEmpresa);
    $fechaInicio = $mysqli->real_escape_string($data->fechaInicio);
    $fechaFin = $mysqli->real_escape_string($data->fechaFin);
    $empresaLigada = $mysqli->real_escape_string($data->empresaLigada);

    $levelUser = 'adminEE';
    $contrasenaHash = md5($contrasena);

    // Verificar si el correo ya existe
    $sqlCheckEmail = "SELECT id, confirmed FROM users WHERE email = ?";
    $stmtCheckEmail = $mysqli->prepare($sqlCheckEmail);
    $stmtCheckEmail->bind_param("s", $correo);
    $stmtCheckEmail->execute();
    $stmtCheckEmail->store_result();

    if ($stmtCheckEmail->num_rows > 0) {
        $stmtCheckEmail->bind_result($userId, $confirmed);
        $stmtCheckEmail->fetch();
        if ($confirmed != 1) {
            $response = array("success" => false, "message" => "Correo registrado pero no confirmado.");
            echo json_encode($response);
            exit;
        }
    }

    // Verificar nombre de usuario
    $sqlCheckUsername = "SELECT id FROM users WHERE username = '$nombreUsuario'";
    $resultCheckUsername = $mysqli->query($sqlCheckUsername);
    if ($resultCheckUsername->num_rows > 0) {
        $response = array("success" => false, "message" => "El nombre de usuario ya está en uso.");
        echo json_encode($response);
        exit;
    }

    // Verificar si existe un admin en la empresa
    $sqlCheckAdmin = "SELECT COUNT(*) as countAdmin FROM users u
        INNER JOIN user_company_roles ucr ON u.id = ucr.user_id
        INNER JOIN companies c ON ucr.company_id = c.id
        INNER JOIN levelUser lu ON ucr.levelUser_id = lu.id
        WHERE lu.levelUserName = 'adminEE' AND c.nameCompany = '$nombreEmpresa'";

    $resultCheckAdmin = $mysqli->query($sqlCheckAdmin);
    $rowCheckAdmin = $resultCheckAdmin->fetch_assoc();

    if ($rowCheckAdmin['countAdmin'] > 0) {
        $response = array("success" => false, "message" => "Ya existe un administrador en esta empresa.");
        echo json_encode($response);
        exit;
    }

    // Verificar si el nivel de usuario ya existe
    $sqlCheckLevelUser = "SELECT id FROM levelUser WHERE levelUserName = '$levelUser'";
    $resultCheckLevelUser = $mysqli->query($sqlCheckLevelUser);
    if ($resultCheckLevelUser->num_rows > 0) {
        $rowLevelUser = $resultCheckLevelUser->fetch_assoc();
        $levelUserId = $rowLevelUser['id'];
    } else {
        $sqlInsertLevelUser = "INSERT INTO levelUser (levelUserName) VALUES ('$levelUser')";
        if ($mysqli->query($sqlInsertLevelUser)) {
            $levelUserId = $mysqli->insert_id;
        } else {
            $response = array("success" => false, "message" => "Error al insertar nivel de usuario.");
            echo json_encode($response);
            exit;
        }
    }

    // Verificar si la empresa principal ya existe
    $sqlCheckEmpresa = "SELECT id FROM companies WHERE rfc = ?";
    $stmtCheckEmpresa = $mysqli->prepare($sqlCheckEmpresa);
    $stmtCheckEmpresa->bind_param("s", $rfc);
    $stmtCheckEmpresa->execute();
    $stmtCheckEmpresa->store_result();

    if ($stmtCheckEmpresa->num_rows > 0) {
        $stmtCheckEmpresa->bind_result($empresaId);
        $stmtCheckEmpresa->fetch();
    } else {
        $sqlInsertEmpresa = "INSERT INTO companies (nameCompany, rfc) VALUES (?, ?)";
        $stmtInsertEmpresa = $mysqli->prepare($sqlInsertEmpresa);
        $stmtInsertEmpresa->bind_param("ss", $nombreEmpresa, $rfc);

        if ($stmtInsertEmpresa->execute()) {
            $empresaId = $stmtInsertEmpresa->insert_id;
        } else {
            $response = array("success" => false, "message" => "Error al insertar la empresa.");
            echo json_encode($response);
            exit;
        }
    }

    // Verificar si la empresa ligada ya existe
    $sqlFindCompanyId = "SELECT id FROM companies WHERE nameCompany = '$empresaLigada'";
    $resultFindCompanyId = $mysqli->query($sqlFindCompanyId);

    if ($resultFindCompanyId && $resultFindCompanyId->num_rows > 0) {
        $rowCompanyId = $resultFindCompanyId->fetch_assoc();
        $companyId = $rowCompanyId['id'];
    } else {
        $response = array("success" => false, "message" => "Error: La empresa ligada no existe.");
        echo json_encode($response);
        exit;
    }

    // Insertar el usuario
    $sqlInsertUser = "INSERT INTO users (username, name, phone, password, email, state, created_by) 
                      VALUES ('$nombreUsuario', '$nombreCompleto', '$numTelefonico', '$contrasenaHash', '$correo', 'active', '$idUser')";
    $mysqli->query($sqlInsertUser);
    $usuarioId = $mysqli->insert_id;

    // Obtener el rol invertido basado en el rol original usando ID
    $sqlGetInvertedRoleId = "SELECT id FROM roles WHERE id = ?";
    $stmtGetInvertedRoleId = $mysqli->prepare($sqlGetInvertedRoleId);
    if ($roleInCompany == 3) { // Proveedor
        $invertedRoleId = 2; // Cliente
    } elseif ($roleInCompany == 2) { // Cliente
        $invertedRoleId = 3; // Proveedor
    } else {
        $invertedRoleId = $roleInCompany; // Cliente-Proveedor
    }

    // Insertar toda la conexión de socio comercial a la empresa principal
    $sqlInsertUserRole = "INSERT INTO user_company_roles (user_id, company_id, role_id, association_id, principal, levelUser_id, created_by) 
                          VALUES ('$usuarioId', '$empresaId', '$roleInCompany', '$companyId', '1', '$levelUserId', '$idUser')";
    if (!$mysqli->query($sqlInsertUserRole)) {
        $response = array("success" => false, "message" => "Error al insertar la relación de rol original: " . $mysqli->error);
        echo json_encode($response);
        exit;
    }

    // Insertar la conexión de la empresa principal al socio comercial
    $sqlInsertInvertedUserRole = "INSERT INTO user_company_roles (company_id, role_id, association_id) 
                         VALUES ('$companyId', '$invertedRoleId', '$empresaId')";
    if (!$mysqli->query($sqlInsertInvertedUserRole)) {
        $response = array("success" => false, "message" => "Error al insertar la relación de rol invertido: " . $mysqli->error);
        echo json_encode($response);
        exit;
    }

    // Insertar el periodo de actividad del usuario
    $sqlPeriodo = "INSERT INTO periodos (usuario_id, fecha_inicio, fecha_fin) VALUES ('$usuarioId', '$fechaInicio', '$fechaFin')";
    if ($mysqli->query($sqlPeriodo)) {
        // Generar y guardar el token
        $token = generarToken();
        if (guardarToken($mysqli, $correo, $token)) {
            include_once 'enviar_correo.php';
            enviarCorreo($correo, $token, 'confirmacion');

            $response = array("success" => true, "message" => "¡Usuario y empresa registrados exitosamente!", "token" => $token);
            echo json_encode($response);
        } else {
            $response = array("success" => false, "message" => "Error al guardar el token en la base de datos.");
            echo json_encode($response);
        }
    } else {
        $response = array("success" => false, "message" => "Error al registrar el periodo de actividad: " . $mysqli->error);
        echo json_encode($response);
    }
} else {
    $response = array("success" => false, "message" => "Datos incompletos.");
    echo json_encode($response);
}

$mysqli->close();
?>
