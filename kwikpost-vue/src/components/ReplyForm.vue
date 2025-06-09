<template>
  <div class="card p-4">
    <form @submit.prevent="handleSubmit">
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
        <div class="flex justify-between items-center mt-2">
          <span 
            v-if="contentError" 
            class="text-red-500 text-sm"
          >
            {{ contentError }}
          </span>
          <span 
            class="text-sm"
            :class="content.length > 280 ? 'text-red-500' : 'text-gray-500'"
          >
            {{ content.length }}/280
          </span>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2">
        <button
          v-if="initialContent"
          type="button"
          @click="$emit('cancel')"
          class="btn-secondary"
        >
          Cancelar
        </button>
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

const emit = defineEmits(['submit', 'cancel']);

const content = ref(props.initialContent);

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

const handleSubmit = () => {
  if (isValid.value) {
    emit('submit', {
      postId: props.postId,
      content: content.value.trim()
    });
    
    // Limpiar el formulario si no es edición
    if (!props.initialContent) {
      content.value = '';
    }
  }
};

// Actualizar contenido si cambia la prop initialContent
watch(() => props.initialContent, (newValue) => {
  content.value = newValue;
});
</script> 