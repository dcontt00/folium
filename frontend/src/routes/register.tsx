import {Container} from "@mantine/core";
import Register from "~/components/register";
import {Helmet} from "react-helmet";

export default function RegisterRoute() {

    return (
        <>
            <Helmet>
                <title>Folium - Register</title>
            </Helmet>
            <Container size="xs">
                <Register/>
            </Container>
        </>
    );
}



