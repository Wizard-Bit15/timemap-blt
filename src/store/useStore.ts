import create from 'zustand';

interface MapState {
  mapStyle: string;
  setMapStyle: (style: string) => void;
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
  activeOverlays: {
    weather: boolean;
    dayNight: boolean;
    timeZones: boolean;
    traffic: boolean;
    earthquakes: boolean;
    flights: boolean;
  };
  toggleOverlay: (key: keyof MapState['activeOverlays']) => void;
}

const useStore = create<MapState>((set) => ({
  mapStyle: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  setMapStyle: (style) => set({ mapStyle: style }),
  isPremium: false,
  setIsPremium: (value) => set({ isPremium: value }),
  activeOverlays: {
    weather: false,
    dayNight: true,
    timeZones: true,
    traffic: false,
    earthquakes: false,
    flights: false,
  },
  toggleOverlay: (key) =>
    set((state) => ({
      activeOverlays: {
        ...state.activeOverlays,
        [key]: !state.activeOverlays[key],
      },
    })),
}));

export default useStore;