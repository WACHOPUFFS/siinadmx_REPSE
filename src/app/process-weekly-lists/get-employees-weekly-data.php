<?php
header('Content-Type: application/json');

require_once 'cors.php';
require_once 'conexion.php';

// Obtener los parámetros de la URL
$weekNumber = $_GET['week_number'];

// Verificar que se recibió el parámetro necesario
if (!isset($weekNumber)) {
    echo json_encode(['error' => 'Falta el parámetro week_number.']);
    exit;
}

// Sanitizar las entradas para evitar inyecciones SQL
$weekNumber = intval($weekNumber);

// Consulta para obtener los empleados y sus horas de trabajo para la semana seleccionada
$sql = "SELECT
            ea.employee_id,
            e.first_name,
            e.middle_name,
            e.last_name,
            e.employee_code,
            ea.project_id,
            p.project_name,
            ea.company_id,
            ea.assignment_date,
            ea.day_of_week,
            ea.period_number,
            ea.fiscal_year,
            ea.work_week,
            COALESCE(wh.entry_time, '00:00:00') AS entry_time,
            COALESCE(wh.lunch_start_time, '00:00:00') AS lunch_start_time,
            COALESCE(wh.lunch_end_time, '00:00:00') AS lunch_end_time,
            COALESCE(wh.exit_time, '00:00:00') AS exit_time,
            COALESCE(inc.incident_type, 'N/A') AS incident_type,
            COALESCE(inc.description, '') AS description
        FROM
            employee_assignments ea
        LEFT JOIN
            employees e ON ea.employee_id = e.employee_id
        LEFT JOIN
            projects p ON ea.project_id = p.project_id
        LEFT JOIN
            work_hours wh ON ea.employee_id = wh.employee_id AND ea.work_week = wh.work_week
        LEFT JOIN
            incidents inc ON ea.employee_id = inc.employee_id AND ea.work_week = inc.work_week
        WHERE
            ea.work_week = $weekNumber";

$result = $mysqli->query($sql);

$employeesWeekData = [];

// Verificar si se encontraron resultados
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $employeesWeekData[] = $row;
    }
}

// Devolver los resultados en formato JSON
echo json_encode($employeesWeekData);

$mysqli->close();
?>