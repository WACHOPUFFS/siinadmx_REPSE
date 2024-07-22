<?php
include_once 'cors.php';
include_once 'conexion.php';

// Verificar si se proporcionó el campo codigoSocioComercial
if (isset($_GET['codigoSocioComercial'])) {

    // Obtener y sanitizar el código proporcionado desde los datos recibidos
    $code = $_GET['codigoSocioComercial'];

    // Consulta para obtener el ID del usuario asociado al código proporcionado
    $query_association_id = "SELECT users.id
                             FROM users
                             JOIN usersCodes ON users.id = usersCodes.userId
                             WHERE usersCodes.code = ?";
    $stmt_association_id = $mysqli->prepare($query_association_id);
    $stmt_association_id->bind_param("s", $code);
    $stmt_association_id->execute();
    $result_association_id = $stmt_association_id->get_result();

    if ($result_association_id && $result_association_id->num_rows > 0) {
        // Extraer el ID del usuario de la consulta
        $row_association_id = $result_association_id->fetch_assoc();
        $user_id = $row_association_id['id'];

        // Consulta principal usando el ID del usuario obtenido
        $query = "SELECT u.id, u.username, u.name AS name, u.email, c.id AS companyId, c.nameCompany, r.roleName, p.fecha_inicio, p.fecha_fin, c.rfc AS companyRFC
                  FROM users u
                  INNER JOIN user_company_roles uc ON u.id = uc.user_id
                  INNER JOIN companies c ON uc.company_id = c.id
                  INNER JOIN periodos p ON u.id = p.usuario_id
                  INNER JOIN roles r ON uc.role_id = r.id
                  WHERE uc.user_id = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result === false) {
            // Manejar el error en caso de que la consulta falle
            echo json_encode(array("error" => "Error al ejecutar la consulta: " . $mysqli->error));
        } else {
            // Array para almacenar los datos de los empleados no confirmados
            $empleadosNoConfirmados = array();

            // Almacenar los datos de los empleados no confirmados en el array
            while ($row = $result->fetch_assoc()) {
                $empleadosNoConfirmados[] = $row;
            }

            // Configurar el encabezado de la respuesta
            header('Content-Type: application/json');

            // Verificar si se encontraron empleados no confirmados
            if (count($empleadosNoConfirmados) > 0) {
                // Devolver los datos de los empleados no confirmados en formato JSON
                echo json_encode($empleadosNoConfirmados);
            } else {
                // Enviar un mensaje si no se encontraron empleados no confirmados
                echo json_encode(array("mensaje" => "No se encontraron usuarios asociados al código proporcionado"));
            }
        }
        $stmt->close();
    } else {
        // Enviar un mensaje si no se encuentra ningún usuario asociado al código proporcionado
        echo json_encode(array("mensaje" => "No se encontró ningún usuario asociado al código proporcionado"));
    }
    $stmt_association_id->close();
} else {
    // Enviar un mensaje si no se proporcionó el campo codigoSocioComercial
    echo json_encode(array("error" => "No se proporcionó el campo 'codigoSocioComercial'"));
}

$mysqli->close();
?>
