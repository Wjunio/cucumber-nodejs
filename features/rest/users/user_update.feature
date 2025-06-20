Feature: Atualização de Usuários
  Como um administrador do sistema, eu quero atualizar informações de usuários
  para manter os dados sempre atualizados.

  Background:
    Given que a API está disponível

  @atualizar_usuario_sucesso
  Scenario: Atualizar os dados de um usuário existente
    When eu executo o cenário "atualizar_usuario_sucesso"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar

  @atualizar_usuario_parcial
  Scenario: Atualizar apenas alguns campos do usuário
    When eu executo o cenário "atualizar_usuario_parcial"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar

  @atualizar_usuario_inexistente
  Scenario: Tentar atualizar um usuário que não existe
    When eu executo o cenário "atualizar_usuario_inexistente"
    Then o status da resposta deve ser o esperado

  @atualizar_usuario_dados_invalidos
  Scenario: Tentar atualizar usuário com dados inválidos
    When eu executo o cenário "atualizar_usuario_dados_invalidos"
    Then o status da resposta deve ser o esperado 