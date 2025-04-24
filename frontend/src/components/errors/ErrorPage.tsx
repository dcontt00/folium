import {Button, Container, Group, Text, Title} from '@mantine/core';
import classes from './ErrorPage.module.css';
import {useNavigate} from "react-router";

interface NotFoundProps {
    errorCode: number;
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;

}

export default function NotFound({errorCode, title, description, buttonLink, buttonText}: NotFoundProps) {
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
                        navigate(buttonLink ? buttonLink : "/home")
                    }}
                >
                    {buttonText ? buttonText : "Take me back to home page"}
                </Button>
            </Group>
        </Container>
    );
}