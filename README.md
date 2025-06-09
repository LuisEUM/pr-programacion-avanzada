# Documentación Técnica – KwikPost Vue Application

Esta documentación está escrita en **Markdown** y contiene todos los detalles necesarios para que una IA o cualquier desarrollador automatizado pueda generar el código de la aplicación en **Vue 3** siguiendo la PRA.

---

## 1. Presentación

Breve descripción del proyecto:

> Desarrollo de una Single Page Application (SPA) con **Vue 3**, que consuma la **KwikPost API** para gestionar usuarios, autenticación, posts y respuestas de modo sencillo y mobile-first.

**Stack tecnológico principal:**

* **Framework:** Vue 3 (Composition API)
* **Estado global:** Pinia
* **Routing:** Vue Router
* **HTTP Client:** Axios
* **Estilos:** Tailwind CSS
* **Herramientas de desarrollo:** Vite, ESLint, Prettier

---

## 2. Conocimientos, Habilidades y Competencias

**Competencias trabajadas en la PRA:**

* K1: Fundamentos de frameworks JS modernos
* K5: Uso de herramientas de construcción (Vite)
* S1: Creación de componentes con Composition API
* S2: Gestión de estado con Pinia
* S3: Configuración de rutas protegidas en Vue Router
* S7: Consumo de APIs REST y manejo de JWT
* C2: Diseño de interfaces mobile-first
* C5: Calidad de código (linters y formateadores)

---

## 3. Objetivos

1. Implementar una SPA completa en Vue 3 con autenticación JWT.
2. Gestionar un feed de posts con paginación y CRUD completo.
3. Mostrar perfil de usuario y detalle de posts con respuestas anidadas.
4. Preparar un vídeo de presentación de máximo 5 minutos.

---

## 4. Recursos de lectura

* **Libro:** Azaustre Rodríguez, C. *Conceptos y técnicas avanzadas de la programación web*. FUOC, 2024.
* **Documentación Vue 3:**

  * Template Syntax
  * Reactivity Fundamentals
  * Component Basics
* **Documentación Pinia:**

  * State, Getters, Actions

---

## 5. Formato de entrega

1. Archivo ZIP conteniendo la carpeta `src/` del proyecto (excluir `node_modules`).
2. Vídeo de demostración de la aplicación (duración ≤ 5 minutos, resolución ≥ 720p, incluir webcam y pantalla).

---

## 6. Criterios de evaluación

* **Desarrollo de la aplicación (8 puntos):**

  * Estructura HTML y Layout: 10%
  * Routing: 10%
  * Consumo de API REST: 20%
  * Formularios CRUD de posts: 20%
  * Login y gestión de usuario: 20%
  * Estado global con Pinia: 10%
  * Calidad de código: 10%
* **Vídeo de presentación (2 puntos):**

  * Claridad y síntesis: 60%
  * Calidad de la presentación: 20%
  * Visibilidad de la webcam: 20%
* **Extra (1 punto):** Implementación de respuestas anidadas (POST `/replies`).

---

## 7. Introducción

Aplicación inspirada en redes sociales ligeras (tipo Twitter/Mastodon), centrada en:

* Autenticación JWT con backend simulado.
* CRUD de posts y gestión de respuestas.
* Arquitectura SPA moderna.

---

## 8. Prerrequisitos

1. **KwikPost API:**

   * Clonar o situar la carpeta de la API.
   * Ejecutar `node api.js` para levantar el servidor en `http://localhost:3000`.
   * Datos se guardan en memoria; el token JWT se devuelve tras POST `/login`.

2. **Colección Postman:**

   * Url: `https://documenter.getpostman.com/view/16221291/2sAYkBsgF2`
   * Incluye ejemplos de todas las peticiones y respuestas.

---

## 9. Especificación de la API

### 9.1 Login

* **Método:** POST
* **Ruta:** `/login`
* **Body JSON:**

  ```json
  {
    "username": "<string>",
    "password": "<string>"
  }
  ```
* **Respuesta:**

  * Código 200 OK.
  * Header `Authorization: Bearer <jwt-token>`.

### 9.2 Usuarios

* **GET** `/user/:username`

  * **Headers:** `Authorization: Bearer <token>`
  * **Respuesta JSON:**

    ```json
    {
      "id": "<uuid>",
      "username": "<string>",
      "name": "<string>",
      "avatarUrl": "<url>",
      "bio": "<string>",
      "joinDate": "<ISO-date>"
    }
    ```

* **GET** `/user/:username/posts`

  * **Query Params:** `limit`, `offset`
  * **Headers:** `Authorization`
  * **Respuesta JSON:**

    ```json
    {
      "totalCount": <number>,
      "posts": [ { <post> }, ... ]
    }
    ```

### 9.3 Posts

* **GET** `/posts`

  * **Query Params:** `limit`, `offset`
  * **Headers:** `Authorization`
  * **Respuesta JSON:** igual a `/user/:username/posts` pero con todos los posts.

* **POST** `/posts`

  * **Body JSON:** `{ "content": "<string>" }`
  * **Headers:** `Authorization`
  * **Respuesta:** 201 Created.

* **GET** `/posts/:id`

  * **Headers:** `Authorization`
  * **Respuesta JSON:** post con campo `replies: [ { <reply> } ]`.

* **PUT** `/posts/:id`

  * **Body JSON:** `{ "content": "<string>" }`
  * **Headers:** `Authorization`
  * **Respuesta:** 200 OK.

* **DELETE** `/posts/:id`

  * **Headers:** `Authorization`
  * **Respuesta:** 204 No Content.

### 9.4 Respuestas

* **POST** `/replies`

  * **Body JSON:**

    ```json
    {
      "postId": "<uuid>",
      "content": "<string>"
    }
    ```
  * **Headers:** `Authorization`
  * **Respuesta:** 201 Created.

---

## 10. Menú de navegación y Rutas

```js
const routes = [
  { path: '/', component: HomeView, meta: { auth: true } },
  { path: '/login', component: LoginView },
  { path: '/profile/:username', component: ProfileView, meta: { auth: true } },
  { path: '/post/form/:id?', component: PostFormView, meta: { auth: true } },
  { path: '/post/:id', component: PostDetailView, meta: { auth: true } },
];

// Guard global:
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !sessionStore.isAuthenticated) {
    return next('/login');
  }
  next();
});
```

---

## 11. Vistas y Componentes

A continuación se describen las **especificaciones detalladas** de cada vista y componente, incluyendo **props**, **eventos**, **comportamiento** y **flujo de datos**.

### 11.1 Componentes Reutilizables

#### 11.1.1 PostCard

* **Descripción:** Muestra un resumen de un post en forma de tarjeta.
* **Props:**

  * `post` (Object, requerido): `{ id, author: { username, name, avatarUrl }, content, createdAt, replyCount }`.
  * `highlight` (Boolean, opcional): resalta la tarjeta (por ejemplo, post propio).
* **Emits:**

  * `click` (postId): al clicar en la tarjeta, emite el `id` para navegar a detalle.
* **Template:**

  * Avatar y nombre de autor.
  * Fecha formateada (e.g. `DD/MM/YYYY HH:mm`).
  * Contenido truncado a 140 caracteres.
  * Icono y contador de respuestas (`replyCount`).
* **Comportamiento:**

  * Hover: aplicar sombra y pointer cursor.

#### 11.1.2 PostList

* **Descripción:** Lista paginada de `PostCard`.
* **Props:**

  * `posts` (Array, requerido): lista de objetos `post`.
  * `totalCount` (Number, requerido): número total de posts disponibles.
  * `limit` (Number, requerido): tamaño de página.
  * `offset` (Number, requerido): desplazamiento actual.
* **Emits:**

  * `load-more`: cuando el usuario clica “Cargar más”.
  * `select-post` (postId): reenviado de `PostCard`.
* **Template:**

  * Renderiza un `PostCard` por cada elemento.
  * Botón “Cargar más” visible si `offset + limit < totalCount`.

#### 11.1.3 ReplyForm

* **Descripción:** Formulario para crear o editar una respuesta.
* **Props:**

  * `initialContent` (String, opcional): contenido para edición.
  * `postId` (String, requerido): ID del post al que responde.
* **Emits:**

  * `submit` (payload): `{ postId, content }`.
  * `cancel`: al cancelar edición.
* **Template:**

  * Textarea `content` con validación (no vacío, límite 280 chars).
  * Botones “Enviar” y “Cancelar”.
* **Comportamiento:**

  * Deshabilitar “Enviar” si `content` inválido.

### 11.2 LoginView

* **Ruta:** `/login`
* **Estado local:** `username` y `password` (reactive ref).
* **Componente hijo:** `LoginForm` (ver abajo).
* **Flujo:**

  1. Usuario introduce credenciales.
  2. Llama a `sessionStore.login({ username, password })`.
  3. En éxito, `router.push(`/profile/\${username}`)`.
  4. En error, mostrar mensaje bajo el formulario.

#### 11.2.1 LoginForm

* **Props:** Ninguna.
* **Emits:**

  * `submit` (credentials): `{ username, password }`.
* **Template:**

  * Inputs controlados para `username` y `password`.
  * Botón “Login” deshabilitado si campos vacíos.
* **Validación:** Ambos campos requeridos.

### 11.3 HomeView

* **Ruta:** `/`
* **Datos:** Llamada a `api.get('/posts', { params: { limit, offset } })`.
* **Estado:** `posts`, `limit`, `offset`, `totalCount`, `loading`.
* **Componentes:** `PostList`.
* **Flujo:**

  1. On mount: cargar `posts` con `offset = 0`.
  2. `PostList` emite `load-more` → incrementar `offset` y concatenar nuevos posts.
  3. `PostList` emite `select-post` → `router.push(`/post/\${id}`)`.

### 11.4 ProfileView

* **Ruta:** `/profile/:username`
* **Datos:**

  * `api.get('/user/' + username)` → `user`.
  * `api.get('/user/' + username + '/posts', { params })` → `posts`, `totalCount`.
* **Estado:** `user`, `posts`, `limit`, `offset`, `totalCount`, `loading`.
* **Componentes:** `UserProfileHeader`, `PostList`.

#### 11.4.1 UserProfileHeader

* **Props:** `user` (Object, requerido).
* **Template:**

  * Avatar grande.
  * Nombre y username.
  * Bio y fecha de unión formateada.

### 11.5 PostDetailView

* **Ruta:** `/post/:id`
* **Datos:** `api.get('/posts/' + id)` → `post` con campo `replies`.
* **Estado:** `post`, `loading`.
* **Componentes:** `PostCard` (para el post principal), lista de `PostCard` anidados o `ReplyForm`.
* **Flujo:**

  1. On mount: cargar `post`.
  2. Mostrar sección de respuestas:

     * Listar cada `reply` usando `PostCard` con indentación.
     * Incluir `ReplyForm` a pie para añadir nueva respuesta.
  3. Botones Editar/Borrar:

     * Si `post.author.username === session.user.username`, mostrar botones.
     * Editar → `router.push('/post/form/' + id)`.
     * Borrar → `api.delete('/posts/' + id)` y `router.push('/')`.

### 11.6 PostFormView

* **Ruta:** `/post/form/:id?`
* **Props de ruta:** `id` opcional.
* **Estado:** `content`, `isEdit`, `loading`, `error`.
* **Flujo:**

  1. Si `id` existe:

     * `isEdit = true`.
     * Cargar `api.get('/posts/' + id)` y precargar `content`.
  2. Formulario con `textarea` para `content` (validación: no vacío, max 280 chars).
  3. Botón “Guardar” deshabilitado si inválido.
  4. Al enviar:

     * Si `isEdit`: `api.put('/posts/' + id, { content })`.
     * Si creación: `api.post('/posts', { content })`.
  5. Redirigir a `router.push('/post/' + newId)` (usar `Location` header o respuesta).

### 11.7 Estructura de Archivos

```
src/
├── api/              # Cliente Axios configurado
├── components/
│   ├── PostCard.vue
│   ├── PostList.vue
│   ├── LoginForm.vue
│   ├── UserProfileHeader.vue
│   └── ReplyForm.vue
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── ProfileView.vue
│   ├── PostDetailView.vue
│   └── PostFormView.vue
├── router/           # routes.js, index.js
├── store/            # session.js
└── main.js
```

## 12. Gestión de Estado con Pinia Gestión de Estado con Pinia

```js
import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({ token: null, user: null }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      const res = await axios.post('/login', credentials);
      this.token = res.headers.authorization.split(' ')[1];
      this.user = await axios.get('/user/' + credentials.username, {
        headers: { Authorization: 'Bearer ' + this.token }
      }).then(r => r.data);
    },
    logout() {
      this.token = null; this.user = null;
    }
  }
});
```

---

## 13. Presentación en Vídeo

Guion recomendado (5 minutos):

1. **0:30** — Introducción al proyecto y objetivos.
2. **0:30** — Arquitectura general (Vue, Pinia, Router).
3. **1:30** — Principales componentes y flujo de datos.
4. **1:00** — Demo: login, feed, CRUD post.
5. **1:30** — Retos encontrados y lecciones aprendidas.

---

## 14. Anexos

### 14.1 Cliente Axios

```js
import axios from 'axios';
import { useSessionStore } from '@/store/session';

const session = useSessionStore();
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
api.interceptors.request.use(config => {
  if (session.token) {
    config.headers.Authorization = 'Bearer ' + session.token;
  }
  return config;
});
export default api;
```

### 14.2 Enrutamiento en `router/index.js`

```js
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useSessionStore } from '@/store/session';

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to, from, next) => {
  const session = useSessionStore();
  if (to.meta.auth && !session.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
export default router;
```

---

## 15. Perspectiva de Product Owner & CTO

| Fase           | Objetivos principales                          | Artefactos / Documentos a revisar                                       |
| -------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| Descubrimiento | Validar alcance y requisitos                   | Captura del enunciado PRA, criterios de evaluación, KSC                 |
| Planificación  | Roadmap, estimaciones y arquitectura           | Colección Postman API, diagrama de rutas                                |
| Diseño         | UI/UX, componentes, modelo de datos            | Wireframes, ER diagram, mockups                                         |
| Desarrollo     | Implementar features, calidad de código, CI/CD | Estructura de proyecto, ejemplos de Axios, configuración Vite & linters |
| Pruebas        | Cobertura unitaria, integración y e2e          | Plan de pruebas, casos y resultados                                     |
| Despliegue     | Pipeline CI/CD y rollback                      | Configuración GitHub Actions o Netlify/Vercel, checklist release        |
| Mantenimiento  | Monitoreo, soporte y evolución                 | Dashboards Sentry/Analytics, plan de actualizaciones de dependencias    |

---

*Fin de la documentación*
