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

#### Diseño y Responsividad

- Diseño responsive para móvil y desktop
- Navegación sticky con indicadores visuales
- Botón flotante para crear posts que se adapta al dispositivo
- Barra de navegación inferior en dispositivos móviles
- Header unificado con iconos de navegación y logout

#### Componentes Reutilizables

- Sistema de avatares con 5 tamaños predefinidos
- Campos de formulario con validación en tiempo real
- Modales de confirmación para acciones destructivas
- Estados vacíos con iconos y acciones personalizables
- Botones de acción con estados de carga

#### Experiencia de Usuario

- Estados de carga y mensajes de error informativos
- Contador de caracteres en tiempo real
- Validación que solo aparece tras interacción del usuario
- Feedback visual consistente en toda la aplicación
- Navegación intuitiva con iconos y tooltips

## 🏗️ Arquitectura del Proyecto

### Estructura de Componentes Organizada

La aplicación utiliza una arquitectura de componentes bien estructurada, organizados por categorías funcionales:

```
src/components/
├── ui/           # Componentes básicos reutilizables
├── forms/        # Componentes relacionados con formularios
├── layout/       # Componentes de navegación y estructura
└── content/      # Componentes específicos del dominio
```

#### 📁 Componentes UI (`/ui`)

Componentes básicos y reutilizables para la interfaz de usuario:

- **UserAvatar**: Avatar de usuario con tamaños configurables (xs, sm, md, lg, xl)
- **LoadingSpinner**: Indicador de carga con mensajes personalizables
- **ErrorMessage**: Componente para mostrar mensajes de error
- **SuccessMessage**: Componente para mostrar mensajes de éxito
- **EmptyState**: Estado vacío reutilizable con iconos y acciones opcionales
- **ConfirmationModal**: Modal de confirmación para acciones destructivas

#### 📁 Componentes de Formularios (`/forms`)

Componentes especializados para manejo de formularios:

- **TextAreaField**: Campo de textarea reutilizable con validación en tiempo real
- **ReplyForm**: Formulario para crear/editar respuestas
- **FormActions**: Grupo de botones para formularios con estados de carga
- **LoginForm**: Formulario de inicio de sesión con validación

#### 📁 Componentes de Layout (`/layout`)

Componentes de navegación y estructura de la aplicación:

- **AppHeader**: Header reutilizable con navegación, avatares y botones de acción
- **MobileNavigation**: Barra de navegación inferior para dispositivos móviles
- **FloatingActionButton**: Botón flotante responsive para crear posts

#### 📁 Componentes de Contenido (`/content`)

Componentes específicos del dominio de la aplicación:

- **PostCard**: Tarjeta individual de post con truncamiento inteligente
- **PostList**: Lista de posts con paginación y estados vacíos
- **ReplyCard**: Tarjeta individual de respuesta con diseño compacto
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
- Validación inteligente que solo muestra errores tras interacción
- Feedback visual inmediato con contadores de caracteres

### Navegación

- Protección de rutas con verificación de autenticación
- Prevención de rutas inválidas (`/profile/undefined`)
- Redirecciones inteligentes basadas en estado de sesión

### Responsive Design

- Layout adaptativo para diferentes tamaños de pantalla
- Navegación optimizada para móvil con barra inferior
- Botones flotantes que se adaptan al dispositivo
- Header con funcionalidades específicas por vista
- Componentes que se ocultan/muestran según el contexto (ej: avatar en perfil propio)

## 📱 Experiencia de Usuario

- **Carga Progresiva**: Indicadores de carga en todas las operaciones
- **Manejo de Errores**: Mensajes informativos y recuperación automática
- **Navegación Fluida**: Transiciones suaves entre vistas
- **Feedback Visual**: Estados activos y hover effects
- **Accesibilidad**: Labels apropiados y navegación por teclado
- **Validación Inteligente**: Errores solo tras interacción del usuario
- **Estados Vacíos**: Mensajes informativos con acciones sugeridas
- **Confirmaciones**: Modales para acciones destructivas
- **Logout Accesible**: Botón de cierre de sesión en desktop y móvil

## 🔄 Flujo de Datos

1. **Autenticación**: Login → Store de sesión → Persistencia → Guards de ruta
2. **Posts**: API → Interceptores → Transformación → Componentes → UI
3. **Navegación**: Router → Guards → Verificación de sesión → Redirección
4. **Estado**: Pinia Store → Reactividad → Componentes → Persistencia

## 🔧 Refactorización y Componentización

### Mejoras Implementadas

La aplicación ha sido completamente refactorizada para mejorar la mantenibilidad y reutilización del código:

#### Eliminación de Código Duplicado

- **~195 líneas de código eliminadas** a través de componentización
- **16 componentes reutilizables** organizados en estructura modular
- **Consistencia visual** mejorada en toda la aplicación
- **Arquitectura escalable** con separación clara de responsabilidades

#### Organización Modular de Componentes

La refactorización incluyó una reorganización completa de la estructura de componentes:

**Antes**: Estructura plana con componentes mezclados

```
src/components/
├── AppHeader.vue
├── PostCard.vue
├── LoginForm.vue
├── LoadingSpinner.vue
└── ... (todos los componentes en un solo nivel)
```

**Después**: Estructura organizada por categorías funcionales

```
src/components/
├── ui/           # 6 componentes básicos reutilizables
├── forms/        # 4 componentes de formularios
├── layout/       # 3 componentes de navegación
└── content/      # 4 componentes específicos del dominio
```

#### Componentes por Categoría

**UI/UX (6 componentes)**:

- UserAvatar, LoadingSpinner, ErrorMessage, SuccessMessage, EmptyState, ConfirmationModal

**Formularios (4 componentes)**:

- TextAreaField, ReplyForm, FormActions, LoginForm

**Layout/Navegación (3 componentes)**:

- AppHeader, MobileNavigation, FloatingActionButton

**Contenido/Dominio (4 componentes)**:

- PostCard, PostList, ReplyCard, UserProfileHeader

#### Beneficios de la Reorganización

- **Mantenibilidad**: Cambios centralizados se reflejan en toda la app
- **Escalabilidad**: Estructura clara para agregar nuevos componentes
- **Reutilización**: Componentes categorizados y listos para futuras funcionalidades
- **Colaboración**: Estructura intuitiva para equipos de desarrollo
- **Consistencia**: Comportamiento uniforme en componentes similares
- **Accesibilidad**: Mejor soporte para lectores de pantalla
- **UX Mejorada**: Validación y feedback más consistentes
- **Organización**: Fácil localización y mantenimiento de componentes

#### Uso de Componentes Organizados

Con la nueva estructura, los imports siguen un patrón claro y semántico:

```javascript
// Componentes UI básicos
import UserAvatar from "@/components/ui/UserAvatar.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";

// Componentes de formularios
import TextAreaField from "@/components/forms/TextAreaField.vue";
import FormActions from "@/components/forms/FormActions.vue";

// Componentes de layout
import AppHeader from "@/components/layout/AppHeader.vue";
import MobileNavigation from "@/components/layout/MobileNavigation.vue";

// Componentes de contenido
import PostCard from "@/components/content/PostCard.vue";
import ReplyCard from "@/components/content/ReplyCard.vue";
```

Esta organización facilita:

- **Imports intuitivos**: Fácil identificación del tipo de componente
- **Mantenimiento**: Localización rápida de componentes por categoría
- **Desarrollo en equipo**: Separación clara de responsabilidades
- **Escalabilidad**: Estructura preparada para crecimiento futuro

---

La aplicación está completamente funcional y lista para uso en producción, con todas las características principales implementadas, optimizadas para una experiencia de usuario fluida y con una arquitectura de componentes robusta y mantenible.
