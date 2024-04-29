const db = require('./database');

class citaController {
  async crearCita(cita) {
    try {
      console.log(cita);
      const { cedula_paciente, id_servicio, fecha_cita, hora, tipo } = cita;

      const result = await db.query('INSERT INTO cita (cedula_paciente, id_servicio, fecha_cita, hora, tipo) VALUES (?, ?, ?, ?, ?)', [cedula_paciente, id_servicio, fecha_cita, hora, tipo]);

      return { success: true, message: 'Cita creada exitosamente.', id_cita: result.insertId };
    } catch (error) {
      return { success: false, message: 'Error al crear la cita.' };
    }
  }

  async obtenerCitas() {
    try {
      const citas = await db.query(`
        SELECT cita.id_cita, cita.cedula_paciente, cita.id_servicio, DATE_FORMAT(cita.fecha_cita, '%d/%m/%Y') AS fecha_cita, cita.hora, cita.tipo, 
        paciente.nombres AS nombres_paciente, paciente.apellidos AS apellidos_paciente,
        servicios.nombre AS nombre_servicio, cita.asistencia
        FROM cita
        INNER JOIN paciente ON cita.cedula_paciente = paciente.cedula_paciente
        INNER JOIN servicios ON cita.id_servicio = servicios.id_servicio
        ORDER BY cita.id_cita DESC;;
      `);
      
      const formattedCitas = citas.map((cita) => {
        return {
          id_cita: cita.id_cita,
          paciente: {
            cedula_paciente: cita.cedula_paciente,
            nombres_paciente: cita.nombres_paciente,
            apellidos_paciente: cita.apellidos_paciente,
          },
          servicio: {
            id_servicio: cita.id_servicio,
            nombre_servicio: cita.nombre_servicio,
          },
          fecha_cita: cita.fecha_cita,
          hora: cita.hora.replace(/:\d{2}$/, ''),
          tipo: cita.tipo,
          asistencia: cita.asistencia,
        };
      });

      return { success: true, data: formattedCitas };
    } catch (error) {
      return { success: false, message: 'Error al obtener la lista de citas.' };
    }
  }

  async obtenerCitasPendientes() {
    try {
      const citas = await db.query(`
        SELECT cita.id_cita, cita.cedula_paciente, cita.id_servicio, DATE_FORMAT(cita.fecha_cita, '%d/%m/%Y') AS fecha_cita, cita.hora, cita.tipo, 
        paciente.nombres AS nombres_paciente, paciente.apellidos AS apellidos_paciente,
        servicios.nombre AS nombre_servicio, cita.asistencia
        FROM cita
        INNER JOIN paciente ON cita.cedula_paciente = paciente.cedula_paciente
        INNER JOIN servicios ON cita.id_servicio = servicios.id_servicio
        WHERE cita.asistencia = 'PENDIENTE'
        ORDER BY cita.id_cita DESC;
      `);
      
      const formattedCitas = citas.map((cita) => {
        return {
          id_cita: cita.id_cita,
          paciente: {
            cedula_paciente: cita.cedula_paciente,
            nombres_paciente: cita.nombres_paciente,
            apellidos_paciente: cita.apellidos_paciente,
          },
          servicio: {
            id_servicio: cita.id_servicio,
            nombre_servicio: cita.nombre_servicio,
          },
          fecha_cita: cita.fecha_cita,
          hora: cita.hora.replace(/:\d{2}$/, ''),
          tipo: cita.tipo,
          asistencia: cita.asistencia,
        };
      });

      function convertDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`);
      }

      formattedCitas.sort((a, b) => convertDate(a.fecha_cita) - convertDate(b.fecha_cita));

      return { success: true, data: formattedCitas };
    } catch (error) {
      return { success: false, message: 'Error al obtener la lista de citas.' };
    }
  }

  

  async obtenerCitaPorId(id_cita) {
    try {
      const cita = await db.query(`
        SELECT cita.id_cita, cita.cedula_paciente, cita.id_servicio, cita.fecha_cita, cita.hora, cita.tipo, 
        paciente.nombres AS nombres_paciente, paciente.apellidos AS apellidos_paciente,
        servicios.nombre AS nombre_servicio, cita.asistencia
        FROM cita
        INNER JOIN paciente ON cita.cedula_paciente = paciente.cedula_paciente
        INNER JOIN servicios ON cita.id_servicio = servicios.id_servicio
        WHERE cita.id_cita = ?;
      `, [id_cita]);

      if (cita.length === 0) {
        return { success: false, message: 'Cita no encontrada.' };
      }

      const formattedCita = {
        id_cita: cita[0].id_cita,
        paciente: {
          cedula_paciente: cita[0].cedula_paciente,
          nombres_paciente: cita[0].nombres_paciente,
          apellidos_paciente: cita[0].apellidos_paciente,
        },
        servicio: {
          id_servicio: cita[0].id_servicio,
          nombre_servicio: cita[0].nombre_servicio,
        },
        fecha_cita: cita[0].fecha_cita,
        hora: cita[0].hora.replace(/:\d{2}$/, ''),
        tipo: cita[0].tipo,
        asistencia: cita[0].asistencia,
      };

      return { success: true, data: formattedCita };
    } catch (error) {
      return { success: false, message: 'Error al obtener la cita.' };
    }
  }

  async actualizarCita(id_cita, cita) {
    try {
      const { cedula_paciente, id_servicio, fecha_cita, hora, tipo } = cita;

      const result = await db.query('UPDATE cita SET cedula_paciente = ?, id_servicio = ?, fecha_cita = ?, hora = ?, tipo = ? WHERE id_cita = ?', [cedula_paciente, id_servicio, fecha_cita, hora, tipo, id_cita]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Cita no encontrada.' };
      }

      return { success: true, message: 'Cita actualizada exitosamente.' };
    } catch (error) {
      return { success: false, message: 'Error al actualizar la cita.' };
    }
  }

  async eliminarCita(id_cita) {
    try {
      const result = await db.query('DELETE FROM cita WHERE id_cita = ?', [id_cita]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Cita no encontrada.' };
      }

      return { success: true, message: 'Cita eliminada exitosamente de la base de datos.' };
    } catch (error) {
      return { success: false, message: 'Error al eliminar la cita de la base de datos.' };
    }
  }

  // async reporteAsistenciaAusenciaPorServicio(){

  //   try{

  //     const citas = await db.query(`
  //       SELECT cita.id_cita, cita.cedula_paciente, cita.id_servicio, DATE_FORMAT(cita.fecha_cita, '%d/%m/%Y') AS fecha_cita, cita.hora, cita.tipo, 
  //       paciente.nombres AS nombres_paciente, paciente.apellidos AS apellidos_paciente,
  //       servicios.nombre AS nombre_servicio, cita.asistencia
  //       FROM cita
  //       INNER JOIN paciente ON cita.cedula_paciente = paciente.cedula_paciente
  //       INNER JOIN servicios ON cita.id_servicio = servicios.id_servicio
  //       ORDER BY cita.id_cita DESC;;
  //     `);
      
  //     const formattedCitas = citas.map((cita) => {
  //       return {
  //         id_cita: cita.id_cita,
  //         paciente: {
  //           cedula_paciente: cita.cedula_paciente,
  //           nombres_paciente: cita.nombres_paciente,
  //           apellidos_paciente: cita.apellidos_paciente,
  //         },
  //         servicio: {
  //           id_servicio: cita.id_servicio,
  //           nombre_servicio: cita.nombre_servicio,
  //         },
  //         fecha_cita: cita.fecha_cita,
  //         hora: cita.hora.replace(/:\d{2}$/, ''),
  //         tipo: cita.tipo,
  //         asistencia: cita.asistencia,
  //       };
  //     });

  //     const reporteAsistenciasPorServicio = formattedCitas.reduce((acumulador, cita) => {
  //       const nombreServicio = cita.servicio.nombre_servicio;
  //       const asistencia = cita.asistencia;

  //       if (!acumulador[nombreServicio]) {
  //         acumulador[nombreServicio] = { asistio: 0, noAsistio: 0 };
  //       }

  //       if (asistencia === 'ASISTIO') {
  //         acumulador[nombreServicio].asistio++;
  //       } else if (asistencia === 'NO ASISTIO') {
  //         acumulador[nombreServicio].noAsistio++;
  //       }

  //       return acumulador;
  //     }, {});

  //     console.log(reporteAsistenciasPorServicio);

  //   }catch(error){console.log(error.message)}
  // }
}

module.exports = new citaController();
