<!--
  HomeView.vue - Vista principal de la aplicación (Feed/Timeline)
  
  Funcionalidad principal:
  - Muestra el feed principal con todos los posts de la plataforma
  - Implementa paginación infinita con botón "Cargar más"
  - Proporciona navegación principal de la aplicación
  - Maneja estados de carga, error y contenido vacío
  - Incluye navegación responsive (desktop/mobile)
  
  Características clave:
  - Header sticky con navegación y acciones principales
  - Botón flotante para crear posts (responsive)
  - Barra de navegación inferior para móviles
  - Integración con store de sesión para autenticación
  - Monitoreo de estado de autenticación con watchers
  - Manejo de logout y redirecciones automáticas
-->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header principal con componente reutilizable -->
    <AppHeader 
      :show-default-content="true" 
      :show-floating-button="true"
      :show-logout-button="true"
    />

    <!-- Contenido principal del feed -->
    <main class="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      <div class="space-y-6">
        <!-- Título de la sección -->
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">Feed</h2>
          <p class="text-gray-600 mt-2">Descubre las últimas publicaciones</p>
        </div>

        <!-- Indicador de carga inicial (solo cuando no hay posts cargados) -->
        <LoadingSpinner 
          v-if="loading && posts.length === 0" 
          message="Cargando posts..." 
        />

        <!-- Componente de lista de posts con paginación -->
        <PostList
          v-if="!loading || posts.length > 0"
          :posts="posts"
          :total-count="totalCount"
          :limit="limit"
          :offset="offset"
          @load-more="loadMorePosts"
          @select-post="goToPost"
          @create-post="goToCreatePost"
        />

        <!-- Mensaje de error -->
        <ErrorMessage v-if="errorMessage" :message="errorMessage" />
      </div>
    </main>

    <!-- Barra de navegación inferior para dispositivos móviles -->
    <MobileNavigation />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';
import api from '@/api';
import PostList from '@/components/PostList.vue';
import AppHeader from '@/components/AppHeader.vue';
import MobileNavigation from '@/components/MobileNavigation.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

// Composables de Vue Router y store
const router = useRouter();
const sessionStore = useSessionStore();

// Estado reactivo para el feed de posts
const posts = ref([]); // Array de posts cargados
const totalCount = ref(0); // Total de posts disponibles en la API
const limit = ref(10); // Número de posts por página
const offset = ref(0); // Desplazamiento actual para paginación
const loading = ref(false); // Estado de carga
const errorMessage = ref(''); // Mensaje de error para mostrar al usuario

// Watcher para monitorear el estado de autenticación
// Si el usuario pierde la autenticación, redirigir al login
watch(() => sessionStore.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated) {
    console.log('User is no longer authenticated, redirecting to login');
    router.push('/login');
  }
}, { immediate: false });

/**
 * Función para cargar posts del feed principal
 * @param {boolean} append - Si true, agrega posts al array existente (paginación)
 */
const loadPosts = async (append = false) => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Petición a la API para obtener posts
    const response = await api.get('/posts', {
      params: {
        limit: limit.value,
        offset: append ? offset.value : 0 // Si es append, usar offset actual, sino empezar desde 0
      }
    });

    const data = response.data;
    
    // Manejar los datos según si es paginación o carga inicial
    if (append) {
      // Agregar nuevos posts al final del array existente
      posts.value = [...posts.value, ...data.posts];
    } else {
      // Reemplazar posts existentes (carga inicial o refresh)
      posts.value = data.posts;
      offset.value = 0;
    }
    
    // Actualizar el contador total
    totalCount.value = data.totalCount;
  } catch (error) {
    console.error('Error loading posts:', error);
    errorMessage.value = 'Error al cargar los posts. Por favor, intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

/**
 * Función para cargar más posts (paginación)
 * Incrementa el offset y carga posts adicionales
 */
const loadMorePosts = async () => {
  offset.value += limit.value;
  await loadPosts(true); // true = append mode
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
 * Limpia la sesión y redirige al login
 */
const handleLogout = () => {
  sessionStore.logout();
  router.push('/login');
};

// Cargar posts al montar el componente
onMounted(() => {
  loadPosts();
});
</script> 