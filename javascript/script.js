// 1. JUEGOS POR DEFECTO
const juegosPredefinidos = [
    {
        id: 1,
        titulo: "Jump dash",
        categoria: "arcade",
        descripcion: "Salta al ritmo de la música y supera los obstáculos de figuras.",
        imagen: "https://img.gamedistribution.com/212dcfed3c2b4568b0069fcc346ad421-512x384.jpg",
        urlJuego: "https://html5.gamedistribution.com/212dcfed3c2b4568b0069fcc346ad421/?gd_sdk_referrer_url=https://gamedistribution.com/games/jump-dash/"
    },
    {
        id: 2,
        titulo: "Retro Pacman",
        categoria: "arcade",
        descripcion: "El clásico laberinto original de las salas recreativas.",
        imagen: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAIAAAD9b0jDAAAAr0lEQVR4Ad2VsQ2AMAwEf4iMxCRuoUYZgY6GHdIzBR1TWGIFV0ZpUYgcIje8vokSnfSyY+NHCgFEiDGbKB+7tK5ghurTzPmqWdMEEajWLJKfWZUSVK1OqZ/Yzs1xVL94nvEqkS/E68KyvNe6iSWCfccwoCZmK+48bXUPwRRz21qan6iCM8QsKsYC6zgKMR2h/vEdCuXYUj7N7/9NHQaKw+hzGNL962QcPRafw4r+gW53SHTtJ9KAKQAAAABJRU5ErkJggg==",
        urlJuego: "https://freepacman.org"
    },
    {
        id: 3,
        titulo: "Tetrix 3d",
        categoria: "estrategia",
        descripcion: "acomoda los bloques en el espacio 3D.",
        imagen: "https://www.htmlgames.com/uploaded/game/thumb/tetrix-3d-300x200.webp",
        urlJuego: "https://cdn.htmlgames.com/Tetrix3D/"
    }
];

let listadoJuegos = JSON.parse(localStorage.getItem("mis_juegos_launcher")) || juegosPredefinidos;

// ==========================================================================
// 2. CAPTURAR ELEMENTOS HTML
// ==========================================================================
const contenedorJuegos = document.getElementById("games-container");
const inputBusqueda = document.getElementById("search-input");
const botonesCategorias = document.querySelectorAll(".category-btn");

// Modales y sus botones de acción
const modalJuego = document.getElementById("game-modal");
const modalTitle = document.getElementById("modal-game-title");
const gameFrame = document.getElementById("game-frame");
const closeModalBtn = document.getElementById("close-modal-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const modalBodyContainer = document.getElementById("modal-body-container");

// Modal del tutorial instructivo
const modalTutorial = document.getElementById("tutorial-modal");
const openTutorialBtn = document.getElementById("open-tutorial-btn");
const closeTutorialBtn = document.getElementById("close-tutorial-btn");

// Formulario de subida de juegos y controladores de la burbuja
const formulario = document.getElementById("add-game-form");
const inputImagen = document.getElementById("new-image");
const vistaNombreArchivo = document.getElementById("file-name-preview");
const toggleFormBtn = document.getElementById("toggle-form-btn");
const addGamePanel = document.getElementById("add-game-panel");

let categoriaActual = "todos";
let textoBusqueda = "";
let imagenBase64Cargada = ""; 

// ==========================================================================
// 3. RENDERIZAR JUEGOS
// ==========================================================================
function renderizarJuegos() {
    contenedorJuegos.innerHTML = "";

    const juegosFiltrados = listadoJuegos.filter(juego => {
        const coincideCategoria = (categoriaActual === "todos" || juego.categoria === categoriaActual);
        const coincideBusqueda = juego.titulo.toLowerCase().includes(textoBusqueda.toLowerCase());
        return coincideCategoria && coincideBusqueda;
    });

    if (juegosFiltrados.length === 0) {
        contenedorJuegos.innerHTML = `<p style="grid-column: 1/-1; color: #aaa; text-align: center; margin-top: 50px;">No se encontraron juegos.</p>`;
        return;
    }

    juegosFiltrados.forEach(juego => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("game-card");
        tarjeta.style.position = "relative";

        tarjeta.innerHTML = `
            <button class="delete-card-btn" data-id="${juego.id}">&times;</button>
            <div class="game-image" style="background-image: url('${juego.imagen}');"></div>
            <div class="game-info">
                <h3>${juego.titulo}</h3>
                <p>${juego.descripcion}</p>
            </div>
        `;

        tarjeta.addEventListener("click", (e) => {
            if (!e.target.classList.contains("delete-card-btn")) {
                abrirJuego(juego);
            }
        });

        const botonEliminar = tarjeta.querySelector(".delete-card-btn");
        botonEliminar.addEventListener("click", (e) => {
            e.stopPropagation();
            eliminarJuegoEspecifico(juego.id);
        });

        contenedorJuegos.appendChild(tarjeta);
    });
}

function eliminarJuegoEspecifico(idA_Borrar) {
    if (confirm("¿Estás seguro de que deseas eliminar este juego del catálogo?")) {
        listadoJuegos = listadoJuegos.filter(juego => juego.id !== idA_Borrar);
        localStorage.setItem("mis_juegos_launcher", JSON.stringify(listadoJuegos));
        renderizarJuegos();
    }
}

// ==========================================================================
// 4. CONTROL DE VENTANA DE JUEGO Y PANTALLA COMPLETA
// ==========================================================================
function abrirJuego(juego) {
    modalTitle.textContent = juego.titulo;
    gameFrame.src = juego.urlJuego;
    modalJuego.classList.add("active");
}

function cerrarJuego() {
    modalJuego.classList.remove("active");
    gameFrame.src = "";
}

fullscreenBtn.addEventListener("click", () => {
    if (modalBodyContainer.requestFullscreen) {
        modalBodyContainer.requestFullscreen();
    } else if (modalBodyContainer.webkitRequestFullscreen) {
        modalBodyContainer.webkitRequestFullscreen();
    } else if (modalBodyContainer.msRequestFullscreen) {
        modalBodyContainer.msRequestFullscreen();
    }
});

closeModalBtn.addEventListener("click", cerrarJuego);
modalJuego.addEventListener("click", (e) => { if (e.target === modalJuego) cerrarJuego(); });

// ==========================================================================
// 5. CONTROL DEL MODAL DE TUTORIAL
// ==========================================================================
if (openTutorialBtn && modalTutorial) {
    openTutorialBtn.addEventListener("click", () => modalTutorial.classList.add("active"));
}
if (closeTutorialBtn && modalTutorial) {
    closeTutorialBtn.addEventListener("click", () => modalTutorial.classList.remove("active"));
}
if (modalTutorial) {
    modalTutorial.addEventListener("click", (e) => { if (e.target === modalTutorial) modalTutorial.classList.remove("active"); });
}


// Muestra el nombre del archivo en el texto gris cuando seleccionan una foto
inputImagen.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        vistaNombreArchivo.textContent = e.target.files[0].name;
    }
});

// Procesa la subida completa del juego
formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que la página se recargue sola

    const archivo = inputImagen.files[0];
    const imagenPorDefecto = "https://unsplash.com";

    // Función interna para armar el objeto y guardarlo
    function guardarNuevoJuego(imagenFinal) {
        const nuevoJuego = {
            id: Date.now(),
            titulo: document.getElementById("new-title").value,
            categoria: document.getElementById("new-category").value,
            descripcion: document.getElementById("new-desc").value,
            imagen: imagenFinal,
            urlJuego: document.getElementById("new-url").value
        };

        listadoJuegos.unshift(nuevoJuego);
        localStorage.setItem("mis_juegos_launcher", JSON.stringify(listadoJuegos));

        // Limpieza y reinicio del formulario
        formulario.reset();
        vistaNombreArchivo.textContent = "Ningún archivo seleccionado";

        renderizarJuegos();
        alert("¡Juego añadido exitosamente con su portada!");
    }

    // Si el usuario subió una foto, esperamos a que se lea por completo antes de publicar
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(eventoLector) {
            // Cuando la lectura termina con éxito, guarda el juego usando la imagen cargada
            guardarNuevoJuego(eventoLector.target.result); 
        };
        lector.readAsDataURL(archivo);
    } else {
        // Si no subió foto, guarda inmediatamente usando la imagen por defecto
        guardarNuevoJuego(imagenPorDefecto);
    }
});


// ==========================================================================
// 8. EVENTOS FILTRADO
// ==========================================================================
inputBusqueda.addEventListener("input", (e) => {
    textoBusqueda = e.target.value;
    renderizarJuegos();
});

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        e.preventDefault();
        botonesCategorias.forEach(b => b.classList.remove("active"));
        boton.classList.add("active");
        categoriaActual = boton.getAttribute("data-category");
        renderizarJuegos();
    });
});

// ==========================================================================
// 9. LÓGICA DE LA BURBUJA DESPLEGABLE (FORMULARIO)
// ==========================================================================
if (toggleFormBtn && addGamePanel) {
    toggleFormBtn.addEventListener("click", () => {
        toggleFormBtn.classList.toggle("active");
        addGamePanel.classList.toggle("open");
    });
}

// Inicializar el catálogo al cargar la página
renderizarJuegos();
