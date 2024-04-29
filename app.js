const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const fs = require('fs');
const db = require('./database/database');
const cookieParser = require('cookie-parser');

const router = require('./routes/router');
const control_users = require('./database/userController');
const router_paciente = require('./routes/paciente_crud');
const router_dentista = require('./routes/dentista_crud');
const router_servicio = require('./routes/servicio_crud')
const router_tratamiento = require('./routes/tratamiento_crud');
const router_citas = require('./routes/cita_crud');

// configurar directorio de archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

//convertir solicitudes en JSON
app.use(express.json());

//cookie-parser
app.use(cookieParser());

//Sesiones de la APP
app.use(session({
	secret: "clave-sesion",
	resave: false,
	saveUninitialized: true,
	cookie: {
    maxAge: 12 * 60 * 60 * 1000, // Duración de la cookie en milisegundos (12 horas)
  },
}));

function requireAuth(req, res, next){
	if( req.session && req.session.isAuthenticated) return next();
	res.redirect('/login');
}

app.get('/',(req, res)=>{

	if(req.session && req.session.isAuthenticated){
		res.redirect('/inicio');
	}else{
		res.redirect('/login');	
	}
	
});

app.get('/login', (req, res) => {
	const login = path.join(__dirname, '/views/login.html');
	fs.readFile(login, 'utf8', (err, loginHtml) => {	
		if(err) return res.status(500).send('Error al cargar el login.html');
		res.send(loginHtml);
	});
});

app.post('/login', async (req, res) =>{

	try{

		let data = await db.query('select usuario, password from usuarios where usuario = ? and password = ?',[req.body.user, req.body.password]);
		if(JSON.stringify(data) === '[]'){
			res.send({message:"Error: El usuario o la contraseña son incorrectos"});
		}else{
			req.session.isAuthenticated = true;
			res.send({session: true});
		}

	}catch(error){

		console.log('Error al conectar con la base de datos: ', error);
		res.send({message: "Error al conectar con la base de datos"});
	}

});

// configurar las rutas definidas en el directorio 
app.use('/', requireAuth, router);

app.use('/', requireAuth, control_users);

app.use('/api', requireAuth, router_paciente);

app.use('/api', requireAuth, router_dentista);

app.use('/api', requireAuth, router_servicio);

app.use('/api', requireAuth, router_tratamiento);

app.use('/api', requireAuth, router_citas);

// Salir de la app
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
    } else {
      res.redirect('/login');
    }
  });
});

// puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`)
});	




