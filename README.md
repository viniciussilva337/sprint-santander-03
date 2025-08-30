# Dashboard Santander (Vite + React)

Aplicação web em React + Vite para análise de clientes empresariais por clusters (INÍCIO, EXPANSÃO, MATURIDADE, DECLÍNIO), com filtros temporais e exportações (PDF, Excel e captura do dashboard em PDF).

## Requisitos
- Node.js 18+ (recomendado) e npm 8+
- Navegador moderno (para exportações e renderização)

## Instalação
```
npm install
```

## Desenvolvimento
Serviço local com HMR (hot reload):
```
npm run dev
```
Abra a URL exibida no terminal (ex.: `http://localhost:5173`).

## Build de Produção
Gera os arquivos otimizados em `dist/`:
```
npm run build
```

Pré-visualizar o build localmente:
```
npm run preview
```

## Estrutura (resumo)
- `src/App.jsx`: Carrega o dashboard (Filtered ou Real).
- `src/FilteredDashboard.jsx`: Dashboard com filtros por mês (fonte principal de dados).
- `src/RealDataDashboard.jsx`: Dashboard com conjunto alternativo de dados.
- `src/components/ExportButtons.jsx`: Botões de export (PDF, Excel, Screenshot PDF).
- `src/hooks/useExport.js`: Lógica de geração de PDF/Excel/Screenshot.
- `dados_por_mes.json` / `dados_reais.json`: Versões em JSON dos dados (atualmente não importados pelo app).

## Dados
Os dados estão embutidos nos componentes e também disponíveis em JSON na raiz. Recomenda-se, em evolução, unificar a leitura para usar apenas os arquivos JSON como fonte.

## Exportações
- PDF Executivo (jsPDF)
- Excel Completo (xlsx)
- Screenshot do Dashboard em PDF (html2canvas + jsPDF)

Observação: o navegador pode solicitar permissão para baixar arquivos.

## Observações
- Existem textos com acentuação corrompida que podem ser corrigidos em uma próxima atualização (encoding UTF-8).
- Alguns meses (ex.: jan/fev) têm dados transacionais ausentes; o dashboard já indica diferenças de contexto.

## Scripts npm
- `npm run dev`: ambiente de desenvolvimento.
- `npm run build`: build de produção.
- `npm run preview`: servidor de preview do build.

## Licença
Projeto acadêmico/demonstrativo. Adapte conforme necessário para seu uso.
