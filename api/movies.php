<?php
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

require_once __DIR__ . '/../db.php';

$userId = $_SESSION['user_id'];
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->prepare('SELECT * FROM movies WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([$userId]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $title = trim($data['title'] ?? '');
        $image = trim($data['image'] ?? '');
        $review = trim($data['review'] ?? '');
        $rating = $data['rating'] ? (int)$data['rating'] : null;

        if ($title === '') {
            http_response_code(400);
            echo json_encode(['error' => 'El título es obligatorio']);
            exit;
        }

        $stmt = $db->prepare('INSERT INTO movies (user_id, title, image, review, rating) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$userId, $title, $image ?: null, $review ?: null, $rating]);

        echo json_encode(['id' => $db->lastInsertId(), 'success' => true]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID es obligatorio']);
            exit;
        }

        $fields = [];
        $params = [];
        foreach (['review', 'rating', 'title', 'image'] as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field] === '' ? null : $data[$field];
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No hay campos para actualizar']);
            exit;
        }

        $params[] = $id;
        $params[] = $userId;
        $stmt = $db->prepare('UPDATE movies SET ' . implode(', ', $fields) . ' WHERE id = ? AND user_id = ?');
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID es obligatorio']);
            exit;
        }

        $stmt = $db->prepare('DELETE FROM movies WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
