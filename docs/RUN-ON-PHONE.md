# Rodar no celular com Expo Go

## Pré-requisitos

- App Expo Go instalado no celular
- PC e celular na mesma rede Wi-Fi (preferencial)
- Projeto com dependências instaladas

## 1) Iniciar o servidor Expo

No projeto:

```bash
npm start
```

Você verá QR code no terminal e também no DevTools web do Expo.

## 2) Android (Expo Go)

1. Abra Expo Go.
2. Toque em “Scan QR Code”.
3. Escaneie o QR mostrado pelo Expo.
4. Aguarde o bundle carregar.

## 3) iOS (Expo Go)

1. Abra o app Câmera (ou Expo Go).
2. Escaneie o QR code.
3. Toque no link para abrir no Expo Go.

## 4) Dicas de rede (muito importante)

- PC e celular na mesma Wi-Fi.
- Evite VPN ativa durante testes.
- Se LAN falhar, tente Tunnel no Expo.

## 5) Permissões comuns

- Permita que o app acesse rede local (quando solicitado).
- No Windows, permita Node/Expo no firewall privado.

## 6) Como ver logs

- Terminal onde `npm start` está rodando.
- Console do Expo DevTools.
- Dentro do Expo Go (menu de desenvolvedor).

## 7) Comandos úteis

```bash
npx expo start -c
```

Limpa cache do bundler quando houver comportamento estranho.