<?php
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../config.php';

$userId = $_SESSION['user_id'];
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->prepare('SELECT * FROM diary_entries WHERE user_id = ? ORDER BY date DESC, created_at DESC');
        $stmt->execute([$userId]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $date = $data['date'] ?? date('Y-m-d');
        $text = trim($data['text'] ?? '');

        if ($text === '') {
            http_response_code(400);
            echo json_encode(['error' => 'El texto es obligatorio']);
            exit;
        }

        $imagePath = null;
        if (!empty($data['image']) && str_starts_with($data['image'], 'data:image')) {
            $parts = explode(';base64,', $data['image'], 2);
            if (count($parts) === 2) {
                $header = $parts[0];
                $ext = 'png';
                if (str_contains($header, 'jpeg') || str_contains($header, 'jpg')) $ext = 'jpg';
                elseif (str_contains($header, 'gif')) $ext = 'gif';
                elseif (str_contains($header, 'webp')) $ext = 'webp';

                $binary = base64_decode($parts[1]);
                $filename = 'diary_' . $userId . '_' . time() . '.' . $ext;
                $filepath = UPLOAD_DIR . $filename;

                if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
                if (file_put_contents($filepath, $binary)) {
                    $imagePath = 'uploads/' . $filename;
                }
            }
        }

        $stmt = $db->prepare('INSERT INTO diary_entries (user_id, date, text, image_path) VALUES (?, ?, ?, ?)');
        $stmt->execute([$userId, $date, $text, $imagePath]);

        echo json_encode(['id' => $db->lastInsertId(), 'success' => true]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        $text = $data['text'] ?? null;

        if (!$id || $text === null) {
            http_response_code(400);
            echo json_encode(['error' => 'ID y texto son obligatorios']);
            exit;
        }

        $stmt = $db->prepare('UPDATE diary_entries SET text = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([trim($text), $id, $userId]);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? null;
        $deleteAll = $data['delete_all'] ?? false;

        if ($deleteAll) {
            $stmt = $db->prepare('DELETE FROM diary_entries WHERE user_id = ?');
            $stmt->execute([$userId]);
        } elseif ($id) {
            $stmt = $db->prepare('DELETE FROM diary_entries WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $userId]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Se requiere ID o delete_all']);
            exit;
        }

        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
