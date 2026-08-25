import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ExternalLink,
  Eye,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  api,
} from "../services/api";

const API_BASE =
  "https://heritagehub-backend1.onrender.com";

/* =========================================================
   TYPES
========================================================= */

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  buy_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  category: number;
}

interface Category {
  id: number;
  name: string;
}

/* =========================================================
   PAGE
========================================================= */

export const MarketplacePage:
React.FC = () => {
  const {
    language,
  } = useLanguage();

  const isOdia =
    language === "or";

  const [
    products,
    setProducts,
  ] =
    useState<Product[]>(
      []
    );

  const [
    categories,
    setCategories,
  ] =
    useState<Category[]>(
      []
    );

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<
      number | "all"
    >("all");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    inspectProduct,
    setInspectProduct,
  ] =
    useState<
      Product | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  /*
   * Cache automatic translations so new marketplace products
   * do not need to be translated again every time.
   */
  const [
    odiaCache,
    setOdiaCache,
  ] =
    useState<
      Record<
        string,
        string
      >
    >(() => {
      try {
        const saved =
          localStorage.getItem(
            "heritagehub_marketplace_odia_cache"
          );

        return saved
          ? JSON.parse(
              saved
            )
          : {};
      } catch {
        return {};
      }
    });

  const [
    translating,
    setTranslating,
  ] =
    useState(false);

  /* =======================================================
     STATIC UI TEXT
  ======================================================= */

  const text = {
    loading:
      isOdia
        ? "ଐତିହ୍ୟ ବଜାର ଲୋଡ୍ ହେଉଛି..."
        : "Loading heritage marketplace...",

    unavailable:
      isOdia
        ? "ଐତିହ୍ୟ ବଜାର ଉପଲବ୍ଧ ନାହିଁ"
        : "Marketplace unavailable",

    retry:
      isOdia
        ? "ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ"
        : "Try Again",

    label:
      isOdia
        ? "ଓଡ଼ିଶା ଶିଳ୍ପୀ ବଜାର"
        : "Odisha Artisan Marketplace",

    title:
      isOdia
        ? "ଐତିହ୍ୟ ବଜାର"
        : "Heritage Marketplace",

    description:
      isOdia
        ? "ଓଡ଼ିଶାର ସମୃଦ୍ଧ ସାଂସ୍କୃତିକ ଐତିହ୍ୟରୁ ପ୍ରେରିତ ପାରମ୍ପରିକ ହସ୍ତଶିଳ୍ପ, ଆଦିବାସୀ କଳା ଏବଂ ଅଳଙ୍କାର ଅନ୍ୱେଷଣ କରନ୍ତୁ।"
        : "Discover traditional handicrafts, tribal art and jewellery inspired by Odisha's rich cultural heritage.",

    search:
      isOdia
        ? "ହସ୍ତଶିଳ୍ପ, ଅଳଙ୍କାର କିମ୍ବା ଆଦିବାସୀ କଳା ଖୋଜନ୍ତୁ..."
        : "Search crafts, jewellery or tribal art...",

    allProducts:
      isOdia
        ? "ସମସ୍ତ ପଣ୍ୟ"
        : "All Products",

    showing:
      isOdia
        ? "ଦେଖାଯାଉଛି"
        : "Showing",

    products:
      isOdia
        ? "ଟି ଐତିହ୍ୟ ପଣ୍ୟ"
        : "heritage products",

    noProducts:
      isOdia
        ? "କୌଣସି ପଣ୍ୟ ମିଳିଲା ନାହିଁ"
        : "No products found",

    anotherSearch:
      isOdia
        ? "ଅନ୍ୟ ଏକ ବର୍ଗ କିମ୍ବା ଖୋଜା ଶବ୍ଦ ବ୍ୟବହାର କରନ୍ତୁ।"
        : "Try another category or search term.",

    noImage:
      isOdia
        ? "ଛବି ଉପଲବ୍ଧ ନାହିଁ"
        : "No image",

    view:
      isOdia
        ? "ପଣ୍ୟ ଦେଖନ୍ତୁ"
        : "View product",

    price:
      isOdia
        ? "ମୂଲ୍ୟ"
        : "Price",

    productPrice:
      isOdia
        ? "ପଣ୍ୟର ମୂଲ୍ୟ"
        : "Product Price",

    buyNow:
      isOdia
        ? "ଏବେ କିଣନ୍ତୁ"
        : "Buy Now",

    buySeller:
      isOdia
        ? "ବିକ୍ରେତାଙ୍କଠାରୁ କିଣନ୍ତୁ"
        : "Buy from Seller",

    redirect:
      isOdia
        ? "କ୍ରୟ ସମ୍ପୂର୍ଣ୍ଣ କରିବା ପାଇଁ ଆପଣଙ୍କୁ ବିକ୍ରେତାଙ୍କ ୱେବସାଇଟ୍‌କୁ ପଠାଯିବ।"
        : "You will be redirected to the seller's website to complete your purchase.",

    unavailableLink:
      isOdia
        ? "ଏହି ପଣ୍ୟ ପାଇଁ କ୍ରୟ ଲିଙ୍କ ବର୍ତ୍ତମାନ ଉପଲବ୍ଧ ନାହିଁ।"
        : "Purchase link is currently unavailable for this product.",

    translating:
      isOdia
        ? "ପଣ୍ୟ ତଥ୍ୟ ଓଡ଼ିଆକୁ ରୂପାନ୍ତର ହେଉଛି..."
        : "",
  };

  /* =======================================================
     ODIA NUMBER FORMAT
  ======================================================= */

  const toOdiaDigits = (
    value:
      string | number
  ) => {
    const map:
    Record<string, string> = {
      "0": "୦",
      "1": "୧",
      "2": "୨",
      "3": "୩",
      "4": "୪",
      "5": "୫",
      "6": "୬",
      "7": "୭",
      "8": "୮",
      "9": "୯",
    };

    return String(
      value
    ).replace(
      /[0-9]/g,
      (
        digit
      ) =>
        map[
          digit
        ]
    );
  };

  const formatPrice = (
    rawPrice:
      string
  ) => {
    const numeric =
      Number(
        rawPrice
      );

    if (
      Number.isNaN(
        numeric
      )
    ) {
      return isOdia
        ? `₹${toOdiaDigits(
            rawPrice
          )}`
        : `₹${rawPrice}`;
    }

    const englishPrice =
      numeric.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits:
            2,
        }
      );

    return isOdia
      ? `₹${toOdiaDigits(
          englishPrice
        )}`
      : `₹${englishPrice}`;
  };

  const formatCount = (
    value: number
  ) =>
    isOdia
      ? toOdiaDigits(
          value
        )
      : String(
          value
        );

  /* =======================================================
     LOCAL TRANSLATIONS
  ======================================================= */

  const normalize = (
    value: string
  ) =>
    value
      .trim()
      .replace(
        /\s+/g,
        " "
      )
      .toLowerCase();

  const localOdiaMap:
  Record<string, string> = {
    /* CATEGORY */

    "jewellery":
      "ଅଳଙ୍କାର",

    "jewelry":
      "ଅଳଙ୍କାର",

    "tribal art":
      "ଆଦିବାସୀ କଳା",

    "handicrafts":
      "ହସ୍ତଶିଳ୍ପ",

    "handicraft":
      "ହସ୍ତଶିଳ୍ପ",

    "heritage craft":
      "ଐତିହ୍ୟ ହସ୍ତଶିଳ୍ପ",

    "pattachitra":
      "ପଟ୍ଟଚିତ୍ର",

    /* PRODUCT NAMES */

    "dhokra dance necklace":
      "ଢୋକ୍ରା ନୃତ୍ୟ ହାର",

    "tribal folk mask":
      "ଆଦିବାସୀ ଲୋକ ମୁଖୋଷ",

    "wooden art tribal":
      "ଆଦିବାସୀ କାଠ କଳା",

    "patachitra painting":
      "ପଟ୍ଟଚିତ୍ର ଚିତ୍ରକଳା",

    "pattachitra painting":
      "ପଟ୍ଟଚିତ୍ର ଚିତ୍ରକଳା",

    "dhokra chocker (necklace with earrings)":
      "ଢୋକ୍ରା ଚୋକର୍ ହାର ଓ କାନଫୁଲ",

    "dhokra choker (necklace with earrings)":
      "ଢୋକ୍ରା ଚୋକର୍ ହାର ଓ କାନଫୁଲ",

    "tribal coconut hanging":
      "ଆଦିବାସୀ ନଡ଼ିଆ ଝୁଲା ସଜାବଟ",

    "tribal handcrafted balti":
      "ଆଦିବାସୀ ହସ୍ତନିର୍ମିତ ବାଲ୍ଟି",

    "handmade dokra earrings with":
      "ହସ୍ତନିର୍ମିତ ଢୋକ୍ରା କାନଫୁଲ",

    "handmade dokra earrings":
      "ହସ୍ତନିର୍ମିତ ଢୋକ୍ରା କାନଫୁଲ",

    "dhokra bracelet":
      "ଢୋକ୍ରା ବାହୁବନ୍ଧ",

    "dhokra dance necklace jewellery":
      "ଢୋକ୍ରା ନୃତ୍ୟ ହାର",

    /* DESCRIPTIONS */

    "tribal woman dokra necklace of a tribal dancer":
      "ଆଦିବାସୀ ନୃତ୍ୟଶିଳ୍ପୀଙ୍କ ଆକୃତି ସହ ଢୋକ୍ରା ଶୈଳୀର ଆଦିବାସୀ ହାର।",

    "odisha handicraft folk art lion face mask for home – powerful handcrafted decor":
      "ଓଡ଼ିଶାର ହସ୍ତଶିଳ୍ପ ଲୋକକଳା ସିଂହମୁଖ ମୁଖୋଷ, ଘର ସଜାଣି ପାଇଁ ଆକର୍ଷଣୀୟ ହସ୍ତନିର୍ମିତ ଶୈଳୀ।",

    "odisha handicraft folk art lion face mask for home - powerful handcrafted decor":
      "ଓଡ଼ିଶାର ହସ୍ତଶିଳ୍ପ ଲୋକକଳା ସିଂହମୁଖ ମୁଖୋଷ, ଘର ସଜାଣି ପାଇଁ ଆକର୍ଷଣୀୟ ହସ୍ତନିର୍ମିତ ଶୈଳୀ।",

    "woodle india odisha tribal woman pre marked mdf design 1":
      "ଓଡ଼ିଶାର ଆଦିବାସୀ ନାରୀ ଆକୃତି ସହ ପୂର୍ବଚିହ୍ନିତ ଏମ୍‌ଡିଏଫ୍ କାଠ କଳା ଡିଜାଇନ୍।",

    "odisha handicraft ancient patachitra painting art form of odisha":
      "ଓଡ଼ିଶାର ପ୍ରାଚୀନ ପଟ୍ଟଚିତ୍ର ପରମ୍ପରାର ହସ୍ତନିର୍ମିତ ଚିତ୍ରକଳା।",

    "odisha handicraft ancient pattachitra painting art form of odisha":
      "ଓଡ଼ିଶାର ପ୍ରାଚୀନ ପଟ୍ଟଚିତ୍ର ପରମ୍ପରାର ହସ୍ତନିର୍ମିତ ଚିତ୍ରକଳା।",

    "handcrafted odisha tribal dhokra choker necklace with earrings":
      "ଓଡ଼ିଶାର ଆଦିବାସୀ ଢୋକ୍ରା ଶୈଳୀର ହସ୍ତନିର୍ମିତ ଚୋକର୍ ହାର ଓ କାନଫୁଲ।",

    "tribal painting on a hanging coconut (purely handcrafted)":
      "ଝୁଲା ନଡ଼ିଆ ଉପରେ ଆଦିବାସୀ ଚିତ୍ରକଳା, ସମ୍ପୂର୍ଣ୍ଣ ହସ୍ତନିର୍ମିତ।",

    "patachitra aluminium balti multi coloured tribal design":
      "ବହୁରଙ୍ଗୀ ଆଦିବାସୀ ପଟ୍ଟଚିତ୍ର ଡିଜାଇନ୍ ସହ ଅଲୁମିନିୟମ୍ ବାଲ୍ଟି।",

    "pattachitra aluminium balti multi coloured tribal design":
      "ବହୁରଙ୍ଗୀ ଆଦିବାସୀ ପଟ୍ଟଚିତ୍ର ଡିଜାଇନ୍ ସହ ଅଲୁମିନିୟମ୍ ବାଲ୍ଟି।",
  };

  const getLocalOdia = (
    value?:
      string | null
  ) => {
    if (!value) {
      return "";
    }

    const key =
      normalize(
        value
      );

    return (
      localOdiaMap[
        key
      ] ||
      odiaCache[
        key
      ] ||
      ""
    );
  };

  const toOdia = (
    value?:
      string | null
  ) => {
    if (!value) {
      return "";
    }

    if (!isOdia) {
      return value;
    }

    const translated =
      getLocalOdia(
        value
      );

    /*
     * IMPORTANT:
     * Never show raw English product text while Odia mode
     * is selected. Unknown backend content is translated
     * automatically below.
     */
    return (
      translated ||
      "ଓଡ଼ିଆ ରୂପାନ୍ତର ହେଉଛି..."
    );
  };

  const saveTranslation = (
    english: string,
    odia: string
  ) => {
    const key =
      normalize(
        english
      );

    setOdiaCache(
      (
        current
      ) => {
        if (
          current[
            key
          ] === odia
        ) {
          return current;
        }

        const next = {
          ...current,
          [key]:
            odia,
        };

        try {
          localStorage.setItem(
            "heritagehub_marketplace_odia_cache",
            JSON.stringify(
              next
            )
          );
        } catch {
          // Ignore localStorage errors.
        }

        return next;
      }
    );
  };

  /* =======================================================
     LOAD MARKETPLACE DATA
  ======================================================= */

  const loadMarketplace =
    async () => {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const [
          productsResponse,
          categoriesResponse,
        ] =
          await Promise.all([
            fetch(
              `${API_BASE}/api/shopping/products/`
            ),
            fetch(
              `${API_BASE}/api/shopping/categories/`
            ),
          ]);

        if (
          !productsResponse.ok
        ) {
          throw new Error(
            `Products request failed: ${productsResponse.status}`
          );
        }

        if (
          !categoriesResponse.ok
        ) {
          throw new Error(
            `Categories request failed: ${categoriesResponse.status}`
          );
        }

        const productsData:
        Product[] =
          await productsResponse.json();

        const categoriesData:
        Category[] =
          await categoriesResponse.json();

        setProducts(
          productsData
            .filter(
              (
                product
              ) =>
                product.is_active
            )
            .sort(
              (
                a,
                b
              ) =>
                a.display_order -
                b.display_order
            )
        );

        setCategories(
          categoriesData
        );
      } catch (
        err
      ) {
        console.error(
          "Marketplace loading failed:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : text.unavailable
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(
    () => {
      loadMarketplace();
    },
    []
  );

  /* =======================================================
     AUTOMATIC ODIA TRANSLATION
  ======================================================= */

  useEffect(
    () => {
      if (
        !isOdia ||
        loading
      ) {
        return;
      }

      const pending =
        new Set<string>();

      const add = (
        value?:
          string | null
      ) => {
        if (
          !value ||
          !value.trim()
        ) {
          return;
        }

        const key =
          normalize(
            value
          );

        if (
          localOdiaMap[
            key
          ] ||
          odiaCache[
            key
          ]
        ) {
          return;
        }

        if (
          /^https?:\/\//i.test(
            value
          )
        ) {
          return;
        }

        pending.add(
          value.trim()
        );
      };

      categories.forEach(
        (
          category
        ) => {
          add(
            category.name
          );
        }
      );

      products.forEach(
        (
          product
        ) => {
          add(
            product.name
          );

          add(
            product.description
          );
        }
      );

      const values =
        Array.from(
          pending
        );

      if (
        values.length ===
        0
      ) {
        return;
      }

      let cancelled =
        false;

      const translateAll =
        async () => {
          setTranslating(
            true
          );

          /*
           * Small sequential batches to reduce API
           * throttling / 429 errors.
           */
          const batchSize =
            2;

          for (
            let i = 0;
            i <
            values.length;
            i +=
            batchSize
          ) {
            if (
              cancelled
            ) {
              break;
            }

            const batch =
              values.slice(
                i,
                i +
                  batchSize
              );

            await Promise.all(
              batch.map(
                async (
                  english
                ) => {
                  try {
                    const result =
                      await api.translateToOdia(
                        english
                      );

                    if (
                      !cancelled &&
                      result?.odia_translation
                    ) {
                      saveTranslation(
                        english,
                        result.odia_translation.trim()
                      );
                    }
                  } catch (
                    translationError
                  ) {
                    console.error(
                      "Marketplace Odia translation failed:",
                      english,
                      translationError
                    );
                  }
                }
              )
            );
          }

          if (
            !cancelled
          ) {
            setTranslating(
              false
            );
          }
        };

      translateAll();

      return () => {
        cancelled =
          true;
      };
    },
    [
      isOdia,
      loading,
      products,
      categories,
    ]
  );

  /* =======================================================
     CATEGORY
  ======================================================= */

  const getCategoryName = (
    categoryId:
      number
  ) =>
    categories.find(
      (
        category
      ) =>
        category.id ===
        categoryId
    )?.name ||
    "Heritage Craft";

  const displayCategory = (
    categoryId:
      number
  ) =>
    toOdia(
      getCategoryName(
        categoryId
      )
    );

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return products.filter(
          (
            product
          ) => {
            const categoryMatch =
              selectedCategory ===
                "all" ||
              product.category ===
                selectedCategory;

            const searchValues = [
              product.name,
              product.description,
              getCategoryName(
                product.category
              ),
              toOdia(
                product.name
              ),
              toOdia(
                product.description
              ),
              displayCategory(
                product.category
              ),
            ];

            const searchMatch =
              !query ||
              searchValues.some(
                (
                  value
                ) =>
                  String(
                    value ||
                      ""
                  )
                    .toLowerCase()
                    .includes(
                      query
                    )
              );

            return (
              categoryMatch &&
              searchMatch
            );
          }
        );
      },
      [
        products,
        categories,
        selectedCategory,
        search,
        language,
        odiaCache,
      ]
    );

  /* =======================================================
     BUY
  ======================================================= */

  const handleBuy = (
    product:
      Product
  ) => {
    if (
      !product.buy_url
    ) {
      alert(
        text.unavailableLink
      );

      return;
    }

    window.open(
      product.buy_url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading
  ) {
    return (
      <div
        className="
          min-h-screen

          flex
          items-center
          justify-center

          bg-[#faf9f5]
          dark:bg-[#12100f]

          text-[#1b1c1a]
          dark:text-[#f3eee7]
        "
      >
        <div className="text-center">
          <RefreshCw
            className="
              w-7
              h-7

              animate-spin

              mx-auto
              mb-3

              text-[#94492d]
              dark:text-[#d97955]
            "
          />

          <p
            className="
              text-[#444748]
              dark:text-[#c5beb7]
            "
          >
            {
              text.loading
            }
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (
    error
  ) {
    return (
      <div
        className="
          min-h-screen

          flex
          items-center
          justify-center

          bg-[#faf9f5]
          dark:bg-[#12100f]

          px-5
        "
      >
        <div
          className="
            max-w-lg
            w-full

            border
            border-[#c4c7c7]
            dark:border-[#3b3531]

            bg-white
            dark:bg-[#1c1917]

            text-[#1b1c1a]
            dark:text-[#f3eee7]

            p-8

            text-center
          "
        >
          <h2
            className="
              text-2xl
              font-display
              font-bold

              mb-2
            "
          >
            {
              text.unavailable
            }
          </h2>

          <p
            className="
              text-[#747878]
              dark:text-[#aaa39c]

              mb-5
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={
              loadMarketplace
            }
            className="
              bg-[#94492d]
              dark:bg-[#d97955]

              text-white

              px-6
              py-3

              font-semibold
            "
          >
            {
              text.retry
            }
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <div
        className="
          w-full
          min-h-screen

          py-10
          md:py-14

          max-w-[1440px]
          mx-auto

          px-5
          md:px-16

          bg-[#faf9f5]
          dark:bg-[#12100f]

          text-[#1b1c1a]
          dark:text-[#f3eee7]

          transition-colors
        "
      >
        {/* HEADER */}

        <div
          className="
            border-b
            border-[#c4c7c7]
            dark:border-[#3b3531]

            pb-8
            mb-8
          "
        >
          <span
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.15em]

              text-[#94492d]
              dark:text-[#d97955]
            "
          >
            {
              text.label
            }
          </span>

          <h1
            className="
              text-[36px]
              md:text-[48px]

              font-display
              font-bold

              mt-2
            "
          >
            {
              text.title
            }
          </h1>

          <p
            className="
              text-[15px]

              text-[#444748]
              dark:text-[#c5beb7]

              max-w-2xl

              mt-3

              leading-relaxed
            "
          >
            {
              text.description
            }
          </p>

          {isOdia &&
            translating && (
              <p
                className="
                  mt-3

                  text-[11px]
                  font-semibold

                  text-[#94492d]
                  dark:text-[#d97955]
                "
              >
                {
                  text.translating
                }
              </p>
            )}
        </div>

        {/* SEARCH */}

        <div
          className="
            relative
            max-w-2xl
            mb-6
          "
        >
          <Search
            className="
              absolute

              left-4
              top-1/2

              -translate-y-1/2

              text-[#747878]
              dark:text-[#aaa39c]
            "
            size={
              18
            }
          />

          <input
            type="text"
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={
              text.search
            }
            className="
              w-full

              border
              border-[#c4c7c7]
              dark:border-[#3b3531]

              bg-white
              dark:bg-[#1c1917]

              text-[#1b1c1a]
              dark:text-[#f3eee7]

              py-3.5
              pl-11
              pr-4

              outline-none

              focus:border-[#94492d]
              dark:focus:border-[#d97955]
            "
          />
        </div>

        {/* CATEGORY FILTER */}

        <div
          className="
            flex
            gap-2

            overflow-x-auto

            border-b
            border-[#c4c7c7]/60
            dark:border-[#3b3531]

            pb-5
            mb-8
          "
        >
          <button
            type="button"
            onClick={() =>
              setSelectedCategory(
                "all"
              )
            }
            className={`
              px-5
              py-2.5

              text-[12px]
              font-semibold

              whitespace-nowrap

              transition-colors

              ${
                selectedCategory ===
                "all"
                  ? `
                    bg-[#1b1c1a]
                    dark:bg-[#f3eee7]

                    text-white
                    dark:text-[#12100f]
                  `
                  : `
                    bg-[#efeeea]
                    dark:bg-[#24201d]

                    text-[#444748]
                    dark:text-[#c5beb7]
                  `
              }
            `}
          >
            {
              text.allProducts
            }
          </button>

          {categories.map(
            (
              category
            ) => (
              <button
                type="button"
                key={
                  category.id
                }
                onClick={() =>
                  setSelectedCategory(
                    category.id
                  )
                }
                className={`
                  px-5
                  py-2.5

                  text-[12px]
                  font-semibold

                  whitespace-nowrap

                  transition-colors

                  ${
                    selectedCategory ===
                    category.id
                      ? `
                        bg-[#1b1c1a]
                        dark:bg-[#f3eee7]

                        text-white
                        dark:text-[#12100f]
                      `
                      : `
                        bg-[#efeeea]
                        dark:bg-[#24201d]

                        text-[#444748]
                        dark:text-[#c5beb7]
                      `
                  }
                `}
              >
                {
                  toOdia(
                    category.name
                  )
                }
              </button>
            )
          )}
        </div>

        {/* RESULT COUNT */}

        <div
          className="
            flex
            justify-between
            items-center

            mb-5
          "
        >
          <p
            className="
              text-[13px]

              text-[#747878]
              dark:text-[#aaa39c]
            "
          >
            {
              text.showing
            }{" "}

            <strong
              className="
                text-[#1b1c1a]
                dark:text-[#f3eee7]
              "
            >
              {
                formatCount(
                  filteredProducts.length
                )
              }
            </strong>{" "}

            {
              text.products
            }
          </p>
        </div>

        {/* EMPTY */}

        {filteredProducts.length ===
          0 && (
          <div
            className="
              border
              border-[#c4c7c7]
              dark:border-[#3b3531]

              bg-white
              dark:bg-[#1c1917]

              py-20

              text-center
            "
          >
            <ShoppingBag
              className="
                mx-auto
                mb-3

                text-[#94492d]
                dark:text-[#d97955]
              "
              size={
                32
              }
            />

            <h3
              className="
                font-display
                text-2xl
                font-bold
              "
            >
              {
                text.noProducts
              }
            </h3>

            <p
              className="
                text-[#747878]
                dark:text-[#aaa39c]

                mt-2
              "
            >
              {
                text.anotherSearch
              }
            </p>
          </div>
        )}

        {/* PRODUCT GRID */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4

            gap-6
          "
        >
          {filteredProducts.map(
            (
              product
            ) => (
              <article
                key={
                  product.id
                }
                className="
                  bg-white
                  dark:bg-[#1c1917]

                  border
                  border-[#c4c7c7]
                  dark:border-[#3b3531]

                  overflow-hidden

                  flex
                  flex-col

                  group

                  hover:shadow-lg
                  dark:hover:shadow-black/30

                  transition-all
                "
              >
                {/* IMAGE */}

                <div
                  onClick={() =>
                    setInspectProduct(
                      product
                    )
                  }
                  className="
                    h-64

                    relative
                    overflow-hidden

                    bg-[#efeeea]
                    dark:bg-[#24201d]

                    cursor-pointer
                  "
                >
                  {product.image ? (
                    <img
                      src={
                        product.image
                      }
                      alt={
                        toOdia(
                          product.name
                        )
                      }
                      className="
                        w-full
                        h-full

                        object-cover

                        group-hover:scale-105

                        transition-transform
                        duration-500
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

                        text-[#747878]
                        dark:text-[#aaa39c]
                      "
                    >
                      {
                        text.noImage
                      }
                    </div>
                  )}

                  <div
                    className="
                      absolute

                      top-3
                      left-3

                      bg-white/95
                      dark:bg-[#1c1917]/95

                      px-3
                      py-1

                      text-[10px]
                      uppercase
                      tracking-wider
                      font-bold

                      text-[#94492d]
                      dark:text-[#d97955]
                    "
                  >
                    {
                      displayCategory(
                        product.category
                      )
                    }
                  </div>

                  <button
                    type="button"
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();

                      setInspectProduct(
                        product
                      );
                    }}
                    className="
                      absolute

                      right-3
                      bottom-3

                      w-9
                      h-9

                      bg-white
                      dark:bg-[#1c1917]

                      text-[#1b1c1a]
                      dark:text-[#f3eee7]

                      flex
                      items-center
                      justify-center

                      shadow-md

                      opacity-0
                      group-hover:opacity-100

                      transition-opacity
                    "
                    title={
                      text.view
                    }
                  >
                    <Eye
                      size={
                        17
                      }
                    />
                  </button>
                </div>

                {/* PRODUCT INFO */}

                <div
                  className="
                    p-5
                    flex-1
                  "
                >
                  <span
                    className="
                      text-[10px]
                      font-bold

                      uppercase
                      tracking-wider

                      text-[#94492d]
                      dark:text-[#d97955]
                    "
                  >
                    {
                      displayCategory(
                        product.category
                      )
                    }
                  </span>

                  <h3
                    onClick={() =>
                      setInspectProduct(
                        product
                      )
                    }
                    className="
                      text-[18px]
                      font-display
                      font-bold

                      mt-1

                      cursor-pointer

                      hover:text-[#94492d]
                      dark:hover:text-[#d97955]
                    "
                  >
                    {
                      toOdia(
                        product.name
                      )
                    }
                  </h3>

                  <p
                    className="
                      text-[13px]

                      text-[#444748]
                      dark:text-[#c5beb7]

                      line-clamp-3
                      leading-relaxed

                      mt-2
                    "
                  >
                    {
                      toOdia(
                        product.description
                      )
                    }
                  </p>
                </div>

                {/* PRICE */}

                <div
                  className="
                    px-5
                    pb-5
                  "
                >
                  <div
                    className="
                      border-t
                      border-[#c4c7c7]/50
                      dark:border-[#3b3531]

                      pt-4
                    "
                  >
                    <span
                      className="
                        text-[10px]

                        uppercase
                        tracking-wider

                        text-[#747878]
                        dark:text-[#aaa39c]
                      "
                    >
                      {
                        text.price
                      }
                    </span>

                    <div
                      className="
                        flex
                        items-center
                        justify-between

                        gap-3

                        mt-1
                      "
                    >
                      <span
                        className="
                          text-[22px]
                          font-display
                          font-bold
                        "
                      >
                        {
                          formatPrice(
                            product.price
                          )
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleBuy(
                            product
                          )
                        }
                        className="
                          px-4
                          py-2.5

                          bg-[#94492d]
                          hover:bg-[#773319]

                          dark:bg-[#d97955]
                          dark:hover:bg-[#cf6944]

                          text-white

                          text-[11px]
                          font-semibold

                          uppercase
                          tracking-wider

                          flex
                          items-center
                          gap-2

                          transition-colors
                        "
                      >
                        {
                          text.buyNow
                        }

                        <ExternalLink
                          size={
                            14
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      </div>

      {/* ===================================================
          PRODUCT MODAL
      =================================================== */}

      {inspectProduct && (
        <div
          onClick={() =>
            setInspectProduct(
              null
            )
          }
          className="
            fixed
            inset-0
            z-50

            bg-black/60

            flex
            items-center
            justify-center

            p-4
          "
        >
          <div
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
            className="
              relative

              bg-[#faf9f5]
              dark:bg-[#171614]

              text-[#1b1c1a]
              dark:text-[#f3eee7]

              w-full
              max-w-4xl
              max-h-[90vh]

              overflow-y-auto

              border
              border-[#c4c7c7]
              dark:border-[#3b3531]

              shadow-2xl

              grid
              md:grid-cols-2
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setInspectProduct(
                  null
                )
              }
              className="
                absolute
                z-10

                right-4
                top-4

                w-9
                h-9

                bg-white
                dark:bg-[#1c1917]

                shadow

                flex
                items-center
                justify-center
              "
              aria-label={
                isOdia
                  ? "ବନ୍ଦ କରନ୍ତୁ"
                  : "Close"
              }
            >
              <X
                size={
                  18
                }
              />
            </button>

            {/* IMAGE */}

            <div
              className="
                bg-[#efeeea]
                dark:bg-[#24201d]

                min-h-[350px]
              "
            >
              {inspectProduct.image ? (
                <img
                  src={
                    inspectProduct.image
                  }
                  alt={
                    toOdia(
                      inspectProduct.name
                    )
                  }
                  className="
                    w-full
                    h-full

                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    h-full

                    flex
                    items-center
                    justify-center

                    text-[#747878]
                    dark:text-[#aaa39c]
                  "
                >
                  {
                    text.noImage
                  }
                </div>
              )}
            </div>

            {/* INFORMATION */}

            <div
              className="
                p-7
                md:p-9

                flex
                flex-col
                justify-between
              "
            >
              <div>
                <span
                  className="
                    text-[11px]

                    uppercase
                    tracking-[0.15em]
                    font-bold

                    text-[#94492d]
                    dark:text-[#d97955]
                  "
                >
                  {
                    displayCategory(
                      inspectProduct.category
                    )
                  }
                </span>

                <h2
                  className="
                    font-display

                    text-[30px]
                    font-bold

                    mt-2

                    leading-tight
                  "
                >
                  {
                    toOdia(
                      inspectProduct.name
                    )
                  }
                </h2>

                <p
                  className="
                    text-[#444748]
                    dark:text-[#c5beb7]

                    text-[14px]
                    leading-relaxed

                    mt-5
                  "
                >
                  {
                    toOdia(
                      inspectProduct.description
                    )
                  }
                </p>

                <div
                  className="
                    border-y
                    border-[#c4c7c7]/60
                    dark:border-[#3b3531]

                    py-5
                    mt-7
                  "
                >
                  <span
                    className="
                      text-[11px]

                      uppercase
                      tracking-wider

                      text-[#747878]
                      dark:text-[#aaa39c]
                    "
                  >
                    {
                      text.productPrice
                    }
                  </span>

                  <div
                    className="
                      font-display
                      font-bold

                      text-[30px]

                      text-[#94492d]
                      dark:text-[#d97955]

                      mt-1
                    "
                  >
                    {
                      formatPrice(
                        inspectProduct.price
                      )
                    }
                  </div>
                </div>
              </div>

              <div
                className="
                  mt-8
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    handleBuy(
                      inspectProduct
                    )
                  }
                  className="
                    w-full

                    bg-[#94492d]
                    hover:bg-[#773319]

                    dark:bg-[#d97955]
                    dark:hover:bg-[#cf6944]

                    text-white

                    py-4

                    font-semibold

                    uppercase
                    tracking-wider

                    flex
                    items-center
                    justify-center
                    gap-2

                    transition-colors
                  "
                >
                  <ShoppingBag
                    size={
                      18
                    }
                  />

                  {
                    text.buySeller
                  }

                  <ExternalLink
                    size={
                      16
                    }
                  />
                </button>

                <p
                  className="
                    text-[11px]

                    text-[#747878]
                    dark:text-[#aaa39c]

                    text-center

                    mt-3
                  "
                >
                  {
                    text.redirect
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketplacePage