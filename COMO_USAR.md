# 🚀 Como Replicar a Estrutura Cucumber

## 📋 Opções Disponíveis

Você tem **2 opções** para replicar esta estrutura em outros projetos:

### 🎯 **Opção 1: Script Automatizado (Recomendado)**

Use o script `setup-estrutura.js` que cria tudo automaticamente:

```bash
# Criar projeto com nome padrão
node setup-estrutura.js

# Criar projeto com nome personalizado
node setup-estrutura.js meu-projeto-api

# Exemplo
node setup-estrutura.js testes-api-produtos
```

**✅ Vantagens:**
- Cria toda a estrutura automaticamente
- Instala dependências
- Gera arquivos prontos para usar
- Configura scripts npm

### 📖 **Opção 2: Manual com Guia**

Use o arquivo `SETUP_ESTRUTURA_CUCUMBER.md` como referência:

```bash
# 1. Siga o guia passo a passo
# 2. Copie os códigos fornecidos
# 3. Crie os arquivos manualmente
```

**✅ Vantagens:**
- Entende cada parte da estrutura
- Personaliza conforme necessário
- Aprende o processo completo

## 🎯 **Qual escolher?**

- **Script**: Para criar rapidamente e começar a testar
- **Manual**: Para aprender e personalizar a estrutura

## 📁 **Arquivos Disponíveis**

1. **`setup-estrutura.js`** - Script automatizado
2. **`SETUP_ESTRUTURA_CUCUMBER.md`** - Guia completo manual
3. **`COMO_USAR.md`** - Este arquivo de instruções

## 🚀 **Próximos Passos**

Após criar a estrutura:

1. **Adapte para sua API:**
   ```json
   {
     "config": {
       "urlBase": "https://sua-api.com",
       "timeout": 10000
     }
   }
   ```

2. **Adicione seus cenários:**
   ```json
   {
     "cenarios": {
       "meu_cenario": {
         "metodo": "POST",
         "endpoint": "/meu-recurso",
         "dados": { "campo": "valor" },
         "status_esperado": 201
       }
     }
   }
   ```

3. **Execute os testes:**
   ```bash
   npm test
   npm run report
   ```

---

**🎉 Pronto! Agora você pode replicar esta estrutura em qualquer projeto!** 