<!--
  TextAreaField.vue - Campo de textarea reutilizable con validación
  
  Funcionalidad principal:
  - Campo de textarea con label personalizable
  - Validación en tiempo real con mensajes de error
  - Contador de caracteres con límite configurable
  - Estados de disabled y error visual
  - Placeholder personalizable
  
  Características clave:
  - Props configurables para personalización completa
  - Validación automática con reglas predefinidas
  - Indicador visual de límite de caracteres
  - Integración con v-model para reactividad
  - Estilos consistentes con el sistema de diseño
-->
<template>
  <div class="mb-6">
    <!-- Label del campo -->
    <label :for="fieldId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    
    <!-- Campo de textarea -->
    <textarea
      :id="fieldId"
      :value="modelValue"
      @input="handleInput"
      @blur="hasInteracted = true"
      class="textarea"
      :rows="rows"
      :placeholder="placeholder"
      :class="{ 'border-red-500': hasError }"
      :disabled="disabled"
    ></textarea>
    
    <!-- Área de feedback: errores y contador de caracteres -->
    <div class="flex justify-between items-center mt-2">
      <!-- Mensaje de error de validación -->
      <span 
        v-if="errorMessage" 
        class="text-red-500 text-sm"
      >
        {{ errorMessage }}
      </span>
      
      <!-- Contador de caracteres con indicador visual de límite -->
      <span 
        v-if="showCharacterCount"
        class="text-sm ml-auto"
        :class="isOverLimit ? 'text-red-500' : 'text-gray-500'"
      >
        {{ characterCount }}/{{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

// Estado interno para tracking de interacción
const hasInteracted = ref(false);

// Props del componente
const props = defineProps({
  // Valor del campo (v-model)
  modelValue: {
    type: String,
    default: ''
  },
  // Label del campo
  label: {
    type: String,
    required: true
  },
  // Placeholder del textarea
  placeholder: {
    type: String,
    default: ''
  },
  // Número de filas del textarea
  rows: {
    type: Number,
    default: 4
  },
  // Límite máximo de caracteres
  maxLength: {
    type: Number,
    default: 280
  },
  // Si el campo está deshabilitado
  disabled: {
    type: Boolean,
    default: false
  },
  // Si mostrar el contador de caracteres
  showCharacterCount: {
    type: Boolean,
    default: true
  },
  // Si es requerido
  required: {
    type: Boolean,
    default: true
  },
  // ID único del campo
  fieldId: {
    type: String,
    default: () => `textarea-${Math.random().toString(36).substr(2, 9)}`
  }
});

// Eventos que emite el componente
const emit = defineEmits(['update:modelValue']);

// Computed properties para validación y estado
const characterCount = computed(() => props.modelValue.length);
const isOverLimit = computed(() => characterCount.value > props.maxLength);
const isEmpty = computed(() => props.modelValue.trim().length === 0);

const errorMessage = computed(() => {
  // Solo mostrar errores después de la primera interacción
  if (!hasInteracted.value) {
    return null;
  }
  
  if (props.required && isEmpty.value) {
    return 'El contenido no puede estar vacío';
  }
  if (isOverLimit.value) {
    return `El contenido no puede superar los ${props.maxLength} caracteres`;
  }
  return null;
});

const hasError = computed(() => !!errorMessage.value);

// Función para manejar input y marcar como interactuado
const handleInput = (event) => {
  hasInteracted.value = true;
  emit('update:modelValue', event.target.value);
};

// Computed property para validez del campo (expuesto para componentes padre)
const isValid = computed(() => {
  return !isEmpty.value && !isOverLimit.value;
});

// Exponer isValid para que el componente padre pueda acceder a él
defineExpose({
  isValid
});
</script> 