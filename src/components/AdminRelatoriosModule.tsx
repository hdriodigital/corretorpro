import React, { useState } from 'react';
import { BarChart, Filter, Download, Calendar, TrendingUp, Users, FileText } from 'lucide-react';

const AdminRelatoriosModule = () => {
  const [dateFilter, setDateFilter] = useState({
    inicio: '',
    fim: ''
  });
  const [corretorFilter, setCorretorFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  // Dados dos corretores
  const corretores = JSON.parse(localStorage.getItem('corretor-pro-users') || '[]');
  
  // Dados consolidados
  const allClientes = JSON.parse(localStorage.getItem('corretor-pro-clientes') || '[]');
  const allVendas = JSON.parse(localStorage.getItem('corretor-pro-vendas') || '[]');
  const allAgendamentos = JSON.parse(localStorage.getItem('corretor-pro-agendamentos') || '[]');

  const tiposPlano = [
    'Plano de saúde',
    'Plano dental',
    'Seguro de vida',
    'Seguro auto',
    'Seguro residencial',
    'Seguro especial',
    'Outros'
  ];

  const filteredVendas = allVendas.filter((venda: any) => {
    const dataVenda = new Date(venda.dataVenda);
    const inicio = dateFilter.inicio ? new Date(dateFilter.inicio) : null;
    const fim = dateFilter.fim ? new Date(dateFilter.fim) : null;
    
    return (
      (!inicio || dataVenda >= inicio) &&
      (!fim || dataVenda <= fim) &&
      (!corretorFilter || venda.corretorId === corretorFilter) &&
      (!tipoFilter || venda.tipoPlano === tipoFilter)
    );
  });

  const relatoriosPorCorretor = corretores.map((corretor: any) => {
    const vendasCorretor = allVendas.filter((v: any) => v.corretorId === corretor.id);
    const clientesCorretor = allClientes.filter((c: any) => c.corretorId === corretor.id);
    const agendamentosCorretor = allAgendamentos.filter((a: any) => a.corretorId === corretor.id);
    
    return {
      corretor: corretor.name,
      email: corretor.email,
      totalVendas: vendasCorretor.length,
      valorTotal: vendasCorretor.reduce((sum: number, v: any) => sum + v.valor, 0),
      totalClientes: clientesCorretor.length,
      totalAgendamentos: agendamentosCorretor.length
    };
  });

  const vendasPorTipo = tiposPlano.map(tipo => ({
    tipo,
    vendas: filteredVendas.filter((v: any) => v.tipoPlano === tipo).length,
    valor: filteredVendas.filter((v: any) => v.tipoPlano === tipo).reduce((sum: number, v: any) => sum + v.valor, 0)
  }));

  const totalVendas = filteredVendas.reduce((sum: number, venda: any) => sum + venda.valor, 0);
  const totalQuantidade = filteredVendas.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportData = () => {
    const csvContent = [
      ['Corretor', 'Email', 'Clientes', 'Vendas', 'Valor Total', 'Agendamentos'],
      ...relatoriosPorCorretor.map(rel => [
        rel.corretor,
        rel.email,
        rel.totalClientes.toString(),
        rel.totalVendas.toString(),
        rel.valorTotal.toString(),
        rel.totalAgendamentos.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-admin-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios Administrativos</h2>
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
              Corretor
            </label>
            <select
              value={corretorFilter}
              onChange={(e) => setCorretorFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              {corretores.map((corretor: any) => (
                <option key={corretor.id} value={corretor.id}>{corretor.name}</option>
              ))}
            </select>
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
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Corretores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{corretores.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{allClientes.length}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vendas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalVendas)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
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
            <BarChart className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Performance por Corretor */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance por Corretor</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Corretor</th>
                <th className="text-left py-2 text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Clientes</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Vendas</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Valor Total</th>
                <th className="text-right py-2 text-gray-600 dark:text-gray-400">Agendamentos</th>
              </tr>
            </thead>
            <tbody>
              {relatoriosPorCorretor.map((rel, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 text-gray-900 dark:text-white">{rel.corretor}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">{rel.email}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{rel.totalClientes}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{rel.totalVendas}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{formatCurrency(rel.valorTotal)}</td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">{rel.totalAgendamentos}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
};

export default AdminRelatoriosModule;