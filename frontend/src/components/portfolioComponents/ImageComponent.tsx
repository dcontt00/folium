import React from 'react';
import type {ImageComponentType} from "~/interfaces/interfaces";
import type Style from "~/interfaces/style";

interface Props {
    imageComponent: ImageComponentType;
    style: Style,
}

export default function ImageComponent({imageComponent, style}: Props) {

    const imgContainerClass = style.classes[`${imageComponent.className}-container`];
    const imgOverlayClass = style.classes[`${imageComponent.className}-overlay`];
    console.log("imgContainerClass", imgContainerClass)
    console.log("imgOverlayClass", imgOverlayClass)

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2d3748',
            // @ts-ignore
            width: imgContainerClass.width,
        }}>
            <div style={{position: 'relative', width: '100%'}}>
                <img style={{width: '100%'}} src={imageComponent.url} alt={imageComponent.url}/>
                {imageComponent.overlayText && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `rgba(0, 0, 0, ${imgOverlayClass.imageOverlayTransparency} )`,
                    }}>
                        <span style={{color: 'white', fontSize: '1.125rem'}}>{imageComponent.overlayText}</span>
                    </div>
                )}
            </div>
            {imageComponent.caption && (
                <div style={{marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'white'}}>
                    {imageComponent.caption}
                </div>
            )}
        </div>
    );
}