import React from 'react';
import { IonCard, IonCardContent, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { diamond, rocket, flash } from 'ionicons/icons';
import useStore from '../store/useStore';

const PremiumFeatures: React.FC = () => {
  const { isPremium, setIsPremium } = useStore();

  const features = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['World Clock', 'Time Zones', 'Day/Night View'],
      icon: flash,
    },
    {
      name: 'Premium',
      price: '$4.99/mo',
      features: [
        'All Basic Features',
        'Real-time Weather',
        'Flight Tracking',
        'Earthquake Data',
      ],
      icon: diamond,
    },
    {
      name: 'Lifetime',
      price: '$49.99',
      features: [
        'All Premium Features',
        'Lifetime Access',
        'Priority Support',
        'Early Access',
      ],
      icon: rocket,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <IonCard className="w-full max-w-4xl mx-4">
        <IonCardContent>
          <h2 className="text-2xl font-bold mb-8 text-center">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((plan) => (
              <div
                key={plan.name}
                className="border rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow"
              >
                <IonIcon
                  icon={plan.icon}
                  className="text-4xl mb-4 text-primary"
                />
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-2xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <IonButton
                  expand="block"
                  onClick={() => setIsPremium(true)}
                  className="mt-auto"
                >
                  {plan.name === 'Basic' ? 'Current Plan' : 'Choose Plan'}
                </IonButton>
              </div>
            ))}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default PremiumFeatures;