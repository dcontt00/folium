import {Avatar, Menu} from "@mantine/core";
import {IconLogout, IconSettings, IconUserCircle,} from "@tabler/icons-react";
import {useNavigate} from "react-router";
import axiosInstance from "~/axiosInstance";
import {useEffect, useState} from "react";
import config from "~/config";


export default function UserMenu() {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState<string | null>(null);

    async function onLogout() {
        await axiosInstance.get("/logout");
        await navigate("/")
    }

    // Get user data
    useEffect(() => {
        const fetchUser = async () => {
            await axiosInstance.get("/user").then((response) => {

                // Need to add a timestamp to the URL to prevent caching
                const timestamp = new Date().getTime(); // Generate a unique timestamp
                setAvatar(`${config.BACKEND_URL}/images/${response.data.user._id}.jpg?t=${timestamp}`);
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
        }

        fetchUser();
    }, []);

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Avatar src={avatar} style={{cursor: 'pointer'}}/>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<IconSettings size={14}/>}>
                    Settings
                </Menu.Item>

                <Menu.Divider/>

                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                    leftSection={<IconUserCircle size={14}/>}
                    onClick={() => navigate("/profile")}
                >
                    Profile
                </Menu.Item>
                <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14}/>}
                    onClick={onLogout}
                >
                    Log Out
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}