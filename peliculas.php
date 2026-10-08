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
    <title>Bolsa de viaje - Películas</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php include __DIR__ . '/nav.php'; ?>
    <main class="container">
        <h2>Lista de Películas</h2>
        <form id="movie-form" class="item-form">
            <input type="text" id="movie-title" placeholder="Título" required>
            <input type="text" id="movie-poster" placeholder="URL de carátula (opcional)">
            <textarea id="movie-review" placeholder="Reseña inicial (opcional)"></textarea>
            <input type="number" id="movie-rating" min="1" max="5" placeholder="Valoración (1-5)">
            <button class="btn" type="submit">Añadir película</button>
        </form>
        <div id="movies-list" class="items-grid"></div>
    </main>
    <script src="script.js"></script>
</body>
</html>
