const express = require('express');
const app = express();
app.use(express.json());

// Route POST /api/medical-bill
app.post('/api/medical-bill', (req, res) => {
  // Une seule fonction avec tout le calcul, plein d'if/else imbriqués
  const { typeConsultation, isUrgenceNuit, mutuelle, age } = req.body;

  let tarifBase = 0;
  // Imbrication 1
  if (typeConsultation === 'base') {
    tarifBase = 50;
  } else {
    if (typeConsultation === 'specialiste') {
      tarifBase = 80;
    } else {
      tarifBase = 50; // fallback
    }
  }

  let majoration = 0;
  // Imbrication 2 - gestion de l'urgence de nuit
  if (isUrgenceNuit === true) {
    // Si patient > 65 ans, pas de majoration
    if (age > 65) {
      majoration = 0;
    } else {
      // majoration 100% = on ajoute le tarif de base
      if (tarifBase > 0) {
        majoration = tarifBase;
      } else {
        majoration = 0;
      }
    }
  } else {
    majoration = 0;
  }

  const totalAvantMutuelle = tarifBase + majoration;

  let resteAPayer = 0;
  // Imbrication 3 - mutuelle
  if (mutuelle === 'Premium') {
    resteAPayer = 0;
  } else {
    if (mutuelle === 'Basique') {
      // 70% pris en charge => reste 30%
      if (totalAvantMutuelle > 0) {
        resteAPayer = totalAvantMutuelle * 0.30;
      } else {
        resteAPayer = 0;
      }
    } else {
      // pas de mutuelle
      resteAPayer = totalAvantMutuelle;
    }
  }

  // Réponse finale
  res.json({
    tarifBase,
    majoration,
    totalAvantMutuelle,
    resteAPayer
  });
});

module.exports = app;