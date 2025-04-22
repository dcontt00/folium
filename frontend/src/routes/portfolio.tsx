import {useLoaderData} from "react-router";
import {Center, Loader} from "@mantine/core";
import ComponentsSection from "~/components/ComponentsSection"
import type Portfolio from "~/interfaces/portfolio";


// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return (
        <Center style={{height: '100vh', width: '100vw'}} bg="var(--mantine-color-gray-light)">
            <Loader color="blue" size="xl" type="dots"/>
        </Center>
    );
}

export default function PortfolioRoute() {

    const portfolio: Portfolio = useLoaderData();
    return <ComponentsSection components={portfolio.components}/>

}