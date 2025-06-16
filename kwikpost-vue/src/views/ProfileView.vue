<!--
  ProfileView.vue - Vista del perfil de usuario
  
  Funcionalidad principal:
  - Muestra la información completa del perfil de un usuario específico
  - Lista todos los posts del usuario con paginación
  - Proporciona navegación a posts individuales
  - Maneja la carga de datos de usuario y sus posts por separado
  
  Características clave:
  - Carga dinámica basada en parámetro de ruta (username)
  - Dos estados de carga independientes (usuario y posts)
  - Integración con componentes UserProfileHeader y PostList
  - Paginación de posts del usuario
  - Manejo de datos de autor para posts sin información completa
  - Navegación responsive con barra inferior móvil
  - Watcher para cambios de usuario en la ruta
  - Botón flotante para crear posts
-->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con navegación y acciones -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Enlace de regreso al home -->
          <router-link to="/" class="text-xl font-bold text-gray-900 hover:text-primary-600">
            ← KwikPost
          </router-link>
          <div class="flex items-center space-x-3">
            <!-- Botón para crear nuevo post - responsive (flotante en mobile, inline en desktop) -->
            <router-link 
              to="/post/form"
              class="fixed bottom-20 right-6 bg-primary-500 hover:bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 z-50 md:relative md:bottom-0 md:right-0 md:w-auto md:h-auto md:rounded-lg md:px-4 md:py-2"
            >
              <svg class="w-6 h-6 md:w-5 md:h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden md:inline">Nuevo Post</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal del perfil -->
    <main class="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      <div class="space-y-6">
        <!-- Indicador de carga para datos del usuario -->
        <div v-if="loadingUser" class="text-center py-8">
          <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando perfil...
          </div>
        </div>

        <!-- Componente de header del perfil con información del usuario -->
        <UserProfileHeader v-if="user" :user="user" />

        <!-- Sección de posts del usuario -->
        <div v-if="user">
          <!-- Título de la sección con nombre del usuario -->
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Posts de {{ user.name }}
          </h3>

          <!-- Indicador de carga para posts (solo cuando no hay posts cargados) -->
          <div v-if="loadingPosts && posts.length === 0" class="text-center py-8">
            <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando posts...
            </div>
          </div>

          <!-- Componente de lista de posts con paginación -->
          <PostList
            v-if="!loadingPosts || posts.length > 0"
            :posts="posts"
            :total-count="totalCount"
            :limit="limit"
            :offset="offset"
            @load-more="loadMorePosts"
            @select-post="goToPost"
          />
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="card p-4 bg-red-50 border-red-200">
          <p class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </main>

    <!-- Barra de navegación inferior para dispositivos móviles -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div class="flex items-center justify-around py-2">
        <!-- Home -->
        <router-link 
          to="/" 
          class="flex flex-col items-center p-2 text-gray-400"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </router-link>
        
        <!-- Perfil (activo cuando se está viendo el perfil del usuario logueado) -->
        <router-link 
          v-if="sessionStore.user?.username"
          :to="`/profile/${sessionStore.user.username}`"
          class="flex flex-col items-center p-2 text-primary-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </router-link>
        
        <!-- Botón de logout -->
        <button 
          @click="handleLogout"
          class="flex flex-col items-center p-2 text-gray-400"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';
import api from '@/api';
import UserProfileHeader from '@/components/UserProfileHeader.vue';
import PostList from '@/components/PostList.vue';

// Composables de Vue Router y store
const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

// Estado reactivo del componente
const user = ref(null); // Datos del usuario del perfil
const posts = ref([]); // Posts del usuario
const totalCount = ref(0); // Total de posts del usuario
const limit = ref(10); // Posts por página
const offset = ref(0); // Desplazamiento para paginación
const loadingUser = ref(false); // Estado de carga del usuario
const loadingPosts = ref(false); // Estado de carga de posts
const errorMessage = ref(''); // Mensajes de error

/**
 * Función para cargar los datos del usuario desde la API
 * Automáticamente carga los posts después de cargar el usuario
 */
const loadUser = async () => {
  loadingUser.value = true;
  errorMessage.value = '';
  
  try {
    // Obtener datos del usuario por username
    const response = await api.getUser(route.params.username);
    user.value = response.data;
    
    // Cargar posts después de cargar el usuario exitosamente
    await loadPosts();
  } catch (error) {
    console.error('Error loading user:', error);
    errorMessage.value = 'Error al cargar el perfil del usuario.';
  } finally {
    loadingUser.value = false;
  }
};

/**
 * Función para cargar los posts del usuario
 * @param {boolean} append - Si true, agrega posts al array existente (paginación)
 */
const loadPosts = async (append = false) => {
  loadingPosts.value = true;
  
  try {
    // Obtener posts del usuario con paginación
    const response = await api.getUserPosts(route.params.username, limit.value, append ? offset.value : 0);

    const data = response.data;
    
    // Procesar posts y agregar información del usuario si falta
    // Algunos posts pueden no tener información completa del autor
    const postsWithAuthor = data.posts.map(post => {
      if (!post.author && user.value) {
        // Si el post no tiene autor, usar los datos del usuario del perfil
        return {
          ...post,
          author: user.value
        };
      }
      return post;
    });
    
    // Manejar los datos según si es paginación o carga inicial
    if (append) {
      // Agregar nuevos posts al final del array existente
      posts.value = [...posts.value, ...postsWithAuthor];
    } else {
      // Reemplazar posts existentes (carga inicial)
      posts.value = postsWithAuthor;
      offset.value = 0;
    }
    
    // Actualizar contador total
    totalCount.value = data.totalCount;
  } catch (error) {
    console.error('Error loading user posts:', error);
    errorMessage.value = 'Error al cargar los posts del usuario.';
  } finally {
    loadingPosts.value = false;
  }
};

/**
 * Función para cargar más posts (paginación)
 * Solo carga si hay más posts disponibles
 */
const loadMorePosts = () => {
  if (offset.value + limit.value < totalCount.value) {
    offset.value += limit.value;
    loadPosts(true); // true = append mode
  }
};

/**
 * Navegación a un post específico
 * @param {string} postId - ID del post a mostrar
 */
const goToPost = (postId) => {
  router.push(`/post/${postId}`);
};

/**
 * Manejo del logout
 */
const handleLogout = () => {
  sessionStore.logout();
  router.push('/login');
};

// Watcher para cargar datos cuando cambie el username en la ruta
// Permite navegar entre diferentes perfiles sin recargar el componente
watch(() => route.params.username, () => {
  if (route.params.username) {
    // Resetear estado antes de cargar nuevo usuario
    user.value = null;
    posts.value = [];
    totalCount.value = 0;
    offset.value = 0;
    
    // Cargar datos del nuevo usuario
    // loadUser() automáticamente cargará los posts
    loadUser();
  }
});

// Inicialización del componente
onMounted(() => {
  if (route.params.username) {
    loadUser();
  }
});
</script> 