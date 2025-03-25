import React, { useState } from 'react';
import { IonCard, IonCardContent, IonChip, IonToggle, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { getWeatherData } from '../services/api';
import useStore from '../store/useStore';

interface WeatherOverlayProps {
  center: [number, number];
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ center }) => {
  const { isPremium } = useStore();
  const [activeOverlays, setActiveOverlays] = useState({
    temperature: true,
    precipitation: false,
    wind: false,
    clouds: false
  });

  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', center],
    queryFn: () => getWeatherData(center[0], center[1]),
    enabled: isPremium,
    refetchInterval: 300000, // 5 minutes
  });

  const handleToggle = (overlay: keyof typeof activeOverlays) => {
    if (!isPremium) {
      alert('This feature requires a premium subscription');
      return;
    }
    setActiveOverlays(prev => ({
      ...prev,
      [overlay]: !prev[overlay]
    }));
  };

  return (
    <IonCard className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm">
      <IonCardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Weather</h3>
            {isLoading && <IonSpinner name="dots" />}
          </div>
          
          {weather && (
            <div className="mb-4">
              <div className="text-2xl font-bold">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-sm text-gray-600">
                {weather.weather[0].description}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <IonItem lines="none">
              <IonLabel>Temperature</IonLabel>
              <IonToggle
                slot="end"
                checked={activeOverlays.temperature}
                onIonChange={() => handleToggle('temperature')}
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Precipitation</IonLabel>
              <IonToggle
                slot="end"
                checked={activeOverlays.precipitation}
                onIonChange={() => handleToggle('precipitation')}
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Wind</IonLabel>
              <IonToggle
                slot="end"
                checked={activeOverlays.wind}
                onIonChange={() => handleToggle('wind')}
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Clouds</IonLabel>
              <IonToggle
                slot="end"
                checked={activeOverlays.clouds}
                onIonChange={() => handleToggle('clouds')}
              />
            </IonItem>
          </div>
          
          {!isPremium && (
            <div className="text-sm text-yellow-600 mt-2 p-2 bg-yellow-50 rounded-md">
              ⭐ Upgrade to Premium for real-time weather data
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default WeatherOverlay;