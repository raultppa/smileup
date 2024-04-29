 // Agrega un evento de envío al formulario
document.getElementById('idLogin').addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar el envío por defecto del formulario

    // Obtener los valores de usuario y contraseña
    var usuario = document.getElementById('idUsuario').value;
    var pass = document.getElementById('idPass').value;

    // Verificar si los campos están vacíos
    if (usuario === "" || pass === "") {
        alert("Verifique que sus campos no estén vacíos.");
    } else {
        // Redireccionar a la página /inicio
        fetch('/login',{
            method: "POST",
            headers: {"Content-Type":"application/json; charset=utf-8"},
            body: JSON.stringify({
                user: usuario,
                password: pass,
            })
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            if(data.session === true){
                window.location.replace('/inicio')
            }else{
                alert(data.message)
            };
        })
        .catch(err => {
            alert(`Hubo un error en la comprobacion de los datos: ${JSON.stringify(err)}`);
        });
    }
});