import { create } from 'zustand';

export const CapybaraStats = create((set, get) => ({
    hunger: 100,
    happiness: 100,
    energy: 100,
    coins: 100,
    inventory: [],
    placedObjects: [],

    feed: () => set((state) => ({ hunger: Math.min(state.hunger + 10, 100) })),
    play: () => set((state) => ({ happiness: Math.min(state.happiness + 10, 100) })),
    sleep: () => set((state) => ({ energy: Math.min(state.energy + 10, 100) })),

    addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
    spendCoins: (amount) => set((state) => ({ coins: Math.max(state.coins - amount, 0) })),

    buyObject: (object) => {
      const { coins, inventory } = get();
      if (coins >= object.price) {
        set({
          coins: coins - object.price,
          inventory: [...inventory, object],
        });
        return true;
      }
      return false;
    },

    placeObject: (objectId, type, position, size = { width: 60, height: 60 }) => {
      const { placedObjects, inventory } = get();
      set({
        inventory: inventory.filter(obj => obj.id !== objectId),
        placedObjects: [
          ...placedObjects,
          { id: objectId, type, position, size }
        ],
      });
    },

    updatePlacedObject: (objectId, updates) => {
      set((state) => ({
        placedObjects: state.placedObjects.map(obj =>
          obj.id === objectId ? { ...obj, ...updates } : obj
        ),
      }));
    },

    removePlacedObject: (objectId) => {
      const { placedObjects, inventory } = get();
      const obj = placedObjects.find(o => o.id === objectId);
      set({
        placedObjects: placedObjects.filter(o => o.id !== objectId),
        inventory: [...inventory, obj],
      });
    },

    decreaseStats: () => {
      const { hunger, happiness, energy } = get();
      set({
        hunger: Math.max(hunger - 5, 0),
        happiness: Math.max(happiness - 5, 0),
        energy: Math.max(energy - 5, 0),
      });
    },
  }));
