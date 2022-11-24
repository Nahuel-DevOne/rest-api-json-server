const cliente = {
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
        console.log('Hay al menos un campo vacío');
        return;
    }
    console.log('Todos los campos están bien');
}