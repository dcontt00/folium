import {Button, Divider, Text, Textarea, TextInput, Title} from "@mantine/core";
import axiosInstance from "~/axiosInstance";


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
        </>
    )
}