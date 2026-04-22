import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [termo, setTermo] = useState('');
  const [livros, setLivros] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);

  // Monitora se a internet caiu ou voltou para o Modo Offline (RF-05 / RN-21)
  useEffect(() => {
    window.addEventListener('online', () => setOnline(true));
    window.addEventListener('offline', () => setOnline(false));
  }, []);

  // RF-02 / RNF-01: Busca Avançada com Resposta Instantânea
  const buscarLivros = async () => {
    if (!online) {
      alert("Sistema operando em modo offline. Consultas em tempo real indisponíveis.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/api/livros/busca?termo=${termo}`);
      setLivros(response.data);
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  };

  // RF-01: Atualização de estoque em tempo real
  const realizarVenda = async (isbn) => {
    if (!online) {
      // RN-21: Venda em modo offline com sincronização posterior
      const pendentes = JSON.parse(localStorage.getItem('vendas_offline') || '[]');
      pendentes.push({ isbn, qtd: 1, data: new Date() });
      localStorage.setItem('vendas_offline', JSON.stringify(pendentes));
      alert("Venda registrada no modo offline! Será sincronizada quando a conexão retornar.");
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/vendas', { isbn, qtd: 1 });
      alert("Venda concluída! Estoque atualizado no sistema central.");
      buscarLivros(); // Atualiza a lista instantaneamente
    } catch (error) {
      alert("Falha na venda: " + (error.response?.data?.error || "Erro de conexão"));
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f4f9', minHeight: '100vh', fontFamily: 'Segoe UI' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Rede de Livrarias LIVRO</h1>
        <p>Status da Conexão: <strong style={{ color: online ? '#27ae60' : '#e74c3c' }}>
          {online ? "● ONLINE" : "● OFFLINE (Modo Contingência)"}
        </strong></p>
      </header>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Busca por ISBN, Autor ou Título..." 
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          style={{ width: '400px', padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={buscarLivros} style={{ padding: '12px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Pesquisar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {livros.map(livro => (
          <div key={livro.isbn} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h3>{livro.titulo}</h3>
            <p><strong>Autor:</strong> {livro.autor}</p>
            <p><strong>ISBN:</strong> {livro.isbn}</p>
            <p><strong>Estoque:</strong> <span style={{ color: livro.quantidade < 5 ? '#e74c3c' : '#2c3e50' }}>{livro.quantidade}</span></p>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>R$ {livro.preco.toFixed(2)}</p>
            <button 
              onClick={() => realizarVenda(livro.isbn)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Vender Exemplar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;