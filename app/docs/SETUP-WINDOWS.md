# Setup Windows (passo a passo completo)

Este guia parte de um Windows recém-instalado.

## 1) Instalar Git (obrigatório)

O Git é necessário para clonar repositórios e para algumas dependências/ferramentas de build.

### Download

- Site oficial: https://git-scm.com/download/win

### Instalação

1. Baixe o instalador.
2. Execute como administrador.
3. Pode manter as opções padrão.
4. Finalize.

### Verificação

Abra o PowerShell e rode:

```bash
git --version
```

## 2) Verificar Node.js e npm

Você informou que já tem Node.js. Confirme:

```bash
node -v
npm -v
```

Se o comando não funcionar, reinstale Node LTS:

- https://nodejs.org/

## 3) Entender Expo CLI (conceito simples)

Hoje, o recomendado é usar **npx**, sem instalar CLI global.

Exemplo:

```bash
npx expo start
```

Isso baixa/usa a versão correta da ferramenta no projeto atual.

## 4) Instalar Expo Go no celular (obrigatório para teste rápido)

### Android

- Google Play: https://play.google.com/store/apps/details?id=host.exp.exponent

### iOS

- App Store: https://apps.apple.com/app/expo-go/id982107779

## 5) Clonar projeto e abrir no VS Code

```bash
git clone <URL_DO_REPOSITORIO>
cd NutriAI
cd app
code .
```

> Se `code .` não funcionar, abra o VS Code manualmente e use “Open Folder”.

## 6) Instalar dependências e configurar env

```bash
npm install
copy .env.example .env
```

Edite `.env` se quiser:

```env
API_URL=https://example.com
APP_NAME=TurboTemplate
```

## 7) Subir app

```bash
npm start
```

Depois escaneie QR com Expo Go.

## 8) Android Studio + Emulator (opcional / advanced)

Não é obrigatório para começar.

Se quiser depois:

- Android Studio: https://developer.android.com/studio
- Criar AVD (Android Virtual Device)
- Com emulador aberto, rodar `npm run android`

## 9) Sobre iOS sem Mac

- Sem Mac, você **não compila iOS local**.
- Para build Android/iOS no futuro, use **EAS Build** (cloud):
  - https://docs.expo.dev/build/introduction/