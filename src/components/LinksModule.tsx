import React, { useState } from 'react';
import { Plus, Search, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const LinksModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    url: ''
  });
  
  const { linksUteis, addLinkUtil, deleteItem } = useData();
  const { user } = useAuth();
  
  const userLinks = linksUteis.filter(l => l.corretorId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLinkUtil({
      ...formData,
      corretorId: user?.id || ''
    });
    setFormData({ titulo: '', url: '' });
    setShowForm(false);
  };

  const filteredLinks = userLinks.filter(link =>
    link.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const openLink = (url: string) => {
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(finalUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Links Úteis</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Link
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por título ou URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Editar Link' : 'Novo Link'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título do link"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="url"
                placeholder="https://exemplo.com"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ titulo: '', url: '' });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map(link => (
          <div key={link.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{link.titulo}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-all">{link.url}</p>
              </div>
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => openLink(link.url)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Abrir link"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteItem('links', link.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Remover link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <button
              onClick={() => openLink(link.url)}
              className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
            >
              Abrir Link
            </button>
          </div>
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum link encontrado.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Adicione links úteis como simuladores, formulários e ferramentas que você usa frequentemente.
          </p>
        </div>
      )}

      {/* Sugestões de Links */}
      {userLinks.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">Sugestões de Links Úteis</h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <p>• Simuladores de seguros</p>
            <p>• Formulários de cotação</p>
            <p>• Calculadoras de prêmios</p>
            <p>• Sistemas de parceiros</p>
            <p>• Documentos e regulamentos</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksModule;