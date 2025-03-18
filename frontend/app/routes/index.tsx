import {useDisclosure} from "@mantine/hooks";
import {AppShell, Burger, Button, Group, Highlight, Stack, Title} from "@mantine/core";
import {useNavigate} from "react-router";


export default function Index() {

    const [opened, {toggle}] = useDisclosure();
    const navigate = useNavigate();

    return (
        <AppShell
            header={{height: 60}}
            padding="xl"
        >
            <AppShell.Header>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <div>Logo</div>
            </AppShell.Header>
            <AppShell.Main>

                <Stack align="center">

                    <Title order={1}>
                        <Highlight
                            highlight="Folium"
                            style={{fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit'}}
                            highlightStyles={{
                                backgroundImage:
                                    'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
                                fontWeight: 700,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Welcome to Folium!
                        </Highlight>

                    </Title>
                    <Title order={2}>
                        <Highlight
                            highlight="portfolios"
                            style={{fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit'}}
                            highlightStyles={{
                                backgroundImage:
                                    'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
                                fontWeight: 700,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            A tool to create your unique portfolios
                        </Highlight>
                    </Title>
                    <Group>
                        <Button size="xl" onClick={() => navigate("/register")}>Get started</Button>
                        <Button size="xl" onClick={() => navigate("/login")}>Log in</Button>
                    </Group>
                </Stack>

            </AppShell.Main>
            <AppShell.Footer>Footer</AppShell.Footer>
        </AppShell>
    )
}