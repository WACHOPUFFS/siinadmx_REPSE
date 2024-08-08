<?php
header('Content-Type: application/json');

// Incluir el archivo de conexión
require_once 'cors.php';
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $employeeId = isset($_POST['employee_id']) ? intval($_POST['employee_id']) : 0;

    // Manejar los archivos subidos
    $uploadDir = 'uploads/';
    $fileFields = ['ineFrente', 'ineReverso', 'constanciaFiscal', 'numSeguroSocialArchivo', 'actaNacimiento', 'comprobanteDomicilio', 'cuentaInterbancaria', 'retencionInfonavit', 'antecedentesPenales', 'comprobanteEstudios'];

    foreach ($fileFields as $field) {
        if (isset($_FILES[$field]) && $_FILES[$field]['error'] == UPLOAD_ERR_OK) {
            $fileName = basename($_FILES[$field]['name']);
            $filePath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES[$field]['tmp_name'], $filePath)) {
                // Verificar si el archivo ya existe para ese tipo
                $stmt = $mysqli->prepare("SELECT file_id FROM employee_files WHERE employee_id = ? AND file_type = ?");
                $stmt->bind_param("is", $employeeId, $field);
                $stmt->execute();
                $stmt->store_result();

                if ($stmt->num_rows > 0) {
                    // Actualizar el archivo existente
                    $stmt = $mysqli->prepare("UPDATE employee_files SET file_name = ?, file_path = ? WHERE employee_id = ? AND file_type = ?");
                    $stmt->bind_param("ssis", $fileName, $filePath, $employeeId, $field);
                } else {
                    // Insertar un nuevo archivo
                    $stmt = $mysqli->prepare("INSERT INTO employee_files (employee_id, file_type, file_name, file_path) VALUES (?, ?, ?, ?)");
                    $stmt->bind_param("isss", $employeeId, $field, $fileName, $filePath);
                }
                $stmt->execute();
                $stmt->close();
            }
        }
    }

    echo json_encode(['success' => 'Archivos subidos y/o actualizados exitosamente']);
    $mysqli->close();
}
?>
