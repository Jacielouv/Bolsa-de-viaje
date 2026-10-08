-- Bolsa de Viaje - Esquema de base de datos MySQL

CREATE DATABASE IF NOT EXISTS bolsa_de_viaje CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bolsa_de_viaje;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diary_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    text TEXT NOT NULL,
    image_path VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(500) DEFAULT NULL,
    review TEXT DEFAULT NULL,
    rating INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(500) DEFAULT NULL,
    review TEXT DEFAULT NULL,
    rating INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Usuarios iniciales (contraseña: nuestra-bolsa-de-viaje-2026)
-- Generar hashes con: php -r "echo password_hash('nuestra-bolsa-de-viaje-2026', PASSWORD_DEFAULT);"
INSERT INTO users (username, password_hash) VALUES
    ('cielo', ''),
    ('iria', '')
ON DUPLICATE KEY UPDATE username=username;

-- NOTA: Antes de usar, ejecuta este script y luego actualiza los hashes
-- con el script PHP setup_users.php o desde la linea de comandos.
