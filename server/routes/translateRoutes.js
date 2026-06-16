const express = require('express');
const router = express.Router();
const { translateText } = require('../controllers/translateController');
const { validateTranslate } = require('../middleware/validateMiddleware');
const { translateRateLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * /translate:
 *   post:
 *     summary: Translate text from source language to target language
 *     tags: [Translation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - source
 *               - target
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to translate. Max 5000 chars.
 *                 example: Hello
 *               source:
 *                 type: string
 *                 description: ISO language code of source (e.g. 'en', or 'auto' for auto-detection)
 *                 example: en
 *               target:
 *                 type: string
 *                 description: ISO language code of target (e.g. 'te' for Telugu, 'es' for Spanish)
 *                 example: te
 *     responses:
 *       200:
 *         description: Successful translation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translatedText:
 *                   type: string
 *                   example: హలో
 *                 detectedSourceLanguage:
 *                   type: string
 *                   example: en
 *                 confidence:
 *                   type: number
 *                   example: 1
 *                 apiUsed:
 *                   type: string
 *                   example: google_fallback
 *       400:
 *         description: Invalid input parameters
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal Server Error
 */
router.post('/translate', translateRateLimiter, validateTranslate, translateText);

module.exports = router;
