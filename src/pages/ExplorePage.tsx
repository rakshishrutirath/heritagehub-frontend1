import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  api,
  ExplorePlace,
  ExploreEra,
} from "../services/api";

import { useLanguage } from "../context/LanguageContext";

import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
  X,
  Utensils,
  Landmark,
  Volume2,
  Clock3,
  History,
} from "lucide-react";

interface ExplorePageProps {
  artifacts?: any[];

  onSelectArtifact?: (artifact: any) => void;

  onOpen3D?: (artifactId: string) => void;

  bookmarkedIds?: string[];

  onToggleBookmark?: (id: string) => void;
}

const ExplorePage: React.FC<ExplorePageProps> = () => {
  const { language } = useLanguage();

  const isOdia = language === "or";

  /* =========================================================
     TEXT
  ========================================================= */

  const t = {
    pageLabel: isOdia
      ? "ଓଡ଼ିଶା ଅନ୍ୱେଷଣ"
      : "Explore Odisha",

    pageTitle: isOdia
      ? "ଜୀବନ୍ତ ଐତିହ୍ୟ ଅନ୍ୱେଷଣ"
      : "Explore Living Heritage",

    pageDescription: isOdia
      ? "ଓଡ଼ିଶାର ସାଂସ୍କୃତିକ ସ୍ଥଳ, ଜୀବନ୍ତ ପରମ୍ପରା, ପାରମ୍ପରିକ ଖାଦ୍ୟ ଏବଂ ଐତିହାସିକ ଯୁଗଗୁଡ଼ିକୁ ଅନ୍ୱେଷଣ କରନ୍ତୁ।"
      : "Discover cultural places, living traditions, traditional food and historical eras preserved through HeritageHub.",

    search: isOdia
      ? "ସ୍ଥାନ, ଜିଲ୍ଲା, ସଂସ୍କୃତି କିମ୍ବା ଖାଦ୍ୟ ଖୋଜନ୍ତୁ..."
      : "Search place, district, culture or food...",

    showing: isOdia
      ? "ଦେଖାଯାଉଛି"
      : "Showing",

    heritagePlaces: isOdia
      ? "ଐତିହ୍ୟ ସ୍ଥଳ"
      : "heritage places",

    clear: isOdia
      ? "ଖୋଜା ସଫା କରନ୍ତୁ"
      : "Clear Search",

    historicalEras: isOdia
      ? "ଐତିହାସିକ ଯୁଗ"
      : "Historical Eras",

    explore: isOdia
      ? "ଅନ୍ୱେଷଣ"
      : "Explore",

    noPlaces: isOdia
      ? "କୌଣସି ସ୍ଥାନ ମିଳିଲା ନାହିଁ"
      : "No places found",

    tryAnother: isOdia
      ? "ଅନ୍ୟ ଏକ ଖୋଜା ଶବ୍ଦ ବ୍ୟବହାର କରନ୍ତୁ।"
      : "Try another search.",

    timelineLabel: isOdia
      ? "ଐତିହ୍ୟ ସମୟ ଯାତ୍ରା"
      : "VISUAL HERITAGE TIME TRAVEL",

    timelineTitle: isOdia
      ? "ଯୁଗାନ୍ତର ଯାତ୍ରା: ଇତିହାସରୁ ବର୍ତ୍ତମାନ"
      : "Epochs & Historical Eras",

    timelineDescription: isOdia
      ? "ପ୍ରାଚୀନ କାଳରୁ ବର୍ତ୍ତମାନ ପର୍ଯ୍ୟନ୍ତ ଓଡ଼ିଶାର ଐତିହ୍ୟ ମଧ୍ୟରେ ସମୟ ଯାତ୍ରା କରନ୍ତୁ।"
      : "Journey through Odisha's heritage across time, from historic origins to the living present.",

    historicalEra: isOdia
      ? "ପ୍ରାଚୀନ ଯୁଗ"
      : "HISTORICAL ERA",

    presentEra: isOdia
      ? "ବର୍ତ୍ତମାନ ଯୁଗ"
      : "PRESENT ERA",

    activeEra: isOdia
      ? "ସକ୍ରିୟ ଯୁଗ"
      : "ACTIVE TIMELINE RECORD",

    previous: isOdia
      ? "ପୂର୍ବ ଯୁଗ"
      : "Previous Era",

    next: isOdia
      ? "ପରବର୍ତ୍ତୀ ଯୁଗ"
      : "Next Era",

    culture: isOdia
      ? "ସଂସ୍କୃତି"
      : "Culture",

    food: isOdia
      ? "ଖାଦ୍ୟ ପରମ୍ପରା"
      : "Food Tradition",

    timeline: isOdia
      ? "ସମୟରେଖା"
      : "Timeline",

    close: isOdia
      ? "ବନ୍ଦ କରନ୍ତୁ"
      : "Close",

    playAudio: isOdia
      ? "କାହାଣୀ ଶୁଣନ୍ତୁ"
      : "Play Story Audio",

    loading: isOdia
      ? "ଐତିହ୍ୟ ସ୍ଥଳଗୁଡ଼ିକ ଲୋଡ୍ ହେଉଛି..."
      : "Loading heritage places...",

    error: isOdia
      ? "ହେରିଟେଜ୍ ହବ୍ ରୁ ତଥ୍ୟ ଲୋଡ୍ କରିହେଲା ନାହିଁ।"
      : "Unable to load Explore data from HeritageHub.",
  };

  /* =========================================================
     DATA
  ========================================================= */

  const [places, setPlaces] =
    useState<ExplorePlace[]>([]);

  const [eras, setEras] =
    useState<ExploreEra[]>([]);

  const [selectedPlace, setSelectedPlace] =
    useState<ExplorePlace | null>(null);

  const [selectedEraIndex, setSelectedEraIndex] =
    useState(0);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          placeData,
          eraData,
        ] = await Promise.all([
          api.getExplorePlaces(),
          api.getExploreEras(),
        ]);

        const activePlaces =
          Array.isArray(placeData)
            ? [...placeData]
                .filter((place) => place.is_active)
                .sort(
                  (a, b) =>
                    a.display_order -
                    b.display_order
                )
            : [];

        const orderedEras =
          Array.isArray(eraData)
            ? [...eraData].sort(
                (a, b) => {
                  if (
                    a.order !== undefined &&
                    b.order !== undefined &&
                    a.order !== b.order
                  ) {
                    return a.order - b.order;
                  }

                  return (
                    Number(a.year || 0) -
                    Number(b.year || 0)
                  );
                }
              )
            : [];

        setPlaces(activePlaces);
        setEras(orderedEras);
        setSelectedEraIndex(0);
      } catch (err) {
        console.error(
          "Explore API error:",
          err
        );

        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredPlaces = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    if (!query) {
      return places;
    }

    return places.filter((place) => {
      const values = [
        place.name,
        place.district,
        place.short_description,
        place.culture_title,
        place.culture_description,
        place.food_title,
        place.food_description,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [places, searchQuery]);

  /* =========================================================
     CURRENT ERA
  ========================================================= */

  const currentEra =
    eras[selectedEraIndex] || null;

  /* =========================================================
     TRANSLATION
  ========================================================= */

  const translateText = (
    value?: string | null
  ) => {
    if (!value) {
      return "";
    }

    return value;
  };

  /* =========================================================
     ERA NAVIGATION
  ========================================================= */

  const selectEra = (index: number) => {
    if (
      index < 0 ||
      index >= eras.length
    ) {
      return;
    }

    setSelectedEraIndex(index);
  };

  const previousEra = () => {
    setSelectedEraIndex((current) =>
      current > 0
        ? current - 1
        : current
    );
  };

  const nextEra = () => {
    setSelectedEraIndex((current) =>
      current < eras.length - 1
        ? current + 1
        : current
    );
  };

  /* =========================================================
     AUDIO
  ========================================================= */

  const playAudio = (url: string) => {
    const audio = new Audio(url);

    audio
      .play()
      .catch((err) =>
        console.error(
          "Audio error:",
          err
        )
      );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#faf9f5]
          dark:bg-[#12100f]
        "
      >
        <div className="text-center">
          <div
            className="
              w-12
              h-12
              border-4
              border-[#ddd5cc]
              border-t-[#94492d]
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p
            className="
              mt-5
              text-sm
              text-[#747878]
              dark:text-[#aaa69e]
            "
          >
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-[#faf9f5]
        dark:bg-[#12100f]
        text-[#1b1c1a]
        dark:text-[#f5f1e8]
        transition-colors
        duration-300
      "
    >

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section
        className="
          max-w-[1440px]
          mx-auto
          px-5
          md:px-16
          pt-12
          md:pt-20
          pb-10
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[#94492d]
          "
        >
          {t.pageLabel}
        </span>

        <h1
          className="
            text-[38px]
            md:text-[54px]
            lg:text-[62px]
            font-display
            font-bold
            mt-3
          "
        >
          {t.pageTitle}
        </h1>

        <p
          className="
            text-[16px]
            md:text-[17px]
            text-[#444748]
            dark:text-[#b9b5ad]
            max-w-2xl
            mt-4
            leading-relaxed
          "
        >
          {t.pageDescription}
        </p>

        {/* SEARCH */}

        <div
          className="
            relative
            max-w-2xl
            mt-9
          "
        >
          <Search
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              w-5
              h-5
              text-[#747878]
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder={t.search}
            className="
              w-full
              pl-12
              pr-5
              py-4
              bg-white
              dark:bg-[#1c1917]
              border
              border-[#c4c7c7]
              dark:border-[#47443f]
              text-[#1b1c1a]
              dark:text-white
              rounded-xl
              focus:outline-none
              focus:border-[#94492d]
              shadow-sm
            "
          />
        </div>
      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <section
          className="
            max-w-[1440px]
            mx-auto
            px-5
            md:px-16
            mb-8
          "
        >
          <div
            className="
              p-4
              rounded-xl
              border
              border-red-200
              bg-red-50
              text-red-700
            "
          >
            {error}
          </div>
        </section>
      )}

      {/* =====================================================
          HERITAGE PLACES
      ===================================================== */}

      <section
        className="
          max-w-[1440px]
          mx-auto
          px-5
          md:px-16
          pb-16
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-7
          "
        >
          <span
            className="
              text-[12px]
              text-[#747878]
              dark:text-[#aaa69e]
            "
          >
            {t.showing}{" "}
            <strong
              className="
                text-[#1b1c1a]
                dark:text-white
              "
            >
              {filteredPlaces.length}
            </strong>{" "}
            {t.heritagePlaces}
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={() =>
                setSearchQuery("")
              }
              className="
                text-[12px]
                uppercase
                tracking-wider
                font-bold
                text-[#94492d]
              "
            >
              {t.clear}
            </button>
          )}
        </div>

        {filteredPlaces.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-7
            "
          >
            {filteredPlaces.map(
              (place) => (
                <article
                  key={place.id}
                  onClick={() =>
                    setSelectedPlace(
                      place
                    )
                  }
                  className="
                    bg-white
                    dark:bg-[#1c1917]
                    border
                    border-[#c4c7c7]/50
                    dark:border-white/10
                    overflow-hidden
                    rounded-2xl
                    cursor-pointer
                    group
                    hover:shadow-2xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      h-[300px]
                      md:h-[380px]
                      overflow-hidden
                      bg-[#efeeea]
                      dark:bg-[#242321]
                    "
                  >
                    {place.main_image ? (
                      <img
                        src={
                          place.main_image
                        }
                        alt={translateText(
                          place.name
                        )}
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Landmark
                          className="
                            w-14
                            h-14
                            text-[#747878]
                          "
                        />
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div className="p-6 md:p-7">

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-[#94492d]
                        text-[11px]
                        uppercase
                        tracking-wider
                        font-bold
                      "
                    >
                      <MapPin
                        className="w-4 h-4"
                      />

                      {translateText(
                        place.district
                      )}
                    </div>

                    <h2
                      className="
                        font-display
                        text-[27px]
                        font-bold
                        mt-2
                      "
                    >
                      {translateText(
                        place.name
                      )}
                    </h2>

                    <p
                      className="
                        text-[14px]
                        text-[#444748]
                        dark:text-[#b9b5ad]
                        leading-relaxed
                        mt-3
                        line-clamp-3
                      "
                    >
                      {translateText(
                        place.short_description
                      )}
                    </p>

                    <div
                      className="
                        mt-6
                        pt-4
                        border-t
                        border-[#e3e1dc]
                        dark:border-white/10
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          text-[11px]
                          text-[#747878]
                          uppercase
                          tracking-wider
                        "
                      >
                        {place.eras?.length || 0}{" "}
                        {t.historicalEras}
                      </span>

                      <span
                        className="
                          text-[#94492d]
                          text-[12px]
                          font-bold
                          uppercase
                          tracking-wider
                          flex
                          items-center
                          gap-1
                        "
                      >
                        {t.explore}

                        <ArrowRight
                          className="w-4 h-4"
                        />
                      </span>
                    </div>

                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div
            className="
              border
              border-dashed
              border-[#c4c7c7]
              rounded-2xl
              p-16
              text-center
            "
          >
            <Search
              className="
                w-8
                h-8
                mx-auto
                text-[#747878]
              "
            />

            <h3
              className="
                font-display
                text-xl
                font-bold
                mt-4
              "
            >
              {t.noPlaces}
            </h3>

            <p
              className="
                text-sm
                text-[#747878]
                mt-2
              "
            >
              {t.tryAnother}
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          VISUAL TIME TRAVEL
      ===================================================== */}

      <section
        className="
          bg-[#f2eee7]
          dark:bg-[#171513]
          py-16
          md:py-24
          overflow-hidden
        "
      >
        <div
          className="
            max-w-[1320px]
            mx-auto
            px-5
            md:px-10
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-end
              lg:justify-between
              gap-6
              mb-12
            "
          >
            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[#94492d]
                  text-[11px]
                  uppercase
                  tracking-[0.16em]
                  font-bold
                "
              >
                <History
                  className="w-4 h-4"
                />

                {t.timelineLabel}
              </div>

              <h2
                className="
                  font-display
                  text-[36px]
                  md:text-[50px]
                  lg:text-[58px]
                  font-bold
                  mt-3
                  leading-tight
                "
              >
                {t.timelineTitle}
              </h2>

              <p
                className="
                  text-[#5d5b57]
                  dark:text-[#b9b5ad]
                  max-w-2xl
                  mt-4
                  leading-relaxed
                "
              >
                {t.timelineDescription}
              </p>

            </div>
          </div>

          {eras.length > 0 && currentEra ? (
            <div
              className="
                bg-[#fbf9f5]
                dark:bg-[#211f1c]
                border
                border-[#d8d0c7]
                dark:border-white/10
                rounded-[28px]
                overflow-hidden
                shadow-xl
              "
            >

              {/* =================================================
                  ERA DUMBBELL TIMELINE
              ================================================= */}

              <div
                className="
                  px-5
                  md:px-12
                  pt-10
                  pb-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    text-[10px]
                    md:text-xs
                    uppercase
                    tracking-wider
                    font-bold
                  "
                >

                  <span
                    className="
                      text-[#94492d]
                    "
                  >
                    {t.historicalEra}
                  </span>

                  <span
                    className="
                      text-[#47715e]
                    "
                  >
                    {t.presentEra}
                  </span>

                </div>

                {/* TIMELINE */}

                <div
                  className="
                    relative
                    mt-8
                    mb-10
                  "
                >

                  {/* MAIN LINE */}

                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-1/2
                      -translate-y-1/2
                      h-[5px]
                      rounded-full
                      bg-[#d6c5bb]
                      dark:bg-[#554b45]
                    "
                  />

                  {/* ACTIVE PROGRESS */}

                  <div
                    className="
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2
                      h-[5px]
                      rounded-full
                      bg-[#94492d]
                      transition-all
                      duration-500
                    "
                    style={{
                      width:
                        eras.length > 1
                          ? `${
                              (selectedEraIndex /
                                (eras.length - 1)) *
                              100
                            }%`
                          : "0%",
                    }}
                  />

                  {/* ERA POINTS */}

                  <div
                    className="
                      relative
                      flex
                      items-center
                      justify-between
                    "
                  >
                    {eras.map(
                      (
                        era,
                        index
                      ) => {
                        const active =
                          index ===
                          selectedEraIndex;

                        return (
                          <button
                            key={era.id}
                            type="button"
                            onClick={() =>
                              selectEra(
                                index
                              )
                            }
                            className="
                              relative
                              z-10
                              group
                              flex
                              flex-col
                              items-center
                            "
                          >

                            {/* DUMBBELL BALL */}

                            <span
                              className={`
                                flex
                                items-center
                                justify-center
                                rounded-full
                                border-[5px]
                                transition-all
                                duration-300
                                ${
                                  active
                                    ? `
                                      w-16
                                      h-16
                                      md:w-20
                                      md:h-20
                                      bg-[#94492d]
                                      border-[#f2eee7]
                                      dark:border-[#211f1c]
                                      shadow-[0_0_0_5px_rgba(148,73,45,0.18)]
                                    `
                                    : `
                                      w-11
                                      h-11
                                      md:w-14
                                      md:h-14
                                      bg-[#fbf9f5]
                                      dark:bg-[#211f1c]
                                      border-[#d2c3ba]
                                      dark:border-[#665c55]
                                      group-hover:border-[#94492d]
                                    `
                                }
                              `}
                            >
                              <Clock3
                                className={`
                                  ${
                                    active
                                      ? "w-7 h-7 text-white"
                                      : "w-5 h-5 text-[#8b8079]"
                                  }
                                `}
                              />
                            </span>

                            {/* YEAR */}

                            <span
                              className={`
                                mt-3
                                text-xs
                                md:text-sm
                                font-bold
                                transition-colors
                                ${
                                  active
                                    ? "text-[#94492d]"
                                    : "text-[#6f6964] dark:text-[#aaa69e]"
                                }
                              `}
                            >
                              {era.year}
                            </span>

                            {/* ERA NAME */}

                            <span
                              className="
                                hidden
                                md:block
                                mt-1
                                max-w-[150px]
                                text-center
                                text-[10px]
                                leading-tight
                                text-[#817a74]
                                dark:text-[#aaa69e]
                              "
                            >
                              {translateText(
                                era.era_name
                              )}
                            </span>

                          </button>
                        );
                      }
                    )}
                  </div>

                </div>
              </div>

              {/* =================================================
                  ACTIVE ERA
              ================================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-[1.15fr_1fr]
                  min-h-[500px]
                  border-t
                  border-[#ddd5cc]
                  dark:border-white/10
                "
              >

                {/* IMAGE */}

                <div
                  className="
                    relative
                    bg-black
                    min-h-[360px]
                    lg:min-h-[560px]
                    overflow-hidden
                  "
                >

                  {currentEra.image ? (
                    <img
                      key={
                        currentEra.id
                      }
                      src={
                        currentEra.image
                      }
                      alt={translateText(
                        currentEra.era_name
                      )}
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        transition-opacity
                        duration-500
                      "
                    />
                  ) : (
                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        bg-[#252321]
                      "
                    >
                      <Landmark
                        className="
                          w-20
                          h-20
                          text-white/20
                        "
                      />
                    </div>
                  )}

                  {/* IMAGE OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-black/10
                      to-transparent
                    "
                  />

                  {/* YEAR BADGE */}

                  <div
                    className="
                      absolute
                      top-6
                      left-6
                      px-4
                      py-2
                      rounded-lg
                      bg-[#94492d]
                      text-white
                      text-xs
                      font-bold
                      flex
                      items-center
                      gap-2
                      shadow-lg
                    "
                  >
                    <Calendar
                      className="w-4 h-4"
                    />

                    {currentEra.year}
                  </div>

                  {/* IMAGE CAPTION */}

                  <div
                    className="
                      absolute
                      left-6
                      right-6
                      bottom-6
                      text-white
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.18em]
                        font-bold
                        opacity-80
                      "
                    >
                      {t.activeEra}
                    </p>

                    <h3
                      className="
                        font-display
                        text-2xl
                        md:text-4xl
                        font-bold
                        mt-2
                      "
                    >
                      {translateText(
                        currentEra.era_name
                      )}
                    </h3>
                  </div>

                </div>

                {/* CONTENT */}

                <div
                  className="
                    p-7
                    md:p-10
                    lg:p-12
                    flex
                    flex-col
                    justify-center
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[#94492d]
                      text-[11px]
                      uppercase
                      tracking-[0.15em]
                      font-bold
                    "
                  >
                    <Clock3
                      className="w-4 h-4"
                    />

                    {t.activeEra}
                  </div>

                  <h3
                    className="
                      font-display
                      text-[32px]
                      md:text-[42px]
                      font-bold
                      leading-tight
                      mt-3
                    "
                  >
                    {translateText(
                      currentEra.era_name
                    )}
                  </h3>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mt-5
                      text-[#94492d]
                      font-bold
                    "
                  >
                    <Calendar
                      className="w-4 h-4"
                    />

                    {currentEra.year}
                  </div>

                  <p
                    className="
                      text-[#57534e]
                      dark:text-[#c4c0ba]
                      text-[15px]
                      md:text-[16px]
                      leading-[1.9]
                      mt-6
                      whitespace-pre-line
                    "
                  >
                    {translateText(
                      currentEra.description
                    )}
                  </p>

                  {/* CONTROLS */}

                  <div
                    className="
                      mt-10
                      pt-6
                      border-t
                      border-[#ddd5cc]
                      dark:border-white/10
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <button
                      type="button"
                      onClick={
                        previousEra
                      }
                      disabled={
                        selectedEraIndex ===
                        0
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-3
                        rounded-lg
                        border
                        border-[#d2c7be]
                        dark:border-white/10
                        text-sm
                        font-bold
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        hover:border-[#94492d]
                        transition
                      "
                    >
                      <ArrowLeft
                        className="w-4 h-4"
                      />

                      {t.previous}
                    </button>

                    <span
                      className="
                        text-xs
                        text-[#8a837d]
                        font-semibold
                      "
                    >
                      {selectedEraIndex + 1} /{" "}
                      {eras.length}
                    </span>

                    <button
                      type="button"
                      onClick={
                        nextEra
                      }
                      disabled={
                        selectedEraIndex ===
                        eras.length - 1
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-3
                        rounded-lg
                        bg-[#94492d]
                        text-white
                        text-sm
                        font-bold
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        hover:bg-[#773319]
                        transition
                      "
                    >
                      {t.next}

                      <ArrowRight
                        className="w-4 h-4"
                      />
                    </button>

                  </div>

                </div>

              </div>
            </div>
          ) : (
            <div
              className="
                bg-white
                dark:bg-[#211f1c]
                rounded-2xl
                border
                border-[#ddd5cc]
                dark:border-white/10
                p-12
                text-center
              "
            >
              <History
                className="
                  w-10
                  h-10
                  mx-auto
                  text-[#94492d]
                "
              />

              <p
                className="
                  mt-4
                  text-[#6f6964]
                  dark:text-[#aaa69e]
                "
              >
                {t.timelineDescription}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          PLACE DETAIL MODAL
      ===================================================== */}

      {selectedPlace && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/70
            backdrop-blur-sm
            overflow-y-auto
            flex
            items-start
            justify-center
            p-4
            md:p-10
          "
          onClick={() =>
            setSelectedPlace(null)
          }
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              relative
              w-full
              max-w-6xl
              bg-[#faf9f5]
              dark:bg-[#171614]
              text-[#1b1c1a]
              dark:text-[#f5f1e8]
              shadow-2xl
              rounded-2xl
              overflow-hidden
            "
          >

            {/* CLOSE */}

            <button
              type="button"
              aria-label={t.close}
              onClick={() =>
                setSelectedPlace(null)
              }
              className="
                absolute
                top-4
                right-4
                z-20
                w-10
                h-10
                rounded-full
                bg-black/70
                hover:bg-black
                text-white
                flex
                items-center
                justify-center
              "
            >
              <X
                className="w-5 h-5"
              />
            </button>

            {/* MAIN IMAGE */}

            <div
              className="
                h-[320px]
                md:h-[500px]
                bg-[#1c1b1b]
              "
            >
              {selectedPlace.main_image ? (
                <img
                  src={
                    selectedPlace.main_image
                  }
                  alt={translateText(
                    selectedPlace.name
                  )}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-full
                    h-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Landmark
                    className="
                      w-16
                      h-16
                      text-white/30
                    "
                  />
                </div>
              )}
            </div>

            {/* INTRO */}

            <div
              className="
                px-6
                md:px-12
                py-10
                border-b
                border-[#c4c7c7]/50
                dark:border-white/10
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[#94492d]
                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                "
              >
                <MapPin
                  className="w-4 h-4"
                />

                {translateText(
                  selectedPlace.district
                )}
              </div>

              <h2
                className="
                  font-display
                  text-[34px]
                  md:text-[48px]
                  font-bold
                  mt-2
                "
              >
                {translateText(
                  selectedPlace.name
                )}
              </h2>

              <p
                className="
                  text-[#444748]
                  dark:text-[#b9b5ad]
                  text-[16px]
                  leading-relaxed
                  max-w-3xl
                  mt-4
                  whitespace-pre-line
                "
              >
                {translateText(
                  selectedPlace.short_description
                )}
              </p>

              {selectedPlace.story_audio && (
                <button
                  type="button"
                  onClick={() =>
                    playAudio(
                      selectedPlace.story_audio!
                    )
                  }
                  className="
                    mt-6
                    px-5
                    py-3
                    bg-[#94492d]
                    hover:bg-[#773319]
                    text-white
                    text-xs
                    uppercase
                    tracking-wider
                    font-bold
                    flex
                    items-center
                    gap-2
                    rounded-lg
                  "
                >
                  <Volume2
                    className="w-4 h-4"
                  />

                  {t.playAudio}
                </button>
              )}

            </div>

            {/* CULTURE */}

            <section
              className="
                px-6
                md:px-12
                py-12
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-10
                items-center
              "
            >

              <div>

                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    font-bold
                    text-[#94492d]
                  "
                >
                  {t.culture}
                </span>

                <h3
                  className="
                    font-display
                    text-[28px]
                    md:text-[34px]
                    font-bold
                    mt-2
                  "
                >
                  {translateText(
                    selectedPlace.culture_title
                  )}
                </h3>

                <div
                  className="
                    text-[#444748]
                    dark:text-[#b9b5ad]
                    text-[14px]
                    md:text-[15px]
                    leading-[1.8]
                    mt-5
                    whitespace-pre-line
                  "
                >
                  {translateText(
                    selectedPlace.culture_description
                  )}
                </div>

              </div>

              <div
                className="
                  h-[350px]
                  bg-[#efeeea]
                  dark:bg-[#242321]
                  rounded-xl
                  overflow-hidden
                "
              >
                {selectedPlace.culture_image && (
                  <img
                    src={
                      selectedPlace.culture_image
                    }
                    alt={translateText(
                      selectedPlace.culture_title
                    )}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />
                )}
              </div>

            </section>

            {/* FOOD */}

            <section
              className="
                px-6
                md:px-12
                py-12
                bg-[#efeeea]
                dark:bg-[#201f1c]
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-10
                items-center
              "
            >

              <div
                className="
                  h-[350px]
                  bg-white
                  dark:bg-[#292824]
                  rounded-xl
                  overflow-hidden
                "
              >
                {selectedPlace.food_image && (
                  <img
                    src={
                      selectedPlace.food_image
                    }
                    alt={translateText(
                      selectedPlace.food_title
                    )}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />
                )}
              </div>

              <div>

                <span
                  className="
                    flex
                    items-center
                    gap-1
                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    font-bold
                    text-[#94492d]
                  "
                >
                  <Utensils
                    className="w-4 h-4"
                  />

                  {t.food}
                </span>

                <h3
                  className="
                    font-display
                    text-[28px]
                    md:text-[34px]
                    font-bold
                    mt-2
                  "
                >
                  {translateText(
                    selectedPlace.food_title
                  )}
                </h3>

                <div
                  className="
                    text-[#444748]
                    dark:text-[#b9b5ad]
                    text-[14px]
                    md:text-[15px]
                    leading-[1.8]
                    mt-5
                    whitespace-pre-line
                  "
                >
                  {translateText(
                    selectedPlace.food_description
                  )}
                </div>

              </div>

            </section>

            {/* PLACE TIMELINE */}

            <section
              className="
                px-6
                md:px-12
                py-12
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[#94492d]
                "
              >
                <Clock3
                  className="w-5 h-5"
                />

                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.14em]
                    font-bold
                  "
                >
                  {t.timeline}
                </span>
              </div>

              <h3
                className="
                  font-display
                  text-[30px]
                  font-bold
                  mt-2
                  mb-8
                "
              >
                {t.historicalEras}
              </h3>

              <div
                className="
                  space-y-8
                "
              >
                {[
                  ...(selectedPlace.eras || []),
                ]
                  .sort(
                    (a, b) =>
                      a.order - b.order
                  )
                  .map((era) => (
                    <div
                      key={era.id}
                      className="
                        grid
                        grid-cols-1
                        md:grid-cols-[260px_1fr]
                        gap-6
                        border-b
                        border-[#c4c7c7]/50
                        dark:border-white/10
                        pb-8
                      "
                    >

                      <div
                        className="
                          h-[180px]
                          bg-[#efeeea]
                          dark:bg-[#242321]
                          rounded-xl
                          overflow-hidden
                        "
                      >
                        {era.image && (
                          <img
                            src={
                              era.image
                            }
                            alt={translateText(
                              era.era_name
                            )}
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                          />
                        )}
                      </div>

                      <div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-[#94492d]
                            text-xs
                            font-bold
                          "
                        >
                          <Calendar
                            className="w-4 h-4"
                          />

                          {era.year}
                        </div>

                        <h4
                          className="
                            font-display
                            text-xl
                            font-bold
                            mt-2
                          "
                        >
                          {translateText(
                            era.era_name
                          )}
                        </h4>

                        <p
                          className="
                            text-[#444748]
                            dark:text-[#b9b5ad]
                            text-sm
                            leading-relaxed
                            mt-3
                            whitespace-pre-line
                          "
                        >
                          {translateText(
                            era.description
                          )}
                        </p>

                      </div>

                    </div>
                  ))}
              </div>

            </section>

          </div>
        </div>
      )}

    </div>
  );
};

export default ExplorePage;