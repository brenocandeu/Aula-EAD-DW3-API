//@ Importa as bibliotecas
const express = require('express');
require('dotenv').config();

//@ Configura o servidor
const app = express();
const port = process.env.PORT;

app.use(express.json());

let salasDeAula = [
  {
    salasdeaulaid: 1,
    descricao: 'Laboratório D04',
    localizacao: 'Bloco D',
    capacidade: 20,
    removido: false,
  },
  {
    salasdeaulaid: 2,
    descricao: 'Laboratório D010',
    localizacao: 'Bloco D',
    capacidade: 25,
    removido: false,
  },
  {
    salasdeaulaid: 3,
    descricao: 'Auditório',
    localizacao: 'Bloco D',
    capacidade: 100,
    removido: true,
  },
];

// Rota inicial
app.get('/', (req, res) => {
  res.send('API de Salas de Aula está funcionando!');
});

//Salas ativas
app.get('/salas', (req, res) => {
  const salasAtivas = salasDeAula.filter((sala) => sala.removido === false);
  res.json(salasAtivas);
});

//Busca salas ativas pelo ID
app.get('/salas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sala = salasDeAula.find(
    (s) => s.salasdeaulaid === id && s.removido === false,
  );

  if (!sala) {
    return res.status(404).json({ message: 'Sala de aula não encontrada.' });
  }
  res.json(sala);
});

// [POST] Insere uma nova sala
app.post('/salas', (req, res) => {
  const novaSala = req.body;
  novaSala.salasdeaulaid = salasDeAula.length
    ? Math.max(...salasDeAula.map((s) => s.salasdeaulaid)) + 1
    : 1;
  novaSala.removido = false;

  salasDeAula.push(novaSala);
  res.status(201).json(novaSala);
});

// [PUT] Atualiza sala existente
app.put('/salas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = salasDeAula.findIndex(s => s.salasdeaulaid === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Sala de aula não encontrada.' });
    }

    salasDeAula[index] = { ...salasDeAula[index], ...req.body };
    res.json(salasDeAula[index]);
});

// [DELETE] Deleta uma sala
app.delete('/salas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = salasDeAula.findIndex(s => s.salasdeaulaid === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Sala de aula não encontrada.' });
    }

    salasDeAula[index].removido = true;
    res.status(200).json({ message: 'Sala de aula removida com sucesso.' });
});

app.listen(port, () => {
  console.log('Executando a aplicação ', process.env.APP_NAME);
  console.log(`Servidor rodando na porta ${port}`);
});
