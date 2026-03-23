// ============================================
// DATABASE: Simulation SQLite/MySQL
// Utilise localStorage comme persistance
// Simule les opérations CRUD d'une vraie BDD
// ============================================

import { Article } from '../models/Article';

const DB_KEY = 'blog_articles_db';

// Données initiales (seed) pour la base de données
const seedData: Article[] = [
  {
    id: '1',
    title: 'Introduction à Node.js',
    content:
      "Node.js est un environnement d'exécution JavaScript côté serveur. Il utilise le moteur V8 de Google Chrome et permet de créer des applications réseau scalables. Node.js est basé sur un modèle d'E/S non bloquant et orienté événements, ce qui le rend léger et efficace pour les applications en temps réel à forte intensité de données.",
    author: 'Jean Dupont',
    category: 'Backend',
    tags: ['nodejs', 'javascript', 'backend'],
    published: true,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
  {
    id: '2',
    title: 'Les bases de MySQL',
    content:
      "MySQL est un système de gestion de bases de données relationnelles (SGBDR) open source. Il utilise le langage SQL pour gérer les données. MySQL est l'un des SGBDR les plus populaires au monde, utilisé par de nombreuses grandes entreprises comme Facebook, Twitter et YouTube.",
    author: 'Marie Martin',
    category: 'Base de données',
    tags: ['mysql', 'sql', 'database'],
    published: true,
    createdAt: '2024-02-20T14:00:00.000Z',
    updatedAt: '2024-02-20T14:00:00.000Z',
  },
  {
    id: '3',
    title: 'API REST avec Express.js',
    content:
      "Express.js est un framework web minimaliste pour Node.js. Il fournit un ensemble robuste de fonctionnalités pour les applications web et mobiles. Dans cet article, nous allons explorer comment créer une API RESTful complète avec Express.js, incluant les routes, les middlewares et la gestion des erreurs.",
    author: 'Pierre Bernard',
    category: 'Backend',
    tags: ['express', 'api', 'rest', 'nodejs'],
    published: true,
    createdAt: '2024-03-10T09:15:00.000Z',
    updatedAt: '2024-03-12T11:20:00.000Z',
  },
  {
    id: '4',
    title: 'SQLite vs MySQL: Comparaison',
    content:
      "SQLite et MySQL sont deux systèmes de gestion de bases de données populaires mais avec des cas d'utilisation différents. SQLite est une base de données embarquée sans serveur, idéale pour les applications mobiles et les prototypes. MySQL est un SGBDR client-serveur, adapté aux applications web à grande échelle.",
    author: 'Sophie Leroy',
    category: 'Base de données',
    tags: ['sqlite', 'mysql', 'comparaison', 'database'],
    published: false,
    createdAt: '2024-04-05T16:45:00.000Z',
    updatedAt: '2024-04-05T16:45:00.000Z',
  },
  {
    id: '5',
    title: 'Java Spring Boot pour les débutants',
    content:
      "Spring Boot est un framework Java qui simplifie la création d'applications autonomes basées sur Spring. Il offre une configuration automatique, un serveur embarqué et des starters de dépendances. C'est l'outil idéal pour créer des microservices et des API REST en Java.",
    author: 'Jean Dupont',
    category: 'Backend',
    tags: ['java', 'spring-boot', 'backend'],
    published: true,
    createdAt: '2024-05-18T08:00:00.000Z',
    updatedAt: '2024-05-20T10:30:00.000Z',
  },
];

// Initialise la BDD avec les données seed si vide
function initDB(): void {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(seedData));
  }
}

// Récupère tous les articles
export function getAllArticles(): Article[] {
  initDB();
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
}

// Récupère un article par ID
export function getArticleById(id: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.id === id);
}

// Crée un nouvel article
export function createArticle(article: Article): Article {
  const articles = getAllArticles();
  articles.push(article);
  localStorage.setItem(DB_KEY, JSON.stringify(articles));
  return article;
}

// Met à jour un article
export function updateArticle(id: string, updates: Partial<Article>): Article | undefined {
  const articles = getAllArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return undefined;

  articles[index] = { ...articles[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(DB_KEY, JSON.stringify(articles));
  return articles[index];
}

// Supprime un article
export function deleteArticle(id: string): boolean {
  const articles = getAllArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return false;

  articles.splice(index, 1);
  localStorage.setItem(DB_KEY, JSON.stringify(articles));
  return true;
}

// Recherche des articles
export function searchArticles(query: string): Article[] {
  const articles = getAllArticles();
  const lowerQuery = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.content.toLowerCase().includes(lowerQuery) ||
      a.author.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery) ||
      a.tags.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

// Récupère les articles par catégorie
export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  return articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
}

// Réinitialise la BDD
export function resetDB(): void {
  localStorage.setItem(DB_KEY, JSON.stringify(seedData));
}

// Compte le nombre total d'articles
export function countArticles(): number {
  return getAllArticles().length;
}
