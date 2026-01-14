#!/bin/sh

# Remplacer les placeholders par les vraies valeurs d'environnement
if [ -n "$VITE_API_URL" ]; then
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|$VITE_API_URL|g" {} \;
fi

if [ -n "$VITE_CLERK_PUBLISHABLE_KEY" ]; then
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_CLERK_PUBLISHABLE_KEY_PLACEHOLDER|$VITE_CLERK_PUBLISHABLE_KEY|g" {} \;
fi

# Démarrer Nginx
exec "$@"
```

---

## 📁 **5. .dockerignore Backend**

Créez `backend/.dockerignore` :
```
node_modules
npm-debug.log
.env
.env.local
.env.production
.git
.gitignore
README.md
.vscode
.idea
*.test.js
coverage
dist
.DS_Store
Dockerfile
.dockerignore
```

---

## 📁 **6. .dockerignore Frontend**

Créez `frontend/.dockerignore` :
```
node_modules
npm-debug.log
.env
.env.local
.env.development
.git
.gitignore
README.md
.vscode
.idea
dist
build
*.test.js
*.spec.js
coverage
.DS_Store
Dockerfile
.dockerignore
nginx.conf
docker-entrypoint.sh