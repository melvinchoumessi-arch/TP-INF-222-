// ============================================
// CONTROLLER: ArticleController
// Gère la logique métier des articles
// Simule les controllers d'un backend Node.js/Express
// ============================================

import {
  Article,
  CreateArticleDTO,
  UpdateArticleDTO,
  ApiResponse,
  PaginatedResponse,
} from '../models/Article';
import * as db from '../database/db';

// Génère un ID unique (simule auto-increment ou UUID)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Valide les données de création d'article
function validateCreateDTO(dto: CreateArticleDTO): string[] {
  const errors: string[] = [];
  if (!dto.title || dto.title.trim().length < 3) {
    errors.push('Le titre est requis et doit contenir au moins 3 caractères');
  }
  if (!dto.content || dto.content.trim().length < 10) {
    errors.push('Le contenu est requis et doit contenir au moins 10 caractères');
  }
  if (!dto.author || dto.author.trim().length < 2) {
    errors.push("L'auteur est requis et doit contenir au moins 2 caractères");
  }
  if (!dto.category || dto.category.trim().length < 2) {
    errors.push('La catégorie est requise et doit contenir au moins 2 caractères');
  }
  return errors;
}

// GET /api/articles - Récupérer tous les articles (avec pagination)
export function getAll(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string
): PaginatedResponse<Article> {
  let articles: Article[];

  if (search) {
    articles = db.searchArticles(search);
  } else if (category) {
    articles = db.getArticlesByCategory(category);
  } else {
    articles = db.getAllArticles();
  }

  const total = articles.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedArticles = articles.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: paginatedArticles,
    message: `${paginatedArticles.length} article(s) trouvé(s)`,
    statusCode: 200,
    timestamp: new Date().toISOString(),
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

// GET /api/articles/:id - Récupérer un article par ID
export function getById(id: string): ApiResponse<Article> {
  const article = db.getArticleById(id);

  if (!article) {
    return {
      success: false,
      message: `Article avec l'ID '${id}' non trouvé`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    success: true,
    data: article,
    message: 'Article trouvé',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };
}

// POST /api/articles - Créer un nouvel article
export function create(dto: CreateArticleDTO): ApiResponse<Article> {
  const errors = validateCreateDTO(dto);

  if (errors.length > 0) {
    return {
      success: false,
      message: `Erreur de validation: ${errors.join('; ')}`,
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };
  }

  const now = new Date().toISOString();
  const newArticle: Article = {
    id: generateId(),
    title: dto.title.trim(),
    content: dto.content.trim(),
    author: dto.author.trim(),
    category: dto.category.trim(),
    tags: dto.tags || [],
    published: dto.published ?? false,
    createdAt: now,
    updatedAt: now,
  };

  db.createArticle(newArticle);

  return {
    success: true,
    data: newArticle,
    message: 'Article créé avec succès',
    statusCode: 201,
    timestamp: new Date().toISOString(),
  };
}

// PUT /api/articles/:id - Mettre à jour un article
export function update(id: string, dto: UpdateArticleDTO): ApiResponse<Article> {
  const existing = db.getArticleById(id);

  if (!existing) {
    return {
      success: false,
      message: `Article avec l'ID '${id}' non trouvé`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    };
  }

  if (dto.title !== undefined && dto.title.trim().length < 3) {
    return {
      success: false,
      message: 'Le titre doit contenir au moins 3 caractères',
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };
  }

  const updates: Partial<Article> = {};
  if (dto.title !== undefined) updates.title = dto.title.trim();
  if (dto.content !== undefined) updates.content = dto.content.trim();
  if (dto.author !== undefined) updates.author = dto.author.trim();
  if (dto.category !== undefined) updates.category = dto.category.trim();
  if (dto.tags !== undefined) updates.tags = dto.tags;
  if (dto.published !== undefined) updates.published = dto.published;

  const updated = db.updateArticle(id, updates);

  return {
    success: true,
    data: updated,
    message: 'Article mis à jour avec succès',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };
}

// DELETE /api/articles/:id - Supprimer un article
export function remove(id: string): ApiResponse<null> {
  const existing = db.getArticleById(id);

  if (!existing) {
    return {
      success: false,
      message: `Article avec l'ID '${id}' non trouvé`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    };
  }

  db.deleteArticle(id);

  return {
    success: true,
    data: null,
    message: 'Article supprimé avec succès',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };
}

// GET /api/articles/stats - Statistiques
export function getStats(): ApiResponse<{
  total: number;
  published: number;
  draft: number;
  categories: { name: string; count: number }[];
  authors: { name: string; count: number }[];
}> {
  const articles = db.getAllArticles();
  const published = articles.filter((a) => a.published).length;

  const categoryMap = new Map<string, number>();
  const authorMap = new Map<string, number>();

  articles.forEach((a) => {
    categoryMap.set(a.category, (categoryMap.get(a.category) || 0) + 1);
    authorMap.set(a.author, (authorMap.get(a.author) || 0) + 1);
  });

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  const authors = Array.from(authorMap.entries()).map(([name, count]) => ({ name, count }));

  return {
    success: true,
    data: {
      total: articles.length,
      published,
      draft: articles.length - published,
      categories,
      authors,
    },
    message: 'Statistiques récupérées',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };
}

// Réinitialiser la base de données
export function resetDatabase(): ApiResponse<null> {
  db.resetDB();
  return {
    success: true,
    data: null,
    message: 'Base de données réinitialisée avec succès',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };
}
