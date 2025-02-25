
import { useState, useEffect } from "react";


export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        return savedTheme ? savedTheme === "dark" : systemPrefersDark;
    });

    // Função para alternar o tema
    const toggleTheme = (checked: boolean) => {
        setIsDarkMode(checked);
        localStorage.setItem("theme", checked ? "dark" : "light");
        applyTheme(checked);
    };

    // Aplica as classes e estilos do tema
    const applyTheme = (isDark: boolean) => {
        document.body.classList.toggle("dark", isDark);
        document.documentElement.classList.toggle("ion-palette-dark", isDark);
        document.documentElement.style.setProperty(
            "--ion-background-color",
            isDark ? "#1a1a1a" : "#ffffff"
        );
        document.documentElement.style.setProperty(
            "--ion-text-color",
            isDark ? "#ffffff" : "#2d2b30"
        );
    };

    // Configuração inicial e listener do sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                toggleTheme(e.matches);
            }
        };

        // Aplicar tema inicial
        applyTheme(isDarkMode);

        // Listener para mudanças no sistema
        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, []);

    return { isDarkMode, toggleTheme };
};
