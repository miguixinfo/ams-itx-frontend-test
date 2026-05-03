# 📱 Mobile Shop — ITX Frontend Test

Mini-aplicación SPA para la compra de dispositivos móviles, desarrollada como prueba técnica para AMS/Inditex.

## 🚀 Tech Stack

- **React 18** + **React Router v6**
- **Vite** (bundler)
- **Vitest** + **React Testing Library** (tests)
- **ESLint** + **Prettier** (calidad de código)
- **CSS Modules** (estilos)

## ⚙️ Scripts

| Script | Comando | Descripción |
|---|---|---|
| Desarrollo | `npm run dev` | Servidor local con HMR |
| Build | `npm run build` | Compilación para producción |
| Test | `npm run test` | Lanzamiento de tests |
| Lint | `npm run lint` | Comprobación de código |

## 🛠️ Instalación y ejecución

```bash
# Clonar el repositorio
git clone 
cd mobile-shop

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## 🏗️ Estructura del proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── Header/
│   ├── SearchBar/
│   └── ProductCard/
├── pages/             # Vistas principales
│   ├── ProductList/   # PLP
│   └── ProductDetail/ # PDP
├── services/          # Lógica de API + caché
│   └── api.js
├── hooks/             # Custom hooks
├── context/           # Estado global (carrito)
└── router/            # Configuración de rutas
```

## 🌐 API

Base URL: `https://itx-frontend-test.onrender.com`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/product` | Listado de productos |
| GET | `/api/product/:id` | Detalle de producto |
| POST | `/api/cart` | Añadir al carrito |

## 💾 Caché

Los datos del API se cachean en memoria del cliente con una expiración de **1 hora**. Pasado ese tiempo, se revalidan automáticamente.

## 📝 Notas técnicas

- SPA con enrutado en cliente (sin SSR ni MPA)
- El contador del carrito persiste en `localStorage`
- Filtrado en tiempo real por Marca y Modelo
- Diseño responsive: máximo 4 columnas en desktop, adaptativo en móvil