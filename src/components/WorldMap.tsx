import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Circle, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import SunCalc from 'suncalc';
import { getEarthquakes } from '../services/api';
import useStore from '../store/useStore';

interface DayNightOverlayProps {
  map: L.Map;
}

const DayNightOverlay: React.FC<DayNightOverlayProps> = ({ map }) => {
  const { activeOverlays } = useStore();

  useEffect(() => {
    if (!activeOverlays.dayNight) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const updateDayNightOverlay = () => {
      const bounds = map.getBounds();
      const width = map.getSize().x;
      const height = map.getSize().y;
      
      canvas.width = width;
      canvas.height = height;
      
      if (!ctx) return;
      
      ctx.clearRect(0, 0, width, height);
      
      const now = new Date();
      
      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y += 2) {
          const latLng = map.containerPointToLatLng([x, y]);
          const sunPos = SunCalc.getPosition(now, latLng.lat, latLng.lng);
          
          const altitude = sunPos.altitude;
          const alpha = altitude > 0 ? 0 : Math.abs(altitude) * 0.7;
          
          ctx.fillStyle = `rgba(0, 0, 40, ${alpha})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      
      const imageOverlay = L.imageOverlay(canvas.toDataURL(), bounds, {
        opacity: 0.5,
        interactive: false,
      });
      
      return imageOverlay;
    };
    
    const overlay = updateDayNightOverlay();
    if (overlay) {
      overlay.addTo(map);
    }
    
    const interval = setInterval(() => {
      if (overlay) {
        overlay.remove();
      }
      const newOverlay = updateDayNightOverlay();
      if (newOverlay) {
        newOverlay.addTo(map);
      }
    }, 60000); // Update every minute
    
    return () => {
      clearInterval(interval);
      if (overlay) {
        overlay.remove();
      }
    };
  }, [map, activeOverlays.dayNight]);
  
  return null;
};

const EarthquakeOverlay: React.FC = () => {
  const { isPremium, activeOverlays } = useStore();
  const { data: earthquakes } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: getEarthquakes,
    enabled: isPremium && activeOverlays.earthquakes,
    refetchInterval: 300000, // 5 minutes
  });

  if (!isPremium || !activeOverlays.earthquakes || !earthquakes) return null;

  return (
    <>
      {earthquakes.features.map((quake: any) => (
        <Circle
          key={quake.id}
          center={[quake.geometry.coordinates[1], quake.geometry.coordinates[0]]}
          radius={quake.properties.mag * 20000}
          pathOptions={{
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.3,
          }}
        >
          <Popup>
            <div>
              <h3 className="font-bold">Magnitude {quake.properties.mag}</h3>
              <p>{quake.properties.place}</p>
              <p className="text-sm text-gray-600">
                {new Date(quake.properties.time).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
};

const MapComponent: React.FC = () => {
  const map = useMap();
  return (
    <>
      <DayNightOverlay map={map} />
      <EarthquakeOverlay />
    </>
  );
};

const WorldMap: React.FC = () => {
  const { mapStyle } = useStore();
  const [center] = useState<[number, number]>([20, 0]);
  
  return (
    <MapContainer
      center={center}
      zoom={3}
      className="h-full w-full"
      scrollWheelZoom={true}
      minZoom={2}
      maxZoom={18}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={mapStyle}
      />
      <MapComponent />
    </MapContainer>
  );
};

export default WorldMap;