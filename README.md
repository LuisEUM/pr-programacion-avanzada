# KwikPost - Red Social con Vue 3

Una aplicación de red social moderna desarrollada con Vue 3, que permite a los usuarios crear posts, interactuar mediante respuestas y gestionar perfiles de usuario.

## 🛠️ Stack Tecnológico

- **Frontend**: Vue 3 (Composition API), Vue Router, Pinia
- **Estilos**: Tailwind CSS
- **HTTP Client**: Axios con interceptores
- **Build Tool**: Vite
- **Gestión de Estado**: Pinia Store
- **Backend**: API REST con Node.js

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
cd kwikpost-vue
npm install

# Ejecutar servidor de desarrollo
npm run dev

# En otra terminal, ejecutar la API
cd ..
node api.js
```

**URLs de acceso:**

- Frontend: http://localhost:5173
- API: http://localhost:3000

## 🔐 Credenciales de Prueba

- **Usuario**: johndoe / **Contraseña**: a1b2c3d4
- **Usuario**: alicesmith / **Contraseña**: a1b2c3d4
- **Usuario**: wendymartin / **Contraseña**: a1b2c3d4

## 🗺️ Rutas de la Aplicación

| Ruta                 | Componente     | Descripción                               | Autenticación |
| -------------------- | -------------- | ----------------------------------------- | ------------- |
| `/`                  | HomeView       | Feed principal con todos los posts        | ✅ Requerida  |
| `/login`             | LoginView      | Formulario de inicio de sesión            | ❌ Pública    |
| `/profile/:username` | ProfileView    | Perfil de usuario con sus posts           | ✅ Requerida  |
| `/post/:id`          | PostDetailView | Vista detallada de un post con respuestas | ✅ Requerida  |
| `/post/form`         | PostFormView   | Formulario para crear nuevo post          | ✅ Requerida  |
| `/post/form/:id`     | PostFormView   | Formulario para editar post existente     | ✅ Requerida  |

## 🔌 API Endpoints

### Autenticación

- `POST /login` - Inicio de sesión con credenciales

### Usuarios

- `GET /user/:username` - Obtener información del perfil de usuario
- `GET /user/:username/posts` - Obtener posts de un usuario específico

### Posts

- `GET /posts` - Listar todos los posts (feed principal)
- `POST /post` - Crear nuevo post
- `GET /post/:id` - Obtener post específico con respuestas
- `PUT /post/:id` - Editar post existente
- `DELETE /post/:id` - Eliminar post

### Respuestas

- `POST /post/:id/reply` - Crear respuesta a un post

## ⚡ Funcionalidades Principales

### 🔐 Autenticación y Sesión

- Sistema de login con JWT tokens
- Persistencia de sesión en localStorage
- Protección de rutas con guards de navegación
- Logout automático en errores de autorización
- Restauración automática de sesión al recargar

### 📝 Gestión de Posts

- Crear posts con validación de contenido (máximo 280 caracteres)
- Editar posts propios con permisos verificados
- Eliminar posts con confirmación modal
- Vista detallada de posts individuales
- Feed principal con paginación

### 💬 Sistema de Respuestas

- Crear respuestas a posts existentes
- Visualización de respuestas anidadas
- Validación de contenido en respuestas
- Actualización automática tras crear respuesta

### 👤 Perfiles de Usuario

- Visualización de información de perfil (avatar, nombre, bio, fecha de registro)
- Lista de posts del usuario con paginación
- Navegación entre diferentes perfiles
- Avatar y metadata del usuario

### 🎨 Interfaz de Usuario

- Diseño responsive para móvil y desktop
- Navegación sticky con indicadores visuales
- Botón flotante para crear posts en móvil
- Barra de navegación inferior en dispositivos móviles
- Estados de carga y mensajes de error informativos
- Contador de caracteres en tiempo real

## 🏗️ Arquitectura del Proyecto

### Componentes Principales

- **LoginForm**: Formulario reutilizable de autenticación
- **PostCard**: Tarjeta individual de post con truncamiento inteligente
- **PostList**: Lista de posts con paginación
- **ReplyForm**: Formulario para crear/editar respuestas
- **UserProfileHeader**: Header de perfil con información del usuario

### Gestión de Estado

- **Session Store**: Manejo centralizado de autenticación y datos de usuario
- **API Client**: Cliente HTTP configurado con interceptores para autenticación
- **Router Guards**: Protección de rutas y redirecciones automáticas

### Transformación de Datos

- Mapeo automático de respuestas de API al formato del frontend
- Transformación de campos (`profileImg` → `avatarUrl`, `publishDate` → `createdAt`)
- Manejo de datos de autor para posts sin información completa

## 🔧 Características Técnicas

### Interceptores HTTP

- **Request**: Inyección automática de tokens de autorización
- **Response**: Transformación de datos y manejo de errores 401

### Validaciones

- Contenido obligatorio en posts y respuestas
- Límite de caracteres con indicador visual
- Validación de sesión robusta (token + datos de usuario)

### Navegación

- Protección de rutas con verificación de autenticación
- Prevención de rutas inválidas (`/profile/undefined`)
- Redirecciones inteligentes basadas en estado de sesión

### Responsive Design

- Layout adaptativo para diferentes tamaños de pantalla
- Navegación optimizada para móvil con barra inferior
- Botones flotantes que se adaptan al dispositivo

## 📱 Experiencia de Usuario

- **Carga Progresiva**: Indicadores de carga en todas las operaciones
- **Manejo de Errores**: Mensajes informativos y recuperación automática
- **Navegación Fluida**: Transiciones suaves entre vistas
- **Feedback Visual**: Estados activos y hover effects
- **Accesibilidad**: Labels apropiados y navegación por teclado

## 🔄 Flujo de Datos

1. **Autenticación**: Login → Store de sesión → Persistencia → Guards de ruta
2. **Posts**: API → Interceptores → Transformación → Componentes → UI
3. **Navegación**: Router → Guards → Verificación de sesión → Redirección
4. **Estado**: Pinia Store → Reactividad → Componentes → Persistencia

La aplicación está completamente funcional y lista para uso en producción, con todas las características principales implementadas y optimizadas para una experiencia de usuario fluida.
