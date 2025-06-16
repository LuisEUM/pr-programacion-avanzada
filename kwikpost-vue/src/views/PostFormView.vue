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
    <AppHeader 
      :show-back-arrow="true" 
      :title="isEdit ? 'Editar Post' : 'Nuevo Post'"
      :show-home-icon="true"
      :show-logout-button="true"
    />

    <!-- Contenido principal del formulario -->
    <main class="max-w-2xl mx-auto px-4 py-6">
      <div class="space-y-6">
        <!-- Indicador de carga inicial (solo en modo edición) -->
        <LoadingSpinner 
          v-if="loading && isEdit" 
          message="Cargando post..." 
        />

        <!-- Formulario principal de post -->
        <div v-if="!loading || !isEdit" class="card p-6">
          <form @submit.prevent="handleSubmit">
            <!-- Campo de contenido con validación usando componente reutilizable -->
            <TextAreaField
              v-model="content"
              :label="isEdit ? 'Editar contenido' : 'Escribe tu post'"
              placeholder="¿Qué quieres compartir?"
              :rows="6"
              :disabled="submitting"
              :max-length="280"
              field-id="post-content"
            />
            
            <!-- Botones de acción usando componente reutilizable -->
            <FormActions
              v-if="!successMessage"
              :loading="submitting"
              :disabled="!isValid"
              cancel-text="Cancelar"
              :submit-text="isEdit ? 'Actualizar Post' : 'Publicar Post'"
              :loading-text="isEdit ? 'Actualizando...' : 'Publicando...'"
              @cancel="goBack"
              @submit="handleSubmit"
            />
          </form>
        </div>

        <!-- Mensaje de error -->
        <ErrorMessage v-if="errorMessage" :message="errorMessage" />

        <!-- Mensaje de éxito con indicador de redirección -->
        <SuccessMessage 
          v-if="successMessage" 
          :message="successMessage" 
          secondary-message="Redirigiendo..." 
        />
      </div>
    </main>

    <!-- Barra de navegación inferior para dispositivos móviles -->
    <MobileNavigation />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import AppHeader from '@/components/layout/AppHeader.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import ErrorMessage from '@/components/ui/ErrorMessage.vue';
import SuccessMessage from '@/components/ui/SuccessMessage.vue';
import TextAreaField from '@/components/forms/TextAreaField.vue';
import FormActions from '@/components/forms/FormActions.vue';
import MobileNavigation from '@/components/layout/MobileNavigation.vue';

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

// Computed property para validación del formulario (simplificado gracias al componente TextAreaField)
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