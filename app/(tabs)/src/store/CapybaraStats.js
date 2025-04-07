import { create } from 'zustand';

export const CapybaraStats = create((set, get) => ({
  hunger: 100,
  happiness: 100,
  energy: 100,

  feed: () => set((state) => ({ hunger: Math.min(state.hunger + 10, 100) })),
  play: () => set((state) => ({ happiness: Math.min(state.happiness + 10, 100) })),
  sleep: () => set((state) => ({ energy: Math.min(state.energy + 10, 100) })),

  decreaseStats: () => {
    const { hunger, happiness, energy } = get();
    set({
      hunger: Math.max(hunger - 5, 0),
      happiness: Math.max(happiness - 5, 0),
      energy: Math.max(energy - 5, 0),
    });
  },
}));
