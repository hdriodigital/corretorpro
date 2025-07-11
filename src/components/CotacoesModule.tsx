import React, { useState } from 'react';
import { Plus, Search, ExternalLink, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const CotacoesModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    cliente: '',
    dataCotacao: '',
    protocolo: '',
    link: '',
    valor: '',
    validade: '',
    status: 'Pendente'
  });
  
  const { cotacoes, addCotacao, deleteItem } = useData();
  const { user } = useAuth();
  
  const userCotacoes = cotacoes.filter(c => c.corretorId === user?.id);
  
  const statusOptions = ['Pendente', 'Aprovada', 'Rejeitada', 'Expirada'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCotacao({
      ...formData,
      valor: parseFloat(formData.valor),
      corretorId: user?.id || ''
    });
    setFormData({ cliente: '', dataCotacao: '', protocolo: '', link: '', valor: '', validade: '', status: 'Pendente' });
    setShowForm(false);
  };

  const filteredCotacoes = userCotacoes.filter(cotacao =>
    cotacao.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cotacao.protocolo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const isExpired = (validade: string) => {
    return new Date(validade) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cotações</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Cotação
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por cliente ou protocolo..."
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
              Nova Cotação
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome do cliente"
                value={formData.cliente}
                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={formData.dataCotacao}
                onChange={(e) => setFormData({...formData, dataCotacao: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Nº do protocolo"
                value={formData.protocolo}
                onChange={(e) => setFormData({...formData, protocolo: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="url"
                placeholder="Link da cotação"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor da cotação"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={formData.validade}
                onChange={(e) => setFormData({...formData, validade: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cotações List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCotacoes.map(cotacao => (
          <div key={cotacao.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{cotacao.cliente}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Protocolo: {cotacao.protocolo}</p>
              </div>
              <div className="flex gap-2">
                {cotacao.link && (
                  <a
                    href={cotacao.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => deleteItem('cotacoes', cotacao.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Valor:</strong> {formatCurrency(cotacao.valor)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Data:</strong> {formatDate(cotacao.dataCotacao)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Validade:</strong> {formatDate(cotacao.validade)}
                {isExpired(cotacao.validade) && (
                  <span className="ml-2 text-red-600 font-semibold">(Expirada)</span>
                )}
              </p>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  cotacao.status === 'Aprovada' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  cotacao.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  cotacao.status === 'Expirada' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {cotacao.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCotacoes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhuma cotação encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default CotacoesModule;