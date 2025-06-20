Feature: Health Check da API
  Como um administrador do sistema, eu quero verificar se a API está disponível
  para garantir que os serviços estão funcionando corretamente.

  Background:
    Given que a API está disponível

  @health_check_basic
  Scenario: Verificar se a API está respondendo
    When eu faço uma requisição GET para "/"
    Then o status da resposta deve ser 200

  @health_check_users_endpoint
  Scenario: Verificar se o endpoint de usuários está disponível
    When eu faço uma requisição GET para "/users"
    Then o status da resposta deve ser 200
    And a resposta deve ser uma lista

  @health_check_specific_user
  Scenario: Verificar se é possível consultar um usuário específico
    When eu faço uma requisição GET para "/users/1"
    Then o status da resposta deve ser 200
    And o campo "id" da resposta deve ser 1
    And o campo "name" da resposta deve existir

  @health_check_response_time
  Scenario: Verificar tempo de resposta da API
    When eu faço uma requisição GET para "/users" com timeout de 5 segundos
    Then o status da resposta deve ser 200
    And a resposta deve ser recebida em menos de 5 segundos

  @health_check_api_structure
  Scenario: Verificar estrutura da resposta da API
    When eu faço uma requisição GET para "/users/1"
    Then o status da resposta deve ser 200
    And a resposta deve conter os campos obrigatórios 