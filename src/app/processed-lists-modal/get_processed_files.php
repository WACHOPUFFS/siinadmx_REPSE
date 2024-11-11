<?php
header('Content-Type: application/json');

require_once 'cors.php'; // Para manejar CORS
require_once 'conexion.php'; // Conexión a la base de datos

// Obtener el parámetro de `company_id` de la URL
$companyId = $_GET['company_id'] ?? null;

// Verificar que se recibió el parámetro necesario
if (!$companyId) {
    echo json_encode(['error' => 'Faltan parámetros necesarios.']);
    exit;
}

// Sanitizar el parámetro para evitar inyección SQL
$companyId = intval($companyId);

// Ruta base para los archivos PDF
$baseUrl = "https://siinad.mx/php/";

// Consulta SQL para obtener los archivos procesados para una empresa específica
$sql = "
    SELECT 
        week_files.week_number,
        period_types.period_type_name AS period_type, -- Obtener el nombre del tipo de periodo desde la tabla period_type
        week_files.status,
        CONCAT('$baseUrl', week_files.pdf_path) AS pdf_url, -- Concatenar la ruta base con el pdf_path
        week_files.uploaded_at
    FROM 
        week_files
    LEFT JOIN 
        period_types ON week_files.period_type_id = period_types.period_type_id -- Unir con la tabla period_type usando el campo id
    WHERE 
        week_files.company_id = $companyId
    ORDER BY 
        week_files.uploaded_at DESC
";

$result = $mysqli->query($sql);

$processedFiles = [];

// Verificar si se encontraron resultados
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $processedFiles[] = $row;
    }
}

// Devolver los resultados en formato JSON
echo json_encode($processedFiles);

$mysqli->close();
?>
