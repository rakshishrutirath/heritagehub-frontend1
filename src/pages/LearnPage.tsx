import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Music,
  Play,
  Pause,
  ExternalLink,
  Languages,
  Volume2,
  BookOpen,
  MapPin,
  Sparkles,
  Search,
  X,
  Swords,
  MapPinned,
  CalendarDays,
  ArrowRight,
  Landmark,
  Shield,
  History,
  Clock3,
  ChevronRight,
} from "lucide-react";

import {
  api,
  Song,
  DancePose,
  LanguagePhrase,
  RitualPractice,
} from "../services/api";

import { useLanguage } from "../context/LanguageContext";

/* =========================================================
   TYPES
========================================================= */

type LearnSection =
  | "songs"
  | "dance"
  | "language"
  | "rituals"
  | "battles"
  | "extinct-districts";

interface LearnPageProps {
  timeline?: unknown[];
  exhibitions?: unknown[];
  artifacts?: unknown[];
  onSelectArtifact?: (artifact: any) => void;
}

interface BattleRecord {
  id: number;
  title: string;
  region: string;
  period: string;
  description: string;
  significance: string;
  type: string;
}

interface ExtinctDistrictRecord {
  id: number;
  title: string;
  region: string;
  period: string;
  description: string;
  significance: string;
  type: string;
}

/* =========================================================
   HISTORICAL DATA
========================================================= */

const BATTLES: BattleRecord[] = [
  {
    id: 1,
    title: "Kalinga War",
    region: "Kalinga",
    period: "261 BCE",
    type: "Ancient History",
    description:
      "In 261 BCE, Ashoka of the Mauryan Empire invaded Kalinga. The war was devastating and became a major turning point in Ashoka's life and policy.",
    significance:
      "The Kalinga War is one of the defining events in Odisha's ancient history and is closely associated with Ashoka's turn toward Buddhism and Dhamma.",
  },
  {
    id: 2,
    title: "Paika Rebellion",
    region: "Khordha and surrounding areas",
    period: "1817–1818",
    type: "Resistance Movement",
    description:
      "The Paika Rebellion began in Khordha in 1817 and spread to other parts of Odisha. Paikas and other local groups resisted East India Company rule under leaders including Buxi Jagabandhu.",
    significance:
      "It remains a major chapter in Odisha's history of resistance to British rule, with Khordha as an important centre of the uprising.",
  },
];

const EXTINCT_DISTRICTS: ExtinctDistrictRecord[] = [
  {
    id: 1,
    title: "Undivided Koraput District",
    region: "Southern Odisha",
    period: "Before the 1992 reorganisation",
    type: "Administrative History",
    description:
      "The historic Koraput district was much larger than the present-day district. In 1992, the district was reorganised and four new districts were created from its territory: Koraput, Malkangiri, Nabarangpur and Rayagada.",
    significance:
      "The former extent of Koraput helps explain the modern administrative map of southern Odisha.",
  },
  {
    id: 2,
    title: "Undivided Sambalpur District",
    region: "Western Odisha",
    period: "Before the 1993 reorganisation",
    type: "Administrative History",
    description:
      "The erstwhile Sambalpur district covered a much larger area. During the 1992–1994 district reorganisation, its territory was divided and new districts including Bargarh, Jharsuguda and Deogarh were formed.",
    significance:
      "The history of undivided Sambalpur shows how western Odisha's present districts emerged from earlier administrative boundaries.",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const LearnPage: React.FC<LearnPageProps> = () => {
  const { language } = useLanguage();

  const isOdia = language === "or";

  /* =========================================================
     STATE
  ========================================================= */

  const [activeSection, setActiveSection] =
    useState<LearnSection>("songs");

  const [songs, setSongs] = useState<Song[]>([]);
  const [dancePoses, setDancePoses] = useState<DancePose[]>([]);
  const [phrases, setPhrases] = useState<LanguagePhrase[]>([]);
  const [rituals, setRituals] = useState<RitualPractice[]>([]);

  const [loading, setLoading] = useState(true);

  /*
   * This search is used for normal filtering.
   */
  const [search, setSearch] = useState("");

  /*
   * Separate translator state.
   *
   * IMPORTANT:
   * Gemini is ONLY called for text entered by the user.
   * We do NOT automatically send all cultural descriptions
   * to Gemini.
   */
  const [translatorInput, setTranslatorInput] = useState("");
  const [translatorOutput, setTranslatorOutput] = useState("");
  const [translatorLoading, setTranslatorLoading] =
    useState(false);
  const [translatorError, setTranslatorError] =
    useState("");

  const translatorTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playingSong, setPlayingSong] =
    useState<number | null>(null);

  const [playingPhrase, setPlayingPhrase] =
    useState<number | null>(null);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  /* =========================================================
     LOCAL ODIA TRANSLATIONS
  ========================================================= */

  const localOdiaMap: Record<string, string> = {
    hello: "ନମସ୍କାର",
    hi: "ନମସ୍କାର",
    "thank you": "ଧନ୍ୟବାଦ",
    "good morning": "ସୁପ୍ରଭାତ",
    "good evening": "ଶୁଭ ସନ୍ଧ୍ୟା",
    welcome: "ସ୍ୱାଗତ",
    "welcome to odisha": "ଓଡ଼ିଶାକୁ ସ୍ୱାଗତ",
    yes: "ହଁ",
    no: "ନା",
    please: "ଦୟାକରି",
    sorry: "ଦୁଃଖିତ",
    one: "ଏକ",
    two: "ଦୁଇ",
    three: "ତିନି",
    rice: "ଭାତ",
    water: "ପାଣି",
    food: "ଖାଦ୍ୟ",
    house: "ଘର",
    mother: "ମା",
    father: "ବାପା",
    friend: "ବନ୍ଧୁ",
    odia: "ଓଡ଼ିଆ",
    odisha: "ଓଡ଼ିଶା",
    dance: "ନୃତ୍ୟ",
    song: "ସଙ୍ଗୀତ",
    songs: "ସଙ୍ଗୀତ",
    language: "ଭାଷା",
    ritual: "ପରମ୍ପରା",
    rituals: "ପରମ୍ପରା",
    culture: "ସଂସ୍କୃତି",
    sambalpuri: "ସମ୍ବଲପୁରୀ",
    odissi: "ଓଡ଼ିଶୀ",
    dhemsa: "ଢେମସା",
    baitha: "ବୈଠା",
    boitha: "ବୈଠା",
    chowka: "ଚୌକା",
    chauka: "ଚୌକା",
    tribhangi: "ତ୍ରିଭଙ୍ଗୀ",
    sampada: "ସମ୍ପଦା",
    greetings: "ଅଭିବାଦନ",
    everyday: "ଦୈନନ୍ଦିନ",
    family: "ପରିବାର",
    travel: "ଭ୍ରମଣ",
    numbers: "ସଂଖ୍ୟା",
    sentences: "ବାକ୍ୟ",
    "folk song": "ଲୋକସଙ୍ଗୀତ",
    traditional: "ପାରମ୍ପରିକ",
    tribal: "ଆଦିବାସୀ",
    bhajan: "ଭଜନ",
    santali: "ସାନ୍ତାଳୀ",
    koraputia: "କୋରାପୁଟିଆ",
    sambalpur: "ସମ୍ବଲପୁର",
    puri: "ପୁରୀ",
    koraput: "କୋରାପୁଟ",
    cuttack: "କଟକ",
    bhubaneswar: "ଭୁବନେଶ୍ୱର",
    khordha: "ଖୋର୍ଦ୍ଧା",
    khurda: "ଖୋର୍ଦ୍ଧା",
    mayurbhanj: "ମୟୂରଭଞ୍ଜ",
    rayagada: "ରାୟଗଡ଼ା",
    kalahandi: "କଳାହାଣ୍ଡି",
    bargarh: "ବରଗଡ଼",
    ganjam: "ଗଞ୍ଜାମ",
    balasore: "ବାଲେଶ୍ୱର",
    kendrapara: "କେନ୍ଦ୍ରାପଡ଼ା",
    battles: "ଯୁଦ୍ଧ",
    battle: "ଯୁଦ୍ଧ",
    "kalinga war": "କଳିଙ୍ଗ ଯୁଦ୍ଧ",
    "paika rebellion": "ପାଇକ ବିଦ୍ରୋହ",
    "extinct districts": "ବିଲୁପ୍ତ ଜିଲ୍ଲା",
    "administrative history": "ପ୍ରଶାସନିକ ଇତିହାସ",
    "ancient history": "ପ୍ରାଚୀନ ଇତିହାସ",
    "resistance movement": "ପ୍ରତିରୋଧ ଆନ୍ଦୋଳନ",
    "southern odisha": "ଦକ୍ଷିଣ ଓଡ଼ିଶା",
    "western odisha": "ପଶ୍ଚିମ ଓଡ଼ିଶା",
  };

  const normalize = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLowerCase();

  const localTranslate = (value: string) =>
    localOdiaMap[normalize(value)] || "";

  /* =========================================================
     STATIC UI TEXT
  ========================================================= */

  const text = {
    odia: isOdia ? "ଓଡ଼ିଆ" : "Odia",
    eyebrow: isOdia
      ? "ଓଡ଼ିଶାର ଜୀବନ୍ତ ଐତିହ୍ୟ"
      : "ODISHA'S LIVING HERITAGE",

    title: isOdia
      ? "ଐତିହ୍ୟ ଶିଖନ୍ତୁ"
      : "Learn Odisha's Heritage",

    description: isOdia
      ? "ଓଡ଼ିଶାର ସଙ୍ଗୀତ, ନୃତ୍ୟ, ଭାଷା, ପରମ୍ପରା ଓ ଇତିହାସକୁ ଜାଣନ୍ତୁ।"
      : "Explore Odisha's music, dance, language, traditions and history.",

    songs: isOdia ? "ସଙ୍ଗୀତ" : "Songs",

    dance: isOdia ? "ନୃତ୍ୟ" : "Dance",

    language: isOdia ? "ଭାଷା" : "Language",

    rituals: isOdia ? "ପରମ୍ପରା" : "Rituals",

    battles: isOdia ? "ଯୁଦ୍ଧ" : "Battles",

    extinctDistricts: isOdia
      ? "ବିଲୁପ୍ତ ଜିଲ୍ଲା"
      : "Extinct Districts",

    songsTitle: isOdia
      ? "ଓଡ଼ିଶାର ସଙ୍ଗୀତ"
      : "Songs of Odisha",

    songsDescription: isOdia
      ? "ଓଡ଼ିଶାର ବିଭିନ୍ନ ଅଞ୍ଚଳର ପାରମ୍ପରିକ ସଙ୍ଗୀତ ଆବିଷ୍କାର କରନ୍ତୁ।"
      : "Discover traditional music preserved across Odisha.",

    danceTitle: isOdia
      ? "ଓଡ଼ିଶାର ନୃତ୍ୟ"
      : "Dance Traditions",

    danceDescription: isOdia
      ? "ଓଡ଼ିଶାର ଶାସ୍ତ୍ରୀୟ ଓ ଲୋକନୃତ୍ୟର ଭଙ୍ଗୀ ଏବଂ ପରମ୍ପରା ଜାଣନ୍ତୁ।"
      : "Explore classical and folk dance forms and movements.",

    languageTitle: isOdia
      ? "ଭାଷା ଶିଖନ୍ତୁ"
      : "Learn the Language",

    languageDescription: isOdia
      ? "ଇଂରାଜୀ ଶବ୍ଦ କିମ୍ବା ବାକ୍ୟ ଲେଖନ୍ତୁ ଏବଂ Gemini ଦ୍ୱାରା ଓଡ଼ିଆ ଅନୁବାଦ ପାଆନ୍ତୁ।"
      : "Type an English word or phrase and get its Odia translation powered by Gemini.",

    ritualsTitle: isOdia
      ? "ପରମ୍ପରା ଓ ଆଚାର"
      : "Rituals & Practices",

    ritualsDescription: isOdia
      ? "ଓଡ଼ିଶାର ପାରମ୍ପରିକ ଆଚାର ଓ ସମୁଦାୟ ପ୍ରଥା ଜାଣନ୍ତୁ।"
      : "Discover traditional rituals and community practices across Odisha.",

    battlesTitle: isOdia
      ? "ଓଡ଼ିଶାର ଐତିହାସିକ ଯୁଦ୍ଧ"
      : "Battles That Shaped Odisha",

    battlesDescription: isOdia
      ? "ଓଡ଼ିଶାର ଇତିହାସକୁ ପରିବର୍ତ୍ତନ କରିଥିବା ପ୍ରମୁଖ ଯୁଦ୍ଧ ଓ ପ୍ରତିରୋଧ ଆନ୍ଦୋଳନ ଆବିଷ୍କାର କରନ୍ତୁ।"
      : "Explore major battles and resistance movements that shaped Odisha's history.",

    extinctTitle: isOdia
      ? "ବିଲୁପ୍ତ ଜିଲ୍ଲା"
      : "Extinct Districts",

    extinctDescription: isOdia
      ? "ପୂର୍ବତନ ପ୍ରଶାସନିକ ଜିଲ୍ଲା ଏବଂ ଓଡ଼ିଶାର ସୀମା କିପରି ପରିବର୍ତ୍ତିତ ହେଲା ଜାଣନ୍ତୁ।"
      : "Explore former administrative districts and how Odisha's boundaries evolved.",

    translateTitle: isOdia
      ? "ଇଂରାଜୀରୁ ଓଡ଼ିଆ"
      : "English to Odia",

    translateSubtitle: isOdia
      ? "ଆପଣଙ୍କ ଶବ୍ଦ କିମ୍ବା ବାକ୍ୟ ଲେଖନ୍ତୁ"
      : "Type a word or short phrase",

    translatePlaceholder: isOdia
      ? "ଇଂରାଜୀରେ ଲେଖନ୍ତୁ... ଯଥା: hello"
      : "Type in English... e.g. hello",

    translating: isOdia
      ? "ଅନୁବାଦ ହେଉଛି..."
      : "Translating...",

    translationResult: isOdia
      ? "ଓଡ଼ିଆ ଅନୁବାଦ"
      : "Odia Translation",

    maxWords: isOdia
      ? "ସର୍ବାଧିକ ୮ଟି ଶବ୍ଦ ଲେଖନ୍ତୁ।"
      : "Please enter up to 8 words.",

    noResults: isOdia
      ? "କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ"
      : "No results found",

    tryAnother: isOdia
      ? "ଅନ୍ୟ କିଛି ଖୋଜନ୍ତୁ।"
      : "Try another search.",

    clearSearch: isOdia
      ? "ଖୋଜା ସଫା କରନ୍ତୁ"
      : "Clear Search",

    tutorial: isOdia
      ? "ଟ୍ୟୁଟୋରିଆଲ୍ ଦେଖନ୍ତୁ"
      : "Watch Tutorial",

    listen: isOdia
      ? "ଶୁଣନ୍ତୁ"
      : "Listen",

    period: isOdia
      ? "ସମୟ"
      : "Period",

    significance: isOdia
      ? "ଗୁରୁତ୍ୱ"
      : "Significance",

    region: isOdia
      ? "ଅଞ୍ଚଳ"
      : "Region",

    archive: isOdia
      ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ"
      : "HeritageHub Archive",

    history: isOdia
      ? "ଐତିହାସିକ ଅଭିଲେଖ"
      : "Historical Archive",

    administrativeHistory: isOdia
      ? "ପ୍ରଶାସନିକ ଇତିହାସ"
      : "Administrative History",
  };

  /* =========================================================
     FETCH BACKEND DATA
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [
          songsResponse,
          danceResponse,
          languageResponse,
          ritualsResponse,
        ] = await Promise.allSettled([
          api.getSongs(),
          api.getDancePoses(),
          api.getLanguagePhrases(),
          api.getRituals(),
        ]);

        if (songsResponse.status === "fulfilled") {
          setSongs(
            Array.isArray(songsResponse.value)
              ? songsResponse.value
              : []
          );
        }

        if (danceResponse.status === "fulfilled") {
          setDancePoses(
            Array.isArray(danceResponse.value)
              ? danceResponse.value
              : []
          );
        }

        if (languageResponse.status === "fulfilled") {
          setPhrases(
            Array.isArray(languageResponse.value)
              ? languageResponse.value
              : []
          );
        }

        if (ritualsResponse.status === "fulfilled") {
          setRituals(
            Array.isArray(ritualsResponse.value)
              ? ritualsResponse.value
              : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load Learn data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================================================
     GEMINI TRANSLATOR
     
     IMPORTANT:
     Only the user's translator input is sent to Gemini.
     Long backend descriptions are NOT sent automatically.
  ========================================================= */

  useEffect(() => {
    if (activeSection !== "language") {
      return;
    }

    const value = translatorInput.trim();

    setTranslatorError("");

    if (!value) {
      setTranslatorOutput("");
      setTranslatorLoading(false);
      return;
    }

    const wordCount = value.split(/\s+/).length;

    if (wordCount > 8) {
      setTranslatorOutput("");
      setTranslatorLoading(false);
      setTranslatorError(text.maxWords);
      return;
    }

    /*
     * Cancel previous debounce timer.
     */
    if (translatorTimerRef.current) {
      clearTimeout(translatorTimerRef.current);
    }

    /*
     * Use local translations immediately for common words.
     */
    const local = localTranslate(value);

    if (local) {
      setTranslatorOutput(local);
      setTranslatorLoading(false);
      return;
    }

    /*
     * Wait a little before calling Gemini.
     * This prevents a request for every single keystroke.
     */
    translatorTimerRef.current = setTimeout(
      async () => {
        try {
          setTranslatorLoading(true);
          setTranslatorError("");

          /*
           * This uses your existing api.ts method.
           *
           * Your backend endpoint:
           * POST /api/learn/translate/
           *
           * Your backend expects:
           * {
           *   english_phrase: "hello"
           * }
           *
           * and returns:
           * {
           *   odia_translation: "ନମସ୍କାର"
           * }
           */
          const result =
            await api.translateToOdia(value);

          const translated =
            result?.odia_translation ||
            (result as any)?.translated_text ||
            "";

          if (!translated) {
            throw new Error(
              "No translation returned by backend."
            );
          }

          setTranslatorOutput(
            translated.trim()
          );
        } catch (error: any) {
          console.error(
            "Odia translation failed:",
            error
          );

          setTranslatorOutput("");

          /*
           * Display a friendly message instead of
           * showing a large browser error.
           */
          setTranslatorError(
            error?.message ||
              (isOdia
                ? "ଅନୁବାଦ ବିଫଳ ହେଲା। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।"
                : "Translation failed. Please try again.")
          );
        } finally {
          setTranslatorLoading(false);
        }
      },
      600
    );

    return () => {
      if (translatorTimerRef.current) {
        clearTimeout(translatorTimerRef.current);
      }
    };
  }, [
    translatorInput,
    activeSection,
    isOdia,
  ]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredSongs = useMemo(() => {
    if (!normalizedSearch) return songs;

    return songs.filter((song) => {
      const item = song as any;

      const values = [
        item.title,
        item.artist,
        item.genre,
        item.region,
        item.cultural_context,
        item.title_odia,
        item.artist_odia,
        item.genre_odia,
        item.region_odia,
        item.cultural_context_odia,
      ];

      return values
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [songs, normalizedSearch]);

  const filteredDance = useMemo(() => {
    if (!normalizedSearch) return dancePoses;

    return dancePoses.filter((dance) => {
      const item = dance as any;

      const values = [
        item.dance_name,
        item.dance_name_odia,
        item.pose_name,
        item.pose_name_odia,
        item.explanation,
        item.explanation_odia,
      ];

      return values
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [dancePoses, normalizedSearch]);

  const filteredPhrases = useMemo(() => {
    if (!normalizedSearch) return phrases;

    return phrases.filter((phrase) => {
      const item = phrase as any;

      const values = [
        item.english_phrase,
        item.odia_translation,
        item.category,
        item.category_odia,
      ];

      return values
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [phrases, normalizedSearch]);

  const filteredRituals = useMemo(() => {
    if (!normalizedSearch) return rituals;

    return rituals.filter((ritual) => {
      const item = ritual as any;

      const values = [
        item.title,
        item.title_odia,
        item.region,
        item.region_odia,
        item.description,
        item.description_odia,
        item.cultural_significance,
        item.cultural_significance_odia,
        item.practices,
        item.practices_odia,
      ];

      return values
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [rituals, normalizedSearch]);

  const filteredBattles = useMemo(() => {
    if (!normalizedSearch) return BATTLES;

    return BATTLES.filter((battle) =>
      [
        battle.title,
        battle.region,
        battle.period,
        battle.description,
        battle.significance,
        battle.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  const filteredExtinctDistricts =
    useMemo(() => {
      if (!normalizedSearch) {
        return EXTINCT_DISTRICTS;
      }

      return EXTINCT_DISTRICTS.filter(
        (district) =>
          [
            district.title,
            district.region,
            district.period,
            district.description,
            district.significance,
            district.type,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch)
      );
    }, [normalizedSearch]);

  /* =========================================================
     AUDIO
  ========================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setPlayingSong(null);
    setPlayingPhrase(null);
  };

  const playAudio = (
    url: string | null | undefined,
    type: "song" | "phrase",
    id: number
  ) => {
    stopAudio();

    const cleanUrl =
      typeof url === "string"
        ? url.trim()
        : "";

    if (!cleanUrl) return;

    const audio = new Audio();

    audio.preload = "auto";
    audio.src = cleanUrl;

    audioRef.current = audio;

    const reset = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSong(null);
      setPlayingPhrase(null);
    };

    audio.onended = reset;

    audio.onerror = () => {
      console.warn(
        "Unable to load audio:",
        cleanUrl
      );

      reset();
    };

    if (type === "song") {
      setPlayingSong(id);
    } else {
      setPlayingPhrase(id);
    }

    audio.play().catch(() => {
      reset();
    });
  };

  const playSong = (song: Song) => {
    const id = Number(song.id);

    if (playingSong === id) {
      stopAudio();
      return;
    }

    playAudio(song.audio, "song", id);
  };

  const playPhrase = (
    phrase: LanguagePhrase
  ) => {
    const id = Number(phrase.id);

    if (playingPhrase === id) {
      stopAudio();
      return;
    }

    playAudio(
      phrase.audio,
      "phrase",
      id
    );
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (translatorTimerRef.current) {
        clearTimeout(
          translatorTimerRef.current
        );
      }
    };
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const clearSearch = () => {
    setSearch("");
  };

  const changeSection = (
    section: LearnSection
  ) => {
    setActiveSection(section);
    setSearch("");
    stopAudio();

    if (section !== "language") {
      setTranslatorInput("");
      setTranslatorOutput("");
      setTranslatorError("");
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case "songs":
        return isOdia
          ? "ସଙ୍ଗୀତ, କଳାକାର କିମ୍ବା ଅଞ୍ଚଳ ଖୋଜନ୍ତୁ..."
          : "Search songs, artists or regions...";

      case "dance":
        return isOdia
          ? "ନୃତ୍ୟ କିମ୍ବା ଭଙ୍ଗୀ ଖୋଜନ୍ତୁ..."
          : "Search dances or poses...";

      case "language":
        return isOdia
          ? "ଶବ୍ଦ କିମ୍ବା ବାକ୍ୟ ଖୋଜନ୍ତୁ..."
          : "Search words or phrases...";

      case "rituals":
        return isOdia
          ? "ପରମ୍ପରା କିମ୍ବା ଅଞ୍ଚଳ ଖୋଜନ୍ତୁ..."
          : "Search rituals or regions...";

      case "battles":
        return isOdia
          ? "ଯୁଦ୍ଧ କିମ୍ବା ସ୍ଥାନ ଖୋଜନ୍ତୁ..."
          : "Search battles or places...";

      case "extinct-districts":
        return isOdia
          ? "ଜିଲ୍ଲା କିମ୍ବା ଅଞ୍ଚଳ ଖୋଜନ୍ତୁ..."
          : "Search districts or regions...";

      default:
        return "Search...";
    }
  };

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  const renderEmptyState = () => (
    <div className="col-span-full border border-dashed border-[#c4c7c7] dark:border-[#4a4642] py-20 text-center">
      <Search className="w-10 h-10 mx-auto mb-5 text-[#747878]" />

      <h3 className="font-display text-2xl">
        {text.noResults}
      </h3>

      <p className="mt-2 text-sm text-[#747878] dark:text-[#aaa39c]">
        {text.tryAnother}
      </p>

      {search && (
        <button
          onClick={clearSearch}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94492d]"
        >
          {text.clearSearch}
        </button>
      )}
    </div>
  );

  /* =========================================================
     TRANSLATOR
  ========================================================= */

  const renderTranslator = () => (
    <div className="mb-14">
      <div className="relative overflow-hidden border border-[#c9c2ba] dark:border-[#49423d] bg-[#f3eee7] dark:bg-[#201d1a]">
        {/* Decorative background */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-[#94492d]/10" />

        <div className="absolute -right-10 -bottom-20 w-48 h-48 rounded-full border border-[#94492d]/10" />

        <div className="relative p-7 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#94492d] dark:text-[#d58b6e]">
                <Languages className="w-5 h-5" />

                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">
                  {text.translateTitle}
                </span>
              </div>

              <h3 className="font-display text-3xl md:text-4xl mt-3">
                {text.translateSubtitle}
              </h3>
            </div>

            <div className="px-4 py-2 border border-[#c9c2ba] dark:border-[#49423d] text-[10px] uppercase tracking-[0.12em] font-bold text-[#747878]">
              Gemini AI
            </div>
          </div>

          <div className="mt-8 grid lg:grid-cols-[1fr_auto_1fr] items-center gap-5">
            {/* English */}
            <div>
              <label className="block mb-2 text-[10px] uppercase tracking-[0.14em] font-bold text-[#747878]">
                {isOdia ? "ଇଂରାଜୀ" : "English"}
              </label>

              <div className="relative">
                <input
                  value={translatorInput}
                  onChange={(event) =>
                    setTranslatorInput(
                      event.target.value
                    )
                  }
                  type="text"
                  maxLength={300}
                  placeholder={
                    text.translatePlaceholder
                  }
                  className="w-full h-16 pl-5 pr-12 border border-[#c4c7c7] dark:border-[#4a4642] bg-white dark:bg-[#171513] text-lg outline-none focus:border-[#94492d] transition-colors"
                />

                {translatorInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setTranslatorInput("");
                      setTranslatorOutput("");
                      setTranslatorError("");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#94492d]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <p className="mt-2 text-[11px] text-[#747878]">
                {translatorInput
                  ? `${translatorInput.trim().split(/\s+/).length}/8 words`
                  : text.maxWords}
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex w-12 h-12 rounded-full bg-[#94492d] text-white items-center justify-center shadow-lg">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Odia */}
            <div>
              <label className="block mb-2 text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d]">
                {text.translationResult}
              </label>

              <div className="min-h-16 border border-[#c4c7c7] dark:border-[#4a4642] bg-white dark:bg-[#171513] px-5 flex items-center">
                {translatorLoading ? (
                  <div className="flex items-center gap-3 text-[#94492d]">
                    <div className="w-5 h-5 border-2 border-[#d9d6cf] border-t-[#94492d] rounded-full animate-spin" />

                    <span className="text-sm">
                      {text.translating}
                    </span>
                  </div>
                ) : translatorOutput ? (
                  <span className="font-display text-2xl md:text-3xl">
                    {translatorOutput}
                  </span>
                ) : (
                  <span className="text-sm text-[#aaa39c]">
                    {isOdia
                      ? "ଅନୁବାଦ ଏଠାରେ ଦେଖାଯିବ..."
                      : "Translation will appear here..."}
                  </span>
                )}
              </div>
            </div>
          </div>

          {translatorError && (
            <div className="mt-5 px-4 py-3 border border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-900 text-sm text-red-700 dark:text-red-300">
              {translatorError}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* =========================================================
     SONGS
  ========================================================= */

  const renderSongs = () => (
    <div>
      <SectionHeading
        icon={<Music className="w-5 h-5" />}
        title={text.songsTitle}
        description={text.songsDescription}
        archiveLabel={text.archive}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSongs.length === 0
          ? renderEmptyState()
          : filteredSongs.map((song) => {
              const item = song as any;

              return (
                <article
                  key={song.id}
                  className="group border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-[#ece9e2] dark:bg-[#12100f] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title_odia || item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-10 h-10 text-[#94492d]" />
                      </div>
                    )}

                    {item.audio && (
                      <button
                        onClick={() => playSong(song)}
                        className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-[#faf9f5] dark:bg-[#1c1917] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                        aria-label={playingSong === Number(song.id) ? "Pause song" : "Play song"}
                      >
                        {playingSong === Number(song.id) ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between gap-3 mb-3">
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d]">
                        {isOdia
                          ? item.genre_odia || item.genre
                          : item.genre}
                      </span>

                      {item.region && (
                        <span className="flex items-center gap-1 text-[11px] text-[#747878]">
                          <MapPin className="w-3 h-3" />
                          {isOdia
                            ? item.region_odia || item.region
                            : item.region}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl">
                      {isOdia
                        ? item.title_odia || item.title
                        : item.title}
                    </h3>

                    {item.artist && (
                      <p className="mt-2 text-sm text-[#747878]">
                        {isOdia
                          ? item.artist_odia || item.artist
                          : item.artist}
                      </p>
                    )}

                    {(item.cultural_context ||
                      item.cultural_context_odia) && (
                      <p className="mt-4 text-sm leading-6 text-[#444748] dark:text-[#c8c1ba]">
                        {isOdia
                          ? item.cultural_context_odia ||
                            item.cultural_context
                          : item.cultural_context}
                      </p>
                    )}

                    {item.youtube_url && (
                      <a
                        href={item.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] font-bold text-[#94492d]"
                      >
                        YouTube
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
      </div>
    </div>
  );

  /* =========================================================
     DANCE
  ========================================================= */

  const renderDance = () => (
    <div>
      <SectionHeading
        icon={<Sparkles className="w-5 h-5" />}
        title={text.danceTitle}
        description={text.danceDescription}
        archiveLabel={text.archive}
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDance.length === 0
          ? renderEmptyState()
          : filteredDance.map((dance) => {
              const item = dance as any;

              const danceName = isOdia
                ? item.dance_name_odia ||
                  item.dance_name
                : item.dance_name;

              const poseName = isOdia
                ? item.pose_name_odia ||
                  item.pose_name
                : item.pose_name;

              const explanation = isOdia
                ? item.explanation_odia ||
                  item.explanation
                : item.explanation;

              return (
                <article
                  key={dance.id}
                  className="group bg-white dark:bg-[#201d1a] border border-[#d9d6cf] dark:border-[#3d3935] overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] bg-[#ece9e2] dark:bg-[#12100f] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={poseName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-[#94492d]" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d]">
                      {danceName ||
                        text.dance}
                    </span>

                    <h3 className="font-display text-2xl mt-2">
                      {poseName ||
                        text.dance}
                    </h3>

                    {explanation && (
                      <p className="mt-3 text-sm leading-6 text-[#444748] dark:text-[#c8c1ba]">
                        {explanation}
                      </p>
                    )}

                    {item.tutorial_link && (
                      <a
                        href={
                          item.tutorial_link
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 bg-[#94492d] hover:bg-[#7e3c25] text-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em]"
                      >
                        <Play className="w-3.5 h-3.5" />

                        {text.tutorial}

                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
      </div>
    </div>
  );

  /* =========================================================
     LANGUAGE
  ========================================================= */

  const renderLanguage = () => (
    <div>
      <SectionHeading
        icon={<Languages className="w-5 h-5" />}
        title={text.languageTitle}
        description={text.languageDescription}
        archiveLabel={text.archive}
      />

      {/* GEMINI TRANSLATOR */}
      {renderTranslator()}

      {/* EXISTING PHRASES */}
      <div className="border-t border-[#d9d6cf] dark:border-[#3d3935]">
        {filteredPhrases.length === 0
          ? renderEmptyState()
          : filteredPhrases.map(
              (phrase) => {
                const item = phrase as any;

                return (
                  <div
                    key={phrase.id}
                    className="grid md:grid-cols-[1fr_1fr_auto] gap-6 items-center py-6 border-b border-[#d9d6cf] dark:border-[#3d3935]"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d]">
                        {isOdia
                          ? item.category_odia ||
                            item.category
                          : item.category}
                      </span>

                      <p className="mt-2 text-lg">
                        {item.english_phrase}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#747878]">
                        {text.odia}
                      </span>

                      <p className="mt-2 text-xl">
                        {item.odia_translation}
                      </p>
                    </div>

                    {item.audio && (
                      <button
                        onClick={() =>
                          playPhrase(
                            phrase
                          )
                        }
                        className="w-11 h-11 border border-[#c4c7c7] dark:border-[#4a4642] flex items-center justify-center hover:bg-[#94492d] hover:text-white transition-colors"
                      >
                        {playingPhrase ===
                        Number(
                          phrase.id
                        ) ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                );
              }
            )}
      </div>
    </div>
  );

  /* =========================================================
     RITUALS
  ========================================================= */

  const renderRituals = () => (
    <div>
      <SectionHeading
        icon={<BookOpen className="w-5 h-5" />}
        title={text.ritualsTitle}
        description={text.ritualsDescription}
        archiveLabel={text.archive}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {filteredRituals.length === 0
          ? renderEmptyState()
          : filteredRituals.map(
              (ritual) => {
                const item = ritual as any;

                return (
                  <article
                    key={ritual.id}
                    className="border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a] overflow-hidden hover:shadow-xl transition-all"
                  >
                    {item.image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={item.image}
                          alt={
                            isOdia
                              ? item.title_odia ||
                                item.title
                              : item.title
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-7">
                      <div className="flex justify-between gap-4">
                        <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d]">
                          {isOdia
                            ? item.title_odia ||
                              item.title
                            : item.title}
                        </span>

                        {item.region && (
                          <span className="flex items-center gap-1 text-[11px] text-[#747878]">
                            <MapPin className="w-3 h-3" />
                            {isOdia
                              ? item.region_odia ||
                                item.region
                              : item.region}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-2xl mt-3">
                        {isOdia
                          ? item.title_odia ||
                            item.title
                          : item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-4 text-sm leading-7 text-[#444748] dark:text-[#c8c1ba]">
                          {isOdia
                            ? item.description_odia ||
                              item.description
                            : item.description}
                        </p>
                      )}

                      {item.cultural_significance && (
                        <div className="mt-6 pt-5 border-t border-[#dedbd5] dark:border-[#3d3935]">
                          <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d]">
                            {isOdia
                              ? "ସାଂସ୍କୃତିକ ଗୁରୁତ୍ୱ"
                              : "Cultural Significance"}
                          </span>

                          <p className="mt-2 text-sm leading-6">
                            {isOdia
                              ? item.cultural_significance_odia ||
                                item.cultural_significance
                              : item.cultural_significance}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              }
            )}
      </div>
    </div>
  );

  /* =========================================================
     BATTLES
     
     SEPARATE PAGE/TAB
     NOT PART OF RITUALS
  ========================================================= */

  const renderBattles = () => (
    <div>
      <HistoricalHero
        icon={<Swords className="w-6 h-6" />}
        eyebrow={text.history}
        title={text.battlesTitle}
        description={text.battlesDescription}
        accent="battle"
      />

      <div className="mt-10 grid lg:grid-cols-2 gap-7">
        {filteredBattles.length === 0
          ? renderEmptyState()
          : filteredBattles.map(
              (battle, index) => (
                <article
                  key={battle.id}
                  className="group relative bg-white dark:bg-[#201d1a] border border-[#d9d6cf] dark:border-[#3d3935] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#94492d]/40"
                >
                  {/* Top line */}
                  <div className="h-1.5 bg-[#94492d]" />

                  {/* Number */}
                  <div className="absolute right-7 top-7 text-7xl font-display text-[#94492d]/10 select-none">
                    0{index + 1}
                  </div>

                  <div className="relative p-7 md:p-9">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-bold text-[#94492d]">
                        <Shield className="w-3.5 h-3.5" />
                        {battle.type}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-[#747878]">
                        <MapPin className="w-3.5 h-3.5" />
                        {battle.region}
                      </span>
                    </div>

                    <h3 className="font-display text-4xl md:text-5xl mt-7 leading-tight">
                      {battle.title}
                    </h3>

                    <div className="mt-7 flex items-center gap-3">
                      <div className="w-10 h-10 border border-[#d9d6cf] dark:border-[#4a4642] flex items-center justify-center">
                        <CalendarDays className="w-4 h-4 text-[#94492d]" />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#747878]">
                          {text.period}
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {battle.period}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-7 border-t border-[#dedbd5] dark:border-[#3d3935]">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#94492d]">
                        {isOdia
                          ? "ଘଟଣା"
                          : "The Event"}
                      </p>

                      <p className="mt-3 text-sm md:text-base leading-7 text-[#444748] dark:text-[#c8c1ba]">
                        {battle.description}
                      </p>
                    </div>

                    <div className="mt-7 p-5 bg-[#f4f1eb] dark:bg-[#171513] border-l-2 border-[#94492d]">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#94492d]" />

                        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#94492d]">
                          {text.significance}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#444748] dark:text-[#c8c1ba]">
                        {battle.significance}
                      </p>
                    </div>

                    <div className="mt-7 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d]">
                      <History className="w-4 h-4" />

                      {isOdia
                        ? "ଇତିହାସର ଏକ ଅଧ୍ୟାୟ"
                        : "A chapter in history"}

                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              )
            )}
      </div>
    </div>
  );

  /* =========================================================
     EXTINCT DISTRICTS
     
     SEPARATE PAGE/TAB
     NOT PART OF RITUALS
  ========================================================= */

  const renderExtinctDistricts = () => (
    <div>
      <HistoricalHero
        icon={<MapPinned className="w-6 h-6" />}
        eyebrow={text.administrativeHistory}
        title={text.extinctTitle}
        description={text.extinctDescription}
        accent="district"
      />

      {/* Intro strip */}
      <div className="mt-10 border border-[#d9d6cf] dark:border-[#3d3935] bg-[#efeeea] dark:bg-[#12100f] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-14 h-14 shrink-0 border border-[#c4c7c7] dark:border-[#4a4642] flex items-center justify-center">
            <MapPinned className="w-6 h-6 text-[#94492d]" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#94492d]">
              {isOdia
                ? "ପ୍ରଶାସନିକ ପରିବର୍ତ୍ତନ"
                : "Administrative Change"}
            </p>

            <p className="mt-2 text-sm md:text-base leading-7 text-[#555856] dark:text-[#c8c1ba]">
              {isOdia
                ? "ପୁରୁଣା ଜିଲ୍ଲା ସୀମାକୁ ବୁଝିବା ଆଜିର ଓଡ଼ିଶାର ପ୍ରଶାସନିକ ମାନଚିତ୍ରକୁ ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ।"
                : "Understanding former district boundaries helps explain the administrative map of Odisha today."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-7">
        {filteredExtinctDistricts.length === 0
          ? renderEmptyState()
          : filteredExtinctDistricts.map(
              (district, index) => (
                <article
                  key={district.id}
                  className="group relative bg-white dark:bg-[#201d1a] border border-[#d9d6cf] dark:border-[#3d3935] overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:border-[#94492d]/40 transition-all duration-500"
                >
                  {/* Decorative top */}
                  <div className="h-1.5 bg-[#94492d]" />

                  <div className="relative p-7 md:p-9">
                    <div className="absolute right-7 top-7">
                      <div className="w-12 h-12 rounded-full border border-[#94492d]/20 flex items-center justify-center">
                        <span className="font-display text-lg text-[#94492d]">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] font-bold text-[#94492d]">
                      <MapPinned className="w-4 h-4" />
                      {district.type}
                    </div>

                    <h3 className="font-display text-3xl md:text-4xl mt-6 max-w-[80%] leading-tight">
                      {district.title}
                    </h3>

                    <div className="mt-7 grid sm:grid-cols-2 gap-4">
                      <div className="border border-[#dedbd5] dark:border-[#3d3935] p-4">
                        <div className="flex items-center gap-2 text-[#747878]">
                          <MapPin className="w-4 h-4" />

                          <span className="text-[9px] uppercase tracking-[0.14em] font-bold">
                            {text.region}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold">
                          {district.region}
                        </p>
                      </div>

                      <div className="border border-[#dedbd5] dark:border-[#3d3935] p-4">
                        <div className="flex items-center gap-2 text-[#747878]">
                          <Clock3 className="w-4 h-4" />

                          <span className="text-[9px] uppercase tracking-[0.14em] font-bold">
                            {text.period}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold">
                          {district.period}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 pt-7 border-t border-[#dedbd5] dark:border-[#3d3935]">
                      <p className="text-sm md:text-base leading-7 text-[#444748] dark:text-[#c8c1ba]">
                        {district.description}
                      </p>
                    </div>

                    <div className="mt-7 p-5 bg-[#f4f1eb] dark:bg-[#171513]">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#94492d]" />

                        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#94492d]">
                          {text.significance}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#555856] dark:text-[#c8c1ba]">
                        {district.significance}
                      </p>
                    </div>
                  </div>
                </article>
              )
            )}
      </div>
    </div>
  );

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#171513] text-[#1b1c1a] dark:text-[#f3eee7] transition-colors duration-300">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="border-b border-[#dedbd5] dark:border-[#35312e]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 md:py-24">
          <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#94492d]">
            {text.eyebrow}
          </span>

          <div className="max-w-4xl mt-6">
            <h1 className="font-display text-5xl md:text-7xl leading-[0.98] tracking-tight">
              {text.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base md:text-lg leading-8 text-[#444748] dark:text-[#c8c1ba]">
              {text.description}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <section className="sticky top-20 z-30 bg-[#faf9f5]/95 dark:bg-[#171513]/95 backdrop-blur-md border-b border-[#dedbd5] dark:border-[#35312e]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 overflow-x-auto">
          <div className="flex min-w-max">
            <LearnTab
              active={
                activeSection === "songs"
              }
              label={text.songs}
              icon={
                <Music className="w-4 h-4" />
              }
              onClick={() =>
                changeSection("songs")
              }
            />

            <LearnTab
              active={
                activeSection === "dance"
              }
              label={text.dance}
              icon={
                <Sparkles className="w-4 h-4" />
              }
              onClick={() =>
                changeSection("dance")
              }
            />

            <LearnTab
              active={
                activeSection === "language"
              }
              label={text.language}
              icon={
                <Languages className="w-4 h-4" />
              }
              onClick={() =>
                changeSection(
                  "language"
                )
              }
            />

            <LearnTab
              active={
                activeSection === "rituals"
              }
              label={text.rituals}
              icon={
                <BookOpen className="w-4 h-4" />
              }
              onClick={() =>
                changeSection("rituals")
              }
            />

            {/* NEW SEPARATE BATTLES TAB */}
            <LearnTab
              active={
                activeSection === "battles"
              }
              label={text.battles}
              icon={
                <Swords className="w-4 h-4" />
              }
              onClick={() =>
                changeSection("battles")
              }
            />

            {/* NEW SEPARATE DISTRICTS TAB */}
            <LearnTab
              active={
                activeSection ===
                "extinct-districts"
              }
              label={text.extinctDistricts}
              icon={
                <MapPinned className="w-4 h-4" />
              }
              onClick={() =>
                changeSection(
                  "extinct-districts"
                )
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-16">
        {/* Normal search */}
        {activeSection !==
          "battles" &&
          activeSection !==
            "extinct-districts" && (
            <div className="flex items-center gap-3 max-w-2xl mb-14">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747878]" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder={getSearchPlaceholder()}
                  className="w-full h-14 pl-11 pr-11 border border-[#c4c7c7] dark:border-[#4a4642] bg-white dark:bg-[#201d1a] outline-none focus:border-[#94492d] transition-colors placeholder:text-[#969998]"
                />

                {search && (
                  <button
                    onClick={
                      clearSearch
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#94492d]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

        {/* Historical search */}
        {(activeSection ===
          "battles" ||
          activeSection ===
            "extinct-districts") && (
          <div className="max-w-2xl mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747878]" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={getSearchPlaceholder()}
                className="w-full h-14 pl-11 pr-11 border border-[#c4c7c7] dark:border-[#4a4642] bg-white dark:bg-[#201d1a] outline-none focus:border-[#94492d] transition-colors"
              />

              {search && (
                <button
                  onClick={
                    clearSearch
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#d9d6cf] dark:border-[#4a4642] border-t-[#94492d] rounded-full animate-spin" />

            <p className="mt-5 text-sm text-[#747878]">
              {isOdia
                ? "ଐତିହ୍ୟ ତଥ୍ୟ ଲୋଡ୍ ହେଉଛି..."
                : "Loading heritage knowledge..."}
            </p>
          </div>
        ) : (
          <>
            {activeSection ===
              "songs" &&
              renderSongs()}

            {activeSection ===
              "dance" &&
              renderDance()}

            {activeSection ===
              "language" &&
              renderLanguage()}

            {activeSection ===
              "rituals" &&
              renderRituals()}

            {/* COMPLETELY SEPARATE */}
            {activeSection ===
              "battles" &&
              renderBattles()}

            {/* COMPLETELY SEPARATE */}
            {activeSection ===
              "extinct-districts" &&
              renderExtinctDistricts()}
          </>
        )}
      </section>

      {/* =====================================================
          FOOTER STRIP
      ===================================================== */}

      <section className="border-t border-[#dedbd5] dark:border-[#35312e] bg-[#efeeea] dark:bg-[#12100f]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-12">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 border border-[#c4c7c7] dark:border-[#4a4642] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#94492d]" />
            </div>

            <div>
              <p className="font-display text-xl">
                HeritageHub
              </p>

              <p className="text-xs text-[#747878] mt-1">
                {isOdia
                  ? "ଓଡ଼ିଶାର ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ ଓ ପ୍ରଚାର"
                  : "Preserving and sharing Odisha's heritage"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

/* =========================================================
   LEARN TAB
========================================================= */

interface LearnTabProps {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const LearnTab: React.FC<LearnTabProps> = ({
  active,
  label,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 md:px-6 py-5 text-[10px] md:text-[11px] uppercase tracking-[0.12em] font-bold border-b-2 transition-all whitespace-nowrap ${
        active
          ? "border-[#94492d] text-[#94492d] dark:text-[#d58b6e]"
          : "border-transparent text-[#747878] dark:text-[#aaa39c] hover:text-[#1b1c1a] dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

/* =========================================================
   SECTION HEADING
========================================================= */

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  archiveLabel: string;
}

const SectionHeading: React.FC<
  SectionHeadingProps
> = ({
  icon,
  title,
  description,
  archiveLabel,
}) => {
  return (
    <div className="mb-10 md:flex md:items-end md:justify-between gap-8">
      <div>
        <div className="flex items-center gap-2 text-[#94492d] dark:text-[#d58b6e] mb-4">
          {icon}

          <span className="text-[10px] uppercase tracking-[0.15em] font-bold">
            {archiveLabel}
          </span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm md:text-base leading-7 text-[#747878] dark:text-[#aaa39c]">
          {description}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   HISTORICAL HERO
========================================================= */

interface HistoricalHeroProps {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accent: "battle" | "district";
}

const HistoricalHero: React.FC<
  HistoricalHeroProps
> = ({
  icon,
  eyebrow,
  title,
  description,
  accent,
}) => {
  const isBattle = accent === "battle";

  return (
    <div className="relative overflow-hidden border border-[#d9d6cf] dark:border-[#3d3935] bg-gradient-to-br from-[#f5f0e8] via-[#f0ede7] to-[#e7dfd5] dark:from-[#211d1a] dark:via-[#201d1a] dark:to-[#171513] shadow-[0_20px_60px_rgba(80,45,30,0.08)]">
      {/* Decorative lines */}
      <div className="absolute inset-y-0 right-0 w-1/3 opacity-30 pointer-events-none">
        <div className="absolute right-[-100px] top-[-100px] w-[360px] h-[360px] rounded-full border border-[#94492d]" />

        <div className="absolute right-[-40px] top-[-40px] w-[240px] h-[240px] rounded-full border border-[#94492d]" />
      </div>

      <div className="relative p-8 md:p-12 lg:p-14">
        <div className="flex items-center gap-3 text-[#94492d]">
          <div className="w-10 h-10 border border-[#94492d]/30 flex items-center justify-center">
            {icon}
          </div>

          <span className="text-[10px] uppercase tracking-[0.17em] font-bold">
            {eyebrow}
          </span>
        </div>

        <div className="max-w-4xl mt-7">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            {title}
          </h2>

          <p className="mt-7 max-w-2xl text-base md:text-lg leading-8 text-[#555856] dark:text-[#c8c1ba]">
            {description}
          </p>
        </div>

        <div className="mt-9 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] font-bold text-[#747878]">
          {isBattle ? (
            <>
              <Swords className="w-4 h-4 text-[#94492d]" />
              Odisha · Historical Battles
            </>
          ) : (
            <>
              <MapPinned className="w-4 h-4 text-[#94492d]" />
              Odisha · Administrative History
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;