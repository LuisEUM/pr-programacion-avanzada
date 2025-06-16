<!--
  LoginForm.vue
  
  Componente principal para el formulario de autenticación de usuarios.
  
  Funcionalidad principal:
  - Proporciona una interfaz de login con campos de usuario y contraseña
  - Valida que ambos campos estén completos antes de permitir el envío
  - Emite un evento 'submit' con las credenciales al componente padre
  - Incluye información de usuarios de prueba para facilitar el testing
  
  Características:
  - Diseño responsive con Tailwind CSS
  - Validación reactiva del formulario
  - Interfaz limpia y moderna con card design
  - Información contextual para desarrolladores (usuarios de prueba)
-->
<template>
  <div class="card p-6 max-w-md mx-auto">
    <!-- Header del formulario con branding -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">KwikPost</h1>
      <p class="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
    </div>

    <!-- Formulario principal de login -->
    <form @submit.prevent="handleSubmit">
      <!-- Campo de usuario -->
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
          Usuario
        </label>
        <input
          id="username"
          v-model="credentials.username"
          type="text"
          required
          class="input"
          placeholder="Ingresa tu usuario"
        />
      </div>

      <!-- Campo de contraseña -->
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          v-model="credentials.password"
          type="password"
          required
          class="input"
          placeholder="Ingresa tu contraseña"
        />
      </div>

      <!-- Botón de envío con validación reactiva -->
      <button
        type="submit"
        :disabled="!isFormValid"
        class="btn-primary w-full"
      >
        Iniciar Sesión
      </button>
    </form>

    <!-- Sección informativa con usuarios de prueba para desarrollo -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-600 mb-2">Usuarios de prueba:</p>
      <div class="text-xs text-gray-500">
        <p>• johndoe / a1b2c3d4</p>
        <p>• alicesmith / a1b2c3d4</p>
        <p>• wendymartin / a1b2c3d4</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Definición de eventos que este componente puede emitir
const emit = defineEmits(['submit']);

// Estado reactivo para las credenciales del usuario
const credentials = ref({
  username: '',
  password: ''
});

// Computed property para validación del formulario
// Verifica que ambos campos tengan contenido (sin espacios en blanco)
const isFormValid = computed(() => {
  return credentials.value.username.trim() !== '' && 
         credentials.value.password.trim() !== '';
});

// Manejador del envío del formulario
// Solo emite el evento si el formulario es válido
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', credentials.value);
  }
};
</script> 