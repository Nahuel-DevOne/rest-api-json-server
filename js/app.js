let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebida',
    3: 'Postres'
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

    // Obtener platillos de la API de JSON-Server.
    obtenerPlatillos();

}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'))
}

function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos';
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => mostrarPlatillos(resultado))
        .catch( error => console.log(error))
}

function mostrarPlatillos(platillos){
    // console.log(platillos);
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.value = 0;
        inputCantidad.classList.add('form-control');

        // Función que detecta la cantidad y el platillo que se está agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad})
        } 

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        // console.log(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })    
}

function agregarPlatillo(producto) {
    // Extraer el pedido actual
    let { pedido } = cliente;
    
    // Revisar que la cantidad sea mayor a cero
    if(producto.cantidad > 0) {

        // Revisar si el producto ya existe en el array de pedido
        if(pedido.some( articulo => articulo.id === producto.id)){
            // El articulo ya existe, actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            // Se asigna el nuevo array a pedido cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else{
            // El artículo no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto]        
        }       
    } else {
        // Eliminar elementos cuando la cantidad sea 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    // Mostrar el resumen
    


}