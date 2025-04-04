import {data} from "react-router";
import ComponentsSection from "~/components/ComponentsSection";
import type {Route} from "~/routes";
import type {Portfolio} from "~/interfaces/interfaces";
import axiosInstance from "~/axiosInstance";
import type {AxiosResponse} from "axios";

export async function clientLoader({params}: Route.ClientLoaderArgs) {
    const portfolio: Portfolio = await axiosInstance.get(`/portfolio/${params.url}`)
        .then((response: AxiosResponse) => {
            return response.data.data;
        }).catch((error) => {
            const responseError = error.response;
            throw data(responseError.data.message, {status: responseError.status});
        });
    return portfolio;
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