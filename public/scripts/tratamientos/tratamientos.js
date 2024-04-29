import { validarTratamiento } from './val_tratamientos.js';

let ContentM = document.getElementById('idContentM');
let temp_id_tratamiento = "";

document.addEventListener('DOMContentLoaded', (event) =>{

	ContentM.style.display = 'none';

	cargarSelectServicio();

	seleccionarTratamiento();
	cargarFilas();
	registrarTratamiento();
	modificarTratamiento();
	eliminarTratamiento();
	atras();

});


function seleccionarTratamiento(){

	document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnSeleccionar')){

			event.preventDefault();

			document.getElementById('idRegistrar').style.display = 'none';
			ContentM.style.display = 'inherit';

			const fila = event.target.closest('tr');
			console.log(fila);

			temp_id_tratamiento = fila.cells[0].textContent.trim();

			document.getElementById('lblTratamiento').textContent = `Modificar Tratamiento (${temp_id_tratamiento} - ${fila.cells[1].textContent}):`;

			document.getElementById('idTratamiento').value = fila.cells[1].textContent;
			document.getElementById('idPrecio').value = parseFloat(fila.cells[3].textContent.replace(/\$/g, '')).toFixed(2);
			document.getElementById('idServicio').value = parseInt(fila.cells[4].textContent);
			console.log(document.getElementById('idServicio').value);

		}
	})

}

function atras(){

	document.getElementById('idCancelar').addEventListener('click', event =>{

		document.getElementById('lblTratamiento').textContent = 'Registrar nuevo Tratamiento:';
		ContentM.style.display = 'none';
		document.getElementById('formTratamiento').reset();
		document.getElementById('idRegistrar').style.display = 'flex';

	});
}

// ####################################################################################################################
// ------------------------------------------ OPERACIONES AL BACKEND --------------------------------------------------
// ####################################################  V  ###########################################################

function cargarSelectServicio(){

	let fragmento = document.createDocumentFragment();
	const selectIndex = document.getElementById('idServicio');

	fetch('/api/list-servicios')
	.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
	.then(data => {
		console.log(data);

		selectIndex.innerHTML = '<option value="">--Seleccione una Opcion--</option>';

		data.forEach( element =>{
			const option = document.createElement('option');

			option.textContent = element.nombre;
			option.value = element.id_servicio;

			fragmento.appendChild(option);
		});

		selectIndex.appendChild(fragmento);
	})
	.catch(error => {
		alert(JSON.stringify(error));
		console.error('Error: ', error);
	});
}

function cargarFilas() {
	
	let fragmento = document.createDocumentFragment();
	const t_body = document.getElementById('listaTratamientos');

	fetch('/api/list-tratamientos')
	.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
	.then(data =>{

		console.log(data);
		t_body.innerHTML = '';

		data.forEach( element =>{

			const t_row = document.createElement('tr');

			t_row.innerHTML =
			`
			<td>${element.id_tratamiento}</td>
            <td>${element.nombre}</td>
            <td>${element.servicio.nombre_servicio}</td>
            <td>${parseFloat(element.precio).toFixed(2)} $</td>
            <td style="display:none;">${element.servicio.id_servicio}</td>
            <td>
	            <button type="button" class="btn-ter2 p-2 m-0 bg3 btnSeleccionar" style="padding-bottom: 4px;"><i class="icon-pen-to-square btnSeleccionar"></i></button>
                <button type="button" class="btn-ter2 p-2 m-0 bg1 btnEliminar" style="padding-bottom: 4px;"><i class="icon-xmark btnEliminar" ></i></button>
	        </td>
			 `
			;

			fragmento.appendChild(t_row);
		});

		t_body.appendChild(fragmento);
	})
	.catch(error => {
		alert(JSON.stringify(error));
		console.error('Error: ', error);
	});
}

function registrarTratamiento(){

	const btn_registrar = document.getElementById('idRegistrar');

	btn_registrar.addEventListener('click', event =>{

		event.preventDefault();

		if(validarTratamiento(event)){

			const _nombre = document.getElementById('idTratamiento').value.trim();
		    const _precio = Number(document.getElementById('idPrecio').value.replace(/\$/g, ''));
		    const _id_servicio = parseInt(document.getElementById('idServicio').value);

			fetch('/api/registrar-tratamiento',{
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					id_servicio: _id_servicio, // Asegúrate de enviar el ID del servicio
		            nombre: _nombre,
		            precio: _precio

				})
			})
			.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
			.then(data => {

				alert(JSON.stringify(data));
				cargarFilas();
			})
			.catch(error => {
				alert(JSON.stringify(error));
				console.error('Error: ', error);
			});

			document.getElementById('formTratamiento').reset();
		}

	});
}

function modificarTratamiento(){

	const btn_modificar = document.getElementById('idModificar');

	btn_modificar.addEventListener('click', event => {

		event.preventDefault();
		if(validarTratamiento(event)){

			const _nombre = document.getElementById('idTratamiento').value.trim();
		    const _precio = Number(document.getElementById('idPrecio').value.replace(/\$/g, ''));
		    const _id_servicio = parseInt(document.getElementById('idServicio').value);

			fetch('/api/modificar-tratamiento', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					id_tratamiento: parseInt(temp_id_tratamiento),
					id_servicio: _id_servicio, // Asegúrate de enviar el ID del servicio
		            nombre: _nombre,
		            precio: _precio

				})
			})
			.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
			.then(data => {

				alert(JSON.stringify(data));
				cargarFilas();
			})
			.catch(error => {
				alert(JSON.stringify(error));
				console.error('Error: ', error);
			});

			document.getElementById('formTratamiento').reset();
			document.getElementById('lblTratamiento').textContent = `Seleccione un Paciente si desea hacer una modificacion Nuevamente:`;
			
		}

		temp_id_tratamiento = "";

	});
}

function eliminarTratamiento(){ 

		document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnEliminar')){

			event.preventDefault();
			const fila = event.target.closest('tr');

			console.log(fila);
			var resultado = window.confirm(
			`¿Esta seguro de que desea eliminar este registro de la base de datos?:\nTratamiento:\n    id_tratamiento: ${fila.cells[0].textContent.trim()},\n    nombre_tratamiento: ${fila.cells[1].textContent.trim()},\n    tipo_servicio: ${fila.cells[2].textContent.trim()},\n    precio: ${fila.cells[3].textContent.trim()}`
			);

			const _id_tratamiento = fila.cells[0].textContent.trim();

			if (resultado) {

    			fetch('/api/eliminar-tratamiento', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({
					id_tratamiento: parseInt(_id_tratamiento),
				})
			})
			.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
			.then(data => {

				alert(JSON.stringify(data));
				cargarFilas();
			})
			.catch(error => {
				alert(error.error);
				console.error('Error: ', error);
			});
			} else {
			    // El usuario hizo clic en "Cancelar"
			    console.log("Operación cancelada.");
			}
		}
	})
}