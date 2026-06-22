# 🥖 Padaria Artesanal — Full-Stack Web Experience & Admin Dashboard

Um projeto de portfólio *End-to-End* desenvolvido para demonstrar o domínio sobre **Engenharia de Frontend Moderna**, **Design de Alta Performance** e **Arquitetura Full-Stack com Next.js**.

Esta aplicação evoluiu de uma Landing Page imersiva para um **sistema completo de gestão**, incluindo interface para clientes (vitrine) e um painel de administração (ERP) robusto para controle de estoque, insumos, fichas técnicas e inteligência financeira.

![Capa do Projeto](https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80)

## 🎯 Objetivo do Projeto

Construir uma aplicação real que resolve dois problemas:
1. **Para o Cliente (Frontend):** Uma interface que transmite o calor e a textura de uma padaria artesanal, utilizando micro-interações, efeitos de scroll e modelagem 3D.
2. **Para a Padaria (Backend/Admin):** Um painel de controle seguro, rápido e inteligente para gerenciar o negócio, calcular custos de ingredientes e projetar o lucro real de cada venda.

---

## ✨ Funcionalidades em Destaque

### 🏪 Storefront (Visão do Cliente)
- **Design Sensorial:** Uso intenso de animações fluídas (GSAP + Framer Motion) para criar experiências táteis, como um cardápio interativo que simula as páginas de um livro real.
- **Carrinho e Checkout:** *Side drawer* responsivo com gerenciamento de estado otimista para adicionar produtos em tempo real.
- **Partículas Inteligentes:** Efeito visual de farinha caindo na tela usando `<canvas>`, otimizado via `requestAnimationFrame` (pausa automaticamente se não estiver na tela para poupar bateria).
- **Acessibilidade Dinâmica:** O site respeita `prefers-reduced-motion`, desativando animações pesadas para usuários sensíveis ou dispositivos mais antigos.

### 🔒 Painel Administrativo (Visão do Dono)
- **Engenharia Financeira (Lucro Real):** O sistema não apenas lista produtos, ele cruza dados. É possível visualizar o faturamento bruto, custos operacionais e o lucro líquido real de cada pedido.
- **Gestão de Insumos e Fichas Técnicas:** O administrador cadastra ingredientes (ex: Farinha, Ovos) e monta a receita do produto. O sistema calcula o custo exato de produção baseando-se no preço atual dos insumos.
- **Relatórios Corporativos (PDF):** Módulo de exportação de balanços financeiros formatados automaticamente para impressão e envio aos contadores (CSS `@media print`).
- **Dashboard Otimizado:** Consultas no banco de dados feitas utilizando agregações massivas do Prisma para evitar gargalos de memória (Prevenção de *Out of Memory* - OOM).
- **Optimistic UI:** Formulários do painel utilizam `useTransition` do React 19 para atualizar a interface instantaneamente enquanto o servidor sincroniza os dados no fundo.

---

## 🧠 Arquitetura & Decisões Técnicas

- **Next.js 16 (App Router):** Utilizado em seu estado da arte, separando *Server Components* (para velocidade e SEO) de *Client Components* (interatividade). 
- **Server Actions:** Eliminação de rotas de API tradicionais. Todo o tráfego de dados e mutações do painel de controle acontece de forma segura via Server Actions com revalidação de cache instantânea (`revalidatePath`).
- **Prisma ORM + PostgreSQL:** O banco de dados foi modelado para escalabilidade. Saiu-se do SQLite local para um ambiente nativo em nuvem (Neon Serverless Postgres), ideal para integrações com a Vercel.
- **Ecossistema de Animações:** Scroll orquestrado pelo `GSAP ScrollTrigger` e físicas elásticas de interface (botões e modais) gerenciadas pelo `motion/react`.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend Core** | React 19, Next.js 16, TypeScript |
| **Estilização & UI** | Tailwind CSS v4, Lucide React (Ícones) |
| **Animações** | GSAP, Motion (Framer), Embla Carousel |
| **Backend & Banco de Dados**| Prisma ORM, PostgreSQL (Neon / Vercel Postgres) |
| **Formulários & Validação** | Zod + React Hook Form |
| **Deploy & Infra** | Vercel (Hobby Tier) |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18.x ou superior instalado.
- Ter uma URL de conexão PostgreSQL (ou você pode trocar o provedor do Prisma para SQLite caso queira rodar 100% offline).

### Passos
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/isahlopess/bakery-project.git
   cd bakery-project
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto e adicione sua conexão do banco de dados:
   ```env
   POSTGRES_PRISMA_URL="sua_url_de_conexao_aqui"
   POSTGRES_URL_NON_POOLING="sua_url_de_conexao_direta_aqui"
   ```

4. **Sincronize o Banco de Dados:**
   ```bash
   npx prisma db push
   ```

5. **Inicie o servidor local:**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) para ver a vitrine, e `http://localhost:3000/admin` para acessar o painel de gestão.

---
