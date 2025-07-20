// routes/recomendaciones.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config(); // Asegúrate de que esto esté antes de usar process.env

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error('❌ No se encontró OPENROUTER_API_KEY. Verifica tu archivo .env o variables de entorno.');
}

router.post('/', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'El prompt es requerido.' });
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openrouter/openai/gpt-4o-mini', // ✅ Modelo correcto vía OpenRouter
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const recomendacion = response?.data?.choices?.[0]?.message?.content;

        if (!recomendacion) {
            console.error('❌ Respuesta inválida de OpenRouter:', response.data);
            return res.status(500).json({ recomendacion: '❌ Error al procesar la respuesta de IA.' });
        }

        res.json({ recomendacion });

    } catch (error) {
        console.error('❌ Error al llamar a OpenRouter:', error?.response?.data || error.message);
        const status = error?.response?.status || 500;
        res.status(status).json({ recomendacion: '❌ Error al generar recomendación IA.' });
    }
});

module.exports = router;