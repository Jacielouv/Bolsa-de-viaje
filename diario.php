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
    <title>Bolsa de viaje - Diario</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php include __DIR__ . '/nav.php'; ?>
    <main class="container">
        <h2>Diario de Viaje</h2>
        <div class="diary-panel">
            <input type="date" id="diary-date">
            <textarea id="diary-text" placeholder="Escribe una entrada..."></textarea>
            <label class="file-label">
                <span>Subir imagen para esta entrada</span>
                <input type="file" id="diary-image" accept="image/*">
            </label>
            <div class="row">
                <button id="save-diary" class="btn">Guardar entrada</button>
                <button id="clear-diary" class="btn alt">Borrar todo</button>
            </div>
        </div>
        <div id="diary-entries" class="entries"></div>
    </main>
    <script src="script.js"></script>
</body>
</html>
