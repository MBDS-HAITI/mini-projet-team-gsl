require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Importation des modèles
const { Student } = require('./model');

// Routes
const student = require('./routes/students');
const course = require('./routes/courses');
const grade = require('./routes/grades');
const user = require('./routes/users');
const email = require('./routes/emails');
const authRoutes = require('./routes/auth');

// Middleware d'authentification Clerk
const { clerkMiddleware, requireAuth, requireRole, getCurrentUser } = require('./middleware/auth');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// URI de connexion MongoDB
const uri = process.env.MONGODB_URI || "mongodb+srv://admin:Admin123@cluster0.v4sanvp.mongodb.net/student_management";

const options = {};

mongoose.connect(uri, options)
    .then(() => {
        console.log("Connexion à la base MongoDB OK");
    },
    err => {
        console.log('Erreur de connexion MongoDB: ', err);
    });

// Configuration CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware Clerk (DOIT être avant les autres middlewares)
app.use(clerkMiddleware());

// Middleware pour parser le JSON (sauf pour les webhooks)
app.use((req, res, next) => {
    if (req.originalUrl === '/api/webhooks/clerk') {
        next();
    } else {
        bodyParser.json()(req, res, next);
    }
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8010;

// ========================================
// MIDDLEWARE AUTHENTIFICATION JWT ÉTUDIANTS
// ========================================
const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Token manquant');
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.studentId);

    if (!student || !student.isActive) {
      console.log('Token invalide ou compte désactivé');
      return res.status(401).json({ error: 'Token invalide ou compte désactivé' });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error(' Erreur auth JWT:', error.message);
    return res.status(401).json({ error: 'Non authentifié' });
  }
};

// ========================================
// ROUTES PUBLIQUES
// ========================================
const prefix = '/api';

// Health check
app.get(prefix + '/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Serveur en fonctionnement',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Webhook Clerk
app.post(prefix + '/webhooks/clerk',
    express.raw({ type: 'application/json' }),
    user.clerkWebhook
);

// ========================================
// ROUTES AUTHENTIFICATION ÉTUDIANTS (JWT)
// ========================================
app.use(prefix + '/auth', authRoutes);

// ========================================
// ROUTES PROTÉGÉES ÉTUDIANTS (JWT)
// ========================================
app.get(prefix + '/student/my-profile', authenticateStudent, student.getMyProfile);
app.put(prefix + '/student/my-profile', authenticateStudent, student.updateMyProfile);
app.get(prefix + '/student/my-grades', authenticateStudent, grade.getMyGradesStudent);

// ========================================
// ROUTES PROTÉGÉES CLERK (Admin/Scolarité)
// ========================================

// Routes utilisateurs
app.get(prefix + '/users/me',
    requireAuth(),
    getCurrentUser,
    user.getCurrentUserProfile
);

app.get(prefix + '/users',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur'),
    user.getAllUsers
);

app.get(prefix + '/users/:id',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur'),
    user.getUserById
);

app.put(prefix + '/users/role',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur'),
    user.updateUserRole
);

// app.put(prefix + '/users/:id',
//     requireAuth(),
//     getCurrentUser,
//     requireRole('administrateur'),
//     user.updateUser
// );

// app.delete(prefix + '/users/:id',
//     requireAuth(),
//     getCurrentUser,
//     requireRole('administrateur'),
//     user.deleteUser
// );

// Routes étudiants (Admin/Scolarité)
app.get(prefix + '/students',
    requireAuth(),
    getCurrentUser,
    student.getAll
);

app.post(prefix + '/students',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    student.create
);

app.get(prefix + '/students/:id',
    requireAuth(),
    getCurrentUser,
    student.getById
);

app.put(prefix + '/students/:id',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    student.update
);

app.delete(prefix + '/students/:id',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    student.delete
);

// Routes cours
app.get(prefix + '/courses',
  requireAuth(),
  getCurrentUser,
  course.getAll  
);

app.get(prefix + '/courses/:id',
  requireAuth(),
  getCurrentUser,
  course.getById
);

app.post(prefix + '/courses',
  requireAuth(),
  getCurrentUser,
  requireRole('administrateur', 'scolarite'),
  course.create
);

app.put(prefix + '/courses/:id',
  requireAuth(),
  getCurrentUser,
  requireRole('administrateur', 'scolarite'),
  course.update
);

app.delete(prefix + '/courses/:id',
  requireAuth(),
  getCurrentUser,
  requireRole('administrateur', 'scolarite'),
  course.delete
);

// Routes notes (Admin/Scolarité)
app.get(prefix + '/grades',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    grade.getAll
);

app.post(prefix + '/grades',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    grade.create
);

app.get(prefix + '/grades/my-grades',
    requireAuth(),
    getCurrentUser,
    grade.getMyGrades
);

app.get(prefix + '/grades/:id',
    requireAuth(),
    getCurrentUser,
    grade.getById
);

app.put(prefix + '/grades/:id',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    grade.update
);

app.delete(prefix + '/grades/:id',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    grade.delete
);

// Routes emails
app.post(prefix + '/emails/send-to-students',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    email.sendToStudents
);

app.post(prefix + '/emails/send-to-admin',
    requireAuth(),
    getCurrentUser,
    email.sendToAdmin
);

app.get(prefix + '/emails/students-list',
    requireAuth(),
    getCurrentUser,
    requireRole('administrateur', 'scolarite'),
    email.getStudentsList
);

// ========================================
// GESTION DES ERREURS
// ========================================

// Gestion des erreurs 404
app.use((req, res) => {
    console.log('Route non trouvée:', req.method, req.originalUrl);
    res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Erreur serveur interne'
    });
});

// ========================================
// DÉMARRAGE DU SERVEUR
// ========================================
app.listen(port, "0.0.0.0", () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log(`API disponible sur http://localhost:${port}${prefix}`);
    console.log(`JWT_SECRET configuré: ${!!process.env.JWT_SECRET}`);
});

module.exports = app;