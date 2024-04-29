const express = require('express');
const routerCitas = express.Router();
const c_control = require('../database/citaController');

routerCitas.get('/list-citas-pendientes', async (req, res) => {
  try {
    const result = await c_control.obtenerCitasPendientes();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCitas.get('/list-citas', async (req, res) => {
  try {
    const result = await c_control.obtenerCitas();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// routerCitas.get('/reporte1', async (req, res) => {
//     const result = await c_control.reporteAsistenciaAusenciaPorServicio();
// });

routerCitas.post('/registrar-cita', async (req, res) => {
  try {
    const cita = {
      cedula_paciente: req.body.cedula_paciente,
      id_servicio: req.body.id_servicio,
      fecha_cita: req.body.fecha_cita,
      hora: req.body.hora,
      tipo: req.body.tipo_cita,
    };
    const result = await c_control.crearCita(cita);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCitas.post('/obtener-cita', async (req, res) => {
  try {
    const id_cita = req.body.id_cita;
    const result = await c_control.obtenerCitaPorId(id_cita);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCitas.post('/modificar-cita', async (req, res) => {
  try {
    const id_cita = req.body.id_cita;
    const cita = {
      cedula_paciente: req.body.cedula_paciente,
      id_servicio: req.body.id_servicio,
      fecha_cita: req.body.fecha_cita,
      hora: req.body.hora,
      tipo: req.body.tipo_cita,
    };
    const result = await c_control.actualizarCita(id_cita, cita);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

routerCitas.post('/eliminar-cita', async (req, res) => {
  try {
    const id_cita = req.body.id_cita;
    const result = await c_control.eliminarCita(id_cita);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = routerCitas;
