let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    console.log('desde la función guardarCliente');
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some( campo => campo === '');
    if(camposVacios) {
        // Verificar si ya existe una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');
        if(!existeAlerta) {
            // Crear la alerta
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
    
            document.querySelector('.modal-body').appendChild(alerta);

            // Eliminar la alerta después de 3 segundos
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }    
        return;
    }
    // Asignar datos al objeto cliente
    cliente = { ...cliente, mesa, hora }
    // console.log(cliente);

    // Ocultar el modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    // Mostrar secciones
    mostrarSecciones();

}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'))
}

