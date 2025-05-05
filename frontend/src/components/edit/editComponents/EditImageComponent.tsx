import type {ImageComponentType} from "~/interfaces/interfaces";
import {Button, FileButton, Slider, Stack, Text, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconUpload} from "@tabler/icons-react";
import config from "~/config";
import axiosInstance from "~/axiosInstance";
import type StyleClass from "~/interfaces/styleClass";

interface Props {
    component: ImageComponentType;
    portfolioUrl: string;
    onEditComponent: (component: ImageComponentType) => void;
    styleClass: StyleClass,
    onStyleChange: (identifier: string, attribute: string, value: string) => void;
}

export default function EditTextComponent({
                                              component,
                                              onEditComponent,
                                              styleClass,
                                              onStyleChange,
                                              portfolioUrl
                                          }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState(component.caption);
    const [overlayText, setOverlayText] = useState(component.overlayText);
    const [overlayTransparency, setOverlayTransparency] = useState(Number(styleClass.imageOverlayTransparency || 0.5));
    const [width, setWidth] = useState(Number(styleClass.imageWidth) || 1);
    console.log("width", width)

    console.log("editimagecomponent", styleClass)
    console.log("overlayTransparency", overlayTransparency)
    // Needed when selecting a different component
    useEffect(() => {
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

    function onWidthChange(value: number) {
        setWidth(value);

        onStyleChange(`${component.className}-container`, 'imageWidth', `${value * 100}%`);
        //handleOnStyleChange("imageWidth", value.toString());
        onEditComponent(component);
    }

    function onOverlayTransparencyChange(value: number) {
        console.log("onOverlayTransparencyChange", value)
        setOverlayTransparency(value);

        onStyleChange(`${component.className}-overlay`, 'imageOverlayTransparency', value.toString());
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
                params: {
                    portfolioUrl: portfolioUrl,
                }
            });

            const url = `${config.BACKEND_URL}${response.data.url}`;
            console.log("Image uploaded successfully:", url);
            component.url = url;
            onEditComponent(component);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }


    return (
        <Stack gap="md">
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => <Button leftSection={<IconUpload/>} {...props}>Upload image</Button>}
            </FileButton>

            <div>
                <Text>Width</Text>
                <Slider
                    color="blue"
                    min={0} max={1} step={0.01}
                    label={(value) => `${Math.round(value * 100)} %`}
                    value={width} onChange={onWidthChange}
                    marks={[
                        {value: 0.2, label: '20%'},
                        {value: 0.5, label: '50%'},
                        {value: 0.8, label: '80%'},
                    ]}
                />
            </div>

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

            {overlayText && (
                <div>
                    <Text>Overlay Transparency</Text>
                    <Slider
                        color="blue"
                        min={0} max={1} step={0.01}
                        label={(value) => `${Math.round(value * 100)} %`}
                        value={overlayTransparency}
                        onChange={onOverlayTransparencyChange}
                    />
                </div>
            )}


        </Stack>
    );
}