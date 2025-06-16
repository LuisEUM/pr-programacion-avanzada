<!--
  ReplyForm.vue
  
  Componente para crear y editar respuestas a posts.
  
  Funcionalidad principal:
  - Permite crear nuevas respuestas a posts existentes
  - Soporte para edición de respuestas existentes (modo edición)
  - Validación en tiempo real del contenido (longitud y contenido vacío)
  - Contador de caracteres con límite de 280 caracteres
  - Manejo de estados de envío y cancelación
  
  Características:
  - Formulario adaptable (crear/editar) según props
  - Validación reactiva con mensajes de error
  - Contador visual de caracteres con indicador de límite
  - Botones contextuales según el modo de operación
  - Auto-actualización del contenido en modo edición
  - Limpieza automática del formulario tras envío exitoso
-->
<template>
  <div class="card p-4">
    <form @submit.prevent="handleSubmit">
      <!-- Campo de texto principal con validación -->
      <div class="mb-4">
        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
          {{ initialContent ? 'Editar respuesta' : 'Escribe una respuesta' }}
        </label>
        <textarea
          id="content"
          v-model="content"
          class="textarea"
          rows="3"
          placeholder="¿Qué piensas sobre esto?"
          :class="{ 'border-red-500': contentError }"
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
            class="text-sm"
            :class="content.length > 280 ? 'text-red-500' : 'text-gray-500'"
          >
            {{ content.length }}/280
          </span>
        </div>
      </div>
      
      <!-- Botones de acción contextuales -->
      <div class="flex justify-end space-x-2">
        <!-- Botón cancelar (solo en modo edición) -->
        <button
          v-if="initialContent"
          type="button"
          @click="$emit('cancel')"
          class="btn-secondary"
        >
          Cancelar
        </button>
        <!-- Botón de envío principal -->
        <button
          type="submit"
          :disabled="!isValid"
          class="btn-primary"
        >
          {{ initialContent ? 'Actualizar' : 'Responder' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Definición de props del componente
const props = defineProps({
  initialContent: {
    type: String,
    default: ''
  },
  postId: {
    type: String,
    required: true
  }
});

// Definición de eventos que puede emitir
const emit = defineEmits(['submit', 'cancel']);

// Estado reactivo del contenido del formulario
const content = ref(props.initialContent);

// Computed property para validación del contenido
// Maneja múltiples reglas de validación con mensajes específicos
const contentError = computed(() => {
  if (content.value.trim().length === 0) {
    return 'El contenido no puede estar vacío';
  }
  if (content.value.length > 280) {
    return 'El contenido no puede superar los 280 caracteres';
  }
  return null;
});

// Computed property para determinar si el formulario es válido
// Usado para habilitar/deshabilitar el botón de envío
const isValid = computed(() => {
  return content.value.trim().length > 0 && content.value.length <= 280;
});

// Manejador del envío del formulario
// Emite los datos necesarios y limpia el formulario si es creación nueva
const handleSubmit = () => {
  if (isValid.value) {
    emit('submit', {
      postId: props.postId,
      content: content.value.trim()
    });
    
    // Limpiar el formulario si no es edición (modo creación)
    if (!props.initialContent) {
      content.value = '';
    }
  }
};

// Watcher para actualizar el contenido cuando cambia la prop initialContent
// Necesario para el modo edición cuando se carga contenido existente
watch(() => props.initialContent, (newValue) => {
  content.value = newValue;
});
</script> 