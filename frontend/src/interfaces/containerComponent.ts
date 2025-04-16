import type Component from './component';

export default interface ContainerComponent extends Component {
    components: Component[];
}