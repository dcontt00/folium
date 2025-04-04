import type Component from './component';

export default interface imageComponent extends Component {
    url: string;
    caption: string | null;
    overlayText: string | null;
    overlayTransparency: number;
    width: number;
}
