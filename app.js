const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

// Configuración de la base de datos PostgreSQL
  const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  });

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Middleware para parsear JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
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
    const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear usuario', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Endpoint para eliminar usuario por ID
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
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
    const { rowCount } = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, userId]);
    if (rowCount === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    }
  } catch (error) {
    console.error('Error al actualizar usuario', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Agregar usuario 
app.post('/addUser', async (req, res) => {
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', ['Luis', 'luis@utsc.com']);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al agregar usuario', error);
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; // Exportar la variable app
