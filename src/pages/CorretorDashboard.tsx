import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Calculator, 
  Link, 
  Bell, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import ClientesModule from '../components/ClientesModule';
import AgendamentosModule from '../components/AgendamentosModule';
import VendasModule from '../components/VendasModule';
import RelatoriosModule from '../components/RelatoriosModule';
import CotacoesModule from '../components/CotacoesModule';
import LinksModule from '../components/LinksModule';
import NotificacoesModule from '../components/NotificacoesModule';
import PerfilModule from '../components/PerfilModule';

const CorretorDashboard = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { clientes, agendamentos, vendas, cotacoes, notificacoes } = useData();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
    { id: 'vendas', label: 'Vendas', icon: TrendingUp },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'cotacoes', label: 'Cotações', icon: Calculator },
    { id: 'links', label: 'Links Úteis', icon: Link },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'perfil', label: 'Perfil', icon: Users },
  ];

  const userClientes = clientes.filter(c => c.corretorId === user?.id);
  const userAgendamentos = agendamentos.filter(a => a.corretorId === user?.id);
  const userVendas = vendas.filter(v => v.corretorId === user?.id);
  const userCotacoes = cotacoes.filter(c => c.corretorId === user?.id);
  const userNotificacoes = notificacoes.filter(n => !n.corretorId || n.corretorId === user?.id);

  const renderContent = () => {
    switch (activeModule) {
      case 'clientes':
        return <ClientesModule />;
      case 'agendamentos':
        return <AgendamentosModule />;
      case 'vendas':
        return <VendasModule />;
      case 'relatorios':
        return <RelatoriosModule />;
      case 'cotacoes':
        return <CotacoesModule />;
      case 'links':
        return <LinksModule />;
      case 'notificacoes':
        return <NotificacoesModule />;
      case 'perfil':
        return <PerfilModule />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bem-vindo, {user?.name}!
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userClientes.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Agendamentos</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userAgendamentos.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendas</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userVendas.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cotações</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userCotacoes.length}</p>
                  </div>
                  <Calculator className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Últimos Clientes</h3>
                <div className="space-y-3">
                  {userClientes.slice(0, 5).map(cliente => (
                    <div key={cliente.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cliente.nome}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cliente.tipoPlano}</p>
                      </div>
                      <a
                        href={`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Próximos Agendamentos</h3>
                <div className="space-y-3">
                  {userAgendamentos.slice(0, 5).map(agendamento => (
                    <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{agendamento.cliente}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{agendamento.tipo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{agendamento.data}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{agendamento.hora}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">CorretorPro</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 mb-2 ${
                activeModule === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
              {item.id === 'notificacoes' && userNotificacoes.filter(n => !n.lida).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {userNotificacoes.filter(n => !n.lida).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleTheme}
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
              {isDark ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {menuItems.find(item => item.id === activeModule)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CorretorDashboard;