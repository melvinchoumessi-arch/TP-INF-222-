import { useState, useEffect } from 'react';
import {
  FileText,
  Eye,
  EyeOff,
  Users,
  FolderOpen,
  Trash2,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import * as ArticleController from '../api/controllers/ArticleController';
import { Article, CreateArticleDTO } from '../api/models/Article';

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<CreateArticleDTO>({
    title: '',
    content: '',
    author: '',
    category: '',
    tags: [],
    published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  function loadData() {
    const result = ArticleController.getAll(1, 100, searchTerm || undefined);
    setArticles(result.data);
    const statsResult = ArticleController.getStats();
    setStats(statsResult.data);
  }

  useEffect(() => {
    loadData();
  }, [searchTerm]);

  function showNotif(type: 'success' | 'error', message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }

  function handleCreate() {
    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    const result = ArticleController.create({ ...formData, tags: tagsArray });
    if (result.success) {
      showNotif('success', result.message);
      resetForm();
      loadData();
    } else {
      showNotif('error', result.message);
    }
  }

  function handleUpdate() {
    if (!editingArticle) return;
    const tagsArray = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    const result = ArticleController.update(editingArticle.id, { ...formData, tags: tagsArray });
    if (result.success) {
      showNotif('success', result.message);
      resetForm();
      loadData();
    } else {
      showNotif('error', result.message);
    }
  }

  function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    const result = ArticleController.remove(id);
    if (result.success) {
      showNotif('success', result.message);
      loadData();
    } else {
      showNotif('error', result.message);
    }
  }

  function startEdit(article: Article) {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author,
      category: article.category,
      tags: article.tags,
      published: article.published,
    });
    setTagInput(article.tags.join(', '));
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      author: '',
      category: '',
      tags: [],
      published: false,
    });
    setTagInput('');
  }

  function handleReset() {
    if (!confirm('Réinitialiser toute la base de données ?')) return;
    ArticleController.resetDatabase();
    showNotif('success', 'Base de données réinitialisée');
    loadData();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            label="Total Articles"
            value={stats.total}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            label="Publiés"
            value={stats.published}
            color="bg-green-500"
          />
          <StatCard
            icon={<EyeOff className="w-6 h-6" />}
            label="Brouillons"
            value={stats.draft}
            color="bg-orange-500"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Auteurs"
            value={stats.authors.length}
            color="bg-purple-500"
          />
        </div>
      )}

      {/* Categories & Authors */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
              <FolderOpen className="w-5 h-5 text-indigo-500" />
              Catégories
            </h3>
            <div className="space-y-2">
              {stats.categories.map((cat: any) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{cat.name}</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-purple-500" />
              Auteurs
            </h3>
            <div className="space-y-2">
              {stats.authors.map((author: any) => (
                <div key={author.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{author.name}</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                    {author.count} article(s)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un article..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            Nouvel article
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4">
            {editingArticle ? "✏️ Modifier l'article" : '➕ Nouvel article'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de l'article"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auteur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nom de l'auteur"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Catégorie"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="nodejs, api, express"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Contenu de l'article..."
                rows={5}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="published" className="text-sm text-gray-700">
                Publier immédiatement
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={editingArticle ? handleUpdate : handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
            >
              {editingArticle ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-semibold transition"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-3">
        {articles.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun article trouvé</p>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-gray-800">{article.title}</h3>
                    {article.published ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Publié
                      </span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Brouillon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{article.content}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span>ID: {article.id}</span>
                    <span>
                      Créé le: {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(article)}
                    className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
      <div className={`${color} text-white p-3 rounded-xl`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
