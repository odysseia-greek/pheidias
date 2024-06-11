import Vue from "vue";
import Router from "vue-router";

const routerOptions = [
    { path: "/", view: "HomePage" },
    {
        path: '/quiz',
        view: "Sokrates",
        name: "Sokrates",
        query: ["quizmode", "theme"],
    },
    // Add query property to "/texts" route
    {
        path: "/texts",
        view: "Herodotos",
        name: "Herodotos",
        query: ["author", "book", "reference"], // Define the query parameters you expect for this route
    },
    { path: "/dictionary", view: "Alexandros" },
    { path: "/grammar", view: "Dionysios" },
    { path: "*", view: "NotFound" },
];

const routes = routerOptions.map((route) => {
    return {
        ...route,
        component: () => import(`../views/${route.view}.vue`),
    };
});

Vue.use(Router);

export default new Router({
    mode: "history",
    routes,
});
