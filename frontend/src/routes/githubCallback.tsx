import {useLocalStorage} from "@mantine/hooks";
import {useEffect, useState} from "react";
import axiosInstance from "~/axiosInstance";

export default function GithubCallback() {

    const [state, setState] = useLocalStorage({
        key: 'state',
        defaultValue: '',
    });
    const [value, setValue] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const stateParam = urlParams.get('state');

            if (code && stateParam) {
                if (state === stateParam) {
                    try {
                        const response = await axiosInstance.get(`/github/oauth?code=${code}`);
                        setValue("Success: " + response.data.message);
                    } catch (error) {
                        console.error("Error during API call:", error);
                        setValue("Failed to authenticate");
                    }
                } else {
                    setValue("Failed");
                    console.error("State does not match");
                }
            }
        };

        fetchData();
    }, [state]);

    return (
        <>
            <h1>Github Callback</h1>
            <p>Successfully authenticated with Github.</p>
            <p>{value}</p>
        </>
    );
}