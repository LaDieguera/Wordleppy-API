let intentos = 6;
let palabra = "";


function obtenerPalabra() {
    return fetch("https://random-word-api.herokuapp.com/word?lang=es&number=1&length=5")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            palabra = data[0].toUpperCase();
            console.log(`Palabra seleccionada: ${palabra}`);
        });
}


function init() {
    console.log('Esto se ejecuta solo cuando se carga la página web');
    const boton = document.getElementById("guess-button");
    boton.addEventListener("click", intentar);
}


window.addEventListener('load', () => {
    obtenerPalabra().then(() => {
        init();
    }).catch(error => {
        console.error('Error al obtener la palabra:', error);
        alert('Error al obtener la palabra. Intenta recargar la página.');
    });
});

function intentar() {
    const intento = leerIntento();
    if (intento.length !== palabra.length) {
        alert(`La palabra debe tener ${palabra.length} letras`);
        return;
    }

    mostrarIntento(intento);
    intentos--;

    if (intento === palabra) {
        terminar("¡Felicidades! Has adivinado la palabra.");
    } else if (intentos === 0) {
        terminar(`Lo siento, has perdido. La palabra era ${palabra}.`);
    }
}

function mostrarIntento(intento) {
    const GRID = document.getElementById("grid");
    const ROW = document.createElement('div');
    ROW.className = 'row';

    for (let i in palabra) {
        const SPAN = document.createElement('span');
        SPAN.className = 'letter';
        if (intento[i] === palabra[i]) { // Verde
            SPAN.innerHTML = intento[i];
            SPAN.style.backgroundColor = 'green';
        } else if (palabra.includes(intento[i])) { // Amarillo
            SPAN.innerHTML = intento[i];
            SPAN.style.backgroundColor = 'yellow';
        } else { // Gris
            SPAN.innerHTML = intento[i];
            SPAN.style.backgroundColor = 'grey';
        }
        ROW.appendChild(SPAN);
    }
    GRID.appendChild(ROW);
}

function terminar(mensaje) {
    const INPUT = document.getElementById("guess-input");
    INPUT.disabled = true;
    const BOTON = document.getElementById("guess-button");
    BOTON.disabled = true;
    let contenedor = document.getElementById('guesses');
    contenedor.innerHTML = mensaje;
}

function leerIntento() {
    let intento = document.getElementById("guess-input").value;
    intento = intento.toUpperCase();
    return intento;
}
