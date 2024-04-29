const db = require('./database');

class servicioController {
  async crearServicio(servicio) {
    try {
      const { nombre_servicio } = servicio;

      const result = await db.query('INSERT INTO servicios (nombre) VALUES (?)', [nombre_servicio]);

      return { success: true, message: 'Servicio creado exitosamente.', id_servicio: result.insertId };
    } catch (error) {
      return { success: false, message: 'Error al crear el servicio.' };
    }
  }

  async obtenerServicios() {
    try {
      const servicios = await db.query('SELECT * FROM servicios');
      return { success: true, data: servicios };
    } catch (error) {
      return { success: false, message: 'Error al obtener la lista de servicios.' };
    }
  }

  async obtenerServicioPorId(id_servicio) {
    try {
      const servicio = await db.query('SELECT * FROM servicios WHERE id_servicio = ?', [id_servicio]);

      if (servicio.length === 0) {
        return { success: false, message: 'Servicio no encontrado.' };
      }

      return { success: true, data: servicio[0] };
    } catch (error) {
      return { success: false, message: 'Error al obtener el servicio.' };
    }
  }

  async actualizarServicio(id_servicio, servicio) {
    try {
      const { nombre_servicio } = servicio;

      const result = await db.query('UPDATE servicios SET nombre = ? WHERE id_servicio = ?', [nombre_servicio, id_servicio]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Servicio no encontrado.' };
      }

      return { success: true, message: 'Servicio actualizado exitosamente.' };
    } catch (error) {
      return { success: false, message: 'Error al actualizar el servicio.' };
    }
  }

  async eliminarServicio(id_servicio) {
    try {
      const result = await db.query('DELETE FROM servicios WHERE id_servicio = ?', [id_servicio]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Servicio no encontrado.' };
      }

      return { success: true, message: 'Servicio eliminado exitosamente de la base de datos.' };
    } catch (error) {

      if(error.code === 'ER_ROW_IS_REFERENCED_2'){
        return { success: false, message: 'ERROR:\n\nAlguno de los registros de los Dentistas depende de este servicio, no es posible eliminarlo sin antes eliminar el Dentista que esta usando este registro.' };
      }
      return { success: false, message: 'Error al eliminar el servicio de la base de datos.' };
    }
  }
}

module.exports = new servicioController();
