import React, { useState, useEffect, createContext } from "react";

export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children, ...props }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Forced theme: always add "dark" class to the document root.
    document.documentElement.className = "dark";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}