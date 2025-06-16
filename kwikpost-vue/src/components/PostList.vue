<!--
  PostList.vue
  
  Componente contenedor para mostrar una lista de posts con paginación.
  
  Funcionalidad principal:
  - Renderiza una lista de posts usando el componente PostCard
  - Implementa paginación con botón "Cargar más"
  - Maneja estados vacíos y de fin de contenido
  - Proporciona navegación a posts individuales
  
  Características:
  - Paginación inteligente basada en offset/limit
  - Estados de UI para lista vacía y fin de contenido
  - Delegación de eventos para selección de posts
  - Cálculo automático de disponibilidad de más contenido
  - Diseño responsive con espaciado consistente
-->
<template>
  <div class="space-y-4">
    <!-- Lista principal de posts -->
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @click="$emit('select-post', $event)"
    />
    
    <!-- Estado vacío: cuando no hay posts para mostrar -->
    <div v-if="posts.length === 0" class="text-center py-8">
      <p class="text-gray-500">No hay posts para mostrar</p>
    </div>
    
    <!-- Control de paginación: botón cargar más -->
    <div v-if="showLoadMore" class="text-center pt-4">
      <button 
        @click="$emit('load-more')"
        class="btn-secondary"
      >
        Cargar más posts
      </button>
    </div>
    
    <!-- Indicador de fin de contenido -->
    <div v-if="posts.length > 0 && !showLoadMore" class="text-center py-4">
      <p class="text-gray-500 text-sm">No hay más posts para mostrar</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PostCard from './PostCard.vue';

// Definición de props para control de paginación y datos
const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  offset: {
    type: Number,
    required: true
  }
});

// Definición de eventos que puede emitir
const emit = defineEmits(['load-more', 'select-post']);

// Computed property para determinar si mostrar el botón "Cargar más"
// Compara la posición actual (offset + limit) con el total de elementos
const showLoadMore = computed(() => {
  return props.offset + props.limit < props.totalCount;
});
</script> 