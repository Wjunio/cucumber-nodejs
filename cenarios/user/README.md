# Estrutura de Cenários JSON

Esta pasta contém os cenários de teste organizados em formato JSON para facilitar a manutenção e reutilização.

## Estrutura dos Arquivos

- `cenarios_usuarios.json` - Contém todos os cenários de teste para usuários
- `cenarioLoader.js` - Utilitário para carregar e gerenciar os cenários
- `README.md` - Esta documentação

## Formato do JSON

O arquivo JSON agora possui uma estrutura melhorada com configuração centralizada:

```json
{
  "config": {
    "urlBase": "https://jsonplaceholder.typicode.com",
    "timeout": 10000,
    "headers": {
      "Content-Type": "application/json"
    }
  },
  "cenarios": {
    "nome_do_cenario": {
      "descricao": "Descrição do que o cenário testa",
      "metodo": "GET|POST|PUT|PATCH|DELETE",
      "endpoint": "/caminho/do/endpoint",
      "dados": {
        // Dados para enviar na requisição (opcional)
      },
      "status_esperado": 200,
      "validacoes": [
        {
          "campo": "nome_do_campo",
          "valor": "valor_esperado",
          "tipo": "string|int|existe|lista"
        }
      ]
    }
  }
}
```

## Configuração

### URL Base
- `urlBase`: URL principal da API (ex: `https://jsonplaceholder.typicode.com`)
- `timeout`: Tempo limite para requisições em milissegundos
- `headers`: Headers padrão para todas as requisições

### Endpoints
- Os endpoints são relativos à URL base
- Exemplo: `endpoint: "/users/1"` + `urlBase: "https://jsonplaceholder.typicode.com"` = `https://jsonplaceholder.typicode.com/users/1`

## Tipos de Validação

- `string` - Valida se o campo tem o valor string especificado
- `int` - Valida se o campo tem o valor inteiro especificado
- `existe` - Valida se o campo existe na resposta
- `lista` - Valida se a resposta é uma lista (pode incluir `minimo`)

## Como Usar nas Features

### Método Novo (Recomendado)
```gherkin
Scenario: Criar usuário com sucesso
  When eu executo o cenário "criar_usuario_sucesso"
  Then o status da resposta deve ser o esperado
  And todas as validações devem passar
```

### Método Tradicional (Ainda Suportado)
```gherkin
Scenario: Criar usuário tradicional
  When eu faço uma requisição POST para "/users" com os dados:
    """
    {
      "name": "João",
      "email": "joao@exemplo.com"
    }
    """
  Then o status da resposta deve ser 201
```

## Vantagens da Nova Estrutura

✅ **Configuração Centralizada** - URL base, timeout e headers em um local  
✅ **Flexibilidade** - Fácil mudança de ambiente (dev, staging, prod)  
✅ **Reutilização** - Mesmo cenário pode ser usado em múltiplas features  
✅ **Manutenção** - Mudanças na configuração não requerem alteração nas features  
✅ **Legibilidade** - Features mais limpas e focadas no comportamento  
✅ **Escalabilidade** - Fácil adicionar novos cenários sem modificar código  

## Executando Testes

```bash
# Executar todos os testes de usuários
npm test features/rest/users/

# Executar apenas criação de usuários
npm test -- --tags @criar_usuario_sucesso

# Executar apenas consultas
npm test -- --tags @consultar_usuario_por_id

# Executar health check da API
npm test features/rest/api_health.feature
```

## Adicionando Novos Cenários

1. Adicione o novo cenário no `cenarios_usuarios.json`
2. Use o cenário nas features com `When eu executo o cenário "nome_do_cenario"`
3. Use `Then o status da resposta deve ser o esperado` para validar status
4. Use `And todas as validações devem passar` para validar dados

## Mudando de Ambiente

Para mudar a URL base (ex: de desenvolvimento para produção):

1. Edite o campo `urlBase` no `config` do JSON
2. Ou crie diferentes arquivos JSON para diferentes ambientes
3. Os testes automaticamente usarão a nova URL base

## Exemplo de Configuração para Diferentes Ambientes

```json
// Desenvolvimento
"config": {
  "urlBase": "https://dev-api.exemplo.com",
  "timeout": 5000
}

// Produção
"config": {
  "urlBase": "https://api.exemplo.com",
  "timeout": 10000
}
``` 