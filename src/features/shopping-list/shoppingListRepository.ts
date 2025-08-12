import { supabase } from "../../supabaseClient";
import { ShopListItemCreate, ShoppingListItem } from "./types";

interface SupabaseShoppingListItem {
  id: string;
  quantity: number;
  sortOrder: number;
  item: {
    id: string;
    name: string;
  };
}

const shopListItemSelect = `
      id,
      quantity,
      sortOrder,
      item:item!itemId(
        id,
        name
      )`

const transformItem = (item: SupabaseShoppingListItem): ShoppingListItem => ({
  id: item.id,
  quantity: item.quantity,
  sortOrder: item.sortOrder,
  name: item.item.name,
});

export async function fetchShoppingListItems(): Promise<ShoppingListItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: items, error } = await supabase
    .from('shopListItem')
    .select(shopListItemSelect)
    .eq('userId', user.id)
    .order('sortOrder');

  if (error) {
    throw new Error(error.message);
  }

  // @ts-expect-error // TS doesn't know about the structure of Supabase data
  const transformedItems: ShoppingListItem[] = (items || []).map(transformItem);

  return transformedItems;
}

export async function addShoppingListItem(item: ShopListItemCreate): Promise<ShoppingListItem> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('shopListItem')
    .insert({
      ...item,
      userId: user.id
    })
    .select(shopListItemSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // @ts-expect-error // TS doesn't know about the structure of Supabase data
  return transformItem(data)
}
