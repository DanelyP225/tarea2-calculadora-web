var pantalla = document.getElementById("pantalla");
var listaHistorial = document.getElementById("lista-historial");
var operacionActual = "";
var reiniciarPantalla = false;

cargarHistorial();

function agregarNumero(num) {
    if (pantalla.value === "0" || reiniciarPantalla) {
        pantalla.value = num;
        reiniciarPantalla = false;
    } else {
        pantalla.value = pantalla.value + num;
    }
    operacionActual = operacionActual + num;
}

function agregarOperador(op) {
    if (operacionActual === "" && pantalla.value !== "0") {
        operacionActual = pantalla.value;
    }
    
    var ultimoCaracter = operacionActual.slice(-1);
    if (ultimoCaracter === "+" || ultimoCaracter === "-" || ultimoCaracter === "*" || ultimoCaracter === "/") {
        operacionActual = operacionActual.slice(0, -1);
    }
    
    operacionActual = operacionActual + op;
    reiniciarPantalla = true;
}

function limpiarPantalla() {
    pantalla.value = "0";
    operacionActual = "";
    reiniciarPantalla = false;
}

function borrarUltimo() {
    if (pantalla.value.length > 1) {
        pantalla.value = pantalla.value.slice(0, -1);
    } else {
        pantalla.value = "0";
    }
    operacionActual = operacionActual.slice(0, -1);
}

function calcularResultado() {
    if (operacionActual === "") {
        return;
    }

    try {
        var resultado = Function("return " + operacionActual)();
        
        if (!isFinite(resultado)) {
            pantalla.value = "Error";
            operacionActual = "";
            return;
        }

        var registro = operacionActual + " = " + resultado;
        pantalla.value = resultado;
        
        guardarEnLocalStorage(registro);
        actualizarVistaHistorial();

        operacionActual = resultado.toString();
        reiniciarPantalla = true;
    } catch (e) {
        pantalla.value = "Error";
        operacionActual = "";
    }
}

function guardarEnLocalStorage(registro) {
    var historial = obtenerHistorial();
    historial.unshift(registro); 
    localStorage.setItem("historialCalculadora", JSON.stringify(historial));
}

function obtenerHistorial() {
    var datos = localStorage.getItem("historialCalculadora");
    if (datos) {
        return JSON.parse(datos);
    }
    return [];
}

function cargarHistorial() {
    actualizarVistaHistorial();
}

function actualizarVistaHistorial() {
    var historial = obtenerHistorial();
    listaHistorial.innerHTML = "";

    if (historial.length === 0) {
        var liVacio = document.createElement("li");
        liVacio.textContent = "No hay operaciones registradas.";
        listaHistorial.appendChild(liVacio);
        return;
    }

    for (var i = 0; i < historial.length; i++) {
        var li = document.createElement("li");
        li.textContent = historial[i];
        listaHistorial.appendChild(li);
    }
}

function borrarHistorial() {
    localStorage.removeItem("historialCalculadora");
    actualizarVistaHistorial();
}