# API de Funções HTTP com MongoDB Atlas

Este projeto demonstra como criar uma API utilizando Google Cloud Functions que se conecta a um banco de dados MongoDB hospedado no MongoDB Atlas. O objetivo é fornecer uma interface HTTP simples para executar consultas de leitura em uma coleção específica do MongoDB, utilizando autenticação baseada em token para segurança.

## Tecnologias Utilizadas

- Node.js
- Google Cloud Functions
- MongoDB Atlas
- dotenv para gerenciamento de variáveis de ambiente

## Configuração do Ambiente

Para executar este projeto, você precisará de uma conta no Google Cloud e no MongoDB Atlas. Além disso, é necessário configurar um cluster no MongoDB Atlas e obter a string de conexão.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGODB_URI=<sua-string-de-conexão-do-atlas>
TOKEN=<seu-token-de-autenticação-para-a-api>

