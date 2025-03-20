import type {Route} from "./+types/home";
import {AppShell, Avatar, Burger, Button, Flex, Group, Stack, Text, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import axios, {type AxiosResponse} from "axios";
import PortfolioCard from "~/components/PortfolioCard";
import Logo from "~/Logo.svg";
import NewPortfolioModal from "~/components/NewPortfolioModal";
import {data, useFetcher} from "react-router";

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
    const response: Array<Portfolio> = await axios.get(`http://localhost:3000/portfolio`, {withCredentials: true})
        .then((response: AxiosResponse) => {
            return response.data.data;
        })
        .catch(error => {
            const responseError = error.response
            throw data(responseError.data.message, {status: responseError.status});
        })
    return response;
}


// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Home({loaderData}: Route.ComponentProps) {
    const [openedBurger, {toggle}] = useDisclosure();
    const [openedNewPortfolioModal, {open: openNewPortfolioModal, close: closeNewPortfolioModal}] = useDisclosure();
    const fetcher = useFetcher();

    async function handleDelete() {
        await fetcher.load("/home")
    }

    async function deletePortfolio(portfolioUrl: string) {
        await axios.delete(`http://localhost:3000/portfolio/${portfolioUrl}`, {withCredentials: true});
        await fetcher.load("/home")
    }

    const portfolios: Array<Portfolio> = fetcher.data || loaderData;
    return (
        <>
            <AppShell
                header={{height: 60}}
                padding="md"
            >
                <AppShell.Header>
                    <Group h="100%" px="md" justify="space-between">
                        <Burger opened={openedBurger} onClick={toggle} hiddenFrom="sm" size="sm"/>
                        <Avatar src={Logo} radius="xs"/>
                        <Text>Folium</Text>
                        <Group>
                            <Button onClick={openNewPortfolioModal}>New Portfolio</Button>
                            <Avatar/>
                        </Group>
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
                                        onDelete={() => handleDelete()}
                                    />
                                ))
                            }
                        </Flex>
                    </Stack>
                </AppShell.Main>
            </AppShell>
            <NewPortfolioModal opened={openedNewPortfolioModal} close={closeNewPortfolioModal}/>
        </>
    );
}

