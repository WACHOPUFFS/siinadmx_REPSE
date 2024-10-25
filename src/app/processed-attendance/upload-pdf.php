<?php
header('Content-Type: application/json');

require_once 'cors.php';
require_once 'conexion.php';

// Verificar si el archivo PDF fue enviado correctamente
if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] != UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'Error al subir el archivo PDF.']);
    exit;
}

// Verificar otros parámetros necesarios
$companyId = $_POST['company_id'];
$weekNumber = $_POST['week_number'];
$periodTypeId = $_POST['period_type_id'];
$status = $_POST['status'];

// Validar que todos los parámetros estén presentes
if (empty($companyId) || empty($weekNumber) || empty($periodTypeId) || empty($status)) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar los datos para prevenir inyecciones SQL
$companyId = intval($companyId);
$weekNumber = intval($weekNumber);
$periodTypeId = intval($periodTypeId);
$status = htmlspecialchars($status, ENT_QUOTES);

// Generar un nombre único para el archivo usando companyId, weekNumber y un identificador único (UUID)
$uniqueName = 'company_' . $companyId . '_week_' . $weekNumber . '_' . uniqid('', true) . '.pdf';

// Ruta para guardar el archivo PDF
$uploadDir = 'uploads/weeks/'; // Asegúrate de que esta carpeta exista y tenga permisos de escritura
$uploadFile = $uploadDir . $uniqueName; // Ruta completa con el nombre único del archivo

// Mover el archivo subido a la carpeta de destino con el nuevo nombre
if (move_uploaded_file($_FILES['pdf']['tmp_name'], $uploadFile)) {
    // Preparar la consulta para insertar los datos en la base de datos
    $sql = "INSERT INTO week_files (company_id, week_number, period_type_id, status, pdf_path) 
            VALUES ($companyId, $weekNumber, $periodTypeId, '$status', '$uploadFile')";

    // Ejecutar la consulta
    if ($mysqli->query($sql)) {
        echo json_encode(['success' => 'Archivo subido correctamente y guardado en la base de datos.', 'fileName' => $uniqueName]);
    } else {
        echo json_encode(['error' => 'Error al guardar la información en la base de datos: ' . $mysqli->error]);
    }
} else {
    echo json_encode(['error' => 'Error al mover el archivo PDF.']);
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
