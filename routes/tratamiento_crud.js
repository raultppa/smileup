const express = require('express');
const router_tratamientos = express.Router();
const t_control = require('../database/tratamientoController');

router_tratamientos.get('/list-tratamientos', async (req, res) => {
    try {
        const result = await t_control.obtenerTratamientos();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router_tratamientos.post('/registrar-tratamiento', async (req, res) => {
    try {
        let tratamiento = {
            id_servicio: req.body.id_servicio, // Asegúrate de enviar el ID del servicio
            nombre: req.body.nombre,
            precio: req.body.precio,
        }

        const result = await t_control.crearTratamiento(tratamiento);

        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router_tratamientos.post('/modificar-tratamiento', async (req, res) => {
    try {
        const id_tratamiento = req.body.id_tratamiento;
        if (id_tratamiento === null) throw new Error("Debe proporcionar un ID de tratamiento.");

        let mTratamiento = {
            id_servicio: req.body.id_servicio, // Asegúrate de enviar el ID del servicio
            nombre: req.body.nombre,
            precio: req.body.precio,
        }

        const result = await t_control.actualizarTratamiento(id_tratamiento, mTratamiento);

        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
});

router_tratamientos.post('/eliminar-tratamiento', async (req, res) => {
    try {
        const id_tratamiento = req.body.id_tratamiento;

        const result = await t_control.eliminarTratamiento(id_tratamiento);

        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router_tratamientos;
