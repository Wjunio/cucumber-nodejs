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

  @criar_usuario_dados_incompletos
  Scenario: Tentar criar usuário com dados incompletos
    When eu executo o cenário "criar_usuario_dados_incompletos"
    Then o status da resposta deve ser o esperado

  @criar_usuario_email_invalido
  Scenario: Tentar criar usuário com email inválido
    When eu executo o cenário "criar_usuario_email_invalido"
    Then o status da resposta deve ser o esperado 