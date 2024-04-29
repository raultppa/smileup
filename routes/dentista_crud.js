const express = require('express');
const router_dentistas = express.Router();
const d_control = require('../database/dentistaController');

router_dentistas.get('/list-dentistas', async (req, res) => {
    try {
        const result = await d_control.obtenerDentistas();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router_dentistas.post('/registrar-dentista', async (req, res) => {

    try {

        let dentista = {
            cedula_dentista: req.body.cedula_dentista,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            id_especialidad: req.body.id_especialidad, // Asegúrate de enviar el ID de la especialidad
            telefonos: req.body.telefonos,
        }

        const result = await d_control.crearDentista(dentista);
        console.log(result);

        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(404).json({ error: result.message });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router_dentistas.post('/modificar-dentista', async (req, res) =>{

    try {
        if (req.body.temp_cedula === null) throw new Error("Debe seleccionar un dentista de la lista para modificarlo");

        let tempCedula = req.body.temp_cedula;

        let mdentista = {
            cedula_dentista: req.body.cedula_dentista,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            id_especialidad: req.body.id_especialidad, // Asegúrate de enviar el ID de la especialidad
            telefonos: req.body.telefonos,
        }

        const result = await d_control.actualizarDentista(tempCedula, mdentista);
        console.log(result);

        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(404).json({ error: result.message });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
});

router_dentistas.post('/eliminar-dentista', async (req, res) =>{

    try {
        const cedula_dentista = req.body.cedula;

        const result = await d_control.eliminarDentista(cedula_dentista);
        console.log(result);

        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(404).json({ error: result.message });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router_dentistas;
