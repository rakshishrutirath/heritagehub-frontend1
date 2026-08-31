import React, { useEffect, useMemo, useRef, useState } from "react";

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
  ArrowRight,
  Loader2,
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

type LearnSection = "songs" | "dance" | "language" | "rituals";

interface LearnPageProps {
  timeline?: unknown[];
  exhibitions?: unknown[];
  artifacts?: unknown[];
  onSelectArtifact?: (artifact: any) => void;
}

interface HistoricalLearnItem {
  id: string;
  type: "battle" | "extinct_district";
  title: string;
  titleOr: string;
  region: string;
  regionOr: string;
  period: string;
  periodOr: string;
  description: string;
  descriptionOr: string;
  significance: string;
  significanceOr: string;
}

/*
 * Historical content shown inside Learn -> Rituals.
 * The former-district entries describe older administrative
 * configurations that were later reorganised, rather than
 * claiming that the modern districts themselves disappeared.
 */
const historicalLearnItems: HistoricalLearnItem[] = [
  {
    id: "battle-kalinga-war",
    type: "battle",
    title: "Kalinga War",
    titleOr: "କଳିଙ୍ଗ ଯୁଦ୍ଧ",
    region: "Kalinga",
    regionOr: "କଳିଙ୍ଗ",
    period: "261 BCE",
    periodOr: "ଖ୍ରୀଷ୍ଟପୂର୍ବ ୨୬୧",
    description:
      "In 261 BCE, Ashoka of the Mauryan Empire invaded Kalinga. The war was devastating and became a major turning point in Ashoka's life and policy.",
    descriptionOr:
      "ଖ୍ରୀଷ୍ଟପୂର୍ବ ୨୬୧ ମସିହାରେ ମୌର୍ଯ୍ୟ ସମ୍ରାଟ ଅଶୋକ କଳିଙ୍ଗ ଉପରେ ଆକ୍ରମଣ କରିଥିଲେ। ଏହି ଯୁଦ୍ଧର ଭୟାବହ ପରିଣାମ ଅଶୋକଙ୍କ ଜୀବନ ଓ ନୀତିରେ ଏକ ବଡ଼ ପରିବର୍ତ୍ତନ ଆଣିଥିଲା।",
    significance:
      "The Kalinga War is one of the defining events in Odisha's ancient history and is closely associated with Ashoka's turn toward Buddhism and Dhamma.",
    significanceOr:
      "କଳିଙ୍ଗ ଯୁଦ୍ଧ ଓଡ଼ିଶାର ପ୍ରାଚୀନ ଇତିହାସର ଏକ ପ୍ରମୁଖ ଘଟଣା। ଏହା ଅଶୋକଙ୍କ ବୌଦ୍ଧ ଧର୍ମ ଓ ଧମ୍ମ ଦିଗକୁ ପରିବର୍ତ୍ତନ ସହିତ ଜଡ଼ିତ।",
  },
  {
    id: "battle-paika-rebellion",
    type: "battle",
    title: "Paika Rebellion",
    titleOr: "ପାଇକ ବିଦ୍ରୋହ",
    region: "Khordha and surrounding areas",
    regionOr: "ଖୋର୍ଦ୍ଧା ଓ ଆଖପାଖ ଅଞ୍ଚଳ",
    period: "1817–1818",
    periodOr: "୧୮୧୭–୧୮୧୮",
    description:
      "The Paika Rebellion began in Khordha in 1817 and spread to other parts of Odisha. Paikas and other local groups resisted East India Company rule under leaders including Bakshi Jagabandhu.",
    descriptionOr:
      "୧୮୧୭ ମସିହାରେ ଖୋର୍ଦ୍ଧାରୁ ପାଇକ ବିଦ୍ରୋହ ଆରମ୍ଭ ହୋଇ ଓଡ଼ିଶାର ଅନ୍ୟ ଅଞ୍ଚଳକୁ ବ୍ୟାପିଥିଲା। ବକ୍ସି ଜଗବନ୍ଧୁଙ୍କ ସମେତ ବିଭିନ୍ନ ନେତାଙ୍କ ଅଧୀନରେ ପାଇକ ଓ ସ୍ଥାନୀୟ ଲୋକମାନେ ଇଷ୍ଟ ଇଣ୍ଡିଆ କମ୍ପାନୀର ଶାସନକୁ ପ୍ରତିରୋଧ କରିଥିଲେ।",
    significance:
      "It remains a major chapter in Odisha's history of resistance to British rule, with Khordha as an important centre of the uprising.",
    significanceOr:
      "ଏହା ବ୍ରିଟିଶ ଶାସନ ବିରୋଧରେ ଓଡ଼ିଶାର ପ୍ରତିରୋଧ ଇତିହାସର ଏକ ପ୍ରମୁଖ ଅଧ୍ୟାୟ। ଖୋର୍ଦ୍ଧା ଏହି ବିଦ୍ରୋହର ଏକ ମୁଖ୍ୟ କେନ୍ଦ୍ର ଥିଲା।",
  },
  {
    id: "former-koraput-district",
    type: "extinct_district",
    title: "Undivided Koraput District",
    titleOr: "ଅବିଭକ୍ତ କୋରାପୁଟ ଜିଲ୍ଲା",
    region: "Southern Odisha",
    regionOr: "ଦକ୍ଷିଣ ଓଡ଼ିଶା",
    period: "Before the 1992 reorganisation",
    periodOr: "୧୯୯୨ ପୁନର୍ଗଠନ ପୂର୍ବରୁ",
    description:
      "The historic Koraput district was much larger than the present-day district. In 1992, the district was reorganised and four new districts were created from its territory: Koraput, Malkangiri, Nabarangapur and Rayagada.",
    descriptionOr:
      "ଐତିହାସିକ କୋରାପୁଟ ଜିଲ୍ଲା ବର୍ତ୍ତମାନର କୋରାପୁଟ ଜିଲ୍ଲାଠାରୁ ଅଧିକ ବିସ୍ତୃତ ଥିଲା। ୧୯୯୨ ମସିହାରେ ଏହାର ପୁନର୍ଗଠନ ହୋଇ କୋରାପୁଟ, ମାଲକାନଗିରି, ନବରଙ୍ଗପୁର ଓ ରାୟଗଡ଼ା ଜିଲ୍ଲା ଗଠିତ ହୋଇଥିଲା।",
    significance:
      "The former extent of Koraput helps explain the modern administrative map of southern Odisha.",
    significanceOr:
      "ପୁରୁଣା କୋରାପୁଟ ଜିଲ୍ଲାର ବିସ୍ତୃତି ଦକ୍ଷିଣ ଓଡ଼ିଶାର ଆଧୁନିକ ପ୍ରଶାସନିକ ମାନଚିତ୍ର କିପରି ଗଠିତ ହେଲା ତାହା ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ।",
  },
  {
    id: "former-sambalpur-district",
    type: "extinct_district",
    title: "Undivided Sambalpur District",
    titleOr: "ଅବିଭକ୍ତ ସମ୍ବଲପୁର ଜିଲ୍ଲା",
    region: "Western Odisha",
    regionOr: "ପଶ୍ଚିମ ଓଡ଼ିଶା",
    period: "Before the 1993 reorganisation",
    periodOr: "୧୯୯୩ ପୁନର୍ଗଠନ ପୂର୍ବରୁ",
    description:
      "The erstwhile Sambalpur district covered a much larger area. During the 1992–1994 district reorganisation, its territory was divided and new districts including Bargarh, Jharsuguda and Deogarh were formed.",
    descriptionOr:
      "ପୂର୍ବତନ ସମ୍ବଲପୁର ଜିଲ୍ଲା ଏକ ବହୁତ ବଡ଼ ଅଞ୍ଚଳକୁ ଆବୃତ କରୁଥିଲା। ୧୯୯୨–୧୯୯୪ ମସିହାର ଜିଲ୍ଲା ପୁନର୍ଗଠନ ସମୟରେ ଏହାର ଅଞ୍ଚଳ ବିଭାଜିତ ହୋଇ ବରଗଡ଼, ଝାରସୁଗୁଡ଼ା ଓ ଦେବଗଡ଼ ଭଳି ନୂତନ ଜିଲ୍ଲା ଗଠିତ ହୋଇଥିଲା।",
    significance:
      "The history of undivided Sambalpur shows how western Odisha's present districts emerged from earlier administrative boundaries.",
    significanceOr:
      "ଅବିଭକ୍ତ ସମ୍ବଲପୁରର ଇତିହାସ ପଶ୍ଚିମ ଓଡ଼ିଶାର ବର୍ତ୍ତମାନର ଜିଲ୍ଲାଗୁଡ଼ିକ ପୁରୁଣା ପ୍ରଶାସନିକ ସୀମାରୁ କିପରି ଗଠିତ ହେଲା ତାହା ଦର୍ଶାଏ।",
  },
  {
    id: "former-puri-district",
    type: "extinct_district",
    title: "Old Puri District",
    titleOr: "ପୁରୁଣା ପୁରୀ ଜିଲ୍ଲା",
    region: "Central Odisha",
    regionOr: "ମଧ୍ୟ ଓଡ଼ିଶା",
    period: "Before the 1990s reorganisation",
    periodOr: "୧୯୯୦ ଦଶକର ପୁନର୍ଗଠନ ପୂର୍ବରୁ",
    description:
      "The old Puri district included areas that later became separate districts. The historic district was reorganised into Puri, Khordha and Nayagarh administrative units.",
    descriptionOr:
      "ପୁରୁଣା ପୁରୀ ଜିଲ୍ଲାରେ ଏମିତି ଅନେକ ଅଞ୍ଚଳ ଥିଲା ଯେଉଁଗୁଡ଼ିକ ପରେ ଅଲଗା ଜିଲ୍ଲା ହୋଇଥିଲା। ପୁରୁଣା ଜିଲ୍ଲାର ପୁନର୍ଗଠନ ପରେ ପୁରୀ, ଖୋର୍ଦ୍ଧା ଓ ନୟାଗଡ଼ ଭଳି ପ୍ରଶାସନିକ ଏକକ ଗଠିତ ହୋଇଥିଲା।",
    significance:
      "Old Puri is useful for understanding how central Odisha's administrative boundaries changed over time.",
    significanceOr:
      "ପୁରୁଣା ପୁରୀର ଇତିହାସ ମଧ୍ୟ ଓଡ଼ିଶାର ପ୍ରଶାସନିକ ସୀମା ସମୟ ସହିତ କିପରି ବଦଳିଲା ତାହା ବୁଝିବାରେ ଉପଯୋଗୀ।",
  },
  {
    id: "former-ganjam-paralakhemundi",
    type: "extinct_district",
    title: "Former Ganjam Administrative Extent",
    titleOr: "ପୂର୍ବତନ ଗଞ୍ଜାମ ପ୍ରଶାସନିକ ବିସ୍ତୃତି",
    region: "Southern Odisha",
    regionOr: "ଦକ୍ଷିଣ ଓଡ଼ିଶା",
    period: "Before the 1992 reorganisation",
    periodOr: "୧୯୯୨ ପୁନର୍ଗଠନ ପୂର୍ବରୁ",
    description:
      "Before the 1992 district reorganisation, Ganjam included the Parlakhemundi subdivision. Seven blocks of that subdivision were separated and the new Gajapati district was formed.",
    descriptionOr:
      "୧୯୯୨ ମସିହାର ଜିଲ୍ଲା ପୁନର୍ଗଠନ ପୂର୍ବରୁ ଗଞ୍ଜାମ ଜିଲ୍ଲାରେ ପାରଳାଖେମୁଣ୍ଡି ଉପଖଣ୍ଡ ଅନ୍ତର୍ଭୁକ୍ତ ଥିଲା। ଏହି ଉପଖଣ୍ଡର ସାତଟି ବ୍ଲକ୍ ଅଲଗା କରାଯାଇ ଗଜପତି ଜିଲ୍ଲା ଗଠିତ ହୋଇଥିଲା।",
    significance:
      "This reorganisation is an important example of how southern Odisha's modern district structure developed.",
    significanceOr:
      "ଏହି ପୁନର୍ଗଠନ ଦକ୍ଷିଣ ଓଡ଼ିଶାର ଆଧୁନିକ ଜିଲ୍ଲା ଗଠନ କିପରି ବିକଶିତ ହେଲା ତାହାର ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଉଦାହରଣ।",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export const LearnPage: React.FC<LearnPageProps> = () => {
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
  const [search, setSearch] = useState("");

  const [playingSong, setPlayingSong] =
    useState<number | null>(null);

  const [playingPhrase, setPlayingPhrase] =
    useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* =========================================================
     ENGLISH → ODIA TRANSLATOR
  ========================================================= */

  const [translatorInput, setTranslatorInput] =
    useState("");

  const [translatorOutput, setTranslatorOutput] =
    useState("");

  const [translatorLoading, setTranslatorLoading] =
    useState(false);

  const [translatorError, setTranslatorError] =
    useState("");

  const translatorTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Translate English text using the Django backend.
   *
   * Backend:
   * POST /api/learn/translate/
   *
   * Example:
   * hello → ନମସ୍କାର
   */
  const translateEnglishToOdia = async (
    value: string
  ) => {
    const cleanText = value.trim();

    if (!cleanText) {
      setTranslatorOutput("");
      setTranslatorError("");
      setTranslatorLoading(false);
      return;
    }

    /*
     * Your backend currently supports maximum 8 words.
     */
    const wordCount = cleanText.split(/\s+/).length;

    if (wordCount > 8) {
      setTranslatorOutput("");
      setTranslatorError(
        isOdia
          ? "ଦୟାକରି ସର୍ବାଧିକ ୮ଟି ଶବ୍ଦ ଲେଖନ୍ତୁ।"
          : "Please enter a maximum of 8 words."
      );
      setTranslatorLoading(false);
      return;
    }

    setTranslatorLoading(true);
    setTranslatorError("");

    try {
      const result = await api.translateToOdia(
        cleanText
      );

      if (
        result &&
        result.odia_translation
      ) {
        setTranslatorOutput(
          result.odia_translation.trim()
        );
      } else {
        setTranslatorOutput("");
        setTranslatorError(
          isOdia
            ? "ଅନୁବାଦ ମିଳିଲା ନାହିଁ।"
            : "Translation was not returned."
        );
      }
    } catch (error) {
      console.error(
        "English to Odia translation failed:",
        error
      );

      setTranslatorOutput("");

      setTranslatorError(
        isOdia
          ? "ଅନୁବାଦ କରିବାରେ ସମସ୍ୟା ହେଲା।"
          : "Unable to translate. Please try again."
      );
    } finally {
      setTranslatorLoading(false);
    }
  };

  /*
   * Automatically translate while typing.
   *
   * We wait 600ms after the user stops typing before
   * calling the backend. This prevents a Gemini request
   * for every single letter.
   */
  useEffect(() => {
    if (translatorTimerRef.current) {
      clearTimeout(translatorTimerRef.current);
    }

    const cleanText = translatorInput.trim();

    if (!cleanText) {
      setTranslatorOutput("");
      setTranslatorError("");
      setTranslatorLoading(false);
      return;
    }

    translatorTimerRef.current = setTimeout(() => {
      translateEnglishToOdia(cleanText);
    }, 600);

    return () => {
      if (translatorTimerRef.current) {
        clearTimeout(translatorTimerRef.current);
      }
    };
  }, [translatorInput, isOdia]);

  /*
   * Allow Enter key to translate immediately.
   */
  const handleTranslatorKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (translatorTimerRef.current) {
        clearTimeout(translatorTimerRef.current);
      }

      translateEnglishToOdia(translatorInput);
    }
  };

  const clearTranslator = () => {
    setTranslatorInput("");
    setTranslatorOutput("");
    setTranslatorError("");

    if (translatorTimerRef.current) {
      clearTimeout(translatorTimerRef.current);
    }
  };

  /*
   * Dynamic Odia translation cache.
   */
  const [odiaCache, setOdiaCache] = useState<
    Record<string, string>
  >(() => {
    try {
      const saved = localStorage.getItem(
        "heritagehub_learn_odia_cache"
      );

      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [translationBusy, setTranslationBusy] =
    useState(false);

  const normalizeOdiaKey = (value: string) =>
    value
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const localOdiaMap: Record<string, string> = {
    "youtube": "ୟୁଟ୍ୟୁବ",
    "heritagehub archive":
      "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ",
    "heritagehub": "ହେରିଟେଜ୍ ହବ୍",
    "songs": "ସଙ୍ଗୀତ",
    "song": "ସଙ୍ଗୀତ",
    "dance": "ନୃତ୍ୟ",
    "language": "ଭାଷା",
    "rituals": "ପରମ୍ପରା",
    "ritual": "ପରମ୍ପରା",
    "culture": "ସଂସ୍କୃତି",
    "greetings": "ଅଭିବାଦନ",
    "everyday": "ଦୈନନ୍ଦିନ",
    "family": "ପରିବାର",
    "food": "ଖାଦ୍ୟ",
    "travel": "ଭ୍ରମଣ",
    "numbers": "ସଂଖ୍ୟା",
    "sentences": "ବାକ୍ୟ",

    "sambalpuri": "ସମ୍ବଲପୁରୀ",
    "koraputia": "କୋରାପୁଟିଆ",
    "santali": "ସାନ୍ତାଳୀ",
    "bhajan": "ଭଜନ",
    "folk": "ଲୋକସଙ୍ଗୀତ",
    "folk song": "ଲୋକସଙ୍ଗୀତ",
    "devotional": "ଭକ୍ତିମୂଳକ",
    "traditional": "ପାରମ୍ପରିକ",
    "tribal": "ଆଦିବାସୀ",
    "odia": "ଓଡ଼ିଆ",
    "odissi": "ଓଡ଼ିଶୀ",

    "odisha": "ଓଡ଼ିଶା",
    "sambalpur": "ସମ୍ବଲପୁର",
    "puri": "ପୁରୀ",
    "koraput": "କୋରାପୁଟ",
    "cuttack": "କଟକ",
    "bhubaneswar": "ଭୁବନେଶ୍ୱର",
    "khordha": "ଖୋର୍ଦ୍ଧା",
    "khurda": "ଖୋର୍ଦ୍ଧା",
    "mayurbhanj": "ମୟୂରଭଞ୍ଜ",
    "rayagada": "ରାୟଗଡ଼ା",
    "kalahandi": "କଳାହାଣ୍ଡି",
    "bargarh": "ବରଗଡ଼",
    "ganjam": "ଗଞ୍ଜାମ",
    "balasore": "ବାଲେଶ୍ୱର",
    "kendrapara": "କେନ୍ଦ୍ରାପଡ଼ା",

    "alta makhi": "ଅଲତା ମାଖି",
    "chi chi re nani": "ଛି ଛି ରେ ନାନୀ",
    "hisid halay hoy": "ହିସିଦ ହାଲାୟ ହୋୟ",
    "jaga to kala ranga":
      "ଜଗା ତୋ କଳା ରଙ୍ଗ",
    "keshari loo": "କେଶରୀ ଲୋ",

    "pankaj tandi": "ପଙ୍କଜ ତାଣ୍ଡି",
    "pratham kumbhar": "ପ୍ରଥମ କୁମ୍ଭାର",
    "kiran dash": "କିରଣ ଦାଶ",
    "bijay anand sahu":
      "ବିଜୟ ଆନନ୍ଦ ସାହୁ",
    "satya adhikari":
      "ସତ୍ୟ ଅଧିକାରୀ",
    "uday hansda": "ଉଦୟ ହାଁସଦା",
    "sumita soren": "ସୁମିତା ସୋରେନ",

    "odissi dance": "ଓଡ଼ିଶୀ ନୃତ୍ୟ",
    "sambalpuri dance":
      "ସମ୍ବଲପୁରୀ ନୃତ୍ୟ",
    "dhemsa dance": "ଢେମସା ନୃତ୍ୟ",
    "dhemsa": "ଢେମସା",
    "baitha": "ବୈଠା",
    "boitha": "ବୈଠା",
    "chowka": "ଚୌକା",
    "chauka": "ଚୌକା",
    "tribhangi": "ତ୍ରିଭଙ୍ଗୀ",
    "sampada": "ସମ୍ପଦା",

    "hello": "ନମସ୍କାର",
    "thank you": "ଧନ୍ୟବାଦ",
    "good morning": "ସୁପ୍ରଭାତ",
    "welcome to odisha":
      "ଓଡ଼ିଶାକୁ ସ୍ୱାଗତ",
    "one": "ଏକ",
    "rice": "ଭାତ",
  };

  const getLocalOdia = (
    value?: string | null
  ) => {
    if (!value) return "";

    const key = normalizeOdiaKey(value);

    return (
      localOdiaMap[key] ||
      odiaCache[key] ||
      ""
    );
  };

  const toOdia = (
    value?: string | null
  ) => {
    if (!value) return "";

    if (!isOdia) return value;

    const translated = getLocalOdia(value);

    return translated || value;
  };

  const saveTranslation = (
    english: string,
    odia: string
  ) => {
    const key = normalizeOdiaKey(english);

    setOdiaCache((current) => {
      if (current[key] === odia) {
        return current;
      }

      const next = {
        ...current,
        [key]: odia,
      };

      try {
        localStorage.setItem(
          "heritagehub_learn_odia_cache",
          JSON.stringify(next)
        );
      } catch {
        // Ignore localStorage errors.
      }

      return next;
    });
  };

  /* =========================================================
     TRANSLATIONS
  ========================================================= */

  const text = {
    eyebrow: isOdia
      ? "ଓଡ଼ିଶାକୁ ଜାଣନ୍ତୁ"
      : "DISCOVER ODISHA",

    title: isOdia
      ? "ଓଡ଼ିଶାର ଜୀବନ୍ତ ଐତିହ୍ୟ ଶିଖନ୍ତୁ"
      : "Learn Odisha's Living Heritage",

    description: isOdia
      ? "ଓଡ଼ିଶାର ସଙ୍ଗୀତ, ନୃତ୍ୟ, ଭାଷା ଓ ପାରମ୍ପରିକ ଆଚାର ବିଷୟରେ ଜାଣନ୍ତୁ।"
      : "Discover the music, dance, languages and traditional practices that keep Odisha's cultural heritage alive.",

    songs: isOdia ? "ସଙ୍ଗୀତ" : "Songs",

    dance: isOdia ? "ନୃତ୍ୟ" : "Dance",

    language: isOdia ? "ଭାଷା" : "Language",

    rituals: isOdia
      ? "ପରମ୍ପରା"
      : "Rituals",

    songsTitle: isOdia
      ? "ଓଡ଼ିଶାର ସଙ୍ଗୀତ"
      : "Songs of Odisha",

    songsDescription: isOdia
      ? "ଓଡ଼ିଶାର ବିଭିନ୍ନ ଅଞ୍ଚଳର ପାରମ୍ପରିକ ସଙ୍ଗୀତ ଶୁଣନ୍ତୁ।"
      : "Listen to traditional music preserved from communities across Odisha.",

    danceTitle: isOdia
      ? "ଓଡ଼ିଶାର ନୃତ୍ୟ"
      : "Dance Traditions",

    danceDescription: isOdia
      ? "ଓଡ଼ିଶାର ଶାସ୍ତ୍ରୀୟ ଓ ଲୋକନୃତ୍ୟର ଭଙ୍ଗୀ ଏବଂ ପରମ୍ପରା ଜାଣନ୍ତୁ।"
      : "Explore classical and folk dance forms, movements and traditions.",

    languageTitle: isOdia
      ? "ଭାଷା ଶିଖନ୍ତୁ"
      : "Learn the Language",

    languageDescription: isOdia
      ? "ଦୈନନ୍ଦିନ ବ୍ୟବହାର ପାଇଁ ସରଳ ଓଡ଼ିଆ ଶବ୍ଦ ଏବଂ ବାକ୍ୟ ଶିଖନ୍ତୁ।"
      : "Learn useful words and phrases from Odisha's languages.",

    ritualsTitle: isOdia
      ? "ପରମ୍ପରା ଓ ଆଚାର"
      : "Rituals & Practices",

    ritualsDescription: isOdia
      ? "ଓଡ଼ିଶାର ସମୁଦାୟମାନଙ୍କ ମଧ୍ୟରେ ପ୍ରଚଳିତ ପାରମ୍ପରିକ ଆଚାର ଓ ପ୍ରଥା ଜାଣନ୍ତୁ।"
      : "Discover traditional rituals and community practices preserved across Odisha.",

    battles: isOdia
      ? "ଯୁଦ୍ଧ"
      : "Battles",

    battlesDescription: isOdia
      ? "ଓଡ଼ିଶାର ଇତିହାସକୁ ପ୍ରଭାବିତ କରିଥିବା ପ୍ରମୁଖ ଯୁଦ୍ଧ ଓ ପ୍ରତିରୋଧ ବିଷୟରେ ଜାଣନ୍ତୁ।"
      : "Explore major battles and resistance movements that shaped Odisha's history.",

    extinctDistricts: isOdia
      ? "ବିଲୁପ୍ତ ଜିଲ୍ଲା"
      : "Extinct Districts",

    extinctDistrictsDescription: isOdia
      ? "ପୁରୁଣା ପ୍ରଶାସନିକ ଜିଲ୍ଲା ଓ ସୀମାଗୁଡ଼ିକ କିପରି ପୁନର୍ଗଠିତ ହେଲା ତାହା ଜାଣନ୍ତୁ।"
      : "Explore former administrative districts and how Odisha's boundaries evolved.",

    searchSongs: isOdia
      ? "ସଙ୍ଗୀତ, କଳାକାର କିମ୍ବା ଅଞ୍ଚଳ ଖୋଜନ୍ତୁ..."
      : "Search songs, artists or regions...",

    searchDance: isOdia
      ? "ନୃତ୍ୟ କିମ୍ବା ଭଙ୍ଗୀ ଖୋଜନ୍ତୁ..."
      : "Search dances or poses...",

    searchLanguage: isOdia
      ? "ଶବ୍ଦ କିମ୍ବା ବାକ୍ୟ ଖୋଜନ୍ତୁ..."
      : "Search words or phrases...",

    searchRituals: isOdia
      ? "ପରମ୍ପରା, ଯୁଦ୍ଧ କିମ୍ବା ଜିଲ୍ଲା ଖୋଜନ୍ତୁ..."
      : "Search rituals, battles or districts...",

    noResults: isOdia
      ? "କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ"
      : "No results found",

    tryAnother: isOdia
      ? "ଅନ୍ୟ କିଛି ଖୋଜନ୍ତୁ।"
      : "Try another search.",

    clearSearch: isOdia
      ? "ଖୋଜା ସଫା କରନ୍ତୁ"
      : "Clear Search",

    loading: isOdia
      ? "ଐତିହ୍ୟ ତଥ୍ୟ ଲୋଡ୍ ହେଉଛି..."
      : "Loading heritage knowledge...",

    tutorial: isOdia
      ? "ଟ୍ୟୁଟୋରିଆଲ୍ ଦେଖନ୍ତୁ"
      : "Watch Tutorial",

    listen: isOdia
      ? "ଶୁଣନ୍ତୁ"
      : "Listen",

    pause: isOdia
      ? "ବିରତି"
      : "Pause",

    region: isOdia
      ? "ଅଞ୍ଚଳ"
      : "Region",

    culturalContext: isOdia
      ? "ସାଂସ୍କୃତିକ ପ୍ରସଙ୍ଗ"
      : "Cultural Context",

    english: isOdia
      ? "ଇଂରାଜୀ"
      : "English",

    odia: isOdia
      ? "ଓଡ଼ିଆ"
      : "Odia",

    preservedArchive: isOdia
      ? "ଡିଜିଟାଲ୍ ଐତିହ୍ୟ ଅଭିଲେଖ"
      : "Digital Heritage Archive",

    translatorTitle: isOdia
      ? "ଇଂରାଜୀ → ଓଡ଼ିଆ ଅନୁବାଦକ"
      : "English → Odia Translator",

    translatorDescription: isOdia
      ? "ଇଂରାଜୀ ଶବ୍ଦ କିମ୍ବା ଛୋଟ ବାକ୍ୟ ଲେଖନ୍ତୁ। AI ଏହାକୁ ଓଡ଼ିଆରେ ଅନୁବାଦ କରିବ।"
      : "Type an English word or short phrase and AI will translate it into Odia.",

    translatorPlaceholder: isOdia
      ? "ଇଂରାଜୀରେ ଲେଖନ୍ତୁ..."
      : "Type English here...",

    translate: isOdia
      ? "ଅନୁବାଦ କରନ୍ତୁ"
      : "Translate",

    translation: isOdia
      ? "ଓଡ଼ିଆ ଅନୁବାଦ"
      : "Odia Translation",

    translating: isOdia
      ? "ଅନୁବାଦ ହେଉଛି..."
      : "Translating...",
  };

  /* =========================================================
     FETCH DATA
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
            Array.isArray(
              songsResponse.value
            )
              ? songsResponse.value
              : []
          );
        }

        if (danceResponse.status === "fulfilled") {
          setDancePoses(
            Array.isArray(
              danceResponse.value
            )
              ? danceResponse.value
              : []
          );
        }

        if (
          languageResponse.status ===
          "fulfilled"
        ) {
          setPhrases(
            Array.isArray(
              languageResponse.value
            )
              ? languageResponse.value
              : []
          );
        }

        if (
          ritualsResponse.status ===
          "fulfilled"
        ) {
          setRituals(
            Array.isArray(
              ritualsResponse.value
            )
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
     AUTOMATIC ODIA TRANSLATION FOR BACKEND CONTENT
  ========================================================= */

  useEffect(() => {
    if (!isOdia || loading) return;

    const values = new Set<string>();

    const add = (value: unknown) => {
      if (typeof value !== "string") {
        return;
      }

      const trimmed = value.trim();

      if (!trimmed) return;

      const key =
        normalizeOdiaKey(trimmed);

      if (
        localOdiaMap[key] ||
        odiaCache[key]
      ) {
        return;
      }

      if (
        /^https?:\/\//i.test(trimmed) ||
        /^data:/i.test(trimmed) ||
        /\.(jpg|jpeg|png|webp|gif|mp3|wav|ogg|mp4)$/i.test(
          trimmed
        )
      ) {
        return;
      }

      values.add(trimmed);
    };

    songs.forEach((song) => {
      add(song.title);
      add(song.artist);
      add(song.genre);
      add(song.region);
      add(song.cultural_context);
    });

    dancePoses.forEach((dance) => {
      const item = dance as any;

      add(item.dance_type);
      add(item.category);
      add(item.name);
      add(item.title);
      add(item.pose_name);
      add(item.description);
      add(item.cultural_context);
      add(item.region);
    });

    rituals.forEach((ritual) => {
      const item = ritual as any;

      add(item.category);
      add(item.region);
      add(item.name);
      add(item.title);
      add(item.description);
      add(item.cultural_context);
      add(item.cultural_significance);
      add(item.practices);
    });

    const pending =
      Array.from(values);

    if (pending.length === 0) {
      return;
    }

    let cancelled = false;

    const translateAll = async () => {
      setTranslationBusy(true);

      const batchSize = 2;

      for (
        let index = 0;
        index < pending.length &&
        !cancelled;
        index += batchSize
      ) {
        const batch = pending.slice(
          index,
          index + batchSize
        );

        await Promise.all(
          batch.map(
            async (english) => {
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
              } catch (error) {
                console.error(
                  "Automatic Odia translation failed:",
                  english,
                  error
                );
              }
            }
          )
        );
      }

      if (!cancelled) {
        setTranslationBusy(false);
      }
    };

    translateAll();

    return () => {
      cancelled = true;
    };
  }, [
    isOdia,
    loading,
    songs,
    dancePoses,
    rituals,
  ]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredSongs = useMemo(() => {
    if (!normalizedSearch) {
      return songs;
    }

    return songs.filter((song) => {
      const searchable = [
        song.title,
        song.artist,
        song.genre,
        song.region,
        song.cultural_context,
        toOdia(song.title),
        toOdia(song.artist),
        toOdia(song.genre),
        toOdia(song.region),
        toOdia(song.cultural_context),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(
        normalizedSearch
      );
    });
  }, [
    songs,
    normalizedSearch,
    language,
    odiaCache,
  ]);

  const filteredDance = useMemo(() => {
    if (!normalizedSearch) {
      return dancePoses;
    }

    return dancePoses.filter(
      (dance) => {
        const rawValues =
          Object.values(dance).filter(
            (value) =>
              typeof value === "string" ||
              typeof value === "number"
          );

        const translatedValues =
          rawValues.map((value) =>
            typeof value === "string"
              ? toOdia(value)
              : value
          );

        const searchable = [
          ...rawValues,
          ...translatedValues,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(
          normalizedSearch
        );
      }
    );
  }, [
    dancePoses,
    normalizedSearch,
    language,
    odiaCache,
  ]);

  const filteredPhrases = useMemo(() => {
    if (!normalizedSearch) {
      return phrases;
    }

    return phrases.filter(
      (phrase) => {
        const searchable =
          Object.values(phrase)
            .filter(
              (value) =>
                typeof value ===
                  "string" ||
                typeof value === "number"
            )
            .join(" ")
            .toLowerCase();

        return searchable.includes(
          normalizedSearch
        );
      }
    );
  }, [phrases, normalizedSearch]);

  const filteredRituals = useMemo(() => {
    if (!normalizedSearch) {
      return rituals;
    }

    return rituals.filter(
      (ritual) => {
        const rawValues =
          Object.values(ritual).filter(
            (value) =>
              typeof value === "string" ||
              typeof value === "number"
          );

        const translatedValues =
          rawValues.map((value) =>
            typeof value === "string"
              ? toOdia(value)
              : value
          );

        const searchable = [
          ...rawValues,
          ...translatedValues,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(
          normalizedSearch
        );
      }
    );
  }, [
    rituals,
    normalizedSearch,
    language,
    odiaCache,
  ]);

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

    if (!cleanUrl) {
      return;
    }

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
        `Unable to load ${type} audio:`,
        cleanUrl
      );

      reset();
    };

    if (type === "song") {
      setPlayingSong(id);
    } else {
      setPlayingPhrase(id);
    }

    const playPromise =
      audio.play();

    if (
      playPromise !== undefined
    ) {
      playPromise.catch(() => {
        reset();
      });
    }
  };

  const playSong = (
    song: Song
  ) => {
    const id = Number(song.id);

    if (playingSong === id) {
      stopAudio();
      return;
    }

    playAudio(
      song.audio,
      "song",
      id
    );
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
    };
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getSearchPlaceholder =
    () => {
      switch (activeSection) {
        case "songs":
          return text.searchSongs;

        case "dance":
          return text.searchDance;

        case "language":
          return text.searchLanguage;

        case "rituals":
          return text.searchRituals;

        default:
          return "";
      }
    };

  const clearSearch = () => {
    setSearch("");
  };

  const changeSection = (
    section: LearnSection
  ) => {
    setActiveSection(section);
    setSearch("");
    stopAudio();
  };

  const renderEmptyState = () => (
    <div className="col-span-full border border-dashed border-[#c4c7c7] dark:border-[#4a4642] py-20 text-center bg-[#faf9f5] dark:bg-[#171513]">
      <Search className="w-9 h-9 mx-auto mb-5 text-[#747878] dark:text-[#aaa39c]" />

      <h3 className="font-display text-2xl text-[#1b1c1a] dark:text-[#f3eee7]">
        {text.noResults}
      </h3>

      <p className="mt-2 text-sm text-[#747878] dark:text-[#aaa39c]">
        {text.tryAnother}
      </p>

      {search && (
        <button
          onClick={clearSearch}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94492d] dark:text-[#d58b6e]"
        >
          {text.clearSearch}
        </button>
      )}
    </div>
  );

  /* =========================================================
     SONGS
  ========================================================= */

  const renderSongs = () => (
    <div>
      <SectionHeading
        icon={
          <Music className="w-5 h-5" />
        }
        title={text.songsTitle}
        description={
          text.songsDescription
        }
        archiveLabel={
          isOdia
            ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ"
            : "HeritageHub Archive"
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSongs.length === 0
          ? renderEmptyState()
          : filteredSongs.map(
              (song) => (
                <article
                  key={song.id}
                  className="group border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-[#ece9e2] dark:bg-[#12100f] overflow-hidden">
                    {song.image ? (
                      <img
                        src={song.image}
                        alt={toOdia(
                          song.title
                        )}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-10 h-10 text-[#94492d]" />
                      </div>
                    )}

                    {song.audio && (
                      <button
                        onClick={() =>
                          playSong(song)
                        }
                        className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-[#faf9f5] dark:bg-[#1c1917] text-[#1b1c1a] dark:text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        {playingSong ===
                        Number(
                          song.id
                        ) ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                        {song.genre
                          ? toOdia(
                              song.genre
                            )
                          : text.songs}
                      </span>

                      {song.region && (
                        <span className="flex items-center gap-1 text-[11px] text-[#747878] dark:text-[#aaa39c]">
                          <MapPin className="w-3 h-3" />
                          {toOdia(
                            song.region
                          )}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-[#1b1c1a] dark:text-[#f3eee7]">
                      {toOdia(
                        song.title
                      )}
                    </h3>

                    {song.artist && (
                      <p className="mt-2 text-sm text-[#747878] dark:text-[#aaa39c]">
                        {toOdia(
                          song.artist
                        )}
                      </p>
                    )}

                    {song.cultural_context && (
                      <p className="mt-4 text-sm leading-6 text-[#444748] dark:text-[#c8c1ba]">
                        {toOdia(
                          song.cultural_context
                        )}
                      </p>
                    )}

                    {song.youtube_url && (
                      <a
                        href={
                          song.youtube_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] font-bold text-[#94492d] dark:text-[#d58b6e]"
                      >
                        YouTube

                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              )
            )}
      </div>
    </div>
  );

  /* =========================================================
     DANCE
  ========================================================= */

  const renderDance = () => (
    <div>
      <SectionHeading
        icon={
          <Sparkles className="w-5 h-5" />
        }
        title={text.danceTitle}
        description={
          text.danceDescription
        }
        archiveLabel={
          isOdia
            ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ"
            : "HeritageHub Archive"
        }
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDance.length === 0
          ? renderEmptyState()
          : filteredDance.map(
              (dance) => {
                const item =
                  dance as any;

                return (
                  <article
                    key={dance.id}
                    className="group bg-white dark:bg-[#201d1a] border border-[#d9d6cf] dark:border-[#3d3935] overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[4/5] bg-[#ece9e2] dark:bg-[#12100f] overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={toOdia(
                            item.name ||
                              item.title ||
                              (isOdia
                                ? "ନୃତ୍ୟ"
                                : "Dance")
                          )}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-[#94492d]" />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                        {toOdia(
                          item.dance_type ||
                            item.category ||
                            text.dance
                        )}
                      </span>

                      <h3 className="font-display text-2xl mt-2 text-[#1b1c1a] dark:text-[#f3eee7]">
                        {toOdia(
                          item.name ||
                            item.title ||
                            item.pose_name ||
                            text.dance
                        )}
                      </h3>

                      {(
                        item.description ||
                        item.cultural_context
                      ) && (
                        <p className="mt-3 text-sm leading-6 text-[#444748] dark:text-[#c8c1ba]">
                          {toOdia(
                            item.description ||
                              item.cultural_context
                          )}
                        </p>
                      )}

                      {(
                        item.tutorial_url ||
                        item.youtube_url ||
                        item.tutorial_link
                      ) && (
                        <a
                          href={
                            item.tutorial_url ||
                            item.youtube_url ||
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
              }
            )}
      </div>
    </div>
  );

  /* =========================================================
     LANGUAGE
  ========================================================= */

  const renderLanguage = () => (
    <div>

      {/* =====================================================
          ENGLISH → ODIA AI TRANSLATOR
      ===================================================== */}

      <div className="mb-14 border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a] p-6 md:p-8 shadow-sm">

        <div className="flex items-start gap-4 mb-6">

          <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-[#94492d] text-white">
            <Languages className="w-5 h-5" />
          </div>

          <div>
            <h3 className="font-display text-2xl md:text-3xl text-[#1b1c1a] dark:text-[#f3eee7]">
              {text.translatorTitle}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#747878] dark:text-[#aaa39c]">
              {text.translatorDescription}
            </p>
          </div>

        </div>

        {/* INPUT */}

        <div className="relative">

          <input
            type="text"
            value={translatorInput}
            onChange={(event) =>
              setTranslatorInput(
                event.target.value
              )
            }
            onKeyDown={
              handleTranslatorKeyDown
            }
            placeholder={
              text.translatorPlaceholder
            }
            maxLength={300}
            className="w-full h-14 pl-5 pr-14 border border-[#c4c7c7] dark:border-[#4a4642] bg-[#faf9f5] dark:bg-[#171513] text-[#1b1c1a] dark:text-[#f3eee7] outline-none focus:border-[#94492d] dark:focus:border-[#d58b6e] transition-colors placeholder:text-[#969998] dark:placeholder:text-[#77716c]"
          />

          {translatorInput && (
            <button
              type="button"
              onClick={
                clearTranslator
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#94492d]"
              aria-label="Clear translator"
            >
              <X className="w-5 h-5" />
            </button>
          )}

        </div>

        {/* TRANSLATE BUTTON */}

        <div className="mt-4 flex justify-end">

          <button
            type="button"
            onClick={() =>
              translateEnglishToOdia(
                translatorInput
              )
            }
            disabled={
              translatorLoading ||
              !translatorInput.trim()
            }
            className="inline-flex items-center gap-2 bg-[#94492d] hover:bg-[#7e3c25] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors"
          >

            {translatorLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />

                {text.translating}
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />

                {text.translate}

                <ArrowRight className="w-4 h-4" />
              </>
            )}

          </button>

        </div>

        {/* TRANSLATION RESULT */}

        {translatorOutput && (
          <div className="mt-6 border-t border-[#d9d6cf] dark:border-[#3d3935] pt-6">

            <div className="grid md:grid-cols-2 gap-6">

              {/* ENGLISH */}

              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#747878] dark:text-[#aaa39c]">
                  {text.english}
                </span>

                <p className="mt-2 text-lg text-[#1b1c1a] dark:text-[#f3eee7]">
                  {translatorInput}
                </p>
              </div>

              {/* ODIA */}

              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                  {text.translation}
                </span>

                <p className="mt-2 text-2xl font-medium text-[#1b1c1a] dark:text-[#f3eee7]">
                  {translatorOutput}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ERROR */}

        {translatorError && (
          <div className="mt-5 text-sm text-red-600 dark:text-red-400">
            {translatorError}
          </div>
        )}

      </div>

      {/* =====================================================
          EXISTING LANGUAGE SECTION
      ===================================================== */}

      <SectionHeading
        icon={
          <Languages className="w-5 h-5" />
        }
        title={text.languageTitle}
        description={
          text.languageDescription
        }
        archiveLabel={
          isOdia
            ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ"
            : "HeritageHub Archive"
        }
      />

      <div className="border-t border-[#d9d6cf] dark:border-[#3d3935]">

        {filteredPhrases.length === 0
          ? renderEmptyState()
          : filteredPhrases.map(
              (phrase) => {
                const item =
                  phrase as any;

                return (
                  <div
                    key={phrase.id}
                    className="grid md:grid-cols-[1fr_1fr_auto] gap-6 items-center py-6 border-b border-[#d9d6cf] dark:border-[#3d3935]"
                  >

                    <div>

                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">

                        {isOdia
                          ? toOdia(
                              item.category ||
                                "sentences"
                            )
                          : item.category ||
                            text.english}

                      </span>

                      <p className="mt-2 text-lg text-[#1b1c1a] dark:text-[#f3eee7]">

                        {isOdia
                          ? item.odia_translation ||
                            item.translation ||
                            toOdia(
                              item.english_phrase ||
                                item.english ||
                                ""
                            )
                          : item.english_phrase ||
                            item.english ||
                            ""}

                      </p>

                    </div>

                    <div>

                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#747878] dark:text-[#aaa39c]">

                        {isOdia
                          ? "ଓଡ଼ିଆ ଅର୍ଥ"
                          : text.odia}

                      </span>

                      <p className="mt-2 text-xl text-[#1b1c1a] dark:text-[#f3eee7]">

                        {item.odia_translation ||
                          item.translation ||
                          ""}

                      </p>

                    </div>

                    {item.audio && (
                      <button
                        onClick={() =>
                          playPhrase(
                            phrase
                          )
                        }
                        className="w-11 h-11 border border-[#c4c7c7] dark:border-[#4a4642] flex items-center justify-center hover:bg-[#94492d] hover:text-white transition-colors text-[#1b1c1a] dark:text-[#f3eee7]"
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

  const renderRituals = () => {
    const battles = historicalLearnItems.filter(
      (item) => item.type === "battle"
    );

    const extinctDistricts = historicalLearnItems.filter(
      (item) => item.type === "extinct_district"
    );

    const matchesSearch = (item: HistoricalLearnItem) => {
      if (!normalizedSearch) return true;

      const searchable = [
        item.title,
        item.titleOr,
        item.region,
        item.regionOr,
        item.period,
        item.periodOr,
        item.description,
        item.descriptionOr,
        item.significance,
        item.significanceOr,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    };

    const renderHistoricalCard = (
      item: HistoricalLearnItem
    ) => (
      <article
        key={item.id}
        className="group border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="h-2 bg-[#94492d] dark:bg-[#d58b6e]" />

        <div className="p-7">
          <div className="flex items-start justify-between gap-4">
            <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
              {item.type === "battle"
                ? text.battles
                : text.extinctDistricts}
            </span>

            <span className="flex items-center gap-1 text-[11px] text-[#747878] dark:text-[#aaa39c] text-right">
              <MapPin className="w-3 h-3 shrink-0" />
              {isOdia ? item.regionOr : item.region}
            </span>
          </div>

          <h3 className="font-display text-2xl md:text-3xl mt-4 text-[#1b1c1a] dark:text-[#f3eee7]">
            {isOdia ? item.titleOr : item.title}
          </h3>

          <div className="mt-4">
            <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#747878] dark:text-[#aaa39c]">
              {isOdia ? "କାଳ" : "Period"}
            </span>

            <p className="mt-1 text-sm text-[#444748] dark:text-[#c8c1ba]">
              {isOdia ? item.periodOr : item.period}
            </p>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#444748] dark:text-[#c8c1ba]">
            {isOdia
              ? item.descriptionOr
              : item.description}
          </p>

          <div className="mt-6 pt-5 border-t border-[#d9d6cf] dark:border-[#3d3935]">
            <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
              {isOdia
                ? "ଗୁରୁତ୍ୱ"
                : "Significance"}
            </span>

            <p className="mt-2 text-sm leading-7 text-[#444748] dark:text-[#c8c1ba]">
              {isOdia
                ? item.significanceOr
                : item.significance}
            </p>
          </div>
        </div>
      </article>
    );

    const filteredHistoricalBattles = battles.filter(matchesSearch);
    const filteredHistoricalDistricts = extinctDistricts.filter(matchesSearch);

    return (
      <div>
        {/* EXISTING RITUALS */}
        <SectionHeading
          icon={<BookOpen className="w-5 h-5" />}
          title={text.ritualsTitle}
          description={text.ritualsDescription}
          archiveLabel={
            isOdia
              ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ"
              : "HeritageHub Archive"
          }
        />

        <div className="grid md:grid-cols-2 gap-6">
          {filteredRituals.length === 0
            ? renderEmptyState()
            : filteredRituals.map((ritual) => {
                const item = ritual as any;

                return (
                  <article
                    key={ritual.id}
                    className="border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a] overflow-hidden"
                  >
                    {item.image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={item.image}
                          alt={
                            isOdia
                              ? item.nameOr ||
                                item.titleOr ||
                                "ପରମ୍ପରା"
                              : item.name ||
                                item.title ||
                                "Ritual"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-7">
                      <div className="flex justify-between gap-4">
                        <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                          {isOdia
                            ? item.categoryOr ||
                              toOdia(item.category) ||
                              text.rituals
                            : item.category ||
                              text.rituals}
                        </span>

                        {item.region && (
                          <span className="flex items-center gap-1 text-[11px] text-[#747878] dark:text-[#aaa39c]">
                            <MapPin className="w-3 h-3" />
                            {toOdia(item.region)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-2xl mt-3 text-[#1b1c1a] dark:text-[#f3eee7]">
                        {isOdia
                          ? item.nameOr ||
                            item.titleOr ||
                            toOdia(
                              item.name ||
                                item.title ||
                                text.rituals
                            )
                          : item.name ||
                            item.title ||
                            text.rituals}
                      </h3>

                      {(item.description ||
                        item.cultural_context) && (
                        <p className="mt-4 text-sm leading-7 text-[#444748] dark:text-[#c8c1ba]">
                          {isOdia
                            ? item.descriptionOr ||
                              item.cultural_contextOr ||
                              toOdia(
                                item.description ||
                                  item.cultural_context
                              )
                            : item.description ||
                              item.cultural_context}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
        </div>

        {/* BATTLES */}
        <div className="mt-20">
          <SectionHeading
            icon={<Sparkles className="w-5 h-5" />}
            title={text.battles}
            description={text.battlesDescription}
            archiveLabel={
              isOdia
                ? "ଇତିହାସିକ ଅଭିଲେଖ"
                : "Historical Archive"
            }
          />

          <div className="grid md:grid-cols-2 gap-6">
            {filteredHistoricalBattles.length === 0
              ? renderEmptyState()
              : filteredHistoricalBattles.map(renderHistoricalCard)}
          </div>
        </div>

        {/* EXTINCT DISTRICTS */}
        <div className="mt-20">
          <SectionHeading
            icon={<MapPin className="w-5 h-5" />}
            title={text.extinctDistricts}
            description={text.extinctDistrictsDescription}
            archiveLabel={
              isOdia
                ? "ପ୍ରଶାସନିକ ଇତିହାସ"
                : "Administrative History"
            }
          />

          <div className="grid md:grid-cols-2 gap-6">
            {filteredHistoricalDistricts.length === 0
              ? renderEmptyState()
              : filteredHistoricalDistricts.map(renderHistoricalCard)}
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#171513] text-[#1b1c1a] dark:text-[#f3eee7] transition-colors duration-300">

      {/* HERO */}

      <section className="border-b border-[#dedbd5] dark:border-[#35312e]">

        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 md:py-24">

          <span className="label-caps text-[#94492d] dark:text-[#d58b6e]">
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

      {/* NAVIGATION */}

      <section className="sticky top-20 z-30 bg-[#faf9f5]/95 dark:bg-[#171513]/95 backdrop-blur-md border-b border-[#dedbd5] dark:border-[#35312e]">

        <div className="max-w-[1440px] mx-auto px-6 md:px-16 overflow-x-auto">

          <div className="flex min-w-max">

            <LearnTab
              active={
                activeSection ===
                "songs"
              }
              label={text.songs}
              icon={
                <Music className="w-4 h-4" />
              }
              onClick={() =>
                changeSection(
                  "songs"
                )
              }
            />

            <LearnTab
              active={
                activeSection ===
                "dance"
              }
              label={text.dance}
              icon={
                <Sparkles className="w-4 h-4" />
              }
              onClick={() =>
                changeSection(
                  "dance"
                )
              }
            />

            <LearnTab
              active={
                activeSection ===
                "language"
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
                activeSection ===
                "rituals"
              }
              label={text.rituals}
              icon={
                <BookOpen className="w-4 h-4" />
              }
              onClick={() =>
                changeSection(
                  "rituals"
                )
              }
            />

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-16">

        {/* EXISTING SEARCH */}

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
              placeholder={
                getSearchPlaceholder()
              }
              className="w-full h-14 pl-11 pr-11 border border-[#c4c7c7] dark:border-[#4a4642] bg-white dark:bg-[#201d1a] text-[#1b1c1a] dark:text-[#f3eee7] outline-none focus:border-[#94492d] dark:focus:border-[#d58b6e] transition-colors placeholder:text-[#969998] dark:placeholder:text-[#77716c]"
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

        {isOdia &&
          translationBusy &&
          !loading && (
            <div className="mb-6 text-[11px] font-semibold tracking-[0.08em] text-[#94492d] dark:text-[#d58b6e]">
              ବାକି ତଥ୍ୟଗୁଡ଼ିକ ଓଡ଼ିଆକୁ ରୂପାନ୍ତର ହେଉଛି...
            </div>
          )}

        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center">

            <div className="w-10 h-10 border-2 border-[#d9d6cf] dark:border-[#4a4642] border-t-[#94492d] rounded-full animate-spin" />

            <p className="mt-5 text-sm text-[#747878] dark:text-[#aaa39c]">
              {text.loading}
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
          </>
        )}

      </section>

      {/* FOOTER */}

      <section className="border-t border-[#dedbd5] dark:border-[#35312e] bg-[#efeeea] dark:bg-[#12100f]">

        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10 flex items-center gap-4">

          <div className="w-10 h-10 border border-[#c4c7c7] dark:border-[#4a4642] flex items-center justify-center">

            <BookOpen className="w-4 h-4 text-[#94492d] dark:text-[#d58b6e]" />

          </div>

          <div>

            <p className="font-display text-lg">
              {isOdia
                ? "ହେରିଟେଜ୍ ହବ୍"
                : "HeritageHub"}
            </p>

            <p className="text-xs text-[#747878] dark:text-[#aaa39c]">
              {text.preservedArchive}
            </p>

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

const LearnTab: React.FC<
  LearnTabProps
> = ({
  active,
  label,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-5 text-[11px] uppercase tracking-[0.12em] font-bold border-b-2 transition-all ${
        active
          ? "border-[#94492d] text-[#94492d] dark:text-[#d58b6e] dark:border-[#d58b6e]"
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

        <h2 className="font-display text-4xl md:text-5xl text-[#1b1c1a] dark:text-[#f3eee7]">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm md:text-base leading-7 text-[#747878] dark:text-[#aaa39c]">
          {description}
        </p>

      </div>

    </div>
  );
};

export default LearnPage;