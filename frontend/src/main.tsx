import {createBrowserRouter, data, RouterProvider} from "react-router";
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
import Edit from "~/routes/edit";
import Login from "~/routes/login";
import Register from "~/routes/register";
import GithubCallback from "~/routes/githubCallback";
import Profile from "~/routes/profile";
import Index from "~/routes/index";
import Errors from "~/components/errors";
import PortfolioRoute from "~/routes/portfolio";


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

async function getUser() {
    return axiosInstance.get(`/user`)
        .then((response: AxiosResponse) => {
            return response.data.user;
        }).catch((error) => {
            const responseError = error.response;
            throw data(responseError.data.message, {status: responseError.status});
        });
}

async function getPorfolioTitle(params: { portfolioUrl?: string }) {
    const portfolioUrl = params.portfolioUrl
    if (!portfolioUrl) {
        return
    }
    return await axiosInstance.get(`/portfolio/title/${portfolioUrl}`)
        .then((response: AxiosResponse) => {
            return {
                url: response.data.data.url,
                title: response.data.data.title
            }
        }).catch((error) => {
            const responseError = error.response;
            throw data(responseError.data.message, {status: responseError.status});
        });
}


const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Errors/>, // Root-level error element
        children: [
            {path: "", Component: Index},
            {path: "login", Component: Login},
            {path: "register", Component: Register},
            {
                path: "home",
                Component: Home,
                loader: async () => await getPortfolios()
            },
            {
                path: "view/:portfolioUrl",
                Component: PortfolioRoute,
                loader: async ({params}) => await getPorfolioTitle(params)
            },
            {
                path: "edit/:portfolioUrl",
                Component: Edit,
                loader: async ({params}) => await getPortfolio(params)
            },
            {
                path: "/github-callback",
                Component: GithubCallback
            },
            {
                path: "/profile",
                Component: Profile,
                loader: async () => await getUser()
            }
        ]
    }
]);


createRoot(document.getElementById('root')!).render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
        <ModalsProvider>
            <RouterProvider router={router}/>
        </ModalsProvider>
    </MantineProvider>
)


