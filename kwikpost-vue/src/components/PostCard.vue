<template>
  <div 
    class="card p-4 hover:shadow-md transition-shadow cursor-pointer"
    :class="{ 'ring-2 ring-primary-500': highlight }"
    @click="$emit('click', post.id)"
  >
    <!-- Header con avatar y autor -->
    <div class="flex items-center space-x-3 mb-3">
      <img 
        :src="post.author.avatarUrl" 
        :alt="`Avatar de ${post.author.name}`"
        class="w-10 h-10 rounded-full object-cover"
      >
      <div>
        <h3 class="font-semibold text-gray-900">{{ post.author.name }}</h3>
        <p class="text-sm text-gray-500">@{{ post.author.username }}</p>
      </div>
      <div class="flex-grow"></div>
      <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
    </div>

    <!-- Contenido del post -->
    <div class="mb-3">
      <p class="text-gray-800 leading-relaxed">{{ truncatedContent }}</p>
      <span v-if="isTruncated" class="text-primary-500 text-sm cursor-pointer hover:underline">
        ... Leer más
      </span>
    </div>

    <!-- Footer con contador de respuestas -->
    <div class="flex items-center text-gray-500">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <span class="text-sm">{{ post.replyCount || 0 }} respuestas</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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

const emit = defineEmits(['click']);

const truncatedContent = computed(() => {
  const maxLength = 140;
  if (props.post.content.length <= maxLength) {
    return props.post.content;
  }
  return props.post.content.substring(0, maxLength);
});

const isTruncated = computed(() => {
  return props.post.content.length > 140;
});

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