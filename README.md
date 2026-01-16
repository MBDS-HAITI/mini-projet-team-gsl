******Table des matières*********

-----À propos
-----Fonctionnalités principales
-----Technologies utilisées
-----Architecture
-----Prérequis
-----Installation
-----Configuration
-----Utilisation
-----API Documentation
-----Docker & Containerisation
-----Déploiement
-----Tests
-----Contribution
-----Sécurité
-----Roadmap
-----License
-----Contact


À propos
Student Management System est une application web full-stack moderne conçue dans le cadre d'une suite de TP du cours de devellopement web par le professeur AMOS Edouard base sur la gestion académique dans les établissements d'enseignement. Elle offre une interface intuitive pour la gestion des étudiants, des cours, des notes et des communications, avec un système d'authentification dual (OAuth + JWT) et des fonctionnalités avancées de reporting.

Pourquoi ce projet ?

✅ Gestion centralisée : Toutes les données académiques en un seul endroit
✅ Authentification sécurisée : Dual auth (Clerk OAuth pour admin/staff + JWT pour étudiants)
✅ Notifications automatiques : Emails automatiques pour les identifiants et les notes
✅ Statistiques avancées : Tableaux de bord avec graphiques interactifs
✅ Responsive : Interface adaptée mobile, tablette et desktop
✅ Dark Mode : Thème clair/sombre pour le confort visuel
✅ Production-ready : Dockerisé et déployable sur AWS


*******Fonctionnalités principales**********

**Pour les Administrateurs**

Gestion des utilisateurs : Créer, modifier, supprimer des comptes (admin, scolarité, étudiants)
Gestion des étudiants : Inscription automatique avec génération d'identifiants sécurisés
Gestion des cours : Catalogue complet avec codes, crédits et descriptions
Gestion des notes : Attribution et modification avec notifications automatiques
Envoi d'emails groupés : Communication avec tous les étudiants ou groupes spécifiques


**Statistiques avancées** :

6 graphiques interactifs (Pie, Line, Bar, Radar, Area)
Répartition des notes
Évolution des performances
Top 5 des étudiants
Tendances d'inscription



**Pour la Scolarité**

Gestion des étudiants : Création et modification de profils
Gestion des cours : Ajout et édition de cours
Gestion des notes : Attribution et modification
Communication : Envoi d'emails aux étudiants

**Pour les Étudiants**

Dashboard personnel : Vue d'ensemble de leur parcours
Consultation des notes :

Statistiques personnelles (moyenne, réussites, meilleure note)
Graphiques de progression
Historique complet des notes


->Profil : Mise à jour des informations personnelles
            Changement de mot de passe : Sécurité renforcée
            Contact administration : Formulaire de contact direct

->Recherche et Filtres

        Recherche en temps réel : Dans toutes les tables (étudiants, cours, notes)
        Filtres avancés :

        Par étudiant
        Par cours
        Par plage de notes (min/max)


->Pagination intelligente : Navigation fluide avec 10 items par page

*****Tableaux de bord*****

**Dashboard Admin/Scolarité**

4 cartes statistiques animées
6 graphiques professionnels :

->Pie Chart : Répartition des notes par tranche
->Line Chart : Évolution des dernières notes
->Bar Chart : Moyennes par cours
->Radar Chart : Répartition des performances
->Area Chart : Évolution des inscriptions
->Top 5 : Classement des meilleurs étudiants



*****Dashboard Étudiant*****

Profil détaillé avec avatar
4 cartes de statistiques personnelles
Graphique des notes avec Recharts
Tableau détaillé avec badges colorés
Modal de changement de mot de passe


********Technologies utilisées*********
**Frontend**
    TechnologieVersionUtilisationReact18.xFramework UIVite5.xBuild tool & dev serverReact Router6.xRouting SPATailwind CSS3.xStyling & design systemClerk4.xAuthentification OAuthRecharts2.xGraphiques interactifsHeroicons2.xIcônes SVG
**Backend**
    TechnologieVersionUtilisationNode.js20.xRuntime JavaScriptExpress4.xFramework webMongoDB7.xBase de données NoSQLMongoose8.xODM pour MongoDBJWT9.xAuthentification étudiantsBcrypt5.xHachage de mots de passeNodemailer6.xEnvoi d'emailsClerk SDK4.xBackend OAuth
**DevOps & Infrastructure**
    TechnologieUtilisationDockerContainerisationDocker ComposeOrchestration multi-conteneursAWS ECSDéploiement productionAWS ECRRegistry DockerGitHub ActionsCI/CD pipelineNginxReverse proxy & serveur webMongoDB AtlasBase de données cloud

**********Architecture**********

**Structure des Dossiers**
student-management/
├── backend/
│   ├── routes/              # Routes API
│   │   ├── students.js      # CRUD étudiants
│   │   ├── courses.js       # CRUD cours
│   │   ├── grades.js        # CRUD notes
│   │   ├── users.js         # CRUD utilisateurs
│   │   ├── emails.js        # Envoi emails
│   │   └── auth.js          # Auth JWT étudiants
│   ├── model/               # Modèles Mongoose
│   │   └── index.js         # Schémas MongoDB
│   ├── middleware/          # Middlewares
│   │   └── auth.js          # Auth Clerk
│   ├── services/            # Services
│   │   └── emailService.js  # Nodemailer
│   ├── server.js            # Point d'entrée
│   ├── Dockerfile           # Image Docker backend
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Footer.jsx
│   │   ├── layouts/         # Layouts
│   │   │   └── MainLayout.jsx
│   │   ├── pages/           # Pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Grades.jsx
│   │   │   ├── MyGrades.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── SendEmail.jsx
│   │   │   ├── ContactAdmin.jsx
│   │   │   ├── About.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── PublicPage.jsx
│   │   ├── services/        # Services API
│   │   │   └── api.js
│   │   ├── App.jsx          # Router principal
│   │   └── main.jsx         # Point d'entrée
│   ├── Dockerfile           # Image Docker frontend
│   ├── nginx.conf           # Config Nginx
│   └── package.json
│
├── aws/                     # Configuration AWS
│   ├── task-definition.json
│   └── setup-aws.sh
│
├── .github/workflows/       # CI/CD
│   └── deploy-aws.yml
│
├── docker-compose.yml       # Dev local
├── docker-compose.prod.yml  # Production
├── Makefile                 # Commandes utiles
├── DEPLOYMENT.md            # Guide déploiement
└── README.md               # Ce fichier

********Prérequis**********
**Logiciels requis**

Node.js >= 20.x (Télécharger)
npm >= 10.x (inclus avec Node.js)
MongoDB >= 7.x (Télécharger) ou compte MongoDB Atlas
Git (Télécharger)

********Comptes requis*****************

->Clerk : clerk.com - Pour l'authentification OAuth
->MongoDB Atlas : mongodb.com/cloud/atlas - Base de données cloud (optionnel)
->Gmail : Pour l'envoi d'emails (ou autre service SMTP)


*********installation*********
1. Cloner le repository
bashgit clone https://github.com/votre-username/student-management.git
cd student-management
2. Installer le Backend
>cd backend
>npm install
3. Installer le Frontend
>cd ../frontend
npm install

**********Configuration*************
1. Configuration Backend
Créez backend/.env :
env# Serveur
PORT=8010
NODE_ENV=development

*******MongoDB Atlas:*******
# MONGODB_URI=mongodb+srv://gslmbds_db_user:GSLroot123@cluster0.5uyxw3h.mongodb.net/student_management?appName=Cluster0

# Clerk (OAuth Admin/Scolarité)
CLERK_SECRET_KEY=sk_test_53Iz2rai8RM12Id3SNjXxzIyitR0uUklxzTfM19Y3r

# JWT (Étudiants)
JWT_SECRET=a3f5b8c9d2e7f1a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2

# Configuration Email - MAILTRAP
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=3e67b1ffd89c69
EMAIL_PASSWORD=78583555e3db12
EMAIL_FROM=Student Management <noreply@student-app.com>
ADMIN_EMAIL=admin@student-app.com


# Frontend URL
FRONTEND_URL=http://localhost:5173

******Configuration Mailtrap*********
sur demande


*****Configuration Frontend*********
Créez frontend/.env :
env# API Backend
VITE_API_URL=http://localhost:8010/api

# Clerk (Même projet que le backend)
CLERK_PUBLISHABLE_KEY=pk_test_Z3Jvd24tc3VuYmlyZC0yMy5jbGVyay5hY2NvdW50cy5kZXYk

3. Configuration Clerk
A. Créer un projet Clerk

Allez sur dashboard.clerk.com
Créez un nouveau projet
Copiez les clés :

Publishable Key → VITE_CLERK_PUBLISHABLE_KEY
Secret Key → CLERK_SECRET_KEY



******Configurer le Webhook*********

Dans Clerk Dashboard → Webhooks
Add Endpoint :

URL : http://localhost:8010/api/webhooks/clerk
Events : Cochez user.created et user.updated


Copiez la Signing Secret

# Configurer les Metadata
Dans Clerk Dashboard → Paths → Activez Public metadata

#Utilisation
Démarrage en développement
# Terminal 1 : Backend
bashcd backend
npm run dev
```

*****Vous verrez******
```
->Connexion à la base MongoDB OK
->Service email prêt
->Serveur démarré sur http://localhost:8010
# Terminal 2 : Frontend
bashcd frontend
npm run dev
```

**Vous verrez** :
```
VITE v5.x.x  ready in 500 ms

➜  Local:   http://localhost:5173/
Terminal 3 : MongoDB (si local)


# Accès à l'application
InterfaceURLAuthentificationAdmin/Scolaritéhttp://localhost:5173/sign-inClerk OAuthÉtudiantshttp://localhost:5173/student-loginJWT (identifiants reçus par email)APIhttp://localhost:8010/apiBearer TokenHealth Checkhttp://localhost:8010/api/healthAucune

# Premier compte administrateur

Allez sur http://localhost:5173/sign-up
Créez un compte avec votre email
Dans Clerk Dashboard :

Users → Votre utilisateur
Metadata → Public metadata
Ajoutez :


********important************
json   {
     "role": "administrateur"
   }

Déconnectez-vous et reconnectez-vous
Vous avez maintenant accès admin !


********Créer un étudiant**********

Connectez-vous en tant qu'admin
Allez sur Étudiants → Nouvel étudiant
Remplissez :

Prénom : Getro
Nom : BUISSERETH
Email : getrob@gmail.com


# Cliquez sur Créer
Notez le mot de passe temporaire affiché (exemple : a3f5b8c9d2e7f1a4)
L'étudiant reçoit un email avec ses identifiants
Il peut se connecter sur /student-login avec :

Email : getrob@gmail.com
Mot de passe : (le mot de passe temporaire)



********API Documentation**********
Authentification
Admin/Scolarité (Clerk)
httpAuthorization: Bearer <clerk_token>
Obtenez le token via window.Clerk.session.getToken()

Étudiants (JWT)
httpAuthorization: Bearer <jwt_token>
Obtenez le token via POST /api/auth/student/login

# Endpoints principaux
Étudiants
httpGET    /api/students       # Liste tous les étudiants
POST   /api/students           # Créer un étudiant
GET    /api/students/:id       # Détails d'un étudiant
PUT    /api/students/:id       # Modifier un étudiant
DELETE /api/students/:id       # Supprimer un étudiant
# Cours
httpGET    /api/courses            # Liste tous les cours
POST   /api/courses            # Créer un cours
GET    /api/courses/:id        # Détails d'un cours
PUT    /api/courses/:id        # Modifier un cours
DELETE /api/courses/:id        # Supprimer un cours
# Notes
httpGET    /api/grades             # Liste toutes les notes
POST   /api/grades             # Créer une note
GET    /api/grades/:id         # Détails d'une note
PUT    /api/grades/:id         # Modifier une note
DELETE /api/grades/:id         # Supprimer une note
GET    /api/grades/my-grades   # Notes de l'utilisateur connecté (Clerk)
Authentification Étudiants
httpPOST   /api/auth/student/login           # Connexion étudiant
POST   /api/auth/student/change-password # Changer mot de passe
GET    /api/student/my-profile           # Profil étudiant (JWT)
GET    /api/student/my-grades            # Notes étudiant (JWT)
# Emails
httpPOST   /api/emails/send-to-students   # Envoyer email groupé
POST   /api/emails/send-to-admin      # Contacter admin
GET    /api/emails/students-list      # Liste étudiants

🐳 Docker & Containerisation
Développement local avec Docker
bash# Construire les images
make build

# Démarrer tous les services
make up

# Voir les logs
make logs

# Arrêter
make down
Accès :

Frontend : http://localhost
Backend : http://localhost:8010
MongoDB : localhost:27017


Production avec Docker
bash# Construire pour la production
make build-prod

# Démarrer
make up-prod

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f
```


☁️ Déploiement
Déploiement sur AWS ECS
1. Prérequis AWS

******Compte AWS********
AWS CLI installé et configuré
Accès IAM avec permissions ECS, ECR, CloudWatch

2. Configuration initiale
bash# Configurer AWS CLI
aws configure

# Exécuter le script de setup
make setup-aws
Ce script crée automatiquement :

->Repositories ECR (Backend & Frontend)
-> Cluster ECS
-> CloudWatch Log Groups
-> VPC et Subnets
-> Security Groups

3. Configurer les secrets AWS
bash# MongoDB URI
aws secretsmanager create-secret \
  --name student-app/mongodb-uri \
  --secret-string "mongodb+srv://..."

# Clerk Secret
aws secretsmanager create-secret \
  --name student-app/clerk-secret \
  --secret-string "sk_live_..."

# JWT Secret
aws secretsmanager create-secret \
  --name student-app/jwt-secret \
  --secret-string "votre-secret-64-caracteres"

# SMTP
aws secretsmanager create-secret \
  --name student-app/smtp-host \
  --secret-string "smtp.gmail.com"

# ... (voir DEPLOYMENT.md pour la liste complète)
4. Configurer GitHub Secrets
Dans Settings > Secrets and variables > Actions, ajoutez :
SecretValeurAWS_ACCOUNT_IDVotre ID compte AWSAWS_ACCESS_KEY_IDClé d'accès IAMAWS_SECRET_ACCESS_KEYClé secrète IAMVITE_API_URLhttps://api.votre-domaine.com/apiVITE_CLERK_PUBLISHABLE_KEYpk_live_...
5. Déployer
bashgit add .
git commit -m "feat: deploy to AWS"
git push origin main
```

GitHub Actions va automatiquement :
1. Build les images Docker
2. Push vers ECR
3. Déployer sur ECS
4. Vérifier la stabilité du service

---

### Pipeline CI/CD
```
┌────────────┐
│ Git Push   │
└─────┬──────┘
      │
┌─────▼───────────────────────────────┐
│     GitHub Actions Workflow         │
├─────────────────────────────────────┤
│ 1. Checkout code                    │
│ 2. Configure AWS credentials        │
│ 3. Login to Amazon ECR              │
│ 4. Build Docker images              │
│ 5. Push images to ECR               │
│ 6. Update ECS task definition       │
│ 7. Deploy to ECS                    │
│ 8. Wait for service stability       │
└─────┬───────────────────────────────┘
      │
┌─────▼──────────────────┐
│   AWS ECS Cluster      │
│  ┌──────────────────┐  │
│  │  Backend (8010)  │  │
│  │  Frontend (80)   │  │
│  └──────────────────┘  │
└────────────────────────┘

*****Tests**********
Tests Backend
bashcd backend
npm test
Tests Frontend
bashcd frontend
npm test
Tests E2E
bashnpm run test:e2e
Coverage
bashnpm run test:coverage

*************Contribution********************
Les contributions sont les bienvenues ! Voici comment participer :
1. Fork le projet
bashgit clone https://github.com/votre-username/student-management.git
cd student-management
2. Créer une branche
bashgit checkout -b feature/ma-fonctionnalite
3. Commiter vos changements
bashgit commit -m "feat: ajouter ma fonctionnalité"
Convention de commits :

feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation
style: Formatage, style
refactor: Refactorisation
test: Tests
chore: Maintenance

4. Pousser vers la branche
bashgit push origin feature/ma-fonctionnalite
```

### 5. Ouvrir une Pull Request

---

## Sécurité

### Bonnes pratiques implémentées

- **Authentification forte** : Clerk OAuth + JWT
- **Hachage de mots de passe** : Bcrypt avec salage
- **Validation des données** : Mongoose validators
- **CORS configuré** : Protection contre CSRF
- **Rate limiting** : Protection DDoS (à implémenter)
- **Helmet.js** : Headers de sécurité (à implémenter)
- **Variables d'environnement** : Secrets non commitées
- **HTTPS** : En production avec certificat SSL
- **Sanitization** : Protection injection SQL/NoSQL

### Rapporter une vulnérabilité

Si vous découvrez une faille de sécurité :
1. **NE PAS** créer une issue publique
2. Envoyez un email à : security@student-app.com
3. Décrivez la vulnérabilité en détail
4. Nous vous répondrons sous 48h

---

## Roadmap

### Version 1.1 (Q2 2024)

- [ ] **Module de présence** : Gestion des absences et retards
- [ ] **Planning** : Emploi du temps intégré
- [ ] **Examens** : Module de gestion des examens
- [ ] **Bibliothèque** : Système de prêt de livres

### Version 1.2 (Q3 2024)

- [ ] **Messagerie interne** : Chat étudiant-prof
- [ ] **Forum** : Questions/réponses académiques
- [ ] **Mobile App** : Application React Native
- [ ] **Notifications push** : Alertes temps réel

### Version 2.0 (Q4 2024)

- [ ] **IA & ML** : Prédiction de performances
- [ ] **Analytics avancés** : Tableaux de bord BI
- [ ] **Multi-tenant** : Support multi-établissements
- [ ] **Internationalisation** : Support multi-langues

---

## License

## Contact
Équipe de développement
Getro BUISSERETH, Serge BEAUBOEUF, Louis Midson LAJEANTY
Email : gsl.mbds@gmail.com


## Remerciements
remerciment speciale au professeur EDOUARD Amos.