import {Button, Divider, Text, Textarea, TextInput, Title} from "@mantine/core";
import axiosInstance from "~/axiosInstance";
import GithubLogin from "~/components/GithubLogin";
import {useEffect, useState} from "react";
import {IconDownload} from "@tabler/icons-react";


interface Props {
    toggleOpenedSettings: () => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    setUnsaved: (unsaved: boolean) => void;
    portfolioUrl: string
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
    useEffect(() => {
        const checkGithubAuthorization = async () => {
            try {
                const response = await axiosInstance.get('/github/status');
                setGithubIsAuthorized(true);
            } catch (error) {
                console.error('Error checking GitHub authorization:', error);
                setGithubIsAuthorized(false);
            }
        };

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
        await axiosInstance.get(`/github/upload`, {
            params: {
                portfolioUrl: portfolioUrl,
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
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
                <Button
                    onClick={exportToGithub}
                >
                    Export to Github
                </Button>
                :
                <GithubLogin/>
            }
        </>
    )
}