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
      <!-- Campo de texto principal con validación usando componente reutilizable -->
      <TextAreaField
        v-model="content"
        :label="initialContent ? 'Editar respuesta' : 'Escribe una respuesta'"
        placeholder="¿Qué piensas sobre esto?"
        :rows="3"
        :max-length="280"
        field-id="reply-content"
      />
      
      <!-- Botones de acción usando componente reutilizable -->
      <FormActions
        :disabled="!isValid"
        :cancel-text="'Cancelar'"
        :submit-text="initialContent ? 'Actualizar' : 'Responder'"
        :show-cancel="!!initialContent"
        @cancel="$emit('cancel')"
        @submit="handleSubmit"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import TextAreaField from './TextAreaField.vue';
import FormActions from './FormActions.vue';

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

// Computed property para determinar si el formulario es válido (simplificado gracias al componente TextAreaField)
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