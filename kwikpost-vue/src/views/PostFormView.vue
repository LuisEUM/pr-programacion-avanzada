<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="text-xl font-bold text-gray-900 hover:text-primary-600">
            ← KwikPost
          </router-link>
          <h1 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Editar Post' : 'Nuevo Post' }}
          </h1>
          <div></div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-2xl mx-auto px-4 py-6">
      <div class="space-y-6">
        <!-- Indicador de carga inicial -->
        <div v-if="loading && isEdit" class="text-center py-8">
          <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando post...
          </div>
        </div>

        <!-- Formulario de post -->
        <div v-if="!loading || !isEdit" class="card p-6">
          <form @submit.prevent="handleSubmit">
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
              ></textarea>
              <div class="flex justify-between items-center mt-2">
                <span 
                  v-if="contentError" 
                  class="text-red-500 text-sm"
                >
                  {{ contentError }}
                </span>
                <span 
                  class="text-sm ml-auto"
                  :class="content.length > 280 ? 'text-red-500' : 'text-gray-500'"
                >
                  {{ content.length }}/280
                </span>
              </div>
            </div>
            
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="goBack"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="!isValid || submitting"
                class="btn-primary"
              >
                <span v-if="submitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isEdit ? 'Actualizando...' : 'Publicando...' }}
                </span>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';

const route = useRoute();
const router = useRouter();

const content = ref('');
const loading = ref(false);
const submitting = ref(false);
const errorMessage = ref('');
const postId = ref(route.params.id || null);

const isEdit = computed(() => !!postId.value);

// Validaciones
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

const loadPost = async () => {
  if (!isEdit.value) return;
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await api.get(`/posts/${postId.value}`);
    content.value = response.data.content;
  } catch (error) {
    console.error('Error loading post:', error);
    errorMessage.value = 'Error al cargar el post para editar.';
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!isValid.value) return;
  
  submitting.value = true;
  errorMessage.value = '';
  
  try {
    if (isEdit.value) {
      // Actualizar post existente
      await api.put(`/posts/${postId.value}`, {
        content: content.value.trim()
      });
      router.push(`/post/${postId.value}`);
    } else {
      // Crear nuevo post
      const response = await api.post('/posts', {
        content: content.value.trim()
      });
      
      // El API debería devolver el ID del post creado en la respuesta o header Location
      const newPostId = response.data?.id || response.headers?.location?.split('/').pop();
      
      if (newPostId) {
        router.push(`/post/${newPostId}`);
      } else {
        router.push('/');
      }
    }
  } catch (error) {
    console.error('Error saving post:', error);
    if (error.response?.status === 403) {
      errorMessage.value = 'No tienes permisos para realizar esta acción.';
    } else {
      errorMessage.value = isEdit.value 
        ? 'Error al actualizar el post. Por favor, intenta de nuevo.'
        : 'Error al crear el post. Por favor, intenta de nuevo.';
    }
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  if (isEdit.value && postId.value) {
    router.push(`/post/${postId.value}`);
  } else {
    router.push('/');
  }
};

onMounted(() => {
  if (isEdit.value) {
    loadPost();
  }
});
</script> 