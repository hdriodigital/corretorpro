import React, { useState } from 'react';
import { Send, Bell, Users, User } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const AdminNotificacoesModule = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    link: '',
    destinatario: 'todos' // 'todos' ou ID específico do corretor
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { addNotificacao } = useData();

  const corretores = JSON.parse(localStorage.getItem('corretor-pro-users') || '[]');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.destinatario === 'todos') {
        // Enviar para todos os corretores
        addNotificacao({
          titulo: formData.titulo,
          descricao: formData.descricao,
          link: formData.link || undefined
        });
      } else {
        // Enviar para corretor específico
        addNotificacao({
          titulo: formData.titulo,
          descricao: formData.descricao,
          link: formData.link || undefined,
          corretorId: formData.destinatario
        });
      }

      setFormData({ titulo: '', descricao: '', link: '', destinatario: 'todos' });
      alert('Notificação enviada com sucesso!');
    } catch (error) {
      alert('Erro ao enviar notificação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enviar Notificações</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="destinatario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destinatário
            </label>
            <select
              id="destinatario"
              value={formData.destinatario}
              onChange={(e) => setFormData({...formData, destinatario: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="todos">Todos os corretores</option>
              {corretores.map((corretor: any) => (
                <option key={corretor.id} value={corretor.id}>
                  {corretor.name} ({corretor.email})
                </option>
              ))}
            </select>
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              {formData.destinatario === 'todos' ? (
                <>
                  <Users className="w-4 h-4 mr-1" />
                  Será enviada para todos os {corretores.length} corretores
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-1" />
                  Será enviada para 1 corretor específico
                </>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título da Notificação
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              required
              placeholder="Ex: Nova atualização do sistema"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              required
              rows={4}
              placeholder="Descreva os detalhes da notificação..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link (Opcional)
            </label>
            <input
              type="url"
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              placeholder="https://exemplo.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Link opcional para mais informações ou ações relacionadas à notificação
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
          >
            <Send className="w-5 h-5 mr-2" />
            {isLoading ? 'Enviando...' : 'Enviar Notificação'}
          </button>
        </form>
      </div>

      {/* Exemplos de Notificações */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-3">Exemplos de Notificações</h3>
        <div className="space-y-3 text-sm">
          <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
            <p className="font-medium text-gray-900 dark:text-white">Nova funcionalidade disponível</p>
            <p className="text-gray-600 dark:text-gray-400">Agora você pode exportar relatórios em PDF. Acesse o módulo de relatórios para experimentar.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
            <p className="font-medium text-gray-900 dark:text-white">Manutenção programada</p>
            <p className="text-gray-600 dark:text-gray-400">O sistema ficará indisponível no domingo das 2h às 4h para manutenção. Planeje suas atividades.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
            <p className="font-medium text-gray-900 dark:text-white">Treinamento obrigatório</p>
            <p className="text-gray-600 dark:text-gray-400">Participe do treinamento sobre novas regulamentações da SUSEP. Clique no link para se inscrever.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificacoesModule;