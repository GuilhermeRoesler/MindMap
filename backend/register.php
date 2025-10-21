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
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['message' => 'An account with this email already exists.']);
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashed_password]);

    http_response_code(201);
    echo json_encode(['message' => 'User registered successfully.']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>