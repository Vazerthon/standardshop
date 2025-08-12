import { supabase } from "../../supabaseClient";
import { Item } from "./types";

export async function fetchItems(): Promise<Item[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: items, error } = await supabase
    .from('item')
    .select('id, name')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return items || [];
}

export async function addItem(name: string): Promise<Item> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('item')
    .insert({ name, userId: user.id })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Item;
}