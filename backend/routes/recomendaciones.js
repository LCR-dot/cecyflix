// routes/recomendaciones.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo', // ⚠️ Usa 'openai/' no 'openrouter/'
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const recomendacion = response.data.choices[0].message.content;
        res.json({ recomendacion });

    } catch (error) {
        console.error('❌ Error al llamar a OpenRouter:', error?.response?.data || error.message);
        res.status(500).json({ recomendacion: '❌ Error al generar recomendación IA.' });
    }
});

module.exports = router;
