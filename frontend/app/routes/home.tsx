import type {Route} from "./+types/home";
import {AppShell, Avatar, Burger, Flex, Group, Stack, Text, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import axios from "axios";
import PortfolioCard from "~/components/PortfolioCard";
import Logo from "~/Logo.svg";

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
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                    <Avatar src={Logo} radius="xs"/>
                    <Text>Folium</Text>
                    <Avatar/>
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Stack>
                    <Title order={2}>My portfolios</Title>

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
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}

