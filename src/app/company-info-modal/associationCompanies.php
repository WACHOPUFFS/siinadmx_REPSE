<?php

// Incluir la configuración de la base de datos
include_once 'cors.php';
include_once 'conexion.php';

// Obtener los datos del cuerpo de la solicitud POST
$data = json_decode(file_get_contents("php://input"));

// Verificar si los datos necesarios están presentes
if (isset($data->empresa) && isset($data->empresaSocio) && isset($data->role) && isset($data->userId)) {
    // Obtener los valores de la solicitud y sanitizar
    $empresa = filter_var($data->empresa, FILTER_SANITIZE_NUMBER_INT);
    $empresaSocio = filter_var($data->empresaSocio, FILTER_SANITIZE_NUMBER_INT);
    $role = filter_var($data->role, FILTER_SANITIZE_STRING);
    $userId = filter_var($data->userId, FILTER_SANITIZE_NUMBER_INT);

    // Consulta SQL para obtener el ID del rol original
    $sql_busqueda_rol = "SELECT id FROM roles WHERE roleName = '$role'";
    $resultado_busqueda_rol = $mysqli->query($sql_busqueda_rol);

    if ($resultado_busqueda_rol->num_rows > 0) {
        $rol = $resultado_busqueda_rol->fetch_assoc()['id'];

        // Definir el rol contrario basado en el rol actual
        $rolContrario = null;
        if ($role == 'Cliente') {
            $rolContrario = 'Proveedor';
        } elseif ($role == 'Proveedor') {
            $rolContrario = 'Cliente';
        } elseif ($role == 'Cliente - Proveedor') {
            $rolContrario = 'Cliente - Proveedor';
        }

        // Obtener el ID del rol contrario
        if ($rolContrario) {
            $sql_busqueda_rol_contrario = "SELECT id FROM roles WHERE roleName = '$rolContrario'";
            $resultado_busqueda_rol_contrario = $mysqli->query($sql_busqueda_rol_contrario);

            if ($resultado_busqueda_rol_contrario->num_rows > 0) {
                $rolContrarioId = $resultado_busqueda_rol_contrario->fetch_assoc()['id'];
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Rol contrario no encontrado."
                );
                echo json_encode($response);
                exit();
            }
        }

        // Verificar si la asociación original ya existe
        $sql_check_original = "SELECT * FROM user_company_roles WHERE company_id = $empresa AND association_id = $empresaSocio AND role_id = $rol";
        $resultado_check_original = $mysqli->query($sql_check_original);

        // Verificar si la asociación modificada ya existe
        $sql_check_modificada = "SELECT * FROM user_company_roles WHERE company_id = $empresaSocio AND association_id = $empresa AND role_id = $rolContrarioId AND created_by = $userId";
        $resultado_check_modificada = $mysqli->query($sql_check_modificada);

        if ($resultado_check_original->num_rows > 0 || $resultado_check_modificada->num_rows > 0) {
            // Si alguna asociación ya existe, retornar un mensaje de error
            $response = array(
                "success" => false,
                "message" => "La asociación ya existe."
            );
        } else {
            // Insertar la asociación original
            $sql_original = "INSERT INTO user_company_roles (company_id, association_id, role_id) VALUES ($empresa, $empresaSocio, $rol)";
            $original_success = $mysqli->query($sql_original);

            // Insertar la asociación modificada con el rol contrario
            $sql_modificada = "INSERT INTO user_company_roles (company_id, association_id, role_id, created_by) VALUES ($empresaSocio, $empresa, $rolContrarioId, $userId)";
            $modificada_success = $mysqli->query($sql_modificada);

            // Verificar si ambas inserciones fueron exitosas
            if ($original_success && $modificada_success) {
                $response = array(
                    "success" => true,
                    "message" => "Asociaciones de empresas insertadas correctamente con roles opuestos."
                );
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Error al insertar las asociaciones de empresas: " . $mysqli->error
                );
            }
        }
    } else {
        $response = array(
            "success" => false,
            "message" => "Rol no encontrado"
        );
    }

    // Cerrar la conexión a la base de datos
    $mysqli->close();
} else {
    // Datos insuficientes en la solicitud
    $response = array(
        "success" => false,
        "message" => "Datos insuficientes en la solicitud"
    );
}

// Devolver la respuesta en formato JSON
echo json_encode($response);

?>
