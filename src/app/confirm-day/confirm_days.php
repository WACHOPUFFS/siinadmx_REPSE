<?php
// Incluir el archivo de conexión y CORS
require_once 'cors.php';  // Si tienes un archivo para manejar CORS
require_once 'conexion.php';  // Conexión a la base de datos usando MySQLi

header('Content-Type: application/json');

// Verificar si se han proporcionado los parámetros necesarios
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['company_id']) || !isset($data['period_type_id'])) {
    echo json_encode(['error' => 'Faltan parámetros']);
    exit();
}

$company_id = $mysqli->real_escape_string($data['company_id']);
$period_type_id = $mysqli->real_escape_string($data['period_type_id']);  // Cambiado a period_type_id

// Obtener las fechas del período seleccionado
$query_period = "
    SELECT start_date, end_date 
    FROM payroll_periods 
    WHERE period_type_id = '$period_type_id'  // Cambiado para usar period_type_id
    AND company_id = '$company_id'
    LIMIT 1
";

$result_period = $mysqli->query($query_period);

if ($result_period->num_rows === 0) {
    echo json_encode(['error' => 'Período no encontrado']);
    exit();
}

$period_data = $result_period->fetch_assoc();
$start_date = $period_data['start_date'];
$end_date = $period_data['end_date'];

// Generar una lista de todos los días del período
$period_days = [];
$start = new DateTime($start_date);
$end = new DateTime($end_date);
$end = $end->modify('+1 day');  // Incluir la fecha de fin

$interval = new DateInterval('P1D');
$daterange = new DatePeriod($start, $interval, $end);

foreach ($daterange as $date) {
    $period_days[] = $date->format("Y-m-d");
}

// Obtener las asignaciones de ese período
$query_assignments = "
    SELECT 
        ea.assignment_id,
        ea.employee_id,
        e.first_name,
        e.last_name,
        ea.project_id,
        p.project_name,
        ea.assignment_date,
        ea.day_of_week,
        ea.project_status,
        ea.period_start_date,
        ea.period_end_date,
        ea.confirmed,  -- Campo que indica si el día está confirmado
        ea.fiscal_year,
        ea.period_number,
        ea.work_week
    FROM 
        employee_assignments ea
    JOIN employees e ON ea.employee_id = e.employee_id
    JOIN projects p ON ea.project_id = p.project_id
    WHERE 
        ea.company_id = '$company_id'
        AND ea.period_type_id = '$period_type_id'  // Cambiado para usar period_type_id
";

$result_assignments = $mysqli->query($query_assignments);

// Organizar los días pendientes y confirmados
$confirmed_days = [];
$pending_days = [];

if ($result_assignments->num_rows > 0) {
    while ($assignment = $result_assignments->fetch_assoc()) {
        if ($assignment['confirmed']) {
            $confirmed_days[] = $assignment;
        } else {
            $pending_days[] = $assignment;
        }
    }
}

// Respuesta JSON
echo json_encode([
    'period_days' => $period_days,  // Días totales del período
    'confirmed_days' => $confirmed_days,  // Días confirmados
    'pending_days' => $pending_days,  // Días pendientes
]);

// Cerrar conexión
$mysqli->close();
?>
