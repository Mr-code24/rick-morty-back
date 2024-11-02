const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run('CREATE TABLE favorites (id INTEGER PRIMARY KEY, name TEXT, species TEXT, status TEXT, image TEXT)');
  }
});

// Endpoint para guardar favoritos
app.post('/api/favorites', (req, res) => {
  const { favorites } = req.body;
  const stmt = db.prepare('INSERT INTO favorites (name, species, status, image) VALUES (?, ?, ?, ?)');

  favorites.forEach(fav => {
    stmt.run(fav.name, fav.species, fav.status, fav.image);
  });
  stmt.finalize();
  res.status(200).send({ message: 'Favorites saved successfully' });
});

// Endpoint para obtener favoritos
app.get('/api/favorites', (req, res) => {
  db.all('SELECT * FROM favorites', [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(rows);
    }
  });
});

app.delete('/api/favorites/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM favorites WHERE id = ?', [id], function (err) {
      if (err) {
          res.status(500).send({ error: 'Failed to delete favorite' });
      } else {
          res.status(200).send({ message: 'Favorite deleted successfully' });
      }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
