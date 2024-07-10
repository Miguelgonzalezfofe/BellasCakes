// Despliegue del menu
const toogleHeader= ()=>{
    let header = document.querySelector(".header")
    header.classList.toggle("toogle_header")
}

// Eventos especiales
let baseDatosEventos = [
    {
        nombre: "Boda",
        img: "media/img/Combo_mesa_dulce_mixto(pequeño).jpg",    
    },
    {
        nombre: "Bautizos",
        img: "media/img/IMG-20240603-WA0019-min.jpg"
    },
    {
        nombre: "Cumpleaños",
        img: "media/img/IMG-20240603-WA0004-min.jpg"
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
    const evento = baseDatosEventos[turno];
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
