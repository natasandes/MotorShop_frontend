//La funcion valida que al ingresarse el nombre del usuario, sea alfabético, sin números ni caracteres especiales
function validarNombre(){
    
    document.getElementById("nombre_usuario").addEventListener("input", function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });

}


validarNombre();

document.getElementById("boton_enviar").addEventListener("click", () => {
    const nombre = document.getElementById("nombre_usuario").value.trim();

    if (!nombre) {
        alert("Por favor, ingresá tu nombre antes de continuar.");
        return;
    }

    // Guardar en localStorage 
    localStorage.setItem("nombre_usuario", nombre);
    window.location.href = "productos.html";
});
