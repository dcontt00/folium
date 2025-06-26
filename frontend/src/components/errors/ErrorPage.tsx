import {Button, Container, Group, Text, Title} from '@mantine/core';
import classes from './ErrorPage.module.css';
import {useNavigate} from "react-router";

interface NotFoundProps {
    errorCode: number;
    title: string;
    description: string;
    button1Text?: string;
    button1Link?: string;

    button2Text?: string;
    button2Link?: string;

}

export default function NotFound({
                                     errorCode,
                                     title,
                                     description,
                                     button1Link,
                                     button1Text,
                                     button2Link,
                                     button2Text
                                 }: NotFoundProps) {
    const navigate = useNavigate();
    return (
        <Container className={classes.root}>
            <div className={classes.label}>{errorCode}</div>
            <Title className={classes.title}>{title}</Title>
            <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                {description}
            </Text>
            <Group justify="center">
                <Button
                    variant="subtle"
                    size="md"
                    onClick={() => {
                        navigate(button1Link ? button1Link : "/home")
                    }}
                >
                    {button1Text ? button1Text : "Take me back to home page"}
                </Button>
            </Group>

            {button2Text && button2Link && (
                <Group justify="center" mt="md">
                    <Button
                        variant="subtle"
                        size="md"
                        onClick={() => {
                            navigate(button2Link);
                        }}
                    >
                        {button2Text}
                    </Button>
                </Group>
            )}
        </Container>
    );
}