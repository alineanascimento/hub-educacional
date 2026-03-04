# Hub Inteligente de Recursos Educacionais

Aplicação Fullstack para gerenciamento de materiais didáticos com suporte a Inteligência Artificial para sugestão automática de descrições e tags.

## 🚀 Tecnologias

### Backend
- **Python 3.12** com **FastAPI**
- **PostgreSQL** como banco de dados
- **SQLAlchemy** como ORM
- **Pydantic** para validação de dados
- **Anthropic Claude** para integração com IA

### Frontend
- **React** com **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Router DOM** para navegação

## 📋 Funcionalidades

- ✅ Listagem de recursos com paginação
- ✅ Cadastro, edição e exclusão de recursos
- ✅ Campos: Título, Descrição, Tipo (Vídeo, PDF, Link), URL e Tags
- ✅ **Smart Assist**: geração automática de descrição e 3 tags via IA
- ✅ Loading state durante chamada à IA
- ✅ Tratamento de erros da API de IA
- ✅ Logs estruturados nas interações com a IA
- ✅ Health check endpoint (`/health`)
- ✅ Rate limiting na API de IA

## 🗂️ Estrutura do Projeto

```
hub-educacional/
├── backend/
│   ├── app/
│   │   ├── controllers/     # Rotas da API
│   │   ├── services/        # Regras de negócio
│   │   ├── repositories/    # Acesso ao banco de dados
│   │   ├── schemas/         # Schemas Pydantic
│   │   ├── models/          # Models SQLAlchemy
│   │   └── database/        # Configuração do banco
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── pages/           # Páginas
    │   ├── services/        # Chamadas à API
    │   └── types/           # Tipos TypeScript
    └── .env.example
```

## ⚙️ Como Rodar

### Pré-requisitos
- Python 3.12+
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend

# Criar e ativar ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o .env com suas credenciais

# Rodar o servidor
uvicorn app.main:app --reload
```

O backend estará disponível em `http://localhost:8000`  
Documentação da API: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
echo "VITE_API_URL=http://localhost:8000" > .env

# Rodar o servidor
npm run dev
```

O frontend estará disponível em `http://localhost:8080`

## 🔑 Variáveis de Ambiente

### Backend (`.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/hub_educacional
ANTHROPIC_API_KEY=your_api_key_here
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000
```

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/materials/` | Listar recursos (com paginação) |
| POST | `/materials/` | Criar recurso |
| GET | `/materials/{id}` | Buscar recurso por ID |
| PATCH | `/materials/{id}` | Atualizar recurso |
| DELETE | `/materials/{id}` | Deletar recurso |
| POST | `/ai/suggest` | Gerar descrição e tags com IA |

## 🤖 Smart Assist

O botão **Smart Assist** no formulário de cadastro envia o título e tipo do material para o backend, que consulta a API da Anthropic (Claude) e retorna:
- Uma descrição educacional detalhada
- 3 tags recomendadas

O backend utiliza um prompt de sistema que instrui a IA a atuar como um **Assistente Pedagógico**, garantindo respostas no formato JSON estrito.

### Exemplo de log gerado:
```
[INFO] AI Request Started | Title: 'Matemática Financeira' | Type: 'video'
[INFO] AI Success | Title: 'Matemática Financeira' | TokenUsage: 243 | Latency: 3.21s
```

## 🔒 Segurança

- Chaves de API armazenadas em variáveis de ambiente
- Arquivos `.env` incluídos no `.gitignore`
- Rate limiting na rota de IA (1 requisição a cada 3 segundos)