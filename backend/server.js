const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

// Banco de dados em arquivo local (Livraria LIVRO)
const db = new sqlite3.Database('./livraria.db');

db.serialize(() => {
    // Tabela de Livros (ISBN, Autor, Gênero) [cite: 16]
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        isbn TEXT PRIMARY KEY,
        titulo TEXT,
        autor TEXT,
        genero TEXT,
        preco REAL,
        estoque_critico INTEGER DEFAULT 5
    )`);

    // Tabela de Estoque 
    db.run(`CREATE TABLE IF NOT EXISTS estoque (
        isbn TEXT,
        quantidade INTEGER,
        FOREIGN KEY(isbn) REFERENCES livros(isbn)
    )`);

    // Inserindo alguns dados iniciais para teste
    db.get("SELECT count(*) as count FROM livros", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO livros VALUES ('97801', 'O Programador Pragmático', 'Andrew Hunt', 'Tecnologia', 95.0, 5)`);
            db.run(`INSERT INTO estoque VALUES ('97801', 10)`);
        }
    });
});

// RF-02: Busca Avançada Instantânea [cite: 16]
app.get('/api/livros/busca', (req, res) => {
    const { termo } = req.query;
    const sql = `SELECT l.*, e.quantidade FROM livros l 
                 JOIN estoque e ON l.isbn = e.isbn 
                 WHERE l.titulo LIKE ? OR l.autor LIKE ? OR l.isbn = ?`;
    db.all(sql, [`%${termo}%`, `%${termo}%`, termo], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// RF-01 e RN-02: Venda com atualização de estoque e reposição automática [cite: 15, 17]
app.post('/api/vendas', (req, res) => {
    const { isbn, qtd } = req.body;
    
    db.get('SELECT e.quantidade, l.estoque_critico FROM estoque e JOIN livros l ON e.isbn = l.isbn WHERE e.isbn = ?', [isbn], (err, row) => {
        if (row && row.quantidade >= qtd) {
            const novaQtd = row.quantidade - qtd;
            db.run('UPDATE estoque SET quantidade = ? WHERE isbn = ?', [novaQtd, isbn], () => {
                
                // Lógica de Reposição Automática (RN-02) 
                if (novaQtd <= row.estoque_critico) {
                    console.log(`[LOGÍSTICA] Gerando ordem de compra automática para ISBN: ${isbn}`);
                }
                
                res.json({ status: "Sucesso", estoque_atual: novaQtd });
            });
        } else {
            res.status(400).json({ error: "Estoque insuficiente" });
        }
    });
});

app.listen(3001, () => console.log('Servidor da Livraria rodando na porta 3001'));