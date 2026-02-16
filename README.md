# TurboTemplate (Expo + React Native + TypeScript)

Template mobile para **aprender fluxo completo** de app com:

- Login fake local (sem backend)
- Navegação com Drawer + Bottom Tabs + Stack (Details)
- Telas de exemplo (Home, Details, Explore, ApiTest, Settings)
- Edição de perfil (nome e foto) com persistência local
- Indicador de modo offline no header
- Configuração por ambiente (`.env`)
- Documentação passo a passo para Windows recém-instalado

## Tema e Paleta

O app usa um design system simples em `src/theme` com tokens reutilizáveis.

### Cores (hex)

- `primary`: `#CC561E`
- `primary2`: `#EF8D32`
- `danger`: `#AA2B1D`
- `success`: `#BECA5C`
- `background`: `#EEF2F7`
- `surface`: `#FFFFFF`
- `text`: `#111827`
- `textMuted`: `#6B7280`
- `border`: `#E5E7EB`

### Onde alterar o tema

- `src/theme/colors.ts` → paleta de cores
- `src/theme/spacing.ts` → spacing scale e border radius
- `src/theme/typography.ts` → tamanhos/pesos de fonte
- `src/theme/shadows.ts` → sombras suaves
- `src/theme/styles.ts` → helpers de layout (screen/card padding)

Componentes base (`src/components`) e navegação já consomem esses tokens.

## O que é Expo (explicação simples)

Expo é um conjunto de ferramentas para criar app React Native sem precisar configurar Android Studio ou Xcode no início.

No modo de desenvolvimento:

1. Você roda `npm start` no PC.
2. O Expo abre um servidor (Metro) e mostra um QR code.
3. Você abre o app **Expo Go** no celular e escaneia o QR.
4. O app carrega no celular quase instantaneamente.

> Você **não precisa de Mac** para testar no celular com Expo Go.
>
> Para build/loja (APK/AAB/IPA), use **EAS Build** depois.

## Pré-requisitos

Você já tem:

- Node.js
- VS Code

Você ainda precisa instalar:

- Git
- Expo Go no celular

Guia detalhado: [docs/SETUP-WINDOWS.md](docs/SETUP-WINDOWS.md)

## Passo a passo rápido (for dummies)

### Passo 1) Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd NutriAI
```

### Passo 2) Instalar dependências

```bash
npm install
```

### Passo 3) Criar arquivo `.env`

Copie o exemplo:

```bash
copy .env.example .env
```

Abra o `.env` e ajuste, se quiser:

```env
API_URL=https://example.com
APP_NAME=TurboTemplate
```

### Passo 4) Rodar o app

```bash
npm start
```

Vai aparecer QR code no terminal/aba do Expo.

### Passo 5) Abrir no celular com Expo Go

1. Instale Expo Go no celular.
2. Celular e PC na mesma rede Wi-Fi.
3. Escaneie o QR.

Guia completo: [docs/RUN-ON-PHONE.md](docs/RUN-ON-PHONE.md)

## Se não aparecer QR ou não conectar

- Tente limpar cache:

```bash
npx expo start -c
```

- Troque o modo de conexão no Expo (LAN/Tunnel).
- Veja correções em [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## Como testar o fluxo do template

1. Abra app no celular.
2. Tela de login aparece.
3. Digite e-mail qualquer (não vazio) e senha qualquer.
4. Clique em **Entrar**.
5. Você entra no app com tabs embaixo.
6. Vá em **Home** e toque **Abrir detalhes**.
7. Vá em **ApiTest** e toque **Testar API**.
8. Vá em **Settings** e toque **Sair**.

## Offline indicator

- O app monitora conectividade em tempo real com `@react-native-community/netinfo`.
- Quando ficar sem internet, aparece um ícone vermelho `i` discreto no header (lado direito).
- Ao tocar no ícone, abre popup com aviso de modo offline.
- Quando a internet volta, o ícone some automaticamente e o popup é fechado.

## Drawer menu

- Em telas autenticadas, o ícone `☰` no header abre/fecha o drawer lateral.
- Itens principais do drawer:
  - **Início** (tabs: Home, Explore, ApiTest, Settings)
  - **Perfil**
- No topo do drawer há mini header com avatar + nome.

## Profile editing

- A tela **Perfil** permite:
  - Editar nome
  - Escolher foto da galeria
  - Salvar dados localmente
- O estado é persistido com AsyncStorage.
- Nome/avatar são refletidos no drawer, no header e em Settings.

## Permissões do image-picker

- Ao tocar em **Alterar foto**, o app solicita permissão para acessar a galeria.
- Se você negar, o app mostra aviso amigável e não quebra o fluxo.
- Para testar novamente após negar, habilite a permissão nas configurações do app no celular.

## Scripts

- `npm start` → inicia Expo
- `npm run android` → tenta abrir no Android (se disponível)
- `npm run typecheck` → valida TypeScript
- `npm run lint` → roda ESLint

## Estrutura de pastas

```txt
src/
  components/   # Botões, campos, card, tags, divider e screen base
  config/       # Leitura de env em runtime (expo extra)
  navigation/   # Root/Auth/Drawer/Tabs/HomeStack + headers customizados
  screens/      # Telas do app (Login, Home, Details, Explore, ApiTest, Settings, Profile)
  services/     # Serviço de API (teste /health)
  state/        # AuthContext + NetworkContext + ProfileContext
  theme/        # Design system (colors, spacing, typography, shadows)
  utils/        # Utilitários (validação)
```

## Observações importantes

- Não existe backend neste template.
- Login é fake e local (didático).
- Não há auth real/JWT/OAuth.
- Sem Mac, você não compila iOS localmente.
- Para gerar build Android/iOS no futuro, use **EAS Build**.

## Documentação complementar

- Setup completo Windows: [docs/SETUP-WINDOWS.md](docs/SETUP-WINDOWS.md)
- Rodar no celular: [docs/RUN-ON-PHONE.md](docs/RUN-ON-PHONE.md)
- Solução de problemas: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)