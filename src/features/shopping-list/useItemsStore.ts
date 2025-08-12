import { create } from "zustand";
import { addItem, fetchItems } from "./itemsRepository";
import { Item } from "./types";

type Items = {
  [name: Item['name']]: Item;
}

interface ItemsState {
  items: Items;
  loading: boolean;
  message: string | null;
  fetchItems: () => Promise<void>;
  addItem: (name: string) => Promise<Item>;
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
        items: items.reduce((acc: { [name: Item['name']]: Item }, item) => ({
          ...acc,
          [item.name]: item
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

  addItem: async (name: string) => {
    if (!name.trim()) {
      throw new Error("Item name cannot be empty");
    }
    try {
      const newItem = await addItem(name.trim());
      set((state) => ({
        items: {
          ...state.items,
          [newItem.name]: newItem
        }
      }));
      return newItem;
    } catch (error) {
      throw error;
    }
  }
}));

// Custom hooks for specific functionality
export const useItems = () => useItemsStore((state) => state.items);
export const useGetItemByName = (name: Item['name']) => useItemsStore((state) => state.items[name]);
export const useAddItem = () => useItemsStore((state) => state.addItem);
export const useItemsFetch = () => useItemsStore((state) => state.fetchItems);

export default useItemsStore;
