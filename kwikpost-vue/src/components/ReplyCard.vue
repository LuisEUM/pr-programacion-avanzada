<!--
  ReplyCard.vue - Tarjeta individual de respuesta
  
  Funcionalidad principal:
  - Muestra una respuesta individual con información del autor
  - Formato compacto optimizado para listas de respuestas
  - Avatar, nombre, username y timestamp del autor
  - Contenido de la respuesta con formato apropiado
  
  Características clave:
  - Diseño compacto para respuestas anidadas
  - Avatar más pequeño que en posts principales
  - Información del autor con jerarquía visual clara
  - Timestamp formateado en español
  - Estilos consistentes con el sistema de diseño
-->
<template>
  <div class="card p-4">
    <!-- Header de la respuesta con información del autor -->
    <div class="flex items-center space-x-3 mb-3">
      <!-- Avatar del autor de la respuesta (más pequeño) -->
      <UserAvatar 
        :src="reply.author.avatarUrl" 
        :alt="`Avatar de ${reply.author.name}`"
        size="sm"
      />
      
      <div>
        <h4 class="font-medium text-gray-900 text-sm">{{ reply.author.name }}</h4>
        <p class="text-xs text-gray-500">@{{ reply.author.username }}</p>
      </div>
      
      <div class="flex-grow"></div>
      
      <!-- Timestamp de la respuesta -->
      <span class="text-xs text-gray-500">{{ formatDate(reply.createdAt) }}</span>
    </div>

    <!-- Contenido de la respuesta -->
    <p class="text-gray-800 text-sm leading-relaxed">{{ reply.content }}</p>
  </div>
</template>

<script setup>
import UserAvatar from './UserAvatar.vue';

// Props del componente
const props = defineProps({
  reply: {
    type: Object,
    required: true
  }
});

/**
 * Función utilitaria para formatear fechas
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada en español
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script> 