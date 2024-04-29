export function validarCita(event) {
    const cedula = parseInt(document.getElementById('idCedula').value);
    const servicio = parseInt(document.getElementById('idServicio').value);
    const fechaCita = document.getElementById('idFechaCita').value.trim();
    const hora = document.getElementById('idHora').value.trim();

    if (!validarCedulaPaciente(cedula) || !validarIdServicio(servicio) || !validarFechaCita(fechaCita) || !validarHora(hora)) {
        event.preventDefault();
        return false;
    } else {
        event.preventDefault();
        return true;
    }
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

function validarIdServicio(servicio) {
    if (isNaN(servicio) || servicio <= 0) {
        alert('Debe seleccionar un servicio válido para la cita.');
        return false;
    }
    return true;
}

function validarFechaCita(fechaCita) {
    const f = new Date();
    const fstring = `${f.getFullYear()}-${(f.getMonth() +1)}-${f.getDate()}`;

    if (fechaCita === '') {
        alert('Campo vacío: Fecha de la cita. Complete los campos.');
        return false;
    }

    if (!isNaN(fechaCita)) {

        alert('Campo vacio: Ingrese una fecha de nacimiento')
        return false;
    }                    

    if (Date.parse(fechaCita) < Date.parse(fstring)){
        alert('La fecha que ingreso no puede ser menor de la fecha actual');
        return false;
    }
    return true;
}

function validarHora(hora) {
    if (hora === '') {
        alert('Campo vacío: Hora de la cita. Complete los campos.');
        return false;
    }
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(hora)) {
        console.log(hora);
        alert('El formato de hora debe ser HH:mm (ejemplo: 15:30).');
        return false;
    }
    console.log(hora);
    return true;
}

function validarTipo(tipo) {
    if (tipo.length > 10) {
        alert('El campo "tipo" es demasiado largo. Límite de caracteres (10).');
        return false;
    }
    return true;
}
