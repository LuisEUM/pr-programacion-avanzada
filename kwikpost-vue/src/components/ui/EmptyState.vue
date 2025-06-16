<!--
  EmptyState.vue - Estado vacío reutilizable
  
  Funcionalidad principal:
  - Muestra un estado vacío cuando no hay contenido
  - Icono, título y mensaje personalizables
  - Botón de acción opcional
  - Diseño centrado y responsive
  
  Características clave:
  - Icono SVG personalizable
  - Textos configurables
  - Botón de acción opcional
  - Estilos consistentes y centrados
  - Responsive para diferentes tamaños de pantalla
-->
<template>
  <div class="text-center py-12">
    <!-- Icono del estado vacío -->
    <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
      <!-- Icono por defecto (documento vacío) -->
      <svg 
        v-if="!customIcon"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      
      <!-- Slot para icono personalizado -->
      <slot name="icon" v-if="customIcon"></slot>
    </div>
    
    <!-- Título del estado vacío -->
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      {{ title }}
    </h3>
    
    <!-- Mensaje descriptivo -->
    <p class="text-gray-500 mb-6 max-w-sm mx-auto">
      {{ message }}
    </p>
    
    <!-- Botón de acción opcional -->
    <button 
      v-if="showAction"
      @click="$emit('action')"
      class="btn-primary"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script setup>
// Props del componente
const props = defineProps({
  // Título del estado vacío
  title: {
    type: String,
    required: true
  },
  // Mensaje descriptivo
  message: {
    type: String,
    required: true
  },
  // Si mostrar el botón de acción
  showAction: {
    type: Boolean,
    default: false
  },
  // Texto del botón de acción
  actionText: {
    type: String,
    default: 'Crear nuevo'
  },
  // Si usar un icono personalizado (slot)
  customIcon: {
    type: Boolean,
    default: false
  }
});

// Eventos que emite el componente
const emit = defineEmits(['action']);
</script> 