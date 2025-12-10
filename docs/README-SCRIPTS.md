# 📋 Scripts de Desenvolvimento e Produção

## 🚀 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev
```
- Inicia o servidor de desenvolvimento com otimizações
- Source maps habilitados para debugging
- Hot reload e Fast Refresh ativos
- Porta padrão: 3000

### Produção
```bash
npm run build
npm start
```
- `build`: Compila o projeto para produção com otimizações máximas
- `start`: Serve os arquivos estáticos compilados

### Análise e Debugging
```bash
npm run build:analyze    # Analisa o bundle size
npm run build:dev        # Build com source maps para debugging
npm run test:coverage    # Executa testes com coverage
```

### Qualidade de Código
```bash
npm run lint            # Executa ESLint com correções automáticas
npm run format          # Formata código com Prettier
```

### Utilitários
```bash
npm run clean           # Limpa pasta build
npm run test            # Executa testes uma vez
npm run test:watch      # Executa testes em modo watch
```

## ⚡ Otimizações Implementadas

### Desenvolvimento
- Cache do filesystem para rebuilds mais rápidos
- Source maps otimizados
- Hot Module Replacement (HMR)
- Divisão de chunks desabilitada para velocidade

### Produção
- Code splitting automático
- Compressão de assets
- Tree shaking
- Minificação otimizada
- Source maps desabilitados

## 🔧 Configurações de Performance

### Variáveis de Ambiente
- `.env.development`: Configurações para desenvolvimento
- `.env.production`: Configurações para produção
- `.env`: Configurações compartilhadas

### Cache
- Webpack filesystem cache habilitado
- Dependências de build trackadas automaticamente

### Bundle Analysis
Execute `npm run build:analyze` para visualizar:
- Tamanho dos chunks
- Dependências duplicadas
- Oportunidades de otimização