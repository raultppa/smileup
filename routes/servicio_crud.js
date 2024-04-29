const express = require('express');
const router_servicios = express.Router();
const s_control = require('../database/servicioController');

// Obtener la lista de servicios
router_servicios.get('/list-servicios', async (req, res) => {
  try {
    const result = await s_control.obtenerServicios();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Registrar un nuevo servicio
router_servicios.post('/registrar-servicio', async (req, res) => {
  try {
    console.log(req.body);

    const servicio = {
      nombre_servicio: req.body.nombre_servicio,
    };

    const result = await s_control.crearServicio(servicio);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Modificar un servicio existente
router_servicios.post('/modificar-servicio', async (req, res) => {
  try {
    const id_servicio = req.body.id_servicio;
    const servicio = {
      nombre_servicio: req.body.nombre_servicio,
    };

    const result = await s_control.actualizarServicio(id_servicio, servicio);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un servicio
router_servicios.post('/eliminar-servicio', async (req, res) => {
  try {
    console.log(req.body.id_servicio);
    
    const id_servicio = req.body.id_servicio;

    const result = await s_control.eliminarServicio(id_servicio);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router_servicios;
