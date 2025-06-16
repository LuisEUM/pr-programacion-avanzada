<!--
  PostFormView.vue - Vista para crear y editar posts
  
  Funcionalidad principal:
  - Formulario dual para crear nuevos posts o editar existentes
  - Validación en tiempo real del contenido con límite de caracteres
  - Manejo de estados de carga durante envío y procesamiento
  - Redirección automática tras operaciones exitosas
  
  Características clave:
  - Modo dual: creación (sin ID) vs edición (con ID en parámetros)
  - Validación de contenido con contador de caracteres visual
  - Estados de UI para carga, éxito y error
  - Carga automática de contenido existente en modo edición
  - Redirección inteligente tras operaciones exitosas
  - Manejo de permisos y errores de autorización
  - Interfaz responsive con navegación de regreso
-->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con navegación y título contextual -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Enlace de regreso al home -->
          <router-link to="/" class="text-xl font-bold text-gray-900 hover:text-primary-600">
            ← KwikPost
          </router-link>
          <!-- Título dinámico según el modo (crear/editar) -->
          <h1 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Editar Post' : 'Nuevo Post' }}
          </h1>
          <div></div>
        </div>
      </div>
    </header>

    <!-- Contenido principal del formulario -->
    <main class="max-w-2xl mx-auto px-4 py-6">
      <div class="space-y-6">
        <!-- Indicador de carga inicial (solo en modo edición) -->
        <div v-if="loading && isEdit" class="text-center py-8">
          <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando post...
          </div>
        </div>

        <!-- Formulario principal de post -->
        <div v-if="!loading || !isEdit" class="card p-6">
          <form @submit.prevent="handleSubmit">
            <!-- Campo de contenido con validación -->
            <div class="mb-6">
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                {{ isEdit ? 'Editar contenido' : 'Escribe tu post' }}
              </label>
              <textarea
                id="content"
                v-model="content"
                class="textarea"
                rows="6"
                placeholder="¿Qué quieres compartir?"
                :class="{ 'border-red-500': contentError }"
                :disabled="submitting"
              ></textarea>
              <!-- Área de feedback: errores y contador de caracteres -->
              <div class="flex justify-between items-center mt-2">
                <!-- Mensaje de error de validación -->
                <span 
                  v-if="contentError" 
                  class="text-red-500 text-sm"
                >
                  {{ contentError }}
                </span>
                <!-- Contador de caracteres con indicador visual de límite -->
                <span 
                  class="text-sm ml-auto"
                  :class="content.length > 280 ? 'text-red-500' : 'text-gray-500'"
                >
                  {{ content.length }}/280
                </span>
              </div>
            </div>
            
            <!-- Botones de acción (ocultos durante estado de éxito) -->
            <div v-if="!successMessage" class="flex justify-end space-x-4">
              <!-- Botón cancelar -->
              <button
                type="button"
                @click="goBack"
                class="btn-secondary"
                :disabled="submitting"
              >
                Cancelar
              </button>
              <!-- Botón de envío principal con estado de carga -->
              <button
                type="submit"
                :disabled="!isValid || submitting"
                class="btn-primary"
              >
                <!-- Estado de carga con spinner -->
                <span v-if="submitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isEdit ? 'Actualizando...' : 'Publicando...' }}
                </span>
                <!-- Estado normal -->
                <span v-else>
                  {{ isEdit ? 'Actualizar Post' : 'Publicar Post' }}
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="card p-4 bg-red-50 border-red-200">
          <p class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Mensaje de éxito con indicador de redirección -->
        <div v-if="successMessage" class="card p-4 bg-green-50 border-green-200">
          <p class="text-green-600 text-sm text-center font-medium">
            {{ successMessage }}
          </p>
          <p class="text-green-500 text-xs text-center mt-1">
            Redirigiendo...
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';

// Composables de Vue Router
const route = useRoute();
const router = useRouter();

// Estado reactivo del formulario
const content = ref(''); // Contenido del post
const loading = ref(false); // Estado de carga inicial (para edición)
const submitting = ref(false); // Estado de envío del formulario
const errorMessage = ref(''); // Mensajes de error
const successMessage = ref(''); // Mensajes de éxito
const postId = ref(route.params.id || null); // ID del post (si existe, es modo edición)

// Computed property para determinar el modo de operación
const isEdit = computed(() => !!postId.value);

/**
 * Función para resetear el estado del formulario
 * Útil al cambiar entre modos o al montar el componente
 */
const resetForm = () => {
  content.value = '';
  loading.value = false;
  submitting.value = false;
  errorMessage.value = '';
  successMessage.value = '';
};

// Computed properties para validación del formulario
const contentError = computed(() => {
  if (content.value.trim().length === 0) {
    return 'El contenido no puede estar vacío';
  }
  if (content.value.length > 280) {
    return 'El contenido no puede superar los 280 caracteres';
  }
  return null;
});

const isValid = computed(() => {
  return content.value.trim().length > 0 && content.value.length <= 280;
});

/**
 * Cargar contenido del post existente (solo en modo edición)
 */
const loadPost = async () => {
  if (!isEdit.value) return;
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await api.getPost(postId.value);
    content.value = response.data.content;
  } catch (error) {
    console.error('Error loading post:', error);
    errorMessage.value = 'Error al cargar el post para editar.';
  } finally {
    loading.value = false;
  }
};

/**
 * Manejador principal del envío del formulario
 * Maneja tanto creación como edición de posts
 */
const handleSubmit = async () => {
  if (!isValid.value) return;
  
  submitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    if (isEdit.value) {
      // MODO EDICIÓN: Actualizar post existente
      await api.updatePost(postId.value, content.value.trim());
      successMessage.value = '¡Post actualizado exitosamente!';
      
      // Redireccionar al post después de 1.5 segundos
      setTimeout(() => {
        router.push(`/post/${postId.value}`);
      }, 1500);
    } else {
      // MODO CREACIÓN: Crear nuevo post
      console.log('Creando nuevo post...');
      const response = await api.createPost(content.value.trim());
      console.log('Respuesta del API:', response.data);
      
      successMessage.value = '¡Post creado exitosamente!';
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        // Intentar ir al post específico, si no, ir a inicio
        const newPostId = response.data?.id;
        if (newPostId) {
          router.push(`/post/${newPostId}`);
        } else {
          router.push('/');
        }
      }, 2000);
    }
  } catch (error) {
    console.error('Error saving post:', error);
    console.error('Error details:', error.response);
    
    // Manejo específico de errores de autorización
    if (error.response?.status === 403) {
      errorMessage.value = 'No tienes permisos para realizar esta acción.';
    } else {
      errorMessage.value = isEdit.value 
        ? 'Error al actualizar el post. Por favor, intenta de nuevo.'
        : 'Error al crear el post. Por favor, intenta de nuevo.';
    }
    submitting.value = false;
  }
};

/**
 * Función de navegación de regreso
 * Redirige al post específico (en edición) o al home (en creación)
 */
const goBack = () => {
  if (isEdit.value && postId.value) {
    router.push(`/post/${postId.value}`);
  } else {
    router.push('/');
  }
};

// Watcher para resetear el formulario cuando cambie la ruta
// Necesario para manejar navegación entre crear/editar diferentes posts
watch(() => route.params.id, (newId) => {
  postId.value = newId || null;
  resetForm();
  
  if (isEdit.value) {
    loadPost();
  }
});

// Inicialización del componente
onMounted(() => {
  // Limpiar estado al montar el componente
  resetForm();
  
  // Cargar post si está en modo edición
  if (isEdit.value) {
    loadPost();
  }
});
</script> 