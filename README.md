# Microscópio Virtual de Hematologia

Um simulador interativo de lâminas de sangue periférico. Permite arrastar, dar zoom e navegar por múltiplas lâminas em um ambiente de microscópio virtual.

---

## 🧩 Tecnologias

- **React**: Biblioteca para construir a interface do usuário.  
- **Vite**: Bundler moderno para desenvolvimento rápido.  
- **TailwindCSS**: Estilização rápida e responsiva.  
- **JavaScript**: Lógica de arrastar, zoom e inércia.

---

## 📂 Estrutura de Pastas

hematology-app/
├─ public/
│ └─ cells/ # Imagens de células
├─ src/
│ ├─ assets/ # Alternativa para imagens
│ ├─ components/
│ │ ├─ Header.jsx
│ │ ├─ SlideSelector.jsx
│ │ ├─ Microscope.jsx
│ │ ├─ ZoomControls.jsx
│ │ └─ Loader.jsx
│ ├─ hooks/
│ │ └─ useMicroscope.js
│ ├─ App.jsx
│ └─ main.jsx
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
└─ vite.config.js

yaml
Copy code

---

## ⚡ Funcionalidades

- **Arrastar**: Mover a lâmina dentro do microscópio.  
- **Zoom**: Usar botões ou scroll para aproximar/distanciar a lâmina.  
- **Inércia**: Movimento natural ao soltar a lâmina após arrastar.  
- **Seletor de lâminas**: Alternar entre diferentes conjuntos de imagens de células.  
- **Compatível com desktop e mobile** (touch e mouse).

---

## 💻 Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd hematology-app
Instale dependências:

```bash
Copy code
npm install
Rode o projeto:
```

```bash
Copy code
npm run dev
Abra no navegador em http://localhost:5173.
```

### 🖼️ Adicionando Imagens
Coloque imagens das células em:

swift
Copy code
public/cells/
Ou importe dentro de src/assets/cells/:

jsx
Copy code
import neutrophil from "../assets/cells/neutrophil.png";

### ⚙️ Personalização
Ajuste zoomStep, minZoom e maxZoom em useMicroscope.js.

Adicione novas lâminas no array SLIDES no App.jsx.

Modifique estilos no Tailwind ou adicione classes personalizadas no index.css.

### 📝 Licença
Create with love by MIT © [Jonathan Cavalcanti]

