<!--
  LoadingSpinner.vue - Indicador de carga reutilizable
  
  Funcionalidad principal:
  - Spinner animado para indicar estados de carga
  - Mensaje personalizable para diferentes contextos
  - Diseño centrado y responsive
  
  Características clave:
  - Animación CSS suave y consistente
  - Mensaje de carga personalizable via props
  - Tamaño y colores consistentes con el diseño
  - Centrado automático en su contenedor
-->
<template>
  <div class="text-center py-8">
    <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
      <!-- Spinner SVG animado -->
      <svg 
        class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" 
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
      <!-- Mensaje de carga personalizable -->
      {{ message }}
    </div>
  </div>
</template>

<script setup>
// Props del componente
const props = defineProps({
  // Mensaje a mostrar junto al spinner
  message: {
    type: String,
    default: 'Cargando...'
  }
});
</script> 