<?php
include_once 'cors.php';
include_once 'conexion.php';

// Configurar cabeceras para la respuesta JSON
header('Content-Type: application/json');

// Consulta para obtener los roles disponibles
$query = "SELECT id, roleName FROM roles";

$result = $mysqli->query($query);

if ($result) {
    $roles = array();
    while ($row = $result->fetch_assoc()) {
        $roles[] = $row;
    }
    // Enviar los roles como respuesta en formato JSON
    echo json_encode($roles);
} else {
    // Enviar un mensaje de error en caso de fallo en la consulta
    echo json_encode(array('success' => false, 'message' => 'Error al obtener los roles.'));
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
