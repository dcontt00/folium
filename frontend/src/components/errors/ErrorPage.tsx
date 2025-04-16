import {useRouteError} from "react-router";
import React from "react";
import {Button, Center, Stack, Title} from "@mantine/core";

export default function ErrorPage() {
    const error = useRouteError();


    // @ts-ignore
    switch (error?.status) {
        case 400:
            return (
                <Center>
                    <Title order={2}>Bad Request</Title>
                </Center>
            );
        case 401:
            return (
                <Center>
                    <Stack align="center">
                        <Title order={2}>Not authorized</Title>
                        <Button
                            component="a"
                            href="/login"
                        >
                            Login
                        </Button>

                    </Stack>
                </Center>
            );
        case 404:
            return (
                <Center>
                    <Title order={2}>Not Found</Title>
                </Center>
            );
        case 500:
            return (
                <Center>
                    <Title order={2}>Server Error</Title>
                </Center>
            );
    }

    return (
        <Center>
            <Title order={2}>Something went wrong</Title>
            <p>We couldn’t load the requested data. Please try again later.</p>
        </Center>
    );
}