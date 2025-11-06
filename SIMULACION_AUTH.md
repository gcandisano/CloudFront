# 🔐 Simulación de Autenticación en Desarrollo

## ✅ Autenticación Automática

En modo desarrollo, el sistema **automáticamente simula un usuario autenticado** cuando no hay token en localStorage. Esto te permite acceder a todas las páginas protegidas sin necesidad de configurar Cognito.

### Usuario Simulado

- **Email:** usuario@ejemplo.com
- **ID:** 1
- **Nombre:** Usuario Ejemplo
- **Es vendedor:** Sí
- **Activo:** Sí

## 🎮 Comandos en la Consola del Navegador

Abre la consola del navegador (F12) y podrás usar estos comandos:

### Simular Autenticación
```javascript
simulateAuth()
```
Simula un usuario autenticado (útil si te deslogueaste).

### Desloguear
```javascript
logoutSimulated()
```
Desloguea el usuario simulado y limpia el localStorage.

## 📋 Páginas que Puedes Acceder

Con la autenticación simulada, puedes acceder a:

- `/profile` - Mi perfil
- `/profile/edit` - Editar perfil
- `/cart` - Carrito de compras
- `/orders` - Compras y ventas
- `/notifications` - Notificaciones
- `/store/profile` - Mi tienda
- `/store/edit` - Editar tienda
- `/product/:id/edit` - Editar producto

## 🔄 Cómo Funciona

1. Al iniciar la app en desarrollo, si no hay token, se simula automáticamente
2. El token simulado es: `mock-token-for-development`
3. No se hacen llamadas al backend cuando se usa el token simulado
4. Los servicios devuelven datos hardcodeados cuando no hay backend

## ⚠️ Nota

Esta funcionalidad **solo funciona en modo desarrollo** (`npm run dev`). En producción, se requiere autenticación real con Cognito.

