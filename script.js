// script.js - gestión de diario, películas y juegos con backend PHP
(function () {
    const qs = (s) => document.querySelector(s);

    async function api(table, method = 'GET', body = null) {
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(`api/${table}.php`, opts);
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(err.error || `Error ${res.status}`);
        }
        return res.json();
    }

    function renderDiaryEntries(entries) {
        const container = qs('#diary-entries');
        if (!container) return;

        container.innerHTML = '';

        entries.forEach((entry) => {
            const div = document.createElement('div');
            div.className = 'entry';

            const meta = document.createElement('div');
            meta.className = 'entry-meta';

            const dateLabel = document.createElement('div');
            dateLabel.className = 'muted';
            dateLabel.textContent = entry.date;

            const actions = document.createElement('div');
            actions.className = 'entry-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn';
            editBtn.textContent = 'Editar';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn alt';
            deleteBtn.textContent = 'Eliminar';

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            meta.appendChild(dateLabel);
            meta.appendChild(actions);

            const textBlock = document.createElement('div');
            textBlock.className = 'entry-text';
            textBlock.innerHTML = (entry.text || '').replace(/\n/g, '<br>');

            div.appendChild(meta);
            div.appendChild(textBlock);

            if (entry.image_path) {
                const imageEl = document.createElement('img');
                imageEl.className = 'entry-image';
                imageEl.src = entry.image_path;
                imageEl.alt = 'Imagen de la entrada';
                div.appendChild(imageEl);
            }

            container.appendChild(div);

            editBtn.addEventListener('click', () => {
                if (div.querySelector('.entry-edit-panel')) return;

                const panel = document.createElement('div');
                panel.className = 'entry-edit-panel';
                panel.innerHTML = `
                    <textarea class="entry-edit">${entry.text || ''}</textarea>
                    <div class="entry-actions">
                        <button class="btn save-entry">Guardar</button>
                        <button class="btn alt cancel-entry">Cancelar</button>
                    </div>
                `;

                div.appendChild(panel);
                panel.querySelector('.cancel-entry').addEventListener('click', () => panel.remove());
                panel.querySelector('.save-entry').addEventListener('click', async () => {
                    const newText = panel.querySelector('.entry-edit').value.trim();
                    if (!newText) return;

                    try {
                        await api('diary', 'PUT', { id: entry.id, text: newText });
                        loadDiary();
                    } catch (e) {
                        console.error('Error editando entrada:', e);
                    }
                });
            });

            deleteBtn.addEventListener('click', async () => {
                if (!confirm('Eliminar esta entrada del diario?')) return;

                try {
                    await api('diary', 'DELETE', { id: entry.id });
                    loadDiary();
                } catch (e) {
                    console.error('Error eliminando entrada:', e);
                }
            });
        });
    }

    async function loadDiary() {
        try {
            const entries = await api('diary');
            renderDiaryEntries(entries);
        } catch (e) {
            console.error('Error cargando diario:', e);
        }
    }

    async function saveDiary() {
        const date = qs('#diary-date').value || new Date().toISOString().slice(0, 10);
        const text = qs('#diary-text').value.trim();
        if (!text) return;

        const fileInput = qs('#diary-image');
        const file = fileInput?.files?.[0];
        let image = '';

        if (file) {
            try {
                image = await readFileAsDataURL(file);
            } catch (error) {
                console.error('Error leyendo imagen del diario:', error);
            }
        }

        try {
            await api('diary', 'POST', { date, text, image });
            qs('#diary-text').value = '';
            if (fileInput) fileInput.value = '';
            loadDiary();
        } catch (e) {
            console.error('Error guardando entrada:', e);
        }
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    async function clearDiary() {
        if (!confirm('Borrar todas las entradas del diario?')) return;

        try {
            await api('diary', 'DELETE', { delete_all: true });
            loadDiary();
        } catch (e) {
            console.error('Error borrando entradas:', e);
        }
    }

    async function loadItems(key, listSelector) {
        const container = qs(listSelector);
        if (!container) return;

        try {
            const items = await api(key);
            renderItems(items, key, container);
        } catch (e) {
            console.error(`Error cargando ${key}:`, e);
        }
    }

    function renderItems(items, key, container) {
        container.innerHTML = '';

        items.forEach((it) => {
            const card = document.createElement('div');
            card.className = 'item-card';

            const img = document.createElement('img');
            img.src = it.image || 'https://placehold.co/340x260/0b1220/9aa4b2?text=Sin+imagen';
            img.alt = it.title;

            const info = document.createElement('div');
            info.className = 'item-info';
            info.innerHTML = `
                <h3>${it.title}</h3>
                <div class="muted">Valoración: <span class="rating">${it.rating || '—'}</span></div>
                <p>${it.review || ''}</p>
            `;

            const actions = document.createElement('div');
            actions.className = 'item-actions';

            const reviewBtn = document.createElement('button');
            reviewBtn.className = 'btn';
            reviewBtn.textContent = 'Reseñar';

            reviewBtn.addEventListener('click', () => {
                container.querySelectorAll('.review-panel').forEach((p) => p.remove());

                if (card.querySelector('.review-panel')) {
                    card.querySelector('.review-panel').remove();
                    return;
                }

                const panel = document.createElement('div');
                panel.className = 'review-panel';
                panel.innerHTML = `
                    <textarea class="review-input" placeholder="Escribe tu reseña...">${it.review || ''}</textarea>
                    <div class="review-controls">
                        <input type="number" min="1" max="5" class="review-rating" value="${it.rating || ''}" placeholder="Valoración (1-5)">
                        <div class="row">
                            <button class="btn save-review">Guardar</button>
                            <button class="btn alt cancel-review">Cancelar</button>
                        </div>
                    </div>
                `;

                info.appendChild(panel);

                panel.querySelector('.cancel-review').addEventListener('click', () => panel.remove());
                panel.querySelector('.save-review').addEventListener('click', async () => {
                    const newReview = panel.querySelector('.review-input').value.trim();
                    const newRating = panel.querySelector('.review-rating').value.trim();

                    try {
                        await api(key, 'PUT', { id: it.id, review: newReview, rating: newRating });
                        loadItems(key, `#${key === 'movies' ? 'movies-list' : 'games-list'}`);
                    } catch (e) {
                        console.error('Error actualizando reseña:', e);
                    }
                });
            });

            const delBtn = document.createElement('button');
            delBtn.className = 'btn alt';
            delBtn.textContent = 'Eliminar';

            delBtn.addEventListener('click', async () => {
                if (!confirm('Eliminar este elemento?')) return;

                try {
                    await api(key, 'DELETE', { id: it.id });
                    loadItems(key, `#${key === 'movies' ? 'movies-list' : 'games-list'}`);
                } catch (e) {
                    console.error('Error eliminando elemento:', e);
                }
            });

            actions.appendChild(reviewBtn);
            actions.appendChild(delBtn);
            card.appendChild(img);
            card.appendChild(info);
            info.appendChild(actions);
            container.appendChild(card);
        });
    }

    async function addItemFromForm(formSelector, key, fields) {
        const form = qs(formSelector);
        const title = form.querySelector(fields.title).value.trim();
        if (!title) return;

        const image = form.querySelector(fields.image).value.trim();
        const review = form.querySelector(fields.review).value.trim();
        const rating = form.querySelector(fields.rating).value.trim();

        try {
            await api(key, 'POST', { title, image, review, rating });
            form.reset();
            loadItems(key, fields.listSelector);
        } catch (e) {
            console.error(`Error guardando ${key}:`, e);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (qs('#save-diary')) {
            qs('#save-diary').addEventListener('click', saveDiary);
        }

        if (qs('#clear-diary')) {
            qs('#clear-diary').addEventListener('click', clearDiary);
        }

        if (qs('#movie-form')) {
            qs('#movie-form').addEventListener('submit', (e) => {
                e.preventDefault();
                addItemFromForm('#movie-form', 'movies', {
                    title: '#movie-title',
                    image: '#movie-poster',
                    review: '#movie-review',
                    rating: '#movie-rating',
                    listSelector: '#movies-list'
                });
            });
        }

        if (qs('#game-form')) {
            qs('#game-form').addEventListener('submit', (e) => {
                e.preventDefault();
                addItemFromForm('#game-form', 'games', {
                    title: '#game-title',
                    image: '#game-cover',
                    review: '#game-review',
                    rating: '#game-rating',
                    listSelector: '#games-list'
                });
            });
        }

        if (qs('#diary-entries')) loadDiary();
        if (qs('#movies-list')) loadItems('movies', '#movies-list');
        if (qs('#games-list')) loadItems('games', '#games-list');
    });
})();
