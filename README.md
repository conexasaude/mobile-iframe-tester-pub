# Mobile IFrame Tester

> **Projeto de exemplo.** Este repositório existe só como exemplo e para testes. O foco é validar as **permissões de câmera e microfone** em uma WebView, para quem vai **integrar a Conexa Saúde** ao próprio app. Não é uma biblioteca nem um app de produção.

App React Native para testar aplicações web **embarcadas em um app mobile** (WebView). Você digita uma URL e o app abre essa URL numa WebView configurada como a de um app real: câmera e microfone liberados, vídeo inline e autoplay, sem cache e em modo anônimo.

## Para que serve

Para integrar a Conexa Saúde, você embarca no seu app a aplicação web de teleconsulta. Essa aplicação precisa de câmera e microfone dentro da WebView, e o seu app precisa:

1. declarar as permissões nativas (Android: `AndroidManifest.xml`; iOS: `Info.plist`);
2. pedir as permissões ao usuário;
3. configurar a WebView para liberar mídia (`getUserMedia`), reprodução inline e autoplay.

Este projeto mostra uma implementação mínima dessas três etapas. Com ele você pode:

- **testar** a URL de integração da Conexa Saúde no Android e no iOS e confirmar que câmera e microfone funcionam dentro da WebView;
- **usar como referência** e copiar para o seu app as permissões e as props da WebView. Veja [Configuração da WebView](#configuração-da-webview) e [Permissões](#permissões).

Se a teleconsulta funciona aqui e não funciona no seu app, compare as permissões e as props da WebView dos dois.

## Sumário

- [Para que serve](#para-que-serve)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Rodando o app](#rodando-o-app)
- [Como usar](#como-usar)
- [Configuração da WebView](#configuração-da-webview)
- [Permissões](#permissões)
- [Gerando um APK para distribuir](#gerando-um-apk-para-distribuir)
- [Testes e qualidade de código](#testes-e-qualidade-de-código)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Solução de problemas](#solução-de-problemas)

## Requisitos

| Ferramenta | Versão | Usado em |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | >= 22.11 | Android e iOS |
| [Yarn](https://classic.yarnpkg.com/) | 1.x (classic) | Android e iOS |
| JDK | 17 | Android |
| [Android Studio](https://developer.android.com/studio) + Android SDK | SDK 36 | Android |
| Xcode | 16 ou superior | iOS (somente macOS) |
| [CocoaPods](https://cocoapods.org/) | >= 1.13 | iOS (somente macOS) |

Versões principais do projeto: React Native 0.88, React 19 e `react-native-webview` 14. O projeto usa a New Architecture do React Native.

Para preparar o ambiente do zero, siga o guia oficial: [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment).

### Variáveis de ambiente (Android)

No macOS com Homebrew, por exemplo:

```sh
brew install openjdk@17
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH
```

Adicione essas linhas ao seu `~/.zshrc` (ou `~/.bashrc`) para não precisar repeti-las.

## Instalação

```sh
git clone <url-deste-repositório>
cd mobile-iframe-tester-pub
yarn install
```

> Não tem o Yarn instalado? Use `npm install -g yarn` ou `corepack enable`.

Só para iOS, instale também os pods:

```sh
cd ios
pod install
cd ..
```

## Rodando o app

### Android

1. Abra um emulador pelo Android Studio (Device Manager) ou conecte um aparelho com a depuração USB ativa. Confira se ele aparece em `adb devices`.
2. Em um terminal, inicie o Metro (o bundler JavaScript):

   ```sh
   yarn start
   ```

3. Em outro terminal, compile e instale o app:

   ```sh
   yarn android
   ```

### iOS (somente macOS)

```sh
yarn start   # em um terminal
yarn ios     # em outro terminal
```

Para escolher um simulador específico: `yarn ios --simulator "iPhone 16"`.

Para rodar num iPhone físico, abra `ios/react_native_iframe_tester.xcworkspace` no Xcode, selecione o seu **Team** em *Signing & Capabilities* e rode pelo Xcode. Se precisar, troque também o *Bundle Identifier*.

> A primeira compilação é demorada, principalmente no iOS. As seguintes são bem mais rápidas.

## Como usar

1. **Escolha o protocolo** no switch: `Http` ou `Https`. O protocolo ativo fica destacado em verde. O padrão é `Https`.
2. **Digite a URL sem o protocolo** no campo *"Input your url here"*. Por exemplo: `meusite.com.br/pagina?token=abc`.
   - O app junta o protocolo escolhido com o que você digitou. Se você digitar `https://meusite.com`, a URL final vai ficar errada (`https://https://meusite.com`).
3. Toque em **Render** para carregar a página na área pontilhada.
4. Toque em **Clear** para descarregar a página e limpar a área.

Ao abrir o app pela primeira vez, ele pede acesso à câmera e ao microfone. Aceite para testar fluxos que usam `getUserMedia`, como videochamadas.

### Testando um servidor local

- **Emulador Android:** use `10.0.2.2` no lugar de `localhost`. Exemplo: `10.0.2.2:3000`, com o switch em `Http`.
- **Simulador iOS:** `localhost:3000` funciona direto.
- **Aparelho físico:** use o IP da sua máquina na rede local (ex.: `192.168.0.10:3000`). O aparelho precisa estar na mesma rede.

## Configuração da WebView

A WebView (`src/index.tsx`) usa estas opções:

| Prop | Valor | Efeito |
| --- | --- | --- |
| `javaScriptEnabled` | `true` | Executa JavaScript |
| `domStorageEnabled` | `true` | Habilita `localStorage`/`sessionStorage` (Android) |
| `cacheEnabled` | `false` | Não usa cache: cada Render carrega a página do zero |
| `incognito` | `true` | Sessão anônima: não guarda cookies nem storage entre execuções |
| `allowsInlineMediaPlayback` | `true` | Toca vídeo inline, sem forçar tela cheia (iOS) |
| `mediaPlaybackRequiresUserAction` | `false` | Permite autoplay de mídia |
| `allowsFullscreenVideo` | `true` | Permite vídeo em tela cheia (Android) |
| `originWhitelist` | `['*']` | Aceita qualquer origem |
| `startInLoadingState` | `true` | Mostra um indicador enquanto a página carrega |

Para comparar com a WebView do seu app, ajuste essas props em `src/index.tsx`. Veja a [documentação do react-native-webview](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md).

## Permissões

| Plataforma | Permissão | Onde está configurada |
| --- | --- | --- |
| Android | `INTERNET`, `CAMERA`, `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS` | `android/app/src/main/AndroidManifest.xml` |
| iOS | Câmera e microfone (`NSCameraUsageDescription`, `NSMicrophoneUsageDescription`) | `ios/react_native_iframe_tester/Info.plist` e `setup_permissions` no `ios/Podfile` |

O pedido de permissão acontece ao abrir o app: `PermissionsAndroid` no Android e `react-native-permissions` no iOS.

**Tráfego HTTP (sem TLS)** fica liberado para que o modo `Http` funcione:

- Android: `android:usesCleartextTraffic="true"` no `AndroidManifest.xml`.
- iOS: `NSAllowsArbitraryLoadsInWebContent` no `Info.plist`. Isso libera HTTP só dentro da WebView.

> Câmera e microfone na web exigem um *contexto seguro*. Use `Https` (ou `localhost`) para testar `getUserMedia`.

## Gerando um APK para distribuir

```sh
cd android
./gradlew assembleRelease
```

O APK fica em `android/app/build/outputs/apk/release/app-release.apk`. Para instalá-lo num aparelho conectado, use `adb install` com esse caminho.

> O build de release usa a keystore de debug (`android/app/debug.keystore`). Isso basta para distribuir internamente, mas **não serve para publicar na Play Store**. Para publicar, gere sua própria keystore: [Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android).

No iOS, gere o `.ipa` pelo Xcode (*Product → Archive*), com a sua conta de desenvolvedor Apple.

## Testes e qualidade de código

```sh
yarn test    # Jest (os módulos nativos são mockados em jest.setup.js)
yarn lint    # ESLint
npx tsc      # checagem de tipos TypeScript
```

## Estrutura do projeto

```
.
├── App.tsx              # Raiz do app (SafeAreaProvider + tela principal)
├── index.js             # Registro do app no React Native
├── src/
│   └── index.tsx        # Tela do testador: switch de protocolo, input de URL e WebView
├── __tests__/           # Testes Jest
├── jest.config.js
├── jest.setup.js        # Mocks dos módulos nativos para o Jest
├── android/             # Projeto nativo Android (applicationId: com.react_native_iframe_tester)
└── ios/                 # Projeto nativo iOS (Xcode workspace + Podfile)
```

## Solução de problemas

| Problema | Solução |
| --- | --- |
| `Unsupported class file major version` ou outro erro de Java no Gradle | Confira se `java -version` mostra a versão 17 e se o `JAVA_HOME` aponta para o JDK 17 |
| `SDK location not found` | Defina `ANDROID_HOME`, ou crie `android/local.properties` com `sdk.dir=/caminho/para/Android/sdk` |
| App abre com tela vermelha "Unable to load script" | Inicie o Metro com `yarn start`. Num aparelho Android físico, rode `adb reverse tcp:8081 tcp:8081` |
| Erro de pods no iOS | Rode `cd ios && pod install --repo-update` |
| Página em branco | Confira o protocolo do switch e se você digitou a URL **sem** `http://`/`https://` |
| Câmera/microfone não funcionam no site | Aceite as permissões ao abrir o app (ou ative-as nos Ajustes do aparelho) e use `Https` |
| Comportamento estranho depois de trocar de branch ou atualizar dependências | Limpe o cache do Metro (`yarn start --reset-cache`) e, no Android, rode `cd android && ./gradlew clean` |
