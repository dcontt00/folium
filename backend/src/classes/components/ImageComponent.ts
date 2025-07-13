import Component from "@/classes/components/Component";

export default class ImageComponent extends Component {
    url: string;
    caption: string;
    overlayText: string;

    constructor(_id: string, __t: string, componentId: number, index: number, parent_id: string, className: string, url: string, caption: string, overlayText: string) {
        super(_id, __t, componentId, index, parent_id, className);
        this.url = url;
        this.caption = caption;
        this.overlayText = overlayText;

    }

    toHtml() {
        let formattedUrl = this.url;
        if (!this.url.includes("placehold")) {
            formattedUrl = "images/" + this.url.split('/').pop();
        }
        return `
         <div
          class="${this.className}-container">
            <div style="position: relative; width: 100%">
                <img style="width: 100%" src=${formattedUrl} />
                ${this.overlayText ? `
                    <div class="${this.className}-overlay">
                        <span style="color: white;">${this.overlayText}</span>
                    </div>
                 ` : ''}
            </div>
            ${this.caption ? `
                <div class="${this.className}-caption">
                    ${this.caption}
                </div>
            ` : ''}
        </div>
        `;
    }
}