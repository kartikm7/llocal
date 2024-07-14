<img src="https://github.com/kartikm7/llocal/assets/108652656/6111dfe5-bd73-439f-8006-9c2947cd2f15" alt="llocal-banner" width="800" />

# LLocal

Aiming to provide a seamless and privacy driven chatting experience with open-sourced technologies(Ollama), particularly open sourced LLM's(eg. Llama3, Phi-3, Mistral). Focused on ease of use.
<br />LLocal can be installed on both ****Windows****, ****Mac**** and ****Linux****.

<a target="_blank" href="https://discord.gg/ygrrVJA6Th"><img src="https://dcbadge.limes.pink/api/server/ygrrVJA6Th" alt="" /></a>
## Demo
<img src="https://github.com/kartikm7/llocal/assets/108652656/62904ac1-c165-45de-9b53-219dddb0dac0" alt="llocal-demo" height=400 />

## What can LLocal do?
- Llocaly store chats.
- Llocal utilizes Ollama which ensures that from processing to utilizing everything happens on your machine LLocally.
- Seamlessly switch between models.
- Easily pull new models.
- Image upload for models that support vision.
- Web search (i.e Website scraper aswell as duckduckgo search inbuilt) for all models.
- Responses are rendered as markdown (Supporting Code Blocks with syntax highlighting, tabular formats and much more).
- Multiple themes (5 themes all suporting both light and dark mode)
- Seamless integration with Ollama, from download to install.

## What's ahead?
- Chat with images ✅
- Web Search ☑️ (purple because, it still can be improved)
- Retrieval Augmented Generation/RAG (with single PDF's)
- Multiple PDF chat
- Text to Speech Models (only if we can get to be similar to a human like response).
- Community wallpapers
- Community themes (something like what spicetify does)
- Lofi Music (this would be optional)
- Speech to text (Do we really need it?)
- Conversations like those with ChatGPT (Speech to text input and text to speech output, but the aim would be low-latency).
- Chat with chats ?! (Not sure)

> *At some point: would want to pivot LLocal in a different direction...* (Although would need to discuss this with the users.)


## Project Setup

LLocal is an Electron application with React and TypeScript. 

### Recommended IDE Setup (You do you, honestly)

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Installation

#### Install dependencies

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

# For macOS (m-series)
$ npm run build:mac:arm

# For macOS (intel-chips)
$ npm run build:mac:intel

# For Linux (Supported now!)
$ npm run build:linux
```
## How to contribute?
You can refer to the [Contribute.md](https://github.com/kartikm7/llocal/blob/master/CONTRIBUTE.md)
