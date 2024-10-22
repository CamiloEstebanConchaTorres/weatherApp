const express = require('express');
const path = require('path');
require('dotenv').config();
const weatherRoutes = require('./server/routes/weatherRoutes');

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/weather', weatherRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});