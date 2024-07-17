
// Despliegue del menu  
const toogleHeader= ()=>{
    let header = document.querySelector(".header")
    header.classList.toggle("toggle_header")
}
// Despliegue Preguntas Frecuentes
const togglePreguntas =()=>{
    let preguntas = document.querySelectorAll("#preguntas")
    console.log(preguntas)
    preguntas.classList.toggle("toggle_pregunta")
    console.log("si funciona el btn")
}
// Manejo del Dom -- Eventos
let baseDatosEventos = [
    {
        nombre: "Boda",
        img: "../media/img/Combo_mesa_dulce_mixto(pequeño).jpg",    
    },
    {
        nombre: "Bautizos",
        img: "../media/img/IMG-20240603-WA0019-min.jpg"
    },
    {
        nombre: "Cumpleaños",
        img: "../media/img/IMG-20240603-WA0004-min.jpg"
    }    
]

// variables del evento
let img = document.querySelector(".img_scr");
let nombre = document.querySelector(".nombre_evento")

// iterador
let turno = 0;
// cargar evento
window.addEventListener("DOMContentLoaded",function(){
    cargarEvento()
})

// funcion para cargar evento
const cargarEvento = ()=>{
    let evento = baseDatosEventos[turno]
    img.src = evento.img;
    nombre.textContent = evento.nombre
}
// Siguiente evento
let siguiente = ()=>{
    turno ++
    if(turno > baseDatosEventos.length -1){
        turno = 0
    }
    cargarEvento()
}
// anteriro evento
let anterior = ()=>{
    turno--
    if(turno < baseDatosEventos.length -1){
        turno = baseDatosEventos.length -1
    }
    cargarEvento()
}

let content_productos = document.querySelector("#content_productos")
console.log(content_productos)
const cargarCatalogo = ()=>{
    fetch("/Base_de_datos.json")
    .then(Response => Response.json())
    .then(Data =>{
        let catalogo = Data.producto
        catalogo.forEach(e=>{
            let producto = document.createElement("a")
            producto.href="../index.html"
            producto.innerHTML = `
                    <div class="producto">
                        <div class="img_producto">
                            <img src="../${e.img}" alt="">
                        </div>
                        <div class="info_producto">
                            <p class="nombre">${e.nombre}</p>
                            <p class="precio">${e.precio}</p>
                        </div>
                    </div>
            `
            content_productos.appendChild(producto)
        })
    })
}

// cargarCatalogo()


function url (rul){
    fetch(rul)
    .then(Response => Response.json())
    .then(Data=>[
        console.log(Data)
    ])
}

console.log(rul("../Base_de_datos.json"))