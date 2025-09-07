# Match Market Frontend

Frontend de Vue.js para la aplicación Match Market, migrado desde JSP.

## Características

- 🛍️ **Catálogo de productos** con filtros y búsqueda
- 🏪 **Vistas de tienda** con información detallada
- 🔍 **Sistema de filtros** por categoría, precio y ordenamiento
- ❤️ **Sistema de favoritos** para usuarios autenticados
- 📱 **Diseño responsive** con Tailwind CSS
- 🔐 **Autenticación** con JWT
- 📄 **Paginación** inteligente
- 🔔 **Sistema de notificaciones** en tiempo real

## Tecnologías

- **Vue 3** con Composition API
- **TypeScript** para tipado estático
- **Pinia** para gestión de estado
- **Vue Router** para navegación
- **Tailwind CSS** para estilos
- **Vite** como bundler

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd match-market-front
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_TITLE=Match Market
   VITE_APP_DESCRIPTION=Tu marketplace de confianza
   ```

4. **Ejecutar en desarrollo**

   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ProductCard.vue      # Tarjeta de producto
│   ├── SearchFilters.vue    # Filtros de búsqueda
│   ├── StoreHeader.vue      # Header de tienda
│   ├── Pagination.vue       # Componente de paginación
│   └── NotificationToast.vue # Notificaciones
├── views/               # Vistas de la aplicación
│   └── HomeView.vue         # Vista principal
├── stores/              # Stores de Pinia
│   ├── auth.ts              # Store de autenticación
│   └── product.ts           # Store de productos
├── types/               # Tipos TypeScript
│   └── index.ts             # Definiciones de tipos
├── router/              # Configuración de rutas
│   └── index.ts             # Rutas de la aplicación
├── App.vue              # Componente raíz
├── main.ts              # Punto de entrada
└── style.css            # Estilos globales
```

## API Endpoints

El frontend espera los siguientes endpoints en el backend:

### Productos

- `GET /api/products` - Listar productos con filtros
- `GET /api/products/:id` - Obtener producto específico
- `GET /api/categories` - Listar categorías
- `POST /api/products/:id/like` - Toggle favorito

### Tiendas

- `GET /api/stores/:id` - Obtener información de tienda

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `GET /api/auth/me` - Obtener usuario actual

## Componentes Principales

### HomeView

Vista principal que muestra:

- Header de tienda (si se está viendo una tienda específica)
- Filtros de búsqueda
- Grid de productos
- Paginación

### SearchFilters

Componente de filtros que incluye:

- Búsqueda por texto
- Filtro por categoría
- Ordenamiento (precio, fecha, rating)
- Botón de favoritos

### ProductCard

Tarjeta de producto con:

- Imagen del producto
- Nombre y precio
- Información de la tienda (opcional)
- Enlace al detalle del producto

## Migración desde JSP

Este proyecto migra la funcionalidad del `index.jsp` original:

### Funcionalidades Migradas

- ✅ Header de tienda con imagen de portada y perfil
- ✅ Formulario de búsqueda con filtros
- ✅ Grid de productos responsive
- ✅ Sistema de favoritos
- ✅ Paginación
- ✅ Notificaciones (reemplaza SweetAlert)
- ✅ Navegación entre tiendas

### Mejoras Implementadas

- 🚀 **SPA** - Navegación sin recargas
- 🎨 **UI moderna** - Diseño con Tailwind CSS
- 📱 **Responsive** - Optimizado para móviles
- 🔄 **Estado reactivo** - Gestión con Pinia
- 🛡️ **TypeScript** - Tipado estático
- ⚡ **Performance** - Lazy loading de componentes

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build
- `npm run test:unit` - Ejecutar tests
- `npm run lint` - Linting del código
- `npm run format` - Formatear código

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
