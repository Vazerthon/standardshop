import { create } from "zustand";
import { fetchTemplates } from "./templatesRepository";
import { Template } from "./types";

type Templates = {
  [id: Template['id']]: Template;
}

interface TemplatesState {
  templates: Templates;
  loading: boolean;
  message: string | null;
  fetchTemplates: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string | null) => void;
  clearMessage: () => void;
}

const useTemplatesStore = create<TemplatesState>((set) => ({
  templates: {},
  loading: false,
  message: null,
  
  fetchTemplates: async () => {
    set({ loading: true, message: null });
    
    try {
      const templates = await fetchTemplates();
      set({ 
        templates: templates.reduce((acc: { [id: Template['id']]: Template }, template) => ({
          ...acc,
          [template.id]: template
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
export const useTemplates = () => useTemplatesStore((state) => state.templates);
export const useTemplatesLoading = () => useTemplatesStore((state) => state.loading);
export const useTemplatesMessage = () => useTemplatesStore((state) => state.message);
export const useTemplatesFetch = () => useTemplatesStore((state) => state.fetchTemplates);
