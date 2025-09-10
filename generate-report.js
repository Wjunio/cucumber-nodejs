const report = require('multiple-cucumber-html-reporter');
const path = require('path');

report.generate({
  jsonDir: './reports',
  reportPath: './reports/html',
  theme: 'hierarchy',
  customCss: 'reports/html/assets/css/custom.css',
  reportName: 'Relatório de Testes Automatizados - API',
  pageTitle: 'Relatório de Testes',
  displayDuration: true,
  metadata: {
    browser: {
      name: 'chrome',
      version: '60'
    },
    device: 'Local test machine',
    platform: {
      name: 'windows',
      version: '10'
    }
  },
  customData: {
    title: 'Informações da Execução',
    data: [
      { label: 'Projeto', value: 'Qualquer Projeto - API Tests' },
      { label: 'Release', value: '1.2.3' },
      { label: 'Ciclo', value: 'B11221.34321' },
      { label: 'Início da Execução', value: new Date().toLocaleString() },
      { label: 'Fim da Execução', value: new Date().toLocaleString() }
    ]
  }
});
