const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Student } = require('../model');

// LOGIN ÉTUDIANT
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    console.log('🔐 Tentative de connexion:', email);

    // Trouver l'étudiant
    const student = await Student.findOne({ email });
    
    if (!student) {
      console.log('❌ Étudiant non trouvé:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si le compte est actif
    if (!student.isActive) {
      console.log('❌ Compte désactivé:', email);
      return res.status(401).json({ error: 'Compte désactivé' });
    }

    // Comparer le mot de passe
    const isPasswordValid = await student.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour la dernière connexion
    student.lastLogin = new Date();
    await student.save();

    // Générer le token JWT
    const token = jwt.sign(
      { 
        studentId: student._id, 
        email: student.email,
        role: 'etudiant'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Connexion réussie:', email);

    // Retourner les infos (sans le mot de passe)
    res.json({
      token,
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentNumber: student.studentNumber,
        createdAt: student.createdAt,
        lastLogin: student.lastLogin
      }
    });

  } catch (error) {
    console.error('❌ Erreur login étudiant:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// VÉRIFIER TOKEN
router.post('/student/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.studentId).select('-password');

    if (!student || !student.isActive) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    res.json({ student });

  } catch (error) {
    console.error('❌ Erreur vérification token:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

// CHANGER MOT DE PASSE
router.post('/student/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.studentId);

    if (!student) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mots de passe requis' });
    }

    // Vérifier le mot de passe actuel
    const isValid = await student.comparePassword(currentPassword);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Mettre à jour le mot de passe
    student.password = newPassword; // Sera crypté par le hook pre-save
    await student.save();

    console.log('✅ Mot de passe changé pour:', student.email);

    res.json({ message: 'Mot de passe modifié avec succès' });

  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;