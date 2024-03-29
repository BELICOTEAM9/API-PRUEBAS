// Importar las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { exec } = require('child_process');

// Crear una instancia de la aplicación Express
const app = express();
const PORT = 3000;

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Ruta para la ruta raíz "/"
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi aplicación Express!');
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Middleware para parsear JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definir la ruta para ejecutar las pruebas y mostrar los resultados en formato JSON
app.get('/run-tests', async (req, res) => {
  try {
    const { stdout, stderr } = await runTests();
    if (!stderr) {
      res.status(200).json({ stdout });
    } else {
      res.status(500).json({ error: stderr });
    }
  } catch (error) {
    console.error('Error al ejecutar las pruebas:', error);
    res.status(500).json({ error: 'Error al ejecutar las pruebas' });
  }
});

// Endpoint para obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No se encontraron usuarios' });
    }
  } catch (error) {
    console.error('Error al obtener usuarios', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Endpoint para obtener detalle de usuario por ID
app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error('Error al obtener detalle de usuario', error);
    res.status(500).json({ error: 'Error al obtener detalle de usuario' });
  }
});

// Endpoint para crear usuario
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!name || !email) {
      res.status(400).json({ error: 'Faltan datos obligatorios (nombre o correo electrónico)' });
      return;
    }

    const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json({ message: 'Usuario creado exitosamente', id: rows[0].id });
  } catch (error) {
    console.error('Error al crear usuario', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Endpoint para eliminar usuario por ID
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    }
  } catch (error) {
    console.error('Error al eliminar usuario', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Endpoint para actualizar usuario por ID
app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  try {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.status(200).json({ message: 'Usuario actualizado exitosamente', email: result.rows[0].email });
    }
  } catch (error) {
    console.error('Error al actualizar usuario', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Endpoint para ejecutar las pruebas y mostrar los resultados
app.get('/run-tests', async (req, res) => {
  try {
    const { stdout, stderr } = await runTests();
    if (!stderr) {
      res.status(200).json({ stdout });
    } else {
      res.status(500).json({ error: stderr });
    }
  } catch (error) {
    console.error('Error al ejecutar las pruebas:', error);
    res.status(500).json({ error: 'Error al ejecutar las pruebas' });
  }
});

// Función para ejecutar las pruebas
function runTests() {
  return new Promise((resolve, reject) => {
    exec('npm test', (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// Iniciar el servidor solo si se ejecuta directamente
if (!process.env.TEST_ENV) {
  const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
