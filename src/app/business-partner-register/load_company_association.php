<?php
include_once 'cors.php';
include_once 'conexion.php';

if (isset($_GET['codigoEmpresa'])) {
    $codigoEmpresa = $mysqli->real_escape_string($_GET['codigoEmpresa']);

    // Consultar la información de la empresa y del representante a partir del código
    $sql = "SELECT u.name AS representante, 
                   u.email AS representanteCorreo,
                   u.phone AS representanteTelefono,
                   c.nameCompany AS empresa,
                   c.rfc AS rfcEmpresa,
                   c.id AS company_id,
                   ucr.principal,
                   ucr.levelUser_id
            FROM company_codes cc
            INNER JOIN companies c ON cc.company_id = c.id
            INNER JOIN user_company_roles ucr ON c.id = ucr.company_id
            INNER JOIN users u ON u.id = ucr.user_id
            WHERE cc.code = ?
              AND ucr.principal = '1'
              AND ucr.levelUser_id = 1";

    $stmt = $mysqli->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("s", $codigoEmpresa);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $companyData = $result->fetch_assoc();
            echo json_encode($companyData);
        } else {
            echo json_encode(["error" => "No se encontró un representante principal con el código de empresa proporcionado."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "Error en la preparación de la consulta: " . $mysqli->error]);
    }
} else {
    echo json_encode(["error" => "Código de empresa no proporcionado."]);
}

$mysqli->close();
?>
