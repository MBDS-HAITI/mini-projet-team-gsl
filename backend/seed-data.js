require('dotenv').config();
const mongoose = require('mongoose');
const { Student, Course, Grade } = require('./model');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connecté\n');
  
  const students = await Student.insertMany([
    { firstName: 'Jean', lastName: 'Dupont', email: 'jean@test.com' },
    { firstName: 'Marie', lastName: 'Martin', email: 'marie@test.com' },
    { firstName: 'Pierre', lastName: 'Durand', email: 'pierre@test.com' },
  ]);
  console.log('', students.length, 'étudiants créés');
  
  const courses = await Course.insertMany([
    { name: 'Maths', code: 'MATH101', credits: 3 },
    { name: 'Physique', code: 'PHYS101', credits: 4 },
  ]);
  console.log('', courses.length, 'cours créés');
  
  const grades = [];
  students.forEach(s => {
    courses.forEach(c => {
      grades.push({
        student: s._id,
        course: c._id,
        grade: Math.floor(Math.random() * 11) + 10,
      });
    });
  });
  await Grade.insertMany(grades);
  console.log('', grades.length, 'notes créées\n🎉 Terminé !');
  
  process.exit(0);
}

seed();