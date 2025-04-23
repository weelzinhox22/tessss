# WelPlayTV

A React application for loading and playing M3U playlists from remote URLs. This app features:

- Backend proxy server to handle CORS restrictions when loading remote M3U playlists
- User-friendly interface to browse and play content from M3U playlists
- Categories for Movies, Series, and TV Channels
- Video player with resume functionality and skip intro option
- Progress tracking for watched content

## Setup

1. Clone the repository
2. Install dependencies for both server and client:
   ```
   npm run install-all
   ```

## Running the App

Start both the backend and frontend with a single command:

```
npm start
```

This will start:
- The Express server on port 5000
- The React client on port 3000

## How to Use

1. Open the app in your browser (http://localhost:3000)
2. Enter an M3U playlist URL in the input field (e.g., https://is.gd/angeexx)
3. Click "Load Playlist" to fetch and parse the playlist
4. Browse through the categories and click on any item to play it
5. The app will remember your last-watched position for each video

## Building for Production

To build the client for production:

```
npm run build
```

The production build will be created in the `client/build` directory. The Express server is configured to serve these files in production mode.

## Technologies Used

- React for the frontend UI
- Express.js for the backend server
- Styled Components for styling
- Framer Motion for animations
- React Player for video playback
- Axios for HTTP requests

## License

ISC

## Deploy no Netlify (Frontend + Backend)

Este projeto usa funções serverless do Netlify para implementar o backend, permitindo que você implante toda a aplicação no Netlify sem precisar de um servidor separado.

### Instruções para Deploy:

1. **Faça o fork/clone deste repositório**
   ```
   git clone https://github.com/seu-usuario/WelPlayTV.git
   cd WelPlayTV
   ```

2. **Prepare o projeto para deploy**
   - Certifique-se de que o arquivo `netlify.toml` está configurado corretamente
   - O diretório `netlify/functions` já contém o código do backend como funções serverless

3. **Método 1: Deploy utilizando a CLI do Netlify**
   
   a. Instale a CLI do Netlify (se ainda não tiver)
   ```
   npm install -g netlify-cli
   ```
   
   b. Faça login no Netlify
   ```
   netlify login
   ```
   
   c. Inicie um novo site (na raiz do repositório)
   ```
   netlify init
   ```
   
   d. Implante o site
   ```
   netlify deploy --prod
   ```

4. **Método 2: Deploy através da interface web do Netlify**
   
   a. Visite [Netlify](https://app.netlify.com/)
   
   b. Clique em "New site from Git"
   
   c. Conecte sua conta GitHub/GitLab/Bitbucket e selecione o repositório
   
   d. Configure as opções de build:
      - **Base directory**: deixe em branco ou `.`
      - **Build command**: `npm run build`
      - **Publish directory**: `client/build`
      
   e. Clique em "Deploy site"

### Importante:

- A função serverless que criamos (`netlify/functions/playlist.js`) substitui o servidor Express original
- O arquivo `netlify.toml` já está configurado para redirecionar as chamadas de API para essas funções
- As dependências necessárias para as funções estão listadas em `netlify/functions/package.json`

### Teste Local

Para testar localmente antes do deploy:

1. Instale as dependências
   ```
   npm run install-all
   cd netlify/functions && npm install && cd ../..
   ```

2. Inicie o ambiente de desenvolvimento do Netlify
   ```
   netlify dev
   ```

Este comando iniciará um servidor local que simula o ambiente do Netlify, incluindo as funções serverless.

## Recursos

- Frontend React com React Router para navegação
- Backend implementado como funções serverless do Netlify
- Análise e reprodução de playlists M3U
- Interface de usuário responsiva e moderna
- Organização de conteúdo por categorias 