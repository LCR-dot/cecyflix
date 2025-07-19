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
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // 🛡️ Validar la respuesta
        const recomendacion = response?.data?.choices?.[0]?.message?.content;

        if (!recomendacion) {
            console.error('⚠️ Respuesta inválida de OpenRouter:', response.data);
            return res.status(500).json({ recomendacion: '❌ Error al procesar la respuesta de IA.' });
        }

        res.json({ recomendacion });

    } catch (error) {
        console.error('❌ Error al llamar a OpenRouter:', error?.response?.data || error.message);
        res.status(500).json({ recomendacion: '❌ Error al generar recomendación IA.' });
    }
});

module.exports = router;
