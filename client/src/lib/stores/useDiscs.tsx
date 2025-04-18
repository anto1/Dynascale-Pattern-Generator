import { create } from "zustand";

interface DiscsState {
  // Disc sizes
  size1: number;
  size2: number;
  size3: number;
  
  // Distance between discs
  distance: number;
  
  // Ellipsis proportion (aspect ratio) - affects all discs
  ellipsisProportion: number;
  
  // Setter functions
  setEllipsisProportion: (proportion: number) => void;
  setDistance: (distance: number) => void;
  
  // Reset function
  resetValues: () => void;
}

// Default values
const DEFAULT_SIZE_1 = 1.0;
const DEFAULT_SIZE_2 = 1.5;
const DEFAULT_SIZE_3 = 2.0;
const DEFAULT_DISTANCE = 0.5;
const DEFAULT_ELLIPSIS_PROPORTION = 1.0; // 1.0 means circle, < 1.0 means ellipsis

export const useDiscs = create<DiscsState>((set) => ({
  // Initial state
  size1: DEFAULT_SIZE_1,
  size2: DEFAULT_SIZE_2,
  size3: DEFAULT_SIZE_3,
  distance: DEFAULT_DISTANCE,
  ellipsisProportion: DEFAULT_ELLIPSIS_PROPORTION,
  
  // Setter functions
  setDistance: (distance: number) => set({ distance }),
  setEllipsisProportion: (proportion: number) => set({ ellipsisProportion: proportion }),
  
  // Reset function - restores defaults
  resetValues: () => set({
    size1: DEFAULT_SIZE_1,
    size2: DEFAULT_SIZE_2,
    size3: DEFAULT_SIZE_3,
    distance: DEFAULT_DISTANCE,
    ellipsisProportion: DEFAULT_ELLIPSIS_PROPORTION,
  }),
}));
