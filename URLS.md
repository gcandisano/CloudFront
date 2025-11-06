# URLs Disponibles en el Proyecto

## 🏠 Páginas Públicas (sin autenticación)

- `/` - Página principal (Home)
- `/explore` - Explorar productos
- `/product/:id` - Ver detalle de producto
- `/store/:storeId?` - Ver tienda (opcional: ID de tienda)
- `/login` - Iniciar sesión / Registrarse
- `/forgot-password` - Recuperar contraseña
- `/reset-password?token=XXX` - Restablecer contraseña (requiere token)
- `/verify-email` - Verificar email
- `/product/create` - Crear producto (requiere autenticación pero meta dice false)

## 👤 Páginas de Usuario (requieren autenticación)

- `/profile` - Ver mi perfil
- `/profile/edit` - Editar mi perfil
- `/cart` - Carrito de compras
- `/orders` - Mis compras y ventas (con filtros)
- `/orders/:id` - Detalle de una compra
- `/orders/:id/review` - Dejar reseña de productos comprados
- `/sales/:id` - Detalle de una venta
- `/notifications` - Notificaciones

## 🏪 Páginas de Tienda (requieren autenticación)

- `/store/profile` - Mi tienda (productos del usuario autenticado)
- `/store/edit` - Editar mi tienda
- `/product/:id/edit` - Editar un producto

## 🔄 Páginas del Sistema

- `/callback` - Callback de Cognito (después del login)

## 📝 Notas

- Las rutas protegidas redirigen a `/login` si no estás autenticado
- El servidor de desarrollo normalmente corre en `http://localhost:5173` (Vite)
- Para ver las páginas, ejecuta: `npm run dev` en la carpeta CloudFront

