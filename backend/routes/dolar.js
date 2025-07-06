const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const router = express.Router();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // solo si da error SSL
});

router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.bcv.org.ve/', { httpsAgent });
    const $ = cheerio.load(data);

    // Obtener el contenido del div con id "dolar"
    const valorTexto = $('#dolar').text().trim();

    // Buscar número dentro del texto (ej: "Bs. 36,22" → 36.22)
    const match = valorTexto.match(/([\d.,]+)/);
    const valorDolar = match ? parseFloat(match[1].replace(',', '.')) : null;

    if (valorDolar) {
      res.json({ dolar_bcv: valorDolar });
    } else {
      res.status(500).json({ error: 'No se pudo extraer el valor del dólar' });
    }

  } catch (error) {
    console.error('Error al hacer scraping:', error.message);
    res.status(500).json({ error: 'Error al obtener datos del BCV' });
  }
});

module.exports = router;
