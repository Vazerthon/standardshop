import { supabase } from "../../supabaseClient";
import { Template } from "./types";

export async function fetchTemplates(): Promise<Template[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: templatesWithItems, error } = await supabase
    .from('template')
    .select(`
      id,
      name,
      templateItems:templateItem!templateId(
        id,
        quantity,
        item:item!itemId(
          id,
          name
        )
      )
    `)
    .eq('userId', user.id)
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  const transformedTemplates: Template[] = (templatesWithItems || []).map(template => ({
    ...template,
    items: (template.templateItems || []).map(item => ({
      id: item.id,
      // @ts-expect-error TypeScript doesn't understand this is a 1:1 relationship
      name: item.item.name,
      quantity: item.quantity
    }))
  }));

  return transformedTemplates;
}
