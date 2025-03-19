import type {Route} from "./+types/home";
import {AppShell, Burger, Flex, Group} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import axios from "axios";
import PortfolioCard from "~/components/PortfolioCard";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}

interface Portfolio {
    title: string;
    description: string;
    url: string;
}

export async function clientLoader({params}: Route.ClientLoaderArgs) {
    const res = await axios.get(`http://localhost:3000/portfolio`, {withCredentials: true});
    const portfolios: Array<Portfolio> = res.data.data;
    return portfolios;
}


// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Home({loaderData}: Route.ComponentProps) {
    const [opened, {toggle}] = useDisclosure();
    const portfolios: Array<Portfolio> = loaderData;
    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                Navbar
            </AppShell.Navbar>
            <AppShell.Main>
                <Flex
                    gap="md"
                >
                    {
                        portfolios.map((portfolio: Portfolio, index) => (
                            <PortfolioCard
                                key={index}
                                title={portfolio.title}
                                description={portfolio.description}
                                url={portfolio.url}
                            />
                        ))
                    }
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
}

