import { create } from "zustand";

type Theme = {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
};

export const useThemeStore = create<Theme>((set) => ({
  theme: localStorage.getItem("THEME-V1") as "dark" | "light",
  setTheme: (theme) => set({ theme }),
}));
