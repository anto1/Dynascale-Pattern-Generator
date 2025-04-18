import { create } from "zustand";

interface DiscsState {
  // Disc sizes
  size1: number;
  size2: number;
  size3: number;
  
  // Distance between discs
  distance: number;
  
  // Setter functions
  setSize1: (size: number) => void;
  setSize2: (size: number) => void;
  setSize3: (size: number) => void;
  setDistance: (distance: number) => void;
  
  // Reset function
  resetValues: () => void;
}

// Default values
const DEFAULT_SIZE_1 = 1.0;
const DEFAULT_SIZE_2 = 1.5;
const DEFAULT_SIZE_3 = 2.0;
const DEFAULT_DISTANCE = 0.5;

export const useDiscs = create<DiscsState>((set) => ({
  // Initial state
  size1: DEFAULT_SIZE_1,
  size2: DEFAULT_SIZE_2,
  size3: DEFAULT_SIZE_3,
  distance: DEFAULT_DISTANCE,
  
  // Setter functions
  setSize1: (size: number) => set({ size1: size }),
  setSize2: (size: number) => set({ size2: size }),
  setSize3: (size: number) => set({ size3: size }),
  setDistance: (distance: number) => set({ distance: distance }),
  
  // Reset function - restores defaults
  resetValues: () => set({
    size1: DEFAULT_SIZE_1,
    size2: DEFAULT_SIZE_2,
    size3: DEFAULT_SIZE_3,
    distance: DEFAULT_DISTANCE,
  }),
}));
