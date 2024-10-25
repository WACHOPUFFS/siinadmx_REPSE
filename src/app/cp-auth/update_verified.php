<?php
include_once 'cors.php';
include_once 'conexion.php';

// Verificar si se recibieron datos mediante POST
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se recibieron los campos companyId, associationId y userId
if (isset($data['companyId']) && isset($data['associationId']) && isset($data['userId'])) {
    // Obtener los datos enviados por la solicitud HTTP
    $companyId = $data['companyId'];
    $associationId = $data['associationId'];
    $userId = $data['userId'];

    // Actualizar el status de la asociación en la tabla user_company_roles a 1
    $updateQuery1 = "UPDATE user_company_roles SET status = '1' WHERE company_id = '$companyId' AND association_id = '$associationId' AND status = '0'";
    $updateQuery2 = "UPDATE user_company_roles SET status = '1' WHERE company_id = '$associationId' AND association_id = '$companyId' AND created_by = '$userId' AND status = '0'";

    $result1 = $mysqli->query($updateQuery1);
    $result2 = $mysqli->query($updateQuery2);

    if ($result1 && $result2) {
        // Si ambas actualizaciones se realizan con éxito, devolver una respuesta exitosa
        echo json_encode(array("success" => true));
    } else {
        // Si hay algún error al actualizar el status de la asociación, devolver un mensaje de error
        $errorMessage = "Error al actualizar el status de la asociación: " . $mysqli->error;
        echo json_encode(array("error" => $errorMessage));
    }
} else {
    // Si algún campo requerido no está presente en la solicitud, devolver un mensaje de error
    echo json_encode(array("error" => "Los campos 'companyId', 'associationId' y 'userId' son requeridos en la solicitud."));
}

$mysqli->close();
?>
