<?php
session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$username = strtolower(trim($_POST['username'] ?? ''));
$password = $_POST['password'] ?? '';

if ($username === '' || $password === '') {
    $_SESSION['login_error'] = 'Usuario y contraseña son obligatorios.';
    header('Location: index.php');
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, password_hash FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        unset($_SESSION['login_error']);
        header('Location: inicio.php');
        exit;
    }

    $_SESSION['login_error'] = 'Usuario o contraseña incorrectos.';
    header('Location: index.php');
    exit;
} catch (PDOException $e) {
    $_SESSION['login_error'] = 'Error de conexión con la base de datos.';
    header('Location: index.php');
    exit;
}
