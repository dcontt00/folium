import {index, route, type RouteConfig} from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("/data", "routes/data.tsx"), route("/login", "routes/login.tsx")] satisfies RouteConfig;
