/**
 * router/index.js - Configuración principal del router Vue Router
 *
 * Funcionalidad principal:
 * - Configura el router con historial web y rutas importadas
 * - Implementa guards de navegación para proteger rutas autenticadas
 * - Maneja redirecciones automáticas basadas en estado de autenticación
 * - Valida parámetros de rutas para prevenir errores
 *
 * Puntos clave:
 * - Guard global beforeEach para todas las navegaciones
 * - Integración con store de sesión para verificar autenticación
 * - Logging detallado para debugging de navegación
 * - Validación de parámetros de usuario en rutas de perfil
 * - Prevención de acceso a login cuando ya está autenticado
 */

import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useSessionStore } from "@/store/session";

// Crear instancia del router con configuración de historial web
const router = createRouter({
  history: createWebHistory(), // Usa HTML5 History API para URLs limpias
  routes, // Importar rutas desde archivo separado
});

/**
 * Guard global de navegación - Se ejecuta antes de cada cambio de ruta
 * Funcionalidad:
 * - Protege rutas que requieren autenticación
 * - Redirige usuarios no autenticados al login
 * - Previene acceso al login si ya está autenticado
 * - Valida parámetros de rutas específicas
 */
router.beforeEach((to, from, next) => {
  // Obtener instancia del store de sesión
  const session = useSessionStore();

  // Logging detallado para debugging de navegación
  console.log("Router guard:", {
    to: to.path,
    from: from.path,
    isAuthenticated: session.isAuthenticated,
    hasUser: !!session.user,
    hasUsername: !!session.user?.username,
    token: !!session.token,
  });

  // GUARD 1: Protección de rutas autenticadas
  // Si la ruta requiere autenticación y no hay sesión válida
  if (to.meta.auth && (!session.isAuthenticated || !session.user?.username)) {
    console.log(
      "Redirecting to login - not authenticated or no valid user data"
    );
    next("/login"); // Redirigir al login
    return;
  }

  // GUARD 2: Prevenir acceso al login si ya está autenticado
  // Si ya está autenticado y trata de ir al login, redirigir al home
  if (
    to.name === "login" &&
    session.isAuthenticated &&
    session.user?.username
  ) {
    console.log("Redirecting to home - already authenticated");
    next("/"); // Redirigir al home
    return;
  }

  // GUARD 3: Validación específica de rutas de perfil
  // Validar rutas de perfil para prevenir parámetros inválidos
  if (to.path.startsWith("/profile/") && to.params.username) {
    // Verificar que el username no sea undefined o null (strings literales)
    if (to.params.username === "undefined" || to.params.username === "null") {
      console.log("Invalid profile username, redirecting to home");
      next("/"); // Redirigir al home si el username es inválido
      return;
    }
  }

  // Si pasa todas las validaciones, permitir la navegación
  next();
});

export default router;
