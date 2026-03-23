// ============================================
// SWAGGER / OpenAPI 3.0 Specification
// Documentation de l'API Blog
// ============================================

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Blog API - Gestion des Articles',
    description: `
## API RESTful pour la gestion d'un blog simple

Cette API permet de gérer les articles d'un blog avec les opérations CRUD complètes.

### Technologies utilisées
- **Runtime**: Node.js
- **Framework**: Express.js  
- **Langage**: TypeScript / Java (Spring Boot)
- **Base de données**: SQLite / MySQL
- **Documentation**: Swagger (OpenAPI 3.0)

### Fonctionnalités
- ✅ Créer un article (POST)
- ✅ Lire tous les articles avec pagination (GET)
- ✅ Lire un article par ID (GET)
- ✅ Mettre à jour un article (PUT)
- ✅ Supprimer un article (DELETE)
- ✅ Recherche d'articles
- ✅ Filtrage par catégorie
- ✅ Statistiques du blog

### Architecture
L'API suit le pattern **MVC** (Model-View-Controller) :
- **Models** : Définition des schémas de données
- **Controllers** : Logique métier
- **Routes** : Définition des endpoints
    `,
    version: '1.0.0',
    contact: {
      name: 'Étudiant Développeur Web',
      email: 'etudiant@university.edu',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur de développement',
    },
    {
      url: 'https://api.monblog.com',
      description: 'Serveur de production',
    },
  ],
  tags: [
    {
      name: 'Articles',
      description: 'Opérations CRUD sur les articles du blog',
    },
    {
      name: 'Statistiques',
      description: 'Statistiques et métriques du blog',
    },
    {
      name: 'Administration',
      description: 'Opérations administratives',
    },
  ],
  paths: {
    '/api/articles': {
      get: {
        tags: ['Articles'],
        summary: 'Récupérer tous les articles',
        description:
          'Retourne la liste de tous les articles avec pagination, recherche et filtrage par catégorie.',
        operationId: 'getAllArticles',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Numéro de page (défaut: 1)',
            required: false,
            schema: { type: 'integer', default: 1, minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: "Nombre d'articles par page (défaut: 10)",
            required: false,
            schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Terme de recherche (titre, contenu, auteur, tags)',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'category',
            in: 'query',
            description: 'Filtrer par catégorie',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Liste des articles récupérée avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedArticleResponse' },
              },
            },
          },
          500: {
            description: 'Erreur interne du serveur',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Articles'],
        summary: 'Créer un nouvel article',
        description: 'Crée un nouvel article dans le blog. Les champs title, content, author et category sont obligatoires.',
        operationId: 'createArticle',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateArticleDTO' },
              example: {
                title: 'Mon nouvel article',
                content: "Le contenu de l'article ici...",
                author: 'Jean Dupont',
                category: 'Backend',
                tags: ['nodejs', 'api'],
                published: true,
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Article créé avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ArticleResponse' },
              },
            },
          },
          400: {
            description: 'Données invalides',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/articles/{id}': {
      get: {
        tags: ['Articles'],
        summary: 'Récupérer un article par ID',
        description: "Retourne un article spécifique en fonction de son identifiant unique.",
        operationId: 'getArticleById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: "Identifiant unique de l'article",
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Article trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ArticleResponse' },
              },
            },
          },
          404: {
            description: 'Article non trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Articles'],
        summary: 'Mettre à jour un article',
        description: "Met à jour les champs d'un article existant. Seuls les champs fournis seront mis à jour.",
        operationId: 'updateArticle',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: "Identifiant unique de l'article",
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateArticleDTO' },
            },
          },
        },
        responses: {
          200: {
            description: 'Article mis à jour avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ArticleResponse' },
              },
            },
          },
          400: {
            description: 'Données invalides',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Article non trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Articles'],
        summary: 'Supprimer un article',
        description: "Supprime définitivement un article de la base de données.",
        operationId: 'deleteArticle',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: "Identifiant unique de l'article",
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Article supprimé avec succès',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          404: {
            description: 'Article non trouvé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/articles/stats': {
      get: {
        tags: ['Statistiques'],
        summary: 'Statistiques du blog',
        description: "Retourne les statistiques globales du blog: nombre total d'articles, publiés, brouillons, catégories et auteurs.",
        operationId: 'getStats',
        responses: {
          200: {
            description: 'Statistiques récupérées',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/StatsResponse' },
              },
            },
          },
        },
      },
    },
    '/api/reset': {
      post: {
        tags: ['Administration'],
        summary: 'Réinitialiser la base de données',
        description: 'Réinitialise la base de données avec les données initiales (seed).',
        operationId: 'resetDatabase',
        responses: {
          200: {
            description: 'Base de données réinitialisée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Article: {
        type: 'object',
        properties: {
          id: { type: 'string', description: "Identifiant unique de l'article" },
          title: { type: 'string', description: "Titre de l'article" },
          content: { type: 'string', description: "Contenu de l'article" },
          author: { type: 'string', description: "Auteur de l'article" },
          category: { type: 'string', description: "Catégorie de l'article" },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags associés',
          },
          published: { type: 'boolean', description: 'Statut de publication' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date de création',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date de dernière modification',
          },
        },
      },
      CreateArticleDTO: {
        type: 'object',
        required: ['title', 'content', 'author', 'category'],
        properties: {
          title: { type: 'string', minLength: 3, description: "Titre de l'article (min 3 caractères)" },
          content: { type: 'string', minLength: 10, description: "Contenu de l'article (min 10 caractères)" },
          author: { type: 'string', minLength: 2, description: "Nom de l'auteur (min 2 caractères)" },
          category: { type: 'string', minLength: 2, description: 'Catégorie (min 2 caractères)' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags (optionnel)' },
          published: { type: 'boolean', default: false, description: 'Publié (défaut: false)' },
        },
      },
      UpdateArticleDTO: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 3 },
          content: { type: 'string', minLength: 10 },
          author: { type: 'string', minLength: 2 },
          category: { type: 'string', minLength: 2 },
          tags: { type: 'array', items: { type: 'string' } },
          published: { type: 'boolean' },
        },
      },
      ArticleResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Article' },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      PaginatedArticleResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { $ref: '#/components/schemas/Article' } },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          timestamp: { type: 'string', format: 'date-time' },
          pagination: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      StatsResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              published: { type: 'integer' },
              draft: { type: 'integer' },
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    count: { type: 'integer' },
                  },
                },
              },
              authors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    count: { type: 'integer' },
                  },
                },
              },
            },
          },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};
