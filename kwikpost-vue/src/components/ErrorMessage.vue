<!--
  ErrorMessage.vue - Componente para mostrar mensajes de error
  
  Funcionalidad principal:
  - Muestra mensajes de error con estilo consistente
  - Diseño de alerta con colores de error
  - Texto centrado y legible
  
  Características clave:
  - Estilo de tarjeta con fondo rojo claro
  - Borde y texto en tonos rojos para indicar error
  - Mensaje personalizable via props
  - Diseño responsive y accesible
-->
<template>
  <div class="card p-4 bg-red-50 border-red-200">
    <p class="text-red-600 text-sm text-center">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
// Props del componente
const props = defineProps({
  // Mensaje de error a mostrar
  message: {
    type: String,
    required: true
  }
});
</script> 