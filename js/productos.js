
let ListaProductos = [];
let listaActiva = []; 
fetch('http://localhost:3000/api/productos')
    .then(res => res.json())
    .then(data => {
        ListaProductos = data.payload;
        console.log(ListaProductos); 
        init();
    })
    .catch(err => console.error('Error:', err));

// =============================== Llamar etiquetas =============================== //
let contenedorProductos =document.getElementById("contenedor-productos");
let categoriaToggle = document.getElementById("categoria-toggle");

// =============================== Imprimir Datos del cliente =============================== //
function imprimirDatosCliente(){

    let nombre = "Juan"; // aca iria el nombre del usuario q puso al principio

    // -----  // Insertando el nombre del cliente -----//
    let divNombre = document.getElementById("nombre-cliente");

    if(divNombre){
        divNombre.innerHTML = `<p>¡Hola, ${nombre}!</p>`
    };
    
};


// =============================== Imprimir Productos en pantalla  =============================== //
function imprimirProductos(array){
    if (!Array.isArray(array)) {
        console.warn("El parámetro no es una lista válida:", array);
        return;
    }

    let htmlProductos = "";
    // -----  Recorro el array dado como parametro ----- //
    array.forEach(producto => {
        
        // -----  Para cada objeto del mismo le doy un espacio en el html(una carta propia) ----- //
        htmlProductos +=`
        <div class="tarjeta-producto">
            <img src="${producto.imagen}" alt="">
            <h3 class="nombre_producto">${producto.nombre}</h3>
            <p class="descripcion" >${producto.descripcion}</p>
            <p class="precio">$${producto.precio}</p>
            <div class = "cantidad_producto">
                <button class="btn-sumar-a-carrito" id="boton-sumar"> + </button>
                <p class= "cantidad"><strong> ${producto.cantidad} </strong></p>
                <button class="btn-restar-a-carrito" id="boton-restar"> - </button>
            </div>
        </div>
        `;
    });
    
    
    // -----  Lo sumo al html ----- //
    contenedorProductos.innerHTML = htmlProductos;    
    
};

// =============================== Imprimir Productos por categoria  =============================== //
function imprimirPorCategoria(array){
    categoriaToggle.addEventListener("change", () => {
        if (categoriaToggle.checked) {
            // Mostrar solo REPUESTOS
            let listaActiva = array.filter(p => p.tipo === "repuesto");

            //Una vez seleccionados los repuestos, ordena por nombre SOLO REPUESTOS
            document.getElementById("ordenar-nombre").addEventListener("click", () => {
                let ordenadosPorNombre = listaActiva.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
                imprimirProductos(ordenadosPorNombre);
            });
            
            //Una vez seleccionados los repuestos, ordena por precio SOLO REPUESTOS
            document.getElementById("ordenar-precio").addEventListener("click", () => {
                let ordenadosPorPrecio = listaActiva.slice().sort((a, b) => a.precio - b.precio);
                imprimirProductos(ordenadosPorPrecio);
            });
            
            imprimirProductos(listaActiva);
        } else {
            // Mostrar solo AUTOS
            let listaActiva = array.filter(p => p.tipo === "auto");

            //Una vez seleccionados los autos, ordena por nombre SOLO AUTOS
            document.getElementById("ordenar-nombre").addEventListener("click", () => {
                let ordenadosPorNombre = listaActiva.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
                imprimirProductos(ordenadosPorNombre);
            });
            
            //Una vez seleccionados los autos, ordena por precio SOLO AUTOS
            document.getElementById("ordenar-precio").addEventListener("click", () => {
                let ordenadosPorPrecio = listaActiva.slice().sort((a, b) => a.precio - b.precio);
                imprimirProductos(ordenadosPorPrecio);
            });

            imprimirProductos(listaActiva);
        }

    });

};

// =============================== Botones de Ordenamiento =============================== //
// --- Eventos para ordenar --- //


//--- Ordena la copia de la lista de TODOS LOS PRODUCTOS alfabéticamente por nombre y los muestra con ese orden --- //
document.getElementById("ordenar-nombre").addEventListener("click", () => {
    //--- (Buscado en documentacion)localeCompare compara dos cadenas de texto según el orden alfabético local (útil para ordenar nombres con acentos o caracteres especiales) ---//
    let ordenadosPorNombre = ListaProductos.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
    imprimirProductos(ordenadosPorNombre);
});


//--- Ordena la copia de la lista de TODOS LOS PRODUCTOS por precio de menor a mayor y los muestra con ese orden ---//
document.getElementById("ordenar-precio").addEventListener("click", () => {
    let ordenadosPorPrecio = ListaProductos.slice().sort((a, b) => a.precio - b.precio);
    imprimirProductos(ordenadosPorPrecio);
});


//TODAVIA NO ESTOY SEGURO DE QUE VAYA ESTO
window.addEventListener("DOMContentLoaded", () => 
{
    // se asigna el boton a la constante
    const botonesSumar = document.querySelectorAll(".boton-sumar");
    const botonesRestar = document.querySelectorAll(".boton-restar");

    //se le agrega el evento de click a la constante, y se le asigna la función de sumar o restar a cada boton
    botonesSumar.forEach(btn => btn.addEventListener("click", sumarAlCarrito));
    botonesRestar.forEach(btn => btn.addEventListener("click", restarDelCarrito));
});


// =============================== Inicializar funciones ===============================
function init(){
    imprimirProductos(ListaProductos);
    imprimirDatosCliente();
    imprimirPorCategoria(ListaProductos)

};


    
