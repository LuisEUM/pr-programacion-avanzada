<!--
  MobileNavigation.vue - Barra de navegación inferior para móviles
  
  Funcionalidad principal:
  - Navegación principal en dispositivos móviles
  - Acceso rápido a home, perfil y logout
  - Indicadores visuales de página activa
  - Integración con el store de sesión para logout
  
  Características clave:
  - Posición fija en la parte inferior de la pantalla
  - Visible solo en dispositivos móviles (hidden en desktop)
  - Iconografía consistente y accesible
  - Manejo de estado activo basado en la ruta actual
  - Integración con router para navegación y logout
-->
<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
    <div class="flex items-center justify-around py-2">
      <!-- Home -->
      <router-link 
        to="/" 
        class="flex flex-col items-center p-2"
        :class="isHomeActive ? 'text-primary-600' : 'text-gray-400'"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </router-link>
      
      <!-- Perfil del usuario -->
      <router-link 
        v-if="sessionStore.user?.username"
        :to="`/profile/${sessionStore.user.username}`"
        class="flex flex-col items-center p-2"
        :class="isProfileActive ? 'text-primary-600' : 'text-gray-400'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      </router-link>
      
      <!-- Botón de logout -->
      <button 
        @click="handleLogout"
        class="flex flex-col items-center p-2 text-gray-400"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"/>
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';

// Composables
const route = useRoute();
const router = useRouter();
const sessionStore = useSessionStore();

// Computed properties para determinar el estado activo
const isHomeActive = computed(() => route.path === '/');
const isProfileActive = computed(() => 
  route.path.startsWith('/profile/') && 
  route.params.username === sessionStore.user?.username
);

/**
 * Manejo del logout
 * Limpia la sesión y redirige al login
 */
const handleLogout = () => {
  sessionStore.logout();
  router.push('/login');
};
</script> 