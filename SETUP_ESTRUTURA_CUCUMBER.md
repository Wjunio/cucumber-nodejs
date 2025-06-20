# 🥒 Guia de Setup - Estrutura Cucumber com JSON

Este guia te ensina como replicar a estrutura de testes Cucumber com cenários JSON em qualquer projeto.

## 📋 Pré-requisitos

- Node.js instalado
- npm ou yarn
- Projeto JavaScript/TypeScript

## 🚀 Passo a Passo

### 1. **Inicializar o projeto**

```bash
# Criar pasta do projeto
mkdir meu-projeto-teste
cd meu-projeto-teste

# Inicializar package.json
npm init -y
```

### 2. **Instalar dependências**

```bash
npm install --save-dev @cucumber/cucumber axios chai multiple-cucumber-html-reporter
```

### 3. **Configurar package.json**

```json
{
  "name": "meu-projeto-teste",
  "version": "1.0.0",
  "scripts": {
    "test": "cucumber-js --format json:reports/report.json --format summary",
    "report": "node generate-report.js"
  },
  "devDependencies": {
    "@cucumber/cucumber": "^11.3.0",
    "axios": "^1.10.0",
    "chai": "^5.2.0",
    "multiple-cucumber-html-reporter": "^3.9.3"
  }
}
```

### 4. **Criar estrutura de pastas**

```
meu-projeto-teste/
├── features/
│   ├── rest/
│   │   ├── users/
│   │   │   ├── user_creation.feature
│   │   │   ├── user_consultation.feature
│   │   │   ├── user_update.feature
│   │   │   └── user_deletion.feature
│   │   └── api_health.feature
│   ├── step_definitions/
│   │   └── api.steps.js
│   └── support/
├── cenarios/
│   └── user/
│       ├── cenarios_usuarios.json
│       ├── cenarioLoader.js
│       └── README.md
├── reports/
├── generate-report.js
└── package.json
```

### 5. **Criar arquivo de cenários JSON**

```json
// cenarios/user/cenarios_usuarios.json
{
  "config": {
    "urlBase": "https://jsonplaceholder.typicode.com",
    "timeout": 10000,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "cenarios": {
    "criar_usuario_sucesso": {
      "descricao": "Criar um novo usuário com dados válidos",
      "metodo": "POST",
      "endpoint": "/users",
      "dados": {
        "name": "João Silva",
        "username": "joao.silva",
        "email": "joao.silva@exemplo.com"
      },
      "status_esperado": 201,
      "validacoes": [
        {
          "campo": "name",
          "valor": "João Silva",
          "tipo": "string"
        }
      ]
    }
  }
}
```

### 6. **Criar o CenarioLoader**

```javascript
// cenarios/user/cenarioLoader.js
const fs = require('fs');
const path = require('path');

class CenarioLoader {
  constructor() {
    this.cenarios = {};
    this.config = {};
    this.loadCenarios();
  }

  loadCenarios() {
    try {
      const cenarioPath = path.join(__dirname, 'cenarios_usuarios.json');
      const cenarioData = fs.readFileSync(cenarioPath, 'utf8');
      const parsedData = JSON.parse(cenarioData);
      
      this.cenarios = parsedData.cenarios || {};
      this.config = parsedData.config || {};
    } catch (error) {
      console.error('Erro ao carregar cenários:', error.message);
      this.cenarios = {};
      this.config = {
        urlBase: 'https://jsonplaceholder.typicode.com',
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      };
    }
  }

  getCenario(nomeCenario) {
    return this.cenarios[nomeCenario];
  }

  getAllCenarios() {
    return this.cenarios;
  }

  getCenarioKeys() {
    return Object.keys(this.cenarios);
  }

  getConfig() {
    return this.config;
  }

  getUrlBase() {
    return this.config.urlBase || 'https://jsonplaceholder.typicode.com';
  }

  getTimeout() {
    return this.config.timeout || 10000;
  }

  getHeaders() {
    return this.config.headers || { 'Content-Type': 'application/json' };
  }

  buildUrl(endpoint) {
    const urlBase = this.getUrlBase();
    return `${urlBase}${endpoint}`;
  }

  validateCenario(nomeCenario) {
    const cenario = this.getCenario(nomeCenario);
    if (!cenario) {
      throw new Error(`Cenário '${nomeCenario}' não encontrado`);
    }
    return cenario;
  }
}

module.exports = new CenarioLoader();
```

### 7. **Criar os Steps**

```javascript
// features/step_definitions/api.steps.js
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

Then('o status da resposta deve ser o esperado', function () {
  expect(resposta.status).to.equal(cenarioAtual.status_esperado);
});

Then('todas as validações devem passar', function () {
  if (!cenarioAtual.validacoes) {
    return;
  }

  cenarioAtual.validacoes.forEach(validacao => {
    let data = resposta.data;
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

// Steps tradicionais
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

Then('o status da resposta deve ser {int}', function (statusEsperado) {
  expect(resposta.status).to.equal(statusEsperado);
});

Then('o campo {string} da resposta deve ser {string}', function (campo, valorEsperado) {
  expect(resposta.data[campo]).to.equal(valorEsperado);
});

Then('a resposta deve ser uma lista', function () {
  expect(Array.isArray(resposta.data)).to.be.true;
});
```

### 8. **Criar Features**

```gherkin
# features/rest/users/user_creation.feature
Feature: Criação de Usuários
  Como um administrador do sistema, eu quero criar novos usuários
  para gerenciar a base de usuários da aplicação.

  Background:
    Given que a API está disponível

  @criar_usuario_sucesso
  Scenario: Criar um novo usuário com dados válidos
    When eu executo o cenário "criar_usuario_sucesso"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar
```

```gherkin
# features/rest/api_health.feature
Feature: Health Check da API
  Como um administrador do sistema, eu quero verificar se a API está disponível
  para garantir que os serviços estão funcionando corretamente.

  Background:
    Given que a API está disponível

  @health_check_basic
  Scenario: Verificar se a API está respondendo
    When eu faço uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And a resposta deve ser uma lista
```

### 9. **Criar gerador de relatórios**

```javascript
// generate-report.js
const report = require('multiple-cucumber-html-reporter');

report.generate({
  jsonDir: './reports/',
  reportPath: './reports/html/',
  metadata: {
    browser: {
      name: 'chrome',
      version: '94'
    },
    device: 'Local test machine',
    platform: {
      name: 'windows',
      version: '10'
    }
  },
  customData: {
    title: 'Relatório de Testes API',
    data: [
      { label: 'Projeto', value: 'Meu Projeto Teste' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Ciclo', value: 'Smoke Test' },
      { label: 'Executado em', value: new Date().toLocaleString() }
    ]
  }
});
```

## 🎯 Como usar

### Executar testes
```bash
# Todos os testes
npm test

# Feature específica
npm test -- features/rest/users/user_creation.feature

# Por tag
npm test -- --tags @criar_usuario_sucesso

# Gerar relatório
npm run report
```

### Adicionar novos cenários
1. Adicione no JSON: `cenarios/user/cenarios_usuarios.json`
2. Use na feature: `When eu executo o cenário "nome_do_cenario"`
3. Valide: `Then o status da resposta deve ser o esperado`

### Mudar ambiente
Edite o `config` no JSON:
```json
{
  "config": {
    "urlBase": "https://sua-api-producao.com",
    "timeout": 15000,
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer seu-token"
    }
  }
}
```

## 📁 Estrutura final

```
meu-projeto-teste/
├── features/
│   ├── rest/
│   │   ├── users/
│   │   │   ├── user_creation.feature
│   │   │   ├── user_consultation.feature
│   │   │   ├── user_update.feature
│   │   │   └── user_deletion.feature
│   │   └── api_health.feature
│   ├── step_definitions/
│   │   └── api.steps.js
│   └── support/
├── cenarios/
│   └── user/
│       ├── cenarios_usuarios.json
│       ├── cenarioLoader.js
│       └── README.md
├── reports/
│   ├── html/
│   └── report.json
├── generate-report.js
├── package.json
└── SETUP_ESTRUTURA_CUCUMBER.md
```

## 🚀 Próximos passos

1. **Adapte para sua API** - Mude a URL base e endpoints
2. **Adicione autenticação** - Configure headers de auth
3. **Crie cenários específicos** - Para seus recursos
4. **Configure CI/CD** - Integre com GitHub Actions, Jenkins, etc.
5. **Adicione mais validações** - Campos específicos da sua API

## 💡 Dicas

- **Organize por recursos** - Cada recurso em uma pasta separada
- **Use tags** - Para executar grupos específicos de testes
- **Mantenha cenários simples** - Um cenário = um comportamento
- **Documente bem** - Descreva o que cada cenário testa
- **Use variáveis** - Para dados que mudam entre ambientes

---

**🎉 Existe o arquivo setup-estrutura.js na qual o comando node setup-estrutura.js meu-projeto-api, cria o projeto init!** 