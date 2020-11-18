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
        console.log(this.gastos);
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

    agregarGastoListado(gastos) {
        console.log(gastos);
        const ulListado = document.querySelector('#gastos ul');

        while (ulListado.firstChild) {
            ulListado.firstChild.remove();
        }
        gastos.forEach(gasto => {
            const { nombre, cantidad, id } = gasto;
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-center"
            li.textContent = `${nombre} - ${cantidad}`;
            ulListado.appendChild(li);

            //boton para borrar el gasto
            const botonEliminar = document.createElement('a');
            botonEliminar.textContent = " X"
            li.appendChild(botonEliminar);
        })
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
    const { gastos } = presupuesto;
    ui.agregarGastoListado(gastos);
    //reiniciar el formulario
    formulario.reset();
}