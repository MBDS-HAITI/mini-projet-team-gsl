require('dotenv').config();
const mongoose = require('mongoose');
const { Student, Course, Grade, User } = require('./model');
const crypto = require('crypto');

async function fixEverything() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB\n');

    // 1. Supprimer TOUS les étudiants
    const deletedStudents = await Student.deleteMany({});
    console.log(`🗑️  ${deletedStudents.deletedCount} ancien(s) étudiant(s) supprimé(s)`);

    // 2. Créer 5 nouveaux étudiants avec mot de passe
    console.log('\nCréation de 5 étudiants...\n');
    
    const studentsData = [
      { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@test.com' },
      { firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@test.com' },
      { firstName: 'Pierre', lastName: 'Durand', email: 'pierre.durand@test.com' },
      { firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@test.com' },
      { firstName: 'Lucas', lastName: 'Thomas', email: 'lucas.thomas@test.com' },
    ];

    const createdStudents = [];

    for (const data of studentsData) {
      const tempPassword = crypto.randomBytes(6).toString('hex');
      
      const student = new Student({
        ...data,
        password: tempPassword, // Sera crypté automatiquement
      });
      
      await student.save();
      createdStudents.push(student);
      
      console.log(`${student.firstName} ${student.lastName}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   Numéro: ${student.studentNumber}`);
      console.log(`   Mot de passe: ${tempPassword}\n`);
    }

    // 3. Vérifier les cours
    let coursesCount = await Course.countDocuments();
    
    if (coursesCount === 0) {
      console.log(' Création de cours...\n');
      
      const courses = await Course.insertMany([
        { name: 'Mathématiques', code: 'MATH101', description: 'Algèbre et calcul', credits: 4 },
        { name: 'Physique', code: 'PHYS101', description: 'Physique générale', credits: 4 },
        { name: 'Informatique', code: 'INFO101', description: 'Introduction à la programmation', credits: 3 },
        { name: 'Histoire', code: 'HIST101', description: 'Histoire moderne', credits: 2 },
        { name: 'Français', code: 'FRAN101', description: 'Littérature française', credits: 3 },
      ]);
      
      console.log(` ${courses.length} cours créés`);

      // 4. Créer des notes pour chaque étudiant
      console.log('\nCréation de notes...\n');
      
      for (const student of createdStudents) {
        for (const course of courses.slice(0, 3)) {
          const grade = new Grade({
            student: student._id,
            course: course._id,
            grade: Math.floor(Math.random() * 11) + 10, // Note entre 10 et 20
          });
          await grade.save();
        }
        console.log(`3 notes créées pour ${student.firstName}`);
      }
    }

    console.log('\n=== RÉSUMÉ ===');
    console.log('Étudiants:', await Student.countDocuments());
    console.log('Cours:', await Course.countDocuments());
    console.log('Notes:', await Grade.countDocuments());
    
    console.log('\nTout est prêt !\n');
    console.log(' Utilisez ces identifiants pour tester:');
    console.log('   Email: jean.dupont@test.com');
    console.log('   Voir le mot de passe ci-dessus \n');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

fixEverything();