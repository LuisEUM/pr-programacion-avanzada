<template>
  <div class="card p-6 max-w-md mx-auto">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">KwikPost</h1>
      <p class="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
    </div>

    <form @submit.prevent="handleSubmit">
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

      <button
        type="submit"
        :disabled="!isFormValid"
        class="btn-primary w-full"
      >
        Iniciar Sesión
      </button>
    </form>

    <!-- Información de usuarios de prueba -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-600 mb-2">Usuarios de prueba:</p>
      <div class="text-xs text-gray-500">
        <p>• johndoe / a1b2c3d4</p>
        <p>• alicesmith / password123</p>
        <p>• bobwilson / mypassword</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['submit']);

const credentials = ref({
  username: '',
  password: ''
});

const isFormValid = computed(() => {
  return credentials.value.username.trim() !== '' && 
         credentials.value.password.trim() !== '';
});

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', credentials.value);
  }
};
</script> 