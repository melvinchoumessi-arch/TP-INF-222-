// ============================================
// MODEL: Article
// Représente la structure d'un article de blog
// Simule un modèle de base de données (SQLite/MySQL)
// ============================================

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDTO {
  title: string;
  content: string;
  author: string;
  category: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  author?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  statusCode: number;
  timestamp: string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
