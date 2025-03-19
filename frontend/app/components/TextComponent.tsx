import {Text, Textarea} from "@mantine/core";

interface TextComponentProps {
    text: string;
    edit: boolean;
}

export default function TextComponent({text, edit}: TextComponentProps) {
    return (
        <>
            {edit ? (
                <Textarea value={text} onChange={(event) => console.log(event.target.value)}/>
            ) : (
                <Text>{text}</Text>
            )}
        </>
    )
}