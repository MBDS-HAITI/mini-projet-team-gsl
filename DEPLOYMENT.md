# 📚 Guide de Déploiement

## Prérequis

- Docker et Docker Compose installés
- Compte AWS avec accès IAM
- Compte GitHub
- MongoDB Atlas configuré
- Clerk configuré

---

## 🐳 Déploiement Local avec Docker

### 1. Créer le fichier .env
```bash
cp .env.docker .env
```

Modifiez les valeurs dans `.env`

### 2. Construire et démarrer
```bash
make build
make up
```

### 3. Accéder à l'application

- Frontend: http://localhost
- Backend API: http://localhost:8010/api
- MongoDB: localhost:27017

### 4. Voir les logs
```bash
make logs
```

### 5. Arrêter
```bash
make down
```

---

## ☁️ Déploiement AWS

### Étape 1: Configuration AWS
```bash
# Installer AWS CLI
brew install awscli  # macOS
# ou
sudo apt install awscli  # Ubuntu

# Configurer AWS CLI
aws configure
```

### Étape 2: Exécuter le script de setup
```bash
make setup-aws
```

Ce script va créer:
- Repositories ECR
- Cluster ECS
- CloudWatch Log Groups
- VPC et Subnets
- Security Groups

### Étape 3: Configurer les secrets AWS

Dans AWS Secrets Manager, créez les secrets suivants:
```bash
# MongoDB
aws secretsmanager create-secret \
  --name student-app/mongodb-uri \
  --secret-string "mongodb+srv://..."

# Clerk
aws secretsmanager create-secret \
  --name student-app/clerk-secret \
  --secret-string "sk_live_..."

aws secretsmanager create-secret \
  --name student-app/clerk-publishable-key \
  --secret-string "pk_live_..."

# JWT
aws secretsmanager create-secret \
  --name student-app/jwt-secret \
  --secret-string "votre-secret-jwt"

# SMTP
aws secretsmanager create-secret \
  --name student-app/smtp-host \
  --secret-string "smtp.gmail.com"

aws secretsmanager create-secret \
  --name student-app/smtp-port \
  --secret-string "587"

aws secretsmanager create-secret \
  --name student-app/smtp-user \
  --secret-string "votre-email@gmail.com"

aws secretsmanager create-secret \
  --name student-app/smtp-pass \
  --secret-string "votre-mot-de-passe"
```

### Étape 4: Configurer GitHub Secrets

Dans votre repo GitHub, allez dans **Settings > Secrets and variables > Actions** et ajoutez:

- `AWS_ACCOUNT_ID`: Votre ID de compte AWS
- `AWS_ACCESS_KEY_ID`: Clé d'accès IAM
- `AWS_SECRET_ACCESS_KEY`: Clé secrète IAM
- `VITE_API_URL`: https://api.votre-domaine.com/api
- `VITE_CLERK_PUBLISHABLE_KEY`: pk_live_...

### Étape 5: Déployer
```bash
git add .
git commit -m "feat: deploy to AWS"
git push origin main
```

GitHub Actions va automatiquement:
1. Build les images Docker
2. Push vers ECR
3. Déployer sur ECS

---

## 📊 Monitoring

### CloudWatch Logs
```bash
# Voir les logs backend
aws logs tail /ecs/student-app-backend --follow

# Voir les logs frontend
aws logs tail /ecs/student-app-frontend --follow
```

### Health Checks

- Backend: https://api.votre-domaine.com/api/health
- Frontend: https://votre-domaine.com/health

---

## 🔄 Rollback

Si besoin de revenir à une version précédente:
```bash
# Lister les tags d'image
aws ecr list-images --repository-name student-app-backend

# Mettre à jour le service avec un tag spécifique
aws ecs update-service \
  --cluster student-app-cluster \
  --service student-app-service \
  --task-definition student-app:REVISION
```

---

## 🧹 Nettoyage

### Local
```bash
make clean
```

### AWS
```bash
# Supprimer le service ECS
aws ecs delete-service --cluster student-app-cluster --service student-app-service --force

# Supprimer le cluster
aws ecs delete-cluster --cluster student-app-cluster

# Supprimer les repositories ECR
aws ecr delete-repository --repository-name student-app-backend --force
aws ecr delete-repository --repository-name student-app-frontend --force
```