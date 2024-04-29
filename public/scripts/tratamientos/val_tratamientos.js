export function validarTratamiento(event) {
    const nombre = document.getElementById('idTratamiento').value.trim();
    const precio = parseFloat(document.getElementById('idPrecio').value);
    const idServicio = parseInt(document.getElementById('idServicio').value);

    if (!validarNombreTratamiento(nombre) || !validarPrecio(precio) || !validarIdServicio(idServicio)) {
        event.preventDefault();
        return false;
    } else {
        event.preventDefault();
        return true;
    }
}

function validarNombreTratamiento(nombre) {
    if (nombre === "") {
        alert('Campo vacío: Nombre del Tratamiento. Complete los campos.');
        return false;
    }
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(nombre)) {
        alert('No se permiten Numeros ni Simbolos en este campo.');
        return false;
    }
    if (nombre.length > 150) {
        alert('El nombre del tratamiento es demasiado largo. Límite de caracteres (150).');
        return false;
    }
    return true;
}

function validarPrecio(precio) {
    if (isNaN(precio)) {
        alert('El precio no es un número válido.');
        return false;
    }
    if (precio <= 0) {
        alert('El precio debe ser un número positivo.');
        return false;
    }
    return true;
}

function validarIdServicio(idServicio) {
    if (isNaN(idServicio)) {
        alert('Debe seleccionar un servicio acorde al tratamiento para proceder con el registro.');
        return false;
    }
    if (idServicio <= 0) {
        alert('El ID del servicio debe ser un número positivo.');
        return false;
    }
    return true;
}
