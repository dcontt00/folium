// route("products/:pid", "./product.tsx");
import { AppShell, Burger } from "@mantine/core";
import type { Route } from "./+types/data";
import { useDisclosure } from "@mantine/hooks";

export async function clientLoader({
                                       params,
                                   }: Route.ClientLoaderArgs) {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const product = await res.json();
    return product;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function data({loaderData,}: Route.ComponentProps) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <div>Logo</div>
            </AppShell.Header>

            <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

            <AppShell.Main>Main</AppShell.Main>
        </AppShell>
    );
}
