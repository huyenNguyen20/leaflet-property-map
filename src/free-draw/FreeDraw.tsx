import LeafletFreedraw from 'leaflet-freedraw';
import { createLayerComponent } from '@react-leaflet/core';

function createLeafletElement(props: any, context: any) {
    const instance = new LeafletFreedraw({ ...props });
    return { instance, context: { ...context, overlayContainer: instance } };
}

function updateLeafletElement(instance: any, props: any, prevProps: any) {
    if (props.mode !== prevProps.mode) {
        instance.mode(props.mode);
    }
}

const Freedraw = createLayerComponent(
    createLeafletElement,
    updateLeafletElement
);

export default Freedraw;