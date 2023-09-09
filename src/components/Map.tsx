import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { PropertyPin } from "./PropertyPin";
import { PropertyItem } from "./types";
import { useEffect, useMemo, useState } from "react";
import { defaultCenter, defaultZoom, defaultZoomMobile } from "./constants";
import { detectMobile } from "./utils";

// create custom icon
const customIcon = new Icon({
    iconUrl: require("../icons/placeholder.png"),
    iconSize: [38, 38], // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = (cluster: { getChildCount: () => any }) => {
    return divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: point(33, 33, true),
    });
};

// markers
export default function Map({centerLatLng, zoom, data} : {centerLatLng: L.LatLngExpression, zoom: number, data: PropertyItem[]}) {
    const [map, setMap] = useState<any>(null)

    const isMobile = detectMobile();
    
    const markers: { geocode: [number, number]; popUp: React.ReactNode }[] = data.map((item, index) => {
        return {
            geocode: [item.latitude, item.longitude],
            popUp: <PropertyPin item={item} />,
        };
    });

    const displayMap = useMemo(() => (
        <MapContainer center={defaultCenter} zoom={isMobile ? defaultZoomMobile : defaultZoom} zoomControl={false} ref={setMap as any}>
            <TileLayer
                attribution="Google Maps"
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
            <ZoomControl position='bottomright' />
            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                {/* Mapping through the markers */}
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.geocode} icon={customIcon}>
                        <Popup>{marker.popUp}</Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    ), [defaultCenter, defaultZoomMobile, defaultZoom, markers, isMobile])

    useEffect(() => {
        if(map){
            map.setView(centerLatLng, zoom)
        }
    }, [centerLatLng, zoom, map])
    return (
        <>
        {displayMap}
        </>
    );
}
