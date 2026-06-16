const request = require('supertest');
const server = require('../server');

afterAll((done) => {
  server.close(done); // Close server connection after tests
});

describe('Translation API Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 OK and status JSON', async () => {
      const res = await request(server).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /translate', () => {
    it('should translate text successfully', async () => {
      const res = await request(server)
        .post('/translate')
        .send({
          text: 'Hello',
          source: 'en',
          target: 'es'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('translatedText');
      expect(res.body).toHaveProperty('detectedSourceLanguage');
      expect(res.body).toHaveProperty('confidence');
      expect(res.body.translatedText.toLowerCase()).toContain('hola');
    });

    it('should fail with 400 Bad Request if text is missing', async () => {
      const res = await request(server)
        .post('/translate')
        .send({
          source: 'en',
          target: 'es'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.error.message).toContain('Text is a required field');
    });

    it('should fail with 400 Bad Request if source language is missing', async () => {
      const res = await request(server)
        .post('/translate')
        .send({
          text: 'Hello',
          target: 'es'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.error.message).toContain('Source language is a required field');
    });

    it('should translate with auto-detect successfully', async () => {
      const res = await request(server)
        .post('/translate')
        .send({
          text: 'Comment ça va?',
          source: 'auto',
          target: 'en'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('translatedText');
      expect(res.body.detectedSourceLanguage).toEqual('fr');
    });
  });
});
