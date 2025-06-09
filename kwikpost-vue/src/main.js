import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import { useSessionStore } from "@/store/session";
import App from "./App.vue";
import "./styles/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Restaurar sesión desde localStorage
const sessionStore = useSessionStore();
sessionStore.restoreSession();

app.mount("#app");
