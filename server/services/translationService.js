const axios = require('axios');
const { config, googleTranslateClient } = require('../config/translation');
const logger = require('../config/logger');

/**
 * Public Google Translate API fallback (gtx endpoint with dj=1)
 * Very stable and behaves like the real API.
 */
async function translateFallback(text, source, target) {
  logger.info(`Using public Google Translate API fallback for: [${source} -> ${target}]`);
  
  // Format sl=auto or appropriate language code
  const sl = source === 'auto-detect' || source === 'auto' ? 'auto' : source;
  const tl = target;
  
  const url = `https://translate.googleapis.com/translate_a/single`;
  const response = await axios.get(url, {
    params: {
      client: 'gtx',
      dt: 't',
      dj: '1',
      sl: sl,
      tl: tl,
      q: text
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.data || !response.data.sentences) {
    throw new Error('Unexpected translation response structure from fallback API');
  }

  const translatedText = response.data.sentences.map(s => s.trans).join('');
  const detectedSourceLanguage = response.data.src || 'unknown';
  const confidence = response.data.confidence || 1.0;

  return {
    translatedText,
    detectedSourceLanguage,
    confidence,
    apiUsed: 'google_fallback'
  };
}

/**
 * Official Google Translation Cloud API
 */
async function translateGoogleCloud(text, source, target) {
  if (!googleTranslateClient) {
    logger.warn('Google Translate Client not initialized. Falling back to public API.');
    return translateFallback(text, source, target);
  }

  logger.info(`Using Google Cloud Translation API for: [${source} -> ${target}]`);
  const sl = source === 'auto-detect' || source === 'auto' ? null : source;
  
  try {
    const parent = `projects/${config.google.projectId}/locations/global`;
    const request = {
      parent,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode: target,
    };

    if (sl) {
      request.sourceLanguageCode = sl;
    }

    const [response] = await googleTranslateClient.translateText(request);
    const translation = response.translations[0];
    
    return {
      translatedText: translation.translatedText,
      detectedSourceLanguage: translation.detectedSourceLanguageCode || source,
      confidence: 1.0, // Google Cloud v3 does not return confidence score directly in translateText
      apiUsed: 'google_cloud_official'
    };
  } catch (error) {
    logger.error('Google Cloud Translation API failed:', error.message);
    // Graceful fallback to avoid service disruption
    return translateFallback(text, source, target);
  }
}

/**
 * Official Microsoft Translator Text API
 */
async function translateMicrosoft(text, source, target) {
  const apiKey = config.microsoft.key;
  if (!apiKey) {
    logger.warn('Microsoft Translator key is missing. Falling back to public API.');
    return translateFallback(text, source, target);
  }

  logger.info(`Using Microsoft Translator API for: [${source} -> ${target}]`);
  
  try {
    const fromParam = source === 'auto-detect' || source === 'auto' ? '' : `&from=${source}`;
    const url = `${config.microsoft.endpoint}/translate?api-version=3.0${fromParam}&to=${target}`;

    const response = await axios.post(
      url,
      [{ text }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Ocp-Apim-Subscription-Region': config.microsoft.region,
          'Content-Type': 'application/json',
        }
      }
    );

    const result = response.data[0];
    const translation = result.translations[0];
    const detectedSourceLanguage = result.detectedLanguage ? result.detectedLanguage.language : source;
    const confidence = result.detectedLanguage ? result.detectedLanguage.score : 1.0;

    return {
      translatedText: translation.text,
      detectedSourceLanguage,
      confidence,
      apiUsed: 'microsoft_translator_official'
    };
  } catch (error) {
    logger.error('Microsoft Translator API failed:', error.message);
    return translateFallback(text, source, target);
  }
}

/**
 * Main Translation Handler
 */
async function translateText(text, source, target) {
  // If target and source are identical, return text immediately
  if (source === target) {
    return {
      translatedText: text,
      detectedSourceLanguage: source,
      confidence: 1.0,
      apiUsed: 'identity_map'
    };
  }

  const apiMode = config.preferredApi;

  if (apiMode === 'google') {
    return translateGoogleCloud(text, source, target);
  } else if (apiMode === 'microsoft') {
    return translateMicrosoft(text, source, target);
  } else {
    return translateFallback(text, source, target);
  }
}

module.exports = {
  translateText
};
