const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Endpoint para obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para obtener detalle de usuario por ID
app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    console.error('Error al obtener detalle de usuario', error);
    res.status(500).send('Error interno del servidor');
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
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para eliminar usuario por ID
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error al eliminar usuario', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para actualizar usuario por ID
app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;
  try {
    const { rowCount } = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, userId]);
    if (rowCount === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('User updated successfully');
    }
  } catch (error) {
    console.error('Error al actualizar usuario', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
