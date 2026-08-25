import React, {
  useEffect,
  useState,
} from "react";

import {
  NavigationTab,
  BackendStatus,
} from "../../types";

import {
  User,
  Settings,
  Menu,
  X,
  ShoppingBag,
  Sparkles,
  Server,
  Moon,
  Sun,
  Languages,
} from "lucide-react";

import { api } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

/* =========================================================
   PROPS
========================================================= */

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSettings: () => void;
  onOpenAccount: () => void;
  onOpenAiDocent: () => void;
}

/* =========================================================
   NAVBAR
========================================================= */

export const Navbar:
React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenSettings,
  onOpenAccount,
  onOpenAiDocent,
}) => {
  /* =======================================================
     STATE
  ======================================================= */

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    darkMode,
    setDarkMode,
  ] = useState<boolean>(() => {
    return (
      localStorage.getItem(
        "heritagehub-theme"
      ) === "dark"
    );
  });

  const {
    language,
    toggleLanguage,
  } = useLanguage();

  const [
    backendStatus,
    setBackendStatus,
  ] = useState<BackendStatus>({
    connected: false,
    url: api.getBaseUrl(),
    lastChecked: "",
  });

  /* =======================================================
     BACKEND STATUS
  ======================================================= */

  useEffect(() => {
    api
      .checkConnection()
      .then(setBackendStatus);

    const interval =
      setInterval(() => {
        api
          .checkConnection()
          .then(setBackendStatus);
      }, 30000);

    return () =>
      clearInterval(interval);
  }, []);

  /* =======================================================
     GLOBAL DARK MODE
  ======================================================= */

  useEffect(() => {
    const root =
      document.documentElement;

    if (darkMode) {
      root.classList.add(
        "dark"
      );

      localStorage.setItem(
        "heritagehub-theme",
        "dark"
      );
    } else {
      root.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "heritagehub-theme",
        "light"
      );
    }
  }, [darkMode]);

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const text = {
    en: {
      brand: "HeritageHub",
      home: "Home",
      explore: "Explore",
      learn: "Learn",
      contribute: "Contribute",
      community: "Community",
      heritage3d: "3D Heritage",
      marketplace: "Shop",
      canvas: "Canvas",
      aiDocent: "AI Docent",
      backendLive: "REST Live",
      backendReady: "REST Ready",
      switchLanguage:
        "Switch to Odia",
      darkMode:
        "Switch to dark mode",
      lightMode:
        "Switch to light mode",
      shoppingCart:
        "Shopping Cart",
      userAccount:
        "User Account",
      settings:
        "Application Settings",
      menu:
        "Toggle navigation menu",
    },

    or: {
      brand: "ହେରିଟେଜ୍ ହବ୍",
      home: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
      explore: "ଅନ୍ୱେଷଣ",
      learn: "ଶିଖନ୍ତୁ",
      contribute: "ଅବଦାନ",
      community: "ସମୁଦାୟ",
      heritage3d: "୩ଡି ଐତିହ୍ୟ",
      marketplace: "ଦୋକାନ",
      canvas: "କ୍ୟାନଭାସ",
      aiDocent: "AI ସହାୟକ",
      backendLive:
        "REST ସକ୍ରିୟ",
      backendReady:
        "REST ପ୍ରସ୍ତୁତ",
      switchLanguage:
        "ଇଂରାଜୀକୁ ବଦଳାନ୍ତୁ",
      darkMode:
        "ଡାର୍କ ମୋଡ୍",
      lightMode:
        "ଲାଇଟ୍ ମୋଡ୍",
      shoppingCart:
        "କ୍ରୟ ବ୍ୟାଗ୍",
      userAccount:
        "ବ୍ୟବହାରକାରୀ ଖାତା",
      settings:
        "ଆପ୍ ସେଟିଂସ୍",
      menu:
        "ନାଭିଗେସନ୍ ମେନୁ",
    },
  };

  const t =
    text[language];

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navItems: {
    id: NavigationTab;
    label: string;
  }[] = [
    {
      id: "home",
      label: t.home,
    },
    {
      id: "explore",
      label: t.explore,
    },
    {
      id: "learn",
      label: t.learn,
    },
    {
      id: "contribute",
      label: t.contribute,
    },
    {
      id: "community",
      label: t.community,
    },
    {
      id: "3d-heritage",
      label: t.heritage3d,
    },
    {
      id: "marketplace",
      label: t.marketplace,
    },
    {
      id: "canvas",
      label: t.canvas,
    },
  ];

  /* =======================================================
     THEME TOGGLE
  ======================================================= */

  const toggleTheme = () => {
    setDarkMode(
      (previous) =>
        !previous
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <header
      className="
        sticky
        top-0
        z-40
        w-full

        border-b

        transition-colors
        duration-300
      "
      style={{
        backgroundColor:
          "var(--bg)",
        borderColor:
          "var(--border)",
        color:
          "var(--text)",
      }}
    >
      <div
        className="
          mx-auto
          flex
          h-[74px]
          w-full
          max-w-[1500px]
          items-center
          justify-between

          px-5
          md:px-10
          xl:px-14
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-8
            xl:gap-10
          "
        >
          {/* BRAND */}

          <button
            type="button"
            onClick={() =>
              onSelectTab(
                "home"
              )
            }
            className="
              font-display
              text-[27px]
              font-semibold
              tracking-[-0.03em]

              transition-opacity
              hover:opacity-70

              md:text-[30px]
            "
            style={{
              color:
                "var(--text)",
            }}
          >
            {t.brand}
          </button>

          {/* DESKTOP NAV */}

          <nav
            className="
              hidden
              items-center
              gap-5
              xl:flex
            "
          >
            {navItems.map(
              (
                item
              ) => {
                const isActive =
                  currentTab ===
                  item.id;

                return (
                  <button
                    type="button"
                    key={
                      item.id
                    }
                    onClick={() =>
                      onSelectTab(
                        item.id
                      )
                    }
                    className="
                      relative
                      whitespace-nowrap

                      pb-[5px]

                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]

                      transition-all
                      duration-200
                    "
                    style={{
                      color:
                        isActive
                          ? "var(--accent)"
                          : "var(--text-soft)",
                    }}
                  >
                    {
                      item.label
                    }

                    {isActive && (
                      <span
                        className="
                          absolute
                          bottom-0
                          left-0
                          h-[2px]
                          w-full
                        "
                        style={{
                          backgroundColor:
                            "var(--accent)",
                        }}
                      />
                    )}
                  </button>
                );
              }
            )}
          </nav>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-1.5
          "
        >
          {/* AI DOCENT */}

          <button
            type="button"
            onClick={
              onOpenAiDocent
            }
            className="
              hh-top-control
              hidden
              sm:flex
            "
            title="Ask AI Docent"
          >
            <Sparkles
              className="
                h-3.5
                w-3.5
              "
              style={{
                color:
                  "var(--accent)",
              }}
            />

            <span>
              {t.aiDocent}
            </span>
          </button>

          {/* LANGUAGE */}

          <button
            type="button"
            onClick={
              toggleLanguage
            }
            className="
              hh-top-control
            "
            title={
              t.switchLanguage
            }
          >
            <Languages
              className="
                h-4
                w-4
              "
            />

            <span
              className="
                hidden
                sm:inline
              "
            >
              {language ===
              "en"
                ? "EN / ଓଡ଼ିଆ"
                : "ଓଡ଼ିଆ / EN"}
            </span>
          </button>

          {/* GLOBAL DARK MODE */}

          <button
            type="button"
            onClick={
              toggleTheme
            }
            className="
              hh-top-control
            "
            aria-label="Toggle dark mode"
            title={
              darkMode
                ? t.lightMode
                : t.darkMode
            }
          >
            {darkMode ? (
              <Sun
                className="
                  h-4
                  w-4
                "
              />
            ) : (
              <Moon
                className="
                  h-4
                  w-4
                "
              />
            )}
          </button>

          {/* CART */}

          <button
            type="button"
            onClick={
              onOpenCart
            }
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center

              transition-opacity
              hover:opacity-60
            "
            style={{
              color:
                "var(--text)",
            }}
            aria-label={
              t.shoppingCart
            }
          >
            <ShoppingBag
              className="
                h-[19px]
                w-[19px]
              "
            />

            {cartCount >
              0 && (
              <span
                className="
                  absolute
                  right-0
                  top-0

                  flex
                  h-[16px]
                  min-w-[16px]
                  items-center
                  justify-center

                  rounded-full

                  px-[3px]

                  text-[9px]
                  font-bold
                  text-white
                "
                style={{
                  backgroundColor:
                    "var(--accent)",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* BACKEND STATUS */}

          <button
            type="button"
            onClick={
              onOpenSettings
            }
            className="
              hidden
              items-center
              gap-1.5

              px-2
              py-1

              text-[9px]
              font-bold
              uppercase
              tracking-[0.08em]

              lg:flex
            "
            style={{
              color:
                "var(--text-muted)",
            }}
            title={`Django Backend: ${backendStatus.url}`}
          >
            <Server
              className="
                h-3
                w-3
              "
            />

            <span
              className={`
                h-1.5
                w-1.5
                rounded-full

                ${
                  backendStatus.connected
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }
              `}
            />

            {backendStatus.connected
              ? t.backendLive
              : t.backendReady}
          </button>

          {/* ACCOUNT */}

          <button
            type="button"
            onClick={
              onOpenAccount
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              transition-opacity
              hover:opacity-60
            "
            style={{
              color:
                "var(--text)",
            }}
            aria-label={
              t.userAccount
            }
          >
            <User
              className="
                h-[19px]
                w-[19px]
              "
            />
          </button>

          {/* SETTINGS */}

          <button
            type="button"
            onClick={
              onOpenSettings
            }
            className="
              hidden
              h-9
              w-9
              items-center
              justify-center

              transition-opacity
              hover:opacity-60

              sm:flex
            "
            style={{
              color:
                "var(--text)",
            }}
            aria-label={
              t.settings
            }
          >
            <Settings
              className="
                h-[19px]
                w-[19px]
              "
            />
          </button>

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (
                  previous
                ) =>
                  !previous
              )
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center

              xl:hidden
            "
            style={{
              color:
                "var(--text)",
            }}
            aria-label={
              t.menu
            }
          >
            {mobileMenuOpen ? (
              <X
                className="
                  h-6
                  w-6
                "
              />
            ) : (
              <Menu
                className="
                  h-6
                  w-6
                "
              />
            )}
          </button>
        </div>
      </div>

      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      {mobileMenuOpen && (
        <div
          className="
            border-t
            px-5
            py-5
            shadow-lg
            xl:hidden
          "
          style={{
            backgroundColor:
              "var(--surface)",
            borderColor:
              "var(--border)",
          }}
        >
          <nav
            className="
              flex
              flex-col
            "
          >
            {navItems.map(
              (
                item
              ) => {
                const isActive =
                  currentTab ===
                  item.id;

                return (
                  <button
                    type="button"
                    key={
                      item.id
                    }
                    onClick={() => {
                      onSelectTab(
                        item.id
                      );

                      setMobileMenuOpen(
                        false
                      );
                    }}
                    className="
                      border-b

                      px-2
                      py-3.5

                      text-left

                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                    "
                    style={{
                      borderColor:
                        "var(--border)",

                      color:
                        isActive
                          ? "var(--accent)"
                          : "var(--text)",
                    }}
                  >
                    {
                      item.label
                    }
                  </button>
                );
              }
            )}

            {/* MOBILE AI */}

            <button
              type="button"
              onClick={() => {
                onOpenAiDocent();

                setMobileMenuOpen(
                  false
                );
              }}
              className="
                mt-5

                flex
                items-center
                justify-center
                gap-2

                px-4
                py-3

                text-[11px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
              "
              style={{
                backgroundColor:
                  "var(--accent)",
              }}
            >
              <Sparkles
                className="
                  h-4
                  w-4
                "
              />

              {t.aiDocent}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;