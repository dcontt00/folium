import type Component from './component';

export default interface TextComponent extends Component {
    text: string;
    url: string;
}
