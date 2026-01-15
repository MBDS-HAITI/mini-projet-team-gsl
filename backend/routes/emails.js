const { User, Student } = require('../model');
const emailService = require('../services/emailService');

// Envoyer un email de l'admin vers un ou plusieurs étudiants
exports.sendToStudents = async (req, res) => {
  try {
    const { studentIds, subject, message } = req.body;
    
    // Validation
    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ error: 'Aucun étudiant sélectionné' });
    }
    
    if (!subject || !message) {
      return res.status(400).json({ error: 'Le sujet et le message sont requis' });
    }
    
    // Récupérer les informations de l'admin
    const adminName = `${req.user.firstName} ${req.user.lastName}`;
    
    // Récupérer les étudiants avec leurs emails
    const students = await Student.find({ _id: { $in: studentIds } })
      .populate('userId', 'email firstName lastName');
    
    if (students.length === 0) {
      return res.status(404).json({ error: 'Aucun étudiant trouvé' });
    }
    
    // Envoyer les emails
    const emailPromises = students.map(student => {
      if (!student.userId?.email) {
        console.warn(`⚠️ Étudiant sans email: ${student.firstName} ${student.lastName}`);
        return Promise.resolve({ success: false, reason: 'no_email' });
      }
      
      return emailService.sendAdminToStudentEmail({
        studentEmail: student.userId.email,
        studentName: `${student.firstName} ${student.lastName}`,
        subject,
        message,
        adminName,
      }).catch(error => {
        console.error(`Erreur envoi email à ${student.userId.email}:`, error);
        return { success: false, error: error.message };
      });
    });
    
    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      message: `${successCount} email(s) envoyé(s) sur ${students.length}`,
      successCount,
      totalCount: students.length,
      details: results,
    });
  } catch (error) {
    console.error('Erreur envoi emails:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi des emails' });
  }
};

// Envoyer un email d'un étudiant vers l'administration
exports.sendToAdmin = async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    // Validation
    if (!subject || !message) {
      return res.status(400).json({ error: 'Le sujet et le message sont requis' });
    }
    
    // Informations de l'étudiant
    const studentName = `${req.user.firstName} ${req.user.lastName}`;
    const studentEmail = req.user.email;
    
    // Trouver l'email de l'admin (ou utiliser l'email configuré)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    
    // Envoyer l'email
    await emailService.sendStudentToAdminEmail({
      studentEmail,
      studentName,
      subject,
      message,
      adminEmail,
    });
    
    res.json({
      message: 'Votre message a été envoyé à l\'administration',
      success: true,
    });
  } catch (error) {
    console.error('Erreur envoi email admin:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
};

// Récupérer la liste des étudiants (pour l'admin)
exports.getStudentsList = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'email')
      .select('firstName lastName userId')
      .sort({ lastName: 1, firstName: 1 });
    
    const studentsWithEmail = students.map(s => ({
      _id: s._id,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.userId?.email || 'Pas d\'email',
      fullName: `${s.firstName} ${s.lastName}`,
    }));
    
    res.json(studentsWithEmail);
  } catch (error) {
    console.error('Erreur récupération étudiants:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};