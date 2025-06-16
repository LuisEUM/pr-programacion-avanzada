<!--
  ConfirmationModal.vue - Modal de confirmación reutilizable
  
  Funcionalidad principal:
  - Modal de confirmación para acciones destructivas
  - Overlay oscuro con modal centrado
  - Título, mensaje y botones personalizables
  - Eventos para confirmar y cancelar
  
  Características clave:
  - Overlay con z-index alto para estar sobre todo
  - Modal responsive con máximo ancho
  - Botones de acción personalizables
  - Eventos claros para manejo de acciones
  - Estilos consistentes con el sistema de diseño
-->
<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('cancel')"
  >
    <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
      <!-- Título del modal -->
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        {{ title }}
      </h3>
      
      <!-- Mensaje de confirmación -->
      <p class="text-gray-600 mb-6">
        {{ message }}
      </p>
      
      <!-- Botones de acción -->
      <div class="flex space-x-4">
        <!-- Botón cancelar -->
        <button 
          @click="$emit('cancel')"
          class="btn-secondary flex-1"
        >
          {{ cancelText }}
        </button>
        
        <!-- Botón confirmar -->
        <button 
          @click="$emit('confirm')"
          :class="confirmButtonClass"
          class="font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex-1"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props del componente
const props = defineProps({
  // Si el modal está visible
  show: {
    type: Boolean,
    default: false
  },
  // Título del modal
  title: {
    type: String,
    required: true
  },
  // Mensaje de confirmación
  message: {
    type: String,
    required: true
  },
  // Texto del botón cancelar
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  // Texto del botón confirmar
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  // Tipo de acción (determina el color del botón)
  type: {
    type: String,
    default: 'danger',
    validator: (value) => ['danger', 'warning', 'info'].includes(value)
  }
});

// Eventos que emite el componente
const emit = defineEmits(['confirm', 'cancel']);

// Computed property para las clases del botón de confirmación
const confirmButtonClass = computed(() => {
  const typeClasses = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white'
  };
  
  return typeClasses[props.type] || typeClasses.danger;
});
</script> 