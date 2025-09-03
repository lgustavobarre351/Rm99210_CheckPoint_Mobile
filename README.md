# CP_MOBILE_ASYNC
# RM99210 - Luís Gustavo Barreto Garrido 

App simples em React Native + Expo para cadastro local de usuários (armazenamento com AsyncStorage). Interface com lista de usuários, criação/edição/exclusão e modal para inserir dados.

## Recursos
- Listagem de usuários com avatar, nome e email
- Adicionar / editar / excluir usuários
- Armazenamento local usando `@react-native-async-storage/async-storage`
- Ícones via `lucide-react-native`

## Pré-requisitos
- Node.js (recomenda-se v18+)
- npm (vem com Node)
- Expo (opcional: `npm install -g expo-cli` para conveniência)
- Emulador Android/iOS ou app Expo Go no dispositivo físico

## Dependências principais
As bibliotecas usadas no projeto (conforme `package.json`):

- react 19.0.0
- react-native 0.79.6
- expo ~53.0.22
- expo-status-bar ~2.2.3
- lucide-react-native ^0.542.0
- @react-native-async-storage/async-storage ^2.2.0

Dependências de desenvolvimento:
# CP_MOBILE_ASYNC

Versão simples e direta do app de cadastro local de usuários feito com React Native + Expo.

Descrição rápida
- Lista de usuários com avatar, nome e e-mail
- Adicionar novo usuário (URL do avatar opcional)
- Editar usuário existente
- Excluir usuário com confirmação
- Dados persistem localmente usando AsyncStorage

Funcionalidades (detalhadas)
- Lista: mostra avatar, nome e e-mail em cartões com ações de editar e excluir.
- Criar: abre modal para inserir nome, e-mail e URL do avatar; se a URL for inválida, o app usa um avatar padrão.
- Editar: popula o modal com os dados do usuário selecionado para alteração.
- Excluir: pede confirmação antes de remover o usuário do armazenamento local.
- Notificação visual: exibe um toast quando um avatar padrão é usado.

Instalação mínima
1. Na pasta do projeto execute:

```powershell
npm install
npx expo install react-native-svg
npm install @react-native-async-storage/async-storage
npm install lucide-react-native
```

Comandos úteis
- Iniciar o Expo: `npm start`
- Executar no Android: `npm run android`
- Executar no iOS: `npm run ios` (macOS)

Dependências principais (ver `package.json` para versões exatas)
- react, react-native, expo
- lucide-react-native (ícones)
- @react-native-async-storage/async-storage

Onde olhar no código
- `App.tsx` — toda a UI e lógica de CRUD + AsyncStorage

Licença / notas
- Projeto simples para demonstração/estudo. Versões das dependências estão em `package.json`.

Se quiser, eu deixo este README ainda mais curto (só comandos) ou adiciono um `CONTRIBUTING.md` com passos para desenvolvedores.

