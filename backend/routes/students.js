const { Student } = require('../model');
const crypto = require('crypto');
const emailService = require('../services/emailService');

// ========================================
// ROUTES ADMIN/SCOLARITÉ (CLERK)
// ========================================

// Récupérer tous les étudiants
exports.getAll = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'clerkId')
      .sort({ createdAt: -1 })
      .select('-password');
    
    console.log('✅ Étudiants récupérés:', students.length);
    res.json(students);
  } catch (error) {
    console.error('❌ Erreur getAll students:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un étudiant par ID
exports.getById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId')
      .select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('❌ Erreur getById student:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un nouvel étudiant
exports.create = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Prénom, nom et email requis' });
    }
    
    // Vérifier si l'email existe déjà
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Un étudiant avec cet email existe déjà' });
    }
    
    // Générer un mot de passe temporaire
    const tempPassword = crypto.randomBytes(8).toString('hex');
    
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: tempPassword, // Sera crypté par le pre-save hook
    });
    
    await newStudent.save();
    
    console.log(`✅ Étudiant créé: ${firstName} ${lastName} (${newStudent.studentNumber})`);
    console.log(`🔑 Mot de passe temporaire: ${tempPassword}`);
    
    // Envoyer l'email avec les identifiants
    try {
      await emailService.sendWelcomeWithCredentials({
        studentEmail: email,
        studentName: `${firstName} ${lastName}`,
        studentNumber: newStudent.studentNumber,
        tempPassword,
      });
      console.log(`📧 Email envoyé à ${email}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email:', emailError.message);
    }
    
    // Retourner l'étudiant (sans le mot de passe crypté)
    const studentResponse = newStudent.toObject();
    delete studentResponse.password;
    
    res.status(201).json({
      ...studentResponse,
      tempPassword, // Pour affichage admin (à retirer en production)
    });
  } catch (error) {
    console.error('❌ Erreur create student:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Un étudiant avec cet email existe déjà' });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un étudiant
exports.update = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    // Vérifier si l'email est déjà utilisé par un autre étudiant
    if (email) {
      const existingStudent = await Student.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingStudent) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
    }
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    
    console.log(`✅ Étudiant modifié: ${student.firstName} ${student.lastName}`);
    
    res.json(student);
  } catch (error) {
    console.error('❌ Erreur update student:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un étudiant
exports.delete = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    
    console.log(`✅ Étudiant supprimé: ${student.firstName} ${student.lastName}`);
    
    res.json({ message: 'Étudiant supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur delete student:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ========================================
// ROUTES ÉTUDIANTS (JWT)
// ========================================

// Récupérer le profil de l'étudiant connecté (via JWT)
exports.getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Profil non trouvé' });
    }
    
    console.log('✅ Profil chargé pour:', student.email);
    res.json(student);
  } catch (error) {
    console.error('❌ Erreur getMyProfile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour le profil de l'étudiant connecté
exports.updateMyProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { firstName, lastName },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ error: 'Profil non trouvé' });
    }
    
    console.log('✅ Profil modifié pour:', student.email);
    res.json(student);
  } catch (error) {
    console.error('❌ Erreur updateMyProfile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, role } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    console.log('✅ Utilisateur modifié:', user.email);
    res.json(user);
  } catch (error) {
    console.error('❌ Erreur updateUser:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    console.log('✅ Utilisateur supprimé:', user.email);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur deleteUser:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};