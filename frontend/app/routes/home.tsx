import type {Route} from "./+types/home";
import {Welcome} from "~/welcome/welcome";
import {AppShell, Burger, Flex, Group, Skeleton} from "@mantine/core";
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
                {portfolios.length > 0 ? (
                    portfolios.map((portfolio: Portfolio, index) => (
                        <div key={index}>
                            <h1>{portfolio.title}</h1>
                            <p>{portfolio.description}</p>
                            <a href={portfolio.url}>Visit</a>
                        </div>
                    ))

                ) : (
                    Array(15)
                        .fill(0)
                        .map((_, index) => <Skeleton key={index} h={28} mt="sm" animate={false}/>)
                )}

            </AppShell.Navbar>
            <AppShell.Main>
                <Flex>
                    {
                        portfolios.map((portfolio: Portfolio, index) => (
                            <PortfolioCard key={index} title={portfolio.title} description={portfolio.description}
                                           url={portfolio.url}/>
                        ))
                    }
                </Flex>
                <Welcome/>
            </AppShell.Main>
        </AppShell>
    );
}

