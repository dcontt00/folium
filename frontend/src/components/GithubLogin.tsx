import config from "~/config";
import {Button} from "@mantine/core";
import {useLocalStorage} from "@mantine/hooks";

export default function GithubLogin() {
    const [state, setState] = useLocalStorage({
        key: 'state',
        defaultValue: '',
    });

    function navigateToGithubLogin() {
        const cryptoState = crypto.randomUUID().toString();
        setState(cryptoState);
        window.open(
            `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_OAUTH_CLIENT_ID}&response_type=code&scope=repo&redirect_uri=http://localhost:3000/auth/github/callback&state=${cryptoState}`,
            "_blank"
        );
    }

    return (
        <Button onClick={navigateToGithubLogin}>
            Login to Github
        </Button>
    );
}