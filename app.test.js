const request = require('supertest');
const app = require('./app1');

describe('POST /api/medical-bill', () => {
  test('Consultation base, pas urgence, pas mutuelle', async () => {
    const res = await request(app)
      .post('/api/medical-bill')
      .send({ typeConsultation: 'base', isUrgenceNuit: false, mutuelle: null, age: 40 });
    expect(res.body.resteAPayer).toBe(50);
  });

  test('Spécialiste, urgence nuit, mutuelle basique, age <65', async () => {
    const res = await request(app)
      .post('/api/medical-bill')
      .send({ typeConsultation: 'specialiste', isUrgenceNuit: true, mutuelle: 'Basique', age: 40 });
    expect(res.body.resteAPayer).toBe(48); // 160 * 0.3
  });

  test('Urgence nuit annulée si age >65', async () => {
    const res = await request(app)
      .post('/api/medical-bill')
      .send({ typeConsultation: 'specialiste', isUrgenceNuit: true, mutuelle: null, age: 70 });
    expect(res.body.resteAPayer).toBe(80); // pas de majoration
  });

  test('Mutuelle Premium → reste 0', async () => {
    const res = await request(app)
      .post('/api/medical-bill')
      .send({ typeConsultation: 'specialiste', isUrgenceNuit: true, mutuelle: 'Premium', age: 30 });
    expect(res.body.resteAPayer).toBe(0);
  });

  test('Pas de mutuelle → plein tarif', async () => {
    const res = await request(app)
      .post('/api/medical-bill')
      .send({ typeConsultation: 'base', isUrgenceNuit: false, mutuelle: null, age: 30 });
    expect(res.body.resteAPayer).toBe(50);
  });
});