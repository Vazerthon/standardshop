import { create } from "zustand";
import { fetchShoppingListItems, addShoppingListItem as addShoppingListItemRemote } from "./shoppingListRepository";
import { ShoppingListItem, ShopListItemCreate } from "./types";
import { useAddItem, useGetItemByName } from "./useItemsStore";

type ShoppingListItems = {
  [id: ShoppingListItem['id']]: ShoppingListItem;
}

interface ShoppingListState {
  items: ShoppingListItems;
  loading: boolean;
  message: string | null;
  fetchShoppingListItems: () => Promise<void>;
  addShoppingListItem: (item: ShoppingListItem) => Promise<void>;
  maxSortOrder: () => number;
}

const useShoppingListStore = create<ShoppingListState>((set, get) => ({
  items: {},
  loading: false,
  message: null,

  fetchShoppingListItems: async () => {
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

  maxSortOrder: () => {
    const items = get().items;
    return Object.keys(items).length > 0
      ? Math.max(...Object.values(items).map(item => item.sortOrder))
      : 0;
  },

  addShoppingListItem: async (item: ShoppingListItem) => {
    set((state) => ({
      items: {
        ...state.items,
        [item.id]: item,
      },
    }));
  }
}));

export const useShoppingListItems = () => useShoppingListStore((state) => state.items);
export const useShoppingListLoading = () => useShoppingListStore((state) => state.loading);
export const useShoppingListMessage = () => useShoppingListStore((state) => state.message);
export const useShoppingListFetch = () => useShoppingListStore((state) => state.fetchShoppingListItems);
export const useShoppingListMaxSortOrder = () => useShoppingListStore((state) => state.maxSortOrder);
export const useShoppingListAddItem = (name: string) => {
  const addShoppingListItem = useShoppingListStore((state) => state.addShoppingListItem);
  const maxSortOrder = useShoppingListMaxSortOrder();
  const addItem = useAddItem();
  const item = useGetItemByName(name);

  return async () => {
    const id = crypto.randomUUID();
    const newItem = {
      id,
      quantity: 1,
      sortOrder: maxSortOrder() + 1,
    };

    if (!item) {
      const createdItem = await addItem(name);
      const createdShoppingListItem = await addShoppingListItemRemote({
        ...newItem,
        itemId: createdItem.id,
      }); 
      addShoppingListItem(createdShoppingListItem);
    } else {
      const createdShoppingListItem = await addShoppingListItemRemote({
        ...newItem,
        itemId: item.id,
      });
      addShoppingListItem(createdShoppingListItem);
    }
  }
}
export default useShoppingListStore; 