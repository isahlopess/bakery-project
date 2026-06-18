# 🥖 Padaria Artesanal — Web Experience

Um projeto de portfólio desenvolvido com foco na intersecção entre **Engenharia de Frontend Moderna** e **Design de Alta Performance**. 

Esta aplicação não é apenas uma Landing Page, mas um estudo aprofundado sobre como criar uma experiência de usuário (UX) imersiva sem sacrificar métricas de performance (Core Web Vitals) e segurança.

## 🎯 Objetivo do Projeto
O objetivo principal foi construir uma interface que transmite o calor e a textura de uma padaria artesanal rústica, utilizando micro-interações, efeitos de scroll e modelagem 3D, mantendo o código escalável e rigorosamente tipado.

## 🧠 Arquitetura & Decisões Técnicas

Para alcançar o resultado premium e manter a base de código saudável, as seguintes decisões arquiteturais foram tomadas:

- **Next.js 16 (App Router):** Utilizado para separar inteligentemente os *Server Components* (para SEO e carregamento rápido) dos *Client Components* (necessários para as animações e estado do carrinho).
- **Integração 3D & Performance:** A cena na introdução exibe um prato com vários pães de padaria em 3D, renderizado via iframe. Para evitar o bloqueio da *Main Thread* e não prejudicar o tempo de carregamento inicial (LCP), implementei a técnica de *lazy-loading* em camadas.
- **Ecossistema de Animações (GSAP + Motion):** Em vez de sobrecarregar o CSS com keyframes complexos, o controle de scroll horizontal da vitrine é orquestrado pelo `GSAP ScrollTrigger`, enquanto componentes de UI fluídos (como o Carrinho Lateral e modais) utilizam `motion/react` pelas suas físicas baseadas em molas (*spring physics*).
- **Gerenciamento de Estado:** O estado do carrinho ("Sua Cesta") foi construído visando evitar *prop-drilling*, utilizando uma abordagem limpa que permite acessibilidade de qualquer parte da aplicação.
- **Auditoria de Segurança Avançada:** Durante o desenvolvimento, o pacote interno `postcss` do ecossistema Next acusou vulnerabilidades em auditorias. A mitigação foi feita através de *overrides* de injeção direta no `package.json`, resultando em um build com **0 vulnerabilidades**.

## ✨ Funcionalidades em Destaque

- **Carrinho "Sua Cesta":** Um *side drawer* responsivo com gerenciamento de estado global (Zustand-like) para adicionar os produtos favoritos da fornada em tempo real, aplicando desfoque ao fundo quando aberto.
- **Otimização Nativa de Imagens:** Transição de tags HTML brutas para o componente `<Image />` do Next.js, servindo assets dinamicamente em WebP/AVIF.
- **Cursor Magnético Customizado:** Uma camada de imersão que segue o mouse interativamente, elevando a percepção de valor (premium feel) em dispositivos Desktop.
- **LightBox Galeria:** Um modal interativo no Cardápio que expande imagens dos produtos com desfoque de fundo (backdrop-blur) ao clique.

## 🛠️ Stack Tecnológica

- **Core:** React 19, Next.js 16, TypeScript
- **Estilização:** Tailwind CSS v4
- **Animações:** GSAP, Motion (Framer)
- **Componentes:** Embla Carousel, Lucide React (Ícones Vetoriais)
- **Formulários:** Zod + React Hook Form

## 🚀 Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/isahlopess/bakery-project.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor local:
   ```bash
   npm run dev
   ```
4. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---
