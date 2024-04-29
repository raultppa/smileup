import { validarServicio } from './val_servicios.js';

let ContentM = document.getElementById('idContentM');
let idServicio = "";

document.addEventListener('DOMContentLoaded', (event) =>{

	ContentM.style.display = 'none';

	seleccionarServicio();
	cargarFilas();
	registrarServicio();
	modificarServicio();
	eliminarServicio();
	atras();

});


function seleccionarServicio(){

	document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnSeleccionar')){

			event.preventDefault();

			document.getElementById('idRegistrar').style.display = 'none';
			ContentM.style.display = 'inherit';

			const fila = event.target.closest('tr');
			console.log(fila);

			idServicio = fila.cells[0].textContent.trim();
			document.getElementById('lblServicio').textContent = `Modificar Servicio (${idServicio} - ${fila.cells[1].textContent}):`;

			document.getElementById('idServicio').value = fila.cells[1].textContent;

		}
	})

}

function atras(){

	document.getElementById('idCancelar').addEventListener('click', event =>{

		document.getElementById('lblServicio').textContent = 'Registrar nuevo Servicio:';
		ContentM.style.display = 'none';
		document.getElementById('formServicio').reset();
		document.getElementById('idRegistrar').style.display = 'flex';

	});
}

// ####################################################################################################################
// ------------------------------------------ OPERACIONES AL BACKEND --------------------------------------------------
// ####################################################  V  ###########################################################

function cargarFilas() {
	
	let fragmento = document.createDocumentFragment();
	const t_body = document.getElementById('listaServicios');

	fetch('/api/list-servicios')
	.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
	.then(data =>{

		console.log(data);
		t_body.innerHTML = '';

		data.forEach( element =>{

			const t_row = document.createElement('tr');

			t_row.innerHTML =
			`
			 <td>${element.id_servicio}</td>
	         <td>${element.nombre}</td>
	         <td>
	         <button type="button" class="btn-ter2 p-2 m-0 bg3 btnSeleccionar" style="padding-bottom: 4px;"><i class="icon-pen-to-square btnSeleccionar"></i></button>
	         <button type="button" class="btn-ter2 p-2 m-0 bg1 btnEliminar" style="padding-bottom: 4px;"><i class="icon-xmark btnEliminar"></i></button>
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

function registrarServicio(){

	const btn_registrar = document.getElementById('idRegistrar');

	btn_registrar.addEventListener('click', event =>{

		event.preventDefault();

		if(validarServicio(event)){

			const _nombre_servicio = document.getElementById('idServicio').value.trim();

			fetch('/api/registrar-servicio',{
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					nombre_servicio: _nombre_servicio

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

			document.getElementById('formServicio').reset();
		}

	});
}

function modificarServicio(){

	const btn_modificar = document.getElementById('idModificar');

	btn_modificar.addEventListener('click', event => {

		event.preventDefault();
		if(validarServicio(event)){

			const _nombre_servicio = document.getElementById('idServicio').value.trim();

			fetch('/api/modificar-servicio', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					id_servicio: parseInt(idServicio),
					nombre_servicio: _nombre_servicio

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

			document.getElementById('formServicio').reset();
			document.getElementById('lblServicio').textContent = `Seleccione un Paciente si desea hacer una modificacion Nuevamente:`;
			
		}

		idServicio = "";

	});
}

function eliminarServicio(){ 

		document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnEliminar')){

			event.preventDefault();
			const fila = event.target.closest('tr');

			console.log(fila);
			var resultado = window.confirm(
			`¿Esta seguro de que desea eliminar este registro de la base de datos?:\nServicio:\n    id_servicio: ${fila.cells[0].textContent.trim()},\n    nombre_servicio: ${fila.cells[1].textContent.trim()}`
			);

			const _id_servicio = fila.cells[0].textContent.trim();

			if (resultado) {

    			fetch('/api/eliminar-servicio', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({
					id_servicio: parseInt(_id_servicio),
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