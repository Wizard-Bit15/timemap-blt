import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import { format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { motion } from 'framer-motion';

const TimeControls: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [use24Hour, setUse24Hour] = useState(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [savedLocations, setSavedLocations] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeFormat = use24Hour ? 'HH:mm:ss' : 'hh:mm:ss aa';
  const dateFormat = 'EEEE, MMMM d, yyyy';

  const zonedTime = utcToZonedTime(currentTime, selectedTimeZone);

  const addLocation = () => {
    if (!savedLocations.includes(selectedTimeZone)) {
      setSavedLocations([...savedLocations, selectedTimeZone]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <IonCard className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm">
        <IonCardContent>
          <div className="flex flex-col space-y-4">
            <div className="text-3xl font-bold tracking-tight">
              {format(zonedTime, timeFormat)}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {format(zonedTime, dateFormat)}
            </div>
            
            <div className="border-t pt-4">
              <IonItem lines="none">
                <IonLabel>24-Hour Format</IonLabel>
                <IonToggle 
                  slot="end" 
                  checked={use24Hour}
                  onIonChange={e => setUse24Hour(e.detail.checked)}
                />
              </IonItem>
              
              <IonItem lines="none" className="mt-2">
                <IonLabel>Time Zone</IonLabel>
                <IonSelect
                  value={selectedTimeZone}
                  onIonChange={e => setSelectedTimeZone(e.detail.value)}
                  interface="popover"
                >
                  {Intl.supportedValuesOf('timeZone').map(tz => (
                    <IonSelectOption key={tz} value={tz}>
                      {tz.replace(/_/g, ' ')}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-2">Saved Locations</h4>
              <div className="flex flex-wrap gap-2">
                {savedLocations.map(tz => (
                  <IonChip key={tz} className="text-sm">
                    {tz.split('/')[1]} - {format(utcToZonedTime(currentTime, tz), timeFormat)}
                  </IonChip>
                ))}
              </div>
              <IonButton
                expand="block"
                size="small"
                className="mt-2"
                onClick={addLocation}
              >
                Add Current Location
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </motion.div>
  );
};

export default TimeControls;