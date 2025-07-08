// ==============================
// === JAVASCRIPT BIENVENIDA ====
// ==============================

// ===== La funcion valida que al ingresarse el nombre del usuario, sea alfabético, sin números ni caracteres especiales ===== //
function validarNombre(){
    document.getElementById("nombre_usuario").addEventListener("input", function() {
        // ----- El resultado es que la cadena queda limpia de dígitos, símbolos y signos de puntuación. ----- //
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });

};
// ---- Funcion inicializada ---- //
validarNombre();


// ===== Si al apretar enviar el espacio de nombre esta vacio tira un alert,sino guarda el nombre en el localstoge ===== //
document.getElementById("boton_enviar").addEventListener("click", () => {
    const nombre = document.getElementById("nombre_usuario").value.trim();

    if (!nombre) {
        alert("Por favor, ingresá tu nombre antes de continuar.");
        return;
    }

    // ----- Guardar en localStorage ----- //
    localStorage.setItem("nombre_usuario", nombre);
    window.location.href = "productos.html";
});
