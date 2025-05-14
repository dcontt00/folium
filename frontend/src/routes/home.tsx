import {AppShell, Avatar, Burger, Button, Card, Group, SimpleGrid, Skeleton, Stack, Text, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import PortfolioCard from "~/components/PortfolioCard";
import Logo from "~/Logo.svg";
import NewPortfolioModal from "~/components/NewPortfolioModal";
import {useFetcher, useLoaderData} from "react-router";
import {IconCirclePlus} from "@tabler/icons-react";
import UserMenu from "~/components/UserMenu";
import {Helmet} from "react-helmet";

interface Portfolio {
    title: string;
    description: string;
    url: string;
}

export default function Home() {
    const [openedBurger, {toggle}] = useDisclosure();
    const [openedNewPortfolioModal, {open: openNewPortfolioModal, close: closeNewPortfolioModal}] = useDisclosure();
    const fetcher = useFetcher();

    async function handleDelete() {
        await fetcher.load("/home")
    }


    const portfolios: Array<Portfolio> = fetcher.data || useLoaderData();
    return (
        <>
            <Helmet>
                <title>Folium - Home</title>
            </Helmet>
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
                            <Button leftSection={<IconCirclePlus/>} onClick={openNewPortfolioModal}>New
                                Portfolio</Button>
                            <UserMenu/>
                        </Group>
                    </Group>
                </AppShell.Header>
                <AppShell.Main>
                    <Stack align="center">
                        <Title order={2}>My portfolios</Title>
                        {portfolios.length === 0 ? (
                            <>
                                <Text>This seems empty</Text>
                                <Button leftSection={<IconCirclePlus/>} onClick={openNewPortfolioModal}>Create new
                                    portfolio</Button>
                            </>
                        ) : (
                            <SimpleGrid
                                cols={{base: 1, sm: 2, lg: 3}}
                                spacing={{base: 10, sm: 'xl'}}
                                verticalSpacing={{base: 'md', sm: 'xl'}}
                            >
                                {portfolios.map((portfolio: Portfolio, index) => (
                                    <PortfolioCard
                                        key={index}
                                        title={portfolio.title}
                                        description={portfolio.description}
                                        url={portfolio.url}
                                        onDelete={() => handleDelete()}
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    </Stack>
                </AppShell.Main>
            </AppShell>
            <NewPortfolioModal opened={openedNewPortfolioModal} close={closeNewPortfolioModal}/>
        </>
    );
}


function CardSkeleton() {
    return (
        <Card
            shadow="sm"
            padding="xl"
            component="a"
            target="_blank"
        >
            <Card.Section>
                <Skeleton height={160} width={400}/>
            </Card.Section>
            <Stack style={{marginTop: '16px'}}>
                <Skeleton height={20}/>
                <Skeleton height={20}/>
                <Group justify="space-between" grow>
                    <Skeleton height={40}/>
                    <Skeleton height={40}/>
                    <Skeleton height={40}/>
                </Group>
            </Stack>
        </Card>
    )
}
