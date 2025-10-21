<?php
// backend/login.php
require_once 'database.php';
require_once 'auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email and password are required.']);
    exit();
}

$email = $data->email;
$password = $data->password;

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $token = generate_jwt($user['id']);
        http_response_code(200);
        echo json_encode(['token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>