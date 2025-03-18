import type {Route} from "./+types/home";
import {Welcome} from "../welcome/welcome";
import {AppShell, Burger, Group, Skeleton} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "New React Router App"},
        {name: "description", content: "Welcome to React Router!"},
    ];
}

export default function Home() {
    const [opened, {toggle}] = useDisclosure();

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
                {Array(15)
                    .fill(0)
                    .map((_, index) => (
                        <Skeleton key={index} h={28} mt="sm" animate={false}/>
                    ))}
            </AppShell.Navbar>
            <AppShell.Main>
                <Welcome/>
            </AppShell.Main>
        </AppShell>
    );
}

