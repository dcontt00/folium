import {Button, Divider, PasswordInput, Text, Textarea, TextInput, Title} from "@mantine/core";
import axiosInstance from "~/axiosInstance";
import {useState} from "react";
import GithubLogin from "~/components/GithubLogin";


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
                githubUsername: githubUsername,
                githubToken: githubToken
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    const [githubUsername, setGithubUsername] = useState("");
    const [githubToken, setGithubToken] = useState("");


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
                onClick={exportAndSave}
            >
                Export and download
            </Button>

            <GithubLogin/>


            <Title order={3}>Login to Github</Title>
            <TextInput
                label="Github Username"
                value={githubUsername}
                onChange={(event) => setGithubUsername(event.currentTarget.value)}
            />
            <PasswordInput
                label="Github Token"
                value={githubToken}
                onChange={(event) => setGithubToken(event.currentTarget.value)}
            />
            <Button
                onClick={exportToGithub}
            >Ok</Button>

        </>
    )
}