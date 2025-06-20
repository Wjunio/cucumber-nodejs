const { Before, Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const cenarioLoader = require('../../cenarios/user/cenarioLoader');

let resposta;
let expect;
let cenarioAtual;
let tempoInicio;

Before(async function () {
  const chai = await import('chai');
  expect = chai.expect;
});

Given('que a API está disponível', async function () {
  try {
    const urlBase = cenarioLoader.getUrlBase();
    const timeout = cenarioLoader.getTimeout();
    const url = `${urlBase}/users/1`;
    const response = await axios.get(url, { timeout });
    expect(response.status).to.equal(200);
    console.log(`✅ API está disponível e respondendo: ${urlBase}`);
  } catch (error) {
    console.error('❌ API não está disponível:', error.message);
    throw new Error(`API não está disponível: ${error.message}`);
  }
});

Given('que um usuário foi excluído', async function () {
  try {
    const urlBase = cenarioLoader.getUrlBase();
    const url = `${urlBase}/users/999`;
    await axios.delete(url);
    console.log('🗑️ Usuário de teste excluído (simulado)');
  } catch (error) {
    // Se falhar, não é problema - é apenas para simular o setup
    console.log('ℹ️ Setup de exclusão de usuário concluído');
  }
});

// Step para executar um cenário específico do JSON
When('eu executo o cenário {string}', async function (nomeCenario) {
  cenarioAtual = cenarioLoader.validateCenario(nomeCenario);
  
  const url = cenarioLoader.buildUrl(cenarioAtual.endpoint);
  const metodo = cenarioAtual.metodo.toLowerCase();
  const timeout = cenarioLoader.getTimeout();
  const headers = cenarioLoader.getHeaders();
  
  try {
    if (cenarioAtual.dados) {
      resposta = await axios[metodo](url, cenarioAtual.dados, { timeout, headers });
    } else {
      resposta = await axios[metodo](url, { timeout, headers });
    }
  } catch (error) {
    resposta = error.response;
  }
});

// Steps tradicionais mantidos para compatibilidade
When('eu faço uma requisição GET para {string}', async function (endpoint) {
  const urlBase = cenarioLoader.getUrlBase();
  const url = `${urlBase}${endpoint}`;
  const timeout = cenarioLoader.getTimeout();
  const headers = cenarioLoader.getHeaders();
  
  try {
    resposta = await axios.get(url, { timeout, headers });
  } catch (error) {
    resposta = error.response;
  }
});

When('eu faço uma requisição GET para {string} com timeout de {int} segundos', async function (endpoint, timeout) {
  tempoInicio = Date.now();
  const urlBase = cenarioLoader.getUrlBase();
  const url = `${urlBase}${endpoint}`;
  const headers = cenarioLoader.getHeaders();
  
  try {
    resposta = await axios.get(url, { timeout: timeout * 1000, headers });
  } catch (error) {
    resposta = error.response;
  }
});

When('eu faço uma requisição POST para {string} com os dados:', async function (endpoint, dadosString) {
  const urlBase = cenarioLoader.getUrlBase();
  const url = `${urlBase}${endpoint}`;
  const dados = JSON.parse(dadosString);
  const timeout = cenarioLoader.getTimeout();
  const headers = cenarioLoader.getHeaders();
  
  try {
    resposta = await axios.post(url, dados, { timeout, headers });
  } catch (error) {
    resposta = error.response;
  }
});

When('eu faço uma requisição PUT para {string} com os dados:', async function (endpoint, dadosString) {
  const urlBase = cenarioLoader.getUrlBase();
  const url = `${urlBase}${endpoint}`;
  const dados = JSON.parse(dadosString);
  const timeout = cenarioLoader.getTimeout();
  const headers = cenarioLoader.getHeaders();
  
  try {
    resposta = await axios.put(url, dados, { timeout, headers });
  } catch (error) {
    resposta = error.response;
  }
});

When('eu faço uma requisição PATCH para {string} com os dados:', async function (endpoint, dadosString) {
  const urlBase = cenarioLoader.getUrlBase();
  const url = `${urlBase}${endpoint}`;
  const dados = JSON.parse(dadosString);
  const timeout = cenarioLoader.getTimeout();
  const headers = cenarioLoader.getHeaders();
  
  try {
    resposta = await axios.patch(url, dados, { timeout, headers });
  } catch (error) {
    resposta = error.response;
  }
});

When('eu faço uma requisição DELETE para {string}', async function (endpoint) {
  const urlBase = cenarioLoader.getUrlBase();
  const url = `${urlBase}${endpoint}`;
  const timeout = cenarioLoader.getTimeout();
  const headers = cenarioLoader.getHeaders();
  
  try {
    resposta = await axios.delete(url, { timeout, headers });
  } catch (error) {
    resposta = error.response;
  }
});

// Steps para validação baseada no JSON
Then('o status da resposta deve ser o esperado', function () {
  console.log('[DEBUG FINAL] resposta.status:', resposta.status, '| status_esperado:', cenarioAtual.status_esperado);
  expect(resposta.status).to.equal(cenarioAtual.status_esperado);
});

Then('todas as validações devem passar', function () {
  if (!cenarioAtual.validacoes) {
    return; // Se não há validações, considera que passou
  }

  cenarioAtual.validacoes.forEach(validacao => {
    let data = resposta.data;
    // Se a validação pede para olhar na lista, pega o primeiro item
    if (validacao.na_lista && Array.isArray(data)) {
      data = data[0];
    }
    switch (validacao.tipo) {
      case 'string':
        expect(data[validacao.campo]).to.equal(validacao.valor);
        break;
      case 'int':
        expect(data[validacao.campo]).to.equal(parseInt(validacao.valor));
        break;
      case 'existe':
        expect(data).to.have.property(validacao.campo);
        break;
      case 'lista':
        expect(Array.isArray(data)).to.be.true;
        if (validacao.minimo) {
          expect(data.length).to.be.at.least(validacao.minimo);
        }
        break;
      default:
        throw new Error(`Tipo de validação não suportado: ${validacao.tipo}`);
    }
  });
});

// Steps tradicionais mantidos para compatibilidade
Then('o status da resposta deve ser {int}', function (statusEsperado) {
  expect(resposta.status).to.equal(statusEsperado);
});

Then('o campo {string} da resposta deve ser {string}', function (campo, valorEsperado) {
  expect(resposta.data[campo]).to.equal(valorEsperado);
});

Then('o campo {string} da resposta deve ser {int}', function (campo, valorEsperado) {
  expect(resposta.data[campo]).to.equal(valorEsperado);
});

Then('o campo {string} da resposta deve existir', function (campo) {
  expect(resposta.data).to.have.property(campo);
});

Then('a resposta deve ser uma lista', function () {
  expect(Array.isArray(resposta.data)).to.be.true;
});

Then('a lista deve conter pelo menos {int} usuário', function (quantidade) {
  expect(resposta.data.length).to.be.at.least(quantidade);
});

// Novos steps para health check
Then('a resposta deve ser recebida em menos de {int} segundos', function (tempoMaximo) {
  const tempoDecorrido = (Date.now() - tempoInicio) / 1000;
  expect(tempoDecorrido).to.be.lessThan(tempoMaximo);
  console.log(`⏱️ Tempo de resposta: ${tempoDecorrido.toFixed(2)}s`);
});

Then('a resposta deve conter os campos obrigatórios', function () {
  const camposObrigatorios = ['id', 'name', 'username', 'email'];
  camposObrigatorios.forEach(campo => {
    expect(resposta.data).to.have.property(campo);
  });
  console.log('✅ Todos os campos obrigatórios estão presentes');
});
