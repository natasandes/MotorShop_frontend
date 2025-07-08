// ==============================
// ===== JAVASCRIPT Carrito =====
// ==============================
// ---- ---- //
// ==== ==== //
// =============================== Redirección de boton admin =============================== //
document.getElementById("boton-admin").addEventListener("click", () => {
    window.location.href = "http://localhost:3000/dashboard"; // Cambiá por tu link
    });

// =============================== Obtener carrito del localStorage =============================== //
function obtenerCarrito() {
    let carritoObtenido = localStorage.getItem("carrito");
    let carritoParseado = JSON.parse(carritoObtenido);
    return carritoParseado;
};
// =============================== Cargar Productos al carrito =============================== //
function cargarProductosCarrito() {
    let carritoParseado = obtenerCarrito();
    let referenciaTable = document.getElementById("tabla-carrito").querySelector("tbody");
        
    let AcumuladorPrecioTotal = 0;

    if (carritoParseado && carritoParseado.length > 0) {
        for (const elemento of carritoParseado) {
        // ---- Por cada elemento creo una nueva fila ---- //
        let nuevaFila = document.createElement("tr");
        
        // ---- Imagen  ---- //
        let celdaImagen = document.createElement("td");
        let img = document.createElement("img");
        img.src = elemento.imagen || "https://via.placeholder.com/60"; // imagen por defecto
        img.alt = elemento.nombre;
        celdaImagen.appendChild(img);

        // ---- Nombre ---- //
        let celdaNombre = document.createElement("td");
        celdaNombre.innerText = elemento.nombre;

        // ---- Descripción ---- //
        let celdaDescripcion = document.createElement("td");
        celdaDescripcion.innerText = elemento.descripcion || "Sin descripción";

        // ---- Precio ---- //
        let celdaPrecio = document.createElement("td");
        celdaPrecio.innerText = elemento.precio;

        // ---- Cantidad ---- //
        let celdaCantidad = document.createElement("td");
        celdaCantidad.innerText = elemento.cantidad;
        
        // ---- Se añaden las celdas a la fila ---- //
        nuevaFila.appendChild(celdaImagen);
        nuevaFila.appendChild(celdaNombre);
        nuevaFila.appendChild(celdaDescripcion);
        nuevaFila.appendChild(celdaPrecio);
        nuevaFila.appendChild(celdaCantidad);

        referenciaTable.appendChild(nuevaFila);
        // ---- Quita el signo $ del precio, lo convierte a número y suma al total según la cantidad ---- //
        let precioLimpio = parseFloat((elemento.precio || "0").replace("$", ""));
        AcumuladorPrecioTotal += precioLimpio * elemento.cantidad;
        };
        // ---- formatea un número decimal y limitarlo a dos cifras después del punto ---- //
        let textoValorFinal = document.getElementById("valor-final");
        textoValorFinal.innerText = `El valor final a pagar es de: $${AcumuladorPrecioTotal.toFixed(2)}`; 
    } else {
        alert("No cargaste productos en el carrito.");
    };
};
// =============================== Limpiar Carrito =============================== //
function limpiarCarrito() {
    // ---- Elimino del localStorage el elemento "carrito" ---- //
    localStorage.removeItem("carrito");
    alert("Carrito limpiado");
    // ---- Limpio la tabla ---- //
    let referenciaTable = document.getElementById("tabla-carrito").querySelector("tbody");
    referenciaTable.innerHTML = ""; 
    // ---- Limpio el valor final ---- //
    let textoValorFinal = document.getElementById("valor-final");
    textoValorFinal.innerText = `El valor final a pagar es de: $0`;
};
// ---- Boton que da el evento limpiar carrito al ser apretado ---- //
window.addEventListener("DOMContentLoaded", () => {
    cargarProductosCarrito();
    document.querySelector(".btn-limpiar-carrito").addEventListener("click", limpiarCarrito);
});

// =============================== Generacion del PDF de compra (ticket) =============================== //
async function generarPDFCompra() {
    // ---- Carrito obetenido del local ---- //
    const carrito = obtenerCarrito();
    if (!carrito || carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    };
    // ---- Carga jsPDF desde el global (Script en el html) ---- //
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // ---- posición vertical inicial ---- //
    let y = 20; 
    doc.setFontSize(16);
    doc.text("Resumen de tu compra ", 20, y);
    y += 10;
    doc.setFontSize(12);
    let totalFinal = 0;
    // ---- For que recorre el carrito y por cada elemento genera un propio espacio en la hoja con la informacion correspondiente  ---- //
    carrito.forEach((item, index) => {
        const precioNum = parseFloat(item.precio.replace("$", ""));
        const subtotal = precioNum * item.cantidad;
        totalFinal += subtotal;
        doc.text(`Producto ${index + 1}: ${item.nombre}`, 20, y);
        y += 6;
        doc.text(`Descripción: ${item.descripcion}`, 25, y);
        y += 6;
        doc.text(`Precio: ${item.precio} | Cantidad: ${item.cantidad} | Subtotal: $${subtotal.toFixed(2)}`, 25, y);
        y += 10;
        // ---- Si se pasa de la hoja, agrega una nueva ---- //
        if (y > 270) { 
            doc.addPage();
            y = 20;
        }
    });
    // ----  Limitarlo a dos cifras después del punto ---- //
    doc.setFontSize(14);
    doc.text(`TOTAL: $${totalFinal.toFixed(2)}`, 20, y + 10);
    // ---- Descargar ---- //
    doc.save("resumen_compra.pdf");
}
// ---- Boton que da el evento generar PDF al ser apretado ---- //
document.getElementById("btn-finalizar-compra").addEventListener("click", generarPDFCompra);
