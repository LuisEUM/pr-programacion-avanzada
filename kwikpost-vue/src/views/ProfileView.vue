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
    <AppHeader 
      :show-back-arrow="true" 
      :show-floating-button="true"
      :show-home-icon="true"
      :hide-profile-avatar="isOwnProfile"
      :show-logout-button="true"
    />

    <!-- Contenido principal del perfil -->
    <main class="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      <div class="space-y-6">
        <!-- Indicador de carga para datos del usuario -->
        <LoadingSpinner 
          v-if="loadingUser" 
          message="Cargando perfil..." 
        />

        <!-- Componente de header del perfil con información del usuario -->
        <UserProfileHeader v-if="user" :user="user" />

        <!-- Sección de posts del usuario -->
        <div v-if="user">
          <!-- Título de la sección con nombre del usuario -->
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Posts de {{ user.name }}
          </h3>

          <!-- Indicador de carga para posts (solo cuando no hay posts cargados) -->
          <LoadingSpinner 
            v-if="loadingPosts && posts.length === 0" 
            message="Cargando posts..." 
          />

          <!-- Componente de lista de posts con paginación -->
          <PostList
            v-if="!loadingPosts || posts.length > 0"
            :posts="posts"
            :total-count="totalCount"
            :limit="limit"
            :offset="offset"
            @load-more="loadMorePosts"
            @select-post="goToPost"
            @create-post="goToCreatePost"
          />
        </div>

        <!-- Mensaje de error -->
        <ErrorMessage v-if="errorMessage" :message="errorMessage" />
      </div>
    </main>

    <!-- Barra de navegación inferior para dispositivos móviles -->
    <MobileNavigation />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';
import api from '@/api';
import UserProfileHeader from '@/components/UserProfileHeader.vue';
import PostList from '@/components/PostList.vue';
import AppHeader from '@/components/AppHeader.vue';
import MobileNavigation from '@/components/MobileNavigation.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

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

// Computed property para determinar si es el perfil del usuario actual
const isOwnProfile = computed(() => {
  return user.value?.username === sessionStore.user?.username;
});

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
 * Navegación para crear un nuevo post
 */
const goToCreatePost = () => {
  router.push('/post/form');
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