const express = require('express');
const router_pacientes = express.Router();
const p_control = require('../database/pacienteController');

router_pacientes.get('/list-pacientes', async (req, res) => {
    try {
        const result = await p_control.obtenerPacientes();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router_pacientes.get('/paciente/:cedula', async (req, res) =>{

    try {
        console.log(req.params.cedula);
        const cedula_paciente = req.params.cedula;

        const result = await p_control.obtenerPacientePorCedula(cedula_paciente);
        console.log(result);

        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.message });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router_pacientes.post('/registrar-paciente', async (req, res) => {

    try {


        let paciente = {

            cedula_paciente: req.body.cedula,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            direccion: req.body.direccion,
            FechaNacimiento: req.body.fecha_n,
            activo: true,
            telefonos: req.body.telefonos,

        }

        console.log("ENRUTADOR CRUD");
        console.log(paciente);

        const result = await p_control.crearPaciente(paciente);
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

router_pacientes.post('/modificar-paciente', async (req, res) =>{

    try {

        if(req.body.temp_cedula === null) throw new Error("Debe seleccionar un Paciente de la lista para modificarlo");

        let tempCedula = req.body.temp_cedula;

        let mPaciente = {

            cedula_paciente: req.body.cedula,
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            direccion: req.body.direccion,
            FechaNacimiento: req.body.fecha_n,
            activo: req.body.activo,
            telefonos: req.body.telefonos,
        }

        const result = await p_control.actualizarPaciente(tempCedula, mPaciente);
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

router_pacientes.post('/eliminar-paciente', async (req, res) =>{

    try {

        const cedula_paciente = req.body.cedula;

        const result = await p_control.eliminarPaciente(cedula_paciente);
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


module.exports = router_pacientes;