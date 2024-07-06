import { createRouter, createWebHistory } from 'vue-router';

const routerOptions = [
    { path: "/", view: "HomePage", },
    {
        path: '/quiz',
        view: "Sokrates",
        name: "Sokrates",
        query: ["quizmode", "theme"],
    },
    {
        path: "/texts",
        view: "Herodotos",
        name: "Herodotos",
        query: ["author", "book", "reference"],
    },
    {
        path: "/dictionary",
        view: "Alexandros" ,
        name: "Alexandros",
        query: ["language", "mode", "word", "extended"],
    },
    {
        path: "/grammar",
        view: "Dionysios",
        name: "Dionysios",
        query: ["word"],
    },
    // Updated catch-all route
    { path: '/:pathMatch(.*)*', view: "NotFound" },
];

const routes = routerOptions.map((route) => {
    return {
        ...route,
        component: () => import(`../views/${route.view}.vue`),
    };
});

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
