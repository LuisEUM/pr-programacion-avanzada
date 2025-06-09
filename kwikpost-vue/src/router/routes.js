import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PostFormView from "@/views/PostFormView.vue";
import PostDetailView from "@/views/PostDetailView.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
    meta: { auth: true },
    name: "home",
  },
  {
    path: "/login",
    component: LoginView,
    name: "login",
  },
  {
    path: "/profile/:username",
    component: ProfileView,
    meta: { auth: true },
    name: "profile",
  },
  {
    path: "/post/form/:id?",
    component: PostFormView,
    meta: { auth: true },
    name: "post-form",
  },
  {
    path: "/post/:id",
    component: PostDetailView,
    meta: { auth: true },
    name: "post-detail",
  },
];

export default routes;
