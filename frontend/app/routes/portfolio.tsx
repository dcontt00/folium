import {data} from "react-router";
import ComponentsSection from "~/components/ComponentsSection";
import type {Route} from "~/routes";
import type {Portfolio} from "~/interfaces/interfaces";
import axiosInstance from "~/axiosInstance";
import type {AxiosResponse} from "axios";
import {Center, Loader} from "@mantine/core";

export async function clientLoader({params}: Route.ClientLoaderArgs) {

    // Wait 5 seconds
    const portfolio: Portfolio = await axiosInstance.get(`/portfolio/${params.url}`)
        .then((response: AxiosResponse) => {
            return response.data.data;
        }).catch((error) => {
            const responseError = error.response;
            throw data(responseError.data.message, {status: responseError.status});
        });
    return portfolio;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return (
        <Center style={{height: '100vh', width: '100vw'}} bg="var(--mantine-color-gray-light)">
            <Loader color="blue" size="xl" type="dots"/>
        </Center>
    );
}

export default function Portfolio({loaderData}: Route.ComponentProps) {

    if (!loaderData) {
        return <div>Error: Portfolio data not found</div>;
    }

    const portfolio: Portfolio = loaderData;

    return (
        <ComponentsSection components={portfolio.components}/>
    )
}