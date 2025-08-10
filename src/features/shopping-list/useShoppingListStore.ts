import { create } from "zustand";
import { supabase } from "../../supabaseClient";
import { ShoppingListItem } from "./types";

interface ShoppingListState {
  items: ShoppingListItem[];
  loading: boolean;
  message: string | null;
  fetchItems: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string | null) => void;
  clearMessage: () => void;
}

const useShoppingListStore = create<ShoppingListState>((set) => ({
  items: [],
  loading: false,
  message: null,
  
  fetchItems: async () => {
    set({ loading: true, message: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ loading: false, message: "User not authenticated" });
        return;
      }

      const { data: items, error } = await supabase
        .from('shopListItem')
        .select(`
          id,
          quantity,
          sortOrder,
          item:item!itemId(
            id,
            name
          )`)
        .eq('userId', user.id)
        .order('sortOrder');

      if (error) {
        set({ loading: false, message: error.message });
        return;
      }

      const transformedItems: ShoppingListItem[] = (items || []).map(item => ({
        ...item,
        // @ts-expect-error TypeScript doens't understand this is a 1:1 relationship
        name: item.item.name
      }));

      set({ 
        items: transformedItems, 
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