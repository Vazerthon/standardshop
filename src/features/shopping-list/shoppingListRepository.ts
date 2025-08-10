import { supabase } from "../../supabaseClient";
import { ShoppingListItem } from "./types";

export async function fetchShoppingListItems(): Promise<ShoppingListItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
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
    throw new Error(error.message);
  }

  const transformedItems: ShoppingListItem[] = (items || []).map(item => ({
    ...item,
    // @ts-expect-error TypeScript doesn't understand this is a 1:1 relationship
    name: item.item.name
  }));

  return transformedItems;
}
