import { useState } from 'react';
import { openApiSpec } from '../api/swagger/openapi';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

const methodColors: Record<string, { bg: string; text: string; border: string }> = {
  get: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  post: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  put: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  delete: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  patch: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const methodBadgeColors: Record<string, string> = {
  get: 'bg-blue-500',
  post: 'bg-green-500',
  put: 'bg-orange-500',
  delete: 'bg-red-500',
  patch: 'bg-purple-500',
};

interface EndpointProps {
  method: string;
  path: string;
  operation: any;
}

function resolveRef(ref: string, spec: any): any {
  const parts = ref.replace('#/', '').split('/');
  let current = spec;
  for (const part of parts) {
    current = current[part];
  }
  return current;
}

function SchemaDisplay({ schema, spec, depth = 0 }: { schema: any; spec: any; depth?: number }) {
  if (!schema) return null;

  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, spec);
    const name = schema.$ref.split('/').pop();
    return (
      <div className={`${depth > 0 ? 'ml-4' : ''}`}>
        <span className="text-purple-600 font-mono text-sm">{name}</span>
        <SchemaDisplay schema={resolved} spec={spec} depth={depth + 1} />
      </div>
    );
  }

  if (schema.type === 'object' && schema.properties) {
    return (
      <div className={`${depth > 0 ? 'ml-4 border-l-2 border-gray-200 pl-3' : ''} space-y-1 mt-1`}>
        {Object.entries(schema.properties).map(([key, prop]: [string, any]) => {
          const isRequired = schema.required?.includes(key);
          const resolvedProp = prop.$ref ? resolveRef(prop.$ref, spec) : prop;
          return (
            <div key={key} className="flex items-start gap-2 text-sm">
              <span className="font-mono text-gray-800">{key}</span>
              {isRequired && <span className="text-red-500 text-xs">*required</span>}
              <span className="text-gray-400">
                {resolvedProp.type === 'array'
                  ? `array[${resolvedProp.items?.$ref?.split('/').pop() || resolvedProp.items?.type || 'any'}]`
                  : resolvedProp.type || 'object'}
              </span>
              {resolvedProp.description && (
                <span className="text-gray-500 text-xs">{resolvedProp.description}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (schema.type === 'array') {
    return (
      <div className={`${depth > 0 ? 'ml-4' : ''}`}>
        <span className="text-gray-500 text-sm">array of </span>
        <SchemaDisplay schema={schema.items} spec={spec} depth={depth + 1} />
      </div>
    );
  }

  return (
    <span className="text-gray-600 font-mono text-sm">
      {schema.type}
      {schema.format ? `(${schema.format})` : ''}
    </span>
  );
}

function Endpoint({ method, path, operation }: EndpointProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = methodColors[method] || methodColors.get;
  const badgeColor = methodBadgeColors[method] || methodBadgeColors.get;

  return (
    <div className={`border rounded-lg ${colors.border} mb-2 overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 ${colors.bg} hover:opacity-90 transition-opacity`}
      >
        <span
          className={`${badgeColor} text-white text-xs font-bold uppercase px-3 py-1 rounded min-w-[70px] text-center`}
        >
          {method}
        </span>
        <span className="font-mono text-sm font-semibold text-gray-800 flex-1 text-left">
          {path}
        </span>
        <span className="text-sm text-gray-600 flex-1 text-left hidden md:block">
          {operation.summary}
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-white border-t space-y-4">
          {/* Description */}
          {operation.description && (
            <p className="text-sm text-gray-700">{operation.description}</p>
          )}

          {/* Parameters */}
          {operation.parameters && operation.parameters.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-800 mb-2">Paramètres</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 border-b font-medium text-gray-600">Nom</th>
                      <th className="text-left p-2 border-b font-medium text-gray-600">
                        Emplacement
                      </th>
                      <th className="text-left p-2 border-b font-medium text-gray-600">Type</th>
                      <th className="text-left p-2 border-b font-medium text-gray-600">Requis</th>
                      <th className="text-left p-2 border-b font-medium text-gray-600">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {operation.parameters.map((param: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2 border-b font-mono text-purple-600">{param.name}</td>
                        <td className="p-2 border-b">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {param.in}
                          </span>
                        </td>
                        <td className="p-2 border-b text-gray-600">
                          {param.schema?.type}
                          {param.schema?.default !== undefined && (
                            <span className="text-gray-400 ml-1">
                              (défaut: {String(param.schema.default)})
                            </span>
                          )}
                        </td>
                        <td className="p-2 border-b">
                          {param.required ? (
                            <span className="text-red-500 font-semibold">Oui</span>
                          ) : (
                            <span className="text-gray-400">Non</span>
                          )}
                        </td>
                        <td className="p-2 border-b text-gray-600">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request Body */}
          {operation.requestBody && (
            <div>
              <h4 className="font-semibold text-sm text-gray-800 mb-2">Corps de la requête</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {Object.entries(operation.requestBody.content).map(
                  ([contentType, content]: [string, any]) => (
                    <div key={contentType}>
                      <span className="text-xs text-gray-500 font-mono">{contentType}</span>
                      {content.schema && (
                        <SchemaDisplay schema={content.schema} spec={openApiSpec} />
                      )}
                      {content.example && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Exemple:</span>
                          <pre className="bg-gray-900 text-green-400 p-3 rounded mt-1 text-xs overflow-x-auto">
                            {JSON.stringify(content.example, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Responses */}
          {operation.responses && (
            <div>
              <h4 className="font-semibold text-sm text-gray-800 mb-2">Réponses</h4>
              <div className="space-y-2">
                {Object.entries(operation.responses).map(([code, response]: [string, any]) => {
                  const codeColor =
                    code.startsWith('2')
                      ? 'text-green-600 bg-green-50'
                      : code.startsWith('4')
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-red-600 bg-red-50';

                  return (
                    <div key={code} className="flex items-start gap-3 p-2 rounded bg-gray-50">
                      <span
                        className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${codeColor}`}
                      >
                        {code}
                      </span>
                      <span className="text-sm text-gray-700">{response.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SwaggerUI() {
  const spec = openApiSpec;

  // Groupe les endpoints par tag
  const taggedEndpoints: Record<string, EndpointProps[]> = {};

  Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, operation]: [string, any]) => {
      const tag = operation.tags?.[0] || 'Default';
      if (!taggedEndpoints[tag]) taggedEndpoints[tag] = [];
      taggedEndpoints[tag].push({ method, path, operation });
    });
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-t-xl">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{spec.info.title}</h1>
          <span className="bg-white/20 px-2 py-0.5 rounded text-sm">v{spec.info.version}</span>
        </div>
        <div className="text-green-100 text-sm flex items-center gap-4">
          <span>OpenAPI 3.0.3</span>
          <span>•</span>
          <a href="#" className="flex items-center gap-1 hover:text-white">
            <ExternalLink className="w-3 h-3" /> Spécification JSON
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border-x border-b p-6">
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
          {spec.info.description}
        </div>
      </div>

      {/* Servers */}
      <div className="bg-gray-50 border-x border-b p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Serveurs</h3>
        <div className="space-y-1">
          {spec.servers.map((server, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-green-600 bg-green-50 px-2 py-0.5 rounded">
                {server.url}
              </span>
              <span className="text-gray-500">- {server.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints by Tag */}
      <div className="bg-white border-x border-b rounded-b-xl p-6 space-y-6">
        {Object.entries(taggedEndpoints).map(([tag, endpoints]) => {
          const tagInfo = spec.tags.find((t) => t.name === tag);
          return (
            <div key={tag}>
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800">{tag}</h3>
                {tagInfo && <p className="text-sm text-gray-500">{tagInfo.description}</p>}
              </div>
              <div className="space-y-1">
                {endpoints.map((ep, idx) => (
                  <Endpoint key={idx} {...ep} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schemas */}
      <div className="mt-6 bg-white border rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Schémas (Models)</h3>
        <div className="space-y-4">
          {Object.entries(spec.components.schemas).map(([name, schema]: [string, any]) => (
            <SchemaCard key={name} name={name} schema={schema} spec={spec} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SchemaCard({ name, schema, spec }: { name: string; schema: any; spec: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
      >
        <span className="font-mono font-semibold text-purple-600">{name}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          <SchemaDisplay schema={schema} spec={spec} />
        </div>
      )}
    </div>
  );
}
