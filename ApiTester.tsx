import { useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';
import * as ArticleController from '../api/controllers/ArticleController';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestConfig {
  method: HttpMethod;
  endpoint: string;
  description: string;
  body?: string;
  params?: { key: string; value: string; placeholder: string }[];
}

const presetRequests: RequestConfig[] = [
  {
    method: 'GET',
    endpoint: '/api/articles',
    description: 'Récupérer tous les articles',
  },
  {
    method: 'GET',
    endpoint: '/api/articles/{id}',
    description: 'Récupérer un article par ID',
    params: [{ key: 'id', value: '1', placeholder: "ID de l'article" }],
  },
  {
    method: 'POST',
    endpoint: '/api/articles',
    description: 'Créer un nouvel article',
    body: JSON.stringify(
      {
        title: 'Mon nouvel article',
        content: "Ceci est le contenu de mon article sur le développement web avec Node.js",
        author: 'Étudiant Dev',
        category: 'Développement Web',
        tags: ['nodejs', 'express', 'api'],
        published: true,
      },
      null,
      2
    ),
  },
  {
    method: 'PUT',
    endpoint: '/api/articles/{id}',
    description: 'Mettre à jour un article',
    params: [{ key: 'id', value: '1', placeholder: "ID de l'article" }],
    body: JSON.stringify(
      {
        title: 'Titre mis à jour',
        published: true,
      },
      null,
      2
    ),
  },
  {
    method: 'DELETE',
    endpoint: '/api/articles/{id}',
    description: 'Supprimer un article',
    params: [{ key: 'id', value: '1', placeholder: "ID de l'article" }],
  },
  {
    method: 'GET',
    endpoint: '/api/articles/stats',
    description: 'Statistiques du blog',
  },
  {
    method: 'POST',
    endpoint: '/api/reset',
    description: 'Réinitialiser la base de données',
  },
];

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-blue-500',
  POST: 'bg-green-500',
  PUT: 'bg-orange-500',
  DELETE: 'bg-red-500',
};

export default function ApiTester() {
  const [selectedRequest, setSelectedRequest] = useState<RequestConfig>(presetRequests[0]);
  const [response, setResponse] = useState<string>('');
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [body, setBody] = useState(selectedRequest.body || '');
  const [params, setParams] = useState(selectedRequest.params || []);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState('1');
  const [limit, setLimit] = useState('10');

  function selectRequest(req: RequestConfig) {
    setSelectedRequest(req);
    setBody(req.body || '');
    setParams(req.params?.map((p) => ({ ...p })) || []);
    setResponse('');
    setStatusCode(null);
    setResponseTime(null);
  }

  function executeRequest() {
    const startTime = performance.now();

    try {
      let result: any;
      const endpoint = selectedRequest.endpoint;

      if (endpoint === '/api/articles' && selectedRequest.method === 'GET') {
        result = ArticleController.getAll(
          parseInt(page) || 1,
          parseInt(limit) || 10,
          searchQuery || undefined,
          categoryFilter || undefined
        );
      } else if (endpoint === '/api/articles/{id}' && selectedRequest.method === 'GET') {
        const id = params.find((p) => p.key === 'id')?.value || '';
        result = ArticleController.getById(id);
      } else if (endpoint === '/api/articles' && selectedRequest.method === 'POST') {
        const dto = JSON.parse(body);
        result = ArticleController.create(dto);
      } else if (endpoint === '/api/articles/{id}' && selectedRequest.method === 'PUT') {
        const id = params.find((p) => p.key === 'id')?.value || '';
        const dto = JSON.parse(body);
        result = ArticleController.update(id, dto);
      } else if (endpoint === '/api/articles/{id}' && selectedRequest.method === 'DELETE') {
        const id = params.find((p) => p.key === 'id')?.value || '';
        result = ArticleController.remove(id);
      } else if (endpoint === '/api/articles/stats') {
        result = ArticleController.getStats();
      } else if (endpoint === '/api/reset') {
        result = ArticleController.resetDatabase();
      }

      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setStatusCode(result.statusCode);
      setResponse(JSON.stringify(result, null, 2));
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setStatusCode(500);
      setResponse(
        JSON.stringify(
          {
            success: false,
            message: `Erreur: ${err.message}`,
            statusCode: 500,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );
    }
  }

  function copyResponse() {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusColor =
    statusCode && statusCode < 300
      ? 'text-green-500'
      : statusCode && statusCode < 500
        ? 'text-orange-500'
        : 'text-red-500';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Preset Requests */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-bold text-gray-800">📡 Endpoints</h3>
              <p className="text-xs text-gray-500 mt-1">Cliquez pour tester</p>
            </div>
            <div className="p-2 space-y-1">
              {presetRequests.map((req, idx) => (
                <button
                  key={idx}
                  onClick={() => selectRequest(req)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-2 text-sm transition ${
                    selectedRequest === req
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`${methodColors[req.method]} text-white text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[40px] text-center`}
                  >
                    {req.method}
                  </span>
                  <span className="text-gray-700 truncate">{req.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Request Builder */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b flex items-center gap-3">
              <span
                className={`${methodColors[selectedRequest.method]} text-white text-sm font-bold px-3 py-1 rounded`}
              >
                {selectedRequest.method}
              </span>
              <code className="text-sm text-gray-700 font-mono flex-1">
                {selectedRequest.endpoint}
              </code>
              <button
                onClick={executeRequest}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition"
              >
                <Play className="w-4 h-4" />
                Exécuter
              </button>
            </div>

            {/* Params */}
            {params.length > 0 && (
              <div className="p-4 border-b">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Paramètres de chemin</h4>
                <div className="space-y-2">
                  {params.map((param, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <label className="text-sm font-mono text-purple-600 min-w-[60px]">
                        {param.key}
                      </label>
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => {
                          const newParams = [...params];
                          newParams[idx].value = e.target.value;
                          setParams(newParams);
                        }}
                        placeholder={param.placeholder}
                        className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Query Params for GET /api/articles */}
            {selectedRequest.endpoint === '/api/articles' &&
              selectedRequest.method === 'GET' && (
                <div className="p-4 border-b">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Paramètres de requête</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">search</label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Terme de recherche..."
                        className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">category</label>
                      <input
                        type="text"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        placeholder="Catégorie..."
                        className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">page</label>
                      <input
                        type="number"
                        value={page}
                        onChange={(e) => setPage(e.target.value)}
                        min="1"
                        className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">limit</label>
                      <input
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        min="1"
                        max="100"
                        className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

            {/* Body */}
            {(selectedRequest.method === 'POST' || selectedRequest.method === 'PUT') &&
              selectedRequest.endpoint !== '/api/reset' && (
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Corps de la requête (JSON)
                  </h4>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono bg-gray-900 text-green-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                    spellCheck={false}
                  />
                </div>
              )}
          </div>

          {/* Response */}
          {response && (
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h4 className="font-semibold text-gray-800">Réponse</h4>
                  {statusCode && (
                    <span className={`font-mono font-bold ${statusColor}`}>
                      Status: {statusCode}
                    </span>
                  )}
                  {responseTime !== null && (
                    <span className="text-gray-500 text-sm">⏱ {responseTime}ms</span>
                  )}
                </div>
                <button
                  onClick={copyResponse}
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-green-400 rounded-b-xl text-sm overflow-x-auto max-h-[500px] overflow-y-auto">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
