import React from "react";

import {
  Bookmark,
  Box,
  MapPin,
  Calendar,
  ArrowUpRight,
  Image as ImageIcon,
} from "lucide-react";

import { Artifact } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

/* =========================================================
   PROPS
========================================================= */

interface ArtifactCardProps {
  artifact: Artifact;

  onSelect?: (
    artifact: Artifact
  ) => void;

  onOpen3D?: (
    artifactId: string
  ) => void;

  isBookmarked?: boolean;

  onToggleBookmark?: (
    artifactId: string
  ) => void;
}

/* =========================================================
   COMPONENT
========================================================= */

export const ArtifactCard:
React.FC<ArtifactCardProps> = ({
  artifact,
  onSelect,
  onOpen3D,
  isBookmarked = false,
  onToggleBookmark,
}) => {

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const { language } = useLanguage();

  const isOdia = language === "or";

  /* =======================================================
     SIMPLE ODIA TRANSLATIONS
  ======================================================= */

  const translateCulture = (
    value?: string
  ) => {
    if (!isOdia) {
      return value || "Heritage";
    }

    if (!value) {
      return "ଐତିହ୍ୟ";
    }

    const normalized =
      value.toLowerCase().trim();

    const translations:
      Record<string, string> = {
        "heritage": "ଐତିହ୍ୟ",

        "odisha heritage":
          "ଓଡ଼ିଶା ଐତିହ୍ୟ",

        "living heritage":
          "ଜୀବନ୍ତ ଐତିହ୍ୟ",

        "cultural heritage":
          "ସାଂସ୍କୃତିକ ଐତିହ୍ୟ",

        "tribal heritage":
          "ଆଦିବାସୀ ଐତିହ୍ୟ",

        "community heritage":
          "ସମୁଦାୟ ଐତିହ୍ୟ",
      };

    return (
      translations[normalized] ||
      value
    );
  };

  const translatePeriod = (
    value?: string
  ) => {
    if (!isOdia) {
      return value || "Living Heritage";
    }

    if (!value) {
      return "ଜୀବନ୍ତ ଐତିହ୍ୟ";
    }

    const normalized =
      value.toLowerCase().trim();

    const translations:
      Record<string, string> = {
        "living heritage":
          "ଜୀବନ୍ତ ଐତିହ୍ୟ",

        "ancient":
          "ପ୍ରାଚୀନ",

        "medieval":
          "ମଧ୍ୟଯୁଗୀୟ",

        "modern":
          "ଆଧୁନିକ",

        "contemporary":
          "ସମକାଳୀନ",

        "traditional":
          "ପାରମ୍ପରିକ",
      };

    return (
      translations[normalized] ||
      value
    );
  };

  const translateRegion = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    if (!isOdia) {
      return value;
    }

    const normalized =
      value.toLowerCase().trim();

    const translations:
      Record<string, string> = {
        "odisha": "ଓଡ଼ିଶା",

        "puri": "ପୁରୀ",

        "pipili": "ପିପିଲି",

        "cuttack": "କଟକ",

        "bhubaneswar":
          "ଭୁବନେଶ୍ୱର",

        "koraput":
          "କୋରାପୁଟ",

        "sambalpur":
          "ସମ୍ବଲପୁର",

        "mayurbhanj":
          "ମୟୂରଭଞ୍ଜ",

        "kendrapara":
          "କେନ୍ଦ୍ରାପଡ଼ା",

        "ganjam":
          "ଗଞ୍ଜାମ",

        "dhenkanal":
          "ଢେଙ୍କାନାଳ",

        "balasore":
          "ବାଲେଶ୍ୱର",

        "bargarh":
          "ବରଗଡ଼",

        "rayagada":
          "ରାୟଗଡ଼ା",

        "kalahandi":
          "କଳାହାଣ୍ଡି",
      };

    return (
      translations[normalized] ||
      value
    );
  };

  /* =======================================================
     TITLE TRANSLATION
  ======================================================= */

  const translateTitle = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    if (!isOdia) {
      return value;
    }

    const normalized =
      value.toLowerCase().trim();

    const translations:
      Record<string, string> = {

        "test heritage record":
          "ପରୀକ୍ଷାମୂଳକ ଐତିହ୍ୟ ରେକର୍ଡ",

        "pipili applique work":
          "ପିପିଲି ଆପ୍ଲିକ୍ କାର୍ଯ୍ୟ",

        "kotpad natural dye weaving":
          "କୋଟପାଡ଼ ପ୍ରାକୃତିକ ରଙ୍ଗ ବୁଣାକାମ",

        "pattachitra":
          "ପଟ୍ଟଚିତ୍ର",

        "odissi dance":
          "ଓଡ଼ିଶୀ ନୃତ୍ୟ",

        "sambalpuri dance":
          "ସମ୍ବଲପୁରୀ ନୃତ୍ୟ",

        "dhemsa dance":
          "ଢେମସା ନୃତ୍ୟ",
      };

    return (
      translations[normalized] ||
      value
    );
  };

  /* =======================================================
     SUBTITLE TRANSLATION
  ======================================================= */

  const translateSubtitle = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    if (!isOdia) {
      return value;
    }

    const normalized =
      value.toLowerCase().trim();

    const translations:
      Record<string, string> = {

        "community heritage record":
          "ସମୁଦାୟ ଐତିହ୍ୟ ରେକର୍ଡ",

        "cultural heritage record":
          "ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ରେକର୍ଡ",

        "traditional heritage":
          "ପାରମ୍ପରିକ ଐତିହ୍ୟ",

        "living heritage":
          "ଜୀବନ୍ତ ଐତିହ୍ୟ",
      };

    return (
      translations[normalized] ||
      value
    );
  };

  /* =======================================================
     DESCRIPTION TRANSLATION

     These translations cover the records currently visible
     in your screenshot.

     Later we can connect this to your backend/Gemini so
     ANY description can be translated automatically.
  ======================================================= */

  const translateDescription = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    if (!isOdia) {
      return value;
    }

    const normalized =
      value
        .toLowerCase()
        .trim();

    const translations:
      Record<string, string> = {

        "traditional applique handicraft of pipili, odisha.":
          "ପିପିଲି, ଓଡ଼ିଶାର ପାରମ୍ପରିକ ଆପ୍ଲିକ୍ ହସ୍ତଶିଳ୍ପ।",

        "this is a test heritage record for final system testing.":
          "ଏହା ଅନ୍ତିମ ସିଷ୍ଟମ୍ ପରୀକ୍ଷା ପାଇଁ ଏକ ପରୀକ୍ଷାମୂଳକ ଐତିହ୍ୟ ରେକର୍ଡ।",

        "a traditional handloom weaving technique using natural dyes.":
          "ପ୍ରାକୃତିକ ରଙ୍ଗ ବ୍ୟବହାର କରି କରାଯାଉଥିବା ଏକ ପାରମ୍ପରିକ ହସ୍ତତନ୍ତ ବୁଣାକାମ ପ୍ରଣାଳୀ।",

        "this submission describes a traditional handloom weaving technique that relies on natural dyes. it represents sustainable indigenous practices and cultural textile heritage.":
          "ଏହି ରେକର୍ଡରେ ପ୍ରାକୃତିକ ରଙ୍ଗ ଉପରେ ଆଧାରିତ ଏକ ପାରମ୍ପରିକ ହସ୍ତତନ୍ତ ବୁଣାକାମ ପ୍ରଣାଳୀ ବର୍ଣ୍ଣନା କରାଯାଇଛି। ଏହା ସ୍ଥାୟୀ ସ୍ୱଦେଶୀ ପରମ୍ପରା ଏବଂ ସାଂସ୍କୃତିକ ବସ୍ତ୍ର ଐତିହ୍ୟକୁ ପ୍ରତିନିଧିତ୍ୱ କରେ।",

        "this submission serves as a sample entry intended for evaluating the performance and integrity of the cultural heritage preservation system. it provides a standardized baseline for testing multi-language data processing and archival workflows.":
          "ଏହି ଦାଖଲଟି ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ସଂରକ୍ଷଣ ପ୍ରଣାଳୀର କାର୍ଯ୍ୟଦକ୍ଷତା ଏବଂ ସଠିକତା ମୂଲ୍ୟାୟନ ପାଇଁ ଏକ ନମୁନା ରେକର୍ଡ ଭାବେ ବ୍ୟବହୃତ ହୁଏ। ଏହା ବହୁଭାଷୀ ତଥ୍ୟ ପ୍ରକ୍ରିୟାକରଣ ଏବଂ ଅଭିଲେଖ କାର୍ଯ୍ୟପ୍ରବାହ ପରୀକ୍ଷା ପାଇଁ ଏକ ମାନକ ଆଧାର ପ୍ରଦାନ କରେ।",
      };

    return (
      translations[normalized] ||
      value
    );
  };

  /* =======================================================
     OPEN DETAIL
  ======================================================= */

  const handleOpenDetail = () => {
    if (onSelect) {
      onSelect(artifact);
    }
  };

  /* =======================================================
     BOOKMARK
  ======================================================= */

  const handleBookmark = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (onToggleBookmark) {
      onToggleBookmark(
        artifact.id
      );
    }
  };

  /* =======================================================
     OPEN 3D
  ======================================================= */

  const handleOpen3D = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (onOpen3D) {
      onOpen3D(
        artifact.id
      );
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <article
      onClick={
        handleOpenDetail
      }
      className="
        group
        relative

        bg-[#faf9f5]
        dark:bg-[#1c1917]

        border
        border-[#d5d3cd]
        dark:border-[#3b3531]

        overflow-hidden

        transition-all
        duration-300

        hover:border-[#94492d]
        dark:hover:border-[#d97955]

        hover:shadow-lg

        cursor-pointer
      "
    >

      {/* ===================================================
          IMAGE
      =================================================== */}

      <div
        className="
          relative
          w-full
          aspect-[4/3]
          overflow-hidden

          bg-[#efeeea]
          dark:bg-[#24201d]
        "
      >

        {artifact.imageUrl ? (

          <img
            src={
              artifact.imageUrl
            }
            alt={
              artifact.title
            }
            className="
              w-full
              h-full
              object-cover

              transition-transform
              duration-500

              group-hover:scale-[1.03]
            "
          />

        ) : (

          <div
            className="
              absolute
              inset-0

              flex
              flex-col
              items-center
              justify-center
              gap-3

              bg-[#efeeea]
              dark:bg-[#24201d]

              text-[#747878]
              dark:text-[#aaa39c]
            "
          >

            <div
              className="
                w-12
                h-12

                rounded-full

                border
                border-[#c4c7c7]
                dark:border-[#3b3531]

                flex
                items-center
                justify-center

                bg-[#faf9f5]
                dark:bg-[#1c1917]
              "
            >

              <ImageIcon
                className="
                  w-5
                  h-5

                  text-[#94492d]
                  dark:text-[#d97955]
                "
              />

            </div>

            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
              "
            >
              {isOdia
                ? "ଛବି ଉପଲବ୍ଧ ନାହିଁ"
                : "No Image Available"}
            </span>

          </div>

        )}

        {/* =================================================
            CULTURE LABEL
        ================================================= */}

        <div
          className="
            absolute
            top-4
            left-4

            px-3
            py-1.5

            bg-[#faf9f5]
            dark:bg-[#1c1917]

            text-[#94492d]
            dark:text-[#d97955]

            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]

            border
            border-[#d5d3cd]
            dark:border-[#3b3531]
          "
        >
          {translateCulture(
            artifact.culture
          )}
        </div>

        {/* =================================================
            BOOKMARK
        ================================================= */}

        {onToggleBookmark && (

          <button
            type="button"
            onClick={
              handleBookmark
            }
            title={
              isBookmarked
                ? (
                    isOdia
                      ? "ବୁକମାର୍କ ହଟାନ୍ତୁ"
                      : "Remove bookmark"
                  )
                : (
                    isOdia
                      ? "ରେକର୍ଡ ବୁକମାର୍କ କରନ୍ତୁ"
                      : "Bookmark record"
                  )
            }
            className={`
              absolute
              top-4
              right-4

              w-9
              h-9

              flex
              items-center
              justify-center

              border

              transition-colors

              ${
                isBookmarked
                  ? `
                    bg-[#94492d]
                    dark:bg-[#d97955]

                    text-white

                    border-[#94492d]
                    dark:border-[#d97955]
                  `
                  : `
                    bg-[#faf9f5]
                    dark:bg-[#1c1917]

                    text-[#1b1c1a]
                    dark:text-[#f3eee7]

                    border-[#d5d3cd]
                    dark:border-[#3b3531]

                    hover:bg-[#94492d]
                    dark:hover:bg-[#d97955]

                    hover:text-white
                  `
              }
            `}
          >

            <Bookmark
              className="
                w-4
                h-4
              "
              fill={
                isBookmarked
                  ? "currentColor"
                  : "none"
              }
            />

          </button>

        )}

      </div>

      {/* ===================================================
          BODY
      =================================================== */}

      <div
        className="
          p-5
          md:p-6
        "
      >

        {/* =================================================
            PERIOD
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]

              text-[#94492d]
              dark:text-[#d97955]
            "
          >
            {translatePeriod(
              artifact.period
            )}
          </span>

          {artifact.dateRange && (

            <span
              className="
                text-[11px]

                text-[#747878]
                dark:text-[#aaa39c]

                flex
                items-center
                gap-1
              "
            >

              <Calendar
                className="
                  w-3
                  h-3
                "
              />

              {artifact.dateRange}

            </span>

          )}

        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h3
          className="
            mt-3

            text-[22px]
            md:text-[24px]

            leading-tight

            font-display
            font-semibold

            text-[#1b1c1a]
            dark:text-[#f3eee7]

            transition-colors

            group-hover:text-[#94492d]
            dark:group-hover:text-[#d97955]
          "
        >
          {translateTitle(
            artifact.title
          )}
        </h3>

        {/* =================================================
            SUBTITLE
        ================================================= */}

        {artifact.subtitle && (

          <p
            className="
              mt-2
              text-[13px]

              text-[#747878]
              dark:text-[#aaa39c]
            "
          >
            {translateSubtitle(
              artifact.subtitle
            )}
          </p>

        )}

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p
          className="
            mt-4

            text-[13px]
            md:text-[14px]

            leading-6

            text-[#444748]
            dark:text-[#c5beb7]

            line-clamp-3
          "
        >
          {translateDescription(
            artifact.description
          )}
        </p>

        {/* =================================================
            LOCATION
        ================================================= */}

        {artifact.region && (

          <div
            className="
              mt-5
              pt-4

              border-t
              border-[#e1dfda]
              dark:border-[#3b3531]

              flex
              items-center
              gap-2

              text-[11px]
              uppercase
              tracking-[0.1em]

              text-[#747878]
              dark:text-[#aaa39c]
            "
          >

            <MapPin
              className="
                w-3.5
                h-3.5

                text-[#94492d]
                dark:text-[#d97955]
              "
            />

            {translateRegion(
              artifact.region
            )}

          </div>

        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div
          className="
            mt-5

            flex
            items-center
            gap-2
          "
        >

          <button
            type="button"
            onClick={(
              event
            ) => {

              event.stopPropagation();

              handleOpenDetail();

            }}
            className="
              flex-1

              min-h-[42px]

              bg-[#94492d]
              hover:bg-[#7d3c25]

              dark:bg-[#d97955]
              dark:hover:bg-[#cf6944]

              text-white

              text-[11px]
              font-bold
              uppercase
              tracking-[0.12em]

              flex
              items-center
              justify-center
              gap-2

              transition-colors
            "
          >

            {isOdia
              ? "ରେକର୍ଡ ଦେଖନ୍ତୁ"
              : "View Record"}

            <ArrowUpRight
              className="
                w-4
                h-4
              "
            />

          </button>

          {/* ===============================================
              3D BUTTON
          =============================================== */}

          {artifact.threeDModelAvailable &&
            onOpen3D && (

            <button
              type="button"
              onClick={
                handleOpen3D
              }
              title={
                isOdia
                  ? "3D ମଡେଲ୍ ଖୋଲନ୍ତୁ"
                  : "Open 3D model"
              }
              className="
                w-11
                h-[42px]

                border
                border-[#c4c7c7]
                dark:border-[#3b3531]

                bg-[#faf9f5]
                dark:bg-[#1c1917]

                text-[#1b1c1a]
                dark:text-[#f3eee7]

                hover:bg-[#1b1c1a]
                dark:hover:bg-[#f3eee7]

                hover:text-white
                dark:hover:text-[#12100f]

                flex
                items-center
                justify-center

                transition-colors
              "
            >

              <Box
                className="
                  w-4
                  h-4
                "
              />

            </button>

          )}

        </div>

      </div>

    </article>
  );
};

export default ArtifactCard;