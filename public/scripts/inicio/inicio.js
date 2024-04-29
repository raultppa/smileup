document.addEventListener('DOMContentLoaded', (event) =>{

    cargarFilas();
    filtrarRegistros();

});

var input = document.getElementById('filtro');
var radioPrevia = document.getElementById('idPrevia');
var radioNoPrevia = document.getElementById('idNoPrevia');
var radioNinguno = document.getElementById('idNinguno')
var tbody = document.getElementById('listaCitas');
var filas = tbody.getElementsByTagName('tr');

input.addEventListener('input', filtrarRegistros);
radioPrevia.addEventListener('change', filtrarRegistros);
radioNoPrevia.addEventListener('change', filtrarRegistros);
radioNinguno.addEventListener('change', filtrarRegistros);

function filtrarRegistros() {
    var filtro = input.value.toUpperCase(); // Convertir el filtro a mayúsculas
    var estado = radioPrevia.checked ? 'PREVIA' : 'NO PREVIA';
    if (radioNinguno.checked) estado = 'TODOS';
    for (var i = 0; i < filas.length; i++) {
        var cedula = (filas[i].getElementsByTagName('td')[1].textContent);
        // var nombreCompleto = (filas[i].getElementsByTagName('td')[0].textContent + " " + filas[i].getElementsByTagName('td')[1].textContent).toUpperCase();
        var estadoFila = filas[i].getElementsByTagName('td')[8].textContent;
        if ((cedula.indexOf(filtro) > -1) && (estado === 'TODOS' || estadoFila === estado)) {
            filas[i].style.display = ''; // Mostrar la fila si coincide con nombre completo y estado
        } else {
            filas[i].style.display = 'none'; // Ocultar la fila si no coincide
        }
    }
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
                <button type="button" class="btn-ter p-2 m-0" style="padding-bottom: 4px;"><i class="icon-check"></i></button>
                <button type="button" class="btn-ter p-2 m-0" style="padding-bottom: 4px; background-color: red;"><i class="icon-xmark"></i></button>
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