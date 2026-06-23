# 🥖 Padaria Artesanal

Bem-vindo(a) ao repositório do **Padaria Artesanal**! Um projeto de portfólio desenvolvido com o propósito de unir uma interface imersiva para o usuário a um backend sólido e seguro.

A ideia central não foi desenvolver apenas uma "landing page" visualmente agradável, mas sim construir um sistema real. A aplicação funciona como uma loja virtual para os clientes e como um painel de gestão (ERP) completo para a administração de produtos, controle de pedidos e cálculo de custos de receitas.

---

## 🎯 A Ideia por Trás do Projeto

O objetivo do projeto foi solucionar duas necessidades principais:
1. **A Experiência do Cliente:** Entregar uma interface que transmita a sensação acolhedora e artesanal de uma "padaria de bairro", utilizando animações fluidas e detalhes visuais interativos (como o efeito de partículas na tela).
2. **A Gestão do Negócio (O Painel):** Desenvolver um sistema de administração rápido e eficiente, onde é possível não só cadastrar produtos, mas também cruzar o custo exato dos ingredientes com o preço de venda para calcular o lucro real da operação.

---

## ✨ Conceitos e Funcionalidades Aplicadas

A arquitetura foi pensada para ser moderna e, acima de tudo, segura. Abaixo estão os destaques estruturais do sistema:

### 🏪 A Vitrine (Frontend)
- **Design Sensorial:** Utilização de GSAP e Framer Motion para dar vida aos menus e transições. O cardápio, por exemplo, conta com uma interação que simula o manuseio de páginas reais.
- **Carrinho Instantâneo:** O carrinho é renderizado como um painel lateral (side drawer) que é atualizado de forma otimista, sem a necessidade de recarregar a página, sempre respeitando o limite do estoque disponível.
- **Performance e Acessibilidade:** As animações mais complexas são pausadas automaticamente se a aba do navegador não estiver ativa, otimizando o uso da bateria. O projeto também respeita a preferência `prefers-reduced-motion` para usuários que optam por uma navegação estática.

### 🔒 Segurança e Integridade
- **Checkout à Prova de Fraudes:** Durante o processamento do pagamento, o servidor não confia nos valores de preço enviados pelo navegador. O sistema captura apenas o ID do produto e recalcula todo o subtotal nativamente através do banco de dados, impedindo qualquer manipulação de preços via cliente.
- **Proteção nas Server Actions:** Todas as ações de mutação (como deleção de produtos ou edição de configurações) validam se a sessão do administrador está ativa. Tentativas de acesso direto às rotas sem autenticação são imediatamente bloqueadas.

### 📊 Observabilidade e Monitoramento
A aplicação foi preparada para um ambiente de produção real, focando na facilidade de diagnóstico e monitoramento:
- **Logs Estruturados:** O uso do clássico `console.log` foi substituído por um Logger JSON estruturado. Caso ocorra uma falha crítica, o servidor registra o erro em um formato padronizado contendo o carimbo de tempo e o stack trace completo, ideal para ingestão em ferramentas de monitoramento.
- **Auditoria de Banco de Dados:** O Prisma ORM está configurado para registrar o tempo e o conteúdo das queries executadas, facilitando a identificação de gargalos de performance no painel da Vercel.
- **Rota de Saúde (Health Check):** O sistema conta com um endpoint `/api/health` preparado para que serviços de monitoramento (como o UptimeRobot) possam verificar periodicamente a disponibilidade do banco de dados e do servidor.

---

## 🛠️ Tecnologias Utilizadas

A stack principal selecionada para suportar a aplicação:

- **Framework:** Next.js 16 (App Router) e React 19 com TypeScript.
- **Estilo:** Tailwind CSS v4 e Lucide React para os ícones.
- **Animações:** GSAP e Motion (Framer).
- **Backend/Autenticação:** Next.js Server Actions e NextAuth v5.
- **Banco de Dados:** Prisma ORM conectado ao PostgreSQL Serverless (Neon).

---

## 🚀 Como Rodar o Projeto Localmente

Para clonar e testar o código em um ambiente de desenvolvimento, siga os passos padrão:

1. **Clone o repositório e instale as dependências:**
   ```bash
   git clone https://github.com/isahlopess/bakery-project.git
   cd bakery-project
   npm install
   ```

2. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto e preencha com as chaves do banco de dados e do sistema de login (você pode utilizar o Neon Tech para provisionar um banco PostgreSQL rapidamente):
   ```env
   POSTGRES_PRISMA_URL="sua_url_de_conexao"
   POSTGRES_URL_NON_POOLING="sua_url_sem_pool"
   AUTH_SECRET="sua_chave_secreta"
   ```

3. **Sincronize o banco e inicie a aplicação:**
   ```bash
   npx prisma db push
   npm run dev
   ```

Após inicializar, acesse `http://localhost:3000` para visualizar a vitrine para clientes, ou adicione `/login` à URL para acessar o painel de administração.

---
*Projeto desenvolvido para demonstração de habilidades em Engenharia de Software e Design de Interfaces.* ☕🥖
