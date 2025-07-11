import React, { useState } from 'react';
import { BarChart, Filter, Download, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const RelatoriosModule = () => {
  const [dateFilter, setDateFilter] = useState({
    inicio: '',
    fim: ''
  });
  const [tipoFilter, setTipoFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');
  
  const { clientes, vendas } = useData();
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

  const filteredVendas = userVendas.filter(venda => {
    const dataVenda = new Date(venda.dataVenda);
    const inicio = dateFilter.inicio ? new Date(dateFilter.inicio) : null;
    const fim = dateFilter.fim ? new Date(dateFilter.fim) : null;
    
    return (
      (!inicio || dataVenda >= inicio) &&
      (!fim || dataVenda <= fim) &&
      (!tipoFilter || venda.tipoPlano === tipoFilter) &&
      (!clienteFilter || venda.cliente.toLowerCase().includes(clienteFilter.toLowerCase()))
    );
  });

  const vendasPorTipo = tiposPlano.map(tipo => ({
    tipo,
    vendas: filteredVendas.filter(v => v.tipoPlano === tipo).length,
    valor: filteredVendas.filter(v => v.tipoPlano === tipo).reduce((sum, v) => sum + v.valor, 0)
  }));

  const vendasPorStatus = ['Pendente', 'Aprovado', 'Cancelado'].map(status => ({
    status,
    vendas: filteredVendas.filter(v => v.status === status).length,
    valor: filteredVendas.filter(v => v.status === status).reduce((sum, v) => sum + v.valor, 0)
  }));

  const totalVendas = filteredVendas.reduce((sum, venda) => sum + venda.valor, 0);
  const totalQuantidade = filteredVendas.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const exportData = () => {
    const csvContent = [
      ['Cliente', 'Tipo', 'Data', 'Valor', 'Status'],
      ...filteredVendas.map(venda => [
        venda.cliente,
        venda.tipoPlano,
        formatDate(venda.dataVenda),
        venda.valor.toString(),
        venda.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-vendas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios de Vendas</h2>
        <button
          onClick={exportData}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={dateFilter.inicio}
              onChange={(e) => setDateFilter({...dateFilter, inicio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={dateFilter.fim}
              onChange={(e) => setDateFilter({...dateFilter, fim: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Plano
            </label>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              {tiposPlano.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cliente
            </label>
            <input
              type="text"
              placeholder="Nome do cliente"
              value={clienteFilter}
              onChange={(e) => setClienteFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vendas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalVendas)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantidade</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalQuantidade}</p>
            </div>
            <BarChart className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalQuantidade > 0 ? totalVendas / totalQuantidade : 0)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Vendas por Tipo */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vendas por Tipo de Plano</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Tipo</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Quantidade</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {vendasPorTipo.map(item => (
                <tr key={item.tipo} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 text-gray-900 dark:text-white">{item.tipo}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{item.vendas}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{formatCurrency(item.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendas por Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vendas por Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Quantidade</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {vendasPorStatus.map(item => (
                <tr key={item.status} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'Aprovado' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      item.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{item.vendas}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{formatCurrency(item.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosModule;