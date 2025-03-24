import {AppShell, Stack} from "@mantine/core";
import axios, {type AxiosResponse} from "axios";

import type {Portfolio} from "../../../common/interfaces/interfaces";
import {data} from "react-router";
import type {Route} from "./+types";
import Component from "~/components/components/Component";

// provides `loaderData` to the component
export async function clientLoader({params}: Route.ClientLoaderArgs) {
    const portfolio: Portfolio = await axios.get(`http://localhost:3000/portfolio/${params.url}`, {withCredentials: true})
        .then((response: AxiosResponse) => {
            return response.data.data;
        }).catch((error) => {
            const responseError = error.response
            throw data(responseError.data.message, {status: responseError.status});
        });
    return portfolio
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Preview({loaderData}: Route.ComponentProps) {
    if (!loaderData) {
        return <div>Error: Portfolio data not found</div>;
    }

    const portfolio: Portfolio = loaderData;


    return (
        <AppShell
            p="md"
        >
            <AppShell.Main>
                <div>
                    <Stack align="center">
                        {portfolio.components.map((component, index) => (
                            <div
                                key={index}
                            >
                                <Component component={component}/>
                            </div>
                        ))}
                    </Stack>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}