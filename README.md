# TP-INF-222-

# API Backend - Gestion de Blog (INF222 - TAF 1)

Ce projet est une API RESTful développée pour la gestion d'un blog simple. Il a été réalisé dans le cadre de l'UE INF222 - EC1 (Développement Backend) et met en pratique la structuration d'une application serveur, la gestion de base de données et le respect des bonnes pratiques HTTP.

## Technologies utilisées

- **Langage / Framework** : Node.js avec Express.js *(à modifier si vous avez utilisé Python ou Java)*
- **Base de données** : MongoDB / SQLite / MySQL *(gardez uniquement celle que vous avez utilisée)*
- **Documentation** : Swagger *(Optionnel)*

---

## ⚙️ Installation et exécution en local

### Prérequis
- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- Un gestionnaire de paquets (`npm` ou `yarn`)
- Une base de données configurée en local (ou une URI de base de données cloud)

### Étapes d'installation

1. **Cloner le dépôt**
   ```bash
   git clone <LIEN_DE_VOTRE_DEPOT_GITHUB>
   cd <NOM_DU_DOSSIER>
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   Créez un fichier `.env` à la racine du projet et ajoutez-y vos variables (exemple) :
   ```env
   PORT=3000
   DB_URI=votre_chaine_de_connexion_base_de_donnees
   ```

4. **Démarrer le serveur**
   ```bash
   npm start
   # ou pour le mode développement : npm run dev
   ```
   L'API sera accessible sur : `http://localhost:3000`

---

##  Endpoints de l'API

### 1. Gestion des articles

| Méthode | Endpoint | Description | Statut HTTP |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/articles` | Créer un nouvel article | `201 Created` |
| **GET** | `/api/articles` | Récupérer tous les articles (ou filtrer par `categorie`, `auteur`, `date`) | `200 OK` |
| **GET** | `/api/articles/:id` | Récupérer un article spécifique via son ID | `200 OK` / `404 Not Found` |
| **PUT** | `/api/articles/:id` | Mettre à jour (modifier) un article existant | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/articles/:id` | Supprimer un article | `200 OK` / `404 Not Found` |

### 2. Recherche
| Méthode | Endpoint | Description | Statut HTTP |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/articles/search?query=texte` | Rechercher des articles dont le titre ou le contenu contient le texte donné | `200 OK` |

---

## Exemples d'utilisation (Payloads & Réponses)

### Créer un article (`POST /api/articles`)
**Requête (Body JSON) :**
```json
{
  "titre": "Introduction au Web",
  "contenu": "Ceci est le contenu de mon premier article de blog...",
  "auteur": "Charles",
  "date": "2026-03-18",
  "categorie": "Technologie",
  "tags": ["web", "backend", "nodejs"]
}
```

### Récupérer les articles (`GET /api/articles`)
*Supporte les requêtes optionnelles : `/api/articles?categorie=Technologie&date=2026-03-18`*

**Réponse (JSON) :**
```json
{
  "articles": [
    {
      "id": 1,
      "titre": "Introduction au Web",
      "auteur": "Charles",
      "date": "2026-03-18",
      "categorie": "Technologie"
    },
    {
      "id": 2,
      "titre": "Apprendre Node.js",
      "auteur": "Alice",
      "date": "2026-03-17",
      "categorie": "Développement"
    }
  ]
}
```

### Erreur - Article non trouvé (`404 Not Found`)
```json
{
  "error": "Article introuvable avec l'ID spécifié."
}
```

### Erreur - Mauvaise requête (`400 Bad Request`)
*Exemple : Titre vide ou auteur manquant lors de la création.*
```json
{
  "error": "Le titre et l'auteur sont obligatoires."
}
```

---

## Architecture du projet (Bonnes pratiques)

Le code est structuré selon le modèle **MVC (Model-View-Controller)** ou Séparation des responsabilités :
- `routes/` : Définit les endpoints HTTP et les relie aux contrôleurs.
- `controllers/` : Contient la logique métier (traitement des requêtes et réponses).
- `models/` : Définit le schéma des données pour la base de données.
- `middlewares/` : Validation des données entrantes.

---

## 🔗 Livrables et Liens utiles (Optionnel)

*(Étudiant : Supprime ou remplis ces liens si tu as fait les options)*

- 🌐 **Déploiement en ligne (Railway, Render, etc.)** : [Lien vers l'API en production](https://...)
- 📖 **Documentation Swagger** : [Lien vers Swagger UI](http://localhost:3000/api-docs)
- 🖥️ **Interface Web Frontend** : [Lien vers le Frontend](https://...)
```

