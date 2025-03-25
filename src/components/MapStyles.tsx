import React from 'react';
import { IonCard, IonCardContent, IonItem, IonLabel, IonRadio, IonRadioGroup } from '@ionic/react';
import useStore from '../store/useStore';

const mapStyles = [
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  },
];

const MapStyles: React.FC = () => {
  const { mapStyle, setMapStyle } = useStore();

  return (
    <IonCard className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm">
      <IonCardContent>
        <h3 className="text-lg font-semibold mb-4">Map Style</h3>
        <IonRadioGroup value={mapStyle} onIonChange={e => setMapStyle(e.detail.value)}>
          {mapStyles.map((style) => (
            <IonItem key={style.name} lines="none">
              <IonLabel>{style.name}</IonLabel>
              <IonRadio slot="start" value={style.url} />
            </IonItem>
          ))}
        </IonRadioGroup>
      </IonCardContent>
    </IonCard>
  );
};

export default MapStyles;