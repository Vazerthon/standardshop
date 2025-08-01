import { create } from "zustand";
import { supabase } from "../../supabaseClient";
import { TemplateWithItems } from "./types";

interface TemplatesState {
  templates: TemplateWithItems[];
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ loading: false, message: "User not authenticated" });
        return;
      }

      // Fetch templates with their items in a single query using a join
      const { data: templatesWithItems, error } = await supabase
        .from('template')
        .select(`
          *,
          items:item(*)
        `)
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });

      if (error) {
        set({ loading: false, message: error.message });
        return;
      }

      // Transform the data to match our TemplateWithItems interface
      const transformedTemplates: TemplateWithItems[] = (templatesWithItems || []).map(template => ({
        ...template,
        items: template.items || []
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
