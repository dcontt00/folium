import {createBrowserRouter, data, RouterProvider,} from "react-router";
import '@mantine/core/styles.css';
import "./app.css";
import {MantineProvider} from "@mantine/core";
import React from "react";
import theme from "./theme/theme";
import {ModalsProvider} from "@mantine/modals";
import {createRoot} from "react-dom/client";
import axiosInstance from "./axiosInstance";
import type {AxiosResponse} from "axios";
import type Portfolio from "./interfaces/portfolio";
import Home from "./routes/home";
import Index from "./routes/index";
import Edit from "~/routes/edit";
import Login from "~/routes/login";
import Register from "~/routes/register";
import PortfolioRoute from "./routes/portfolio";


async function getPortfolios() {
    const response: Array<Portfolio> = await axiosInstance.get(`/portfolio`)
        .then((response: AxiosResponse) => {
            return response.data.data;
        })
        .catch(error => {
            const responseError = error.response
            throw data(responseError.data.message, {status: responseError.status});
        })
    return response;
}

async function getPortfolio(params: { portfolioUrl?: string }) {
    const portfolioUrl = params.portfolioUrl
    if (!portfolioUrl) {
        return
    }
    const portfolio: Portfolio = await axiosInstance.get(`/portfolio/${portfolioUrl}`)
        .then((response: AxiosResponse) => {
            return response.data.data;
        }).catch((error) => {
            const responseError = error.response;
            throw data(responseError.data.message, {status: responseError.status});
        });
    return portfolio;
}

const router = createBrowserRouter([
    {path: "/", Component: Index},
    {path: "/login", Component: Login},
    {path: "/register", Component: Register},
    {path: "/home", Component: Home, loader: async () => await getPortfolios()},
    {
        path: "/portfolio/:portfolioUrl",
        Component: PortfolioRoute,
        loader: async ({params}) => await getPortfolio(params)
    },
    {path: "/edit/:portfolioUrl", Component: Edit, loader: async ({params}) => await getPortfolio(params)}

]);


createRoot(document.getElementById('root')!).render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
        <ModalsProvider>
            <RouterProvider router={router}/>
        </ModalsProvider>
    </MantineProvider>
)


