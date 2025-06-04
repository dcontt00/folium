import {useState} from 'react';
import {Button, Center, Container, Group, Highlight, Overlay, Stack, Text, Title, Transition} from '@mantine/core';
import classes from './index.module.css';
import Login from "~/components/login";
import {IconArrowLeft} from "@tabler/icons-react";
import Register from "~/components/register";
import {Helmet} from "react-helmet";
import config from "~/config";

export default function HeroContentLeft() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    console.log("config", config)
    console.log("meta.env", import.meta.env)
    console.log("process.env", process.env)

    return (
        <>
            <Helmet>
                <title>Folium</title>
            </Helmet>
            <div className={classes.hero}>
                <Overlay
                    gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
                    opacity={1}
                    zIndex={0}
                />
                <Center h={'100vh'} style={{zIndex: 1, position: 'relative'}}>

                    <Container size="md">
                        <Transition mounted={!showLogin && !showRegister}
                                    transition="slide-right"
                                    timingFunction="ease"
                                    duration={200}
                                    enterDelay={300}

                        >
                            {(styles) => (
                                <div style={styles}>

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
                                    <Text className={classes.description} size="xl" mt="xl">
                                        Build your portfolio with ease and style. Folium is a powerful and flexible
                                        portfolio
                                        builder
                                        that
                                        allows you to create stunning portfolios in minutes.
                                    </Text>
                                    <Group>


                                        <Button
                                            variant="gradient"
                                            size="xl"
                                            radius="xl"
                                            className={classes.control}
                                            onClick={() => setShowRegister((prev) => !prev)}
                                        >
                                            Get started
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="xl"
                                            radius="xl"
                                            className={classes.control}
                                            onClick={() => setShowLogin((prev) => !prev)}
                                        >
                                            Login
                                        </Button>
                                    </Group>

                                </div>
                            )}
                        </Transition>

                        <Transition
                            mounted={showLogin}
                            transition="slide-left"
                            duration={200}
                            timingFunction="ease"
                            enterDelay={100}
                        >
                            {(styles) => (
                                <div style={styles}>
                                    <Stack>
                                        <Button
                                            leftSection={<IconArrowLeft/>}
                                            onClick={() => setShowLogin(prev => !prev)}

                                        >
                                            Back
                                        </Button>
                                        <Login/>
                                    </Stack>
                                </div>
                            )}
                        </Transition>

                        <Transition
                            mounted={showRegister}
                            transition="slide-left"
                            duration={200}
                            timingFunction="ease"
                            enterDelay={100}
                        >
                            {(styles) => (
                                <div style={styles}>
                                    <Stack>
                                        <Button
                                            leftSection={<IconArrowLeft/>}
                                            onClick={() => setShowRegister(prev => !prev)}
                                        >
                                            Back
                                        </Button>
                                        <Register/>
                                    </Stack>
                                </div>
                            )}
                        </Transition>
                    </Container>
                </Center>
            </div>
        </>
    );
}
