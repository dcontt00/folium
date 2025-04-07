import React from 'react';
import type {ImageComponentType} from "~/interfaces/interfaces";

interface Props {
    imageComponent: ImageComponentType;
}

export default function ImageComponent({imageComponent}: Props) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2d3748',
            width: `${imageComponent.width * 100}%`
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
                        backgroundColor: `rgba(0, 0, 0, ${imageComponent.overlayTransparency} )`,
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