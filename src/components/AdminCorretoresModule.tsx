import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, User } from 'lucide-react';

interface Corretor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  susep?: string;
  photo?: string;
  password: string;
  type: 'corretor';
}

const AdminCorretoresModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    susep: '',
    photo: '',
    password: ''
  });

  const [corretores, setCorretores] = useState<Corretor[]>(() => {
    const saved = localStorage.getItem('corretor-pro-users');
    return saved ? JSON.parse(saved) : [];
  });

  const saveCorretores = (newCorretores: Corretor[]) => {
    setCorretores(newCorretores);
    localStorage.setItem('corretor-pro-users', JSON.stringify(newCorretores));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = corretores.map(c => 
        c.id === editingId 
          ? { ...c, ...formData }
          : c
      );
      saveCorretores(updated);
    } else {
      const newCorretor: Corretor = {
        ...formData,
        id: Date.now().toString(),
        type: 'corretor'
      };
      saveCorretores([...corretores, newCorretor]);
    }

    setFormData({ name: '', email: '', phone: '', address: '', susep: '', photo: '', password: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (corretor: Corretor) => {
    setFormData({
      name: corretor.name,
      email: corretor.email,
      phone: corretor.phone || '',
      address: corretor.address || '',
      susep: corretor.susep || '',
      photo: corretor.photo || '',
      password: corretor.password
    });
    setEditingId(corretor.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este corretor?')) {
      const updated = corretores.filter(c => c.id !== id);
      saveCorretores(updated);
    }
  };

  const resetPassword = (id: string) => {
    const newPassword = prompt('Digite a nova senha:');
    if (newPassword) {
      const updated = corretores.map(c => 
        c.id === id 
          ? { ...c, password: newPassword }
          : c
      );
      saveCorretores(updated);
      alert('Senha alterada com sucesso!');
    }
  };

  const filteredCorretores = corretores.filter(corretor =>
    corretor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corretor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Corretores</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Corretor
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Editar Corretor' : 'Novo Corretor'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Endereço"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="SUSEP (opcional)"
                value={formData.susep}
                onChange={(e) => setFormData({...formData, susep: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="url"
                placeholder="URL da foto (opcional)"
                value={formData.photo}
                onChange={(e) => setFormData({...formData, photo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                    setFormData({ name: '', email: '', phone: '', address: '', susep: '', photo: '', password: '' });
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

      {/* Corretores List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCorretores.map(corretor => (
          <div key={corretor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {corretor.photo ? (
                  <img
                    src={corretor.photo}
                    alt={corretor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{corretor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{corretor.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(corretor)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(corretor.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              {corretor.phone && (
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Telefone:</strong> {corretor.phone}
                </p>
              )}
              {corretor.address && (
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Endereço:</strong> {corretor.address}
                </p>
              )}
              {corretor.susep && (
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>SUSEP:</strong> {corretor.susep}
                </p>
              )}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Senha:</span>
                  <button
                    onClick={() => setShowPassword(showPassword === corretor.id ? null : corretor.id)}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword === corretor.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => resetPassword(corretor.id)}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  Alterar Senha
                </button>
              </div>
              {showPassword === corretor.id && (
                <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {corretor.password}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCorretores.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Nenhum corretor encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCorretoresModule;