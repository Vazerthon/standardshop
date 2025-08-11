import { create } from "zustand";
import { fetchShoppingListItems } from "./shoppingListRepository";
import { ShoppingListItem } from "./types";

type ShoppingListItems = {
  [id: ShoppingListItem['id']]: ShoppingListItem;
}

interface ShoppingListState {
  items: ShoppingListItems;
  loading: boolean;
  message: string | null;
  fetchItems: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string | null) => void;
  clearMessage: () => void;
}

const useShoppingListStore = create<ShoppingListState>((set) => ({
  items: {},
  loading: false,
  message: null,

  fetchItems: async () => {
    set({ loading: true, message: null });

    try {
      const items = await fetchShoppingListItems();
      set({
        items: items.reduce((acc: ShoppingListItems, item) => ({
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
export const useShoppingListItems = () => useShoppingListStore((state) => state.items);
export const useShoppingListLoading = () => useShoppingListStore((state) => state.loading);
export const useShoppingListMessage = () => useShoppingListStore((state) => state.message);
export const useShoppingListFetch = () => useShoppingListStore((state) => state.fetchItems);

export default useShoppingListStore; 