<!--
  UserProfileHeader.vue
  
  Componente para mostrar la información del encabezado del perfil de usuario.
  
  Funcionalidad principal:
  - Muestra la información completa del perfil de usuario
  - Presenta avatar, nombre, username y biografía del usuario
  - Incluye información de metadata como fecha de registro
  - Diseño responsive que se adapta a diferentes tamaños de pantalla
  
  Características:
  - Layout flexible (columna en móvil, fila en desktop)
  - Avatar de gran tamaño para mejor visibilidad
  - Formateo de fechas localizado en español
  - Manejo condicional de biografía (solo si existe)
  - Iconografía consistente con el resto de la aplicación
  - Centrado en móvil, alineado a la izquierda en desktop
-->
<template>
  <div class="card p-6">
    <!-- Layout principal responsive -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
      <!-- Avatar principal del usuario -->
      <UserAvatar 
        :src="user.avatarUrl" 
        :alt="`Avatar de ${user.name}`"
        size="xl"
        class="flex-shrink-0"
      />
      
      <!-- Sección de información del usuario -->
      <div class="flex-grow text-center sm:text-left">
        <!-- Nombre y username del usuario -->
        <h1 class="text-2xl font-bold text-gray-900">{{ user.name }}</h1>
        <p class="text-gray-600 text-lg">@{{ user.username }}</p>
        
        <!-- Biografía del usuario (condicional) -->
        <p v-if="user.bio" class="text-gray-700 mt-3 leading-relaxed">
          {{ user.bio }}
        </p>
        
        <!-- Metadata: fecha de registro con iconografía -->
        <div class="flex items-center justify-center sm:justify-start mt-4 text-gray-500">
          <!-- Icono de calendario -->
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <!-- Fecha de registro formateada -->
          <span class="text-sm">Se unió en {{ formatJoinDate(user.joinDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserAvatar from '@/components/ui/UserAvatar.vue';

// Definición de props del componente
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

// Función utilitaria para formatear la fecha de registro
// Convierte la fecha a formato largo en español para mejor legibilidad
const formatJoinDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script> 