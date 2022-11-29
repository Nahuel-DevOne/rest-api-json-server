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
    // Limpiar el código HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        // Mostrar el resumen del pedido
        actualizarResumen();
    } else{
        mensajePedidoVacio();
    }
}

function actualizarResumen(){
    console.log('Desde actualizarResumen');
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');
    // Información de la mesa
    const mesa = document.createElement('DIV');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
    // Información de la hora
    const hora = document.createElement('DIV');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');
    
    // Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // Titulo de la sección
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el array de pedido
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4');
        nombreEl.textContent = nombre;

        // Cantidad del artículo
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
        
        // Precio del artículo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;
        
        // Subtotal del artículo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        // Botón para eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';

        // Función para eliminar del pedido
        btnEliminar.onclick = function(){
            eliminarProducto(id)
        }
        
        // Agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        // Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        // Agregar lista al grupo principal
        grupo.appendChild(lista)
    })

    // Agregar al resumen y al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    // Mostrar formulario de propinas
    formularioPropinas();
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad){
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    // console.log('Eliminando... ', id);
    const { pedido } = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    // Limpiar el código HTML previo
    limpiarHTML();

    if(cliente.pedido.length){
        // Mostrar el resumen del pedido
        actualizarResumen();
    } else{
        mensajePedidoVacio();
    }

    // El producto se eliminó del pedido, por lo tanto, se debe eliminar del formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center', 'fw-bold');
    texto.textContent = 'Añade los productos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas(){
    // console.log('mostrando formulario...');
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Radio button 10%
    const radio10 = document.createElement('INPUT');
    // radio10.setAttribute('type', 'radio');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');
    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);
    
    // Radio button 25%
    const radio25 = document.createElement('INPUT');
    // radio25.setAttribute('type', 'radio');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');
    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);
    
    // Radio button 50%
    const radio50 = document.createElement('INPUT');
    // radio50.setAttribute('type', 'radio');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');
    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    // Agregar al div principal 
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
    // Agregar al formulario
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calcularPropina(){
    console.log('Desde calcularPropina');
    const { pedido } = cliente;
    let subtotal = 0;
    // Calcular el subtotal a pagar
    pedido.forEach( articulo => {
        subtotal += articulo.precio * articulo.cantidad;
    });
    // Seleccionar el Radio button con la propina del cliente
    const propinaSeleccionada = document.querySelector('input[name="propina"]:checked').value;
    console.log(propinaSeleccionada);
    console.log(subtotal);
    
    // Calcular la propina
    const propina = subtotal * (parseInt(propinaSeleccionada) / 100);
    console.log(propina);
    // Calcular el total a pagar
    const total = subtotal + propina;
    console.log(total);
}