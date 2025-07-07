
let ListaProductos = [];
let listaActiva = []; 
fetch('http://localhost:3000/api/productos')
    .then(res => res.json())
    .then(data => {
        ListaProductos = data.payload;
        init();
    })
    .catch(err => console.error('Error:', err));

// =============================== Llamar etiquetas =============================== //
let contenedorProductos =document.getElementById("contenedor-productos");
let categoriaToggle = document.getElementById("categoria-toggle");

// =============================== Imprimir Datos del cliente =============================== //
const nombre_usuario_final = localStorage.getItem("nombre_usuario");

function imprimirDatosCliente(nombre){

    // -----  // Insertando el nombre del cliente -----//
    let divNombre = document.getElementById("nombre-cliente");

    if(divNombre){
        divNombre.innerHTML = `<p>¡Hola, ${nombre}!</p>`
    };
    
};
// =============================== Rediccion de boton admin =============================== //
document.getElementById("boton-admin").addEventListener("click", () => {
    window.location.href = "http://localhost:3000/dashboard"; // Cambiá por tu link
    });


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
            <img src="${producto.imagen}" alt="" class="imagen">
            <h3 class="nombre_producto">${producto.nombre}</h3>
            <p class="descripcion" >${producto.descripcion}</p>
            <p class="precio">$${producto.precio}</p>
            <div class = "cantidad_producto">
                <button class="btn-sumar-a-carrito" id="boton-sumar"> + </button>
                <p class= "cantidad"><strong> ${producto.activo  ? "Disponible" : "No Disponible"} </strong></p>
                <button class="btn-restar-a-carrito" id="boton-restar"> - </button>
            </div>
        </div>
        `;
    });
    
    
    // -----  Lo sumo al html ----- //
    contenedorProductos.innerHTML = htmlProductos;    
    asignarEventosBotones();
    
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



// =============================== SUMAR CARRITO =============================== //

//--- Funcion que obtiene el carrito del LocalStorage, lo parsea a un array y lo retorna ---//
function obtenerCarrito() 
{
    // Recupera el carrito almacenado como string en el LocalStorage
    let carritoObtenido =localStorage.getItem("carrito");
    // Convierte el string a un objeto JavaScript (array)
    let carritoParseado = JSON.parse(carritoObtenido);
    return carritoParseado;
}

//--- Funcion que guarda el carrito recibido al LocalStorage, previamente transformado a string ---//
function guardarCarrito(carrito) 
{
    let carritoTransformadoString =JSON.stringify(carrito);
    localStorage.setItem("carrito",carritoTransformadoString);
}

function sumarAlCarrito(e) 
{
    //--- Obtengo la referencia al elemento clickeado desde en base al evento (Propiedad exclusivamente de todos los Events) ---//
    let elementoClickeado = e.target;

    let itemContenedor = elementoClickeado.parentNode;

    let elementoNombre = itemContenedor.parentNode.querySelector(".nombre_producto").textContent;
    let elementoPrecio = itemContenedor.parentNode.querySelector(".precio").textContent;
    let elementoDescripcion = itemContenedor.parentNode.querySelector(".descripcion").textContent;
    let elementoImagen = itemContenedor.parentNode.querySelector(".imagen")


    let carritoParseado = obtenerCarrito()|| [];

    let productoExistente = carritoParseado.find(producto => producto.nombre === elementoNombre);

    if(productoExistente){
        productoExistente.cantidad+=1;
    }
    else{
        carritoParseado.push({
            "nombre": elementoNombre,
            "precio": elementoPrecio,
            "descripcion": elementoDescripcion,
            "cantidad": 1,
            "imagen": elementoImagen ? elementoImagen.src : ""
        });        
    }
    alert(`Se agrego ${elementoNombre}`)
    guardarCarrito(carritoParseado)
    

}

function restarDelCarrito(e) {
    let elementoClickeado = e.target;

    let itemContenedor = elementoClickeado.parentNode;

    // Subimos al contenedor de la tarjeta completa
    let tarjeta = itemContenedor.parentNode;

    let elementoNombre = tarjeta.querySelector(".nombre_producto").textContent;

    let carrito = obtenerCarrito() || [];

    let Producto = carrito.find(producto => producto.nombre === elementoNombre);

    if (!Producto) {
        alert("No hay ningún producto cargado con ese nombre");
        return;
    }

    Producto.cantidad -= 1;

    if (Producto.cantidad <= 0) {
        carrito = carrito.filter(p => p.nombre !== elementoNombre);
        alert(`Se eliminó el producto "${elementoNombre}" del carrito.`);
    }

    if (carrito.length === 0) {
        alert("No quedó ningún producto en el carrito.");
    }

    guardarCarrito(carrito);
}


//--- [EVENTOS] Asociacion del evento "click" a los botones "+" y "-" con la funcion manejadora del evento ---//
function asignarEventosBotones() {
    const botonesSumar = document.querySelectorAll(".btn-sumar-a-carrito");
    const botonesRestar = document.querySelectorAll(".btn-restar-a-carrito");

    botonesSumar.forEach(btn => btn.addEventListener("click", sumarAlCarrito));
    botonesRestar.forEach(btn => btn.addEventListener("click", restarDelCarrito));
}


// =============================== Inicializar funciones ===============================
function init(){
    imprimirProductos(ListaProductos);
    imprimirDatosCliente(nombre_usuario_final);
    imprimirPorCategoria(ListaProductos)

};


    
