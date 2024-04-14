import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Use 'synthwave' as the default theme
  const [theme, setTheme] = useState("synthwave");

  useEffect(() => {
    // On component mount, read the theme from localStorage
    const storedTheme = localStorage.getItem("daisyUI-theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "synthwave" ? "cupcake" : "synthwave";
    setTheme(newTheme);
    localStorage.setItem("daisyUI-theme", newTheme); // Persist it on toggle
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
