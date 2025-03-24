import {index, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("/home", "routes/home.tsx"),
    route("/edit/:url", "routes/edit/edit.tsx"),
    route("/preview/:url", "routes/preview.tsx"),
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),


] satisfies RouteConfig;
