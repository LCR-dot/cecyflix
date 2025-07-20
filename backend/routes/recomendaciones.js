// routes/recomendaciones.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error('❌ No se encontró OPENROUTER_API_KEY');
}

router.post('/', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Eres un recomendador de películas.' },
                    { role: 'user', content: prompt }
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${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}`, // ✅ corregido
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('✅ API KEY cargada:', apiKey);

        const recomendacion = response?.data?.choices?.[0]?.message?.content;

        if (!recomendacion) {
            console.error('❌ Respuesta inválida de OpenRouter:', response.data);
            return res.status(500).json({ recomendacion: '❌ Error al procesar la respuesta de IA.' });
        }

        res.json({ recomendacion });

    } catch (error) {
        console.error('❌ Error al llamar a OpenRouter:', error?.response?.data || error.message);
        res.status(500).json({ recomendacion: '❌ Error al generar recomendación IA.' });
    }
});

module.exports = router;
