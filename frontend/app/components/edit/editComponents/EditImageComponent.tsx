import type {ImageComponentType} from "~/interfaces/interfaces";
import {Button, FileButton, Stack, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import axios from "axios";
import {IconUpload} from "@tabler/icons-react";
import config from "~/config";

interface Props {
    component: ImageComponentType;
    onEditComponent: (component: ImageComponentType) => void;
}

export default function EditTextComponent({component, onEditComponent}: Props) {
    const [url, setUrl] = useState(component.url);
    const [file, setFile] = useState<File | null>(null);

    // Needed when selecting a different component
    useEffect(() => {
        setUrl(component.url);
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

    function onFileChange(event: any) {
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
    }


    async function onUploadImage() {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("upload", file);

        try {
            const response = await axios.post(`${config.BACKEND_URL}/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
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
        </Stack>
    );
}