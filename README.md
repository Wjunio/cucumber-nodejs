# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact


organize-vitta-cucumber/
└── features/
    ├── rest/
    │   └── users/
    │       └── users.feature  # Contém todos os testes para o recurso /users
    ├── step_definitions/
    │   └── api.steps.js       # Atualizado com o step para PUT
    └── support/


Para executar apenas os testes de usuários, você pode usar:
- npm test features/rest/users/

se quiser rodar um cenário específico pela tag:
- npm test -- --tags "@criar_usuario"