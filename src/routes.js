import App from "./App";
import Landing from "./components/marketing/Landing";
import About from "./components/marketing/About";
import TestTodosVariable from "./components/marketing/TestTodosVariable";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

const routes = [
    {
        path: "/",
        component: Landing,
        name: "home"
    },
    {
        path: "/todo",
        name: "todo",
        component: App
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
        path: "/about",
        name: "about",
        component: About
    },
    {
        path: '/todos/:id',
        name: 'todos',
        component: TestTodosVariable,
    }
];

export default routes;
