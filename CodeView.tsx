import { useState } from 'react';
import { FileCode, Database, Server, Route, FolderTree, Copy, Check } from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  language: string;
  icon: React.ReactNode;
  code: string;
  description: string;
}

const codeFiles: CodeFile[] = [
  {
    name: 'server.js',
    path: 'src/server.js',
    language: 'javascript',
    icon: <Server className="w-4 h-4" />,
    description: "Point d'entrée du serveur Node.js/Express",
    code: `// ============================================
// SERVER: Point d'entrée de l'application
// Node.js + Express.js
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/openapi');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());                    // Autorise les requêtes cross-origin
app.use(express.json());            // Parse le body JSON
app.use(morgan('dev'));             // Log des requêtes HTTP

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/articles', articleRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\\'API Blog',
    documentation: '/api-docs',
    version: '1.0.0'
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    statusCode: 404
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    statusCode: 500
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(\`🚀 Serveur démarré sur http://localhost:\${PORT}\`);
  console.log(\`📚 Documentation: http://localhost:\${PORT}/api-docs\`);
});

module.exports = app;`,
  },
  {
    name: 'articleRoutes.js',
    path: 'src/routes/articleRoutes.js',
    language: 'javascript',
    icon: <Route className="w-4 h-4" />,
    description: "Définition des routes de l'API",
    code: `// ============================================
// ROUTES: Définition des endpoints API
// Utilise Express Router
// ============================================

const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/ArticleController');

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     tags: [Articles]
 */
router.get('/', ArticleController.getAll);

/**
 * @swagger
 * /api/articles/stats:
 *   get:
 *     summary: Statistiques du blog
 *     tags: [Statistiques]
 */
router.get('/stats', ArticleController.getStats);

/**
 * @swagger
 * /api/articles/:id:
 *   get:
 *     summary: Récupérer un article par ID
 *     tags: [Articles]
 */
router.get('/:id', ArticleController.getById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 */
router.post('/', ArticleController.create);

/**
 * @swagger
 * /api/articles/:id:
 *   put:
 *     summary: Mettre à jour un article
 *     tags: [Articles]
 */
router.put('/:id', ArticleController.update);

/**
 * @swagger
 * /api/articles/:id:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 */
router.delete('/:id', ArticleController.remove);

module.exports = router;`,
  },
  {
    name: 'ArticleController.js',
    path: 'src/controllers/ArticleController.js',
    language: 'javascript',
    icon: <FileCode className="w-4 h-4" />,
    description: 'Logique métier des articles (Controller)',
    code: `// ============================================
// CONTROLLER: ArticleController
// Gère la logique métier des articles
// ============================================

const Article = require('../models/Article');

// GET /api/articles
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
        ]
      };
    }
    if (category) {
      query.category = category;
    }

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: articles,
      message: \`\${articles.length} article(s) trouvé(s)\`,
      statusCode: 200,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

// GET /api/articles/:id
exports.getById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé',
        statusCode: 404
      });
    }
    res.status(200).json({
      success: true,
      data: article,
      message: 'Article trouvé',
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

// POST /api/articles
exports.create = async (req, res) => {
  try {
    const { title, content, author, category, tags, published } = req.body;
    
    // Validation
    if (!title || title.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Le titre doit contenir au moins 3 caractères',
        statusCode: 400
      });
    }

    const article = await Article.create({
      title, content, author, category,
      tags: tags || [],
      published: published || false
    });

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article créé avec succès',
      statusCode: 201
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      statusCode: 400
    });
  }
};

// PUT /api/articles/:id
exports.update = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé',
        statusCode: 404
      });
    }
    res.status(200).json({
      success: true,
      data: article,
      message: 'Article mis à jour avec succès',
      statusCode: 200
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      statusCode: 400
    });
  }
};

// DELETE /api/articles/:id
exports.remove = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé',
        statusCode: 404
      });
    }
    res.status(200).json({
      success: true,
      data: null,
      message: 'Article supprimé avec succès',
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};

// GET /api/articles/stats
exports.getStats = async (req, res) => {
  try {
    const total = await Article.countDocuments();
    const published = await Article.countDocuments({ published: true });
    const categories = await Article.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const authors = await Article.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        published,
        draft: total - published,
        categories: categories.map(c => ({ name: c._id, count: c.count })),
        authors: authors.map(a => ({ name: a._id, count: a.count }))
      },
      message: 'Statistiques récupérées',
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: 500
    });
  }
};`,
  },
  {
    name: 'Article.js (Model)',
    path: 'src/models/Article.js',
    language: 'javascript',
    icon: <Database className="w-4 h-4" />,
    description: 'Modèle de données (Schéma)',
    code: `// ============================================
// MODEL: Article
// Schéma de données pour MySQL/SQLite
// ============================================

// --------- VERSION SEQUELIZE (MySQL/SQLite) ---------

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [3, 255],
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, Infinity],
      notEmpty: true
    }
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
      notEmpty: true
    }
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const value = this.getDataValue('tags');
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'articles',
  timestamps: true,      // Crée automatiquement createdAt et updatedAt
  underscored: true       // Utilise snake_case pour les colonnes
});

module.exports = Article;

// --------- SQL BRUT (Alternative) ---------
/*
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags JSON DEFAULT '[]',
  published BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les recherches
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_author ON articles(author);
CREATE INDEX idx_articles_published ON articles(published);
*/`,
  },
  {
    name: 'database.js (Config)',
    path: 'src/config/database.js',
    language: 'javascript',
    icon: <Database className="w-4 h-4" />,
    description: 'Configuration de la base de données',
    code: `// ============================================
// DATABASE CONFIG: Connexion à la BDD
// Support SQLite et MySQL
// ============================================

const { Sequelize } = require('sequelize');

// ---------- OPTION 1: SQLite ----------
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // Fichier SQLite local
  logging: false,                 // Désactive les logs SQL
  define: {
    timestamps: true,
    underscored: true
  }
});

// ---------- OPTION 2: MySQL ----------
/*
const sequelize = new Sequelize(
  process.env.DB_NAME || 'blog_db',     // Nom de la BDD
  process.env.DB_USER || 'root',         // Utilisateur
  process.env.DB_PASS || 'password',     // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,          // Nombre max de connexions
      min: 0,          // Nombre min de connexions
      acquire: 30000,  // Timeout d'acquisition
      idle: 10000      // Timeout d'inactivité
    }
  }
);
*/

// Test de connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
  } catch (error) {
    console.error('❌ Impossible de se connecter:', error);
  }
}

// Synchronisation des modèles (crée les tables)
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Base de données synchronisée');
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error);
  }
}

testConnection();
syncDatabase();

module.exports = sequelize;`,
  },
  {
    name: 'package.json',
    path: 'package.json',
    language: 'json',
    icon: <FileCode className="w-4 h-4" />,
    description: 'Dépendances du projet backend',
    code: `{
  "name": "blog-api",
  "version": "1.0.0",
  "description": "API RESTful pour la gestion d'un blog - Node.js/Express",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "morgan": "^1.10.0",
    "sequelize": "^6.35.0",
    "sqlite3": "^5.1.6",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}`,
  },
  {
    name: 'Structure du projet',
    path: 'Architecture MVC',
    language: 'text',
    icon: <FolderTree className="w-4 h-4" />,
    description: 'Organisation des fichiers (pattern MVC)',
    code: `blog-api/
├── 📁 src/
│   ├── 📁 config/
│   │   └── database.js          # Configuration BDD (SQLite/MySQL)
│   │
│   ├── 📁 models/
│   │   └── Article.js           # Modèle Article (Sequelize ORM)
│   │
│   ├── 📁 controllers/
│   │   └── ArticleController.js # Logique métier (CRUD)
│   │
│   ├── 📁 routes/
│   │   └── articleRoutes.js     # Définition des routes API
│   │
│   ├── 📁 middlewares/
│   │   ├── errorHandler.js      # Gestion globale des erreurs
│   │   └── validator.js         # Validation des données
│   │
│   ├── 📁 swagger/
│   │   └── openapi.json         # Spécification OpenAPI 3.0
│   │
│   └── server.js                # Point d'entrée Express
│
├── 📁 tests/
│   └── articles.test.js         # Tests unitaires (Jest)
│
├── .env                          # Variables d'environnement
├── .gitignore                    # Fichiers ignorés par Git
├── package.json                  # Dépendances npm
├── database.sqlite               # Fichier BDD SQLite (auto-généré)
└── README.md                     # Documentation du projet

# ============================================
# COMMANDES UTILES
# ============================================

# Installation des dépendances
npm install

# Démarrer en développement (avec hot-reload)
npm run dev

# Démarrer en production
npm start

# Lancer les tests
npm test

# ============================================
# VARIABLES D'ENVIRONNEMENT (.env)
# ============================================
PORT=3000
DB_DIALECT=sqlite          # 'sqlite' ou 'mysql'
DB_STORAGE=./database.sqlite
DB_HOST=localhost
DB_PORT=3306
DB_NAME=blog_db
DB_USER=root
DB_PASS=password

# ============================================
# ENDPOINTS DE L'API
# ============================================
# GET    /api/articles          → Liste tous les articles
# GET    /api/articles/:id      → Récupère un article
# POST   /api/articles          → Crée un article
# PUT    /api/articles/:id      → Met à jour un article
# DELETE /api/articles/:id      → Supprime un article
# GET    /api/articles/stats    → Statistiques
# GET    /api-docs              → Documentation Swagger`,
  },
];

export default function CodeView() {
  const [selectedFile, setSelectedFile] = useState(codeFiles[0]);
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Explorer */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-yellow-500" />
                Fichiers Source
              </h3>
              <p className="text-xs text-gray-500 mt-1">Code backend Node.js</p>
            </div>
            <div className="p-2 space-y-0.5">
              {codeFiles.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-2 text-sm transition ${
                    selectedFile.name === file.name
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {file.icon}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-400 truncate">{file.path}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* File Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                </div>
                <div>
                  <span className="font-mono text-sm font-semibold text-gray-700">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">({selectedFile.path})</span>
                </div>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copié!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </button>
            </div>
            
            {/* Description */}
            <div className="px-4 py-2 bg-blue-50 border-b">
              <p className="text-sm text-blue-700">💡 {selectedFile.description}</p>
            </div>

            {/* Code */}
            <div className="bg-gray-900 overflow-x-auto">
              <pre className="p-4 text-sm leading-relaxed">
                <code className="text-green-400 font-mono whitespace-pre">{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
