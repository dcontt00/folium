import {Button} from "@mantine/core";
import {useLocalStorage} from "@mantine/hooks";
import {IconBrandGithub} from "@tabler/icons-react";
import axiosInstance from "~/axiosInstance";
import type {AxiosResponse} from "axios";


interface GithubLoginProps {
    onClick: () => void;
}

export default function GithubLogin({onClick}: GithubLoginProps) {
    const [state, setState] = useLocalStorage({
        key: 'state',
        defaultValue: '',
    });

    async function navigateToGithubLogin() {
        onClick()
        const oauthClientID = await axiosInstance.get("/github/oauth-url").then((response: AxiosResponse) => {
            return response.data.GH_OAUTH_CLIENT_ID;
        })
        const cryptoState = crypto.randomUUID().toString();
        setState(cryptoState);
        const rootUrl = window.location.origin;
        const redirectUrl = `${rootUrl}/github-callback`;
        console.log("redirectUrl", redirectUrl);
        window.open(
            `https://github.com/login/oauth/authorize?client_id=${oauthClientID}&redirect_uri=${redirectUrl}&response_type=code&scope=repo&state=${cryptoState}`,
        );
    }

    return (
        <Button
            leftSection={<IconBrandGithub/>}
            onClick={navigateToGithubLogin}
        >
            Login to Github
        </Button>
    );
}