import type {ImageComponentType} from "~/interfaces/interfaces";
import {Button, FileButton, Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconUpload} from "@tabler/icons-react";
import config from "~/config";
import axiosInstance from "~/axiosInstance";

interface Props {
    component: ImageComponentType;
    onEditComponent: (component: ImageComponentType) => void;
}

export default function EditTextComponent({component, onEditComponent}: Props) {
    const [url, setUrl] = useState(component.url);
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState(component.caption);
    const [overlayText, setOverlayText] = useState(component.overlayText);

    // Needed when selecting a different component
    useEffect(() => {
        setUrl(component.url);
        setCaption(component.caption)
        setOverlayText(component.overlayText)
    }, [component]);

    useEffect(() => {
        console.log(file)
        if (!file) {
            return;
        }
        const fetchData = async () => {
            await onUploadImage()
        }

        fetchData();

    }, [file]);

    function onUrlChange(event: any) {
        setUrl(event.target.value);

        // Change the text of the component
        component.url = event.target.value;
        onEditComponent(component);
    }

    function onOverlayTextChange(event: any) {
        setOverlayText(event.target.value);

        // Change the text of the component
        component.overlayText = event.target.value;
        onEditComponent(component);
    }

    function onCaptionChange(event: any) {
        setCaption(event.target.value);

        // Change the text of the component
        component.caption = event.target.value;
        onEditComponent(component);
    }

    async function onUploadImage() {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("upload", file);

        try {
            const response = await axiosInstance.post(`/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const url = `${config.BACKEND_URL}${response.data.url}`;
            setUrl(url);
            component.url = url;
            onEditComponent(component);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }


    return (
        <Stack>
            <TextInput
                label="Url"
                value={url}
                onChange={(event) => onUrlChange(event)}
            />
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => <Button leftSection={<IconUpload/>} {...props}>Upload image</Button>}
            </FileButton>
            <TextInput
                label="Caption"
                description="This text will appear below the image"
                value={caption || ""}
                onChange={(event) => onCaptionChange(event)}
            />
            <TextInput
                label="Overlay text"
                description="This text will appear on top of the image"
                value={overlayText || ""}
                onChange={(event) => onOverlayTextChange(event)}
            />
        </Stack>
    );
}