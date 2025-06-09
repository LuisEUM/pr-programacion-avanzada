<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-900">KwikPost</h1>
          <div class="flex items-center space-x-3">
            <!-- Icono de home -->
            <router-link to="/" class="text-primary-600 hover:text-primary-700">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </router-link>
            
            <!-- Avatar de usuario -->
            <router-link 
              :to="`/profile/${sessionStore.user.username}`"
              class="flex items-center space-x-2"
            >
              <img 
                :src="sessionStore.user.avatarUrl" 
                :alt="`Avatar de ${sessionStore.user.name}`"
                class="w-8 h-8 rounded-full object-cover"
              >
            </router-link>
            
            <!-- Botón flotante para nuevo post en mobile -->
            <router-link 
              to="/post/form"
              class="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 md:relative md:bottom-0 md:right-0 md:w-auto md:h-auto md:rounded-lg md:px-4 md:py-2"
            >
              <svg class="w-6 h-6 md:w-5 md:h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden md:inline">Nuevo Post</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      <div class="space-y-6">
        <!-- Título de la sección -->
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">Feed</h2>
          <p class="text-gray-600 mt-2">Descubre las últimas publicaciones</p>
        </div>

        <!-- Indicador de carga inicial -->
        <div v-if="loading && posts.length === 0" class="text-center py-8">
          <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando posts...
          </div>
        </div>

        <!-- Lista de posts -->
        <PostList
          v-if="!loading || posts.length > 0"
          :posts="posts"
          :total-count="totalCount"
          :limit="limit"
          :offset="offset"
          @load-more="loadMorePosts"
          @select-post="goToPost"
        />

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="card p-4 bg-red-50 border-red-200">
          <p class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </main>

    <!-- Barra de navegación inferior para mobile -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div class="flex items-center justify-around py-2">
        <router-link 
          to="/" 
          class="flex flex-col items-center p-2 text-primary-600"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </router-link>
        
        <router-link 
          :to="`/profile/${sessionStore.user.username}`"
          class="flex flex-col items-center p-2 text-gray-400"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </router-link>
        
        <button 
          @click="handleLogout"
          class="flex flex-col items-center p-2 text-gray-400"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/store/session';
import api from '@/api';
import PostList from '@/components/PostList.vue';

const router = useRouter();
const sessionStore = useSessionStore();

const posts = ref([]);
const totalCount = ref(0);
const limit = ref(10);
const offset = ref(0);
const loading = ref(false);
const errorMessage = ref('');

const loadPosts = async (append = false) => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await api.get('/posts', {
      params: {
        limit: limit.value,
        offset: append ? offset.value : 0
      }
    });

    const data = response.data;
    
    if (append) {
      posts.value = [...posts.value, ...data.posts];
    } else {
      posts.value = data.posts;
      offset.value = 0;
    }
    
    totalCount.value = data.totalCount;
  } catch (error) {
    console.error('Error loading posts:', error);
    errorMessage.value = 'Error al cargar los posts. Por favor, intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

const loadMorePosts = async () => {
  offset.value += limit.value;
  await loadPosts(true);
};

const goToPost = (postId) => {
  router.push(`/post/${postId}`);
};

const handleLogout = () => {
  sessionStore.logout();
  router.push('/login');
};

onMounted(() => {
  loadPosts();
});
</script> 