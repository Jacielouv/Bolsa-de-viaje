const story = {
    2: {
        text: "No son muchas las personas que se atreven a embarcarse en este viaje. Por no hablar de que quienes lo han hecho siguen explorando sin descanso y no encuentran su recompensa.",
    },
    3: {
        text: "En los pueblos cuentan muchas historias sobre los peligros que acechan a los viajeros durante esta travesía, aunque la mayor parte son leyendas o habladurías. A los humanos les encanta imaginarse lo que se esconde más allá del horizonte de sus vidas, pero le temen a lo desconocido.",
    },
    4: {
        text: "Por eso relatan historias fantásticas para que los demás sientan que su mundo es el único lugar seguro. Sin embargo, ocasionalmente, algunos como tú se atreven a desafiar a las historias y deciden ir más allá de sus miedos.",
    },
    5: {
        text: "Como bien sabrás, en el pasado, mis compañeros de viaje y yo derrotamos al Rey Demonio. El tesoro que todo el mundo busca se encontraba en su poder.",
    },
    6: {
        text: "Tras hacernos con él, decidimos que el tesoro debía continuar escondido. Las personas que quisieran saber cuál era deberían buscarlo por sí mismas. De lo contrario no serían dignas de su valor.",
    },

    7: {
        text: "Ahora mismo soy la única que conoce el escondrijo del tesoro. Todos los aventureros que quieren comenzar este viaje acuden a mí para que les indique el camino a seguir.",
    },

    8: {
        text: "Hacer eso, en cambio, significaría que el tesoro quedaría al alcance de cualquiera. Por ese motivo no puedo revelar cómo llegar hasta él.",
    },

    9: {
        text: "Sin embargo, hay una cosa que puedo hacer por ti. Empezar este viaje en solitario es una tarea difícil, por lo que no puedo dejar que lo hagas sin ayuda.",
    },

    10: {
        text: "Mi labor en esta travesía es unir a personas que deseen emprender el viaje y, por suerte, hace poco llegaron a mi puerta otros aventureros que esperan a alguien que los acompañe. Permíteme que te los presente.",
    },

    11: {
        text: "Estos son Cielo, Ghumer y Michi, unos pequeños aventureros con mucho entusiasmo por explorar el mundo y encontrar el tesoro. ¿Te interesa acompañarlos en esta travesía?",
    },

    final: {
        title: "La travesía continúa",
        text: "Has llegado al borde del cielo y el tiempo parece detenerse un instante. ¿Deseas seguir caminando junto a la eternidad o detenerte para mirar el mundo con calma?",
        options: [
            { text: "Seguir adelante ✦", action: "accept" },
            { text: "Quedarme un momento", action: "reject" }
        ]
    }
};

let userChoices = [];

const initialDialogueText = "Hola, heroína. Te estaba esperando. Me han contado mucho sobre ti y tu interés por encontrar el tesoro más grande de nuestro mundo.";

let dialogueIndex = 0;
const dialogueTexts = [
    initialDialogueText,
    story[2].text,
    story[3].text,
    story[4].text,
    story[5].text,
    story[6].text,
    story[7].text,
    story[8].text,
    story[9].text,
    story[10].text,
    story[11].text,
    story.final.text
];

function typeText(element, text, speed = 12, callback) {
    if (!element) return;
    let index = 0;
    element.innerHTML = '';

    function step() {
        element.innerHTML = `${text.slice(0, index + 1)}<span class="cursor"></span>`;
        const currentChar = text.charAt(index);
        index += 1;

        if (index >= text.length) {
            element.innerHTML = text;
            if (callback) callback();
            return;
        }

        const nextChar = text.charAt(index);
        // Pausas: punto/exclamación -> pausa larga; coma -> pausa más corta
        const longPause = 600; // ms for '.' and '!'
        const shortPause = 350; // ms for ','
        let delay = speed;

        if ((currentChar === '.' || currentChar === '!') && nextChar === ' ') {
            delay = longPause;
        } else if (currentChar === ',' && nextChar === ' ') {
            delay = shortPause;
        }

        setTimeout(step, delay);
    }

    step();
}

function clearDialogueControls() {
    const controls = document.getElementById('dialogue-controls');
    if (controls) {
        controls.innerHTML = '';
    }
}

function showContinueButton() {
    const controls = document.getElementById('dialogue-controls');
    if (!controls || dialogueIndex >= dialogueTexts.length - 1) return;

    setTimeout(() => {
        if (dialogueIndex === 10) {
            showCompanionChoice();
            return;
        }

        controls.innerHTML = '<button id="continue-button" class="btn">Continuar</button>';
        const continueButton = document.getElementById('continue-button');
        if (continueButton) {
            continueButton.onclick = () => {
                clearDialogueControls();
                dialogueIndex += 1;
                displayDialogue(dialogueIndex);
            };
        }
    }, 500);
}

function showCompanionChoice() {
    const controls = document.getElementById('dialogue-controls');
    if (!controls) return;

    controls.innerHTML = `
        <button id="yes-button" class="btn">Sí, por supuesto</button>
        <button id="no-button" class="btn">No, ni de coña</button>
    `;

    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');

    if (yesButton) yesButton.onclick = () => handleCompanionAnswer(true);
    if (noButton) noButton.onclick = () => moveButtonRandomly(noButton);

    showCompanionImages(true);
}

function moveButtonRandomly(button) {
    if (!button) return;

    if (button.parentElement && button.parentElement !== document.body) {
        document.body.appendChild(button);
    }

    const maxX = Math.max(window.innerWidth - button.offsetWidth - 20, 0);
    const maxY = Math.max(window.innerHeight - button.offsetHeight - 20, 0);
    const randomX = Math.floor(Math.random() * maxX) + 10;
    const randomY = Math.floor(Math.random() * maxY) + 10;

    button.style.position = 'fixed';
    button.style.transition = 'left 0.35s ease, top 0.35s ease, transform 0.35s ease';
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
    button.style.zIndex = '9999';
    button.style.transform = 'translate(0, 0)';
}

function showEquipmentPrompt() {
    hideCompanionImages();

    const dialogueText = document.getElementById('dialogue-text');
    const controls = document.getElementById('dialogue-controls');

    if (controls) {
        controls.innerHTML = '';
    }

    if (dialogueText) {
        typeText(dialogueText, '¡Estupendo! Me alegro de que hayas aceptado a estos acompañantes. Vuestro viaje comenzará este viernes, día 7 de agosto. Os he preparado esta bolsa para la travesía. Espero que disfruteis de vuestra búsqueda del . . .  GUAN PIS', 30, () => {
            if (!controls) return;
            controls.innerHTML = '<button id="receive-bag-button" class="btn">Recibir bolsa</button>';
            const receiveButton = document.getElementById('receive-bag-button');
            if (receiveButton) {
                receiveButton.onclick = () => {
                    window.location.href = 'equipamiento.html';
                };
            }
        });
    }
}

function showCompanionImages(show) {
    const imagesContainer = document.getElementById('companion-images');
    if (!imagesContainer) return;

    if (!show) {
        imagesContainer.classList.add('hidden');
        imagesContainer.innerHTML = '';
        return;
    }

    imagesContainer.classList.remove('hidden');
    imagesContainer.innerHTML = `
        <img src="imgs/Cielo.png" alt="Cielo">
        <img src="imgs/Ghumer.png" alt="Ghumer">
        <img src="imgs/Michi.png" alt="Michi">
    `;
}

function handleCompanionAnswer(accepted) {
    // If the 'no' button was moved to document.body, remove it explicitly
    const noBtn = document.getElementById('no-button');
    if (noBtn && noBtn.parentElement) {
        noBtn.parentElement.removeChild(noBtn);
    }

    clearDialogueControls();
    showCompanionImages(false);

    if (accepted) {
        showEquipmentPrompt();
    }
}

function displayDialogue(index) {
    const dialogueText = document.getElementById('dialogue-text');
    if (!dialogueText) return;

    if (index === 10) {
        showCompanionImages(true);
    } else {
        hideCompanionImages();
    }

    clearDialogueControls();
    setTimeout(() => {
        typeText(dialogueText, dialogueTexts[index], 30, showContinueButton);
    }, 700);
}

function hideCompanionImages() {
    const imagesContainer = document.getElementById('companion-images');
    if (imagesContainer) {
        imagesContainer.classList.add('hidden');
        imagesContainer.innerHTML = '';
    }
}

function showInitialDialogue(delay = 2000) {
    const dialogueBox = document.getElementById('dialogo');
    if (!dialogueBox) return;

    dialogueIndex = 0;

    setTimeout(() => {
        dialogueBox.classList.add('visible');
        setTimeout(() => {
            displayDialogue(dialogueIndex);
        }, 1500);
    }, delay);
}

function startIntro() {
    const introScreen = document.getElementById('intro-screen');
    const gameStep = document.getElementById('game-step');
    const introElement = document.getElementById('intro-text');
    const ambientSound = document.getElementById('ambient-sound');

    if (ambientSound) {
        ambientSound.volume = 0.16;
        ambientSound.play().catch(() => {});
    }

    if (introScreen && gameStep && introElement) {
        introScreen.classList.remove('hidden');
        gameStep.classList.add('hidden');

        let index = 0;
        const interval = setInterval(() => {
            introElement.innerHTML = `${introText.slice(0, index)}<span class="cursor"></span>`;
            index += 1;

            if (index > introText.length) {
                clearInterval(interval);
                introElement.innerHTML = introText;
                setTimeout(() => {
                    introScreen.classList.add('hidden');
                    gameStep.classList.remove('hidden');
                    showInitialDialogue();
                }, 1400);
            }
        }, 50);
    } else {
        showInitialDialogue();
    }
}

window.addEventListener('load', startIntro);

function nextStep(current, choice) {
    if (choice) userChoices.push(choice);

    if (current === 1) {
        renderStep(story[2], 2);
    } else if (current === 2) {
        renderStep(story[3], 3);
    } else if (current === 3) {
        renderStep(story.final, 'final');
    }
}

function renderStep(data, stepIndex) {
    document.getElementById('step-title').innerText = data.title;
    document.getElementById('step-text').innerText = data.text;

    const optionsDiv = document.getElementById('options-container');
    optionsDiv.innerHTML = '';

    data.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = opt.text;

        if (opt.action === 'accept') {
            btn.onclick = () => showEnd(true);
        } else if (opt.action === 'reject') {
            btn.onclick = (e) => evadeNo(e.target);
        } else {
            btn.onclick = () => nextStep(stepIndex, opt.choice);
        }
        optionsDiv.appendChild(btn);
    });
}

function evadeNo(button) {
    const phrases = [
        "El tiempo no se apresura...",
        "La calma de Frieren aún no ha terminado.",
        "Intenta una vez más, con paciencia.",
        "La travesía sigue llamando."
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    button.innerText = randomPhrase;
}

function showEnd(accepted) {
    const container = document.getElementById('game-step');
    container.innerHTML = `
        <h2>✦ La travesía continúa ✦</h2>
        <p class="narrative">El cielo se abre y la historia sigue avanzando. Frieren camina con serenidad, y el mundo se vuelve más claro con cada paso.</p>
        <p class="final-message">El viaje nunca termina, solo cambia de forma.</p>
    `;
}