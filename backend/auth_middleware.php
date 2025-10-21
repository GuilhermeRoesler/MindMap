<?php
// backend/auth_middleware.php

// This middleware now uses the user ID directly as the authentication token,
// replacing the previous JWT implementation for simplicity.

function get_bearer_token() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function authenticate() {
    global $pdo; // Access the $pdo variable from database.php

    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['message' => 'Authentication token not found.']);
        exit();
    }

    // The token is now the user ID. Validate it.
    if (!is_numeric($token) || intval($token) <= 0) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid token format.']);
        exit();
    }

    $user_id = intval($token);

    // Check if user exists in the database
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    if (!$stmt->fetch()) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid token: user not found.']);
        exit();
    }

    return $user_id;
}
?>