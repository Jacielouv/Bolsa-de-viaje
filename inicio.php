<?php
require_once __DIR__ . '/auth.php';
requireAuth();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Bolsa de viaje - Inicio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php include __DIR__ . '/nav.php'; ?>
    <main class="container">
        <h2>Inicio</h2>
        <div class="welcome-panel">
            <p>¡Bienvenidos, aventureros! Esta es vuestra bolsa de viaje, En ella encontrareis todo lo que necesitais para vuestra travesía, además de poder añadir vuestras experiencias y objetivos.</p>
            <p>¡Disfrutad del camino en compañía!</p>
            <img src="imgs/GUAN_PIS.png" alt="Guan Pis" class="welcome-image">
        </div>
    </main>
</body>
</html>
