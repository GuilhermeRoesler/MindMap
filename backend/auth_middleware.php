<?php
// backend/auth_middleware.php

// This middleware now uses the user ID directly as the authentication token,
// replacing the previous JWT implementation for simplicity.

function get_bearer_token() {
    $authorizationHeader = null;
    // Check for the header in different server variables
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authorizationHeader = trim($_SERVER['HTTP_AUTHORIZATION']);
    } else if (function_exists('getallheaders')) {
        $headers = getallheaders();
        // Header names are case-insensitive.
        $headers = array_change_key_case($headers, CASE_LOWER);
        if (isset($headers['authorization'])) {
            $authorizationHeader = trim($headers['authorization']);
        }
    }

    if (!empty($authorizationHeader)) {
        // The preg_match is case-insensitive (the 'i' flag)
        if (preg_match('/Bearer\s(\S+)/i', $authorizationHeader, $matches)) {
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