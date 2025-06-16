<!--
  AppHeader.vue - Header principal reutilizable de la aplicación
  
  Funcionalidad principal:
  - Header sticky con navegación y título personalizable
  - Soporte para diferentes tipos de navegación (home, back)
  - Integración opcional del botón flotante para crear posts
  - Diseño responsive y consistente en toda la aplicación
  
  Características clave:
  - Props configurables para título y tipo de navegación
  - Slot para contenido personalizado en el lado derecho
  - Botón flotante opcional con comportamiento responsive
  - Estilos consistentes con el resto de la aplicación
-->
<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div class="max-w-4xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Navegación izquierda -->
        <div class="flex items-center">
          <!-- Navegación de regreso o home -->
          <router-link 
            :to="backTo || '/'" 
            class="text-xl font-bold text-gray-900 hover:text-primary-600"
          >
            {{ showBackArrow ? '← KwikPost' : 'KwikPost' }}
          </router-link>
        </div>

        <!-- Título central (opcional) -->
        <h1 v-if="title" class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h1>

        <!-- Contenido derecho -->
        <div class="flex items-center space-x-3">
          <!-- Slot para contenido personalizado -->
          <slot name="right-content">
            <!-- Contenido por defecto para HomeView -->
            <template v-if="showDefaultContent">
              <!-- Icono de home (activo en esta vista) -->
              <router-link to="/" class="text-primary-600 hover:text-primary-700">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </router-link>
              
              <!-- Avatar del usuario logueado - enlace al perfil -->
              <router-link 
                v-if="sessionStore.user?.username"
                :to="`/profile/${sessionStore.user.username}`"
                class="flex items-center space-x-2"
              >
                <UserAvatar 
                  :src="sessionStore.user.avatarUrl" 
                  :alt="`Avatar de ${sessionStore.user.name}`"
                  size="sm"
                />
              </router-link>
              
              <!-- Botón de logout para desktop -->
              <button
                v-if="showLogoutButton"
                @click="handleLogout"
                class="hidden md:flex items-center text-gray-600 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </template>
            
            <!-- Contenido para otras vistas -->
            <template v-else>
              <!-- Icono de home -->
              <router-link 
                v-if="showHomeIcon" 
                to="/" 
                class="text-gray-600 hover:text-primary-600"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </router-link>
              
              <!-- Avatar del usuario logueado - enlace al perfil -->
              <router-link 
                v-if="sessionStore.user?.username && !hideProfileAvatar"
                :to="`/profile/${sessionStore.user.username}`"
                class="flex items-center space-x-2"
              >
                <UserAvatar 
                  :src="sessionStore.user.avatarUrl" 
                  :alt="`Avatar de ${sessionStore.user.name}`"
                  size="sm"
                />
              </router-link>
              
              <!-- Botón de logout para desktop -->
              <button
                v-if="showLogoutButton"
                @click="handleLogout"
                class="hidden md:flex items-center text-gray-600 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </template>
          </slot>

          <!-- Botón flotante para crear posts (opcional) -->
          <FloatingActionButton v-if="showFloatingButton" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useSessionStore } from '@/store/session';
import FloatingActionButton from './FloatingActionButton.vue';
import UserAvatar from './UserAvatar.vue';

// Store de sesión
const sessionStore = useSessionStore();

// Props del componente
const props = defineProps({
  // Título a mostrar en el centro del header
  title: {
    type: String,
    default: ''
  },
  // Mostrar flecha de regreso
  showBackArrow: {
    type: Boolean,
    default: false
  },
  // URL de destino para el botón de regreso
  backTo: {
    type: String,
    default: '/'
  },
  // Mostrar botón flotante para crear posts
  showFloatingButton: {
    type: Boolean,
    default: false
  },
  // Mostrar contenido por defecto (home icon + avatar)
  showDefaultContent: {
    type: Boolean,
    default: false
  },
  // Mostrar icono de home
  showHomeIcon: {
    type: Boolean,
    default: false
  },
  // Ocultar avatar de perfil
  hideProfileAvatar: {
    type: Boolean,
    default: false
  },
  // Mostrar botón de logout
  showLogoutButton: {
    type: Boolean,
    default: false
  }
});

// Función para manejar logout
const handleLogout = () => {
  sessionStore.logout();
  // Redirigir al login después del logout
  window.location.href = '/login';
};
</script> 