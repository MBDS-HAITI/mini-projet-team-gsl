require('dotenv').config();
const mongoose = require('mongoose');
const { Student } = require('./model');

async function deleteTestStudent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const result = await Student.deleteOne({ email: 'test.etudiant@example.com' });

    if (result.deletedCount > 0) {
      console.log('✅ Étudiant de test supprimé');
    } else {
      console.log('ℹ️  Aucun étudiant trouvé avec cet email');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

deleteTestStudent();