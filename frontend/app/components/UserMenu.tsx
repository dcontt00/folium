import {Avatar, Menu} from "@mantine/core";
import {IconLogout, IconSettings, IconUserCircle,} from "@tabler/icons-react";
import {useNavigate} from "react-router";
import axios from "axios";
import config from "~/config";


export default function UserMenu() {
    const navigate = useNavigate();

    async function onLogout() {
        await axios.get(`${config.BACKEND_URL}/logout`, {withCredentials: false});
        await navigate("/")
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Avatar style={{cursor: 'pointer'}}/>
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