require('dotenv').config();
const mongoose = require('mongoose');
const { Student } = require('./model');
const emailService = require('./services/emailService');
const crypto = require('crypto');

async function testCreateStudent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Générer un mot de passe temporaire
    const tempPassword = crypto.randomBytes(8).toString('hex');

const student = new Student({
  firstName: 'Test',
  lastName: 'Étudiant',
  email: `test${Date.now()}@example.com`, // ← Email unique
  password: tempPassword,
});

    await student.save();

    console.log('✅ Étudiant créé:');
    console.log('   Numéro:', student.studentNumber);
    console.log('   Email:', student.email);
    console.log('   Mot de passe:', tempPassword);

    // Envoyer l'email
    await emailService.sendWelcomeWithCredentials({
      studentEmail: student.email,
      studentName: `${student.firstName} ${student.lastName}`,
      studentNumber: student.studentNumber,
      tempPassword,
    });

    console.log('\n📧 Email envoyé !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testCreateStudent();