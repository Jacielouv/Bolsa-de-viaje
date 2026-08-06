// equipamiento.js - gestión de diario, películas y juegos con Supabase o fallback localStorage
(function () {
    const qs = (s) => document.querySelector(s);
    const qsa = (s) => Array.from(document.querySelectorAll(s));

    // Configuración de Supabase.
    const SUPABASE_URL = 'https://dlmsnypnhiuzltvmtwne.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_b1vBrKF4shtjtMhFV8Bi5A_r0UHPgXB';

    let supabase = null;

    if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project-id') && !SUPABASE_ANON_KEY.includes('your-anon-key')) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    const isSupabaseReady = () => Boolean(supabase);

    function initTabs() {
        qsa('.tab-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                qsa('.tab-btn').forEach((b) => b.classList.remove('active'));
                qsa('.tab').forEach((t) => t.classList.remove('active'));
                btn.classList.add('active');
                const id = btn.dataset.tab;
                qs(`#${id}`).classList.add('active');
            });
        });
    }

    function getLocalStorageItem(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    function setLocalStorageItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    async function fetchFromSupabase(table) {
        if (!isSupabaseReady()) return null;

        const orderBy = table === 'diary_entries' ? 'date' : 'title';

        const query = supabase.from(table).select('*');
        const { data, error } = await query.order(orderBy, { ascending: false });

        if (error) {
            console.warn(`Supabase no pudo cargar ${table}:`, error.message || error);
            return null;
        }

        return data || [];
    }

    function renderDiaryEntries(entries) {
        const container = qs('#diary-entries');
        if (!container) return;

        container.innerHTML = '';
        const renderEntries = entries.slice().reverse();

        renderEntries.forEach((entry) => {
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

            if (entry.image) {
                const imageEl = document.createElement('img');
                imageEl.className = 'entry-image';
                imageEl.src = entry.image;
                imageEl.alt = 'Imagen de la entrada';
                div.appendChild(imageEl);
            }

            container.appendChild(div);

            editBtn.addEventListener('click', async () => {
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

                    if (isSupabaseReady()) {
                        const { error } = await supabase
                            .from('diary_entries')
                            .update({ text: newText })
                            .eq('id', entry.id);

                        if (error) {
                            console.error('Error editando entrada:', error);
                            return;
                        }
                    } else {
                        const localEntries = getLocalStorageItem('diaryEntries');
                        const target = localEntries.find((item) => item.id === entry.id);
                        if (target) {
                            target.text = newText;
                            setLocalStorageItem('diaryEntries', localEntries);
                        }
                    }

                    loadDiary();
                });
            });

            deleteBtn.addEventListener('click', async () => {
                if (!confirm('Eliminar esta entrada del diario?')) return;

                if (isSupabaseReady()) {
                    const { error } = await supabase.from('diary_entries').delete().eq('id', entry.id);
                    if (error) {
                        console.error('Error eliminando entrada:', error);
                        return;
                    }
                } else {
                    const localEntries = getLocalStorageItem('diaryEntries').filter((item) => item.id !== entry.id);
                    setLocalStorageItem('diaryEntries', localEntries);
                }

                loadDiary();
            });
        });
    }

    async function loadDiary() {
        if (isSupabaseReady()) {
            const data = await fetchFromSupabase('diary_entries');
            if (data) {
                renderDiaryEntries(data);
                return;
            }
        }

        const entries = getLocalStorageItem('diaryEntries');
        renderDiaryEntries(entries);
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

        const payload = { date, text, image };

        if (isSupabaseReady()) {
            const { error } = await supabase.from('diary_entries').insert([payload]);
            if (error) {
                console.error('Error guardando entrada en Supabase:', error);
            }
        } else {
            const entries = getLocalStorageItem('diaryEntries');
            entries.push({ id: crypto.randomUUID(), ...payload });
            setLocalStorageItem('diaryEntries', entries);
        }

        qs('#diary-text').value = '';
        if (fileInput) fileInput.value = '';
        loadDiary();
    }

    async function clearDiary() {
        if (!confirm('Borrar todas las entradas del diario?')) return;

        if (isSupabaseReady()) {
            const { error } = await supabase.from('diary_entries').delete().not('id', 'is', null);
            if (error) {
                console.error('Error borrando entradas:', error);
                return;
            }
        } else {
            setLocalStorageItem('diaryEntries', []);
        }

        loadDiary();
    }

    async function loadItems(key, listSelector) {
        const container = qs(listSelector);
        if (!container) return;

        container.innerHTML = '';

        if (isSupabaseReady()) {
            const table = key;
            const data = await fetchFromSupabase(table);
            if (data) {
                renderItems(data, key, container);
                return;
            }
        }

        const items = getLocalStorageItem(key);
        renderItems(items, key, container);
    }

    function renderItems(items, key, container) {
        items.forEach((it, index) => {
            const card = document.createElement('div');
            card.className = 'item-card';

            const img = document.createElement('img');
            img.src = it.image || 'imgs/placeholder.png';
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

            reviewBtn.addEventListener('click', async () => {
                const open = container.querySelectorAll('.review-panel');
                open.forEach((panel) => panel.remove());

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

                    if (isSupabaseReady()) {
                        const { error } = await supabase
                            .from(key)
                            .update({ review: newReview, rating: newRating })
                            .eq('id', it.id);

                        if (error) {
                            console.error('Error actualizando reseña:', error);
                            return;
                        }
                    } else {
                        const itemsAll = getLocalStorageItem(key);
                        itemsAll[index] = { ...itemsAll[index], review: newReview, rating: newRating };
                        setLocalStorageItem(key, itemsAll);
                    }

                    loadItems(key, `#${key === 'movies' ? 'movies-list' : 'games-list'}`);
                });
            });

            const delBtn = document.createElement('button');
            delBtn.className = 'btn alt';
            delBtn.textContent = 'Eliminar';

            delBtn.addEventListener('click', async () => {
                if (!confirm('Eliminar este elemento?')) return;

                if (isSupabaseReady()) {
                    const { error } = await supabase.from(key).delete().eq('id', it.id);
                    if (error) {
                        console.error('Error eliminando elemento:', error);
                        return;
                    }
                } else {
                    const itemsAll = getLocalStorageItem(key).filter((item) => item.id !== it.id);
                    setLocalStorageItem(key, itemsAll);
                }

                loadItems(key, `#${key === 'movies' ? 'movies-list' : 'games-list'}`);
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

        const payload = { title, image, review, rating };

        if (isSupabaseReady()) {
            const { error } = await supabase.from(key).insert([payload]);
            if (error) {
                console.error('Error guardando elemento en Supabase:', error);
            }
        } else {
            const items = getLocalStorageItem(key);
            items.push({ id: crypto.randomUUID(), ...payload });
            setLocalStorageItem(key, items);
        }

        form.reset();
        loadItems(key, fields.listSelector);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initTabs();

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

        loadDiary();
        loadItems('movies', '#movies-list');
        loadItems('games', '#games-list');
    });
})();
