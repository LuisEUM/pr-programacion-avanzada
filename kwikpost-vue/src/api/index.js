/**
 * api/index.js - Cliente HTTP configurado con Axios para comunicación con la API
 *
 * Funcionalidad principal:
 * - Configura cliente Axios con baseURL y interceptors
 * - Maneja autenticación automática con tokens JWT
 * - Transforma respuestas de la API al formato del frontend
 * - Proporciona métodos personalizados para endpoints específicos
 * - Maneja errores de autenticación y redirecciones
 *
 * Puntos clave:
 * - Interceptor de request para agregar token de autorización
 * - Interceptor de response para transformar datos y manejar errores
 * - Transformación bidireccional de datos (API ↔ Frontend)
 * - Manejo automático de sesiones expiradas (401)
 * - Métodos personalizados para operaciones CRUD de posts
 */

import axios from "axios";
import { useSessionStore } from "@/store/session";

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

/**
 * INTERCEPTOR DE REQUEST
 * Agrega automáticamente el token de autorización a todas las peticiones
 * Nota: La API espera el token sin el prefijo "Bearer"
 */
api.interceptors.request.use((config) => {
  const session = useSessionStore();
  if (session.token) {
    config.headers.Authorization = session.token; // Sin "Bearer" según requerimientos de la API
  }
  return config;
});

/**
 * INTERCEPTOR DE RESPONSE
 * Transforma las respuestas de la API al formato esperado por el frontend
 * y maneja errores de autenticación
 */
api.interceptors.response.use(
  (response) => {
    // EXCEPCIÓN: No transformar respuestas de login
    // Las respuestas de login ya vienen en el formato correcto
    if (response.config.url?.includes("/login")) {
      return response;
    }

    // TRANSFORMACIÓN 1: Respuestas de lista de posts con paginación
    if (response.data.paginator && response.data.result) {
      // Detectar si son posts de usuario específico
      const isUserPosts =
        response.config.url?.includes("/user/") &&
        response.config.url?.includes("/posts");

      // Transformar estructura de paginación de la API al formato del frontend
      response.data = {
        totalCount: response.data.paginator.total, // Mapear total de elementos
        posts: response.data.result.map((post) => {
          const transformedPost = transformPost(post);

          // CASO ESPECIAL: Posts de usuario sin información de autor
          // Si es posts de usuario y no tiene author, crear uno básico
          if (isUserPosts && !transformedPost.author && response.config.url) {
            const username = response.config.url
              .split("/user/")[1]
              ?.split("/")[0];
            if (username) {
              // Crear objeto author básico para posts de usuario
              transformedPost.author = {
                id: post.userId,
                username: username,
                name: username.charAt(0).toUpperCase() + username.slice(1),
                surname: "User",
                bio: "Usuario de KwikPost",
                avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
                joinDate: new Date().toISOString(),
              };
            }
          }

          return transformedPost;
        }),
      };
    }
    // TRANSFORMACIÓN 2: Respuesta de post individual
    else if (
      response.data.id &&
      response.data.content &&
      response.data.publishDate
    ) {
      response.data = transformPost(response.data);
    }
    // TRANSFORMACIÓN 3: Respuesta de usuario
    else if (response.data.username && response.data.profileImg) {
      response.data = transformUser(response.data);
    }

    return response;
  },
  (error) => {
    // MANEJO DE ERRORES: Sesiones expiradas o no autorizadas
    if (error.response?.status === 401) {
      console.log("Unauthorized access, clearing session");
      const session = useSessionStore();
      session.logout(); // Limpiar sesión local

      // Redirigir al login si no está ya en esa página
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/**
 * FUNCIÓN DE TRANSFORMACIÓN: Posts
 * Convierte la estructura de posts de la API al formato del frontend
 * @param {Object} post - Post en formato de la API
 * @returns {Object} - Post en formato del frontend
 */
function transformPost(post) {
  const transformed = {
    id: post.id,
    content: post.content,
    createdAt: post.publishDate, // Mapear publishDate -> createdAt
    replyCount: post.nReplies || 0, // Mapear nReplies -> replyCount
    likeCount: post.nLikes || 0, // Mapear nLikes -> likeCount
    replies: post.replies ? post.replies.map(transformPost) : [], // Transformación recursiva
  };

  // Solo agregar author si post.user existe (evitar errores)
  if (post.user) {
    transformed.author = transformUser(post.user);
  }

  return transformed;
}

/**
 * FUNCIÓN DE TRANSFORMACIÓN: Usuarios
 * Convierte la estructura de usuarios de la API al formato del frontend
 * @param {Object} user - Usuario en formato de la API
 * @returns {Object|null} - Usuario en formato del frontend
 */
function transformUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    surname: user.surname,
    bio: user.bio,
    avatarUrl: user.profileImg, // Transformación clave: profileImg -> avatarUrl
    joinDate: user.registrationDate, // Mapear registrationDate -> joinDate
  };
}

// ==================== MÉTODOS PERSONALIZADOS ====================
// Métodos específicos para operaciones CRUD de posts y usuarios

/**
 * Crear un nuevo post
 * @param {string} content - Contenido del post
 */
api.createPost = async (content) => {
  const response = await api.post("/post", { content });
  return response;
};

/**
 * Obtener un post específico por ID
 * @param {string} postId - ID del post
 */
api.getPost = async (postId) => {
  const response = await api.get(`/post/${postId}`);
  return response;
};

/**
 * Actualizar un post existente
 * @param {string} postId - ID del post
 * @param {string} content - Nuevo contenido
 */
api.updatePost = async (postId, content) => {
  const response = await api.put(`/post/${postId}`, { content });
  return response;
};

/**
 * Eliminar un post
 * @param {string} postId - ID del post
 */
api.deletePost = async (postId) => {
  const response = await api.delete(`/post/${postId}`);
  return response;
};

/**
 * Crear una respuesta a un post
 * @param {string} postId - ID del post padre
 * @param {string} content - Contenido de la respuesta
 */
api.createReply = async (postId, content) => {
  const response = await api.post(`/post/${postId}/reply`, { content });
  return response;
};

/**
 * Obtener información de un usuario
 * @param {string} username - Username del usuario
 */
api.getUser = async (username) => {
  const response = await api.get(`/user/${username}`);
  return response;
};

/**
 * Obtener posts de un usuario específico con paginación
 * @param {string} username - Username del usuario
 * @param {number} limit - Número de posts por página
 * @param {number} offset - Desplazamiento para paginación
 */
api.getUserPosts = async (username, limit = 10, offset = 0) => {
  const response = await api.get(`/user/${username}/posts`, {
    params: { limit, offset },
  });
  return response;
};

export default api;
