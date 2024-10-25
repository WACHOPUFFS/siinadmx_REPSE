<?php
include_once 'cors.php';
include_once 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['companyId']) && isset($data['businessPartnerId']) && isset($data['sections']) && is_array($data['sections'])) {
    $companyId = $mysqli->real_escape_string($data['companyId']);
    $businessPartnerId = $mysqli->real_escape_string($data['businessPartnerId']);
    $sections = $data['sections'];
    $errors = [];

    foreach ($sections as $section) {
        $sectionEscaped = $mysqli->real_escape_string($section);
        
        // Verificar si la sección ya está asignada a la empresa
        $checkQuery = "SELECT * FROM business_partner_sections WHERE company_id = '$companyId' AND association_id = '$businessPartnerId' AND name_section = '$sectionEscaped'";
        $checkResult = $mysqli->query($checkQuery);

        if ($checkResult->num_rows > 0) {
            $errors[] = "La sección '$section' ya está asignada a esta empresa.";
        } else {
            // Insertar la nueva sección
            $query = "INSERT INTO business_partner_sections (company_id, association_id, name_section, creation_date) VALUES ('$companyId', '$businessPartnerId', '$sectionEscaped', NOW())";
            if (!$mysqli->query($query)) {
                $errors[] = "Error al añadir la sección '$section': " . $mysqli->error;
            }
        }
    }

    if (empty($errors)) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false, "error" => implode(", ", $errors)));
    }
} else {
    echo json_encode(array("success" => false, "error" => "No se proporcionaron los datos necesarios en la solicitud."));
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>