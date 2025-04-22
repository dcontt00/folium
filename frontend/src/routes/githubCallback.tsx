import {useLocalStorage} from "@mantine/hooks";
import {useEffect, useState} from "react";

export default function GithubCallback() {

    const [state, setState] = useLocalStorage({
        key: 'state',
        defaultValue: '',
    });
    const [value, setValue] = useState("")

    useEffect(
        () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const stateParam = urlParams.get('state');
            if (code && stateParam) {
                if (state === stateParam) {
                    setValue("Success")
                    //window.opener.postMessage({code: code}, "*");
                    //window.close();
                } else {
                    setValue("Failed")
                    console.error("State does not match");
                }
            }
        },
        [state]
    )


    return (
        <>
            <h1>Github Callback</h1>
            <p>Successfully authenticated with Github.</p>
            <p>{value}</p>

        </>
    )
}