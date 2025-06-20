Feature: Consulta de Usuários
  Como um usuário do sistema, eu quero consultar informações de usuários
  para obter dados específicos ou listar todos os usuários.

  Background:
    Given que a API está disponível

  @consultar_usuario_por_id
  Scenario: Consultar um usuário específico por ID
    When eu executo o cenário "consultar_usuario_por_id"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar

  @consultar_usuario_inexistente
  Scenario: Tentar consultar um usuário que não existe
    When eu executo o cenário "consultar_usuario_inexistente"
    Then o status da resposta deve ser o esperado

  @listar_todos_usuarios
  Scenario: Listar todos os usuários
    When eu executo o cenário "listar_todos_usuarios"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar

  @consultar_usuario_por_username
  Scenario: Consultar usuário por username
    When eu executo o cenário "consultar_usuario_por_username"
    Then o status da resposta deve ser o esperado
    And todas as validações devem passar 