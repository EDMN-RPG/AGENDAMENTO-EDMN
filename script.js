// ====== DJ EDMN - Sistema de Agendamento e Avaliações ======

// Função para mostrar a seção selecionada (aba)
// Recebe o ID da seção a ser ativada e oculta as demais
function mostrarSecao(secao) {
  // Seleciona todas as seções
  const secoes = document.querySelectorAll('section');

  // Loop para remover a classe 'active' de todas as seções
  secoes.forEach(sec => {
    sec.classList.remove('active');
  });

  // Adiciona a classe 'active' somente na seção escolhida
  const ativa = document.getElementById(secao);
  if (ativa) ativa.classList.add('active');
}

// ====== VALIDAÇÃO DE FORMULÁRIO DE AGENDAMENTO ======

// Função para validar se um email é válido (simples regex)
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função para validar se a data é futura
function validarDataFutura(dataString) {
  const hoje = new Date();
  const dataInput = new Date(dataString + "T00:00:00");
  return dataInput >= hoje;
}

// Função para validar formulário antes do envio
function validarFormulario() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const local = document.getElementById('local').value.trim();
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const tipo = document.getElementById('tipo').value;

  if (!nome) {
    alert('Por favor, preencha o nome ou nome do evento.');
    return false;
  }

  if (!email || !validarEmail(email)) {
    alert('Por favor, preencha um e-mail válido.');
    return false;
  }

  if (!local) {
    alert('Por favor, preencha o local do evento.');
    return false;
  }

  if (!data || !validarDataFutura(data)) {
    alert('Por favor, selecione uma data válida (hoje ou futura).');
    return false;
  }

  if (!hora) {
    alert('Por favor, selecione a hora do evento.');
    return false;
  }

  if (!tipo) {
    alert('Por favor, selecione o tipo de evento.');
    return false;
  }

  return true;
}

// ====== DADOS DE EVENTOS ======

// Função para obter o valor do evento baseado no tipo
function getValorEvento(tipo) {
  switch (tipo) {
    case 'Festa': return 350;
    case 'Festival': return 700;
    case 'Show Privado': return 500;
    case 'Outro': return 300;
    default: return 0;
  }
}

// ====== LOCAL STORAGE: SALVANDO AGENDAMENTOS DA PESSOA ======

// Função para salvar agendamento localmente (por usuário, em localStorage)
function salvarAgendamento(agendamento) {
  // Pega lista do localStorage
  let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

  // Adiciona o novo agendamento
  agendamentos.push(agendamento);

  // Salva de volta
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

// Função para buscar agendamentos do usuário (do localStorage)
function buscarAgendamentos() {
  return JSON.parse(localStorage.getItem('agendamentos')) || [];
}

// ====== FUNÇÃO PRINCIPAL: ENVIO DO AGENDAMENTO ======

function enviarAgendamento() {
  if (!validarFormulario()) return;

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const local = document.getElementById('local').value.trim();
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const tipo = document.getElementById('tipo').value;
  const mensagem = document.getElementById('mensagem').value.trim();
  const valor = getValorEvento(tipo);

  // Criar objeto agendamento para salvar localmente
  const agendamento = {
    nome,
    email,
    local,
    data,
    hora,
    tipo,
    mensagem,
    valor,
    id: Date.now() // ID único timestamp
  };

  // Salvar no localStorage
  salvarAgendamento(agendamento);

  // Mostrar mensagem de sucesso
  document.getElementById('msg-agendamento').textContent = '✅ Seu agendamento foi salvo localmente!';

  // Atualizar lista de agendamentos visível
  atualizarListaAgendamentos();

  // Preparar texto para WhatsApp
  const texto = `🎧 *NOVO AGENDAMENTO*:\n\n👤 Nome/Evento: ${nome}\n📍 Local: ${local}\n📅 Data: ${data}\n⏰ Hora: ${hora}\n📀 Tipo: ${tipo}\n💰 Valor estimado: R$ ${valor}\n\n📝 Obs: ${mensagem}`;

  // Abrir WhatsApp numa nova aba para o contato com a mensagem pronta
  const link = `https://wa.me/5542999865245?text=${encodeURIComponent(texto)}`;
  window.open(link, '_blank');

  // Limpar formulário após enviar (opcional)
  limparFormulario();
}

// ====== LIMPAR FORMULÁRIO ======

function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('local').value = '';
  document.getElementById('data').value = '';
  document.getElementById('hora').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('mensagem').value = '';
}

// ====== ATUALIZAR LISTA DE AGENDAMENTOS DA PESSOA ======

function atualizarListaAgendamentos() {
  const lista = document.getElementById('lista-shows-agendados');
  if (!lista) return;

  // Limpa a lista
  lista.innerHTML = '';

  // Busca os agendamentos salvos
  const agendamentos = buscarAgendamentos();

  // Se não tiver nenhum agendamento
  if (agendamentos.length === 0) {
    lista.innerHTML = '<li>Você ainda não fez nenhum agendamento.</li>';
    return;
  }

  // Monta lista
  agendamentos.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.data} - ${item.local} - ${item.tipo} (R$ ${item.valor})`;
    lista.appendChild(li);
  });
}

// ====== DADOS DE AVALIAÇÕES FALSAS ======

const avaliacoesFalsas = [
  {
    nome: "Lucas Gamer",
    texto: "O show do EDMN foi surreal! Energia lá em cima, vibe perfeita e aquele batidão que só ele tem."
  },
  {
    nome: "Marina Beats",
    texto: "Adorei o set, as luzes verdes deram um toque especial, show 10/10!"
  },
  {
    nome: "Gui Zika",
    texto: "Recomendo muito para quem curte música eletrônica de verdade. EDMN no beat!"
  },
  {
    nome: "Ana Vibes",
    texto: "Espetáculo audiovisual! DJ mascarado com muita técnica e carisma."
  },
  {
    nome: "Pedro Sound",
    texto: "Show incrível, quero repetir logo! A vibe é única e contagiante."
  }
];

// ====== EXIBIR AVALIAÇÕES ======

function mostrarAvaliacoes() {
  const listaAvaliacoes = document.getElementById('avaliacoes-lista');
  if (!listaAvaliacoes) return;

  // Limpa lista antes de preencher
  listaAvaliacoes.innerHTML = '';

  // Adiciona cada avaliação falsa
  avaliacoesFalsas.forEach(av => {
    const li = document.createElement('li');

    // Nome do avaliador
    const nome = document.createElement('div');
    nome.className = 'avaliador-nome';
    nome.textContent = av.nome;

    // Texto da avaliação
    const texto = document.createElement('div');
    texto.className = 'avaliacao-texto';
    texto.textContent = `"${av.texto}"`;

    // Junta na li
    li.appendChild(nome);
    li.appendChild(texto);

    // Adiciona na lista
    listaAvaliacoes.appendChild(li);
  });
}

// ====== INICIALIZAÇÃO ======

// Função para rodar quando a página estiver pronta
function iniciar() {
  // Mostrar aba padrão
  mostrarSecao('agendamento');

  // Atualizar lista agendamentos locais
  atualizarListaAgendamentos();

  // Mostrar avaliações falsas
  mostrarAvaliacoes();

  // Adicionar evento para botões da nav para ativar abas
  const botoes = document.querySelectorAll('nav button');
  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const secao = botao.getAttribute('onclick').match(/'(.*?)'/)[1];
      mostrarSecao(secao);

      // Trocar botão ativo visualmente
      botoes.forEach(b => b.classList.remove('active'));
      botao.classList.add('active');
    });
  });

  // Deixar o primeiro botão ativo ao iniciar
  if (botoes.length > 0) botoes[0].classList.add('active');
}

// Esperar o DOM carregar antes de iniciar o script
document.addEventListener('DOMContentLoaded', iniciar);

// ====== EVENTOS EXTRA ======

// Exemplo: Somente permitir data futura no input data (reinforço)
const inputData = document.getElementById('data');
if (inputData) {
  const hojeISO = new Date().toISOString().split('T')[0];
  inputData.setAttribute('min', hojeISO);
}
