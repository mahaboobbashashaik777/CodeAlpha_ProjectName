const translationService = require('../services/translationService');
const logger = require('../config/logger');

/**
 * @desc    Translate text
 * @route   POST /api/translate
 * @access  Public
 */
const translateText = async (req, res, next) => {
  const { text, source, target } = req.body;

  try {
    logger.debug(`Translation requested for text length ${text.length} from [${source}] to [${target}]`);
    
    const result = await translationService.translateText(text, source, target);
    
    return res.status(200).json({
      translatedText: result.translatedText,
      detectedSourceLanguage: result.detectedSourceLanguage,
      confidence: result.confidence,
      apiUsed: result.apiUsed
    });
  } catch (error) {
    logger.error(`Error in translateText controller: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  translateText
};
