<?php
// backend/database.php

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_file = __DIR__ . '/mindmap.sqlite';
$pdo = new PDO('sqlite:' . $db_file);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
// Enable foreign key support in SQLite
$pdo->exec('PRAGMA foreign_keys = ON;');

// Check if the 'users' table exists to determine if we need to initialize the DB
$stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
$tableExists = $stmt->fetchColumn();

if (!$tableExists) {
    // Tables do not exist, so create them
    $pdo->exec("
        CREATE TABLE users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    $pdo->exec("
        CREATE TABLE projects (
            project_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            project_name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
    ");

    $pdo->exec("
        CREATE TABLE nodes (
            node_pk INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT NOT NULL,
            project_id INTEGER NOT NULL,
            label TEXT,
            position_x REAL,
            position_y REAL,
            type TEXT,
            style TEXT,
            other_data TEXT,
            UNIQUE (project_id, node_id),
            FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
        );
    ");

    $pdo->exec("
        CREATE TABLE edges (
            edge_pk INTEGER PRIMARY KEY AUTOINCREMENT,
            edge_id TEXT NOT NULL,
            project_id INTEGER NOT NULL,
            source_node TEXT NOT NULL,
            target_node TEXT NOT NULL,
            source_handle TEXT,
            target_handle TEXT,
            type TEXT,
            style TEXT,
            data TEXT,
            UNIQUE (project_id, edge_id),
            FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
        );
    ");
} else {
    // Simple migration for existing databases
    $columns = $pdo->query("PRAGMA table_info(edges)")->fetchAll(PDO::FETCH_COLUMN, 1);
    if (!in_array('source_handle', $columns)) {
        $pdo->exec("ALTER TABLE edges ADD COLUMN source_handle TEXT");
    }
    if (!in_array('target_handle', $columns)) {
        $pdo->exec("ALTER TABLE edges ADD COLUMN target_handle TEXT");
    }
}
?>