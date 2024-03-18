const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const faker = require('faker');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'db', 
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

app.use(bodyParser.json());

// Mock de usuarios
const mockUsers = Array.from({ length: 10 }, () => ({
  id: faker.datatype.uuid(),
  name: faker.name.firstName(),
  email: faker.internet.email(),
}));

// Rutas
app.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;
    res.status(200).json(users);
    client.release();
  } catch (error) {
    console.error('Error al obtener usuarios', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
    client.release();
  } catch (error) {
    console.error('Error al obtener usuario', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const id = faker.datatype.uuid();
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *', [id, name, email]);
    const newUser = result.rows[0];
    res.status(201).json(newUser);
    client.release();
  } catch (error) {
    console.error('Error al crear usuario', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
