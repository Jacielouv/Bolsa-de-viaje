<?php
// Ejecutar una sola vez para crear los usuarios con hashes de contraseña.
// Uso: php setup_users.php
require_once __DIR__ . '/db.php';

$db = getDB();
$password = 'nuestra-bolsa-de-viaje-2026';
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare('UPDATE users SET password_hash = ? WHERE username = ?');
$stmt->execute([$hash, 'cielo']);
echo "Usuario 'cielo' actualizado.\n";

$stmt->execute([$hash, 'iria']);
echo "Usuario 'iria' actualizado.\n";

echo "Hash: $hash\n";
