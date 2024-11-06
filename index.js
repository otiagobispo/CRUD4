const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear o corpo das requisições em JSON
app.use(express.json());

// Banco de dados em memória (simulação)
let produtos = [];

// Função para gerar IDs únicos para os produtos
const gerarId = () => produtos.length ? produtos[produtos.length - 1].id + 1 : 1;

// POST: Criar um novo produto
app.post('/produtos', (req, res) => {
    const { nome, quantidade, preco } = req.body;

    if (!nome || !quantidade || !preco) {
        return res.status(400).json({ erro: 'Nome, quantidade e preço são obrigatórios' });
    }

    const novoProduto = {
        id: gerarId(),
        nome,
        quantidade,
        preco
    };

    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

// GET: Buscar todos os produtos
app.get('/produtos', (req, res) => {
    res.status(200).json(produtos);
});

// GET: Buscar um produto por ID
app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const produto = produtos.find(p => p.id == id);

    if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.status(200).json(produto);
});

// PUT: Atualizar um produto existente
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, quantidade, preco } = req.body;

    let produto = produtos.find(p => p.id == id);

    if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    if (nome) produto.nome = nome;
    if (quantidade) produto.quantidade = quantidade;
    if (preco) produto.preco = preco;

    res.status(200).json(produto);
});

// DELETE: Remover um produto
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const index = produtos.findIndex(p => p.id == id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    produtos.splice(index, 1);
    res.status(204).send(); // Sucesso sem conteúdo
});
// Rota para gerar o Relatório de Estoque
app.get('/relatorio', (req, res) => {
    // Número total de produtos no estoque
    const numeroTotalDeProdutos = produtos.length;

    // Valor total do estoque (quantidade * preço para cada produto)
    const valorTotalDoEstoque = produtos.reduce((acc, produto) => {
        return acc + (produto.quantidade * produto.preco);  // Soma quantidade * preço
    }, 0);  // Começa a soma de 0

    // Retorna o relatório com as informações calculadas
    res.status(200).json({
        numeroTotalDeProdutos,  // Número de produtos no estoque
        valorTotalDoEstoque     // Valor total do estoque
    });
});

// Rota para buscar produtos por nome
app.get('/produto/buscar', (req, res) => {
    // Obtém o nome do produto da query string
    const nome = req.query.nome;

    // Verifica se o parâmetro 'nome' foi fornecido na query string
    if (!nome) {
        return res.status(400).json({ erro: 'O parâmetro "nome" é obrigatório na query string.' });
    }

    // Filtra os produtos que contêm o nome informado (ignorando maiúsculas/minúsculas)
    const produtosEncontrados = produtos.filter(produto => {
        return produto.nome.toLowerCase().includes(nome.toLowerCase());
    });

    // Se não encontrar nenhum produto
    if (produtosEncontrados.length === 0) {
        return res.status(404).json({ mensagem: 'Nenhum produto encontrado com esse nome.' });
    }

    // Retorna os produtos encontrados
    res.status(200).json(produtosEncontrados);
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
