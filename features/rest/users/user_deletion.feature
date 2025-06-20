Feature: Exclusão de Usuários
  Como um administrador do sistema, eu quero excluir usuários
  para gerenciar a base de dados de usuários.

  Background:
    Given que a API está disponível

  @excluir_usuario_sucesso
  Scenario: Excluir um usuário existente
    When eu executo o cenário "excluir_usuario_sucesso"
    Then o status da resposta deve ser o esperado

  @excluir_usuario_inexistente
  Scenario: Tentar excluir um usuário que não existe
    When eu executo o cenário "excluir_usuario_inexistente"
    Then o status da resposta deve ser o esperado

  @verificar_usuario_excluido
  Scenario: Verificar que o usuário foi realmente excluído
    Given que um usuário foi excluído
    When eu faço uma requisição GET para "/users/1"
    Then o status da resposta deve ser 200 