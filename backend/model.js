const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma User (Admin/Scolarité via Clerk)
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { 
    type: String, 
    enum: ['etudiant', 'scolarite', 'administrateur', 'visiteur'],
    default: 'visiteur'
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
}, { timestamps: true });

// Schéma Student (avec authentification propre)
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentNumber: { type: String, unique: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Crypter le mot de passe avant sauvegarde
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Générer un numéro étudiant unique
studentSchema.pre('save', async function(next) {
  if (!this.studentNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Student').countDocuments();
    this.studentNumber = `STU${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Schéma Course
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  credits: { type: Number, default: 3 },
}, { timestamps: true });

// Schéma Grade
const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  grade: { type: Number, required: true, min: 0, max: 20 },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

gradeSchema.index({ student: 1, course: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Grade = mongoose.model('Grade', gradeSchema);

module.exports = { User, Student, Course, Grade };