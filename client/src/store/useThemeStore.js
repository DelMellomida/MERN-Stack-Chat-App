import { create } from 'zustand';

const THEME_KEY = "theme";

// All available DaisyUI themes from your config
const AVAILABLE_THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", 
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", 
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", 
  "night", "coffee", "winter", "dim", "nord", "sunset"
];

export const useThemeStore = create((set, get) => ({
    theme: localStorage.getItem(THEME_KEY) || "light",
    availableThemes: AVAILABLE_THEMES,
    
    setTheme: (theme) => {
        console.log("Setting theme to:", theme);
        localStorage.setItem(THEME_KEY, theme);
        set({ theme });
        document.documentElement.setAttribute("data-theme", theme);
    },
    
    // Cycles through all available themes
    toggleTheme: () => {
        const currentTheme = get().theme;
        const currentIndex = AVAILABLE_THEMES.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % AVAILABLE_THEMES.length;
        const newTheme = AVAILABLE_THEMES[nextIndex];
        
        console.log("Cycling theme from", currentTheme, "to", newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        set({ theme: newTheme });
        document.documentElement.setAttribute("data-theme", newTheme);
    },
    
    // Quick toggle between just light and dark
    toggleLightDark: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem(THEME_KEY, newTheme);
        set({ theme: newTheme });
        document.documentElement.setAttribute("data-theme", newTheme);
    },
    
    // Get random theme
    setRandomTheme: () => {
        const randomIndex = Math.floor(Math.random() * AVAILABLE_THEMES.length);
        const randomTheme = AVAILABLE_THEMES[randomIndex];
        get().setTheme(randomTheme);
    }
}));