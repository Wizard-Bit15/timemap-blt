import React, { useState } from 'react';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  setupIonicReact,
  IonSplitPane,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonMenuButton
} from '@ionic/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { settings, layers, time, cloud, airplane, moon, flash } from 'ionicons/icons';
import WorldMap from './components/WorldMap';
import TimeControls from './components/TimeControls';
import WeatherOverlay from './components/WeatherOverlay';
import MapStyles from './components/MapStyles';
import PremiumFeatures from './components/PremiumFeatures';
import useStore from './store/useStore';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Leaflet CSS */
import 'leaflet/dist/leaflet.css';

/* Theme variables */
import './theme/variables.css';
import './theme/tailwind.css';

setupIonicReact();

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { activeOverlays, toggleOverlay, isPremium, setIsPremium } = useStore();
  const [showPremium, setShowPremium] = useState(false);

  const handleOverlayToggle = (key: keyof typeof activeOverlays) => {
    if ((key === 'weather' || key === 'traffic' || key === 'earthquakes' || key === 'flights') && !isPremium) {
      setShowPremium(true);
      return;
    }
    toggleOverlay(key);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonSplitPane contentId="main">
          <IonMenu contentId="main">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Settings</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonItem>
                  <IonIcon icon={layers} slot="start" />
                  <IonLabel>Map Style</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={moon} slot="start" />
                  <IonLabel>Day/Night Overlay</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={activeOverlays.dayNight}
                    onIonChange={() => handleOverlayToggle('dayNight')}
                  />
                </IonItem>
                <IonItem>
                  <IonIcon icon={time} slot="start" />
                  <IonLabel>Time Zones</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={activeOverlays.timeZones}
                    onIonChange={() => handleOverlayToggle('timeZones')}
                  />
                </IonItem>
                <IonItem>
                  <IonIcon icon={cloud} slot="start" />
                  <IonLabel>Weather Overlay</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={activeOverlays.weather}
                    onIonChange={() => handleOverlayToggle('weather')}
                  />
                </IonItem>
                <IonItem>
                  <IonIcon icon={airplane} slot="start" />
                  <IonLabel>Traffic Routes</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={activeOverlays.traffic}
                    onIonChange={() => handleOverlayToggle('traffic')}
                  />
                </IonItem>
                <IonItem lines="none" className="mt-4">
                  <IonLabel>Premium Features</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={isPremium}
                    onIonChange={(e) => setIsPremium(e.detail.checked)}
                  />
                </IonItem>
              </IonList>
            </IonContent>
          </IonMenu>

          <div className="ion-page" id="main">
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonMenuButton />
                </IonButtons>
                <IonTitle>World Time Map</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowPremium(true)}>
                    <IonIcon slot="icon-only" icon={flash}></IonIcon>
                  </IonButton>
                  <IonButton>
                    <IonIcon slot="icon-only" icon={settings}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
              <div className="h-full w-full relative">
                <WorldMap />
                <TimeControls />
                <WeatherOverlay center={[0, 0]} />
                <MapStyles />
                {showPremium && <PremiumFeatures />}
              </div>
            </IonContent>
          </div>
        </IonSplitPane>
      </IonApp>
    </QueryClientProvider>
  );
};

export default App;