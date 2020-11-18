//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)
}


//clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

        console.log(this.restante);
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //extrayendo variables
        const { presupuesto, restante } = cantidad;

        //asignando al html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const div = document.createElement('div');
        div.classList.add("text-center", "alert")
        div.textContent = mensaje;

        if (tipo === 'error') {
            div.classList.add("alert-danger");
        } else {
            div.classList.add("alert-success");
        }


        document.querySelector('.primario').insertBefore(div, formulario);

        setTimeout(() => {
            div.remove();
        }, 3000);
    }

    actualizarRestante(restante) {
        const divRestante = document.querySelector('#restante');
        divRestante.textContent = restante;
    }

    agregarGastoListado(gastos) {
        const ulListado = document.querySelector('#gastos ul');

        while (ulListado.firstChild) {
            ulListado.firstChild.remove();
        }
        gastos.forEach(gasto => {
            const { nombre, cantidad, id } = gasto;
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.setAttribute('data-id', id);
            //li.dataset.id = id
            li.innerHTML = `${nombre} <span="badge badge-primary badge-pill"> $${cantidad} </span>`;
            ulListado.appendChild(li);

            //boton para borrar el gasto
            const botonEliminar = document.createElement('button');
            botonEliminar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            botonEliminar.innerHTML = " Borrar &times;"
            li.appendChild(botonEliminar);
        })
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        }

        //si el total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//instanciar
const ui = new UI();
let presupuesto;

//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("Cual es tu presupuesto?");

    if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad debe ser monto valido', 'error');
        return;
    }

    //generando objeto de tipo gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta("Correcto!");

    //imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);

    //actualizar restante
    ui.actualizarRestante(restante);

    //comprobar presupuesto
    ui.comprobarPresupuesto(presupuesto);
    //reiniciar el formulario
    formulario.reset();
}