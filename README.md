# LLocal

Aiming to provide a seamless and privacy driven chatting experience with open-sourced technologies(Ollama), particularly open sourced LLM's(eg. Llama3, Phi-3, Mistral).

![llocal-demo](https://github.com/kartikm7/llocal/assets/108652656/62904ac1-c165-45de-9b53-219dddb0dac0)

## Current Roadmap
- Locally storing the chats
- AI Chat streaming
- Retrieval Augmented Generation/RAG (with single PDF's)

## What's ahead?
- Web Search
- Multiple PDF chat
- Chat with chats ?! (Not sure)

> *At some point: would want to pivot LLocal in a different direction...* (Although would need to discuss this with the users.)


## Project Setup

An Electron application with React and TypeScript

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Project Setup

#### Install

```bash
$ npm install
```

#### Development

```bash
$ npm run dev
```

#### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
> Worth noting, one of the core dependencies LocalBase has a severe issue with vite. It still uses a commonjs import. which causes an issue. That can be rectified by following this guide **https://github.com/dannyconnell/localbase/issues/57#issuecomment-1102740539** .
