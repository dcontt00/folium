import {useRouteError} from "react-router";
import React from "react";
import {Center, Title} from "@mantine/core";
import ErrorPage from "~/components/errors/ErrorPage";

export default function Errors() {
    const error = useRouteError();


    // @ts-ignore
    switch (error?.status) {
        case 400:
            return (
                <ErrorPage
                    errorCode={400}
                    title="Bad request"
                    description="We are sorry, but something went wrong. Please try again later."
                />
            );
        case 401:
            return (
                <ErrorPage
                    errorCode={401}
                    title="Unauthorized"
                    description="You are not authorized to view this page. Please login to your account."
                    buttonText="Login"
                    buttonLink="/login"
                />
            );
        case 404:
            return (
                <ErrorPage
                    errorCode={404}
                    title="Page not found"
                    description="Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL."
                />
            );
        case 500:
            return (
                <ErrorPage
                    errorCode={500}
                    title="Internal server error"
                    description="We are sorry, but something went wrong. Please try again later."
                />
            );
    }

    return (
        <Center>
            <Title order={2}>Something went wrong</Title>
            <p>We couldn’t load the requested data. Please try again later.</p>
        </Center>
    );
}