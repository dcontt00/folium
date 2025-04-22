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
        const rootUrl = window.location.origin;
        const redirectUrl = `${rootUrl}/auth/github/callback`;
        console.log("redirectUrl", redirectUrl);
        window.open(
            `https://github.com/login/oauth/authorize?client_id=${config.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=repo&state=${cryptoState}`,
            "_blank"
        );
    }

    return (
        <Button onClick={navigateToGithubLogin}>
            Login to Github
        </Button>
    );
}