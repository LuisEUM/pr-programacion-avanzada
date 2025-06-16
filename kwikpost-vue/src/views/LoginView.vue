<!--
  LoginView.vue - Vista de autenticación de usuarios
  
  Funcionalidad principal:
  - Proporciona la interfaz de login para acceder a la aplicación
  - Maneja el proceso de autenticación con el backend
  - Gestiona estados de carga y errores durante el login
  - Redirige automáticamente tras autenticación exitosa
  
  Características clave:
  - Diseño centrado y responsive para el formulario de login
  - Integración con el componente LoginForm reutilizable
  - Manejo de errores con mensajes informativos
  - Indicador de carga durante el proceso de autenticación
  - Integración con el store de sesión de Pinia
  - Redirección automática al home tras login exitoso
-->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Componente de formulario de login reutilizable -->
      <LoginForm @submit="handleLogin" />
      
      <!-- Mensaje de error con estilo de alerta -->
      <div v-if="errorMessage" class="card p-4 bg-red-50 border-red-200">
        <p class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </p>
      </div>
      
      <!-- Indicador de carga durante el proceso de autenticación -->
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

// Composables de Vue Router y store de sesión
const router = useRouter();
const sessionStore = useSessionStore();

// Estado reactivo para el proceso de login
const loading = ref(false); // Indica si está en proceso de autenticación
const errorMessage = ref(''); // Mensaje de error para mostrar al usuario

/**
 * Manejador del evento de envío del formulario de login
 * Procesa las credenciales y maneja la respuesta del servidor
 * @param {Object} credentials - Objeto con username y password
 */
const handleLogin = async (credentials) => {
  // Iniciar estado de carga y limpiar errores previos
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // Intentar autenticación usando el store de sesión
    const result = await sessionStore.login(credentials);
    
    if (result.success) {
      // Login exitoso - logging para debugging
      console.log('Login successful, session state:', {
        token: !!sessionStore.token,
        user: sessionStore.user,
        isAuthenticated: sessionStore.isAuthenticated
      });
      
      // Esperar un momento para asegurar que el estado esté completamente actualizado
      // Esto previene problemas de timing con el router guard
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirigir al home tras autenticación exitosa
      router.push('/');
    } else {
      // Login fallido - mostrar error del servidor
      errorMessage.value = result.error;
    }
  } catch (error) {
    // Error de conexión o inesperado
    console.error('Login error:', error);
    errorMessage.value = 'Error de conexión. Por favor, intenta de nuevo.';
  } finally {
    // Finalizar estado de carga independientemente del resultado
    loading.value = false;
  }
};
</script> 