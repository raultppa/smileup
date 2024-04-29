const db = require('./database');

class pacienteController {

  async crearPaciente(paciente) {
    try {
      
      const { cedula_paciente, nombres, apellidos, direccion, FechaNacimiento, activo, telefonos } = paciente;
      console.log(paciente);

      await db.query('INSERT INTO paciente (cedula_paciente, nombres, apellidos, direccion, FechaNacimiento, activo) VALUES (?, ?, ?, ?, ?, ?)', [cedula_paciente, nombres, apellidos, direccion, FechaNacimiento, activo]);

      if (telefonos && telefonos.length > 0) {
        for (const telefono of telefonos) {
          await db.query('INSERT INTO telefonos_pacientes (telefono_paciente, cedula_paciente) VALUES (?, ?)', [telefono, cedula_paciente]);
        }
      }

      return { success: true, message: 'Paciente creado exitosamente.' };
    } catch (error) {
      return { success: false, message: 'Error al crear el paciente. La cedula o el telefono ya se encuentran registrados' };
    }
  }

  async obtenerPacientes() {
    try {
      const pacientes = await db.query(`SELECT paciente.cedula_paciente, paciente.nombres, paciente.apellidos, paciente.direccion, DATE_FORMAT(paciente.FechaNacimiento, '%d/%m/%Y') AS FechaNacimiento, paciente.activo, GROUP_CONCAT(telefonos_pacientes.telefono_paciente) AS telefonos FROM paciente LEFT JOIN telefonos_pacientes ON paciente.cedula_paciente = telefonos_pacientes.cedula_paciente GROUP BY paciente.cedula_paciente;`);
      return { success: true, data: pacientes };
    } catch (error) {
      return { success: false, message: 'Error al obtener la lista de pacientes.' };
    }
  }

  async obtenerPacientePorCedula(cedula) {
    try {
      const paciente = await db.query('SELECT * FROM paciente WHERE cedula_paciente = ?', [cedula]);
      if (paciente.length === 0) {
        return { success: false, message: 'Paciente no encontrado.' };
      }
      
      const telefonos = await db.query('SELECT telefono_paciente FROM telefonos_pacientes WHERE cedula_paciente = ?', [cedula]);
      paciente[0].telefonos = telefonos.map(t => t.telefono_paciente);

      return { success: true, data: paciente[0] };
    } catch (error) {
      return { success: false, message: 'Error al obtener el paciente.' };
    }
  }

  async actualizarPaciente(temp_cedula, paciente) {
    try {

      const {cedula_paciente, nombres, apellidos, direccion, FechaNacimiento, activo, telefonos } = paciente;
      console.log(paciente);

      // Eliminar los teléfonos existentes del paciente
      await db.query('DELETE FROM telefonos_pacientes WHERE cedula_paciente = ?', [temp_cedula]);

      // Actualizar los datos del paciente
      await db.query(
        'DELETE FROM paciente WHERE cedula_paciente = ?', [temp_cedula]
      );
      await db.query(
        'INSERT INTO paciente (cedula_paciente, nombres, apellidos, direccion, FechaNacimiento, activo) VALUES (?, ?, ?, ?, ?, ?)', [cedula_paciente, nombres, apellidos, direccion, FechaNacimiento, activo]
      );
      // Insertar los nuevos números de teléfono
      if (telefonos && telefonos.length > 0) {
        for (const telefono of telefonos) {
          await db.query('INSERT INTO telefonos_pacientes (telefono_paciente, cedula_paciente) VALUES (?, ?)', [telefono, cedula_paciente]);
        }
      }

      return { success: true, message: 'Paciente actualizado exitosamente.' };
    } catch (error) {
      return { success: false, message: 'Error al actualizar el paciente.' };
    }
  }

  async eliminarPaciente(cedula_paciente) {
    try {
      // Eliminar el paciente
      await db.query('DELETE FROM telefonos_pacientes WHERE cedula_paciente = ?', [cedula_paciente]);
      await db.query('DELETE FROM paciente WHERE cedula_paciente = ?', [cedula_paciente]);

      return { success: true, message: 'Paciente Eliminado exitosamente de la base de datos.' };
    } catch (error) {
      return { success: false, message: 'Error al Eliminar el paciente de la base de datos.' };
    }
  }
}

module.exports = new pacienteController();
