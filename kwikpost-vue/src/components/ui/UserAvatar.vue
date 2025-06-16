<!--
  UserAvatar.vue - Avatar de usuario reutilizable
  
  Funcionalidad principal:
  - Muestra el avatar de un usuario con tamaños configurables
  - Alt text automático para accesibilidad
  - Tamaños predefinidos (xs, sm, md, lg, xl)
  - Estilos consistentes con bordes redondeados
  
  Características clave:
  - Tamaños predefinidos para consistencia
  - Object-cover para mantener proporciones
  - Alt text automático o personalizable
  - Clases CSS optimizadas para cada tamaño
-->
<template>
  <img 
    :src="src" 
    :alt="alt"
    :class="avatarClasses"
    class="rounded-full object-cover"
  >
</template>

<script setup>
import { computed } from 'vue';

// Props del componente
const props = defineProps({
  // URL de la imagen del avatar
  src: {
    type: String,
    required: true
  },
  // Texto alternativo para accesibilidad
  alt: {
    type: String,
    default: 'Avatar de usuario'
  },
  // Tamaño del avatar
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  }
});

// Computed property para las clases CSS según el tamaño
const avatarClasses = computed(() => {
  const sizeClasses = {
    xs: 'w-6 h-6',      // 24px - Para elementos muy pequeños
    sm: 'w-8 h-8',      // 32px - Para respuestas y elementos compactos
    md: 'w-10 h-10',    // 40px - Para tarjetas de posts
    lg: 'w-12 h-12',    // 48px - Para posts detallados
    xl: 'w-24 h-24'     // 96px - Para perfiles de usuario
  };
  
  return sizeClasses[props.size] || sizeClasses.md;
});
</script> 