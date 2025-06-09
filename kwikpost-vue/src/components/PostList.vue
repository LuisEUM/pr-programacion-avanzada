<template>
  <div class="space-y-4">
    <!-- Lista de posts -->
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @click="$emit('select-post', $event)"
    />
    
    <!-- Mensaje cuando no hay posts -->
    <div v-if="posts.length === 0" class="text-center py-8">
      <p class="text-gray-500">No hay posts para mostrar</p>
    </div>
    
    <!-- Botón cargar más -->
    <div v-if="showLoadMore" class="text-center pt-4">
      <button 
        @click="$emit('load-more')"
        class="btn-secondary"
      >
        Cargar más posts
      </button>
    </div>
    
    <!-- Indicador de que se llegó al final -->
    <div v-if="posts.length > 0 && !showLoadMore" class="text-center py-4">
      <p class="text-gray-500 text-sm">No hay más posts para mostrar</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PostCard from './PostCard.vue';

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

const emit = defineEmits(['load-more', 'select-post']);

const showLoadMore = computed(() => {
  return props.offset + props.limit < props.totalCount;
});
</script> 