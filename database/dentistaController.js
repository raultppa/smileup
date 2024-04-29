const db = require('./database');

class dentistaController {

  async crearDentista(dentista) {
    try {
      const { cedula_dentista, nombres, apellidos, id_especialidad, telefonos } = dentista;

      await db.query('INSERT INTO dentista (cedula_dentista, nombres, apellidos, especialidad) VALUES (?, ?, ?, ?)', [cedula_dentista, nombres, apellidos, id_especialidad]);

      if (telefonos && telefonos.length > 0) {
        for (const telefono of telefonos) {
          await db.query('INSERT INTO telefonos_dentistas (telefono_dentista, cedula_dentista) VALUES (?, ?)', [telefono, cedula_dentista]);
        }
      }

      return { success: true, message: 'dentista creado exitosamente.' };
    } catch (error) {
      return { success: false, message: 'Error al crear el dentista. La cédula o el teléfono ya se encuentran registrados' };
    }
  }

  async obtenerDentistas() {
    try {
      const dentistas = await db.query(`
        SELECT d.cedula_dentista, d.nombres, d.apellidos, s.id_servicio AS id_especialidad, s.nombre AS nombre_especialidad, GROUP_CONCAT(td.telefono_dentista) AS telefonos
        FROM dentista d
        INNER JOIN servicios s ON d.especialidad = s.id_servicio
        LEFT JOIN telefonos_dentistas td ON d.cedula_dentista = td.cedula_dentista
        GROUP BY d.cedula_dentista;
      `);

      const mapeoDentistas = dentistas.map(dentista => ({
        cedula_dentista: dentista.cedula_dentista,
        nombres: dentista.nombres,
        apellidos: dentista.apellidos,
        especialidad: {
          id_especialidad: dentista.id_especialidad,
          nombre_especialidad: dentista.nombre_especialidad,
        },
        telefonos: dentista.telefonos,
      }));

      return { success: true, data: mapeoDentistas };
    } catch (error) {
      return { success: false, message: 'Error al obtener la lista de dentistas.' };
    }
  }

  async obtenerDentistaPorCedula(cedula) {
    try {
      const dentista = await db.query(`
        SELECT d.cedula_dentista, d.nombres, d.apellidos, s.id_servicio AS id_especialidad, s.nombre AS nombre_especialidad
        FROM dentista d
        INNER JOIN servicios s ON d.especialidad = s.id_servicio
        WHERE d.cedula_dentista = ?;
      `, [cedula]);

      if (dentista.length === 0) {
        return { success: false, message: 'dentista no encontrado.' };
      }

      const telefonos = await db.query('SELECT telefono_dentista FROM telefonos_dentistas WHERE cedula_dentista = ?', [cedula]);

      const mapeoDentista = {
        cedula_dentista: dentista[0].cedula_dentista,
        nombres: dentista[0].nombres,
        apellidos: dentista[0].apellidos,
        especialidad: {
          id: dentista[0].id_especialidad,
          nombre_especialidad: dentista[0].nombre_especialidad,
        },
        telefonos: telefonos.map(t => t.telefono_dentista).join(','),
      };

      return { success: true, data: mapeoDentista };
    } catch (error) {
      return { success: false, message: 'Error al obtener el dentista.' };
    }
  }

  async actualizarDentista(temp_cedula, dentista) {
    try {
      console.log(dentista);
      console.log(temp_cedula);

      const { cedula_dentista, nombres, apellidos, id_especialidad, telefonos } = dentista;

      await db.query('DELETE FROM telefonos_dentistas WHERE cedula_dentista = ?', [cedula_dentista]);
      await db.query('DELETE FROM dentista WHERE cedula_dentista = ?', [cedula_dentista]);

      await db.query('INSERT INTO dentista (cedula_dentista, nombres, apellidos, especialidad) VALUES (?, ?, ?, ?)', [cedula_dentista, nombres, apellidos, id_especialidad]);

      if (telefonos && telefonos.length > 0) {
        for (const telefono of telefonos) {
          await db.query('INSERT INTO telefonos_dentistas (telefono_dentista, cedula_dentista) VALUES (?, ?)', [telefono, cedula_dentista]);
        }
      }

      return { success: true, message: 'dentista actualizado exitosamente.' };
    } catch (error) {
      return { success: false, message: 'Error al actualizar el dentista.' };
    }
  }

  async eliminarDentista(cedula_dentista) {
    try {
      await db.query('DELETE FROM telefonos_dentistas WHERE cedula_dentista = ?', [cedula_dentista]);
      await db.query('DELETE FROM dentista WHERE cedula_dentista = ?', [cedula_dentista]);

      return { success: true, message: 'dentista eliminado exitosamente de la base de datos.' };
    } catch (error) {
      return { success: false, message: 'Error al eliminar el dentista de la base de datos.' };
    }
  }
}

module.exports = new dentistaController();
