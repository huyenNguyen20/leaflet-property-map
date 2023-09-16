import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, Polygon, useMapEvent } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { PropertyPin } from "./PropertyPin";
import { PropertyItem } from "./types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { defaultCenter, defaultZoom, defaultZoomMobile } from "./constants";
import { detectMobile } from "./utils";
import Freedraw from "../free-draw/FreeDraw";
import { NONE } from "leaflet-freedraw";

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

type Props = {
  centerLatLng: L.LatLngExpression;
  zoom: number;
  data: PropertyItem[];
  mode: number;
  polygon: number[][];
  handlePolygon: (values: number[][]) => void;
  isReset: boolean;
  setIsReset: (value: boolean) => void;
};

// markers
export default function Map({ centerLatLng, zoom, data, mode, polygon, handlePolygon, isReset, setIsReset }: Props) {
  const [map, setMap] = useState<any>(null);
  const freedrawRef = useRef(null);
  const isMobile = detectMobile();

  const markers: { geocode: [number, number]; popUp: React.ReactNode }[] = useMemo(() => {
    if (polygon.length === 0) {
      return data.map((item) => {
        return {
          geocode: [item.latitude, item.longitude],
          popUp: <PropertyPin item={item} />,
        };
      });
    }
    let boundary: {
      minLat: number;
      maxLat: number;
      minLng: number;
      maxLng: number;
    } = { minLat: polygon[0][0], maxLat: polygon[0][0], minLng: polygon[0][1], maxLng: polygon[0][1] };

    polygon.forEach((latlng: number[]) => {
      const [lat, lng] = latlng;
      const { minLat, maxLat, minLng, maxLng } = boundary;
      boundary = {
        minLat: Math.min(minLat, lat),
        maxLat: Math.max(maxLat, lat),
        minLng: Math.min(minLng, lng),
        maxLng: Math.max(maxLng, lng),
      };
    });

    return data
      .filter((item) => {
        const { latitude: lat, longitude: lng } = item;
        const { minLat, maxLat, minLng, maxLng } = boundary;
        return lat >= minLat && lat <= maxLat && lng <= maxLng && lng >= minLng;
      })
      .map((item) => {
        return {
          geocode: [item.latitude, item.longitude],
          popUp: <PropertyPin item={item} />,
        };
      });
  }, [data, polygon]);

  const handleMarkersDraw = useCallback(
    (event: any) => {
      if (event.eventType == "create" && event.latLngs.length > 0) {
        const latLngs = event.latLngs[event.latLngs.length - 1];
        handlePolygon(
          latLngs.map((latLng: any) => {
            return [latLng.lat, latLng.lng];
          })
        );
      }
    },
    [map, handlePolygon, polygon]
  );
  const handleModeChange = useCallback((event: any) => console.log("mode changed", event), [mode]);

  const handlers = useMemo(
    () => ({
      markers: handleMarkersDraw,
      mode: handleModeChange,
    }),
    [handleMarkersDraw, handleModeChange]
  );

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={defaultCenter}
        zoom={isMobile ? defaultZoomMobile : defaultZoom}
        zoomControl={false}
        ref={setMap as any}
      >
        <TileLayer
          attribution="Google Maps"
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        <ZoomControl position="bottomright" />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
          {/* Mapping through the markers */}
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <Freedraw mode={mode} eventHandlers={handlers} ref={freedrawRef} />
        <Polygon pathOptions={{ color: "#50622b" }} positions={polygon as L.LatLngExpression[]} />
      </MapContainer>
    ),
    [defaultCenter, defaultZoomMobile, defaultZoom, markers, isMobile, handlers, freedrawRef, polygon, mode]
  );

  useEffect(() => {
    if (map) {
      map.setView(centerLatLng, zoom);
      setIsReset(false);
    }
  }, [centerLatLng, zoom, map, isReset]);

  useEffect(() => {
    if (freedrawRef?.current && mode === NONE && polygon.length === 0) (freedrawRef.current as any).clear();
  }, [freedrawRef, mode, polygon]);

  return <>{displayMap}</>;
}
