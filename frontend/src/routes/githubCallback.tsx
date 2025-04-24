import {useLocalStorage} from "@mantine/hooks";
import {useEffect, useState} from "react";
import axiosInstance from "~/axiosInstance";
import {AppShell, Button, Loader, Stack, Title} from "@mantine/core";
import {IconBrandGithub, IconCheck, IconX} from "@tabler/icons-react";

export default function GithubCallback() {

    const [state] = useLocalStorage({
        key: 'state',
        defaultValue: '',
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const stateParam = urlParams.get('state');
            setLoading(true)

            if (code && stateParam) {
                if (state === stateParam) {
                    try {
                        const rootUrl = window.location.origin;
                        const redirectUrl = `${rootUrl}/github-callback`;
                        await axiosInstance.get(`/github/oauth`, {
                            params: {
                                code: code,
                                redirect_uri: redirectUrl,
                            }
                        });
                        setSuccess(true);

                    } catch (error) {
                        console.error("Error during API call:", error);
                        setSuccess(false);
                    }
                } else {
                    console.error("State does not match");
                    setSuccess(false);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [state]);

    return (
        <AppShell>

            <AppShell.Main
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Stack align="center" gap="xl">
                    <GithubLogin success={success} loading={loading}/>
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}

interface GithubLoginProps {
    success: boolean;
    loading: boolean;
}

function GithubLogin({success, loading}: GithubLoginProps) {
    if (loading) {
        return <Loading/>
    } else if (success) {
        return <Success/>
    } else {
        return <Failed/>
    }

}


function Loading() {
    return (
        <>
            <IconBrandGithub size={150}/>
            <Title order={3}>Login into Github</Title>
            <Loader size="xl"/>

        </>
    )


}

function Success() {
    return (
        <>
            <IconCheck size={150} color="var(--mantine-color-blue-filled)"/>
            <Title order={3}>Success</Title>
            <Button
                onClick={() => {
                    window.close();
                }}
            >
                Close this tab
            </Button>

        </>
    )
}

function Failed() {
    return (
        <>
            <IconX size={150} color="var(--mantine-color-red-filled)"/>
            <Title order={3}>Error trying to log in</Title>
            <Button
                onClick={() => {
                    window.close();
                }}
            >
                Close this tab
            </Button>
        </>
    )
}