import { create } from "zustand";

interface MenuBarState {
  extraContentRenderFunction?: () => React.ReactNode;
  setExtraContentRenderFunction: (fn?: () => React.ReactNode) => void;
}

const useMenuBarStore = create<MenuBarState>((set) => ({
  extraContentRenderFunction: undefined,

  setExtraContentRenderFunction: (fn?: () => React.ReactNode) => {
    set({ extraContentRenderFunction: fn });
  },
}));

export const useSetExtraContentRenderFunction = () =>
  useMenuBarStore((state) => state.setExtraContentRenderFunction);
export const useExtraContentRenderFunction = () =>
  useMenuBarStore((state) => state.extraContentRenderFunction);
