import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useSessionStore } from "@/store/session";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global para proteger rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const session = useSessionStore();

  if (to.meta.auth && !session.isAuthenticated) {
    next("/login");
  } else if (to.name === "login" && session.isAuthenticated) {
    // Si ya está autenticado y trata de ir al login, redirigir al perfil
    next(`/profile/${session.user.username}`);
  } else {
    next();
  }
});

export default router;
