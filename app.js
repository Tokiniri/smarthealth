const express = require('express');
const app = express();
app.use(express.json());

// Fonctions pures
const getTarifBase = (typeConsultation) => {
  return typeConsultation === 'specialiste' ? 80 : 50;
};

const getMajoration = (tarifBase, isUrgenceNuit, age) => {
  if (!isUrgenceNuit) return 0;
  if (age > 65) return 0;
  return tarifBase; // +100%
};

const appliquerMutuelle = (montant, mutuelle) => {
  if (mutuelle === 'Premium') return 0;
  if (mutuelle === 'Basique') return montant * 0.30;
  return montant;
};

// Route unique mais avec fonctions auxiliaires
app.post('/api/medical-bill', (req, res) => {
  const { typeConsultation, isUrgenceNuit, mutuelle, age } = req.body;

  const tarifBase = getTarifBase(typeConsultation);
  const majoration = getMajoration(tarifBase, isUrgenceNuit, age);
  const totalAvantMutuelle = tarifBase + majoration;
  const resteAPayer = appliquerMutuelle(totalAvantMutuelle, mutuelle);

  res.json({ tarifBase, majoration, totalAvantMutuelle, resteAPayer });
});

module.exports = app;