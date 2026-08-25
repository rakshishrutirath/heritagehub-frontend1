import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const Footer: React.FC = () => {
  const { language } = useLanguage();

  const text = {
    en: {
      brand: "HeritageHub",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      copyright: "© 2024 HeritageHub",
    },

    or: {
      // Brand transliteration — NOT translation
      brand: "ହେରିଟେଜ୍ ହବ୍",

      about: "ଆମ ବିଷୟରେ",
      contact: "ଯୋଗାଯୋଗ",
      privacy: "ଗୋପନୀୟତା",
      terms: "ସର୍ତ୍ତାବଳୀ",
      copyright: "© ୨୦୨୪ ହେରିଟେଜ୍ ହବ୍",
    },
  };

  const t = text[language];

  return (
    <footer
      className="
        w-full
        border-t
        transition-colors
        duration-300
      "
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <div
        className="
          mx-auto
          flex
          min-h-[120px]
          max-w-[1440px]
          flex-col
          items-center
          justify-between
          gap-6
          px-6
          py-8
          md:flex-row
          md:px-12
        "
      >
        {/* BRAND */}

        <button
          type="button"
          className="
            font-display
            text-[24px]
            font-semibold
            tracking-[-0.03em]
          "
          style={{
            color: "var(--accent)",
          }}
        >
          {t.brand}
        </button>

        {/* FOOTER LINKS */}

        <nav
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-6
            md:gap-8
          "
        >
          <button
            type="button"
            className="
              text-[14px]
              transition-opacity
              hover:opacity-60
            "
            style={{
              color: "var(--text)",
            }}
          >
            {t.about}
          </button>

          <button
            type="button"
            className="
              text-[14px]
              transition-opacity
              hover:opacity-60
            "
            style={{
              color: "var(--text)",
            }}
          >
            {t.contact}
          </button>

          <button
            type="button"
            className="
              text-[14px]
              transition-opacity
              hover:opacity-60
            "
            style={{
              color: "var(--text)",
            }}
          >
            {t.privacy}
          </button>

          <button
            type="button"
            className="
              text-[14px]
              transition-opacity
              hover:opacity-60
            "
            style={{
              color: "var(--text)",
            }}
          >
            {t.terms}
          </button>
        </nav>

        {/* COPYRIGHT */}

        <p
          className="
            whitespace-nowrap
            text-[13px]
          "
          style={{
            color: "var(--text-muted)",
          }}
        >
          {t.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;