const db = require('./database');

class tratamientoController {
  async crearTratamiento(tratamiento) {
    try {

      console.log(tratamiento);
      const { id_servicio, nombre, precio } = tratamiento;

      const result = await db.query('INSERT INTO tratamiento (id_servicio, nombre, precio) VALUES (?, ?, ?)', [id_servicio, nombre, precio]);

      return { success: true, message: 'Tratamiento creado exitosamente.', id_tratamiento: result.insertId };
    } catch (error) {
      return { success: false, message: 'Error al crear el tratamiento.' };
    }
  }

  async obtenerTratamientos() {
    try {
      const tratamientos = await db.query(`
        SELECT tratamiento.id_tratamiento, tratamiento.nombre AS nombre, TRUNCATE(tratamiento.precio, 2) AS precio, servicios.id_servicio, servicios.nombre AS nombre_servicio
        FROM tratamiento
        INNER JOIN servicios ON tratamiento.id_servicio = servicios.id_servicio
        ORDER BY tratamiento.id_tratamiento;
      `);

      const tratamientosFormatted = tratamientos.map(tratamiento => {
        return {
          id_tratamiento: tratamiento.id_tratamiento,
          nombre: tratamiento.nombre,
          precio: tratamiento.precio,
          servicio: {
            id_servicio: tratamiento.id_servicio,
            nombre_servicio: tratamiento.nombre_servicio,
          },
        };
      });

      return { success: true, data: tratamientosFormatted };
    } catch (error) {
      return { success: false, message: 'Error al obtener la lista de tratamientos.' };
    }
  }

  async obtenerTratamientoPorId(id_tratamiento) {
    try {
      const tratamiento = await db.query(`
        SELECT tratamiento.id_tratamiento, tratamiento.nombre AS nombre, tratamiento.precio, servicios.id_servicio, servicios.nombre AS nombre_servicio
        FROM tratamiento
        INNER JOIN servicios ON tratamiento.id_servicio = servicios.id_servicio
        WHERE tratamiento.id_tratamiento = ?;
      `, [id_tratamiento]);

      if (tratamiento.length === 0) {
        return { success: false, message: 'Tratamiento no encontrado.' };
      }

      const tratamientoFormatted = {
        id_tratamiento: tratamiento[0].id_tratamiento,
        nombre: tratamiento[0].nombre,
        precio: tratamiento[0].precio,
        servicio: {
          id_servicio: tratamiento[0].id_servicio,
          nombre_servicio: tratamiento[0].nombre_servicio,
        },
      };

      return { success: true, data: tratamientoFormatted };
    } catch (error) {
      return { success: false, message: 'Error al obtener el tratamiento.' };
    }
  }

  async actualizarTratamiento(id_tratamiento, tratamiento) {
    try {
      console.log(tratamiento);
      const { id_servicio, nombre, precio } = tratamiento;

      const result = await db.query('UPDATE tratamiento SET id_servicio = ?, nombre = ?, precio = ? WHERE id_tratamiento = ?', [id_servicio, nombre, precio, id_tratamiento]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Tratamiento no encontrado.' };
      }

      return { success: true, message: 'Tratamiento actualizado exitosamente.' };
    } catch (error) {
      return { success: false, message: 'Error al actualizar el tratamiento.' };
    }
  }

  async eliminarTratamiento(id_tratamiento) {
    try {
      const result = await db.query('DELETE FROM tratamiento WHERE id_tratamiento = ?', [id_tratamiento]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Tratamiento no encontrado.' };
      }

      return { success: true, message: 'Tratamiento eliminado exitosamente de la base de datos.' };
    } catch (error) {
      return { success: false, message: 'Error al eliminar el tratamiento de la base de datos.' };
    }
  }
}

module.exports = new tratamientoController();
