const story = {
    2: {
        text: "No son muchas las personas que se atreven a embarcarse en este viaje. Quienes lo han hecho siguen explorando sin descanso y no encuentran su recompensa."
    },
    3: {
        text: "En los pueblos cuentan historias sobre los peligros que acechan a los viajeros, aunque la mayor parte son leyendas. A los humanos les encanta imaginar lo desconocido, pero también le temen."
    },
    4: {
        text: "Por eso relatan relatos fantásticos para sentirse seguros. Sin embargo, algunos como tú deciden desafiar esos miedos y seguir adelante."
    },
    5: {
        text: "Como bien sabrás, en el pasado mis compañeros de viaje y yo derrotamos al Rey Demonio. El tesoro que todos buscan se encontraba en su poder."
    },
    6: {
        text: "Tras hacernos con él, decidimos que debía seguir escondido. Quienes quisieran saber su ubicación deberían buscarlo por sí mismos."
    },
    7: {
        text: "Ahora mismo soy la única que conoce el escondite del tesoro. Todos los aventureros que desean comenzar este viaje acuden a mí para recibir indicaciones."
    },
    8: {
        text: "Hacer eso significaría que el tesoro quedaría al alcance de cualquiera. Por ese motivo no puedo revelar cómo llegar hasta él."
    },
    9: {
        text: "Sin embargo, hay una cosa que sí puedo hacer por ti. Empezar este viaje en soledad es una tarea difícil, así que no puedo dejarte marchar sin ayuda."
    },
    10: {
        text: "Mi labor en esta travesía es reunir a quienes desean emprenderla. Hace poco llegaron a mi puerta otros aventureros que esperan a alguien que los acompañe."
    },
    11: {
        text: "Estos son Cielo, Ghumer y Michi, pequeños aventureros con mucho entusiasmo por explorar el mundo y encontrar el tesoro. ¿Te interesa acompañarlos?"
    },
    final: {
        text: "Has llegado al borde del cielo y el tiempo parece detenerse un instante. ¿Deseas seguir caminando junto a la eternidad o detenerte para mirar el mundo con calma?"
    }
};

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

// Escribe el texto con efecto de máquina de escribir y pausas suaves.
function typeText(element, text, speed = 30, callback) {
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
        const longPause = 600;
        const shortPause = 350;
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

    if (yesButton) {
        yesButton.onclick = () => handleCompanionAnswer(true);
    }

    if (noButton) {
        noButton.onclick = () => moveButtonRandomly(noButton);
    }

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
        typeText(
            dialogueText,
            '¡Estupendo! Me alegro de que hayas aceptado a estos acompañantes. El viaje comenzará este viernes, día 7 de agosto. Te he preparado una bolsa para la travesía. Espero que disfrutes de la búsqueda del tesoro.',
            30,
            () => {
                if (!controls) return;

                controls.innerHTML = '<button id="receive-bag-button" class="btn">Recibir bolsa</button>';
                const receiveButton = document.getElementById('receive-bag-button');

                if (receiveButton) {
                    receiveButton.onclick = () => {
                        window.location.href = 'equipamiento.html';
                    };
                }
            }
        );
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
        <img src="imgs/Cielo.png" alt="Cielo" />
        <img src="imgs/Ghumer.png" alt="Ghumer" />
        <img src="imgs/Michi.png" alt="Michi" />
    `;
}

function handleCompanionAnswer(accepted) {
    const noButton = document.getElementById('no-button');
    if (noButton && noButton.parentElement) {
        noButton.parentElement.removeChild(noButton);
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

function showInitialDialogue(delay = 1500) {
    const dialogueBox = document.getElementById('dialogo');
    if (!dialogueBox) return;

    dialogueIndex = 0;

    setTimeout(() => {
        dialogueBox.classList.add('visible');
        setTimeout(() => {
            displayDialogue(dialogueIndex);
        }, 1000);
    }, delay);
}

function startIntro() {
    const ambientSound = document.getElementById('ambient-sound');

    if (ambientSound) {
        ambientSound.volume = 0.16;
        ambientSound.play().catch(() => {});
    }

    showInitialDialogue();
}

window.addEventListener('load', startIntro);