document.addEventListener('DOMContentLoaded', () => {
    const expedienteForm = document.getElementById('expedienteForm');
    const movimientoForm = document.getElementById('movimientoForm');
    const tablaResultados = document.getElementById('tablaResultados').querySelector('tbody');
    const tablaResultadosMovimientos = document.getElementById('tablaResultadosMovimientos').querySelector('tbody');
    const expedienteSelect = document.getElementById('expedienteId');
    const terminoBusqueda = document.getElementById('terminoBusqueda');
    const terminoBusquedaMovimientos = document.getElementById('terminoBusquedaMovimientos');
    const buscarBtn = document.getElementById('buscarBtn');
    const buscarMovimientosBtn = document.getElementById('buscarMovimientosBtn');
    const movimientoSelect = document.getElementById('movimientoId'); // Select para movimientos

    // Función para registrar un nuevo expediente
    expedienteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(expedienteForm));
        console.log(formData)
        console.log("Tipo de dato de formData.adjunto:", typeof formData.adjunto);

        try {
            const response = await fetch('http://localhost:3000/registrar_expediente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                alert('Expediente registrado exitosamente.');
                expedienteForm.reset();
                cargarExpedientes();
                buscarExpedientes();
            } else {
                alert('Error al registrar expediente: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrar el expediente.');
        }
    });

    // Función para registrar un nuevo movimiento
    movimientoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(movimientoForm));
    
        try {
            // Obtener el valor del campo de entrada
            const numeroExpediente = document.getElementById('expedienteId').value;
    
            // Verificar si el expediente existe antes de registrar el movimiento
            const checkResponse = await fetch(`http://localhost:3000/expediente_existe/${numeroExpediente}`);
            const checkResult = await checkResponse.json();
    
            if (!checkResult.exists) {
                alert('El número de expediente ingresado no existe.');
                return;
            }
    
            const response = await fetch('http://localhost:3000/registrar_movimiento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
            if (result.success) {
                alert('Movimiento registrado exitosamente.');
                movimientoForm.reset();
                cargarMovimientos();
                buscarMovimientos();
            } else {
                alert('Error al registrar movimiento: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrar el movimiento.');
        }
    });

    // Función para buscar expedientes
    async function buscarExpedientes() {
        const termino = terminoBusqueda.value;
    
        try {
            const response = await fetch(`http://localhost:3000/buscar_expedientes?termino=${encodeURIComponent(termino)}`);
            const expedientes = await response.json();
    
            tablaResultados.innerHTML = ''; // Limpiar resultados previos
            expedientes.forEach((expediente) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${expediente.fecha}</td>
                    <td>${expediente.numero}</td>
                    <td>${expediente.asunto}</td>
                    <td>${expediente.causante}</td>
                    <td>${expediente.adjunto}</td>
                    <td>
                        <button onclick="verDetalles(${expediente.id})">Ver Detalles</button>
                    </td> `;
    
                tablaResultados.appendChild(fila);
            });
        } catch (error) {
            console.error('Error al buscar expedientes:', error);
            alert('Hubo un error al buscar los expedientes.');
        }
    }
    
    

    // Función para cargar los expedientes en el select
    async function cargarExpedientes() {
        try {
            const response = await fetch('http://localhost:3000/listar_expedientes');
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
    
            const expedientes = await response.json();
    
            // Limpiar opciones previas
            expedienteSelect.innerHTML = '<option value="" disabled selected>Seleccione un expediente</option>';
    
            expedientes.forEach((expediente) => {
                const option = document.createElement('option');
                option.value = expediente.id;  // Se usa el 'id' del expediente
                option.textContent = `${expediente.numero} - ${expediente.asunto}`;  // Se muestra número y asunto
                expedienteSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar expedientes:', error);
            alert('Hubo un error al cargar los expedientes.');
        }
    }
    
    // Cargar expedientes al iniciar la página
    document.addEventListener('DOMContentLoaded', () => {
        cargarExpedientes();
    });
    

    // Función para ver los detalles de un expediente
    window.verDetalles = async (expedienteId) => {
        try {
            const response = await fetch(`http://localhost:3000/detalles_expediente/${expedienteId}`);
            const detalles = await response.json();

            if (detalles.success) {
                alert(`Detalles del expediente:\n${JSON.stringify(detalles, null, 2)}`);
            } else {
                alert('No se encontraron detalles para este expediente.');
            }
        } catch (error) {
            console.error('Error al obtener detalles:', error);
            alert('Hubo un error al obtener los detalles del expediente.');
        }
    };

    // Buscar movimientos
async function buscarMovimientos() {
    const termino = terminoBusquedaMovimientos.value;

    try {
        const response = await fetch(`http://localhost:3000/buscar_movimiento?termino=${encodeURIComponent(termino)}`);
        const movimientos = await response.json();

        tablaResultadosMovimientos.innerHTML = ''; // Limpiar resultados previos
        movimientos.forEach((movimiento) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${movimiento.id_movimiento}</td>
                <td>${movimiento.expediente_id}</td>
                <td>${movimiento.oficina}</td>
                <td>${movimiento.nombre_recibe}</td>
                <td>${movimiento.fecha_movimiento}</td>
                <td>${movimiento.descripcion}</td>

            `;

            tablaResultadosMovimientos.appendChild(fila);

        });
    } catch (error) {
        console.error('Error al buscar movimientos:', error);
        alert('Hubo un error al buscar los movimientos.');
    }
}


    // Cargar movimientos en el select
    async function cargarMovimientos() {
        if (!movimientoSelect) {
            console.error('El select de movimientos no está disponible.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/listar_movimiento');
            const movimientos = await response.json();

            movimientoSelect.innerHTML = '<option value="" disabled selected>Seleccione un movimiento</option>';
            movimientos.forEach((movimiento) => {
                const option = document.createElement('option');
                option.value = movimiento.id_movimiento;
                option.textContent = `${movimiento.expediente_id} - ${movimiento.oficina}`;
                movimientoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar movimientos:', error);
            alert('Hubo un error al cargar los movimientos.');
        }
    }
    

    // Navegación entre secciones
    const menuButtons = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.section');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');

            // Ocultar todas las secciones
            sections.forEach(section => section.classList.remove('active'));

            // Mostrar la sección seleccionada
            document.getElementById(target).classList.add('active');
        });
    });

    // Eventos iniciales
buscarBtn.addEventListener('click', buscarExpedientes);
buscarMovimientosBtn.addEventListener('click', buscarMovimientos);

// Cargar datos pero sin mostrar secciones
cargarExpedientes();
buscarExpedientes();
cargarMovimientos();
buscarMovimientos();

// Mostrar solo la sección de inicio
sections.forEach(section => section.classList.remove('active'));
document.getElementById('inicioSection').classList.add('active');


});
