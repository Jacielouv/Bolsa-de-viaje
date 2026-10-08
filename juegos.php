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
    <title>Bolsa de viaje - Videojuegos</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php include __DIR__ . '/nav.php'; ?>
    <main class="container">
        <h2>Lista de Videojuegos</h2>
        <form id="game-form" class="item-form">
            <input type="text" id="game-title" placeholder="Título" required>
            <input type="text" id="game-cover" placeholder="URL de carátula (opcional)">
            <textarea id="game-review" placeholder="Reseña inicial (opcional)"></textarea>
            <input type="number" id="game-rating" min="1" max="5" placeholder="Valoración (1-5)">
            <button class="btn" type="submit">Añadir juego</button>
        </form>
        <div id="games-list" class="items-grid"></div>
    </main>
    <script src="script.js"></script>
</body>
</html>
