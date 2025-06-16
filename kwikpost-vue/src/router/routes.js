/**
 * routes.js - Configuración de rutas de la aplicación Vue Router
 *
 * Funcionalidad principal:
 * - Define todas las rutas disponibles en la aplicación
 * - Especifica qué componentes se renderizan para cada ruta
 * - Configura metadatos de autenticación para proteger rutas
 * - Establece nombres de rutas para navegación programática
 *
 * Puntos clave:
 * - Separación de rutas públicas (login) y privadas (resto)
 * - Uso de meta.auth para marcar rutas que requieren autenticación
 * - Parámetros dinámicos para rutas de perfil y posts
 * - Estructura RESTful para las rutas de la API
 */

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PostFormView from "@/views/PostFormView.vue";
import PostDetailView from "@/views/PostDetailView.vue";

const routes = [
  {
    // Ruta principal - Timeline/Feed de posts
    path: "/",
    component: HomeView,
    meta: { auth: true }, // Requiere autenticación
    name: "home",
  },
  {
    // Ruta de autenticación - Única ruta pública
    path: "/login",
    component: LoginView,
    name: "login",
    // No tiene meta.auth, por lo que es accesible sin autenticación
  },
  {
    // Ruta de perfil de usuario con parámetro dinámico
    path: "/profile/:username",
    component: ProfileView,
    meta: { auth: true }, // Requiere autenticación
    name: "profile",
    // :username permite acceder a perfiles específicos (/profile/johndoe)
  },
  {
    // Ruta para crear/editar posts
    path: "/post/form/:id?",
    component: PostFormView,
    meta: { auth: true }, // Requiere autenticación
    name: "post-form",
    // :id? es opcional - sin ID = crear, con ID = editar
  },
  {
    // Ruta para ver detalle de un post específico
    path: "/post/:id",
    component: PostDetailView,
    meta: { auth: true }, // Requiere autenticación
    name: "post-detail",
    // :id identifica el post específico a mostrar
  },
];

export default routes;
