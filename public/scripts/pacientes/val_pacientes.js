export function validarPaciente(event){

    const cedula = document.getElementById('idCedula').value.trim();
    const nombres = document.getElementById('idNombres').value.trim();
    const apellidos = document.getElementById('idApellidos').value.trim();
    const telefono1 = document.getElementById('idTelefono').value.trim();
    const telefono2 = document.getElementById('idTelefono2').value.trim();
    const fecha = document.getElementById('idFecha').value;
    const direccion = document.getElementById('idDireccion').value;
    
    if (!validarCedula(cedula)) {

        event.preventDefault();
        return false
    }
    else if(!validarNombreApellido(nombres,apellidos)) {

        event.preventDefault();
        return false
    }
    else if(!validarTelefono(telefono1,telefono2)) {

        event.preventDefault();
        return false
    }
    else if(!validarFecha(fecha)) {

        event.preventDefault();
        return false
    }
    else if(!validarDireccion(direccion)) {

        event.preventDefault();
        return false
    }
    else{

        event.preventDefault();
        return true;
    }
}

function validarDireccion(direccion) {

	if (direccion.length > 110) {

        alert('La direccion que introdujo es demasiado larga');
        return false;
    }
    if (direccion === "") {
        alert('Campo vacio: Introduzca una direccion');
        return false;
    }
    return true;
}

function validarFecha(fecha) {

    const f = new Date();
    const fstring = `${f.getFullYear()}-${(f.getMonth() +1)}-${f.getDate()}`;

	if (!isNaN(fecha)) {

        alert('Campo vacio: Ingrese una fecha de nacimiento')
        return false;
    }                     

    if (Date.parse(fecha) >= Date.parse(fstring)){
        alert('La fecha que ingreso no puede excederse de la fecha actual');
        return false;
    }

    return true;
}

function validarTelefono(telefono1, telefono2) {
    // Función para validar un número de teléfono
    function validarNumero(telefono) {
        if (telefono === "") {
            alert('Campo vacío: Ingrese un número de Teléfono');
            return false;
        }

        if (telefono.length !== 11) {
            alert('El número de teléfono no puede ser mayor a 11 dígitos');
            return false;
        }

        if (!/^\d+$/.test(telefono)) {
            alert('El número de teléfono solo puede contener valores numéricos (0-9)');
            return false;
        }

        const formatosValidos = ['0412', '0414', '0416', '0424', '0426'];
        const codigoArea = telefono.substring(0, 4);
        if (!formatosValidos.includes(codigoArea)) {
            alert('Introduzca un número de teléfono válido en Venezuela');
            return false;
        }

        return true;
    }

    // Validar el primer número de teléfono
    const validacionTelefono1 = validarNumero(telefono1);
    if (!validacionTelefono1) {
        return false;
    }

    // Validar que ambos numeros de telefono no sean iguales
    if(telefono1 == telefono2){
        alert('Si ingresa dos numeros de telefono, asegurese de que no sean iguales');
        return false;
    } 
    
    // Si se proporciona un segundo número de teléfono, validar también
    if (telefono2) {
        const validacionTelefono2 = validarNumero(telefono2);
        return validacionTelefono2;
    }

    return true;
}

function validarNombreApellido(nombres,apellidos) {

	if (nombres === "" || apellidos === "") {
        alert('Campo vacio: Nombres o Apellidos. Complete los campos.');
        return false;
    }
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(nombres) || !/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(apellidos)) {
        alert('Solo se permiten caracteres alfabeticos en el campo de Nombres y Apellidos');
        return false;
    }
    return true;
}

function validarCedula(cedula){

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
