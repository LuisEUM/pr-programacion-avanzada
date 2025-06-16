/**
 * session.js - Store de Pinia para manejo de sesión y autenticación
 *
 * Funcionalidad principal:
 * - Gestiona el estado de autenticación del usuario
 * - Maneja el token JWT y datos del usuario
 * - Proporciona persistencia en localStorage
 * - Transforma datos de la API al formato del frontend
 *
 * Puntos clave:
 * - Estado reactivo con Pinia
 * - Persistencia automática en localStorage
 * - Transformación de datos de usuario (profileImg -> avatarUrl)
 * - Manejo de errores de autenticación
 * - Restauración de sesión al iniciar la aplicación
 */

import { defineStore } from "pinia";
import api from "@/api";

export const useSessionStore = defineStore("session", {
  // Estado inicial del store
  state: () => ({
    // Token JWT obtenido del localStorage o null si no existe
    token: localStorage.getItem("token") || null,
    // Datos del usuario parseados desde localStorage
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),

  // Getters computados para derivar estado
  getters: {
    // Determina si el usuario está autenticado
    // Requiere tanto token como username válido
    isAuthenticated: (state) => !!state.token && !!state.user?.username,
  },

  actions: {
    /**
     * Acción de login - Autentica al usuario con credenciales
     * @param {Object} credentials - {username, password}
     * @returns {Object} - {success: boolean, error?: string}
     */
    async login(credentials) {
      try {
        // Realizar petición de login usando el cliente API configurado
        const response = await api.post("/login", credentials);

        console.log("Login response:", response.data);

        // Extraer token y datos de usuario de la respuesta
        const { token, user } = response.data;

        // Validar que se recibió el token
        if (!token) {
          throw new Error("No se pudo obtener el token de autenticación");
        }

        // Transformar datos del usuario al formato esperado por el frontend
        // Mapea campos de la API a la estructura interna de la aplicación
        const transformedUser = {
          id: user.id,
          username: user.username,
          name: user.name,
          surname: user.surname,
          bio: user.bio,
          avatarUrl: user.profileImg, // Transformación clave: profileImg -> avatarUrl
          joinDate: user.registrationDate,
        };

        // Actualizar estado del store
        this.token = token;
        this.user = transformedUser;

        // Persistir datos en localStorage para mantener sesión entre recargas
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        // Log para debugging del estado de la sesión
        console.log("Session updated:", {
          token: !!this.token,
          user: this.user,
          isAuthenticated: this.isAuthenticated,
        });

        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          error:
            error.response?.data?.message ||
            error.message ||
            "Error de autenticación",
        };
      }
    },

    /**
     * Acción de logout - Limpia la sesión del usuario
     * Elimina tanto el estado del store como la persistencia en localStorage
     */
    logout() {
      // Limpiar estado del store
      this.token = null;
      this.user = null;

      // Limpiar persistencia en localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    /**
     * Restaurar sesión desde localStorage al iniciar la aplicación
     * Permite mantener la sesión activa entre recargas del navegador
     */
    restoreSession() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      // Solo restaurar si ambos datos existen en localStorage
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);

        // Log para debugging de la restauración de sesión
        console.log("Session restored:", {
          token: !!this.token,
          user: this.user,
          isAuthenticated: this.isAuthenticated,
        });
      }
    },
  },
});
