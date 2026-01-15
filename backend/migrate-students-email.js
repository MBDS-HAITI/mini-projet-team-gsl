require('dotenv').config();
const mongoose = require('mongoose');
const { Student, User } = require('./model');

async function migrateStudents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const students = await Student.find();
    console.log(`📋 ${students.length} étudiant(s) trouvé(s)\n`);

    let updated = 0;

    for (const student of students) {
      // Si l'étudiant n'a pas d'email
      if (!student.email) {
        console.log(`🔍 ${student.firstName} ${student.lastName} - Pas d'email`);
        
        // Chercher l'utilisateur lié
        if (student.userId) {
          const user = await User.findById(student.userId);
          if (user && user.email) {
            student.email = user.email;
            await student.save();
            updated++;
            console.log(`   ✅ Email ajouté: ${user.email}\n`);
          } else {
            console.log(`   ⚠️  Utilisateur trouvé mais pas d'email\n`);
          }
        } else {
          // Générer un email temporaire basé sur le nom
          const tempEmail = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@temp-student.com`;
          student.email = tempEmail;
          await student.save();
          updated++;
          console.log(`   ⚠️  Email temporaire créé: ${tempEmail}\n`);
        }
      } else {
        console.log(`✅ ${student.firstName} ${student.lastName} - Email: ${student.email}`);
      }
    }

    console.log(`\n🎉 Migration terminée ! ${updated} étudiant(s) mis à jour.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

migrateStudents();