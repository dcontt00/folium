import {Anchor, Button, Divider, Stack, Text, Textarea, TextInput, Title} from "@mantine/core";
import axiosInstance from "~/axiosInstance";
import GithubLogin from "~/components/GithubLogin";
import {useEffect, useState} from "react";
import {IconBrandGithub, IconCheck, IconDownload} from "@tabler/icons-react";


interface Props {
    toggleOpenedSettings: () => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    setUnsaved: (unsaved: boolean) => void;
    portfolioUrl: string,
}

export default function SettingsSection({
                                            toggleOpenedSettings,
                                            title,
                                            setTitle,
                                            description,
                                            setDescription,
                                            setUnsaved,
                                            portfolioUrl
                                        }: Props) {
    const [githubIsAuthorized, setGithubIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        const checkGithubAuthorization = async () => {
            console.log("Sí")
            await axiosInstance.get('/github/status').then((response) => {
                setGithubIsAuthorized(true);
                console.log("No")
                return true;
            }).catch((e) => {
                console.log(e)
                setGithubIsAuthorized(false);
            })

        };
        console.log('Checking GitHub authorization');
        checkGithubAuthorization();
    }, []);

    async function exportAndSave() {
        const response = await axiosInstance.get(`/portfolio/${portfolioUrl}/export`, {
            responseType: "blob"
        })
        // Create a URL for the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${portfolioUrl}.zip`); // Set the file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    async function exportToGithub() {
        setLoading(true);
        await axiosInstance.get(`/github/upload`, {
            params: {
                portfolioUrl: portfolioUrl,
            }
        }).then((response) => {
            setUrl(response.data.url);
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
        setLoading(false);


        // Show tooltip during 3 seconds
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    }


    return (
        <>
            <Title order={3}>Settings</Title>
            <TextInput
                label="Title"
                value={title}
                onChange={(event) => {
                    setTitle(event.currentTarget.value)
                    setUnsaved(true);
                }}
            />
            <Textarea
                label="Description"
                value={description}
                onChange={(event) => {
                    setDescription(event.currentTarget.value)
                    setUnsaved(true);
                }}
            />
            <Divider/>
            <Button hiddenFrom="sm" onClick={toggleOpenedSettings}>Close</Button>
            <Title order={3}>Export</Title>
            <Text>You can export the portfolio as HTML and CSS or select a provider to host it directly</Text>
            <Button
                leftSection={<IconDownload/>}
                onClick={exportAndSave}
            >
                Download
            </Button>
            <Title order={4}>Github</Title>

            {githubIsAuthorized ?
                <>

                    <Button
                        leftSection={success ? <IconCheck/> : <IconBrandGithub/>}
                        onClick={exportToGithub}
                        loading={loading}
                        color={
                            success ? "green" : "blue"
                        }
                    >
                        {success ?
                            "Success" :
                            "Export to Github"}
                    </Button>
                {url != "" &&
                    <Stack gap="xs">
                        <Text>Your site is on:
                        </Text>

                        <Anchor href={url} target="_blank" rel="noreferrer">
                            {url}
                        </Anchor>
                    </Stack>
                }
                </>
                :
                <GithubLogin/>
            }
        </>
    )
}