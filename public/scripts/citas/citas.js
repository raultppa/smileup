import { validarCita } from './val_citas.js';

let ContentM = document.getElementById('idContentM');
let temp_id_cita = "";
let tipoCita = "PREVIA";
let str_tmp = document.getElementById('idFechaCita').value;

document.addEventListener('DOMContentLoaded', (event) =>{

	ContentM.style.display = 'none';

	cargarSelectServicio();
	cambiarTipoCita();


	seleccionarCita();
	cargarFilas();
	buscarPaciente();
	registrarCita();
	modificarCita();
	eliminarCita();
	atras();

});


function seleccionarCita(){

	document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnSeleccionar')){

			event.preventDefault();
			console.log(str_tmp);
			document.getElementById('idFechaCita').readOnly = false;
			document.getElementById('idFechaCita').classList.remove('bg-gray');
			document.getElementById('idRegistrar').style.display = 'none';
			ContentM.style.display = 'inherit';

			const fila = event.target.closest('tr');
			console.log(fila);

			temp_id_cita = fila.cells[0].textContent.trim();

			document.getElementById('lblCita').textContent = `Modificar Cita (${temp_id_cita} - ${fila.cells[2].textContent} ${fila.cells[3].textContent}):`;
			document.getElementById('idCedula').value = fila.cells[1].textContent;
			document.getElementById('idNombres').placeholder = fila.cells[2].textContent;
			document.getElementById('idApellidos').placeholder = fila.cells[3].textContent;
			document.getElementById('idServicio').value = parseInt(fila.cells[5].textContent);
			document.getElementById('idFechaCita').value = fila.cells[6].textContent.split('/').reverse().join('-');
			str_tmp = fila.cells[6].textContent;
			document.getElementById('idHora').value = fila.cells[7].textContent;

			const btnTipoCita = document.getElementById('idTipoCita');
			btnTipoCita.textContent = fila.cells[8].textContent;

			if(btnTipoCita.textContent !== "PREVIA"){
				btnTipoCita.classList.replace('bg2', 'bg5');
				tipoCita = "NO PREVIA";
			}else{
				btnTipoCita.classList.replace('bg5', 'bg2');
				tipoCita = "PREVIA";
			}		
		}
	})
}

function atras(){

	document.getElementById('idCancelar').addEventListener('click', event =>{

		document.getElementById('lblCita').textContent = 'Registrar nuevo Cita:';
		ContentM.style.display = 'none';
		document.getElementById('formCita').reset();
		document.getElementById('idNombres').placeholder = '';
		document.getElementById('idApellidos').placeholder = '';
		document.getElementById('idRegistrar').style.display = 'flex';

	});
}

function cambiarTipoCita(){
	document.getElementById('idTipoCita').addEventListener('click', event =>{
		
		if(event.target.textContent === "PREVIA"){
			str_tmp = document.getElementById('idFechaCita').value;
			event.target.textContent = "NO PREVIA";
			event.target.classList.replace('bg2', 'bg5');
			tipoCita = "NO PREVIA";
			const f = new Date();
    		const fstring = `${f.getFullYear()}-${(f.getMonth() +1)}-${f.getDate()}`;
    		document.getElementById('idFechaCita').value = fstring;
    		document.getElementById('idFechaCita').readOnly = true;
    		document.getElementById('idFechaCita').classList.add('bg-gray');


		}else{
			event.target.textContent = "PREVIA";
			event.target.classList.replace('bg5','bg2')
			tipoCita = "PREVIA";
			document.getElementById('idFechaCita').readOnly = false;
			document.getElementById('idFechaCita').classList.remove('bg-gray');
			document.getElementById('idFechaCita').value = str_tmp.split('/').reverse().join('-')
		}
	});
}

// ####################################################################################################################
// ------------------------------------------ OPERACIONES AL BACKEND --------------------------------------------------
// ####################################################  V  ###########################################################

function buscarPaciente(){
	
	const btnBuscarPaciente = document.getElementById('idBuscarPaciente');

	btnBuscarPaciente.addEventListener('click', event =>{

		event.preventDefault();

		const _cedula_paciente = document.getElementById('idCedula').value;

		if(validarCedulaPaciente(_cedula_paciente)){
			fetch(`/api/paciente/${_cedula_paciente}`)
			.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
			.then(data => {

				console.log(data);
				document.getElementById('idNombres').placeholder = `${data.nombres}`;
				document.getElementById('idApellidos').placeholder = `${data.apellidos}`;
			})
			.catch(error => {
				alert(JSON.stringify(error));
				console.error('Error: ', error);
			});
		}
	});
}

function validarCedulaPaciente(cedula) {
    if (isNaN(cedula) || cedula <= 0) {
        alert('La cédula del paciente debe ser un número positivo.');
        return false;
    }
    if (cedula === "") {
        alert('Campo vacio: Ingrese un numero de Cedula');
        return false;
    }
    if(!/^\d+$/.test(cedula)){
        alert('Solo se permiten valores numericos en el campo de cedula');
        return false;
    }
    if(cedula.length < 7 || cedula.length > 10){
        alert('La cedula no puede ser menor de 7 digitos ni exceder de 10 digitos');
        return false;
    }
    return true;
}

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
	const t_body = document.getElementById('listaCitas');

	fetch('/api/list-citas-pendientes')
	.then(res => res.ok ? res.json() : res.json().then(data => Promise.reject(data)))
	.then(data =>{

		console.log(data);
		t_body.innerHTML = '';

		data.forEach( element =>{

			const t_row = document.createElement('tr');

			t_row.innerHTML =
			`
			<td>${element.id_cita}</td>
            <td>${element.paciente.cedula_paciente}</td>
            <td>${element.paciente.nombres_paciente}</td>
            <td>${element.paciente.apellidos_paciente}</td>
            <td>${element.servicio.nombre_servicio}</td>
            <td style="display:none;">${element.servicio.id_servicio}</td>
            <td>${element.fecha_cita}</td>
            <td>${element.hora}</td>
            <td>${element.tipo}</td>
            <td>${element.asistencia}</td>
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

function registrarCita(){

	const btn_registrar = document.getElementById('idRegistrar');

	btn_registrar.addEventListener('click', event =>{

		event.preventDefault();

		if(validarCita(event)){

			const _cedula_paciente = parseInt(document.getElementById('idCedula').value);
			const _servicio = parseInt(document.getElementById('idServicio').value);
			const _fechaCita = document.getElementById('idFechaCita').value.trim();
			const _hora = document.getElementById('idHora').value.trim();
			const _tipo_cita = tipoCita;


			fetch('/api/registrar-cita',{
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					cedula_paciente: _cedula_paciente,
				    id_servicio: _servicio,
				    fecha_cita: _fechaCita,
				    hora: _hora,
				    tipo_cita: _tipo_cita,

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

			document.getElementById('formCita').reset();
		}

	});
}

function modificarCita(){

	const btn_modificar = document.getElementById('idModificar');

	btn_modificar.addEventListener('click', event => {

		event.preventDefault();
		if(validarCita(event)){

			const _id_cita = temp_id_cita;
			const _cedula_paciente = parseInt(document.getElementById('idCedula').value);
			const _servicio = parseInt(document.getElementById('idServicio').value);
			const _fechaCita = document.getElementById('idFechaCita').value.trim();
			const _hora = document.getElementById('idHora').value.trim();
			const _tipo_cita = tipoCita;

			fetch('/api/modificar-cita', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({

					id_cita: _id_cita,
				    cedula_paciente: _cedula_paciente,
				    id_servicio: _servicio,
				    fecha_cita: _fechaCita,
				    hora: _hora,
				    tipo_cita : _tipo_cita,

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

			document.getElementById('formCita').reset();
			document.getElementById('lblCita').textContent = `Seleccione una Cita de la lista si desea hacer una modificacion Nuevamente:`;
			document.getElementById('idNombres').placeholder = '';
			document.getElementById('idApellidos').placeholder = '';
			temp_id_cita = "";
		}
	});
}

function eliminarCita(){ 

		document.body.addEventListener('click', event => {

		if(event.target.classList.contains('btnEliminar')){

			event.preventDefault();
			const fila = event.target.closest('tr');

			console.log(fila);
			var resultado = window.confirm(
			`¿Esta seguro de que desea eliminar este registro de la base de datos?:\nCita:\n    id_cita: ${fila.cells[0].textContent.trim()},\n    cedula_paciente: ${fila.cells[1].textContent.trim()},\n    nombres del paciente: ${fila.cells[2].textContent.trim()},\n    apellidos del paciente: ${fila.cells[3].textContent.trim()},\n    servicio: ${fila.cells[4].textContent.trim()},\n    fecha de la cita: ${fila.cells[6].textContent.trim()},\n    hora: ${fila.cells[7].textContent.trim()},\n    tipo: ${fila.cells[8].textContent.trim()},\n    asistencia: ${fila.cells[9].textContent.trim()},`
			);

			const _id_cita = fila.cells[0].textContent.trim();

			if (resultado) {

    			fetch('/api/eliminar-cita', {
				method: 'POST',
				headers: {"Content-Type":"application/json; charset=utf-8"},
				body: JSON.stringify({
					id_cita: parseInt(_id_cita),
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