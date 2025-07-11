import React, { useState } from 'react';
import { Plus, Search, DollarSign, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const VendasModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    clienteId: '',
    cliente: '',
    tipoPlano: '',
    dataVenda: '',
    valor: '',
    status: 'Pendente'
  });
  
  const { clientes, vendas, addVenda, deleteItem } = useData();
  const { user } = useAuth();
  
  const userClientes = clientes.filter(c => c.corretorId === user?.id);
  const userVendas = vendas.filter(v => v.corretorId === user?.id);
  
  const tiposPlano = [
    'Plano de saúde',
    'Plano dental',
    'Seguro de vida',
    'Seguro auto',
    'Seguro residencial',
    'Seguro especial',
    'Outros'
  ];

  const statusOptions = ['Pendente', 'Aprovado', 'Cancelado'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVenda({
      ...formData,
      valor: parseFloat(formData.valor),
      corretorId: user?.id || ''
    });
    setFormData({ clienteId: '', cliente: '', tipoPlano: '', dataVenda: '', valor: '', status: 'Pendente' });
    setShowForm(false);
  };

  const handleClienteChange = (clienteId: string) => {
    const cliente = userClientes.find(c => c.id === clienteId);
    setFormData({
      ...formData,
      clienteId,
      cliente: cliente?.nome || '',
      tipoPlano: cliente?.tipoPlano || ''
    });
  };

  const filteredVendas = userVendas.filter(venda =>
    venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venda.tipoPlano.toLowerCase().includes(searchTerm.toLowerCase())
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

  const totalVendas = userVendas.reduce((sum, venda) => sum + venda.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vendas</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total: {formatCurrency(totalVendas)}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Venda
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por cliente ou tipo de plano..."
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
              Nova Venda
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.clienteId}
                onChange={(e) => handleClienteChange(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione o cliente</option>
                {userClientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
              </select>
              <select
                value={formData.tipoPlano}
                onChange={(e) => setFormData({...formData, tipoPlano: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione o tipo de plano</option>
                {tiposPlano.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <input
                type="date"
                value={formData.dataVenda}
                onChange={(e) => setFormData({...formData, dataVenda: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Valor da venda"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
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

      {/* Vendas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendas.map(venda => (
          <div key={venda.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{venda.cliente}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{venda.tipoPlano}</p>
              </div>
              <button
                onClick={() => deleteItem('vendas', venda.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4 mr-2" />
                {formatCurrency(venda.valor)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(venda.dataVenda)}
              </p>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  venda.status === 'Aprovado' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  venda.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {venda.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhuma venda encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default VendasModule;