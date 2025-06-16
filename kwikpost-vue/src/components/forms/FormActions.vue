<!--
  FormActions.vue - Grupo de botones de acción para formularios
  
  Funcionalidad principal:
  - Botones de cancelar y enviar para formularios
  - Estados de carga y deshabilitado
  - Textos personalizables para los botones
  - Eventos claros para manejo de acciones
  
  Características clave:
  - Botón de envío con estado de carga
  - Botón cancelar siempre disponible
  - Textos personalizables
  - Estilos consistentes con el sistema de diseño
  - Responsive con espaciado apropiado
-->
<template>
  <div class="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
    <!-- Botón cancelar -->
    <button 
      v-if="showCancel"
      type="button"
      @click="$emit('cancel')"
      class="btn-secondary w-full sm:w-auto"
      :disabled="loading"
    >
      {{ cancelText }}
    </button>
    
    <!-- Botón enviar -->
    <button 
      type="submit"
      @click="$emit('submit')"
      class="btn-primary w-full sm:w-auto"
      :disabled="disabled || loading"
    >
      <!-- Indicador de carga -->
      <svg 
        v-if="loading" 
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          class="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          stroke-width="4"
        ></circle>
        <path 
          class="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      <!-- Texto del botón -->
      {{ loading ? loadingText : submitText }}
    </button>
  </div>
</template>

<script setup>
// Props del componente
const props = defineProps({
  // Si está en estado de carga
  loading: {
    type: Boolean,
    default: false
  },
  // Si el botón de envío está deshabilitado
  disabled: {
    type: Boolean,
    default: false
  },
  // Si mostrar el botón cancelar
  showCancel: {
    type: Boolean,
    default: true
  },
  // Texto del botón cancelar
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  // Texto del botón enviar
  submitText: {
    type: String,
    default: 'Guardar'
  },
  // Texto del botón cuando está cargando
  loadingText: {
    type: String,
    default: 'Guardando...'
  }
});

// Eventos que emite el componente
const emit = defineEmits(['cancel', 'submit']);
</script> 