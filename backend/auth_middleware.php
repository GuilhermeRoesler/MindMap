<?php
// backend/auth_middleware.php

define('JWT_SECRET_KEY', 'your-super-secret-key-change-me'); // Change this to a long random string

function base64UrlEncode($text) {
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
}

function base64UrlDecode($text) {
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $text));
}

function generate_jwt($user_id) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode(['user_id' => $user_id, 'exp' => time() + (60*60*24)]); // 24 hour expiration

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
    $base64UrlSignature = base64UrlEncode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verify_jwt($jwt) {
    $tokenParts = explode('.', $jwt);
    if (count($tokenParts) !== 3) {
        return null;
    }
    
    $header = base64UrlDecode($tokenParts[0]);
    $payload = base64UrlDecode($tokenParts[1]);
    $signatureProvided = $tokenParts[2];

    $expiration = json_decode($payload)->exp;
    $isTokenExpired = ($expiration - time()) < 0;

    if ($isTokenExpired) {
        return null;
    }

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
    $base64UrlSignature = base64UrlEncode($signature);

    $isSignatureValid = ($base64UrlSignature === $signatureProvided);

    if ($isSignatureValid) {
        return json_decode($payload);
    } else {
        return null;
    }
}

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
    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['message' => 'Authentication token not found.']);
        exit();
    }

    $payload = verify_jwt($token);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid or expired token.']);
        exit();
    }

    return $payload->user_id;
}
?>