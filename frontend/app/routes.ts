import {index, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("/home", "routes/home.tsx"),
    route("/edit/:url", "routes/edit.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    route("/portfolio/:url", "routes/portfolio.tsx"),
] satisfies RouteConfig;
