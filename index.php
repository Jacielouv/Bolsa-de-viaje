<?php
session_start();
if (!empty($_SESSION['user_id'])) {
    header('Location: inicio.php');
    exit;
}
$error = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Bolsa de viaje</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <section id="auth-screen">
        <div class="auth-card">
            <h2>Iniciar Sesión</h2>
            <form action="login.php" method="POST">
                <input type="text" name="username" placeholder="Usuario" required>
                <input type="password" name="password" placeholder="Contraseña" required>
                <button type="submit" class="btn">Entrar</button>
            </form>
            <?php if ($error): ?>
                <p id="auth-message" class="error"><?= htmlspecialchars($error) ?></p>
            <?php endif; ?>
        </div>
    </section>
</body>
</html>
