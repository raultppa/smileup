import { validarPaciente } from './val_pacientes.js';

let ContentM = document.getElementById('idContentM');
let ContentA = document.getElementById('idActivar');
let Tlfn2 = document.getElementById('idTelefono2');
let activo = true;
let temp_cedula = "";

document.addEventListener('DOMContentLoaded', (event) =>{

	ContentM.style.display = 'none';
	ContentA.style.display = 'none';
	Tlfn2.style.display = 'none';

	cambiarActivo();
	agregarTlfn();
	cargarFilas();
	registrarPaciente();
	modificarPaciente();
	eliminarPaciente();
	seleccionarPaciente();
	atras();

});

function cambiarActivo(){

	document.getElementById('idActivo').addEventListener('click', event =>{

		if(event.target.textContent === "SI"){
			event.target.textContent = "NO";
			event.target.classList.replace('bg2', 'bg5')
			activo = false;
		}else{
			event.target.textContent = "SI";
			event.target.classList.replace('bg5','bg2')
			activo = true;
		}
	});


}

function agregarTlfn(){

	document.getElementById('idAgregarTlfn').addEventListener('click', event => {
		Tlfn2.style.display = 'inherit';
		document.getElementById('idAgregarTlfn').style.display = 'none';
	});
}

function atras(){

	document.getElementById('idCancelar').addEventListener('click', event =>{

		document.getElementById('lblPacientes').textContent = 'Registrar nuevo paciente:';
		ContentA.style.display = 'none';
		ContentM.style.display = 'none';
		document.getElementById('FormPaciente').reset();
		document.getElementById('idContentC').classList.replace('col-9','col-12');
		document.getElementById('idRegistrar').style.display = 'flex';
		Tlfn2.style.display = 'none';
		document.getElementById('idAgregarTlfn').style.display = 'inherit';

	});
}

function seleccionarPaciente(){

	document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnSeleccionar')){

			event.preventDefault();

			document.getElementById('idRegistrar').style.display = 'none';
			ContentA.style.display = 'block';
			document.getElementById('idContentC').classList.replace('col-12', 'col-9');
			ContentM.style.display = 'inherit';
			Tlfn2.style.display = 'inherit';
			document.getElementById('idAgregarTlfn').style.display = 'none';

			const fila = event.target.closest('tr');
			console.log(fila);

			temp_cedula = fila.cells[0].textContent.trim();
			document.getElementById('lblPacientes').textContent = `Modificar Paciente (${temp_cedula} - ${fila.cells[1].textContent} ${fila.cells[2].textContent}):`;

			document.getElementById('idCedula').value = fila.cells[0].textContent;
			document.getElementById('idNombres').value = fila.cells[1].textContent;
			document.getElementById('idApellidos').value = fila.cells[2].textContent;
			const telefonos = fila.cells[3].innerHTML.split('<br>');
			document.getElementById('idTelefono').value = telefonos[0];
			document.getElementById('idTelefono2').value = (telefonos[1]) ? telefonos[1] : "";
			document.getElementById('idDireccion').value = fila.cells[4].textContent;
			document.getElementById('idFecha').value = fila.cells[5].textContent.split('/').reverse().join('-');

			const btnActivo = document.getElementById('idActivo');
			btnActivo.textContent = fila.cells[6].textContent;
			if(btnActivo.textContent !== "SI"){
				btnActivo.classList.replace('bg2', 'bg5');
				activo = false;
			}else{
				btnActivo.classList.replace('bg5', 'bg2');
				activo = true;
			}

		}
	})

}


// ####################################################################################################################
// ------------------------------------------ OPERACIONES AL BACKEND --------------------------------------------------
// ####################################################  V  ###########################################################



function registrarPaciente(){

	const btn_registrar = document.getElementById('idRegistrar');

	btn_registrar.addEventListener('click', event =>{

		event.preventDefault();

		if(validarPaciente(event)){

			const _telefonos = [];

			const _cedula = document.getElementById('idCedula').value.trim();
			const _nombres = document.getElementById('idNombres').value.trim();
			const _apellidos = document.getElementById('idApellidos').value.trim();
			const _fecha_n = document.getElementById('idFecha').value;
			const _direccion = document.getElementById('idDireccion').value;

			if(document.getElementById('idTelefono2').value == '' || document.getElementById('idTelefono2').value == null){
				
				_telefonos.push(document.getElementById('idTelefono').value.trim());
			}else{
				console.log("PUSHEADO");
				_telefonos.push(document.getElementById('idTelefono').value.trim());
				_telefonos.push(document.getElementById('idTelefono2').value.trim());
			}

			fetch('/api/registrar-paciente',{
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					cedula: parseInt(_cedula),
					nombres: _nombres,
					apellidos: _apellidos,
					direccion: _direccion,
					fecha_n: _fecha_n,
					telefonos: _telefonos,

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

			document.getElementById('FormPaciente').reset();
		}

	});
}

function modificarPaciente(){

	const btn_modificar = document.getElementById('idModificar');

	btn_modificar.addEventListener('click', event => {

		event.preventDefault();
		if(validarPaciente(event)){

			const _telefonos = [];

			const _temp_cedula = temp_cedula;
			const _cedula = document.getElementById('idCedula').value.trim();
			const _nombres = document.getElementById('idNombres').value.trim();
			const _apellidos = document.getElementById('idApellidos').value.trim();
			const _fecha_n = document.getElementById('idFecha').value;
			const _direccion = document.getElementById('idDireccion').value;
			const _activo = activo;

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

			fetch('/api/modificar-paciente', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					temp_cedula: parseInt(_temp_cedula),
					cedula: parseInt(_cedula),
					nombres: _nombres,
					apellidos: _apellidos,
					direccion: _direccion,
					fecha_n: _fecha_n,
					activo: _activo,
					telefonos: _telefonos,

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

			document.getElementById('FormPaciente').reset();
			document.getElementById('lblPacientes').textContent = `Seleccione un Paciente si desea hacer una modificacion Nuevamente:`;
			
		}

		temp_cedula = "";

	});
}


function eliminarPaciente(){

		document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnEliminar')){

			event.preventDefault();
			const fila = event.target.closest('tr');

			console.log(fila);
			var resultado = window.confirm(
			`¿Esta seguro de que desea eliminar este registro de la base de datos?:\nPaciente:\n    cedula: ${fila.cells[0].textContent.trim()},\n    nombres: ${fila.cells[1].textContent.trim()},\n    apellidos: ${fila.cells[2].textContent.trim()},\n    telefonos: ${fila.cells[3].innerHTML.split('<br>').join(', ')},\n    direccion: ${fila.cells[4].textContent.trim()},\n    fecha_n: ${fila.cells[5].textContent.trim()},\n    activo: ${fila.cells[6].textContent.trim()}`
			);

			const _cedula = fila.cells[0].textContent.trim();

			if (resultado) {

			fetch('/api/eliminar-paciente', {
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

function cargarFilas(){

	let fragmento = document.createDocumentFragment();
	const t_body = document.getElementById('idListaPacientes');

	fetch('/api/list-pacientes')
	.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
	.then(data =>{

		console.log(data);
		t_body.innerHTML = '';

		data.forEach( element =>{

			const t_row = document.createElement('tr');
			const status = element.activo === 1 ? "SI" : "NO";

			t_row.innerHTML =
			`<td>${element.cedula_paciente}</td>
			 <td>${element.nombres}</td>
			 <td>${element.apellidos}</td> 
			 <td>${element.telefonos.split(',').join('<br>')}</td>
			 <td>${element.direccion}</td>
			 <td>${element.FechaNacimiento}</td>
			 <td>${status}</td>
			 <td>
			 <button class="btn-ter2 p-2 m-0 btnSeleccionar bg3" style="padding-bottom: 4px;"><i class="icon-pen-to-square btnSeleccionar"></i></button>
			 <button class="btn-ter2 p-2 m-0 btnEliminar bg1" style="padding-bottom: 4px;"><i class="icon-xmark btnEliminar"></i></button>
			 </td>`
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



