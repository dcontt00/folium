import Component from "@/classes/components/Component";

export default class ImageComponent extends Component {
    url: string;
    caption: string;
    overlayText: string;
    overlayTransparency: number;
    width: number;

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, className: string, url: string, caption: string, overlayText: string, overlayTransparency: number, width: number) {
        super(_id, __t, componentId, index, parent_id, className);
        this.url = url;
        this.caption = caption;
        this.overlayText = overlayText;
        this.overlayTransparency = overlayTransparency;
        this.width = width;

    }

    toHtml() {
        return `
         <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2d3748',
            width: ${this.width * 100}%
        }}>
            <div style={{position: 'relative', width: '100%'}}>
                <img style={{width: '100%'}} src=${this.url} alt=${this.url}/>
                ${this.overlayText ? `
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, ${this.overlayTransparency})',
                    }}>
                        <span style={{color: 'white', fontSize: '1.125rem'}}>${this.overlayText}</span>
                    </div>
                 ` : ''}
            </div>
            ${this.caption ? `
                <div style={{marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'white'}}>
                    ${this.caption}
                </div>
            ` : ''}
        </div>
        
        
        `;
    }
}