// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: "/", component: () => import("../views/HomePage.vue") },
    { path: "/quiz", component: () => import("../views/Sokrates.vue") },
    {
        path: "/texts",
        component: () => import("../views/Herodotos.vue"),
        // Define the query parameters you expect for this route in the component itself
    },
    { path: "/dictionary", component: () => import("../views/Alexandros.vue") },
    { path: "/grammar", component: () => import("../views/Dionysios.vue") },
    { path: "/:pathMatch(.*)*", component: () => import("../views/NotFound.vue") }, // Updated catch-all route syntax for Vue 3
];

const router = createRouter({
    history: createWebHistory(), // Use HTML5 history mode
    routes,
});

export default router;
