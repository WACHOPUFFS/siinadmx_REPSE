<?php
include_once 'cors.php';
include_once 'conexion.php';

// Obtener el ID de la empresa seleccionada y el ID del usuario desde los parámetros de la solicitud
$selectedCompanyId = $_GET['id'];
$userId = $_GET['user_id'];

if (!empty($selectedCompanyId) && !empty($userId)) {
    // Consulta principal para obtener los datos de la empresa, verificando el estado de la asociación en user_company_roles y haciendo un join a la tabla roles
    $query = "SELECT c.id, c.nameCompany, c.rfc, r.roleName
              FROM companies c
              INNER JOIN user_company_roles uc ON c.id = uc.company_id
              INNER JOIN roles r ON uc.role_id = r.id
              WHERE uc.association_id = $selectedCompanyId AND uc.created_by = $userId AND uc.status = '0'";

    $result = $mysqli->query($query);

    if ($result) {
        // Array para almacenar los datos de la empresa
        $empresaData = array();

        // Almacenar todos los datos de la empresa en el array
        while ($row = $result->fetch_assoc()) {
            $empresaData[] = $row;
        }

        // Devolver los datos de la empresa en formato JSON
        header('Content-Type: application/json');
        if (!empty($empresaData)) {
            echo json_encode($empresaData);
        } else {
            echo json_encode(array("mensaje" => "No se encontró ninguna empresa con el ID: $selectedCompanyId, user ID: $userId y status de asociación = 0"));
        }
    } else {
        echo json_encode(array("error" => "Error al ejecutar la consulta: " . $mysqli->error));
    }
} else {
    echo json_encode(array("error" => "ID de empresa o ID de usuario no proporcionado"));
}

$mysqli->close();
?>
