import {Container} from "@mantine/core";
import Login from "~/components/login";
import {Helmet} from "react-helmet";


export default function LoginRoute() {

    return (
        <>
            <Helmet>
                <title>Folium - Login</title>
            </Helmet>
            <Container size="xs">
                <Login/>
            </Container>
        </>
    );
}



