<?php
// backend/register.php
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'));

if (!isset($data->name) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Name, email, and password are required.']);
    exit();
}

$name = trim($data->name);
$email = trim($data->email);
$password = $data->password;

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Please fill all fields.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid email format.']);
    exit();
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['message' => 'An account with this email already exists.']);
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashed_password]);

    $user_id = $pdo->lastInsertId();

    // Create a default project for the new user
    $project_name = 'My first Mind Map';
    $updated_at = date('Y-m-d H:i:s');

    $stmt = $pdo->prepare("INSERT INTO projects (user_id, project_name, updated_at) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $project_name, $updated_at]);
    $project_id = $pdo->lastInsertId();

    // Insert the initial root node
    $root_node = [
        'id' => 'root',
        'type' => 'interactive',
        'data' => ['label' => 'Type something'],
        'position' => ['x' => 0, 'y' => 0],
        'deletable' => false,
    ];

    $stmt = $pdo->prepare("
        INSERT INTO nodes (project_id, node_id, label, position_x, position_y, type, other_data)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $project_id,
        $root_node['id'],
        $root_node['data']['label'],
        $root_node['position']['x'],
        $root_node['position']['y'],
        $root_node['type'],
        json_encode(['deletable' => $root_node['deletable']])
    ]);

    http_response_code(201);
    echo json_encode(['message' => 'User registered successfully.']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>