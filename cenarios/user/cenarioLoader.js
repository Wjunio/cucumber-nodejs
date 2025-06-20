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
      
      // Log para depuração
      if (this.cenarios.consultar_usuario_inexistente) {
        console.log('[DEBUG] status_esperado consultar_usuario_inexistente:', this.cenarios.consultar_usuario_inexistente.status_esperado);
      }
    } catch (error) {
      console.error('Erro ao carregar cenários:', error.message);
      this.cenarios = { cenarios: {} };
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