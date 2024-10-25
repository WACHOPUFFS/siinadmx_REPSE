<?php
// Display all errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

// Include connection and enable CORS
require_once 'cors.php';
require_once 'conexion.php';

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Only POST is allowed.']);
    exit;
}

// Decode the JSON input data
$data = json_decode(file_get_contents('php://input'), true);

// Check if decoding was successful
if (!$data) {
    echo json_encode(['error' => 'Invalid input. No data received.']);
    exit;
}

// Validate required fields
if (!isset(
    $data['employee_id'], 
    $data['period_id'], 
    $data['day_of_week'], 
    $data['work_week'],
    $data['entry_time'],
    $data['lunch_start_time'],
    $data['lunch_end_time'],
    $data['exit_time']
)) {
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

// Extract fields
$employee_id = intval($data['employee_id']);
$period_id = intval($data['period_id']);
$day_of_week = $mysqli->real_escape_string($data['day_of_week']);
$work_week = $mysqli->real_escape_string($data['work_week']);
$entry_time = $mysqli->real_escape_string($data['entry_time']);
$lunch_start_time = $mysqli->real_escape_string($data['lunch_start_time']);
$lunch_end_time = $mysqli->real_escape_string($data['lunch_end_time']);
$exit_time = $mysqli->real_escape_string($data['exit_time']);

// Prepare the SQL query to insert work hours
$sql = "
    INSERT INTO work_hours 
    (employee_id, period_id, day_of_week, work_week, entry_time, lunch_start_time, lunch_end_time, exit_time, created_at)
    VALUES 
    (
        $employee_id, 
        $period_id, 
        '$day_of_week', 
        '$work_week', 
        '$entry_time', 
        '$lunch_start_time', 
        '$lunch_end_time', 
        '$exit_time',
        NOW()
    )";

// Execute the query
if ($mysqli->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Work hours saved successfully.']);
} else {
    echo json_encode(['error' => 'Failed to save work hours: ' . $mysqli->error]);
}

// Close the connection
$mysqli->close();
