import { useState } from 'react';
import {
  BookOpen,
  TestTube,
  LayoutDashboard,
  Code2,
  Server,
  Database,
  Braces,
} from 'lucide-react';
import SwaggerUI from './components/SwaggerUI';
import ApiTester from './components/ApiTester';
import Dashboard from './components/Dashboard';
import CodeView from './components/CodeView';

type TabId = 'swagger' | 'tester' | 'dashboard' | 'code';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'swagger',
    label: 'Documentation Swagger',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'Spécification OpenAPI 3.0',
  },
  {
    id: 'tester',
    label: 'Tester l\'API',
    icon: <TestTube className="w-4 h-4" />,
    description: 'Testeur interactif',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    description: 'Gestion des articles',
  },
  {
    id: 'code',
    label: 'Code Source',
    icon: <Code2 className="w-4 h-4" />,
    description: 'Architecture backend',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('swagger');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-3 rounded-xl shadow-lg">
                <Braces className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Blog API
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  API RESTful pour la gestion d'articles • Node.js / Express / SQLite
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Server className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Serveur en ligne</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">SQLite/MySQL</span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Node.js', 'Express.js', 'Java', 'SQLite', 'MySQL', 'Swagger', 'REST API', 'MVC'].map((tech) => (
              <span
                key={tech}
                className="bg-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-sm text-gray-500">
            {tabs.find((t) => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        {activeTab === 'swagger' && <SwaggerUI />}
        {activeTab === 'tester' && <ApiTester />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'code' && <CodeView />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <Braces className="w-5 h-5 text-green-400" />
                Blog API
              </h3>
              <p className="text-sm leading-relaxed">
                Projet étudiant - API RESTful backend pour la gestion d'un blog simple.
                Développé avec Node.js, Express.js et supportant SQLite/MySQL.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Technologies</h4>
              <ul className="space-y-1 text-sm">
                <li>• Node.js (Runtime JavaScript)</li>
                <li>• Express.js (Framework Web)</li>
                <li>• Java / Spring Boot (Alternative)</li>
                <li>• SQLite & MySQL (Base de données)</li>
                <li>• Sequelize (ORM)</li>
                <li>• Swagger / OpenAPI 3.0</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Endpoints API</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li><span className="text-blue-400">GET</span> /api/articles</li>
                <li><span className="text-blue-400">GET</span> /api/articles/:id</li>
                <li><span className="text-green-400">POST</span> /api/articles</li>
                <li><span className="text-orange-400">PUT</span> /api/articles/:id</li>
                <li><span className="text-red-400">DELETE</span> /api/articles/:id</li>
                <li><span className="text-blue-400">GET</span> /api/articles/stats</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © 2024 Blog API - Projet Étudiant en Développement Web
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-gray-800 px-3 py-1 rounded-full">v1.0.0</span>
              <span className="text-xs bg-gray-800 px-3 py-1 rounded-full">OpenAPI 3.0</span>
              <span className="text-xs bg-green-900 text-green-400 px-3 py-1 rounded-full">
                ● Opérationnel
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
