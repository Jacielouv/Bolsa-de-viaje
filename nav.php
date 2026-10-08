<?php
$currentPage = basename($_SERVER['PHP_SELF'], '.php');
?>
<header class="site-header">
    <h1>Bolsa de viaje</h1>
    <nav class="tabs">
        <a class="tab-btn <?= $currentPage === 'inicio' ? 'active' : '' ?>" href="inicio.php">Inicio</a>
        <a class="tab-btn <?= $currentPage === 'diario' ? 'active' : '' ?>" href="diario.php">Diario</a>
        <a class="tab-btn <?= $currentPage === 'peliculas' ? 'active' : '' ?>" href="peliculas.php">Películas</a>
        <a class="tab-btn <?= $currentPage === 'juegos' ? 'active' : '' ?>" href="juegos.php">Videojuegos</a>
        <a class="tab-btn" href="frieren.html">Frieren</a>
        <a href="logout.php" class="btn alt">Cerrar Sesión</a>
    </nav>
</header>
