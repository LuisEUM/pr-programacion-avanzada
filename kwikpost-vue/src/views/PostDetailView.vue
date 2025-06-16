<!--
  PostDetailView.vue - Vista detallada de un post individual
  
  Funcionalidad principal:
  - Muestra el contenido completo de un post específico
  - Permite ver y crear respuestas al post
  - Proporciona opciones de edición/eliminación para el autor
  - Maneja la navegación y confirmación de acciones destructivas
  
  Características clave:
  - Vista completa del post sin truncamiento de contenido
  - Sistema de respuestas anidadas con formulario integrado
  - Controles de autor (editar/eliminar) con validación de permisos
  - Modal de confirmación para eliminación de posts
  - Navegación responsive con barra inferior móvil
  - Integración completa con la API para CRUD de posts y respuestas
  - Manejo de estados de carga y errores
-->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con navegación de regreso -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Enlace de regreso al home con indicador visual -->
          <router-link to="/" class="text-xl font-bold text-gray-900 hover:text-primary-600">
            ← KwikPost
          </router-link>
          <!-- Título de la sección -->
          <h1 class="text-lg font-semibold text-gray-900">Post</h1>
          <div></div>
        </div>
      </div>
    </header>

    <!-- Contenido principal del post -->
    <main class="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      <div class="space-y-6">
        <!-- Indicador de carga inicial -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando post...
          </div>
        </div>

        <!-- Contenido del post principal -->
        <div v-if="post" class="space-y-4">
          <!-- Tarjeta del post con información completa -->
          <div class="card p-6">
            <!-- Header con información del autor y timestamp -->
            <div class="flex items-center space-x-3 mb-4">
              <!-- Avatar del autor (más grande que en las tarjetas de lista) -->
              <img 
                :src="post.author.avatarUrl" 
                :alt="`Avatar de ${post.author.name}`"
                class="w-12 h-12 rounded-full object-cover"
              >
              <div class="flex-grow">
                <h3 class="font-semibold text-gray-900">{{ post.author.name }}</h3>
                <p class="text-sm text-gray-500">@{{ post.author.username }}</p>
              </div>
              <!-- Fecha de publicación -->
              <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
            </div>

            <!-- Contenido completo del post (sin truncamiento) -->
            <div class="mb-4">
              <p class="text-gray-800 text-lg leading-relaxed">{{ post.content }}</p>
            </div>

            <!-- Botones de acción (solo visibles para el autor del post) -->
            <div v-if="isAuthor" class="flex space-x-2 pt-4 border-t border-gray-200">
              <!-- Botón de edición -->
              <router-link 
                :to="`/post/form/${post.id}`"
                class="btn-secondary"
              >
                Editar
              </router-link>
              <!-- Botón de eliminación con confirmación -->
              <button 
                @click="confirmDelete"
                class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>

          <!-- Sección de respuestas al post -->
          <div class="space-y-4">
            <!-- Título de la sección con contador -->
            <h3 class="text-lg font-semibold text-gray-900">
              Respuestas ({{ post.replies?.length || 0 }})
            </h3>

            <!-- Formulario para crear nueva respuesta -->
            <ReplyForm 
              :post-id="post.id"
              @submit="handleNewReply"
            />

            <!-- Lista de respuestas existentes -->
            <div v-if="post.replies && post.replies.length > 0" class="space-y-3">
              <div 
                v-for="reply in post.replies" 
                :key="reply.id"
                class="ml-4 border-l-2 border-gray-200 pl-4"
              >
                <!-- Tarjeta individual de respuesta -->
                <div class="card p-4">
                  <!-- Header de la respuesta con información del autor -->
                  <div class="flex items-center space-x-3 mb-3">
                    <!-- Avatar del autor de la respuesta (más pequeño) -->
                    <img 
                      :src="reply.author.avatarUrl" 
                      :alt="`Avatar de ${reply.author.name}`"
                      class="w-8 h-8 rounded-full object-cover"
                    >
                    <div>
                      <h4 class="font-medium text-gray-900 text-sm">{{ reply.author.name }}</h4>
                      <p class="text-xs text-gray-500">@{{ reply.author.username }}</p>
                    </div>
                    <div class="flex-grow"></div>
                    <!-- Timestamp de la respuesta -->
                    <span class="text-xs text-gray-500">{{ formatDate(reply.createdAt) }}</span>
                  </div>

                  <!-- Contenido de la respuesta -->
                  <p class="text-gray-800 text-sm leading-relaxed">{{ reply.content }}</p>
                </div>
              </div>
            </div>

            <!-- Estado vacío cuando no hay respuestas -->
            <div v-else class="text-center py-6 text-gray-500">
              <p>No hay respuestas aún. ¡Sé el primero en responder!</p>
            </div>
          </div>
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
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
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
        
        <!-- Perfil del usuario -->
        <router-link 
          v-if="sessionStore.user?.username"
          :to="`/profile/${sessionStore.user.username}`"
          class="flex flex-col items-center p-2 text-gray-400"
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

    <!-- Modal de confirmación para eliminación de post -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <!-- Título del modal -->
        <h3 class="text-lg font-semibold text-gray-900 mb-4">¿Eliminar post?</h3>
        <!-- Mensaje de advertencia -->
        <p class="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
        <!-- Botones de acción -->
        <div class="flex space-x-4">
          <!-- Cancelar eliminación -->
          <button 
            @click="showDeleteModal = false"
            class="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <!-- Confirmar eliminación -->
          <button 
            @click="deletePost"
            class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex-1"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';
import api from '@/api';
import ReplyForm from '@/components/ReplyForm.vue';

// Composables de Vue Router y store
const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

// Estado reactivo del componente
const post = ref(null); // Datos del post cargado
const loading = ref(false); // Estado de carga
const errorMessage = ref(''); // Mensajes de error
const showDeleteModal = ref(false); // Control del modal de confirmación

// Computed property para determinar si el usuario actual es el autor del post
const isAuthor = computed(() => {
  return post.value?.author.username === sessionStore.user?.username;
});

/**
 * Función para cargar los datos del post desde la API
 * Incluye manejo de errores específicos (404, etc.)
 */
const loadPost = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Obtener post por ID desde los parámetros de la ruta
    const response = await api.getPost(route.params.id);
    post.value = response.data;
  } catch (error) {
    console.error('Error loading post:', error);
    // Manejo específico de errores
    if (error.response?.status === 404) {
      errorMessage.value = 'Post no encontrado.';
    } else {
      errorMessage.value = 'Error al cargar el post. Por favor, intenta de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};

/**
 * Manejador para crear nueva respuesta al post
 * Recarga el post para mostrar la respuesta actualizada
 * @param {Object} replyData - Datos de la respuesta (postId, content)
 */
const handleNewReply = async (replyData) => {
  try {
    // Crear respuesta usando la API
    await api.createReply(replyData.postId, replyData.content);
    // Recargar el post para obtener las respuestas actualizadas
    await loadPost();
  } catch (error) {
    console.error('Error creating reply:', error);
    errorMessage.value = 'Error al crear la respuesta. Por favor, intenta de nuevo.';
  }
};

/**
 * Mostrar modal de confirmación para eliminación
 */
const confirmDelete = () => {
  showDeleteModal.value = true;
};

/**
 * Eliminar el post tras confirmación
 * Redirige al home tras eliminación exitosa
 */
const deletePost = async () => {
  try {
    await api.deletePost(post.value.id);
    // Redirigir al home tras eliminación exitosa
    router.push('/');
  } catch (error) {
    console.error('Error deleting post:', error);
    errorMessage.value = 'Error al eliminar el post. Por favor, intenta de nuevo.';
    // Cerrar modal en caso de error
    showDeleteModal.value = false;
  }
};

/**
 * Manejo del logout
 */
const handleLogout = () => {
  sessionStore.logout();
  router.push('/login');
};

/**
 * Función utilitaria para formatear fechas
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada en español
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Cargar post al montar el componente
onMounted(() => {
  loadPost();
});
</script> 