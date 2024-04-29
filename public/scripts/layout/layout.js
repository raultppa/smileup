function mostrarHoraActual() {

	const labelReloj = document.getElementById("idDate");
	const fechaHoraActual = new Date();
	const fecha = new Date();

	let hora = fechaHoraActual.getHours();
	const minutos = fechaHoraActual.getMinutes();
	const ampm = hora >= 12 ? "PM" : "AM";

// Convertir la hora a un formato de 12 horas
	if (hora > 12) {
		hora -= 12;
	}

	const horaFormateada = hora < 10 ? `0${hora}` : hora;
	const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;

	const horaActual = `${fecha.toLocaleDateString()} - ${horaFormateada}:${minutosFormateados}${ampm}`;

	labelReloj.textContent = horaActual;
}

// Llama a la función para mostrar la hora actual cada segundo
setInterval(mostrarHoraActual, 1000);
