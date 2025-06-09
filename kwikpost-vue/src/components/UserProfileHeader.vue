<template>
  <div class="card p-6">
    <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
      <!-- Avatar grande -->
      <img 
        :src="user.avatarUrl" 
        :alt="`Avatar de ${user.name}`"
        class="w-24 h-24 rounded-full object-cover flex-shrink-0"
      >
      
      <!-- Información del usuario -->
      <div class="flex-grow text-center sm:text-left">
        <h1 class="text-2xl font-bold text-gray-900">{{ user.name }}</h1>
        <p class="text-gray-600 text-lg">@{{ user.username }}</p>
        
        <!-- Bio -->
        <p v-if="user.bio" class="text-gray-700 mt-3 leading-relaxed">
          {{ user.bio }}
        </p>
        
        <!-- Fecha de unión -->
        <div class="flex items-center justify-center sm:justify-start mt-4 text-gray-500">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm">Se unió en {{ formatJoinDate(user.joinDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const formatJoinDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script> 