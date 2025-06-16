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
    <AppHeader 
      :show-back-arrow="true" 
      title="Post"
      :show-home-icon="true"
      :show-logout-button="true"
    />

    <!-- Contenido principal del post -->
    <main class="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      <div class="space-y-6">
        <!-- Indicador de carga inicial -->
        <LoadingSpinner 
          v-if="loading" 
          message="Cargando post..." 
        />

        <!-- Contenido del post principal -->
        <div v-if="post" class="space-y-4">
          <!-- Tarjeta del post con información completa -->
          <div class="card p-6">
            <!-- Header con información del autor y timestamp -->
            <div class="flex items-center space-x-3 mb-4">
              <!-- Avatar del autor (más grande que en las tarjetas de lista) -->
              <UserAvatar 
                :src="post.author.avatarUrl" 
                :alt="`Avatar de ${post.author.name}`"
                size="lg"
              />
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
                <!-- Tarjeta individual de respuesta usando componente reutilizable -->
                <ReplyCard :reply="reply" />
              </div>
            </div>

            <!-- Estado vacío cuando no hay respuestas usando componente reutilizable -->
            <EmptyState
              v-else
              title="No hay respuestas aún"
              message="¡Sé el primero en responder a este post!"
              :show-action="false"
            />
          </div>
        </div>

        <!-- Mensaje de error -->
        <ErrorMessage v-if="errorMessage" :message="errorMessage" />
      </div>
    </main>

    <!-- Barra de navegación inferior para dispositivos móviles -->
    <MobileNavigation />

    <!-- Modal de confirmación para eliminación de post usando componente reutilizable -->
    <ConfirmationModal
      :show="showDeleteModal"
      title="¿Eliminar post?"
      message="Esta acción no se puede deshacer."
      cancel-text="Cancelar"
      confirm-text="Eliminar"
      type="danger"
      @cancel="showDeleteModal = false"
      @confirm="deletePost"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';
import api from '@/api';
import ReplyForm from '@/components/ReplyForm.vue';
import AppHeader from '@/components/AppHeader.vue';
import MobileNavigation from '@/components/MobileNavigation.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import ReplyCard from '@/components/ReplyCard.vue';
import EmptyState from '@/components/EmptyState.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

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