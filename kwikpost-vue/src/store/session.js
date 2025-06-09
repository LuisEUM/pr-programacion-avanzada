import { defineStore } from "pinia";
import axios from "axios";

export const useSessionStore = defineStore("session", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          credentials
        );

        console.log("Login response:", response.data);

        // Extraer token y usuario del body de la respuesta
        const { token, user } = response.data;

        if (!token) {
          throw new Error("No se pudo obtener el token de autenticación");
        }

        this.token = token;
        this.user = user;

        // Persistir en localStorage
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

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

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // Restaurar sesión desde localStorage al iniciar la app
    restoreSession() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
      }
    },
  },
});
