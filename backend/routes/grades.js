const { Grade, Student, Course } = require('../model');
const emailService = require('../services/emailService');

// ========================================
// ROUTES ADMIN/SCOLARITÉ (CLERK)
// ========================================

// Récupérer toutes les notes
exports.getAll = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'firstName lastName email studentNumber')
      .populate('course', 'name code credits')
      .sort({ date: -1 });
    
    console.log('✅ Notes récupérées:', grades.length);
    res.json(grades);
  } catch (error) {
    console.error('❌ Erreur getAll grades:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer une note par ID
exports.getById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'firstName lastName email studentNumber')
      .populate('course', 'name code credits');
    
    if (!grade) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    res.json(grade);
  } catch (error) {
    console.error('❌ Erreur getById grade:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer une nouvelle note
exports.create = async (req, res) => {
  try {
    const { student, course, grade } = req.body;
    
    if (!student || !course || grade === undefined) {
      return res.status(400).json({ error: 'Étudiant, cours et note requis' });
    }
    
    if (grade < 0 || grade > 20) {
      return res.status(400).json({ error: 'La note doit être entre 0 et 20' });
    }
    
    // Vérifier si l'étudiant existe
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }
    
    // Vérifier si le cours existe
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    // Vérifier si une note existe déjà pour cet étudiant et ce cours
    const existingGrade = await Grade.findOne({ student, course });
    if (existingGrade) {
      return res.status(400).json({ 
        error: 'Une note existe déjà pour cet étudiant dans ce cours. Utilisez la mise à jour.' 
      });
    }
    
    const newGrade = new Grade({
      student,
      course,
      grade,
      date: new Date()
    });
    
    await newGrade.save();
    
    // Populate pour la réponse
    await newGrade.populate('student', 'firstName lastName email studentNumber');
    await newGrade.populate('course', 'name code credits');
    
    console.log(`✅ Note créée: ${grade}/20 pour ${studentExists.firstName} ${studentExists.lastName} en ${courseExists.name}`);
    
    // Envoyer un email de notification à l'étudiant
    try {
      await emailService.sendGradeNotification({
        studentEmail: studentExists.email,
        studentName: `${studentExists.firstName} ${studentExists.lastName}`,
        courseName: courseExists.name,
        courseCode: courseExists.code,
        grade: grade
      });
      console.log(`📧 Notification envoyée à ${studentExists.email}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email notification:', emailError.message);
    }
    
    res.status(201).json(newGrade);
  } catch (error) {
    console.error('❌ Erreur create grade:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Une note existe déjà pour cet étudiant dans ce cours' });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour une note
exports.update = async (req, res) => {
  try {
    const { grade } = req.body;
    
    if (grade === undefined) {
      return res.status(400).json({ error: 'Note requise' });
    }
    
    if (grade < 0 || grade > 20) {
      return res.status(400).json({ error: 'La note doit être entre 0 et 20' });
    }
    
    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { grade, date: new Date() },
      { new: true, runValidators: true }
    )
      .populate('student', 'firstName lastName email studentNumber')
      .populate('course', 'name code credits');
    
    if (!updatedGrade) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    console.log(`✅ Note modifiée: ${grade}/20 pour ${updatedGrade.student.firstName} ${updatedGrade.student.lastName}`);
    
    // Envoyer une notification de mise à jour
    try {
      await emailService.sendGradeNotification({
        studentEmail: updatedGrade.student.email,
        studentName: `${updatedGrade.student.firstName} ${updatedGrade.student.lastName}`,
        courseName: updatedGrade.course.name,
        courseCode: updatedGrade.course.code,
        grade: grade
      });
      console.log(`📧 Notification de mise à jour envoyée`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email:', emailError.message);
    }
    
    res.json(updatedGrade);
  } catch (error) {
    console.error('❌ Erreur update grade:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer une note
exports.delete = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    
    if (!grade) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    console.log(`✅ Note supprimée`);
    res.json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur delete grade:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer les notes d'un étudiant connecté via Clerk
exports.getMyGrades = async (req, res) => {
  try {
    // req.user est défini par le middleware getCurrentUser
    if (!req.user || !req.user.studentId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    
    const grades = await Grade.find({ student: req.user.studentId })
      .populate('course', 'name code credits')
      .populate('student', 'firstName lastName studentNumber')
      .sort({ date: -1 });
    
    console.log('✅ Notes chargées pour étudiant Clerk:', req.user.studentId);
    res.json(grades);
  } catch (error) {
    console.error('❌ Erreur getMyGrades:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ========================================
// ROUTES ÉTUDIANTS (JWT)
// ========================================

// Récupérer les notes de l'étudiant connecté (via JWT)
exports.getMyGradesStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.student._id })
      .populate('course', 'name code credits')
      .populate('student', 'firstName lastName studentNumber')
      .sort({ date: -1 });
    
    console.log('✅ Notes chargées pour étudiant JWT:', req.student._id, '- Total:', grades.length);
    res.json(grades);
  } catch (error) {
    console.error('❌ Erreur getMyGradesStudent:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};