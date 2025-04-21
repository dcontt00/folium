import type Component from './component';

export enum TextStyle {
    NORMAL = "normal",
    BOLD = "bold",
    ITALIC = "italic"
}

export enum TextType {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    P = "p"
}

export default interface TextComponent extends Component {
    text: string;
    style: TextStyle;
    type: TextType;
}