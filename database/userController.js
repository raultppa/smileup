const express = require('express');
const control_users = express.Router();
const db = require('./database');

control_users.get('/usuarios', async (req, res) =>{
	try {
		const usuarios = await db.query('select * from usuarios');
		res.json(usuarios);
	
	}catch(error){
		console.log('Error al obtener usuarios: ', error);
		res.status(500).json({error:'Error al obtener usuarios'});
	}
})

module.exports = control_users;