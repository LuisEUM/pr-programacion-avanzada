<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <LoginForm @submit="handleLogin" />
      
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="card p-4 bg-red-50 border-red-200">
        <p class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </p>
      </div>
      
      <!-- Indicador de carga -->
      <div v-if="loading" class="text-center">
        <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Iniciando sesión...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';
import LoginForm from '@/components/LoginForm.vue';

const router = useRouter();
const sessionStore = useSessionStore();

const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async (credentials) => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const result = await sessionStore.login(credentials);
    
    if (result.success) {
      // Redirigir al perfil del usuario
      router.push(`/profile/${credentials.username}`);
    } else {
      errorMessage.value = result.error;
    }
  } catch (error) {
    errorMessage.value = 'Error de conexión. Por favor, intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};
</script> 