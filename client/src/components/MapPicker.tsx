'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Crosshair, Loader2, MapPin, Check } from 'lucide-react';

// Highly-visible, dependency-free glowing SVG marker
const createGpsPinIcon = () => {
  if (typeof window === 'undefined') return undefined as unknown as L.DivIcon;
  return L.divIcon({
    className: 'custom-gps-picker-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(99, 102, 241, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #6366f1; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.8); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

// Automatically pans map view when center changes
function MapCenterSync({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center.lat, center.lng, map]);
  return null;
}

const LocationMarker = ({ 
  position, 
  setPosition 
}: { 
  position: L.LatLng | null; 
  setPosition: (pos: L.LatLng) => void;
}) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  const pinIcon = typeof window !== 'undefined' ? createGpsPinIcon() : undefined;

  return position === null || !pinIcon ? null : (
    <Marker 
      position={position} 
      icon={pinIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
        }
      }}
    />
  );
};

const LocateControl = ({ setPosition }: { setPosition: (pos: L.LatLng) => void }) => {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLocating(true);
    map.locate({ setView: true, maxZoom: 17, enableHighAccuracy: true });
  };

  useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      setLocating(false);
    },
    locationerror() {
      alert("Could not access your location. Please check browser permissions.");
      setLocating(false);
    }
  });

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <button 
        type="button"
        onClick={handleLocate} 
        disabled={locating}
        className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md p-2.5 rounded-full shadow-2xl text-slate-200 hover:text-indigo-400 hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer group"
        title="Detect Live GPS Location"
      >
        {locating ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        ) : (
          <Crosshair className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
};

export default function MapPicker({ initialLat, initialLng, onLocationSelect }: MapPickerProps) {
  const defaultCenter = { lat: initialLat || 26.7825, lng: initialLng || 81.0185 };
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? L.latLng(initialLat, initialLng) : L.latLng(defaultCenter.lat, defaultCenter.lng)
  );
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'street'>('dark');

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position.lat, position.lng);
    }
  };

  return (
    <div className="flex flex-col h-[440px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Floating Basemap Style Switcher */}
      <div className="relative flex-1 z-0">
        <div className="absolute top-3 right-3 z-[1000] flex items-center bg-[#0b0f19]/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl gap-1">
          <button
            type="button"
            onClick={() => setMapStyle('dark')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              mapStyle === 'dark'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            🌙 Dark GIS
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              mapStyle === 'satellite'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('street')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              mapStyle === 'street'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            🗺️ Street
          </button>
        </div>

        <MapContainer 
          center={defaultCenter} 
          zoom={14} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', background: '#0a0d1e' }}
        >
          {mapStyle === 'dark' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="dark-map-tiles"
            />
          )}
          {mapStyle === 'satellite' && (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          {mapStyle === 'street' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          <MapCenterSync center={position || defaultCenter} />
          <LocationMarker position={position} setPosition={setPosition} />
          <LocateControl setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Footer Status & Confirm Bar */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
          {position ? (
            <span>
              Coordinates: <span className="text-white font-mono font-semibold">{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</span>
              <span className="text-slate-500 ml-2 hidden sm:inline">(Drag pin or click map to adjust)</span>
            </span>
          ) : (
            <span>Click anywhere on the map or use GPS to drop a pin</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!position}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          Confirm Location
        </button>
      </div>
    </div>
  );
}
