import { validarDentista } from './val_dentistas.js';

let ContentM = document.getElementById('idContentM');
let Tlfn2 = document.getElementById('idTelefono2');
let temp_cedula = "";

document.addEventListener('DOMContentLoaded', (event) =>{

	ContentM.style.display = 'none';
	Tlfn2.style.display = 'none';

	cargarSelectEspecialidad()

	agregarTlfn();
	seleccionarDentista();
	cargarFilas();
	registrarDentista();
	modificarDentista();
	eliminarDentista();
	atras();

});

function agregarTlfn(){

	document.getElementById('idAgregarTlfn').addEventListener('click', event => {
		Tlfn2.style.display = 'inherit';
		document.getElementById('idAgregarTlfn').style.display = 'none';
	});
}

function seleccionarDentista(){

	document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnSeleccionar')){

			event.preventDefault();

			document.getElementById('idRegistrar').style.display = 'none';
			ContentM.style.display = 'inherit';
			Tlfn2.style.display = 'inherit';
			document.getElementById('idAgregarTlfn').style.display = 'none';

			const fila = event.target.closest('tr');
			console.log(fila);

			temp_cedula = fila.cells[0].textContent.trim();
			document.getElementById('lblDentistas').textContent = `Modificar Dentista (${temp_cedula} || ${fila.cells[1].textContent} ${fila.cells[2].textContent}):`;

			document.getElementById('idCedula').value = fila.cells[0].textContent;
			document.getElementById('idNombres').value = fila.cells[1].textContent;
			document.getElementById('idApellidos').value = fila.cells[2].textContent;
			const telefonos = fila.cells[3].innerHTML.split('<br>');
			document.getElementById('idTelefono').value = telefonos[0];
			document.getElementById('idTelefono2').value = (telefonos[1]) ? telefonos[1] : "";
			document.getElementById('idEspecialidad').value = parseInt(fila.cells[5].textContent);
			console.log(document.getElementById('idEspecialidad').value);

		}
	})

}

function atras(){

	document.getElementById('idCancelar').addEventListener('click', event =>{

		document.getElementById('lblDentistas').textContent = 'Registrar nuevo paciente:';
		ContentM.style.display = 'none';
		document.getElementById('FormDentista').reset();
		document.getElementById('idRegistrar').style.display = 'flex';
		Tlfn2.style.display = 'none';
		document.getElementById('idAgregarTlfn').style.display = 'inherit';

	});
}

// ####################################################################################################################
// ------------------------------------------ OPERACIONES AL BACKEND --------------------------------------------------
// ####################################################  V  ###########################################################

function cargarSelectEspecialidad(){

	let fragmento = document.createDocumentFragment();
	const selectIndex = document.getElementById('idEspecialidad');

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

function cargarFilas(){

	let fragmento = document.createDocumentFragment();
	const t_body = document.getElementById('ListaDentistas');

	fetch('/api/list-dentistas')
	.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
	.then(data =>{

		console.log(data);
		t_body.innerHTML = '';

		data.forEach( element =>{

			const t_row = document.createElement('tr');
			const status = element.activo === 1 ? "SI" : "NO";

			t_row.innerHTML =
			`
			 <td>${element.cedula_dentista}</td>
             <td>${element.nombres}</td>
             <td>${element.apellidos}</td>
             <td>${element.telefonos.split(',').join('<br>')}</td>
             <td>${element.especialidad.nombre_especialidad}</td>
             <td style="display:none;">${element.especialidad.id_especialidad}</td>
             <td>
                <button class="btn-ter2 p-2 m-0 btnSeleccionar bg3" style="padding-bottom: 4px;"><i class="icon-pen-to-square btnSeleccionar"></i></button>
		 		<button class="btn-ter2 p-2 m-0 btnEliminar bg1" style="padding-bottom: 4px;"><i class="icon-xmark btnEliminar"></i></button>
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

function registrarDentista(){

	const btn_registrar = document.getElementById('idRegistrar');

	btn_registrar.addEventListener('click', event =>{

		event.preventDefault();

		if(validarDentista(event)){

			const _telefonos = [];

			const _cedula = document.getElementById('idCedula').value.trim();
			const _nombres = document.getElementById('idNombres').value.trim();
			const _apellidos = document.getElementById('idApellidos').value.trim();
			const _id_especialidad = document.getElementById('idEspecialidad').value;

			if(document.getElementById('idTelefono2').value == '' || document.getElementById('idTelefono2').value == null){
				
				_telefonos.push(document.getElementById('idTelefono').value.trim());
			}else{
				console.log("PUSHEADO");
				_telefonos.push(document.getElementById('idTelefono').value.trim());
				_telefonos.push(document.getElementById('idTelefono2').value.trim());
			}

			fetch('/api/registrar-dentista',{
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					cedula_dentista: parseInt(_cedula),
					nombres: _nombres,
					apellidos: _apellidos,
					id_especialidad: parseInt(_id_especialidad),
					telefonos: _telefonos

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

			document.getElementById('FormDentista').reset();
		}

	});
}

function modificarDentista(){

	const btn_modificar = document.getElementById('idModificar');

	btn_modificar.addEventListener('click', event => {

		event.preventDefault();
		if(validarDentista(event)){

			const _telefonos = [];

			const _temp_cedula = temp_cedula;
			const _cedula = document.getElementById('idCedula').value.trim();
			const _nombres = document.getElementById('idNombres').value.trim();
			const _apellidos = document.getElementById('idApellidos').value.trim();
			const _id_especialidad = document.getElementById('idEspecialidad').value;

			if(document.getElementById('idTelefono2').value == '' || document.getElementById('idTelefono2').value == null){
				
				_telefonos.push(document.getElementById('idTelefono').value.trim());
			}else{
				console.log("PUSHEADO");
				_telefonos.push(document.getElementById('idTelefono').value.trim());
				_telefonos.push(document.getElementById('idTelefono2').value.trim());
			}

			console.log(document.getElementById('idTelefono2').value);
			console.log(_telefonos);
			if(_telefonos[0]) console.log(_telefonos[0]);
			if(_telefonos[1]) console.log(_telefonos[1]);

			fetch('/api/modificar-dentista', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					temp_cedula: _temp_cedula,
					cedula_dentista: parseInt(_cedula),
					nombres: _nombres,
					apellidos: _apellidos,
					id_especialidad: parseInt(_id_especialidad),
					telefonos: _telefonos

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

			document.getElementById('FormDentista').reset();
			document.getElementById('lblPacientes').textContent = `Seleccione un Dentista si desea hacer una modificacion Nuevamente:`;
			
		}

		temp_cedula = "";

	});
}

function eliminarDentista(){

		document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnEliminar')){

			event.preventDefault();
			const fila = event.target.closest('tr');

			console.log(fila);
			var resultado = window.confirm(
			`¿Esta seguro de que desea eliminar este registro de la base de datos?:\nDentista:\n    cedula: ${fila.cells[0].textContent.trim()},\n    nombres: ${fila.cells[1].textContent.trim()},\n    apellidos: ${fila.cells[2].textContent.trim()},\n    telefonos: ${fila.cells[3].innerHTML.split('<br>').join(', ')},\n    Especialidad: ${fila.cells[4].textContent.trim()}`
			);

			const _cedula = fila.cells[0].textContent.trim();

			if (resultado) {

    			fetch('/api/eliminar-dentista', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({
					cedula: parseInt(_cedula),
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
			} else {
			    // El usuario hizo clic en "Cancelar"
			    console.log("Operación cancelada.");
			}
		}
	})
}

