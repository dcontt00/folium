import {AppShell} from "@mantine/core";
import type {Route} from "./+types";
import axios from "axios";

import type Portfolio from "../../../common/interfaces/portfolio";

// provides `loaderData` to the component
export async function clientLoader({params}: Route.ClientLoaderArgs) {
    console.log(`http://localhost:3000/portfolio/${params.url}`)
    const portfolio: Portfolio = await axios.get(`http://localhost:3000/portfolio/${params.url}`, {withCredentials: true}).then((response) => {
        return response.data.data;
    }).catch((error) => {
        console.log(error);
    });
    return portfolio
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}
export default function Edit({loaderData}: Route.ComponentProps) {
    const portfolio: Portfolio = loaderData;
    return (
        <AppShell>
            <AppShell.Main>
                <h1>Edit</h1>
                {portfolio != null && <h2>{portfolio.title}</h2>}
            </AppShell.Main>
        </AppShell>
    )
}