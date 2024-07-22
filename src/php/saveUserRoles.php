<?php
include_once 'cors.php';
include_once 'conexion.php';

// Configurar cabeceras para la respuesta JSON
header('Content-Type: application/json');

// Decodificar los datos JSON recibidos en el cuerpo del POST
$data = json_decode(file_get_contents("php://input"));

// Verifica si se recibieron los datos del POST correctamente
if (isset($data->companyId, $data->socioComercialId, $data->nuevoRol)) {
    // Obtén los datos necesarios del POST
    $companyId = $data->companyId;
    $socioComercialId = $data->socioComercialId;
    $nuevoRol = $data->nuevoRol;

    // Verifica si el nuevo rol existe en la tabla de roles
    $checkRoleQuery = "SELECT id FROM roles WHERE roleName = ?";
    if ($stmt = $mysqli->prepare($checkRoleQuery)) {
        $stmt->bind_param('s', $nuevoRol);
        $stmt->execute();
        $checkRoleResult = $stmt->get_result();

        if ($checkRoleResult->num_rows > 0) {
            // Obtén el ID del nuevo rol
            $row = $checkRoleResult->fetch_assoc();
            $nuevoRolId = $row['id'];

            // Actualiza el rol del usuario en la tabla user_company_roles
            $updateUserRoleQuery = "UPDATE user_company_roles SET role_id = ? WHERE company_id = ? AND association_id = ?";
            if ($updateStmt = $mysqli->prepare($updateUserRoleQuery)) {
                $updateStmt->bind_param('iii', $nuevoRolId, $socioComercialId, $companyId);
                if ($updateStmt->execute()) {
                    // La actualización del rol fue exitosa

                    // Determina el nuevo roleName opuesto al actual
                    $rolContrario = null;
                    if ($nuevoRol == 'proveedor') {
                        $rolContrario = 'cliente';
                    } elseif ($nuevoRol == 'cliente') {
                        $rolContrario = 'proveedor';
                    } elseif ($nuevoRol == 'clienteProveedor') {
                        $rolContrario = 'clienteProveedor';
                    }

                    if ($rolContrario) {
                        // Obtener el ID del rol contrario
                        $sqlGetNewRoleId = "SELECT id FROM roles WHERE roleName = ?";
                        if ($getNewRoleStmt = $mysqli->prepare($sqlGetNewRoleId)) {
                            $getNewRoleStmt->bind_param('s', $rolContrario);
                            $getNewRoleStmt->execute();
                            $resultNewRole = $getNewRoleStmt->get_result();
                            if ($resultNewRole->num_rows > 0) {
                                $rowNewRole = $resultNewRole->fetch_assoc();
                                $rolContrarioId = $rowNewRole['id'];

                                // Ahora, actualiza la asociación de roles con el rol opuesto
                                $updateAssociationQuery = "UPDATE user_company_roles SET role_id = ? WHERE association_id = ? AND company_id = ?";
                                if ($updateAssociationStmt = $mysqli->prepare($updateAssociationQuery)) {
                                    $updateAssociationStmt->bind_param('iii', $rolContrarioId, $socioComercialId, $companyId);
                                    if ($updateAssociationStmt->execute()) {
                                        // La actualización de la asociación de roles fue exitosa
                                        $response['success'] = true;
                                        $response['message'] = "Rol y asociación de roles actualizados correctamente.";
                                    } else {
                                        // Error al ejecutar la consulta de actualización de la asociación de roles
                                        $response['success'] = false;
                                        $response['message'] = "Error al actualizar la asociación de roles.";
                                    }
                                    $updateAssociationStmt->close();
                                } else {
                                    // Error al preparar la consulta de actualización de la asociación de roles
                                    $response['success'] = false;
                                    $response['message'] = "Error al preparar la consulta de actualización de la asociación de roles.";
                                }
                            } else {
                                // El rol contrario no existe en la tabla de roles
                                $response['success'] = false;
                                $response['message'] = "El rol contrario no existe.";
                            }
                            $getNewRoleStmt->close();
                        } else {
                            // Error al preparar la consulta de selección del rol contrario
                            $response['success'] = false;
                            $response['message'] = "Error al preparar la consulta de selección del rol contrario.";
                        }
                    } else {
                        // Manejar el caso en que el nuevo rol no tiene un rol contrario definido
                        $response['success'] = false;
                        $response['message'] = "El nuevo rol no tiene un rol contrario definido.";
                    }
                } else {
                    // Error al ejecutar la consulta de actualización del rol
                    $response['success'] = false;
                    $response['message'] = "Error al actualizar el rol.";
                }
                $updateStmt->close();
            } else {
                // Error al preparar la consulta de actualización del rol
                $response['success'] = false;
                $response['message'] = "Error al preparar la consulta de actualización del rol.";
            }
        } else {
            // El nuevo rol no existe en la tabla de roles
            $response['success'] = false;
            $response['message'] = "El nuevo rol no existe.";
        }
        $stmt->close();
    } else {
        // Error al preparar la consulta de selección del rol
        $response['success'] = false;
        $response['message'] = "Error al preparar la consulta de selección del rol.";
    }
} else {
    // Datos del POST no recibidos correctamente
    $response['success'] = false;
    $response['message'] = "Datos del POST incompletos.";
}

// Envía la respuesta JSON al cliente
echo json_encode($response);

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
