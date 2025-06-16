<!--
  SuccessMessage.vue - Componente para mostrar mensajes de éxito
  
  Funcionalidad principal:
  - Muestra mensajes de éxito con estilo consistente
  - Diseño de alerta con colores de éxito
  - Texto centrado y legible
  - Mensaje secundario opcional
  
  Características clave:
  - Estilo de tarjeta con fondo verde claro
  - Borde y texto en tonos verdes para indicar éxito
  - Mensaje principal y secundario personalizables via props
  - Diseño responsive y accesible
-->
<template>
  <div class="card p-4 bg-green-50 border-green-200">
    <p class="text-green-600 text-sm text-center font-medium">
      {{ message }}
    </p>
    <p v-if="secondaryMessage" class="text-green-500 text-xs text-center mt-1">
      {{ secondaryMessage }}
    </p>
  </div>
</template>

<script setup>
// Props del componente
const props = defineProps({
  // Mensaje principal de éxito
  message: {
    type: String,
    required: true
  },
  // Mensaje secundario opcional
  secondaryMessage: {
    type: String,
    default: ''
  }
});
</script> 