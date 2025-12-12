# Epytodo

Une application de gestion de tâches (Todo List) backend réalisée avec Node.js et Express.

## 🚀 Fonctionnalités
- **Authentification**: Inscription et connexion utilisateurs (JWT).
- **Gestion des tâches**: Création, lecture, modification et suppression de tâches (CRUD).
- **Base de données**: Stockage persistant avec MySQL.

## 🛠 Stack Technique
- **Backend**: Node.js, Express.js
- **Base de données**: MySQL
- **Sécurité**: BCrypt (hachage mots de passe), JSON Web Tokens (JWT)

## ⚙️ Installation

1. Cloner le repo :
\`\`\`bash
git clone https://github.com/JosueNANTHAKUMAR/epytodo.git
\`\`\`

2. Installer les dépendances :
\`\`\`bash
npm install
\`\`\`

3. Configurer la base de données :
   - Importer le fichier \`epytodo.sql\` dans votre serveur MySQL.
   - Configurer le fichier \`.env\` avec vos identifiants.

4. Lancer le serveur :
\`\`\`bash
node src/index.js
\`\`\`
