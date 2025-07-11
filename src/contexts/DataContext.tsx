import React, { createContext, useContext, useState, useEffect } from 'react';

interface Cliente {
  id: string;
  nome: string;
  endereco: string;
  email: string;
  telefone: string;
  tipoPlano: string;
  corretorId: string;
  dataCadastro: string;
}

interface Agendamento {
  id: string;
  clienteId: string;
  cliente: string;
  data: string;
  hora: string;
  tipo: string;
  corretorId: string;
  status: string;
}

interface Venda {
  id: string;
  clienteId: string;
  cliente: string;
  tipoPlano: string;
  dataVenda: string;
  valor: number;
  status: string;
  corretorId: string;
}

interface Cotacao {
  id: string;
  cliente: string;
  dataCotacao: string;
  protocolo: string;
  link: string;
  valor: number;
  validade: string;
  status: string;
  corretorId: string;
}

interface LinkUtil {
  id: string;
  titulo: string;
  url: string;
  corretorId: string;
}

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  link?: string;
  data: string;
  lida: boolean;
  corretorId?: string;
}

interface DataContextType {
  clientes: Cliente[];
  agendamentos: Agendamento[];
  vendas: Venda[];
  cotacoes: Cotacao[];
  linksUteis: LinkUtil[];
  notificacoes: Notificacao[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => void;
  addAgendamento: (agendamento: Omit<Agendamento, 'id'>) => void;
  addVenda: (venda: Omit<Venda, 'id'>) => void;
  addCotacao: (cotacao: Omit<Cotacao, 'id'>) => void;
  addLinkUtil: (link: Omit<LinkUtil, 'id'>) => void;
  addNotificacao: (notificacao: Omit<Notificacao, 'id' | 'data' | 'lida'>) => void;
  updateNotificacao: (id: string, updates: Partial<Notificacao>) => void;
  deleteItem: (collection: string, id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [linksUteis, setLinksUteis] = useState<LinkUtil[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    // Carregar dados do localStorage
    const loadData = (key: string) => {
      const saved = localStorage.getItem(`corretor-pro-${key}`);
      return saved ? JSON.parse(saved) : [];
    };

    setClientes(loadData('clientes'));
    setAgendamentos(loadData('agendamentos'));
    setVendas(loadData('vendas'));
    setCotacoes(loadData('cotacoes'));
    setLinksUteis(loadData('links'));
    setNotificacoes(loadData('notificacoes'));
  }, []);

  const saveData = (key: string, data: any) => {
    localStorage.setItem(`corretor-pro-${key}`, JSON.stringify(data));
  };

  const addCliente = (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    const newCliente = {
      ...cliente,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString()
    };
    const updated = [...clientes, newCliente];
    setClientes(updated);
    saveData('clientes', updated);
  };

  const addAgendamento = (agendamento: Omit<Agendamento, 'id'>) => {
    const newAgendamento = {
      ...agendamento,
      id: Date.now().toString(),
      status: 'Agendado'
    };
    const updated = [...agendamentos, newAgendamento];
    setAgendamentos(updated);
    saveData('agendamentos', updated);
  };

  const addVenda = (venda: Omit<Venda, 'id'>) => {
    const newVenda = {
      ...venda,
      id: Date.now().toString()
    };
    const updated = [...vendas, newVenda];
    setVendas(updated);
    saveData('vendas', updated);
  };

  const addCotacao = (cotacao: Omit<Cotacao, 'id'>) => {
    const newCotacao = {
      ...cotacao,
      id: Date.now().toString()
    };
    const updated = [...cotacoes, newCotacao];
    setCotacoes(updated);
    saveData('cotacoes', updated);
  };

  const addLinkUtil = (link: Omit<LinkUtil, 'id'>) => {
    const newLink = {
      ...link,
      id: Date.now().toString()
    };
    const updated = [...linksUteis, newLink];
    setLinksUteis(updated);
    saveData('links', updated);
  };

  const addNotificacao = (notificacao: Omit<Notificacao, 'id' | 'data' | 'lida'>) => {
    const newNotificacao = {
      ...notificacao,
      id: Date.now().toString(),
      data: new Date().toISOString(),
      lida: false
    };
    const updated = [...notificacoes, newNotificacao];
    setNotificacoes(updated);
    saveData('notificacoes', updated);
  };

  const updateNotificacao = (id: string, updates: Partial<Notificacao>) => {
    const updated = notificacoes.map(n => n.id === id ? { ...n, ...updates } : n);
    setNotificacoes(updated);
    saveData('notificacoes', updated);
  };

  const deleteItem = (collection: string, id: string) => {
    switch (collection) {
      case 'clientes':
        const updatedClientes = clientes.filter(c => c.id !== id);
        setClientes(updatedClientes);
        saveData('clientes', updatedClientes);
        break;
      case 'agendamentos':
        const updatedAgendamentos = agendamentos.filter(a => a.id !== id);
        setAgendamentos(updatedAgendamentos);
        saveData('agendamentos', updatedAgendamentos);
        break;
      case 'vendas':
        const updatedVendas = vendas.filter(v => v.id !== id);
        setVendas(updatedVendas);
        saveData('vendas', updatedVendas);
        break;
      case 'cotacoes':
        const updatedCotacoes = cotacoes.filter(c => c.id !== id);
        setCotacoes(updatedCotacoes);
        saveData('cotacoes', updatedCotacoes);
        break;
      case 'links':
        const updatedLinks = linksUteis.filter(l => l.id !== id);
        setLinksUteis(updatedLinks);
        saveData('links', updatedLinks);
        break;
    }
  };

  return (
    <DataContext.Provider value={{
      clientes,
      agendamentos,
      vendas,
      cotacoes,
      linksUteis,
      notificacoes,
      addCliente,
      addAgendamento,
      addVenda,
      addCotacao,
      addLinkUtil,
      addNotificacao,
      updateNotificacao,
      deleteItem
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider');
  }
  return context;
};