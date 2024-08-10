
// Get base datos
let url = "/Base_de_datos.json"

function setBD(url) {
    return fetch(url)
        .then(Response => Response.json())
        .then(Data => {
            let baseDatos = Data;
            localStorage.setItem("baseDatos", JSON.stringify(baseDatos))
        })

        .catch(() => {
            console.log("error")
        })
}
function getBD() {
    return JSON.parse(localStorage.getItem("baseDatos"))

}


// funcion cargarcatalogo 
async function cargarCatalogo() {
    let content_productos = document.querySelector("#content_productos")

    if (content_productos != null) {

        let catalogo = getBD()


        if (catalogo) {
            catalogo.producto.forEach((e) => {

                let producto = document.createElement("a")

                producto.innerHTML = `
                        <div class="producto">
                            <div class="img_producto">
                                <img src="../${e.img}" alt="">
                            </div>
                            <div class="info_producto">
                                <p class="nombre">${e.nombre}</p>
                                <p class="precio">$${e.precio}</p>
                            </div>
                            <button id="agregarProducto${e.id}">Agregar</button>
                        </div>
                `
                content_productos.appendChild(producto)
            })
            agregarBtnProductos()
        }

    }

}


// base Datos eventos
let turno = 0;
let baseDatosEventos = getBD()
// funcion cargarEvento
const cargarEvento = () => {
    baseDatosEventos = getBD()
    let img = document.querySelector(".img_src");
    let nombre = document.querySelector(".nombre_evento")

    if (img != null && nombre != null) {
        let evento = baseDatosEventos.eventos[turno]
        img.src = evento.img;
        nombre.textContent = evento.nombre
    }
}
// Siguiente evento
let siguiente = () => {
    turno++
    if (turno > baseDatosEventos.eventos.length - 1) {
        turno = 0
    }
    cargarEvento()
}
// anteriro evento
let anterior = () => {
    turno--
    if (turno < baseDatosEventos.length - 1) {
        turno = baseDatosEventos.length - 1
    }
    cargarEvento()
}

const cargarDatos = () => {
    setBD(url).then(() => {
        cargarCatalogo();
        cargarEvento();
    })
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Despliegue del menu  
const toogleHeader = () => {
    let header = document.querySelector(".header")
    header.classList.toggle("toggle_header")
}

// Despliegue Preguntas Frecuentes
let btns_preguntas = document.querySelectorAll("#preguntas")
// recorrer btns
btns_preguntas.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        const box = e.currentTarget
        box.classList.toggle("toggle_pregunta")
    })
})

let idProductosDestacados = [
    // agregar los id de los productos de la base de datos mas vendidos
    /* tres leche grande, torta matilda, shots, postres indivivuales(), chocotorta, Petit four brownie,   */
]


/* Cracion del contenedor del carro de compras para todas las paginas */
let main = document.querySelector("main")
let containerCarrito = document.createElement("div")
containerCarrito.classList = "container_carrito"
containerCarrito.innerHTML = `<section class="content_carrito">

                <div class="head_cart">
                    <button onclick="toggleCarrito()">x</button>
                    <h3>Carro de compras</h3>
                </div>
                <div id="carrito" class="carrito">
                </div>
                <div class="footer_carrito">
                    <div id="totalCarrito">
                        <p>Total</p>
                        <p class="total">$</p>
                    </div>
                    <div class="btn_carrito">

                        <button>Realizar Pedido</button>
                    </div>
                    
                </div>

            </section>`

main.prepend(containerCarrito)



// Despliegue de Carro de compras
const toggleCarrito = () => {
    let carrito = document.querySelector(".container_carrito")
    carrito.classList.toggle("toggle_carrito")
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/* MODELO USUARIO */

// clase Producto para representar cada producto en la tienda
class Producto {
    constructor(id, nombre, precio, categoria, descripcion, img, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.img = img;
        this.cantidad = cantidad
    }
}

// clase carrito para manejar la logica del carrito de compras
class Carrito {
    constructor() {
        this.productos = [];
    }

    // metodo para agregar un producto al carrito
    agregarProducto(producto) {
        const productoExistente = this.productos.find(p => p.id === producto.id);
        if (productoExistente) {
            productoExistente.cantidad++;
        }
        else {
            producto.cantidad = 1;
            this.productos.push(producto)
        }
    }

    // metodo para quitar un producto del carrito por su ID 
    quitarProducto(productoId) {

        const productoExistente = this.productos.find(p => p.id === productoId)
        if (productoExistente) {
            productoExistente.cantidad--;
            if (productoExistente.cantidad === 0) {
                this.productos = this.productos.filter(p => p.id !== productoId)
            }
        }
    }

    // Metodo para obtener el total de la compra
    obtenerTotal() {
        return this.productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    }
}

// Clase usuario para manejar la logica del usuario, incluyendo el carrito
class Usuario {
    constructor(id, nombre, apellido, email, password) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.carrito = new Carrito()
    }

    // Metodo para guardar la sesion del usuario en localStorage
    guardarSesion() {
        const usuarioData = {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            password: this.password,
            carrito: this.carrito
        };

        localStorage.setItem("usuario", JSON.stringify(usuarioData))

    }

    guardarSesionCarrito() {
        let usuariosValidados = JSON.parse(localStorage.getItem("usuariosValidados"))
        if (usuariosValidados) {
            let carritoUsuario = usuariosValidados.find(id => id.id == this.id)
            carritoUsuario.carrito = this.carrito
            localStorage.setItem("usuariosValidados", JSON.stringify(usuariosValidados))
        }

    }

    // Metodo para cargar la sesion del usuario desde localStorage
    static cargarSesion() {
        const usuarioData = JSON.parse(localStorage.getItem("usuario"))
        if (usuarioData) {
            const usuario = new Usuario(usuarioData.id, usuarioData.nombre, usuarioData.apellido, usuarioData.email, usuarioData.password)
            usuario.carrito.productos = usuarioData.carrito.productos.map(p => new Producto(p.id, p.nombre, p.precio, p.categoria, p.descripcion, p.img, p.cantidad));
            return usuario
        } else {
            usuario = new Usuario("Nan", "sinUsuario", "sinUsuario", "sinUsuario", "sinUsuario")
            usuario.carrito.productos = []
            return usuario
        }
    }
    actualizarPerfil() {
        let containerUsuario = document.querySelector(".container_usuario")
        if (containerUsuario) {
            containerUsuario.innerHTML = `
            <div class="usuario">
                <div class="img">
                    <img src="media/img/logo.jpg" alt="">
                </div>
                <p class="nombre">${this.nombre} ${this.apellido}</p>
            </div>
        `
        }

        btnCerrarSesion()
    }

    // Metodo statico para cerrar la sesion del usuario
    static cerrarSesion() {
        localStorage.removeItem("usuario")
        localStorage.removeItem("autenticado")
    }

    static estaAutenticado() {
        return localStorage.getItem("autenticado") === "true";
    }
}
// ~~~~~~~~~~~*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*~~~~~~~~~~~~~~~~~~~~*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/* ** FUNCIONES DE AUTENTIFICACION ** */
// Funcion para cargar los usuarios validados desde localStorage
let usuarios = []
function cargarUsuariosValidados() {

    usuarios = JSON.parse(localStorage.getItem("usuariosValidados"))


    if (usuarios) {
        return usuarios.map(u => new Usuario(u.id, u.nombre, u.apellido, u.email, u.password, u.carrito))
    } else {
        return usuarios = []
    }
}

// Funcion para guardar los usuario validados en localStorage
function guardarUsuariosValidados() {
    localStorage.setItem("usuariosValidados", JSON.stringify(usuarios))

}

// Cargar la lista de usuarios validados al iniciar la aplicacion
let usuariosValidados = cargarUsuariosValidados()



// Funcion para validar los datos de registro de usuario
function validarDatosUsuario(nombre, apellido, email, password, passwordRepet, terminos) {
    let errorNombre = document.getElementById("errorNombre")
    let errorApellido = document.getElementById("errorApellido")
    let errorCorreo = document.getElementById("errorCorreo")
    let errorContraseña = document.getElementById("errorContraseña")
    let errorCtrRepet = document.getElementById("errorCtrRepet")
    let errorTerminos = document.getElementById("errorTerminos")

    let arrayError = [
        errorNombre,
        errorApellido,
        errorCorreo,
        errorContraseña,
        errorCtrRepet,
        errorTerminos
    ]
    arrayError.forEach(e => { e.textContent = "" })
    const errores = [];
    // Verificar que nombre no esta vacio ni tenga solo espacion en blanco

    if (!nombre.trim()) {
        errores.push("Error Nombre")
        errorNombre.textContent = "Nombre no valido"
    }
    if (!apellido.trim()) {
        errores.push("Error Apellido")
        errorApellido.textContent = "Apellido no valido"
    }

    // Verificar que el email contenga un @ 
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        errores.push("Error de Correo")
        errorCorreo.textContent = "El Mail no es valido"
    }

    // Verificar que la contraseña tenga al menos 6 caracteres, 1 numero y 1 caractes especial
    const regexPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{6,})/;
    if (!regexPassword.test(password)) {
        errores.push("Error de contraseña")
        errorContraseña.textContent = "La contraseña debe tener al menos 6 caracteres, incluir un número y un carácter especial(!@#$%^&*.)"
    }
    if (password !== passwordRepet) {
        errores.push("Error de ctrRepetida")
        errorCtrRepet.textContent = "La contraseña no son iguales"
    }

    if (terminos == false) {
        errores.push("Error de Terminos y condiciones")
        errorTerminos.textContent = "Es necesario aceptar terminos y condiciones"
    }

    return errores
}

// Funcion para registrar un nuevo usuario 
function resgistrarUsuario(nombre, apellido, email, password, passwordRepet, terminos) {
    const errores = validarDatosUsuario(nombre, apellido, email, password, passwordRepet, terminos);
    if (errores.length > 0) {
        return null
    }


    const usuarioExistente = usuariosValidados == undefined ? false : usuariosValidados.find(u => u.email === email)
    if (usuarioExistente) {
        alert("el usuario ya existe");
        return null
    } else {
        const nuevoId = usuariosValidados.length ? usuariosValidados[usuariosValidados.length - 1].id + 1 : 1
        const nuevoUsuario = new Usuario(nuevoId, nombre, apellido, email, password)
        usuarios.push(nuevoUsuario)
        localStorage.setItem("autenticado", "true")
        guardarUsuariosValidados();
        nuevoUsuario.guardarSesion()
        alertRegistroUsuario()
        setTimeout(() => {
            window.location.href = "../index.html"
        }, 2000);
        return nuevoUsuario
    }
}

// Funcion para iniciar sesion con un usuario existente


let usuario
let errorContraseñaYCorreo = document.getElementById("errorContraseñaYCorreo")
function iniciarSesion(email, password) {
    let usuarioingresado = JSON.parse(localStorage.getItem("usuariosValidados"))
    usuario = usuariosValidados.find(u => u.email === email && u.password === password)
    usuario.carrito = usuarioingresado[usuario.id - 1].carrito
    console.log(usuario);
    if (usuario) {

        localStorage.setItem("autenticado", "true")
        guardarUsuariosValidados()
        usuario.guardarSesion();
        alertIngresoUsuario(usuario.nombre)
        // cambio de pagina web
        setTimeout(() => {
            window.location.href = `../index.html`
        }, 2000);

        return usuario
    } else {
        errorContraseñaYCorreo.textContent = "correo o contraseña equivocada"
        return null
    }

}





// Funcion para cerrar la sesion del usuario actual 
function cerrarLaSesion() {
    Usuario.cerrarSesion()
    location.reload() // Recarga la pagina despues de cerrar sesion
}
// creador del boton Cerrar Sesion
let btnCerrarSesion = () => {
    let contentSesion = document.querySelector(".ingreso_registro")
    contentSesion.innerHTML = `
                <div class="cerrar center">
                    <a>Cerrar Sesion</a>
                </div>`

    let btnCerrar = document.querySelector(".cerrar")
    btnCerrar.addEventListener("click", () => {
        cerrarLaSesion()
    })

}



let form_ingreso = document.querySelector(".form_ingreso")
let btnIngresar = document.getElementById("btnIngresar")
if (form_ingreso && btnIngresar) {
    form_ingreso.addEventListener("submit", (event) => {
        event.preventDefault()
    })
    btnIngresar.addEventListener("click", () => {

        let correoIngreso = document.getElementById("CorreoIngreso").value
        let passwordIngreso = document.getElementById("ContraseñaIngreso").value
        usuariosValidados = cargarUsuariosValidados()
        iniciarSesion(correoIngreso, passwordIngreso)
        guardarUsuariosValidados()

    })
}




// ~~~~~~~**********~~~~~~~~~***************~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~************~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Controlador para majerar el carrito del usuario
class ControladorCarrito {
    constructor(usuario) {
        this.usuario = usuario;
    }

    // Metodo para agregar un producto al carrito
    agregarProductoAlCarrito(producto) {
        this.usuario.carrito.agregarProducto(producto);
        this.actualizarvista();
        this.usuario.guardarSesion();
        this.usuario.guardarSesionCarrito()


    }


    // Meotod para quitar un producto del carrito
    quitarPorductoDelCarrito(productId) {
        this.usuario.carrito.quitarProducto(productId);
        this.actualizarvista();
        this.usuario.guardarSesion()
    }

    // Metodo para actualizar la vista del carrito
    actualizarvista() {
        actualizarVistaCarrito(this.usuario.carrito);
        this.usuario.guardarSesion();


    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Funcion para actualizar la vista del carrito en el DOM
function actualizarVistaCarrito(carrito) {
    const carritoElemento = document.getElementById("carrito")
    if (carritoElemento) {
        carritoElemento.innerHTML = "";
        carrito.productos.forEach(producto => {
            const productoElemento = document.createElement("div")
            productoElemento.classList = "producto"
            productoElemento.innerHTML = `
            
                        <div class="content_img">
                            <img src=../${producto.img} alt="">
                        </div>
                        <div class="info_producto">
                            <p class="name">${producto.nombre}</p>
                            <div class="und_precio">
                                <div class="und">
                                    <label for="unidad">Cantidad : <span>${producto.cantidad}</span></label>
                                </div>
                                <div class="precio">
                                    <button class="btn_eliminar">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <p class="precio">$${producto.precio * producto.cantidad}</p>
                                    <button class="btn_sumar">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="detalles_pedido">
                            ${producto.descripcion}
                            </div>
                        </div>
            `
            carritoElemento.appendChild(productoElemento);
        })



        const totalElemento = document.getElementById("totalCarrito")
        totalElemento.textContent = `Total: $${carrito.obtenerTotal()}`;

        obtenerBtnEliminar()
        obtenerBtnSumar()


    }
}
/* NOTIFICACION AL AGREGAR UN PRODUCTO AL CARRO */
let alertNuevoProducto = () => {
    Toastify({
        text: "Nuevo producto Agregado",
        duration: "2500",
        className: "info",
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, pink, #F9DEDC)",
            color: "black",
            borderRadius: "10px",
        },
        onClick: function(){
            toggleCarrito()
            
        }
    }).showToast();
}
let alertIngresoUsuario = (usuario) => {
    Toastify({
        text: `Ingreso exitoso: ${usuario}`,
        duration: "3000",
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, pink, #F9DEDC)",
            color: "black",
            borderRadius: "10px",
            paddingRight: '40px'
        },
    }).showToast()
}
let alertRegistroUsuario = () => {
    Toastify({
        text: "Registro exitoso",
        duration: "3000",
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, pink, #F9DEDC)",
            color: "black",
            borderRadius: "10px"
        },
    }).showToast()
}





// cargar evento
window.addEventListener("DOMContentLoaded", function () {

})

// Codigo principal que se ejecuta cuando el dom se ha cargado
document.addEventListener("DOMContentLoaded", () => {


    let usuario = Usuario.cargarSesion();
    let controladorCarrito
    if (Usuario.estaAutenticado() && usuario) {
        controladorCarrito = new ControladorCarrito(usuario);
        controladorCarrito.actualizarvista()
        usuario.actualizarPerfil()


    } else {
        controladorCarrito = new ControladorCarrito(usuario);
        controladorCarrito.actualizarvista()
    }
    cargarDatos();


});



usuario = Usuario.cargarSesion()
let controladorCarrito = new ControladorCarrito(usuario)


const agregarBtnProductos = () => {
    let productosDisponibles = getBD()

    productosDisponibles.producto.forEach(prodc => {

        let botonAgregar = document.querySelector(`#agregarProducto${prodc.id}`)

        botonAgregar.addEventListener("click", () => {
            controladorCarrito.agregarProductoAlCarrito(new Producto(prodc.id, prodc.nombre, prodc.precio, prodc.categoria, prodc.descripcion, prodc.img, prodc.cantidad))
            alertNuevoProducto()
        })
    })
}

const obtenerBtnSumar = () => {
    let botonSumar = document.querySelectorAll(".btn_sumar")
    for (let i = 0; i < botonSumar.length; i++) {
        botonSumar[i].addEventListener("click", () => {
            controladorCarrito.agregarProductoAlCarrito(usuario.carrito.productos[i])
        })
    }
}
const obtenerBtnEliminar = () => {

    let botonEliminar = document.querySelectorAll(`.btn_eliminar`)

    for (let i = 0; i < botonEliminar.length; i++) {

        botonEliminar[i].addEventListener("click", () => {

            controladorCarrito.quitarPorductoDelCarrito(usuario.carrito.productos[i].id)
        })
    }
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+ */

/* FORMULARIO DE REGISTRO */
let formularioRegistro = document.querySelector(".form_registro")
let btnRegistarUsuario = document.getElementById("btnRegistrar")

if (btnRegistarUsuario && formularioRegistro) {
    btnRegistarUsuario.addEventListener("click", () => {

        const nombreRegistro = document.getElementById("nombreRegistro").value
        const apellidoRegistro = document.getElementById("apellidoRegistro").value
        const correoRegistro = document.getElementById("correoRegistro").value
        const contraseñaRegistro = document.getElementById("contraseñaRegistro").value
        const contraseñaRepetRegistro = document.getElementById("contraseñaRepetRegistro").value
        const terminosRegistro = document.getElementById("terminosRegistro").checked

        resgistrarUsuario(nombreRegistro, apellidoRegistro, correoRegistro, contraseñaRegistro, contraseñaRepetRegistro, terminosRegistro)
    })

    formularioRegistro.addEventListener("submit", function (event) {
        event.preventDefault()
    })
}


