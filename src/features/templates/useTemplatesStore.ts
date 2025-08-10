import { create } from "zustand";
import { supabase } from "../../supabaseClient";
import { Template } from "./types";

interface TemplatesState {
  templates: Template[];
  loading: boolean;
  message: string | null;
  fetchTemplates: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string | null) => void;
  clearMessage: () => void;
}

const useTemplatesStore = create<TemplatesState>((set) => ({
  templates: [],
  loading: false,
  message: null,
  
  fetchTemplates: async () => {
    set({ loading: true, message: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ loading: false, message: "User not authenticated" });
        return;
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
        set({ loading: false, message: error.message });
        return;
      }

      const transformedTemplates: Template[] = (templatesWithItems || []).map(template => ({
        ...template,
        items: (template.templateItems || []).map(item => ({
          id: item.id,
          // @ts-expect-error TypeScript doens't understand this is a 1:1 relationship
          name: item.item.name,
          quantity: item.quantity
        }))
      }));

      set({ 
        templates: transformedTemplates, 
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
export const useTemplates = () => useTemplatesStore((state) => state.templates);
export const useTemplatesLoading = () => useTemplatesStore((state) => state.loading);
export const useTemplatesMessage = () => useTemplatesStore((state) => state.message);
export const useTemplatesFetch = () => useTemplatesStore((state) => state.fetchTemplates);
