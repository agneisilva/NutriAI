# Troubleshooting (erros comuns)

## Metro bundler travado

### Sintomas

- Build não atualiza
- App fica carregando para sempre

### Correção

```bash
npx expo start -c
```

Feche Expo Go, abra de novo e escaneie novamente.

## Device e PC em redes diferentes

### Sintomas

- QR é lido, mas não conecta
- Timeout ao carregar bundle

### Correção

- Coloque celular e PC na mesma rede Wi-Fi
- Desative VPN temporariamente
- Troque para modo Tunnel no Expo

## npm install falha

### Causas comuns

- Internet instável
- Cache npm corrompido
- Versão Node incompatível

### Correção

```bash
npm cache verify
npm install
```

Se necessário, reinstale Node LTS.

## expo start não abre

### Correção

```bash
npx expo start
```

Se persistir:

```bash
npx expo doctor
```

## erro de dependência navigation

### Sintomas

- Erros de `react-native-screens` ou `react-native-safe-area-context`

### Correção

```bash
npx expo install react-native-screens react-native-safe-area-context
```

Reinicie o servidor:

```bash
npx expo start -c
```

## clear cache

Use sempre que comportamento estiver inconsistente:

```bash
expo start -c
```