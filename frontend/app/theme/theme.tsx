import {Button, createTheme, rem} from "@mantine/core";
import classes from "./theme.module.css"


const theme = createTheme({
    headings: {
        sizes: {
            h1: {fontSize: rem(80), lineHeight: "1.2"},
            h2: {fontSize: rem(50), lineHeight: "1.2"},
            h3: {fontSize: rem(24), lineHeight: "1.2"},
            h4: {fontSize: rem(20), lineHeight: "1.2"},
            h5: {fontSize: rem(18), lineHeight: "1.2"},
            h6: {fontSize: rem(16), lineHeight: "1.2"},
        }
    },
    components: {
        Button: Button.extend({
            classNames: classes,
        }),
    },
    /** Your theme override here */
});


export default theme;