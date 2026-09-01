<?php
// backend/projects.php
require_once 'database.php';
require_once 'auth_middleware.php';

// Authenticate user for all project operations
$user_id = authenticate();

$method = $_SERVER['REQUEST_METHOD'];

// Helper function to assemble node object from DB row
function assemble_node($row) {
    $other_data = json_decode($row['other_data'] ?? '', true) ?: [];
    $node_data = array_merge($other_data, ['label' => $row['label']]);
    
    // Ensure isEditing is not carried over from the DB
    unset($node_data['isEditing']);

    return [
        'id' => $row['node_id'],
        'data' => $node_data,
        'position' => ['x' => (float)$row['position_x'], 'y' => (float)$row['position_y']],
        'type' => $row['type'],
        'style' => json_decode($row['style'] ?? '', true) ?: new stdClass()
    ];
}

// Helper function to assemble edge object from DB row
function assemble_edge($row) {
    return [
        'id' => $row['edge_id'],
        'source' => $row['source_node'],
        'target' => $row['target_node'],
        'type' => $row['type'] ?? 'default',
        'style' => json_decode($row['style'] ?? '', true) ?: new stdClass(),
        'data' => json_decode($row['data'] ?? '', true) ?: new stdClass()
    ];
}

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Get single project
                $project_id = $_GET['id'];
                $stmt = $pdo->prepare("SELECT project_id, project_name, updated_at as updatedAt FROM projects WHERE project_id = ? AND user_id = ?");
                $stmt->execute([$project_id, $user_id]);
                $project = $stmt->fetch();

                if ($project) {
                    // Get nodes
                    $nodes_stmt = $pdo->prepare("SELECT * FROM nodes WHERE project_id = ?");
                    $nodes_stmt->execute([$project_id]);
                    $nodes_rows = $nodes_stmt->fetchAll();
                    $project['nodes'] = array_map('assemble_node', $nodes_rows);

                    // Get edges
                    $edges_stmt = $pdo->prepare("SELECT * FROM edges WHERE project_id = ?");
                    $edges_stmt->execute([$project_id]);
                    $edges_rows = $edges_stmt->fetchAll();
                    $project['edges'] = array_map('assemble_edge', $edges_rows);
                    
                    // Rename keys for frontend compatibility
                    $project['id'] = (int)$project['project_id'];
                    $project['name'] = $project['project_name'];
                    unset($project['project_id']);
                    unset($project['project_name']);

                    echo json_encode($project);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Project not found.']);
                }
            } else {
                // Get all projects for user
                $stmt = $pdo->prepare("SELECT project_id as id, project_name as name, updated_at as updatedAt FROM projects WHERE user_id = ?");
                $stmt->execute([$user_id]);
                $projects = $stmt->fetchAll();
                // Cast id to int
                foreach ($projects as &$project) {
                    $project['id'] = (int)$project['id'];
                }
                echo json_encode($projects);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'));
            $name = $data->name;
            $updated_at = date('Y-m-d H:i:s');

            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO projects (user_id, project_name, updated_at) VALUES (?, ?, ?)");
            $stmt->execute([$user_id, $name, $updated_at]);
            $project_id = $pdo->lastInsertId();

            // Insert the initial root node
            $root_node_data = [
                'id' => 'root', 'type' => 'interactive', 'data' => ['label' => 'Type something'],
                'position' => ['x' => 0, 'y' => 0], 'deletable' => false
            ];
            $stmt = $pdo->prepare("
                INSERT INTO nodes (project_id, node_id, label, position_x, position_y, type, other_data)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $project_id, $root_node_data['id'], $root_node_data['data']['label'], $root_node_data['position']['x'],
                $root_node_data['position']['y'], $root_node_data['type'], json_encode(['deletable' => $root_node_data['deletable']])
            ]);
            $pdo->commit();
            
            $new_node_obj = assemble_node([
                'node_id' => $root_node_data['id'], 'label' => $root_node_data['data']['label'], 'position_x' => $root_node_data['position']['x'],
                'position_y' => $root_node_data['position']['y'], 'type' => $root_node_data['type'], 'style' => null,
                'other_data' => json_encode(['deletable' => $root_node_data['deletable']])
            ]);

            http_response_code(201);
            echo json_encode([
                'id' => (int)$project_id,
                'name' => $name,
                'nodes' => [$new_node_obj],
                'edges' => [],
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
            $nodes = $data->nodes;
            $edges = $data->edges;
            $updated_at = date('Y-m-d H:i:s');

            $pdo->beginTransaction();

            // Update project name and timestamp
            $stmt = $pdo->prepare("UPDATE projects SET project_name = ?, updated_at = ? WHERE project_id = ? AND user_id = ?");
            $stmt->execute([$name, $updated_at, $project_id, $user_id]);

            // Clear old nodes and edges
            $stmt = $pdo->prepare("DELETE FROM nodes WHERE project_id = ?");
            $stmt->execute([$project_id]);
            $stmt = $pdo->prepare("DELETE FROM edges WHERE project_id = ?");
            $stmt->execute([$project_id]);

            // Insert new nodes
            $node_stmt = $pdo->prepare("
                INSERT INTO nodes (project_id, node_id, label, position_x, position_y, type, style, other_data)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($nodes as $node) {
                $label = $node->data->label ?? '';
                $other_data = $node->data;
                unset($other_data->label);
                $node_stmt->execute([
                    $project_id, $node->id, $label, $node->position->x, $node->position->y, $node->type,
                    json_encode($node->style ?? null), json_encode($other_data)
                ]);
            }

            // Insert new edges
            $edge_stmt = $pdo->prepare("
                INSERT INTO edges (project_id, edge_id, source_node, target_node, type, style, data)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($edges as $edge) {
                $edge_stmt->execute([
                    $project_id, $edge->id, $edge->source, $edge->target, $edge->type ?? 'default',
                    json_encode($edge->style ?? null), json_encode($edge->data ?? null)
                ]);
            }

            $pdo->commit();
            
            http_response_code(204);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Project ID is required.']);
                exit();
            }
            $project_id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM projects WHERE project_id = ? AND user_id = ?");
            $stmt->execute([$project_id, $user_id]);
            
            http_response_code(204);
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method Not Allowed']);
            break;
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>