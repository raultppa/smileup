const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// ruta inicio, sirve el archivo html desde la carpeta views
router.get('/pacientes',(req, res) => {
	// Leer el contenido del componente html
	const dirComponent_pacientes = path.join(__dirname, '../views/components/pacientes.html');
	fs.readFile(dirComponent_pacientes, 'utf8', (err, pacientesHtml) => {

		if (err){
			return res.status(500).send('Error al cargar el componente pacientes.html');
		}
		// Leer el contenido del layout
		const dirLayout = path.join(__dirname,'../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err, layoutHtml) => {

			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', pacientesHtml);
			// Enviar el Html Resultante
			res.send(resultHtml);
		});
	});
});

router.get('/inicio', (req, res) => {

	const dirComponent_inicio = path.join(__dirname, '../views/components/inicio.html');
	fs.readFile(dirComponent_inicio, 'utf8', (err, inicioHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente inicio.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', inicioHtml);
			res.send(resultHtml);
		});

	});
});

router.get('/citas', (req, res) => {

	const dirComponent_citas = path.join(__dirname, '../views/components/citas.html');
	fs.readFile(dirComponent_citas, 'utf8', (err, citasHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente citas.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', citasHtml);
			res.send(resultHtml);
		});

	});
});

router.get('/consultas', (req, res) => {

	const dirComponent_consultas = path.join(__dirname, '../views/components/consultas.html');
	fs.readFile(dirComponent_consultas, 'utf8', (err, consultasHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente consultas.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', consultasHtml);
			res.send(resultHtml);
		});

	});
});

router.get('/servicios', (req, res) => {

	const dirComponent_servicios = path.join(__dirname, '../views/components/servicios.html');
	fs.readFile(dirComponent_servicios, 'utf8', (err, serviciosHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente servicios.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', serviciosHtml);
			res.send(resultHtml);
		});

	});
});

router.get('/tratamientos', (req, res) => {

	const dirComponent_tratamientos = path.join(__dirname, '../views/components/tratamientos.html');
	fs.readFile(dirComponent_tratamientos, 'utf8', (err, tratamientosHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente tratamientos.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', tratamientosHtml);
			res.send(resultHtml);
		});

	});
});

router.get('/dentistas', (req, res) => {

	const dirComponent_dentistas = path.join(__dirname, '../views/components/dentistas.html');
	fs.readFile(dirComponent_dentistas, 'utf8', (err, dentistasHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente dentistas.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', dentistasHtml);
			res.send(resultHtml);
		});

	});
});

router.get('/reportes', (req, res) => {

	const dirComponent_reportes = path.join(__dirname, '../views/components/reportes.html');
	fs.readFile(dirComponent_reportes, 'utf8', (err, reportesHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente reportes.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', reportesHtml);
			res.send(resultHtml);
		});

	});
});

router.get('/configuracion', (req, res) => {

	const dirComponent_configuracion = path.join(__dirname, '../views/components/configuracion.html');
	fs.readFile(dirComponent_configuracion, 'utf8', (err, configuracionHtml) => {

		if(err){
			return res.status(500).send('Error al cargar el componente consultas.html');
		}
		const dirLayout = path.join(__dirname, '../views/layout.html');
		fs.readFile(dirLayout, 'utf8', (err,layoutHtml) => {
			
			if(err){
				return res.status(500).send('Error al cargar el layout.html');
			}
			const resultHtml = layoutHtml.replace('<!-- #{COMPONENT AREA} -->', configuracionHtml);
			res.send(resultHtml);
		});

	});
});

module.exports = router;





















