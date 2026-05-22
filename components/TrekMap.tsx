"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons issue in React-Leaflet
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const customIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface Waypoint {
  lat: number;
  lng: number;
  label: string;
  altitude?: number;
}

interface TrekMapProps {
  waypoints: Waypoint[];
  center?: { lat: number; lng: number };
}

export default function TrekMap({ waypoints, center }: TrekMapProps) {
  // Hook to handle Leaflet config adjustments
  useEffect(() => {
    // Override standard icon options to prevent broken image links
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
  }, []);

  if (!waypoints || waypoints.length === 0) {
    return (
      <div className="w-full h-[400px] bg-primary/5 rounded-xl border border-secondary/20 flex items-center justify-center text-primary/60 font-medium">
        No map data available for this trip.
      </div>
    );
  }

  // Calculate center of all coordinates if not supplied
  const mapCenter: [number, number] = center
    ? [center.lat, center.lng]
    : [waypoints[0].lat, waypoints[0].lng];

  const polylinePositions: [number, number][] = waypoints.map((pt) => [pt.lat, pt.lng]);

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-secondary/15 shadow-inner relative z-10">
      <MapContainer
        center={mapCenter}
        zoom={waypoints.length > 3 ? 10 : 12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draw path line */}
        <Polyline positions={polylinePositions} color="#c8922a" weight={4} opacity={0.8} dashArray="5, 10" />

        {/* Waypoint Markers */}
        {waypoints.map((pt, idx) => (
          <Marker key={idx} position={[pt.lat, pt.lng]} icon={customIcon}>
            <Popup>
              <div className="font-sans text-xs md:text-sm">
                <strong className="text-primary font-serif block text-sm">{pt.label}</strong>
                {pt.altitude && (
                  <span className="text-secondary font-bold mt-1 block">
                    Altitude: {pt.altitude}m / {(pt.altitude * 3.28084).toFixed(0)}ft
                  </span>
                )}
                <span className="text-[10px] text-muted block mt-0.5">
                  Point {idx + 1} of {waypoints.length}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm border border-secondary/20 px-3 py-1.5 rounded-lg text-[10px] md:text-xs text-charcoal shadow flex items-center gap-1.5 font-semibold">
        <span className="h-2 w-2 rounded-full bg-secondary block animate-ping"></span>
        <span>Click markers to view altitudes and waypoint details</span>
      </div>
    </div>
  );
}
