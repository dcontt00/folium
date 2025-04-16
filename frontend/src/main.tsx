import {createBrowserRouter, data, Outlet, RouterProvider,} from "react-router";
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

async function getPortfolioId(portfolioUrl: string) {
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
    {path: "/home", Component: Home, loader: async () => await getPortfolios()},
    {
        path: "/edit/:portfolioUrl", Component: Edit, loader: async ({params}) => {
            if (params.portfolioUrl == null) {
                return
            }
            return await getPortfolioId(params.portfolioUrl)
        }
    }

]);
export default function App() {
    return <Outlet/>;
}

createRoot(document.getElementById('root')!).render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
        <ModalsProvider>
            <RouterProvider router={router}/>
        </ModalsProvider>
    </MantineProvider>
)


