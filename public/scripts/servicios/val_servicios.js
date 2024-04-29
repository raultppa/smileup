export function validarServicio(event){

    const servicio = document.getElementById('idServicio').value.trim();
    
    if(!validarNombreServicio(servicio)) {

        event.preventDefault();
        return false
    }else{

        event.preventDefault();
        return true;
    }
}

function validarNombreServicio(servicio) {

	if (servicio === "") {
        alert('Campo vacio: Nombres o Apellidos. Complete los campos.');
        return false;
    }
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(servicio)) {
        alert('No se permiten Numeros ni Simbolos en este campo.');
        return false;
    }
    if (servicio.length > 45){
        alert('El nombre del servicio es demasiado Largo. Limite de caracteres(45)');
        return false;
    }
    return true;
}