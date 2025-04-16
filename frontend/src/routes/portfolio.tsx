import {useLoaderData} from "react-router";
import ComponentsSection from "~/components/ComponentsSection";
import type {Portfolio} from "~/interfaces/interfaces";
import {Center, Loader} from "@mantine/core";


// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return (
        <Center style={{height: '100vh', width: '100vw'}} bg="var(--mantine-color-gray-light)">
            <Loader color="blue" size="xl" type="dots"/>
        </Center>
    );
}

export default function Portfolio() {

    const portfolio: Portfolio = useLoaderData();

    return (
        <ComponentsSection components={portfolio.components}/>
    )
}