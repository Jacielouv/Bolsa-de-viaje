// equipamiento.js - gestion de diario, películas y juegos (localStorage)
(function(){
    // Helpers
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));

    function initTabs(){
        qsa('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                qsa('.tab-btn').forEach(b=>b.classList.remove('active'));
                qsa('.tab').forEach(t=>t.classList.remove('active'));
                btn.classList.add('active');
                const id = btn.dataset.tab;
                qs('#'+id).classList.add('active');
            });
        });
    }

    // DIARIO
    function loadDiary(){
        const entries = JSON.parse(localStorage.getItem('diaryEntries')||'[]');
        const renderEntries = entries.slice().reverse();
        const container = qs('#diary-entries');
        container.innerHTML = '';
        renderEntries.forEach((entry, idx)=>{
            const originalIndex = entries.length - 1 - idx;
            const div = document.createElement('div'); div.className='entry';
            const meta = document.createElement('div'); meta.className = 'entry-meta';
            const dateLabel = document.createElement('div'); dateLabel.className = 'muted'; dateLabel.textContent = entry.date;
            const actions = document.createElement('div'); actions.className = 'entry-actions';
            const editBtn = document.createElement('button'); editBtn.className='btn'; editBtn.textContent='Editar';
            const deleteBtn = document.createElement('button'); deleteBtn.className='btn alt'; deleteBtn.textContent='Eliminar';
            actions.appendChild(editBtn); actions.appendChild(deleteBtn);
            meta.appendChild(dateLabel); meta.appendChild(actions);

            const textBlock = document.createElement('div'); textBlock.className='entry-text';
            textBlock.innerHTML = entry.text.replace(/\n/g,'<br>');

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

            editBtn.addEventListener('click', ()=>{
                if (div.querySelector('.entry-edit-panel')) return;
                const panel = document.createElement('div'); panel.className='entry-edit-panel';
                panel.innerHTML = `
                    <textarea class="entry-edit">${entry.text}</textarea>
                    <div class="entry-actions">
                        <button class="btn save-entry">Guardar</button>
                        <button class="btn alt cancel-entry">Cancelar</button>
                    </div>
                `;
                div.appendChild(panel);
                panel.querySelector('.cancel-entry').addEventListener('click', ()=> panel.remove());
                panel.querySelector('.save-entry').addEventListener('click', ()=>{
                    const newText = panel.querySelector('.entry-edit').value.trim();
                    if (!newText) return;
                    entries[originalIndex].text = newText;
                    localStorage.setItem('diaryEntries', JSON.stringify(entries));
                    loadDiary();
                });
            });

            deleteBtn.addEventListener('click', ()=>{
                if (!confirm('Eliminar esta entrada del diario?')) return;
                entries.splice(originalIndex, 1);
                localStorage.setItem('diaryEntries', JSON.stringify(entries));
                loadDiary();
            });
        });
    }

    function readFileAsDataURL(file){
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    async function saveDiary(){
        const date = qs('#diary-date').value || new Date().toISOString().slice(0,10);
        const text = qs('#diary-text').value.trim();
        if(!text) return;
        const fileInput = qs('#diary-image');
        const file = fileInput?.files?.[0];
        let image;
        if (file) {
            try {
                image = await readFileAsDataURL(file);
            } catch (error) {
                console.error('Error leyendo imagen del diario:', error);
            }
        }
        const entries = JSON.parse(localStorage.getItem('diaryEntries')||'[]');
        entries.push({date,text,image});
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        qs('#diary-text').value='';
        if (fileInput) fileInput.value = '';
        loadDiary();
    }

    function clearDiary(){
        if(confirm('Borrar todas las entradas del diario?')){
            localStorage.removeItem('diaryEntries');
            loadDiary();
        }
    }

    // GENERIC ITEM LIST (movies/games)
    function loadItems(key, listSelector, renderItem){
        const items = JSON.parse(localStorage.getItem(key)||'[]');
        const container = qs(listSelector);
        container.innerHTML = '';
        items.forEach((it, idx)=>{
            const card = document.createElement('div'); card.className='item-card';
            const img = document.createElement('img'); img.src = it.image || 'imgs/placeholder.png'; img.alt = it.title;
            const info = document.createElement('div'); info.className='item-info';
            info.innerHTML = `<h3>${it.title}</h3><div class="muted">Valoración: <span class="rating">${it.rating||'—'}</span></div><p>${it.review||''}</p>`;
            const actions = document.createElement('div'); actions.className='item-actions';

            const reviewBtn = document.createElement('button'); reviewBtn.className='btn'; reviewBtn.textContent='Reseñar';
            reviewBtn.addEventListener('click', ()=>{
                // remove any other open review panels in this list
                const open = container.querySelectorAll('.review-panel');
                open.forEach(p => p.remove());

                // if panel already exists inside this card, toggle removal
                if (card.querySelector('.review-panel')) {
                    card.querySelector('.review-panel').remove();
                    return;
                }

                const panel = document.createElement('div');
                panel.className = 'review-panel';
                panel.innerHTML = `
                    <textarea class="review-input" placeholder="Escribe tu reseña...">${it.review||''}</textarea>
                    <div class="review-controls">
                        <input type="number" min="1" max="5" class="review-rating" value="${it.rating||''}" placeholder="Valoración (1-5)">
                        <div class="row">
                            <button class="btn save-review">Guardar</button>
                            <button class="btn alt cancel-review">Cancelar</button>
                        </div>
                    </div>
                `;

                info.appendChild(panel);

                panel.querySelector('.cancel-review').addEventListener('click', ()=>{
                    panel.remove();
                });

                panel.querySelector('.save-review').addEventListener('click', ()=>{
                    const newReview = panel.querySelector('.review-input').value.trim();
                    const newRating = panel.querySelector('.review-rating').value.trim();
                    const itemsAll = JSON.parse(localStorage.getItem(key)||'[]');
                    itemsAll[idx] = Object.assign({}, it, { review: newReview, rating: newRating });
                    localStorage.setItem(key, JSON.stringify(itemsAll));
                    loadItems(key, listSelector);
                });
            });

            const delBtn = document.createElement('button'); delBtn.className='btn alt'; delBtn.textContent='Eliminar';
            delBtn.addEventListener('click', ()=>{
                if(!confirm('Eliminar este elemento?')) return;
                const itemsAll = JSON.parse(localStorage.getItem(key)||'[]');
                itemsAll.splice(idx,1); localStorage.setItem(key, JSON.stringify(itemsAll));
                loadItems(key,listSelector,renderItem);
            });

            actions.appendChild(reviewBtn); actions.appendChild(delBtn);
            card.appendChild(img); card.appendChild(info); info.appendChild(actions);
            container.appendChild(card);
        });
    }

    function addItemFromForm(formSelector, key, fields){
        const form = qs(formSelector);
        const title = form.querySelector(fields.title).value.trim();
        if(!title) return;
        const image = form.querySelector(fields.image).value.trim();
        const review = form.querySelector(fields.review).value.trim();
        const rating = form.querySelector(fields.rating).value.trim();
        const items = JSON.parse(localStorage.getItem(key)||'[]');
        items.push({title,image,review,rating});
        localStorage.setItem(key, JSON.stringify(items));
        form.reset();
        loadItems(key, fields.listSelector);
    }

    // Init
    document.addEventListener('DOMContentLoaded', ()=>{
        initTabs();

        // Diary
        qs('#save-diary').addEventListener('click', saveDiary);
        qs('#clear-diary').addEventListener('click', clearDiary);
        loadDiary();

        // Movies
        qs('#movie-form').addEventListener('submit', (e)=>{ e.preventDefault(); addItemFromForm('#movie-form','movies',{
            title:'#movie-title', image:'#movie-poster', review:'#movie-review', rating:'#movie-rating', listSelector:'#movies-list'
        }); });
        loadItems('movies','#movies-list');

        // Games
        qs('#game-form').addEventListener('submit', (e)=>{ e.preventDefault(); addItemFromForm('#game-form','games',{
            title:'#game-title', image:'#game-cover', review:'#game-review', rating:'#game-rating', listSelector:'#games-list'
        }); });
        loadItems('games','#games-list');
    });

})();
