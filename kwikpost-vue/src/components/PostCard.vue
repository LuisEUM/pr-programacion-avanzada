<!--
  PostCard.vue
  
  Componente para mostrar una tarjeta individual de post/publicación.
  
  Funcionalidad principal:
  - Renderiza la información completa de un post (autor, contenido, fecha, respuestas)
  - Proporciona una vista previa truncada del contenido si es muy largo
  - Permite interacción mediante click para navegar al detalle del post
  - Soporte para resaltado visual del post seleccionado
  
  Características:
  - Diseño de tarjeta con hover effects
  - Truncamiento inteligente de contenido largo (140 caracteres)
  - Formateo de fechas localizado en español
  - Avatar del autor y metadata completa
  - Contador de respuestas con iconografía
  - Responsive design con Tailwind CSS
-->
<template>
  <div 
    class="card p-4 hover:shadow-md transition-shadow cursor-pointer"
    :class="{ 'ring-2 ring-primary-500': highlight }"
    @click="$emit('click', post.id)"
  >
    <!-- Header con información del autor y timestamp -->
    <div class="flex items-center space-x-3 mb-3">
      <!-- Avatar del autor -->
      <UserAvatar 
        :src="post.author.avatarUrl" 
        :alt="`Avatar de ${post.author.name}`"
        size="md"
      />
      <!-- Información del autor -->
      <div>
        <h3 class="font-semibold text-gray-900">{{ post.author.name }}</h3>
        <p class="text-sm text-gray-500">@{{ post.author.username }}</p>
      </div>
      <!-- Spacer para empujar la fecha a la derecha -->
      <div class="flex-grow"></div>
      <!-- Timestamp del post -->
      <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
    </div>

    <!-- Contenido principal del post con truncamiento inteligente -->
    <div class="mb-3">
      <p class="text-gray-800 leading-relaxed">{{ truncatedContent }}</p>
      <!-- Indicador de contenido truncado -->
      <span v-if="isTruncated" class="text-primary-500 text-sm cursor-pointer hover:underline">
        ... Leer más
      </span>
    </div>

    <!-- Footer con estadísticas del post -->
    <div class="flex items-center text-gray-500">
      <!-- Icono de comentarios/respuestas -->
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <!-- Contador de respuestas -->
      <span class="text-sm">{{ post.replyCount || 0 }} respuestas</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import UserAvatar from './UserAvatar.vue';

// Definición de props que recibe el componente
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  highlight: {
    type: Boolean,
    default: false
  }
});

// Definición de eventos que puede emitir
const emit = defineEmits(['click']);

// Computed property para truncar el contenido si es muy largo
// Limita a 140 caracteres para mantener la vista de tarjeta compacta
const truncatedContent = computed(() => {
  const maxLength = 140;
  if (props.post.content.length <= maxLength) {
    return props.post.content;
  }
  return props.post.content.substring(0, maxLength);
});

// Computed property para determinar si el contenido fue truncado
// Usado para mostrar el indicador "Leer más"
const isTruncated = computed(() => {
  return props.post.content.length > 140;
});

// Función utilitaria para formatear fechas en español
// Convierte timestamp a formato legible localizado
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