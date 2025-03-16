import { createContext, useState } from "react";

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [data, setData] = useState("Hello from Context!");
  const [loginUser, setloginUser] = useState(null);
  const [language, setLanguage] = useState("en");

  return (
    <AppContext.Provider
      value={{ data, setData, setloginUser, loginUser, language, setLanguage }}
    >
      {children}
    </AppContext.Provider>
  );
};
