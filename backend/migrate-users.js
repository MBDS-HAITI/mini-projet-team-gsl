require('dotenv').config();
const mongoose = require('mongoose');
const { User, Student } = require('./model');

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les utilisateurs qui n'ont pas de studentId
    const usersWithoutStudent = await User.find({ 
      studentId: { $exists: false },
      role: { $in: ['etudiant1', 'etudiant2', 'etudiant3'] }
    });

    console.log(`📋 ${usersWithoutStudent.length} utilisateur(s) sans profil étudiant`);

    for (const user of usersWithoutStudent) {
      // Créer un profil étudiant
      const newStudent = new Student({
        firstName: user.firstName || 'Prénom',
        lastName: user.lastName || 'Nom',
        userId: user._id,
      });
      await newStudent.save();

      // Lier l'étudiant à l'utilisateur
      user.studentId = newStudent._id;
      await user.save();

      console.log(`✅ Profil étudiant créé pour: ${user.email}`);
    }

    console.log('🎉 Migration terminée !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

migrateUsers();