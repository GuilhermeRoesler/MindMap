<?php
// backend/projects.php
require_once 'database.php';
require_once 'auth_middleware.php';

// Authenticate user for all project operations
$user_id = authenticate();

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT id, name, nodes, edges, updatedAt FROM projects WHERE id = ? AND user_id = ?");
                $stmt->execute([$_GET['id'], $user_id]);
                $project = $stmt->fetch();
                if ($project) {
                    $project['nodes'] = json_decode($project['nodes']);
                    $project['edges'] = json_decode($project['edges']);
                    echo json_encode($project);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Project not found.']);
                }
            } else {
                $stmt = $pdo->prepare("SELECT id, name, updatedAt FROM projects WHERE user_id = ?");
                $stmt->execute([$user_id]);
                $projects = $stmt->fetchAll();
                echo json_encode($projects);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'));
            $project_id = uniqid('proj_');
            $name = $data->name;
            
            // Always use the standard initial nodes and edges, ignoring client data
            $nodes = json_encode([
                [
                    'id' => 'root',
                    'type' => 'interactive',
                    'data' => ['label' => 'Type something'],
                    'position' => ['x' => 0, 'y' => 0],
                    'deletable' => false,
                ]
            ]);
            $edges = json_encode([]);
            $updated_at = date('Y-m-d H:i:s');

            $stmt = $pdo->prepare("INSERT INTO projects (id, user_id, name, nodes, edges, updatedAt) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$project_id, $user_id, $name, $nodes, $edges, $updated_at]);
            
            http_response_code(201);
            echo json_encode([
                'id' => $project_id,
                'name' => $name,
                'nodes' => json_decode($nodes),
                'edges' => json_decode($edges),
                'updatedAt' => $updated_at
            ]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Project ID is required.']);
                exit();
            }
            $project_id = $_GET['id'];
            $data = json_decode(file_get_contents('php://input'));
            $name = $data->name;
            $nodes = json_encode($data->nodes);
            $edges = json_encode($data->edges);
            $updated_at = date('Y-m-d H:i:s');

            $stmt = $pdo->prepare("UPDATE projects SET name = ?, nodes = ?, edges = ?, updatedAt = ? WHERE id = ? AND user_id = ?");
            $stmt->execute([$name, $nodes, $edges, $updated_at, $project_id, $user_id]);
            
            http_response_code(204);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Project ID is required.']);
                exit();
            }
            $project_id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ? AND user_id = ?");
            $stmt->execute([$project_id, $user_id]);
            
            http_response_code(204);
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method Not Allowed']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>