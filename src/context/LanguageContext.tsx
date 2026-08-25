import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export type AppLanguage = "en" | "or";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  toggleLanguage: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const LanguageContext =
  createContext<LanguageContextValue | undefined>(
    undefined
  );

/* =========================================================
   PROVIDER
========================================================= */

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children,
}) => {
  const [
    language,
    setLanguage,
  ] = useState<AppLanguage>(() => {
    const saved =
      localStorage.getItem(
        "heritagehub-language"
      );

    return saved === "or"
      ? "or"
      : "en";
  });

  /* =======================================================
     PERSIST LANGUAGE
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "heritagehub-language",
      language
    );

    document.documentElement.lang =
      language === "or"
        ? "or"
        : "en";
  }, [language]);

  /* =======================================================
     TOGGLE
  ======================================================= */

  const toggleLanguage = () => {
    setLanguage(
      (previous) =>
        previous === "en"
          ? "or"
          : "en"
    );
  };

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/* =========================================================
   HOOK
========================================================= */

export const useLanguage = () => {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};

export default LanguageContext;