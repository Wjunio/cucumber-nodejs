#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Criando estrutura de testes Cucumber com JSON...\n');

// Configuração do projeto
const projectName = process.argv[2] || 'meu-projeto-teste';
const currentDir = process.cwd();
const projectPath = path.join(currentDir, projectName);

// Criar pasta do projeto
if (!fs.existsSync(projectPath)) {
  fs.mkdirSync(projectPath, { recursive: true });
  console.log(`✅ Pasta do projeto criada: ${projectPath}`);
} else {
  console.log(`⚠️  Pasta já existe: ${projectPath}`);
}

// Mudar para a pasta do projeto
process.chdir(projectPath);

// Criar package.json
const packageJson = {
  "name": projectName,
  "version": "1.0.0",
  "description": "Projeto de testes Cucumber com JSON",
  "main": "index.js",
  "scripts": {
    "test": "cucumber-js --format json:reports/report.json --format summary",
    "report": "node generate-report.js",
    "test:users": "cucumber-js --tags @users",
    "test:health": "cucumber-js --tags @health"
  },
  "keywords": ["cucumber", "testing", "api", "json"],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@cucumber/cucumber": "^11.3.0",
    "axios": "^1.10.0",
    "chai": "^5.2.0",
    "multiple-cucumber-html-reporter": "^3.9.3"
  }
};

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ package.json criado');

// Criar estrutura de pastas
const folders = [
  'features/rest/users',
  'features/step_definitions',
  'features/support',
  'cenarios/user',
  'reports/html'
];

folders.forEach(folder => {
  const folderPath = path.join(projectPath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Pasta criada: ${folder}`);
  }
});

// Criar arquivo de cenários JSON
const cenariosJson = {
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
    },
    "consultar_usuario_existente": {
      "descricao": "Consultar um usuário que existe",
      "metodo": "GET",
      "endpoint": "/users/1",
      "status_esperado": 200,
      "validacoes": [
        {
          "campo": "id",
          "valor": "1",
          "tipo": "int"
        },
        {
          "campo": "name",
          "tipo": "existe"
        }
      ]
    },
    "consultar_lista_usuarios": {
      "descricao": "Consultar lista de usuários",
      "metodo": "GET",
      "endpoint": "/users",
      "status_esperado": 200,
      "validacoes": [
        {
          "tipo": "lista",
          "minimo": 1
        }
      ]
    }
  }
};

fs.writeFileSync(
  path.join(projectPath, 'cenarios/user/cenarios_usuarios.json'),
  JSON.stringify(cenariosJson, null, 2)
);
console.log('✅ Arquivo de cenários JSON criado');

// Criar CenarioLoader
const cenarioLoaderContent = `const fs = require('fs');
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
    return \`\${urlBase}\${endpoint}\`;
  }

  validateCenario(nomeCenario) {
    const cenario = this.getCenario(nomeCenario);
    if (!cenario) {
      throw new Error(\`Cenário '\${nomeCenario}' não encontrado\`);
    }
    return cenario;
  }
}

module.exports = new CenarioLoader();
`;

fs.writeFileSync(
  path.join(projectPath, 'cenarios/user/cenarioLoader.js'),
  cenarioLoaderContent
);
console.log('✅ CenarioLoader criado');

// Criar steps
const stepsContent = `const { Before, Given, When, Then } = require('@cucumber/cucumber');
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
    const url = \`\${urlBase}/users/1\`;
    const response = await axios.get(url, { timeout });
    expect(response.status).to.equal(200);
    console.log(\`✅ API está disponível e respondendo: \${urlBase}\`);
  } catch (error) {
    console.error('❌ API não está disponível:', error.message);
    throw new Error(\`API não está disponível: \${error.message}\`);
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
        throw new Error(\`Tipo de validação não suportado: \${validacao.tipo}\`);
    }
  });
});

// Steps tradicionais
When('eu faço uma requisição GET para {string}', async function (endpoint) {
  const urlBase = cenarioLoader.getUrlBase();
  const url = \`\${urlBase}\${endpoint}\`;
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
`;

fs.writeFileSync(
  path.join(projectPath, 'features/step_definitions/api.steps.js'),
  stepsContent
);
console.log('✅ Steps criados');

// Criar features
const userCreationFeature = `Feature: Criação de Usuários
  Como um administrador do sistema, eu quero criar novos usuários
  para gerenciar a base de usuários da aplicação.

  Background:
    Given que a API está disponível

  @users @criar_usuario_sucesso
  Scenario: Criar um novo usuário com dados válidos
    When eu executo o cenário "criar_usuario_sucesso"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar
`;

fs.writeFileSync(
  path.join(projectPath, 'features/rest/users/user_creation.feature'),
  userCreationFeature
);

const userConsultationFeature = `Feature: Consulta de Usuários
  Como um usuário do sistema, eu quero consultar informações de usuários
  para obter dados específicos ou listar todos os usuários.

  Background:
    Given que a API está disponível

  @users @consultar_usuario_existente
  Scenario: Consultar um usuário que existe
    When eu executo o cenário "consultar_usuario_existente"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar

  @users @consultar_lista_usuarios
  Scenario: Consultar lista de usuários
    When eu executo o cenário "consultar_lista_usuarios"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar
`;

fs.writeFileSync(
  path.join(projectPath, 'features/rest/users/user_consultation.feature'),
  userConsultationFeature
);

const healthFeature = `Feature: Health Check da API
  Como um administrador do sistema, eu quero verificar se a API está disponível
  para garantir que os serviços estão funcionando corretamente.

  Background:
    Given que a API está disponível

  @health @health_check_basic
  Scenario: Verificar se a API está respondendo
    When eu faço uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And a resposta deve ser uma lista
`;

fs.writeFileSync(
  path.join(projectPath, 'features/rest/api_health.feature'),
  healthFeature
);

console.log('✅ Features criadas');

// Criar gerador de relatórios
const reportContent = `const report = require('multiple-cucumber-html-reporter');

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
      { label: 'Projeto', value: '${projectName}' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Ciclo', value: 'Smoke Test' },
      { label: 'Executado em', value: new Date().toLocaleString() }
    ]
  }
});
`;

fs.writeFileSync(
  path.join(projectPath, 'generate-report.js'),
  reportContent
);
console.log('✅ Gerador de relatórios criado');

// Criar README
const readmeContent = `# ${projectName}

Projeto de testes automatizados usando Cucumber com cenários JSON.

## 🚀 Como usar

### Instalar dependências
\`\`\`bash
npm install
\`\`\`

### Executar testes
\`\`\`bash
# Todos os testes
npm test

# Apenas testes de usuários
npm run test:users

# Apenas health checks
npm run test:health

# Gerar relatório HTML
npm run report
\`\`\`

### Estrutura do projeto
- \`features/\` - Arquivos .feature do Cucumber
- \`cenarios/\` - Cenários JSON organizados por recurso
- \`reports/\` - Relatórios de execução

### Adicionar novos cenários
1. Edite \`cenarios/user/cenarios_usuarios.json\`
2. Use na feature: \`When eu executo o cenário "nome_do_cenario"\`

## 📊 Relatórios
Após executar os testes, gere o relatório HTML:
\`\`\`bash
npm run report
\`\`\`

O relatório estará disponível em \`reports/html/index.html\`
`;

fs.writeFileSync(
  path.join(projectPath, 'README.md'),
  readmeContent
);
console.log('✅ README criado');

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
  console.log('⚠️  Erro ao instalar dependências. Execute manualmente: npm install');
}

console.log('\n🎉 Estrutura criada com sucesso!');
console.log(`📁 Projeto criado em: ${projectPath}`);
console.log('\n📋 Próximos passos:');
console.log('1. cd ' + projectName);
console.log('2. npm test');
console.log('3. npm run report');
console.log('\n📚 Consulte o README.md para mais informações!'); 