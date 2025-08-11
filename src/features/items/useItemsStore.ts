import { create } from "zustand";
import { fetchItems } from "./itemsRepository";
import { Item } from "./types";

type Items = {
  [id: Item['id']]: Item;
}

interface ItemsState {
  items: Items;
  loading: boolean;
  message: string | null;
  fetchItems: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string | null) => void;
  clearMessage: () => void;
}

const useItemsStore = create<ItemsState>((set) => ({
  items: {},
  loading: false,
  message: null,
  
  fetchItems: async () => {
    set({ loading: true, message: null });
    
    try {
      const items = await fetchItems();
      set({ 
        items: items.reduce((acc: { [id: Item['id']]: Item }, item) => ({
          ...acc,
          [item.id]: item
        }), {}),
        loading: false, 
        message: null 
      });
    } catch (error) {
      set({ 
        loading: false, 
        message: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  setLoading: (loading: boolean) => set({ loading }),
  setMessage: (message: string | null) => set({ message }),
  clearMessage: () => set({ message: null }),
}));

// Custom hooks for specific functionality
export const useItems = () => useItemsStore((state) => state.items);
export const useItemsLoading = () => useItemsStore((state) => state.loading);
export const useItemsMessage = () => useItemsStore((state) => state.message);
export const useItemsFetch = () => useItemsStore((state) => state.fetchItems);

export default useItemsStore;
