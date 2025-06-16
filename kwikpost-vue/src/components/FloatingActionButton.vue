<!--
  FloatingActionButton.vue - Botón flotante para crear posts
  
  Funcionalidad principal:
  - Botón de acción principal para crear nuevos posts
  - Comportamiento responsive: flotante en móvil, inline en desktop
  - Navegación directa al formulario de creación de posts
  
  Características clave:
  - Diseño flotante en la esquina inferior derecha en móviles
  - Botón inline con texto en desktop
  - Iconografía consistente con el resto de la aplicación
  - Transiciones suaves y efectos hover
  - Z-index alto para mantenerse sobre otros elementos
-->
<template>
  <router-link 
    to="/post/form"
    class="fixed bottom-20 right-6 bg-primary-500 hover:bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 z-50 md:relative md:bottom-0 md:right-0 md:w-auto md:h-auto md:rounded-lg md:px-4 md:py-2"
  >
    <!-- Icono de plus/agregar -->
    <svg class="w-6 h-6 md:w-5 md:h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
    </svg>
    <!-- Texto visible solo en desktop -->
    <span class="hidden md:inline">Nuevo Post</span>
  </router-link>
</template>

<script setup>
// Este componente no necesita lógica adicional
// Es puramente presentacional con navegación
</script> 